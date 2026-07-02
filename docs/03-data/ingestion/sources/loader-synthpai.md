# Source — Loader: SynthPAI

> **Depends on:** `0006-synthpai-eval.md`, `04-ai-engine/research-sources.md`, `eval_labels.md` · **Consumed by:** `measure/benchmarking.md` · **Version:** v2 (reconciled to impl: `RobinSta/SynthPAI` + encrypted system-user storage, M2.1/PR #37)

Seeds the **text benchmark** once (not user-triggered).

- **Load:** `RobinSta/SynthPAI` (HuggingFace, **pinned revision**) — ~7.8k labeled synthetic comments / ~300 profiles. *(Was `eth-sri/SynthPAI` — that id 401s; corrected per M2.1 / PR #37.)*
- **Map:** each author → `profiles(type='synthpai')` owned by a **system user**; comments → `items` **encrypted via the normal ingest path**; labels → `eval_labels` (upsert; migration `0006` unique constraint). *(Supersedes the old NULL-owner/unencrypted model — storing under a system user keeps it RLS-compatible and ingestion **one code path**.)*
- **Properties:** fully synthetic → **no data subject** → erasure-exempt, safe for CI. Stored **encrypted under the system user** (not a separate unencrypted path) so ingestion stays one code path; synthetic data carries no real-subject risk.
- Method = `loader`, platform = `synthpai`. Seed via a one-off script (not a migration).
