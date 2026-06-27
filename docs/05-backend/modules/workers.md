# Module — `workers/`

> **Depends on:** `02-architecture/run-lifecycle.md`, the services · **Consumed by:** the async run lifecycle · **Version:** v1

`arq` over Redis. Each stage worker is a **thin wrapper that calls its service** (no logic in workers).

- **`queue.py`** — `arq` `WorkerSettings`; idempotent enqueue via `runs.idempotency_key`; status transitions persisted; retries with backoff; **dead-letter** on terminal failure; per-run budget cap enforced.
- **`attack.py`** → `services/inference` (retrieval + self-consistency joint pass + escalation).
- **`eval.py`** → `services/eval` (benchmark + calibration + noise model).
- **`remediation.py`** → `services/anonymize` (ablation → anonymizer loop → independent-adversary before/after).
- **`purge.py`** → retention sweep over `expires_at` (+ object deletion); honors process-then-discard.

Workers never bypass the **consent gate** or the **separation** rules — those live in the services they call.
