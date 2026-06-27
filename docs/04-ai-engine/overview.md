# AI Engine — Overview

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attributes-taxonomy.md`, `feasibility-and-cost.md`, `research-sources.md`
> - **Consumed by:** `llm-gateway.md`, `attack/*`, `measure/*`, `defend/*`, `prompts/*`
> - **Hard invalidations:** changing the **agent decomposition** or the **separation rules** → update `attack/*`, `defend/*`, and `prompts/*`
> - **Version:** v1

## What the engine is
The core of the product: an **orchestration of off-the-shelf LLMs/VLMs** (no model we train) that runs **Attack → Measure → Defend** over a subject's content. The value is in the orchestration and the rigor, not in any weights we own. Cost/feasibility for every part is in `feasibility-and-cost.md`; the prediction contract is `attributes-taxonomy.md`.

## The multi-agent attack (adapted from AutoProfiler)
We adopt a four-agent decomposition. **Reuse posture (resolved):** the AutoProfiler repo ships **no LICENSE → we reimplement the published method and copy no code.** Note this scheme is *our adaptation* — we add a **Tagger** and make the **Retriever embedding-based**; the paper's actual agents are **Strategist / Retriever / Extractor / Summarizer** (no Tagger; sequential-batch retrieval). We keep ours, labelled as ours:
- **Tagger** — labels which attribute types a comment may reveal. *Optional optimization* (token pre-filter), not a capability; can be skipped or run on a small/local model.
- **Retriever** — gathers relevant history via embeddings + chronological/recency. **Non-LLM** (embeddings + pgvector).
- **Profiler** (Strategist + Extractor) — the actual inference: plans the attack and infers attributes with a *raw* confidence signal and **evidence** (which items). **Capable-LLM slot.**
- **Summarizer** — consolidates/dedups results. Logic is **code**; fluent prose is optional.

This decomposition conveniently yields **evidence attribution** (Retriever/Profiler) and a **confidence signal** (Profiler) that the rest of the engine needs.

## Gateway and model slots
All model calls go through one **LiteLLM** gateway (provider-agnostic; cost tracking; routing; a **local Ollama profile for dev and a cloud profile for cited runs**, switched by config). The slots and which need a capable model are defined in `feasibility-and-cost.md` (Profiler, VLM, anonymizer, adversary = capable; tagger/retriever/consolidation/location-judge = free/local).

## The separation principle (non-negotiable)
To avoid self-deception, distinct roles use **distinct models/contexts**:
- The **Profiler's self-reported confidence is a raw signal only** — it is fed through the **calibration map** (`measure/calibration.md`) before any number is shown. We never display the model's bare confidence.
- The **judge** (matching) is independent of the **attacker** (`attributes-taxonomy.md` LLM-judge protocol).
- The **defense re-attack adversary** is a separate, **capable** model — a weak adversary makes a weak claim (`defend/independent-adversary.md`).
- The **anonymizer (editor) is never the judge** (`defend/overview.md`).

## How the three stages wire together
- **Attack** → the four agents produce `inferences` (value, top-3, raw confidence, evidence, reasoning) per `attack/output-schema.md`.
- **Measure** → Job 1 benchmarks + calibrates the engine on SynthPAI/VIP; Job 2 turns raw confidence into calibrated, label-free reliability for the user (`measure/*`).
- **Defend** → the anonymizer proposes minimal edits; the independent adversary re-attacks; before/after confidence is reported, attributed via ablation/proxy (`defend/*`).

## Reuse posture
- **Adapt** AutoProfiler's *published method* (repo has no license → method-only, no code copied) — re-fitted to our guardrails (consent gate, no-logging, encryption, separation).
- **Adapt** eth-sri `llm-anonymization` (defense) and the attack prompts; **use** SynthPAI/VIP for eval.
- Build the product/calibration/orchestration layer ourselves.
