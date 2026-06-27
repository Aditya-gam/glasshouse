# Source — Loader: SynthPAI

> **Depends on:** `0006-synthpai-eval.md`, `04-ai-engine/research-sources.md`, `eval_labels.md` · **Consumed by:** `measure/benchmarking.md` · **Version:** v1

Seeds the **text benchmark** once (not user-triggered).

- **Load:** `eth-sri/SynthPAI` (HuggingFace) — ~7.8k labeled synthetic comments / ~300 profiles.
- **Map:** each author → `profiles(type='synthpai', user_id=NULL)`; comments → `items` (unencrypted, synthetic); labels → `eval_labels`.
- **Properties:** fully synthetic → **no data subject** → unencrypted, erasure-exempt, safe for CI.
- Method = `loader`, platform = `synthpai`. Seed via a one-off script (not a migration).
