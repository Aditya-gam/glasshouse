# ADR 0004 — Async from the start

**Status:** Accepted (v1)

**Context.** Model work is slow and bursty — self-consistency (N runs), ablation, an independent-adversary re-attack — far beyond a request timeout.

**Decision.** Every `attack | eval | remediation` run goes through the **Redis (`arq`) queue**; the API returns a `run_id` and the client polls (or SSE).

**Rationale.** Decouples API latency from model latency; idempotent enqueue; workers scale per stage; terminal failures dead-letter. Retrofitting async after building sync endpoints is rework.

**Consequences.** The run state machine (`run-lifecycle.md`); polling/SSE on the client; `run_metrics`; a dead-letter list.
