# Backend — Observability

> **Depends on:** `infra-devops` rule (3 pillars), `03-data/tables/run_metrics.md` · **Consumed by:** the cost optimize loop, ops · **Version:** v1

See the system without seeing the user's content.

- **Metrics** — `run_metrics` (tokens/cost/latency, model_calls) per run: detects problems **and** drives routing + budget decisions (the optimize loop).
- **Structured (JSON) logs** — with `request_id` / `run_id` / `trace_id` / `span_id` + `service`/`version` context for correlation; **never content, keys, or decrypted text** (rule 1). Logs as event streams to stdout (12-factor).
- **Traces** — request + run IDs thread through API → worker → gateway so an investigation can pivot across the three pillars.
- The gateway disables request/response bodies; only metadata is captured.
