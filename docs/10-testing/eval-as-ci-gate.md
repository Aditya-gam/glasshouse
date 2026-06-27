# Testing — Eval as a CI Gate

> **Depends on:** `04-ai-engine/measure/benchmarking.md`, `03-data/tables/eval_results.md` · **Version:** v1

The gate that stops the engine silently regressing.

- A CI job runs the **attack engine over a fixed SynthPAI slice** and computes top-1/top-3 per attribute.
- **Fails the build if accuracy drops below a floor** (the floor is set from the first clean run; per-attribute).
- Catches a prompt/model/pipeline/retrieval/self-consistency change that quietly hurts accuracy (the hard-invalidation coupling).
- Runs on the cheap/local profile for speed; the full cited benchmark is run rarely (cost).
- Image eval is supplementary (don't gate hard on the small/gated VIP set).
