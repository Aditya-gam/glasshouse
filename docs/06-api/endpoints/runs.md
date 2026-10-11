# API — Endpoints: Runs

> **Depends on:** `06-api/overview.md`, `02-architecture/run-lifecycle.md` · **Version:** v2 (run types `ingestion` and `export` — backend PR #59)

The single async unit (generic `/runs` + a `type`).

| Method | Path | Behavior |
|---|---|---|
| `POST` | `/v1/runs` | `{type: attack\|eval\|remediation, params, idempotency_key}` → **`202` + `{run_id, status:"queued"}`**. **Consent-gated.** |
| `GET` | `/v1/runs/{id}` | `RunStatus` — **poll** until terminal (`succeeded\|failed\|canceled`). |
| `GET` | `/v1/runs/{id}/events` | **SSE** stream: stage transitions + partial results (live progress). |
| `GET` | `/v1/runs` | list, **cursor pagination**, scope-bound. |
| `POST` | `/v1/runs/{id}:cancel` | request cancellation. |

Idempotent via `runs.idempotency_key` (a retried `POST` returns the same run). Errors as problem+json.

**Run types.** `POST /v1/runs` creates `attack`, `eval` and `remediation` runs only. `ingestion` and `export` runs are created **only** by their own endpoints (`POST /v1/imports`, `POST /v1/account/export`), because each needs input the generic route cannot carry. `RunStatus.type` can be any of the five, and all five are polled, streamed and listed the same way.
