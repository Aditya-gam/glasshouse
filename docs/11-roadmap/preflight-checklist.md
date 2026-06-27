# Roadmap — Pre-flight Checklist (accounts · data · secrets)

> **Depends on:** `09-infra-devops/*`, `secrets-management.md`, `decisions/0013-polyrepo.md` · **Version:** v2 (polyrepo — two `.env.example` files)

The non-code prep to knock out **before** the build — much of it doable from a phone while away.

## A. Accounts to create (mobile-friendly) — keys → a password manager
- [ ] **GitHub** — **two repos** (`backend`, `frontend`; private to start) + Actions.
- [ ] **Neon** — Postgres (note the connection string; `pgvector` + `pgcrypto`).
- [ ] **Railway** — API + worker + LiteLLM Proxy (later) — the `backend` repo.
- [ ] **Cloudflare R2** — a bucket + an S3-compatible API token.
- [ ] **Vercel** — the `frontend` repo.
- [ ] **Clerk** — auth app (publishable + secret keys + webhook signing secret + JWKS URL).
- [ ] **An LLM provider** — Anthropic / OpenAI / Gemini key (cited runs; held in the proxy).
- [ ] **Sentry** (optional) — error/trace DSN.
- [ ] **KMS** — AWS/GCP KMS, *or* note "MVP: env master key → upgrade later."

## B. Datasets — request/accept now (access can take time)
- [ ] **SynthPAI** — accept the terms on HuggingFace (`RobinSta/SynthPAI`); synthetic, safe.
- [ ] **VIP** — request/confirm access (`eth-sri/privacy-inference-multimodal`); **code MIT, image data separate terms.** If gated, the own-photo set is the fallback.

## C. Secrets contract — **TWO `.env.example` files** (one per repo; ADR 0013)
> Split per repo so neither is forgotten — **create both**, committed empty, real values per-env.

**`backend` repo → `.env.example`:**
```
# db / cache
DATABASE_URL=                 # Neon (sslmode=require)
REDIS_URL=                    # arq queue
# crypto
KMS_KEY_ID=                   # or MASTER_KEY for the MVP
# auth (Clerk — server side)
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
CLERK_JWKS_URL=
# object storage (R2, S3-compatible)
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
# llm gateway (app holds ONLY the proxy virtual key; provider keys live in the proxy)
LITELLM_BASE_URL=
LITELLM_VIRTUAL_KEY=
# observability
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
```

**`frontend` repo → `.env.example`:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_API_URL=          # backend base URL (e.g. http://localhost:8000)
```
Rules (`secrets-management`): `.env` git-ignored; **both** `.env.example` committed empty; secrets in the platform store (Vercel/Railway) — deploy auth via the platform Git integrations, scoped tokens/OIDC only for infra (Terraform); never logged; different per dev/staging/prod.

## D. When you're home (needs your machine)
- [ ] Install **Ollama** + pull dev models: **Qwen3** (8B/32B), **Phi-4** (14B), **Gemma 3**, a local **VLM** (Qwen2.5-VL / Gemma 3); embeddings via sentence-transformers.
- [ ] `docker-compose up` (the `backend` repo) — Postgres (pgvector/pgcrypto) + Redis + the LiteLLM Proxy.
- [ ] **Then:** declare planning done → I start at the tracer bullet (`tasks-backend.md`).
