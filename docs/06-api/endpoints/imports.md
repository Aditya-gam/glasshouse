# API — Endpoints: Imports

> **Depends on:** `03-data/ingestion/*` · **Version:** v1

| Method | Path | Behavior |
|---|---|---|
| `POST` | `/v1/imports` | multipart upload of an export/photo set → creates an `import_source` and **`202` + `run_id`** (ingestion run: parse → third-party-drop → encrypt/embed/EXIF). |
| `GET` | `/v1/imports` | list (cursor). |
| `GET` | `/v1/imports/{id}` | import status + counts (kept vs dropped). |

Large uploads stream to object storage; consent-gated; third-party content never persists.
