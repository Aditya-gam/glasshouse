# Ingestion — Overview

> **Depends on:** `01-product/scope-v1.md`, `database/tables/items.md` + `media_assets.md` + `import_sources.md` · **Consumed by:** `canonical-item.md`, `third-party-drop.md`, `images-and-exif.md`, `sources/*`, `05-backend/modules/services-ingestion.md` · **Version:** v1

The pipeline that turns a user's own footprint into normalized, encrypted, retrievable items.

```
source (upload | connector | loader)
  → parse (per-source adapter)
  → normalize → canonical item / media_asset
  → THIRD-PARTY DROP (is_subject_authored=false → discard, never persisted)
  → encrypt (T2) + embed (T1′) + EXIF-extract (images)
  → items / media_assets (+ import_source provenance)
```

- **Self-audit only:** the subject is the signed-in user; connectors are **read-only** into the user's *own* accounts.
- **Idempotent + deduped** (`content_hmac`) so re-imports don't duplicate.
- Per-source adapters (`sources/*`) handle format quirks + authorship determination; the shared steps (normalize, drop, encrypt, embed) are uniform.

Details: `canonical-item.md` (the shape), `third-party-drop.md` (the rule), `images-and-exif.md` (the image path).
