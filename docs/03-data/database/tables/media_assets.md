# Table — `media_assets`

> **Depends on:** `02-architecture/decisions/0007-multimodal-v1.md`, `ingestion/images-and-exif.md`, the **object-storage** decision · **Consumed by:** `exif_findings.md`, `inference_evidence`, `image-inference.md`, `image-remediation.md` · **Version:** v1 NEW

One ingested **image** (the user's own). **Bytes live in object storage** (Cloudflare R2, app-side-encrypted); this row holds the ref + metadata. The small, structured EXIF findings are in `exif_findings`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `profile_id` | uuid FK → `profiles` | |
| `owner_user_id` | uuid FK → `users` | **RLS** scope |
| `import_source_id` | uuid FK → `import_sources` | |
| `object_ref` | text | R2 object key (app-side-encrypted under the user DEK) |
| `content_hmac` | text | keyed HMAC for dedupe |
| `mime` | text | `image/jpeg` … |
| `width` / `height` | int | for normalized-bbox evidence |
| `is_subject_authored` | bool | **false → dropped at ingestion** (rule 5) |
| `expires_at` | timestamptz | retention (configurable) |
| `created_at` | timestamptz | |

**Rules:** third-party images dropped at ingestion (T3). Erasure crypto-shreds the DEK **and** deletes the object (object lifecycle wired into `retention-and-erasure.md`). Under **process-then-discard** (per-user option), the object is deleted right after the run, keeping only derived results.
