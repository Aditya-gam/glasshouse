# CLAUDE.md — Glasshouse (spec hub)

> Project context for Claude Code. Read this first and follow the rules here in **every** session.

## What this is
A privacy-first web app that runs LLM **attribute-inference attacks on a user's own footprint** (self-audit), **measures** accuracy against the synthetic **SynthPAI** benchmark, then **rewrites/removes** content to break the inference and proves the confidence dropped. Three stages, end to end:

**Attack → Measure → Defend.**

The product's signature moment is the before/after: "home-location confidence 0.86 → 0.21 after editing 3 posts." That single delta is the demo, the eval, and the headline metric.

## Where we are
**Planning is COMPLETE.** This is the **hub repo** (`glasshouse`) — it holds the spec (`docs/`), the UI prototype (`prototype/`), and the ADRs. The code lives in two sibling repos, each with its own `CLAUDE.md` + rules:
- **`glasshouse-backend`** (`../glasshouse-backend`) — FastAPI · the Attack/Measure/Defend engine.
- **`glasshouse-frontend`** (`../glasshouse-frontend`) — Next.js · the UI (synced from `prototype/`).

**The spec is authoritative.** Build per `docs/11-roadmap/tasks-backend.md` + `tasks-frontend.md` (tracer bullet → M0–M7). Start at `docs/00-index.md` (the map of the whole doc set); consult `docs/00-traceability.md` (the change-trigger map) before any cross-cutting change.

## How we work (the build)
- **The docs are the source of truth** — implement against them; if reality diverges, update the doc so the spec stays current (note it per `00-traceability.md`).
- **One conventional commit per task** (`tasks-backend.md` / `tasks-frontend.md`). SDE-2/3 bar; `ruff`+`mypy --strict` / `tsc`+ESLint clean, and `/code-review` + `/security-review` before a task is done.
- **Calibrate to stakes** — ask the user on material/hard-to-reverse decisions; move efficiently on small/reversible ones. Honest about cost/feasibility; the user values straight analysis over reassurance.
- **Cost discipline:** free/local (Ollama, sentence-transformers, GeoNames, Presidio, pgvector, EXIF libs) for dev; the capable-LLM slots (Profiler, VLM, anonymizer, adversary, ambiguous-judge) are the only paid surface (`feasibility-and-cost.md`).

## Engineering standards (`.claude/rules/`)
Researched, cited standards that govern **both these docs and the implementation**. **Before writing docs or code in a domain, read its rule file and follow it.** One concise file (≤200 lines) per domain — each names the standard, what it means, and why:
`architecture` · `database` · `backend` · `api-design` · `frontend` · `security-privacy` · `infra-devops` · `testing` · `code-style`. Prompt standards live in `docs/04-ai-engine/prompts/conventions.md`. See `.claude/rules/README.md`.

## Locked decisions
- **Backend:** cloud, FastAPI (Python 3.12), PostgreSQL + pgvector + pgcrypto.
- **Auth:** Clerk (JWT verified via JWKS). **RBAC:** organizations + roles (`owner`/`admin`/`analyst`/`viewer`), shaped for the future exec/enterprise product.
- **Async-from-start:** every attack/eval/remediation run goes through the Redis job queue; the API returns a `run_id` and the client polls.
- **Subjects (v1):** self-audit profiles + SynthPAI only. **No arbitrary third-party profiles.**
- **Encryption:** per-user DEK (KMS-wrapped) + pgcrypto; crypto-shred on erasure.
- **Frontend:** Next.js.
- **Repos:** **3 public** — hub (`glasshouse`) + `glasshouse-backend` + `glasshouse-frontend` (polyrepo, ADR 0013). Hybrid deploy: GHA gates + Vercel/Railway native.
- **LLM provider:** **Anthropic** for the capable slots (via the LiteLLM proxy); provider-agnostic.

## Documentation index
**Start every session at `docs/00-index.md`** — the authoritative leaf-by-leaf map of the whole granular doc tree. Key subtrees:
- `docs/01-product/*` — problem/threat, personas, scope, positioning, success metrics, ethics
- `docs/02-architecture/*` — components, run lifecycle, trust boundaries, deployment, ADRs
- `docs/03-data/database/*` — schema, **ER diagram**, per-table files, encryption, RLS, retention; `docs/03-data/ingestion/*` — sources + third-party-drop
- `docs/04-ai-engine/*` — the Attack→Measure→Defend engine, `prompts/*`, `llm-gateway.md`, `research-sources.md`
- `docs/05-backend/*` — code layout, layers, modules, workers, gateway
- `docs/06-api/*` · `docs/07-frontend/*` · `docs/08-security-privacy/*` · `docs/09-infra-devops/*` · `docs/10-testing/*` · `docs/11-roadmap/*`
- `.claude/rules/*` — the engineering standards Claude must follow (governs docs **and** implementation)
- The original flat drafts (`architecture.md`, `database.md`, `backend-structure.md`, `product-spec.md`) are **archived** under `docs/archive/` (superseded; do not build from them).

## Stack & conventions
- FastAPI · SQLAlchemy 2.0 (async) + Alembic · `arq` (Redis) workers · pydantic v2 · `httpx`.
- Fully typed; `ruff` + `mypy` clean. Tests: `pytest` (+ `pytest-asyncio`).
- 12-factor config via env (`pydantic-settings`). **No secrets in code.**
- Conventional commits; one migration per schema change.

## CRITICAL security & privacy rules (non-negotiable)
1. **Never log** decrypted content, DEKs, or any prompt input containing user text.
2. Encryption keys are **always bound query parameters** — never string-interpolated into SQL (prevents key leakage into query logs).
3. The application DB role **cannot read `data_keys`**; decryption happens only through the `SECURITY DEFINER` function.
4. **Every** tenant query is scoped by user/org via RLS **and** app-layer checks. Never read `items`/`inferences`/`remediations` without a scope.
5. **Drop third-party-authored content at ingestion** (`is_subject_authored = false` → discard). It must never land in the DB.
6. **Special-category** inference outputs (e.g., `sex`) are stored **encrypted** and require **explicit Art. 9 consent**.
7. **No run executes** without a valid, non-revoked `consents` row covering the subject's user and purpose.
8. The cloud LLM is a **sub-processor**: only decrypted-in-memory content crosses to it, and that content is never logged or persisted by the gateway.

## The three stages → where the code lives
| Stage | Service | Worker | Writes |
|---|---|---|---|
| Attack | `services/inference.py` | `workers/attack.py` | `inferences`, `run_metrics` |
| Measure | `services/eval.py` | `workers/eval.py` | `eval_results` (vs SynthPAI) |
| Defend | `services/anonymize.py` | `workers/remediation.py` | `remediations` (+ re-attack) |

## Glossary
- **DEK** — per-user Data Encryption Key (stored only KMS-wrapped).
- **Crypto-shred** — delete the DEK to render all of a user's ciphertext unrecoverable.
- **PAI** — Personal Attribute Inference (the attack class this product audits).
- **SynthPAI** — synthetic, human-verified-labeled dataset used as the eval set.
- **Run** — one async unit of work: `attack` | `eval` | `remediation`.

## Commands (fill in during build)
```
make dev            # run api + worker + db
make test           # pytest
alembic upgrade head
arq app.workers.queue.WorkerSettings
```
