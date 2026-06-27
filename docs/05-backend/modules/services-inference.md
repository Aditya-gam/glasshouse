# Module — `services/inference.py` (Attack)

> **Depends on:** `04-ai-engine/attack/*`, `gateway/`, `repositories.md` · **Rules:** `backend`, `security-privacy` · **Consumed by:** `workers/attack` · **Version:** v1

Runs the text + image attack and persists structured results.

- **Retrieve** (always-on high-recall: per-attribute embedding queries ∪ recency ∪ always-include, token-capped) → **joint Profiler pass for all 8 attributes**, wrapped by **self-consistency (N≈3)** with meaning-clustered agreement → **targeted escalation** on persona-critical/uncertain attributes.
- **Images:** per-image VLM pass (context-only, hierarchical geo-CoT) + EXIF merge.
- **Normalize** emission → canonical (GeoNames, band/bracket parsers) → `inferences (+candidates+evidence)` + `run_metrics`; tag `engine_version` (the calibration pin).
- **Consent-gated; content decrypted in memory only; never logged.** Per-run budget cap enforced via the gateway.
