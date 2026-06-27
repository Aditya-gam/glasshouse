# Infra — Observability (OpenTelemetry)

> **Depends on:** `.claude/rules/infra-devops.md` (three pillars), `05-backend/observability.md` (what the app emits), `03-data/database/tables/run_metrics.md`, `08-security-privacy/logging-policy.md`, `decisions/0010-hosting-stack.md` · **Version:** v1

Full **OpenTelemetry** from day one (the decision) — the three pillars, correlated, carrying **no user content**.

## The three pillars
- **Traces** — OTel auto-instrumentation for FastAPI + `httpx` + SQLAlchemy + `arq`; one span threads **API → queue → worker → gateway**, so a run is a single trace. The LiteLLM Proxy call is a child span with tokens/cost/latency as span attributes.
- **Metrics** — request/worker/gateway metrics via OTel; **`run_metrics`** (tokens/cost/latency/`model_calls`) is the product-specific metric, written to the DB (the cost optimize loop) and mirrored as OTel counters.
- **Logs** — `structlog` → **structured JSON** to stdout, enriched with `trace_id`/`span_id`/`request_id`/`run_id` + `service`/`version`/`env`. **Never** content, keys, tokens, or decrypted text (rule 1).

## Pipeline
- App → **OTel SDK** → **OTel Collector** (a Railway sidecar) → backends: **Sentry** for errors + tracing (FastAPI + Next.js SDKs, free tier) and an **OTLP store** (SigNoz / Grafana Cloud free tier) for metrics/traces. The collector decouples app from backend (swap backends without code change).
- **Sampling** — ratio or tail-based sampling at the collector to bound cost; **always-sample** errors and slow/over-budget runs.

## Correlation & privacy
- One **`trace_id`** pivots logs ↔ traces ↔ the `runs`/`run_metrics` row. The gateway disables request/response bodies; spans carry **metadata only** (model, tokens, latency — never prompt/response text). This is the `logging-policy.md` boundary, enforced at the collector too (drop any attribute that could carry content).

## Dashboards & alerts
- **Dashboards:** run throughput + latency, **model cost per run**, eval-gate accuracy trend, queue depth, error rate.
- **Alerts (OWASP A09):** error-rate spike, **budget-cap breach** (`llm-gateway.md`), **eval accuracy below the floor**, worker dead-letter growth, DB connection saturation, KMS/decrypt failures.
