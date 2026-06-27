# Module — `services/ingestion.py`

> **Depends on:** `03-data/ingestion/*`, `repositories.md`, `crypto.md` · **Rules:** `security-privacy`, `backend` · **Consumed by:** `workers/ingestion` · **Version:** v1

Turns a user's own footprint into normalized, encrypted, retrievable items.

- **Per-source adapters** (`upload/connector/loader`) parse → normalize to the **canonical item / media_asset**.
- **Third-party drop FIRST** — `is_subject_authored=false` is discarded **before** encryption/embedding (rule 5; never persists).
- Then **encrypt (T2)** via `crypto`, **embed** (sentence-transformers), **EXIF-extract** (images) — all scope-bound, idempotent (`content_hmac`).
- **Consent-gated** — runs only under a valid `self_audit` consent. **No content logged.**
- Connector pulls use read-only tokens from `connected_accounts` (decrypted in memory only).
