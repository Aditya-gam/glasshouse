# Backend Structure

> ⚠️ **SUPERSEDED / ARCHIVED.** Split into and replaced by the granular tree — see `05-backend/*` (authoritative: `overview.md` + `layout.md` + 16 per-module files + `error-model`/`config-and-secrets`/`observability`). Kept for historical provenance only; **do not build from this file.** Migration map: `00-index.md`.

The plan for the backend before any API contracts are written. Clean layering, async-first, with the three stages (attack/measure/defend) as services behind workers.

## Layout

```
backend/
  app/
    main.py                  # FastAPI app factory, lifespan, router mount
    config.py                # pydantic-settings; all env, no secrets in code
    deps.py                  # DI: db session, current_user, require_permission

    auth/
      clerk.py               # verify Clerk JWT via JWKS (cached keys)
      rbac.py                # permission matrix + require_permission(code)
      webhooks.py            # /webhooks/clerk: user.created/deleted, membership sync

    db/
      session.py             # async engine + session factory
      rls.py                 # SET LOCAL app.user_id / app.org_id per request
      crypto.py              # pgcrypto wrappers (bound-param), DEK unwrap via KMS
      models/                # SQLAlchemy models, grouped by aggregate
        identity.py          #   users, orgs, memberships, permissions
        keys.py              #   data_keys, consents
        content.py           #   profiles, import_sources, items, attributes
        runs.py              #   runs, inferences, eval_*, remediations, run_metrics, audit_log

    domain/                  # pure logic, NO IO (unit-testable in isolation)
      attributes.py          #   the 8 PAI attributes + special-category rules
      matching.py            #   predicted vs label matching (exact / semantic / geo)
      scoring.py             #   confidence aggregation, risk roll-up

    repositories/            # data access per aggregate (the only place SQL lives)
      items_repo.py
      runs_repo.py
      inferences_repo.py
      eval_repo.py
      remediations_repo.py
      consent_repo.py
      audit_repo.py

    services/                # use-cases; orchestrate repos + gateway; enforce rules
      ingestion.py           #   parse exports, DROP third-party, encrypt, store
      inference.py           #   ATTACK
      eval.py                #   MEASURE (against SynthPAI)
      anonymize.py           #   DEFEND (rewrite + re-attack)
      llm_gateway.py         #   sole LLM egress: routing, retries, metrics, parsing
      consent.py             #   consent gate before any run
      erasure.py             #   cascade delete + crypto-shred
      export.py              #   DSAR export bundle

    workers/
      queue.py               # arq WorkerSettings, idempotency, retry/backoff, DLQ
      attack.py
      eval.py
      remediation.py
      purge.py               # retention sweep over items.expires_at

    api/v1/                  # routers (designed in the NEXT phase)
    schemas/                 # pydantic v2 request/response DTOs

  migrations/                # alembic
  tests/
  pyproject.toml
```

## Dependency direction
`api → services → repositories → db`. `domain` is pure and depended on by services. `workers` call the same services as the API (no logic duplicated in workers). Nothing lower depends on anything higher.

## Key components

### Auth & RBAC (`auth/`)
- `clerk.py` caches JWKS and verifies the JWT signature/claims; extracts `clerk_user_id` (`sub`) and active `org_id`.
- `rbac.py` holds the static role→permission matrix and a `require_permission("run:create")` dependency. v1: a self-audit user is `owner` of their personal scope; the matrix is already complete for `admin/analyst/viewer`.
- `deps.py` resolves the internal `users.id`, opens a scoped DB session, and applies RLS GUCs.

### Crypto (`db/crypto.py`)
- `unwrap_dek(user_id)` → calls KMS to decrypt `wrapped_dek` (in memory only).
- `encrypt(text, dek)` / `decrypt(ct, dek)` → wrap `pgp_sym_*` with the DEK passed as a **bound parameter**; decryption routed through the `SECURITY DEFINER` function.
- Never logs keys or plaintext.

### LLM gateway (`services/llm_gateway.py`)
The single chokepoint to the model. Responsibilities:
- Provider abstraction (one place to swap/configure the model).
- **Structured output**: request + parse strict JSON for inferences/anonymizations; validate against a pydantic schema; repair/retry on malformed output.
- **Model routing**: cheap model for low-signal items, strong model for ambiguous ones.
- **Instrumentation**: emit `run_metrics` (tokens, cost, latency) for every call.
- **Resilience**: timeouts, retries with backoff, circuit-breaking.
- Treats all input as a sub-processor egress: no logging/persistence of content.

### Services = the three stages
- **`ingestion`**: parse X/Reddit/Takeout exports → normalize to `items` → **drop `is_subject_authored=false`** → embed → encrypt → store; set `expires_at`.
- **`inference` (Attack)**: load subject items (decrypt) → build attack prompt → gateway → persist `inferences` + evidence.
- **`eval` (Measure)**: run inference over SynthPAI → `matching` vs `eval_labels` → `eval_results` (top-1/top-3).
- **`anonymize` (Defend)**: take target items + current inferences → minimal rewrite/remove → **re-run inference** → persist `remediations` with `confidence_before/after`.
- **`consent`**: hard gate — no run starts without a valid consent row (and `special_category` consent when needed).

### Workers (`workers/`)
- `arq` over Redis. Each stage worker is a thin wrapper that calls its service.
- Idempotent enqueue via `runs.idempotency_key`; status transitions persisted; retries with backoff; DLQ on terminal failure.
- `purge.py` enforces retention.

## Cross-cutting

- **Config/secrets:** `pydantic-settings`; KMS key id, Clerk keys, DB/Redis URLs from env. Never in code.
- **Errors:** typed domain exceptions → mapped to HTTP problem responses at the API edge; workers convert to `runs.status='failed'` + `error`.
- **Observability:** `run_metrics` is the product's optimize loop; structured logs **exclude** content/keys; request + run IDs for tracing.
- **Migrations:** Alembic; one migration per schema change; `0001_init.sql` from the v2 design.

## Testing strategy
- **Unit:** `domain/` (matching, scoring, attribute rules) with no IO — fast, high coverage.
- **Service:** services with fake repos + a stubbed gateway (golden JSON fixtures).
- **Integration:** real test Postgres (pgvector/pgcrypto) + a small **SynthPAI fixture**; verify RLS isolation and crypto round-trip + crypto-shred.
- **Eval as a test target:** a CI job runs the eval stage on the SynthPAI fixture and asserts accuracy ≥ a floor, so prompt changes can't silently regress.

## Build order (recommended)
1. `config` + `db/session` + models + Alembic `0001`.
2. `auth` (Clerk verify) + `deps` + RLS.
3. `db/crypto` + crypto round-trip test.
4. `ingestion` (+ third-party drop test).
5. `llm_gateway` + `services/inference` (Attack).
6. `services/eval` + SynthPAI fixture + accuracy floor.
7. `services/anonymize` (Defend) + re-attack.
8. Workers + queue + idempotency.
9. **Then** design the API (`api/v1`) on top.
