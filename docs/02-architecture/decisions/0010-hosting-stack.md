# ADR 0010 — Hosting & infrastructure stack

**Status:** Accepted (v1)

**Context.** v1 needs a cheap, weekend-friendly, but credibly production-shaped deploy (it's a "hire me" artifact): a Next.js frontend; a FastAPI API + an `arq` worker + the LiteLLM Proxy (Docker); Postgres with `pgvector` + `pgcrypto` + custom roles (the `SECURITY DEFINER` decrypt + crypto-shred); Redis; object storage; KMS.

**Decision.**
- **Frontend:** **Vercel** (Next.js; preview per PR).
- **Compute (API · arq worker · LiteLLM Proxy):** **Railway** — usage-based, native Docker, private networking, one project/canvas; the retention purge rides `arq`'s in-process cron (no platform cron needed).
- **Database:** **Neon** serverless Postgres — `pgvector` + `pgcrypto`, full role control, **scale-to-zero** (≈$0 idle), **branching** (a DB branch per PR/preview).
- **Object storage:** **Cloudflare R2** — S3-compatible, **zero egress**; media/exports are app-side encrypted under a DEK-derived key.
- **KMS:** cloud KMS (AWS or GCP) wraps the per-user DEK; MVP may start with an env-provided master key (explicit upgrade note).
- **Redis:** managed (Railway Redis or Upstash) for the `arq` queue.
- **Observability:** **full OpenTelemetry** (collector + the three pillars) → Sentry / an OTLP backend; `run_metrics` in DB. **IaC:** **Terraform** for the cloud resources (Neon, R2, KMS, Vercel, DNS) + committed Dockerfiles/`railway` config.

**Rationale.** Railway + Neon + R2 keep idle cost near zero and setup to a weekend, while Neon's role control preserves the encryption/RLS design and R2's zero egress suits download-heavy media. Full OTel + Terraform (chosen over a lighter stack) make the deploy genuinely production-shaped — part of the portfolio value — and portable off any single vendor.

**Consequences.** Provider config lives in `09-infra-devops/infrastructure.md` + `iac.md`; the egress + decryption boundaries are unchanged (`trust-boundaries.md`); Neon branching feeds preview environments (`environments.md`); **crypto-shred must account for DB backups/PITR** (`backup-dr.md`); vendor swaps are bounded by Terraform + the attached-resources rule.
