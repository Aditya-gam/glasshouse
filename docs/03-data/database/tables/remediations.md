# Table — `remediations`

> **Depends on:** `04-ai-engine/defend/*` (text/image remediation, independent-adversary, noise-floor, utility), `inferences.md` · **Consumed by:** the defend-simulation dashboard · **Hard invalidations:** schema change → repositories + DTOs + migration · **Version:** v2 (proven before/after + intervals + decoy + utility)

One proposed-and-proven remediation for a targeted inference. **Advise-only** — a *suggestion*, never applied.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `profile_id` | uuid FK → `profiles` | RLS |
| `inference_id` | uuid FK → `inferences` | the targeted attribute |
| `run_id` | uuid FK → `runs` | the remediation run |
| `action` | text | `rewrite \| remove \| strip_exif \| crop \| inpaint \| decoy` |
| `edited_text_ct` | bytea | **T2** suggested rewrite (text) |
| `span_changes` | jsonb | localized `{span, op, replacement}` list (text) |
| `artifact_ref` | text | object ref for a remediated image (image) |
| `confidence_before` / `confidence_after` | numeric | **calibrated**, via the held-out evaluator |
| `ci_before` / `ci_after` | jsonb | bootstrap intervals |
| `significant` | bool | drop beat the noise floor? |
| `value_recovery_before` / `_after` | bool | true value in the adversary's top-3? |
| `utility_score` | jsonb | meaning + readability (graded) |
| `is_decoy` | bool | decoy mode (opt-in, consented) |
| `evaluator_engine_version` | text | the adversary engine pin |
| `created_at` | timestamptz | |

**Rules:** the before/after is measured by the **held-out independent adversary** on both endpoints (not the attacker); `significant` requires beating the noise floor; `is_decoy=true` requires the per-use consent (`ethics-and-tone.md`). Never implies false safety.
