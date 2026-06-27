# Table — `eval_results`

> **Depends on:** `measure/benchmarking.md` · **Consumed by:** the CI floor gate, the accuracy/trust view · **Version:** v1

Per-attribute benchmark accuracy for an `eval` run (Job 1).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `run_id` | uuid FK → `runs` | |
| `attribute_code` | text FK → `attributes` | |
| `modality` | text | text \| image |
| `top1_acc` / `top3_acc` | numeric | per attribute |
| `by_hardness` | jsonb | optional breakdown |
| `engine_version` | text | pins the engine measured |

Feeds the **CI floor** (a drop below the floor fails the build) and the credibility number. Calibration + noise model are separate (`calibration`), computed from the same run's raw outputs.
