# API — Schemas (DTOs)

> **Depends on:** `.claude/rules/api-design.md` + `backend.md`, `03-data/database/tables/*`, `07-frontend/prototype-mapping.md` (the UI data shapes) · **Consumed by:** OpenAPI, contract tests, the frontend (generated client + Zod) · **Version:** v2 (reconciled with the prototype data shapes)

Pydantic v2 DTOs are the wire contract — **never** the ORM models. Reliability is **always calibrated point + interval** (`{point, lo, hi}`); raw model confidence is never serialized.

- **Per-operation schemas** — create/read/update differ. A custom base model standardizes datetime/serialization.
- **Error DTO** — RFC 9457 problem+json (extension members for machine-readable detail).
- **Async** — `RunCreate {type, params, idempotency_key}` → `202 {run_id}`; `RunStatus {id, type, status, engine_version, error?}`; poll `GET /runs/{id}` or SSE `…/events`.

## Core type (calibrated)
- `Reliability { point: float; lo: float; hi: float }` — 0..1; the UI renders %.

## Key read DTOs (derived from the prototype §3 — see `prototype-mapping.md`)
- **`AttributeRead`** (dashboard, the 8 cards) — `code, label, value|null, detail|null, reliability: Reliability|null, evidence, evidence_count?, abstain?, sensitive?, art9?, severity: {atrisk, jobseeker}`. `null` reliability ⇔ abstain. `severity` is the per-persona taxonomy matrix; the UI computes `balanced = max()`.
- **`AttributeFindingRead`** (attribution detail) — `AttributeRead` + `precision?, neighborhood?, reasoning, candidates: {rank,label,note}[], text_only_reliability?: Reliability, evidence_items: EvidenceRead[]`.
- **`EvidenceRead`** — `id, kind: 'proven'|'likely', type: 'text'|'photo', source, date, text?, spans?, caption?, region? {x,y,w,h 0..1}, exif? {gps,place,device,taken}, rationale, marginal? (proven: ablation Δ, negative %), proxy?/citation? (likely: 0..100)`.
- **`RemediationRead`** — `status: 'proven'|'within_noise'|'cant_break', target: {attribute, value, before: Reliability}, options: DefendOptionRead[]`.
- **`DefendOptionRead`** — `key: 'minimal'|'stronger'|'remove'|'decoy', name, desc, truthful, recommended?, opt_in?, after: Reliability, recovered, misled? (decoy), utility: int|null, utility_label, edits: DefendEdit[]`.
- **`BenchmarkRead`** — `rows: {label, top1, top3}[], calibration: [predicted, empirical][]`.
- `ImportRead` (kept/dropped), `ConnectedAccountRead`, `ConsentRead {purpose, art9, decoy}`, `AccountRead`, `EvalResultRead`.

## Contract
- **OpenAPI generated from these** (the contract). The frontend **generates its typed client** from the published schema (`@hey-api/openapi-ts`) and validates with **Zod** at the boundary.
- Special-category values (`sex`, `birthplace`/Art. 9) are gated by consent. Severity comes from the **taxonomy service**, never hardcoded. The `within_noise`/`cant_break` outcomes are set by the real noise-floor/load-bearing rule (`04-ai-engine/defend/*`), not the UI.
