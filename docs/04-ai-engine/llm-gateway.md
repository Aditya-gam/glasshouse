# LLM Gateway

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `feasibility-and-cost.md` (model-slot map), `attributes-taxonomy.md` + `attack/output-schema.md` (the JSON contract), `overview.md` (separation rules)
> - **Consumed by:** every component that calls a model (`attack/*`, `measure/*`, `defend/*`, `prompts/*`), plus `02-architecture/*`, `05-backend/*`, `09-infra-devops/*`
> - **Hard invalidations:** changing the **slot map** or **separation rules** → update the proxy config; changing the **output schema** → update the instructor models
> - **Version:** v1

## Role
One **OpenAI-compatible control plane** between the backend and every model backend (local Ollama + cloud providers). It is the single chokepoint for **cost** (routing + caps), the **privacy boundary** (only the model call leaves our network), **rigor** (different slots → different models), and **instrumentation**. Remember the distinction: Ollama/cloud *run* the models; the gateway only *routes* to them.

## Decision: LiteLLM **Proxy** (self-hosted, Docker)
Chosen over the in-process SDK for **hard budget caps** (virtual keys) + an admin UI, and over OpenRouter for **privacy** (self-hosted; only the model call leaves the network; zero markup).
- Runs as its own Docker service alongside the API and workers.
- Holds **all provider keys centrally** (config-as-YAML); the app holds only the proxy's virtual key(s).
- The backend/workers call it via OpenAI-compatible HTTP at an internal `base_url` (a thin client, not the in-process SDK).

## Model slots & local/cloud profiles
- Named **slots** declared in the proxy config: `profiler`, `vlm`, `anonymizer` (editor), `adversary` (held-out **evaluator**), `feedback-adversary` (the editor refines against this one — held-out from the evaluator), `judge` (match **+ utility** judging; the two may share a model but must differ from the editor), `inpaint` (generative image slot for image remediation), `tagger` (optional). Slots map to defend roles in `defend/text-remediation.md` + `utility-preservation.md` + `image-remediation.md`.
- Each slot resolves to a model via the active **profile**, switched by env var:
  - **local** (dev, $0): every slot → an Ollama model.
  - **cloud** (cited runs): capable slots → frontier; bulk slots → cheap-tier.
- The capable-vs-free/local assignment is owned by `feasibility-and-cost.md`. **Changing a slot → update this config** (traceability edge).
- Per-slot **fallback chains** and cheap→frontier escalation where applicable.

## Budget caps — the spend ceiling
The reason we took the Proxy. Defense-in-depth against the runaway-loop cost surprise:
1. **Proxy virtual keys** with per-key/per-environment **monthly budget limits** — a tiny cap for `dev` (e.g., $5) and a separate, explicit cap for `cited-benchmark` runs. Requests are rejected when exceeded.
2. **App-level per-run budget** — each run carries a max token/cost budget; a single audit aborts before it can balloon (catches the ablation/self-consistency blow-up).
3. Threshold **alerting** before the hard stop.

## Structured output — instructor + provider JSON + Ollama `format=<schema>`
- **`instructor`** wraps the OpenAI-compatible client (pointed at the proxy) to return **Pydantic-validated** objects matching `attack/output-schema.md`.
- **Cloud frontier slots:** provider-native JSON/structured mode under instructor.
- **Local Ollama slots:** `format=<emission JSON schema>` — constrained decoding against the **full schema** (Ollama ≥0.5.0; not bare `format=json`), `temperature=0`. Open models follow plain JSON less reliably, so the schema constraint matters most here (matches `attack/output-schema.md` §11 + `prompts/output-formats.md` §3).
- **Failure policy:** on validation failure, a **bounded** repair-retry (N≈2); after that, mark the run step `failed` — never loop indefinitely (cost + reliability). The schema is the contract; the gateway validates against it.

## Caching (cost lever, privacy-bounded)
- **Provider-native prompt caching** for the large shared system prompts / repeated context the multi-agent attack reuses — the main legitimate cost saving.
- **Response caching (Redis):** *dev-only* for identical re-runs. **Privacy rule:** never cache across users; if used, key strictly by content hash within a single subject's run. Per-user response caching is risky → default off in production (revisit in `08-security-privacy/*`).

## Instrumentation
- The proxy emits per-call **tokens / cost / latency** → captured into `run_metrics` (the optimize loop).
- **No content logging:** request/response bodies are disabled in the proxy; only metadata is logged (privacy rule).
- Richer tracing (Langfuse/Helicone) is a roadmap add-on, not v1.

## Separation enforcement (operationalizing rigor)
The gateway is *where* editor ≠ judge ≠ adversary becomes real. The full **separation chain** (`defend/text-remediation.md` §1): `profiler` ≠ `anonymizer` ≠ `feedback-adversary` ≠ `adversary` (evaluator) ≠ `judge`. Enforce in config and **assert at startup** (fail fast on a forbidden collision). Two assertions matter most: the **evaluator `adversary` must differ from the `feedback-adversary`** (so the proof isn't graded by the model the edit was tuned to beat), and the `anonymizer` (editor) must differ from every adversary and judge. The match-`judge` and `utility`-judge may share a model with each other, but not with the editor.

## Resilience
Per-slot timeouts, retries with backoff, fallback chains, and circuit-breaking on a failing provider.

## Cross-references
- **`02-architecture/system-overview.md`** — add the **LiteLLM Proxy** as a component (Redis already present for the queue/cache).
- **`05-backend/modules/llm-gateway.md`** — the module is a **thin proxy client** (OpenAI client at `base_url`) + the instructor wrapper, not the in-process SDK.
- **`09-infra-devops/*`** — the Proxy is a Docker service with its YAML config; provider keys as secrets; budget-cap config; Redis.

## Deferred
- Langfuse/Helicone tracing (roadmap).
- Production response-caching policy → `08-security-privacy/*`.
