# Module — `services/eval.py` (Measure)

> **Depends on:** `04-ai-engine/measure/*`, `repositories.md` · **Rules:** `backend`, `testing` · **Consumed by:** `workers/eval` · **Version:** v1

Job 1: benchmark + calibrate the **engine** on labeled data (never user data).

- Run the **same** attack engine over SynthPAI (text) + VIP/own photos (image) → match predictions to `eval_labels` via the per-attribute rule (deterministic: exact/band/GeoNames; **LLM ambiguous-judge** only where needed) → `eval_results` (top-1/top-3, by hardness).
- Compute the **calibration map** + the **run-to-run noise model** (per attribute/modality/confidence-bucket), stored in `calibration`, pinned to `engine_version`.
- Feeds the **CI eval-gate** (`testing` rule): accuracy below the floor fails the build.
