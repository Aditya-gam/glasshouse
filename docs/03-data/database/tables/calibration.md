# Table — `calibration`

> **Depends on:** `04-ai-engine/measure/calibration.md` + `noise-floor-and-variance.md`, `attributes.md` · **Consumed by:** `per-user-scoring` (reliability), `defend/noise-floor-and-variance.md`, the dashboard · **Version:** v1 NEW

The engine's **calibration map** *and* **run-to-run noise model**, both **engine properties** measured in Job-1 benchmarking and pinned to an `engine_version`. One row per `(engine_version, attribute, modality, signal, n, confidence_bucket)`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `engine_version` | text | the (model+prompt+pipeline) pin — must match the inference's |
| `attribute_code` | text FK → `attributes` | |
| `modality` | text | `text \| image` (multimodal = roadmap) |
| `signal` | text | `self_consistency` (or `self_reported`) |
| `n` | int | self-consistency N the map was built on |
| `confidence_bucket` | numeric | raw-confidence bucket (heteroscedastic) |
| `empirical_accuracy` | numeric | calibrated reliability for the bucket |
| `noise_std` | numeric | the **noise floor** (run-to-run variance) for the bucket |
| `ece` | numeric | expected calibration error (diagnostic) |
| `created_at` | timestamptz | |

**Rules:** an inference's calibrated reliability = lookup by `(engine_version, attribute, modality, signal, n, bucket)`; a **mismatch is detectable, never silent**. Changing the attack model/prompt/pipeline/N/judge → **recompute** (new rows under a new `engine_version`) — the hard invalidation. The `adversary` engine has its own rows (for the defense before/after + noise floor).
