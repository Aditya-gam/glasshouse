# Infra — Backup & Disaster Recovery

> **Depends on:** `03-data/database/retention-and-erasure.md`, `03-data/encryption.md`, `infrastructure.md` · **Version:** v1

## Backups
- **Postgres (Neon)** — continuous WAL + **point-in-time restore (PITR)** to any moment in the retention window; plus a scheduled logical `pg_dump` to **R2** as an off-provider copy.
- **Object storage (R2)** — bucket **versioning** + lifecycle; the off-provider DB dump guards against single-provider loss.
- **No backup holds plaintext** — DB backups + dumps contain only **ciphertext** (T2) and synthetic/derived data; R2 objects are app-side encrypted. A leaked backup is useless without the DEKs.

## Crypto-shred vs. backups (the subtle, important rule)
Crypto-shred works **because** backups hold only ciphertext: deleting a user's DEK (`data_keys`) renders that user's ciphertext **in the live DB, in PITR/WAL history, and in every dump** permanently unrecoverable — with no need to rewrite backups. **Therefore the DEK store must have the *shortest* backup retention** (ideally none, or a very short PITR window): a restore of an old backup that still contained a shredded DEK would *resurrect* erased data. This is a **hard rule** — `data_keys` (and only it) is excluded from long-lived backups; the ciphertext tables can be backed up freely.

## Disaster recovery
- **RPO** — ≤ the PITR granularity (minutes) for the DB; ≤ the dump cadence for the off-provider copy.
- **RTO** — redeploy from IaC (`iac.md`) + a Railway push + restore the Neon branch/dump; target **hours, not days** (portfolio-scale).
- **Runbook** — restore DB (PITR or dump) → re-point the app via env → run the **RLS-isolation + crypto round-trip/shred smoke tests** (`10-testing/*`) → resume workers.
- **Idempotent, disposable workers** — a mid-run crash just re-enqueues (at-least-once + `runs.idempotency_key`); no partial-write corruption, so DR doesn't have to reconcile half-finished runs.
