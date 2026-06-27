# Table — `eval_labels`

> **Depends on:** `0006-synthpai-eval.md`, `ingestion/sources/loader-synthpai.md` + `dataset-vip.md` · **Consumed by:** `measure/benchmarking.md` · **Version:** v1

Ground-truth labels for the benchmark sets (SynthPAI text, VIP/own-photo image). **Synthetic / own-data only** — never real third parties.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `profile_id` | uuid FK → `profiles` | a `synthpai`/benchmark profile |
| `attribute_code` | text FK → `attributes` | |
| `true_value` | jsonb | the labeled value (+ `hardness` if graded) |
| `modality` | text | text \| image |

Seeded once; unencrypted (no data subject); exempt from erasure. Job-1 benchmarking compares predictions to these.
