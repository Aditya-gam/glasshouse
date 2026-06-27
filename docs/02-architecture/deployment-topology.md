# Architecture — Deployment Topology

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `system-overview.md`, `tech-stack.md`, `decisions/0010-hosting-stack.md`, `decisions/0013-polyrepo.md`
> - **Consumed by:** `09-infra-devops/*`
> - **Hard invalidations:** adding a service (e.g., the proxy) → update infra + secrets management
> - **Version:** v2 (reconciled with ADR 0010 hosting: Railway/Neon/R2/Vercel; **polyrepo** per ADR 0013; distroless images)

Weekend-friendly target; shaped to scale later. **Two repos** (ADR 0013): the `frontend` repo → **Vercel**, the `backend` repo → **Railway**; each deploys via its platform's **native Git integration** (automatic PR preview envs), gated by GitHub Actions.

| Piece | Host |
|---|---|
| **Frontend** | **Vercel** — the `frontend` repo (Next.js; native Git deploy, PR preview envs) |
| **API** | **Railway** — the `backend` repo; **distroless** image (one service) |
| **Workers** (`arq`) | same platform — one worker service (scales per stage later) |
| **LiteLLM Proxy** | a **Docker service** alongside API/workers; holds **all provider keys**; the app holds only its virtual key(s); budget caps + separation assertion |
| **DB** | **Neon** Postgres (encryption-at-rest, `pgvector`, `pgcrypto`; **branching** for per-PR preview DBs) |
| **Redis** | managed instance (queue + dev cache) |
| **KMS** | cloud KMS (MVP: a single env-provided master key, with an explicit upgrade-to-KMS note) |
| **Object storage** | **Cloudflare R2** (zero-egress; app-side-encrypted) *(or process-then-discard media)* |
| **Ollama** | **local dev only** — not deployed; cited runs route to cloud LLM/VLM via the proxy |

**Scaling (post-MVP):** workers scale horizontally per stage; the queue decouples API latency from model latency; gateway routing (cheap/local for bulk, frontier for the capable slots) is the main cost lever, driven by `run_metrics`. Infra detail + secrets in `09-infra-devops/*`.
