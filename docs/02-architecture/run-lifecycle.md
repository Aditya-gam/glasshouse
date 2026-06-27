# Architecture — Run Lifecycle

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `system-overview.md`, `archive/architecture.md` (the flat source), `04-ai-engine/*` (the stage internals)
> - **Consumed by:** `05-backend/modules/workers.md`, `06-api/endpoints/runs.md`, `03-data/database/tables/runs.md`
> - **Hard invalidations:** changing the run states or idempotency → update the `runs` table + API + workers
> - **Version:** v1 (split from `archive/architecture.md`; reconciled to the engine stages)

Every unit of model work is a **`run`** (`attack | eval | remediation`), async via the Redis queue.

## State machine
```
queued ──► running ──► succeeded
                  ├──► failed ──► (retry w/ backoff) ──► running
                  └──► canceled
```
- Enqueue is **idempotent** via `runs.idempotency_key`.
- The API creates the run (**`202 Accepted` + `run_id`**); the client **polls `GET /runs/{id}`** or subscribes via SSE.
- Workers record `attempts`, a terminal `error`, and emit **`run_metrics`** (tokens/cost/latency, no content). Terminal failures route to a **dead-letter** list.
- **No run executes** without a valid, non-revoked `consents` row for the subject + purpose (CLAUDE.md rule 7).

## Stage data flow
- **Attack** — upload/connect → consent check → ingest (subject-authored only, encrypted) → enqueue `attack` → retrieve + joint profiler pass + self-consistency (N≈3) + targeted escalation → normalize → `inferences` + `run_metrics` → dashboard.
- **Measure** — SynthPAI/VIP seeded once → `eval` run → match (deterministic + ambiguous-judge) vs `eval_labels` → `eval_results`; calibration + noise model are engine properties (`measure/*`).
- **Defend** — user triggers `remediation` → ablation finds the minimal set → anonymizer (k≈3 feedback loop) proposes edits → **held-out independent adversary** re-attacks → paired-bootstrap before/after vs the noise floor → `remediations` → simulation view.

Sub-step internals (retrieval, self-consistency, ablation, adversary) live in `04-ai-engine/*`; this is the orchestration shell.
