# Architecture — Repo Structure

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `tech-stack.md`, `decisions/0013-polyrepo.md`, `05-backend/layout.md` (backend detail), `07-frontend/app-shell-and-layout.md` (frontend detail)
> - **Consumed by:** `09-infra-devops/ci-cd.md` + `github-actions.md`, contributors
> - **Version:** v3 (**polyrepo** — two repos; uv; generated client; per-repo CI)

**Three repositories** (ADR 0013), all **public**: a **hub** — `glasshouse` (this folder: `docs/` + `prototype/` + the portfolio README) — plus two self-contained **code** repos, **`backend`** (Python) and **`frontend`** (TypeScript), each with its own Docker, CI, tests, pre-commit, release-please, and deploy. The backend publishes `openapi.json`; the frontend generates its typed client from it, and syncs from the hub's `prototype/` (sibling path during local dev).

## `backend` repo (Python · FastAPI · uv)
```
backend/
├── app/                      FastAPI · SQLAlchemy 2.0 async · arq · pydantic v2 (LAYERED — Clean Arch)
│   ├── api/v1/               routers (thin: validate + delegate); problem+json errors
│   ├── services/             business logic (ingestion, inference, eval, anonymize, consent, erasure, export)
│   ├── repositories/         the ONLY place SQL lives
│   ├── domain/               pure logic (matching, scoring, clustering, ablation, noise) — no IO
│   ├── workers/              arq tasks (attack, eval, remediation)
│   ├── gateway/              LiteLLM Proxy client (instructor) — the single model egress
│   ├── db/                   session, RLS GUCs, engine
│   ├── auth/                 Clerk JWT/JWKS, RBAC, webhooks
│   ├── ingestion/ retrieval/ source adapters · embedding retrieval
│   └── main.py               app factory; /healthz
├── alembic/                  versions/ (one migration per change) + env.py
├── tests/                    unit/ (pure domain + Hypothesis) · integration/ (testcontainers Postgres) · fixtures/ (SynthPAI slice, golden JSON)
├── gateway/                  LiteLLM Proxy service — config.yaml (slots, budgets, fallbacks) + Dockerfile
├── infra/                    terraform/ (Neon, R2, KMS, DNS) (→ 09-infra-devops/iac.md)
├── scripts/                  export_openapi (→ openapi.json) · seed_synthpai · db reset
├── Dockerfile                multi-target (builder → api / worker); distroless prod, slim dev
├── docker-compose.yml        local dev: Postgres (pgvector/pgcrypto) · Redis · LiteLLM Proxy · Ollama + hot-reload dev target
├── pyproject.toml + uv.lock  deps (uv); ruff + mypy + pytest config
├── .pre-commit-config.yaml   ruff · mypy · secret scan
├── .github/workflows/        ci.yml · release.yml (release-please) · eval-nightly.yml
├── .env.example              the backend secrets contract; .env is git-ignored
├── Makefile                  make dev · make test · make migrate
└── README.md
```

## `frontend` repo (TypeScript · Next.js · pnpm)
```
frontend/
├── app/                      App Router · (marketing) · (app)/{onboarding,dashboard,attribute,defend,connect,account}
│   └── <route>/_components/  route-specific components (colocated, private folder)
├── components/               shared only — ui/ (shadcn primitives) + bespoke (AttributeCard, DefendFrontier, …)
├── lib/                      dal/ (server-only data access) · api/ (GENERATED client @hey-api/openapi-ts + Zod at the boundary) · hooks (TanStack Query)
├── e2e/                      Playwright critical paths (→ 10-testing/e2e-tests.md); runs vs preview envs
├── __tests__/                Vitest + RTL + MSW (→ 10-testing/frontend-tests.md)
├── public/                   favicons, manifest, og-image (from design-system/brand)
├── instrumentation.ts        OpenTelemetry
├── proxy.ts                  Next 16 request proxy (NOT the auth boundary — see the frontend rule)
├── package.json + pnpm-lock.yaml  deps (pnpm) + scripts (incl. client codegen)
├── .husky/ + lint-staged     eslint · prettier · tsc on staged files
├── .github/workflows/        ci.yml · release.yml (release-please)
├── next.config.ts · tsconfig.json (strict) · eslint.config.mjs
├── .env.example              NEXT_PUBLIC_API_URL etc.; .env is git-ignored
└── README.md
```

## Conventions
- **No path-filtering** — each repo's CI is single-purpose (polyrepo, ADR 0013).
- **The contract:** backend `scripts/export_openapi` → `openapi.json` (published as a CI artifact); the frontend's codegen consumes it; a **drift guard** fails if the committed client is stale.
- **Dockerfiles** per deployable (backend `api`/`worker` via targets; gateway separate); the same backend image is promoted staging → prod.
- **Conventional commits**; `ruff`+`mypy` / `tsc`+ESLint clean; CI gates on tests + the SynthPAI eval floor.
- Backend internals → `05-backend/layout.md`; frontend → `07-frontend/*`; design tokens come from the personal design system (`~/Documents/Projects 2/design-system`).
