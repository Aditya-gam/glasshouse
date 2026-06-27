# Architecture — Tech Stack

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `CLAUDE.md` (locked decisions), `04-ai-engine/feasibility-and-cost.md` (model slots), `04-ai-engine/llm-gateway.md`, `decisions/0013-polyrepo.md`
> - **Consumed by:** `05-backend/*`, `07-frontend/*`, `09-infra-devops/*`, `10-testing/*`
> - **Hard invalidations:** swapping a core framework → update backend/frontend layout + CI + infra
> - **Version:** v2 (+uv; Vitest/testcontainers/Schemathesis/Playwright; generated client; Semgrep/Trivy; **two repos** per ADR 0013)

**Topology:** two separate repositories — **`backend`** (Python) and **`frontend`** (TypeScript) — per ADR 0013. The backend publishes its OpenAPI schema; the frontend generates a typed client from it.

| Area | Choice |
|---|---|
| **Backend** | FastAPI (Python 3.12) · **uv** (deps + lockfile) · SQLAlchemy 2.0 async + Alembic · `arq` (Redis) workers · pydantic v2 · `httpx` · `pydantic-settings` (12-factor env) |
| **Database** | PostgreSQL + **pgvector** (embeddings) + **pgcrypto** (field encryption); per-user DEK wrapped by **KMS** |
| **AI gateway** | **LiteLLM Proxy** (self-hosted Docker) · `instructor` (Pydantic-validated structured output) |
| **Models** | **Ollama** (local/dev, $0) · cloud **LLM + VLM** (cited runs) — slots in `feasibility-and-cost.md` |
| **Free/local libs** | sentence-transformers (embeddings) · GeoNames via `geopy`/`pgeocode` · Microsoft Presidio (PII) · `Pillow`/`piexif`/`exiftool` (EXIF) · CLIP (image triage) |
| **Frontend** | Next.js App Router · TypeScript strict · **pnpm** · Tailwind v4 · TanStack Query · **generated OpenAPI client** (`@hey-api/openapi-ts`) + **Zod** at the trust boundary |
| **Auth** | **Clerk** (JWT verified via JWKS) + RBAC (organizations + roles) |
| **Containers** | **Docker** — **uv** multi-stage; **distroless** prod + **slim** hot-reload dev (one multi-target backend Dockerfile: `api`/`worker`) |
| **Testing** | `pytest` + `pytest-asyncio` + `httpx` AsyncClient · **testcontainers** (real Postgres) · **Schemathesis** + **Hypothesis** (backend) · **Vitest** + RTL + MSW · **Playwright** E2E (frontend) |
| **Quality/CI** | `ruff` + `mypy` strict · **Semgrep** (SAST) · **Trivy** (image scan) · `pre-commit` (backend) / husky + lint-staged (frontend) · **release-please** · conventional commits · one Alembic migration per schema change |
| **Hosting** | **Vercel** (frontend) · **Railway** (backend) · **Neon** (Postgres) · **Cloudflare R2** (storage) — ADR 0010; hybrid deploy (GHA gates + platform-native) — ADR 0012 |

Rationale for each major choice is recorded as an ADR in `decisions/`. Cost discipline: free/local by default; the capable-LLM slots are the only paid surface (`feasibility-and-cost.md`).
