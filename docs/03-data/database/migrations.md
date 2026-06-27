# Database — Migrations

> **Depends on:** `tables/*`, `er-diagram.md` · **Consumed by:** `09-infra-devops/ci-cd.md` · **Hard invalidations:** any schema change → one new Alembic migration · **Version:** v1

**Alembic**, async engine. **One migration per schema change** (CLAUDE.md convention); `alembic upgrade head` in CI + deploy.

- **`0001_init`** — the full v2 schema (all tables; **native enums `role_t` + `run_status_t`** only; the other controlled vocabularies — `attributes.value_type`, `modality`, run `type`, inference `status`, `action`, connector `platform` — are **`text` + `CHECK`** per the table specs, kept text for evolvability; pgvector + pgcrypto extensions, indexes, RLS policies, the `SECURITY DEFINER` decrypt function).
- **Seed migrations** — reference data: `attributes` (from `attributes-taxonomy.md`), `permissions` / `role_permissions`. SynthPAI/VIP labels are loaded by the **loaders** (`ingestion/sources/loader-synthpai.md`, `dataset-vip.md`), not a migration.
- **Extensions:** `CREATE EXTENSION vector, pgcrypto;`.
- **Policy:** never edit a shipped migration; add a new one. Each migration is reversible where practical.

## Zero-downtime (expand-contract)
Migrations run during **rolling deploys** (old + new code briefly coexist — `09-infra-devops/ci-cd.md`), so they must be **backward-compatible**:
- **EXPAND → migrate → CONTRACT** across releases: add **nullable** columns/tables → deploy code that writes them → backfill → add constraints / drop old columns in a *later* release.
- **Never rename or drop** a column/table while the old code still runs (a rename = add-new + backfill + drop-old over two releases).
- **Indexes `CONCURRENTLY`**; **no `DEFAULT` on a large-table column add**; a **`lock_timeout`** in each migration (fail fast rather than queue behind a lock → outage).

DDL is generated from the table specs in `tables/*` (the authoritative design).
