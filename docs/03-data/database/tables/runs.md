# Table — `runs`

> **Depends on:** `02-architecture/run-lifecycle.md` · **Consumed by:** `inferences`, `eval_results`, `remediations`, `run_metrics`, the runs API · **Version:** v1

The async unit of work.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `profile_id` | uuid FK → `profiles` | |
| `type` | text | `attack \| eval \| remediation` |
| `status` | run_status_t | `queued \| running \| succeeded \| failed \| canceled` |
| `idempotency_key` | text UK | idempotent enqueue |
| `attempts` | int | retry count |
| `error` | text | terminal error (no content) |
| `engine_version` | text | the (model+prompt+pipeline) pin for this run |
| `created_at` / `finished_at` | timestamptz | |

The state machine + stage flow are in `run-lifecycle.md`. `engine_version` ties results to the calibration map.
