# Ingestion — Canonical Item

> **Depends on:** `database/tables/items.md` + `media_assets.md`, `measure/distribution-shift.md` (language) · **Consumed by:** retrieval, the attack engine · **Version:** v1

The normalized unit every source maps to — one piece of the subject's own content.

**Text item** → `items`: `{ profile_id, import_source_id, owner_user_id, text, posted_at, platform, lang, is_subject_authored, content_hmac, embedding }`.
**Image item** → `media_assets` (+ `exif_findings`): `{ profile_id, import_source_id, owner_user_id, object_ref, mime, width, height, is_subject_authored, content_hmac }`.

**Normalization:** strip platform cruft (markup, boilerplate); unify timestamps to UTC + keep the original tz (a location/routine signal); **detect language** (drives the distribution-shift caveat); compute the dedupe HMAC; embed text once (sentence-transformers) for retrieval.

The canonical shape is **source-agnostic** so the attack/measure/defend engine runs identically on uploads, connector pulls, and benchmark loaders.
