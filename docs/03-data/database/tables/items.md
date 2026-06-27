# Table — `items`

> **Depends on:** `ingestion/canonical-item.md`, `encryption.md` · **Consumed by:** retrieval (embeddings), `inference_evidence`, remediation · **Version:** v1

One normalized **text** item — the subject's own. (Images are `media_assets`.)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `profile_id` | uuid FK → `profiles` | |
| `owner_user_id` | uuid FK → `users` | **RLS** |
| `import_source_id` | uuid FK → `import_sources` | |
| `text_ct` | bytea | **T2** pgcrypto-encrypted |
| `content_hmac` | text | keyed HMAC for dedupe |
| `embedding` | vector | **T1′** invertible → treated as personal data (pgvector) |
| `is_subject_authored` | bool | **false → dropped at ingestion** (rule 5) |
| `created_at` / `expires_at` | timestamptz | retention (configurable) |

**Rules:** third-party items never persist (T3). The embedding is invertible, so it is **never** treated as anonymous and cascade-deletes with the item. Under process-then-discard, `text_ct` is dropped post-run (the embedding may be kept for re-retrieval per the user's choice — finalized in `retention-and-erasure.md`).
