# Roadmap — Backend Tasks (`backend` repo)

> **Depends on:** `tasks.md` (cross-repo map), `build-order.md`, `decisions/0013-polyrepo.md`, the `docs/` spec · **Version:** v1 (split from tasks.md)

Atomic, ordered, testable in isolation. `id — task — (⟵ needs) — [doc] — done`. **🔓 unblocks** flags the cross-repo gates the `frontend` repo waits on. The `backend` repo builds through **M4 with zero frontend dependency**; the repos sync at **M5.1 / M5.C** (the published OpenAPI contract). The API serves the **calibrated** shapes the prototype consumes (`07-frontend/prototype-mapping.md` → `06-api/schemas.md`: `AttributeRead`/`EvidenceRead`/`RemediationRead`, point+interval never raw); the `within_noise`/`cant_break` defend outcomes come from M3.4's real rule, not UI constants.

> **Sequencing (contract-first — chosen):** publish the OpenAPI contract **early** — do **M5.1 + M5.C right after M0.3 (the models)**, before M0–M4. The DTO shapes are frozen in `06-api/schemas.md`, so define them now and let stub endpoints return `501` until each engine milestone lands. This unblocks **FE/M5.4** after M0.3 (a brief M5.4 idle is accepted — models-first chosen); any DTO change during M1–M4 re-runs M5.C and the FE drift-guard flags staleness.

## Bootstrap
- [x] R1 — uv project (`pyproject.toml`+`uv.lock`), ruff/mypy, `pre-commit` (ruff/mypy/secret-scan), multi-target Dockerfile (distroless prod / slim hot-reload dev), `docker-compose` (Postgres pgvector/pgcrypto · Redis · LiteLLM · Ollama + bind-mount reload), testcontainers harness, `ci.yml` (ruff/mypy/Semgrep) — [repo-structure/local-dev] — done: `make dev`+`make test` run; CI green empty
- [ ] R3 — release-please + branch protection + required checks + CODEOWNERS + PR template — (⟵ R1) — [dev-workflow] — done: Release PR opens; red blocks

## Tracer bullet (build FIRST)
- [x] T1 — minimal FastAPI + `GET /healthz` + async DB session — (⟵ R1) — [05-backend] — done: 200 + DB ping
- [x] T2 — encrypted `items` insert + `inferences` read, RLS-scoped — (⟵ T1) — [03-data] — done: A round-trips, invisible to B (testcontainers)
- [x] T3 — gateway client → local Ollama → one `RawAttributeGuess` via instructor — (⟵ R1) — [llm-gateway] — done: validated object
- [x] T4 — wire T1–T3: `POST /v1/runs{attack}` → infer location → `GET` it — (⟵ T2, T3) — done: end-to-end local, no UI

