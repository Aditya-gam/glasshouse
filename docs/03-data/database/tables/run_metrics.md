# Table — `run_metrics`

> **Depends on:** `04-ai-engine/llm-gateway.md` · **Consumed by:** the cost/optimize loop, the dashboard · **Version:** v1

Per-run instrumentation from the gateway — **metadata only, never content** (rule 1).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `run_id` | uuid FK → `runs` | |
| `prompt_tokens` / `completion_tokens` | int | |
| `cost_usd` | numeric | |
| `latency_ms` | int | |
| `model_calls` | int | incl. self-consistency N, adversary, ablation probes |
| `created_at` | timestamptz | |

Drives routing decisions (cheap/local vs frontier) and the budget caps; surfaces latency + cost per audit (a success metric).
