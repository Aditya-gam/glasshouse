# Infra — Infrastructure

> **Depends on:** `02-architecture/deployment-topology.md`, `decisions/0010-hosting-stack.md` · **Consumed by:** `iac.md`, `environments.md`, `observability.md`, `ci-cd.md` · **Version:** v2 (concrete stack: Railway · Neon · R2 · Vercel · OTel · Terraform)

## Components (v1 stack)
| Component | Provider | Notes |
|---|---|---|
| Frontend | **Vercel** | Next.js; preview deploy per PR |
| API + arq worker + LiteLLM Proxy | **Railway** | three services, one project; private networking; Docker images |
| Postgres | **Neon** | `pgvector` + `pgcrypto`; scale-to-zero; branch per preview |
| Redis | Railway Redis / Upstash | `arq` queue (+ dev cache) |
| Object storage | **Cloudflare R2** | S3-compatible; zero egress; app-side-encrypted bytes |
| KMS | AWS/GCP KMS | wraps the per-user DEK (MVP: env master key → upgrade) |
| Observability | **OTel collector → Sentry/OTLP** | traces/metrics/logs; `run_metrics` in DB (`observability.md`) |

## Network & security topology
- **Public surface = exactly two:** the Vercel app and `POST /webhooks/clerk` (Svix-verified). Everything else is private.
- **Railway private networking** — API ↔ worker ↔ LiteLLM Proxy ↔ Redis talk over the project's internal network; the Proxy is **never** publicly exposed (only the API/worker reach it at its internal `base_url`).
- **Single egress chokepoint** — the LiteLLM Proxy is the only path decrypted-in-memory content leaves to a sub-processor (`trust-boundaries.md`); in `local`/dev (Ollama) there is **no** external content egress.
- **Neon** — TLS (`sslmode=require`); the app connects as a **least-privilege role that cannot read `data_keys`** (decrypt only via the `SECURITY DEFINER` function).
- **R2** — private bucket, no public access; objects app-side encrypted (DEK-derived key), so the store never holds plaintext.

## Connection pooling
- **Neon's pooler** (PgBouncer, transaction mode) backs the app's async pool — bounds connections (each PG backend ≈ 5 MB; the `database` rule).

## Scaling (post-MVP)
- Railway scales the **worker per stage** horizontally behind the Redis queue; the API scales independently. Neon autoscales compute and scales to zero when idle. The gateway's cheap/local-vs-frontier routing (driven by `run_metrics`) is the main cost lever.

## Cost model (rough)
- **Idle ≈ $0–5/mo** (Neon scale-to-zero, Railway per-second, R2 near-free at low volume, Vercel/Sentry free tiers).
- **Light real use ≈ $15–30/mo** compute + the one-off **cited-benchmark** model spend (~$10–50, `feasibility-and-cost.md`).
