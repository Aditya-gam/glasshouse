# Module — `repositories/`

> **Depends on:** `03-data/database/*` (the schema) · **Consumed by:** services · **Hard invalidations:** table/DTO change → the repo + its callers · **Version:** v2 (+media, +connected_accounts, +calibration, +inference candidates/evidence)

Data access per aggregate — **the only place SQL lives**.

- One repo per aggregate: `items`, `media`, `runs`, `inferences` (+candidates/evidence), `eval`, `remediations`, `consent`, `connected_accounts`, `calibration`, `audit`.
- Every read is **scope-bound** (RLS + an explicit app-layer filter); T2 columns go through `crypto.py`.
- Repos return domain/DTO objects, never raw rows, so services + the API stay decoupled from the schema.
