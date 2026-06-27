# Database — Overview

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `archive/database.md` (the flat source this splits/supersedes), `02-architecture/system-overview.md`, `04-ai-engine/output-schema.md` + `attributes-taxonomy.md` + `measure/*` (the engine shapes), the `03-data` schema decisions
> - **Consumed by:** `er-diagram.md`, `tables/*`, `05-backend/modules/repositories.md`, API DTOs
> - **Hard invalidations:** any table change → repositories + API DTOs + Alembic migration + ER diagram (`00-traceability.md`)
> - **Version:** v2 (reconciled: +media/EXIF, +connectors, +calibration/noise, normalized inferences, enriched attributes — supersedes `archive/database.md`)

PostgreSQL + **pgvector** + **pgcrypto**. The conceptual reference; per-table detail in `tables/*`.

## What v2 adds over the flat `archive/database.md`
- **Images:** `media_assets` (image refs) + `exif_findings` (deterministic metadata).
- **Connectors:** `connected_accounts` (encrypted OAuth tokens, read-only).
- **Engine properties:** `calibration` (confidence→empirical + the run-to-run **noise model**), pinned to `engine_version`.
- **Normalized attack output:** `inferences` → `inference_candidates` → `inference_evidence` (replaces the old `predicted_value/top3/evidence_item_ids` columns).
- **Enriched `attributes`:** `value_type · match_method · is_art9 · is_sensitive_tier · allowed_values · severity` (drops the single `is_special_category`).

## Storage decisions (this subtree)
- **Attack output = normalized child tables** (candidates + evidence are queried/written relationally).
- **Image bytes = object storage** (Cloudflare R2, app-side-encrypted), with `media_assets` holding the ref + metadata; the small EXIF findings live in the DB.
- **Retention = configurable per user:** default **retain-encrypted** (re-runs + the defend loop need it), with a per-user **process-then-discard** option for privacy-maximalists.

## Storage tiers (→ `storage-tiers.md`)
**T1** derived/safe (metrics, scores, non-special values) · **T1′** invertible (`items.embedding`, treated as personal) · **T2** raw/sensitive consented (encrypted text/media-refs/reasoning/special-category values) · **T3** never persisted (third-party content) · **synthetic** (SynthPAI, unencrypted, erasure-exempt).

Encryption, RLS, and retention/erasure rules: `encryption.md`, `rls-policies.md`, `retention-and-erasure.md`.
