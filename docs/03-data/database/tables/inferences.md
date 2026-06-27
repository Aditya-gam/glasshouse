# Table — `inferences` (+ `inference_candidates`, `inference_evidence`)

> **Depends on:** `04-ai-engine/output-schema.md` (the contract), `attributes.md`, `calibration.md` · **Consumed by:** dashboard, `remediations`, `defend/*`, `measure/*` · **Hard invalidations:** schema change → repositories + DTOs + migration + ER · **Version:** v2 (normalized — replaces old `predicted_value/top3/evidence_item_ids`)

The attack output, **normalized** (the schema-decision). One `inferences` row per attribute-attempt; ranked `inference_candidates`; per-candidate `inference_evidence`.

### `inferences` (parent)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `run_id` | uuid FK → `runs` | |
| `profile_id` | uuid FK → `profiles` | RLS via owner |
| `attribute_code` | text FK → `attributes` | |
| `modality` | text | `text \| image \| multimodal` |
| `status` | text | `inferred \| abstained` |
| `engine_version` | text | **calibration pin** |
| `reasoning_ct` | bytea | **T2**; Art. 9-scrubbed |
| `reasoning_reveals_art9` | bool | scrub hint |

### `inference_candidates` (ranked 1–3)
| Column | Type | Notes |
|---|---|---|
| `id` PK · `inference_id` FK | | |
| `rank` | int | 1 = top-1 |
| `value` | jsonb | typed per `value_type` (non-sensitive) |
| `value_ct` | bytea | **T2** when `is_art9`/`is_sensitive_tier` |
| `raw_confidence` | numeric | the only number fed to calibration (never shown bare) |
| `confidence_source` | text | `self_reported \| self_consistency` |
| `agreement` | jsonb | `{n_runs, n_agree, fraction}` |
| `calibrated_reliability` | numeric | written by measure (Job 2) — not by the attacker |

### `inference_evidence` (per candidate)
| Column | Type | Notes |
|---|---|---|
| `id` PK · `candidate_id` FK | | |
| `ref_type` / `ref_id` | text / uuid | → `items` \| `media_assets` \| `exif_findings` |
| `modality` | text | text \| image |
| `span` / `region` | jsonb | text offsets / image bbox |
| `proxy_score` · `citation_frequency` | numeric | attack-side ranking (correlational) |
| `marginal_effect` | numeric | **defend-filled** (causal ablation) |
| `rationale_ct` | bytea | **T2**; Art. 9-scrubbed |

**Rules:** special-category values are ciphertext (`value_ct`); `calibrated_reliability` is added by `measure`, never the attacker (separation). Evidence FKs give the dashboard its "six boring posts" join and defend its ablation target.
