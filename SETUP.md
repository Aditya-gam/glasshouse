# Account & Secrets Setup — work through this on the side

You **don't need any of this to start.** The tracer bullet → M4 run entirely locally on docker-compose + Ollama ($0). Collect each item as we reach the stage that needs it. Store every value in your **password manager**; when we wire up a stage, either paste the values and I'll write the (gitignored) `.env`, or fill the `.env` yourself.

## Priority — what unblocks what
| When | Need |
|---|---|
| **Local build (tracer → M4)** | nothing — docker-compose + Ollama |
| **M0 — auth** | **Clerk** |
| **M2 — cited benchmark** | **Anthropic** |
| **M7 — deploy** | **Neon · Railway + Redis · Cloudflare R2 · Vercel** + the API tokens |

## 1. Generate yourself (no account) — run each, save the output
```bash
openssl rand -hex 32   # → MASTER_KEY            (MVP encryption key)
openssl rand -hex 32   # → LITELLM_MASTER_KEY    (proxy admin)
openssl rand -hex 32   # → LITELLM_VIRTUAL_KEY   (app → proxy)
```

## 2. Accounts — settings + what to copy
**Clerk** *(M0)* — app with **Email + Google** enabled → copy: Publishable key · Secret key · Webhook signing secret · **JWKS URL** (`https://<frontend-api>/.well-known/jwks.json`).
**Anthropic** *(M2)* — create an API key → copy it (it lives in the proxy, never the app).
**Neon** *(deploy)* — project in **US-West (Oregon)**, enable `pgvector` + `pgcrypto` → copy: pooled string · direct (unpooled) string · a **Neon API key**.
**Railway** *(deploy)* — backend project + a **Redis** plugin → copy: Railway token · **Redis URL**.
**Cloudflare R2** *(deploy)* — bucket `iea-media` + an **S3-compatible API token** → copy: endpoint · access key ID · secret access key · bucket · a **Cloudflare API token**.
**Vercel** *(deploy)* — connect GitHub (Git integration → no CI secret needed).
**HuggingFace** *(eval)* — accept `RobinSta/SynthPAI` terms → a read token.
**VIP** *(optional, images)* — request `eth-sri/privacy-inference-multimodal`; own-photos fallback if gated.

## 3. `.env` templates (fill from your password manager)
**`backend/.env`**
```
DATABASE_URL=            # Neon pooled (sslmode=require); local uses docker-compose
DATABASE_URL_DIRECT=     # Neon direct — Alembic migrations
REDIS_URL=               # Railway Redis (prod); local = redis://localhost:6379
MASTER_KEY=              # openssl rand -hex 32
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
CLERK_JWKS_URL=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=iea-media
LITELLM_BASE_URL=        # local = http://localhost:4000 ; prod = Railway proxy URL
LITELLM_VIRTUAL_KEY=     # openssl rand -hex 32
```
**`frontend/.env`**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=        # same key as backend (@clerk/nextjs server)
NEXT_PUBLIC_API_URL=     # dev = http://localhost:8000 ; prod = deployed backend
```
**gateway / LiteLLM proxy** *(holds the real provider key — the app never does)*
```
ANTHROPIC_API_KEY=
LITELLM_MASTER_KEY=      # openssl rand -hex 32
# LITELLM_VIRTUAL_KEY (above) is registered in the proxy config as the app's key
```
**CI (I'll push via `gh secret set` at the infra stage)**: `NEON_API_KEY`, `CLOUDFLARE_API_TOKEN`, `HF_TOKEN`.

## 4. Guardrails
`.env` is **gitignored**; the **proxy holds the Anthropic key, never the app**; the public repos have secret-scanning + push-protection. Never paste a secret into a committed file — only into `.env` or your password manager.
