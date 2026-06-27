# Feasibility & Cost

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attributes-taxonomy.md` (match rules), `measure/*` (self-consistency, calibration), `defend/*` (adversary, ablation)
> - **Consumed by:** `llm-gateway.md` (model slots), `attack/*`, `prompts/*`, `09-infra-devops/*`
> - **Hard invalidations:** changing the **model-slot map** or **cost levers** here → update `llm-gateway.md` and any per-component option pinned below
> - **Version:** v1

Honest reference for what each engine component costs and which genuinely needs a capable LLM. Structured as a **testing playbook**: during implementation, try the candidate options here and measure before finalizing.

## Honest cost summary
- **Tier-1 components have no per-use fee, but are not free** — they run on your backend server + managed Postgres, a fixed hosting bill regardless of volume. The one that *scales* cost is embeddings + the pgvector HNSW index (RAM-hungry → bigger DB instance).
- **Dev ≈ $0** — the entire pipeline runs on local Ollama models + free libraries on the Mac.
- **A credible cited benchmark ≈ $10–50** on a SynthPAI subset.
- **A full frontier eval with self-consistency ≈ low hundreds** — run rarely, at cheap-tier, or via batch API.
- The rigor (strong adversary, LLM judge, self-consistency, real eval slice) is the expensive part **and** the impressive part. Cheaper = less defensible numbers. That trade is real.

## Component classification (honest)

### Tier 1 — no LLM (free software; cost = hosting only)
Parsing · normalization · third-party-drop · EXIF extraction/strip · embeddings · vector search (pgvector) · explicit-PII (Presidio) · calibration stats · categorical/numeric matching · image removal.
Marginal cost per audit ≈ 0. Fixed cost = the server + DB. **Embeddings + vector index** are the only items that grow infra at scale.

### Tier 2 — reducible to non-LLM with minimal quality loss
- **Retriever** → embeddings + vector search. Solved technique; no real accuracy sacrifice.
- **Summarizer (consolidation)** → dedup/merge is code; fluent prose is optional/templatable.
- **Location/birthplace judge** → **geocoding gazetteer (GeoNames)** beats both embeddings and an LLM on geography, deterministically.

### Optional optimization (non-LLM acceptable)
- **Tagger** → a token-saving pre-filter, not a capability. NER/gazetteers miss *implicit* signals (the product's core value), but the Profiler sees everything regardless, so a weak/absent tagger costs efficiency, not final accuracy.

### Non-negotiable capable-LLM work
- **Text attribute inference (Profiler)** — the core.
- **VLM image geolocation** — needs a vision model.
- **Anonymizer (defense rewrite)** — text generation preserving meaning; non-LLM = crude redaction = effectively "delete," which isn't our job.
- **Independent adversary (re-attack)** — a *weak* adversary makes a *weak* claim; for credible results it must be **as capable as the threat**.
- **LLM judge on ambiguous matches** — only the cases geocoding/embeddings can't resolve.

## Model-slot map
| Slot | Capable model needed? | Dev (free/local) | Cited-run (cloud) |
|---|---|---|---|
| Profiler (text inference) | **Yes** | Ollama 27–32B | frontier |
| VLM (image) | **Yes** | local VLM (Qwen2.5-VL / Gemma 3) | o3 / Gemini 2.5 Pro |
| Anonymizer | yes (mid ok) | Ollama mid | mid-tier frontier |
| Independent adversary (**evaluator**) | **Yes** (for rigor) | Ollama 27–32B | frontier (≠ Profiler model) |
| Feedback adversary (editor refines vs it) | **Yes** | Ollama 27–32B | frontier (≠ evaluator **and** ≠ Profiler) |
| Match-judge (ambiguous only) | yes (mid ok) | Ollama mid | mid-tier (≠ Profiler) |
| Utility-judge (defense) | yes (mid ok) | Ollama mid | mid-tier (≠ anonymizer; may share with match-judge) |
| Inpaint (image remediation) | **Yes** (generative) | local SD-class model | cloud generative-image model |
| Tagger | no | small local / skip | cheap-tier / skip |
| Retriever, consolidation, location-judge | **no** | free libs | free libs |

**Provider strategy (locked, v1 — provider-agnostic):** slots resolve to a vendor **at deploy via the LiteLLM config**; "frontier / mid / cheap-tier / local" are **capability tiers, not vendor commitments** (Claude, Gemini, GPT-class, and local Ollama are all swappable). The one hard constraint is the **separation chain** — the evaluator adversary must be a different model/family from the profiler, the feedback adversary, the anonymizer, and the judges (`llm-gateway.md`).

## Options-to-test matrix (try, measure, then finalize)
| Component | Candidate options (cheap → costly) | Trade-off | Measure to decide |
|---|---|---|---|
| Text inference | local 27–32B → cheap-tier API → frontier | accuracy ↑ with capability | top-1/top-3 on SynthPAI subset |
| Free-text judge (occupation) | embeddings (MiniLM/mpnet/GTE) → LLM-judge on ambiguous → full LLM-judge | accuracy vs cost; embeddings less accurate, threshold brittle | judge-vs-human agreement on a labeled sample |
| Location judge | GeoNames geocoding → LLM-judge fallback | geocoding deterministic & free | match rate vs hand-labeled |
| Adversary | local → cheap → frontier | weak adversary = weak claim | does a stronger model still recover the attribute? |
| Confidence | self-reported → self-consistency N=3 → N=5 | more samples = more cost, better calibration | ECE on SynthPAI per N |
| Attribution | embedding-proximity proxy → top-k ablation → full leave-one-out | full ablation is the cost bomb | agreement between proxy and full ablation on a few cases |
| Tagger | skip → NER → small LLM | efficiency only | Profiler token cost with/without |

## Cost levers (design rules, not afterthoughts)
1. **Cap self-consistency** at N≈3 (test N vs ECE).
2. **Scope ablation** — top-k evidence only, or the free **embedding-proximity proxy**; never naive leave-one-out per item.
3. **Re-attack only the affected attribute**, not the whole profile.
4. **Batch API (~50% off)** for non-interactive eval runs.
5. **Prompt caching** for shared system prompts / repeated context.
6. **Route**: free/local or cheap-tier for bulk; frontier only for Profiler + adversary on the cited run.
7. **Eval on a subset** for iteration; full SynthPAI rarely.

## Local-first dev workflow
- **Ollama exposes an OpenAI-compatible API (incl. `/embeddings`); LiteLLM points at it exactly like a cloud provider** — same code, swap the model name in config (`local` vs `cloud` profile).
- Build/debug the whole pipeline on local models → $0. Switch the profile to cloud only for the cited benchmark.
- Local model picks by Mac RAM *(confirm: 16 vs 32 GB)*: 16 GB → Qwen3 8B / Phi-4 14B; 32 GB → Qwen3 32B (competes with much larger cloud models on routine tasks). Honest ceiling: local handles ~70–80%; frontier still wins hardest reasoning — so local numbers are for dev, cited numbers come from cloud.

## Free/local tool inventory
- **LLMs (dev):** Ollama (Qwen3, Phi-4, Gemma 3)
- **Embeddings:** sentence-transformers — `all-mpnet-base-v2` (quality), `all-MiniLM-L6` (speed), `GTE-large` (trade-off)
- **Geocoding:** GeoNames (CC-licensed) via `geopy` / `pgeocode`
- **PII:** Microsoft Presidio (Apache-2.0)
- **Vectors:** pgvector
- **EXIF:** `piexif` / `Pillow` / `exiftool`
- **Gateway:** LiteLLM (provider-agnostic, cost tracking, routing)