## M0 — Foundations
- [x] M0.1 — config (`pydantic-settings`, per-module `BaseSettings`) — (⟵ R1) — [config-and-secrets] — done: env-loaded, `mypy --strict` clean
- [x] M0.2 — async DB engine + request-scoped session DI — (⟵ M0.1) — [db-session] — done: opens/commits/rolls-back at edge
- [x] M0.3 — SQLAlchemy 2.0 models for all v2 tables — (⟵ M0.2) — [tables/*] — done: models match the ER
- [x] M0.4 — Alembic `0001_init` (tables, enums, pgvector+pgcrypto, indexes, RLS, SECURITY DEFINER decrypt fn) — (⟵ M0.3) — [migrations] — done: `alembic upgrade head` clean
- [x] M0.5 — RLS GUC middleware + app-scope helper — (⟵ M0.4) — [rls] — done: RLS-isolation test green (testcontainers)
- [x] M0.6 — Clerk JWT verify (JWKS) + current-user dep — (⟵ R1) — [auth-clerk] — done: valid→user, invalid→401
- [x] M0.7 — RBAC `require_permission` + role/permission seed — (⟵ M0.6) — [rbac] — done: deny-by-default
- [ ] M0.8 — crypto (KMS unwrap, pgcrypto bound-param, SECURITY DEFINER) — (⟵ M0.4) — [crypto] — done: round-trip + shred green
- [ ] M0.9 — Clerk webhook (Svix-verified) — (⟵ M0.6) — [webhooks] — done: signature verified, user synced

## M1 — Ingest + Attack (text)
- [ ] M1.1 — ingestion service + adapter interface — (⟵ M0.3) — [services-ingestion] — done: parsed → canonical
- [ ] M1.2 — third-party-drop (pre encrypt/embed) — (⟵ M1.1) — [third-party-drop] — done: drop test green
- [ ] M1.3 — encrypt (T2) + `content_hmac` dedupe + embed → pgvector — (⟵ M1.2, M0.8) — [canonical-item] — done: stored encrypted+embedded
- [ ] M1.4 — upload adapters (X/Reddit/Takeout/photos) — (⟵ M1.1) — [sources/*] — done: each → canonical items
- [ ] M1.5 — gateway: Proxy client + instructor + slots + startup separation assertion — (⟵ R1) — [llm-gateway] — done: separation asserted
- [ ] M1.6 — Retriever (embedding ∪ recency ∪ always-include, token-capped) — (⟵ M1.3) — [text-inference] — done: recall-first under budget
- [ ] M1.7 — Profiler joint pass (8 attrs) → RawAttributeGuess[] + normalizer — (⟵ M1.5, M1.6) — [output-schema] — done: canonical AttributeGuess[] persisted
- [ ] M1.8 — self-consistency (N≈3, meaning-clustered) → raw confidence + Hypothesis tests — (⟵ M1.7) — [confidence-and-self-consistency] — done: agreement-fraction signal
- [ ] M1.9 — attack worker (arq) → inferences(+candidates+evidence) + run_metrics, consent-gated — (⟵ M1.7, M1.10) — [workers] — done: async run persists
- [ ] M1.10 — consent gate — (⟵ M0.7) — [services-consent] — done: missing consent → blocked

## M2 — Measure
- [ ] M2.1 — SynthPAI loader → profiles/items/eval_labels — (⟵ M0.4) — [loader-synthpai] — done: seeded once
- [ ] M2.2 — eval service (same engine) → match → eval_results — (⟵ M2.1, M1.7) — [services-eval] — done: top-1/top-3 per attr
- [ ] M2.3 — match + utility judges (reference-anchored) — (⟵ M1.5) — [adversary-judge] — done: verdicts + spot-check hook
- [ ] M2.4 — calibration + noise model → calibration (pinned engine_version) — (⟵ M2.2) — [calibration] — done: reliability map
- [ ] M2.5 — per-user scoring (raw → calibrated) — (⟵ M2.4) — [per-user-scoring] — done: calibrated stored, raw hidden
- [ ] M2.6 — CI eval-gate (floor) — (⟵ M2.2) — [eval-as-ci-gate] — done: regression fails build

## M3 — Defend (text) — the 0.86→0.21
- [ ] M3.1 — independent adversary (held-out, diff model, blind) — (⟵ M1.7) — [independent-adversary] — done: before/after via adversary
- [ ] M3.2 — ablation (greedy minimal-subset + clustering, N=1) → marginal_effect — (⟵ M3.1) — [attribution-ablation] — done: minimal set
- [ ] M3.3 — anonymizer loop (k≈3, generalization-first, self-arbitration) — (⟵ M3.2) — [anonymize-text] — done: localized truthful edits
- [ ] M3.4 — noise floor + paired bootstrap + value-recovery flip — (⟵ M3.1) — [noise-floor-and-variance] — done: significant/"not proven" + intervals
- [ ] M3.5 — utility judge + privacy/utility frontier — (⟵ M3.3) — [utility-preservation] — done: utility score + options
- [ ] M3.6 — decoy (opt-in, consent-gated, off-by-default) — (⟵ M3.3) — [text-remediation] — done: per-use confirm
- [ ] M3.7 — remediation worker → remediations (proven before/after, advise-only) — (⟵ M3.4, M3.5) — [workers] — done: result persisted

## M4 — Images
- [ ] M4.1 — media ingestion: R2 (app-side-encrypted) + media_assets + EXIF → exif_findings — (⟵ M0.8) — [images-and-exif] — done: image stored, EXIF parsed
- [ ] M4.2 — CLIP triage (geolocatability pre-filter, budget) — (⟵ M4.1) — [image-inference] — done: top-geolocatable
- [ ] M4.3 — VLM attack (context-only, geo-CoT) + EXIF merge — (⟵ M4.2, M1.5) — [attack-image] — done: image AttributeGuess[]
- [ ] M4.4 — image calibration slice (VIP + own photos) — (⟵ M4.3, M2.4) — [benchmarking] — done: image calibration
- [ ] M4.5 — image remediation (strip-EXIF + crop/inpaint/remove, prove vs VLM) — (⟵ M4.3, M3.1) — [image-remediation] — done: side-by-side proven

## M5 — API (backend half → the cross-repo seam)
- [x] M5.1 — Pydantic DTOs (per-op) + OpenAPI + problem+json — (⟵ M1–M4 services) — 🔓 **unblocks FE/M5.4** — [schemas/error-model] — done: OpenAPI published, Schemathesis green
- [ ] M5.2 — `/v1` routers + poll + SSE — (⟵ M5.1) — [endpoints/*] — done: 202+run_id, authz, no-IDOR
- [x] M5.C — `scripts/export_openapi` → publish `openapi.json` (versioned artifact) — (⟵ M5.1) — 🔓 **unblocks FE/M5.4** — [repo-structure/contract-tests] — done: artifact published per release

## M6 — Connectors
- [ ] M6.1 — connected_accounts + OAuth (encrypted tokens, read-only) — (⟵ M0.8) — [connectors] — done: link/revoke, token T2
- [ ] M6.2 — Reddit + Mastodon live pull — (⟵ M6.1, M1.1) — [connector-*] — done: own content, third-party scrubbed
- [ ] M6.3 — X upload-first; live gated — (⟵ M6.1) — [connector-x] — done: upload path works

## M7 — Polish (backend)
- [ ] M7.1 — observability (OTel + run_metrics + Sentry), no content — [observability] — done: traces/metrics/logs
- [ ] M7.2 — deploy: Railway (distroless image, native Git) + Terraform (Neon/R2/KMS) — (⟵ R1) — [infrastructure/iac] — done: live, migrations before traffic
- [ ] M7.3 — CI/CD: Semgrep · Trivy · testcontainers · Schemathesis · eval-floor + merge→staging→manual-promote→prod — [ci-cd/github-actions] — done: red gate blocks
- [ ] M7.4 — backup/DR + crypto-shred-vs-backups — [backup-dr] — done: PITR + DEK-retention honored
