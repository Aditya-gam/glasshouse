# Table — `attributes`

> **Depends on:** `04-ai-engine/attributes-taxonomy.md` (authoritative) · **Consumed by:** `inferences`, `calibration`, `output-schema` validation, the persona lens · **Hard invalidations:** changing the attribute set / value format / sensitivity → output-schema + calibration + crypto + consent gating · **Version:** v2 (enriched per taxonomy; drops `is_special_category`)

Reference data: the 8 PAI attributes. Seeded from `attributes-taxonomy.md` (the source of truth).

| Column | Type | Notes |
|---|---|---|
| `code` | text PK | `age sex location birthplace occupation education relationship income` |
| `label` | text | display |
| `value_type` | text | `numeric \| categorical \| geo_hier \| freetext_semantic` (the output-schema discriminator) |
| `match_method` | text | tolerance band / exact-normalized / LLM-judge-graded / semantic |
| `is_art9` | bool | GDPR special category (e.g. `birthplace`) → encrypted + Art. 9 consent |
| `is_sensitive_tier` | bool | our stricter tier (`birthplace, income, sex, relationship`) → encrypted |
| `allowed_values` | jsonb | for categorical/ordinal (the single source the schema validates against) |
| `severity` | jsonb | per-persona weights (at-risk / job-seeker) → drives the persona lens |

**Rules:** `is_art9`/`is_sensitive_tier` drive encryption (which `inference_candidates.value` columns are ciphertext) + consent gating. `allowed_values` is the **only** authoritative enum list (the prompt/schema mirror it non-authoritatively). A change here is a **hard invalidation** (recompute calibration + update the schema enum + prompts).
