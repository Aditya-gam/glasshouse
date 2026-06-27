# Database — RLS Policies

> **Depends on:** `tables/*`, `02-architecture/trust-boundaries.md` · **Consumed by:** `05-backend/modules/rls.md`, `10-testing/rls-isolation-tests.md` · **Hard invalidations:** new owned table → add a policy + an isolation test · **Version:** v1 (reconciled with v2 tables)

Defense-in-depth: **RLS *and* app-layer scope checks** (CLAUDE.md rule 4). Per request, after JWT verification:
```sql
SET LOCAL app.user_id = '<users.id>';
SET LOCAL app.org_id  = '<organizations.id>';
```

**Owned tables** — `items`, `media_assets`, `connected_accounts`, `runs`, `inferences`, `remediations`, `import_sources`, `run_metrics`: rows visible where `owner_user_id = app.user_id` (or the subject's `profile` belongs to `app.org_id`). Child rows (`inference_candidates`, `inference_evidence`, `exif_findings`) inherit scope through their parent's policy (join-enforced).

**Special cases:**
- `data_keys` — **no app-readable policy**; reachable only via the `SECURITY DEFINER` decrypt function.
- SynthPAI / benchmark profiles (`user_id IS NULL`) — **read-only** to all authenticated app roles (shared eval data).
- `calibration`, `attributes`, `permissions` — global read (reference/engine data).
- `audit_log` — append-only; no row-level read for normal users.

Every owned table gets a matching **isolation test** (`10-testing/rls-isolation-tests.md`).
