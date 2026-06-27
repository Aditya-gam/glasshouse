# Table — `profiles`

> **Depends on:** `0005-self-audit-scope.md`, `0006-synthpai-eval.md` · **Consumed by:** `items`, `media_assets`, `runs`, `inferences`, … (the subject anchor) · **Version:** v1

Unifies the two subject kinds through one pipeline: self-audit users and SynthPAI authors.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `type` | text | `self \| synthpai` |
| `user_id` | uuid FK → `users` | **NULL for synthpai** |
| `org_id` | uuid FK → `organizations` | future org-owned |
| `created_at` | timestamptz | |

`type='synthpai'` rows are synthetic (no data subject), unencrypted, and **exempt from erasure**; `type='self'` rows carry the user's encrypted, retention-bound content.
