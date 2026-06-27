# Backend — Layout

> **Depends on:** `overview.md`, `archive/backend-structure.md` · **Consumed by:** `modules/*`, contributors · **Version:** v2 (reconciled)

```
backend/app/
  main.py · config.py · deps.py
  auth/        clerk.py · rbac.py · webhooks.py
  db/          session.py · rls.py · crypto.py
               models/ identity · keys · content · media · runs · calibration
  domain/      attributes · matching · scoring · clustering(meaning) · ablation · noise
  repositories/  items · media · runs · inferences · eval · remediations
                 consent · connected_accounts · calibration · audit
  ingestion/   parse + DROP third-party + encrypt + embed + EXIF; sources/ (upload/connector/loader)
  retrieval/   embeddings + pgvector (text) · CLIP triage (image)
  gateway/     client.py (OpenAI client @ proxy base_url) · instructor models · slots
  services/    ingestion · inference(Attack) · eval(Measure) · anonymize(Defend)
               consent · erasure · export
  workers/     queue.py · attack · eval · remediation · purge
  api/v1/ · schemas/
migrations/ (alembic) · tests/ · pyproject.toml
```

**Notes (v2):** `gateway/` is a **proxy client** (no provider SDKs in-process); `db/models/` gains `media` (media_assets/exif_findings) + `calibration`; `domain/` gains the meaning-clustering, ablation, and noise primitives the engine needs; `retrieval/` is its own concern. SQL lives **only** in `repositories/`.
