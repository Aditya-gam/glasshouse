# API — Endpoints: Imports

> **Depends on:** `03-data/ingestion/*`, `11-roadmap/plans/write-paths.md` (D1, D2, D3) · **Version:** v2 (contract frozen in backend PR #59)

| Method | Path | Behavior |
|---|---|---|
| `POST` | `/v1/imports` | `multipart/form-data`: `platform` (`reddit` \| `x`) + `files[]` → creates an `import_source` and **`202` + `run_id`** (an `ingestion` run: parse → third-party-drop → encrypt/embed). Consent-gated. |
| `GET` | `/v1/imports` | the caller's imports. |
| `GET` | `/v1/imports/{id}` | `ImportRead {id, platform, status, run_id, kept_count, dropped_count, created_at}`. |

- **What is uploaded:** the browser extracts only the files the adapter needs (`comments.csv` + `posts.csv` from a Reddit export; `data/tweets.js` from an X archive). The server also accepts a zip and treats all input as untrusted.
- **Limits:** 50 MB per upload (env-configurable), enforced on the stream. Zips are never extracted to disk; members are read by allow-listed name, with limits on member count and uncompressed size.
- **Staging:** the raw upload is held as an encrypted object until the worker has processed it, then deleted. Third-party content never persists. Filenames are neither logged nor stored.

**Status (2026-10-11):** shapes published; routes return 501 until W2 lands. Photos are added by M4.1.
