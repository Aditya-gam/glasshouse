# ADR 0013 — Polyrepo (separate backend + frontend repositories)

**Status:** Accepted (v2 — added a **hub** repo for the spec/prototype/portfolio front-door; all repos **public**) — supersedes the monorepo assumption in ADR 0012 (v1) and the early `repo-structure.md`.

**Context.** The product is two deployables in two languages — a Python (FastAPI) backend and a TypeScript (Next.js) frontend — shipped to two platforms (Railway, Vercel). Earlier docs assumed a single monorepo with path-filtered CI.

**Decision.** Three repositories (all **public**): a **hub** — `glasshouse` (holds `docs/` + `prototype/` + the portfolio README, linking to the code repos) — plus two self-contained code repos, **`backend`** (Python) and **`frontend`** (TypeScript), each with its own Dockerfile(s), CI pipeline, tests, pre-commit, release-please, and deploy. *(Public: free unlimited Actions + the prod-promote Environment gate works free; private would need Enterprise for that gate.)*
- **Shared API contract:** the backend publishes its **OpenAPI schema** (`openapi.json`) as a versioned CI artifact; the frontend's CI downloads it and regenerates a **typed client** (`@hey-api/openapi-ts`), committed in the frontend repo. **Zod** still validates at the trust boundary.
- **E2E:** Playwright lives in the **`frontend`** repo and runs against the deployed **preview environments**.
- **Local dev:** each repo runs independently — the `backend` `docker-compose` brings up its stack (Postgres/Redis/LiteLLM/Ollama + api/worker); the `frontend` `next dev` points at `localhost:8000` via env.

**Rationale.** Independent deploy + versioning per platform; simpler, single-purpose CI per repo (no path-filtering); cleaner language/tooling separation (uv vs npm; `pre-commit` vs husky); independent access control. The cost — a cross-repo API contract — is handled by publishing the OpenAPI spec and generating the client, which also *guarantees* FE/BE type agreement. Atomic cross-stack changes become two coordinated PRs; accepted as a worthwhile tradeoff for the separation.

**Consequences.** No monorepo tooling (Turborepo) and no path-filtered CI. The OpenAPI spec is the published contract; a **drift guard** in the frontend CI fails if the committed client is stale. `repo-structure.md` describes two trees. ADR 0012 is amended for the deploy model. A breaking API change is a deliberate two-repo sequence (publish spec → regenerate client → use it).
