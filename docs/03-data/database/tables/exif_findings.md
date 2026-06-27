# Table — `exif_findings`

> **Depends on:** `media_assets.md`, `ingestion/images-and-exif.md`, `04-ai-engine/image-inference.md` (§3) · **Consumed by:** `inference_evidence`, `image-remediation.md` (strip-proof) · **Version:** v1 NEW

Deterministic metadata extracted from an image (Tier-1, no model). GPS is the high-value, provable location leak; the rest is context/transparency.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `media_asset_id` | uuid FK → `media_assets` | |
| `finding_type` | text | `gps \| timestamp \| camera \| software` |
| `value_ct` | bytea | **T2** encrypted (e.g. GPS lat/lon) |
| `captured_at` | timestamptz | from timestamp findings (nullable) |
| `created_at` | timestamptz | |

**Rules:** GPS findings are **T2** (encrypted — they pinpoint location). They feed a deterministic `location` evidence item (provable) and the `image-remediation` strip-proof ("coordinates present or not"). The VLM is **blind** to these (independent visual inference — `image-inference.md` §4). `camera/software` are extracted for transparency but **not** used as attribute evidence in v1.
