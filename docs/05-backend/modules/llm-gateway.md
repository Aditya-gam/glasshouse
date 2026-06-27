# Module — `gateway/` (LLM gateway client)

> **Depends on:** `04-ai-engine/llm-gateway.md` (the Proxy), `output-schema.md` + `output-formats.md` (the contract) · **Consumed by:** all services that call a model · **Hard invalidations:** slot/separation change → proxy config + startup assertion · **Version:** v2 (thin proxy client — supersedes the in-process gateway)

A **thin client** to the self-hosted **LiteLLM Proxy** — not an in-process SDK.

- **`client.py`** — an OpenAI-compatible client pointed at the proxy's internal `base_url`, holding only the proxy **virtual key**. The proxy owns provider keys, routing, budget caps, fallbacks.
- **`instructor` wrapper** — validates responses into the **emission Pydantic models** (`output-schema.md`); on failure, the **bounded repair-retry (N≈2)**, then mark the run step `failed`.
- **Slots** — named slots (`profiler`, `vlm`, `anonymizer`, `feedback_adversary`, `evaluator_adversary`, `match_judge`, `utility_judge`, `inpaint`, `tagger`) resolved by the active profile (local/cloud). **Separation asserted at startup** (fail fast if two coupled slots share a model).
- **Reasoning** — provider-thinking where available; reasoning-field fallback (`output-formats.md` §2).
- **No content logging** — request/response bodies disabled; only `run_metrics` (tokens/cost/latency).

The module is the *operationalization* of `04-ai-engine/llm-gateway.md`; the proxy is a Docker service (`09-infra-devops/*`).
