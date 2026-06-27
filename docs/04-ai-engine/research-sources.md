# Research Sources — papers, tools, datasets

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** the decisions in `04-ai-engine/attack/*`, `measure/*`, `defend/*`, `prompts/conventions.md` (this is their provenance, not their spec)
> - **Consumed by:** `prompts/*` (what to model prompts on), `04-ai-engine/overview.md`, `measure/benchmarking.md` (datasets)
> - **Hard invalidations:** none (a reference list); the **authored engine docs are authoritative for methodology** — this only cites origins
> - **Version:** v2 (reconciled: +AutoProfiler, +LiteLLM, +image/defense/measure/prompt-eng refs; images are v1, not "future")

The bibliography our design borrows from. **Methodology now lives in the authored `attack/`·`measure/`·`defend/`·`prompts/` docs — those are authoritative;** this page only records *origins, venues, repos, and licensing*. **Cite the papers; write our own prompts — never paste paper/prompt text verbatim.**

## Licensing posture (read before reusing code)
- ETH-SRI repos (`llmprivacy`, `SynthPAI`, `llm-anonymization`, `privacy-inference-multimodal`) — **MIT** (data may carry separate terms, e.g. VIP images).
- **AutoProfiler (`zealscott/AutoProfiler`) — NO license file → method-only reuse, no code copied.** Reimplement the published design.
- `ContextCite` (`MadryLab/context-cite`) — check repo license before code reuse; the *method* is freely reimplementable.
- SynthPAI is fully synthetic → no data subjects. **Self-audit only; never profile third parties; do not seek the unreleased PersonalReddit (PR) set.**

---

## Attack — text
| Work | Venue | arXiv | Repo | Note |
|---|---|---|---|---|
| Beyond Memorization: Violating Privacy via Inference with LLMs (Staab et al.) | ICLR 2024 | 2310.07298 | `eth-sri/llmprivacy` | the original PAI attack; ~85% top-1 / ~95% top-3; the "expert-investigator + guessing-game, reason→top-3 + 1–5 certainty" anatomy |
| Automated Profile Inference with Language Model Agents (AutoProfiler) | ACL 2026 | 2505.12402 | `zealscott/AutoProfiler` | multi-agent (Strategist/Retriever/Extractor/Summarizer); **no license → method-only** |

## Attack — image (v1, not "future")
| Work | Venue | arXiv | Repo | Note |
|---|---|---|---|---|
| Private Attribute Inference from Images with VLMs (VIP) | NeurIPS 2024 | 2404.10618 | `eth-sri/privacy-inference-multimodal` | 554 people-free images, 8 attributes, 77.6% best; context-only inference |
| GeoSpy + 404 Media investigation (2025) | — | — | — | real-world VLM geolocation abuse (stalking) → validates advise-only / self-audit-only |
| VLM-geolocation benchmarks (WhereBench, geo-CoT, GeoChain) | 2025–26 | — | — | hierarchical country→region→city reasoning; crop/zoom uplift |

## Measure
| Work | Venue | arXiv | Repo | Note |
|---|---|---|---|---|
| A Synthetic Dataset for PAI (SynthPAI) | NeurIPS 2024 D&B | 2406.07217 | `eth-sri/SynthPAI` | ~7.8k labeled synthetic comments / ~300 profiles — the text benchmark |
| Adding Error Bars to Evals (Miller) | — | 2411.00640 | — | bootstrap CIs, paired analysis → noise-floor + before/after intervals |
| Semantic Uncertainty / Semantic Entropy (Kuhn, Gal, Farquhar; Farquhar et al.) | ICLR 2023 / Nature 2024 | 2302.09664 | — | cluster answers by **meaning** before counting agreement (we reuse our match rules); Nature'24 extends it to hallucination detection, `2406.15927` = Semantic Entropy Probes |
| Verbalized confidence is overconfident | ICLR 2024 | 2306.13063 | — | why self-reported confidence is secondary; self-consistency preferred |

## Defend
| Work | Venue | arXiv | Repo | Note |
|---|---|---|---|---|
| Language Models are Advanced Anonymizers (FgAA) | ICLR 2025 | 2402.13846 | `eth-sri/llm-anonymization` | iterative refine-against-feedback; utility + privacy |
| Robust Utility-Preserving Text Anonymization (RUPTA) | ACL 2025 | 2407.11770 | — | k≈3 hops; utility judge (readability+meaning) |
| IncogniText (false-attribute injection) | IJCNLP 2025 | 2407.02956 | — | the **opt-in decoy** technique (>90% leakage cut; deception — heavily warned) |
| GeoShield (adversarial perturbation for geoprivacy) | AAAI | 2508.03209 | — | image roadmap option (fragile to re-compression / model transfer) |
| ContextCite (attributing generation to context) | NeurIPS 2024 | 2409.00729 | `MadryLab/context-cite` | ablation-surrogate (we use greedy minimal-set + clustering instead) |

## Prompt engineering & standards
| Work | Source | Note |
|---|---|---|
| Prompting best practices (Claude) | platform.claude.com | XML delimiting, few-shot CoT, long-context ordering, structured outputs (prefill deprecated) |
| The Prompt Report (Schulhoff et al.) | arXiv 2406.06608 | 58-technique taxonomy; few-shot CoT is top; example-design factors |
| OWASP LLM Top-10 2025 — LLM01 Prompt Injection | genai.owasp.org | indirect injection (untrusted user content) → datamark/spotlight, instruction-data separation |
| promptfoo | promptfoo.dev | eval-as-CI-gate, regression floor, injection/PII red-team |

## Gateway, infra & free/local tooling
LiteLLM (self-hosted **Proxy** gateway — routing, budget caps) · `instructor` (Pydantic-validated structured output) · Ollama (local models, JSON-schema constrained decoding) · Microsoft Presidio (local PII/NER) · GeoNames via `geopy`/`pgeocode` (geocoding) · sentence-transformers + **pgvector** (embeddings/retrieval) · `Pillow`/`piexif`/`exiftool` (EXIF). All free/local except the capable-LLM slots in `feasibility-and-cost.md`.

---

## Data sources
- **Eval (text):** SynthPAI — seed once as `profiles.type='synthpai'` with `eval_labels`.
- **Eval (image):** VIP where obtainable + **the builder's own labeled photos** (perfect ground truth, ethically clean).
- **Self-audit (the demo):** user-owned exports — X/Twitter archive, Reddit "request my data", Google Takeout, LinkedIn export (zero API friction, real, privacy-aligned).
- **Live connectors (v1):** Reddit (free API), Mastodon (open API); **X = upload-first** (live pull needs paid tier).
- **Deterministic PII:** Presidio (local) alongside the LLM inference.

## Ethics & licensing (summary)
ETH-SRI = MIT (attribute the papers); AutoProfiler = method-only; SynthPAI = synthetic (safe for CI); **self-audit only**, no third-party profiling, no PR dataset; GeoSpy is the cautionary tale (we are advise-only, not geolocation-as-a-service); the cloud LLM/VLM is a documented **sub-processor**.

## Formerly-open questions — now resolved (pointers)
1. Single-call vs agentic attack → **always-on retrieval + joint-8 + targeted escalation; self-consistency default-on** (`attack/text-inference.md`, `confidence-and-self-consistency.md`).
2. Location matching granularity → **LLM-judge hierarchical-graded** (`attributes-taxonomy.md`).
3. Defense objective → **independent-adversary value-recovery + noise floor + utility floor** (`defend/*`).
4. Attack output shape → **superseded** by `attack/output-schema.md` (the old `value/top3/confidence/hardness` sketch is retired; `hardness` moved to the measure-join).
