# Infra — Local Dev

> **Depends on:** `04-ai-engine/feasibility-and-cost.md`, `tech-stack.md`, `decisions/0013-polyrepo.md` · **Version:** v2 (polyrepo · uv · hot-reload)

Build + debug the entire pipeline at **$0**, across the two repos (`backend`, `frontend`).

## Backend repo
- **`docker-compose`** brings up Postgres (pgvector/pgcrypto), Redis, and the LiteLLM Proxy; **Ollama** runs the models locally (OpenAI-compatible, incl. `/embeddings`) — the proxy points at it like a cloud provider (`local` profile). Healthchecks + `depends_on: condition: service_healthy` so nothing starts before its deps are ready.
- **`uv`** manages dependencies (`uv sync` from `pyproject.toml` + `uv.lock`).
- **Hot-reload dev target** (slim image): source is **bind-mounted** and the servers watch — `uvicorn app.main:app --host 0.0.0.0 --reload` (API) and **watchfiles**-wrapped `arq` (worker) — so code edits apply instantly, no rebuild. Named volumes mask `/app/.venv`. A dependency change (`uv.lock`) needs `uv sync`/rebuild; code changes are live.
- **`make dev`** runs API + worker + db; **`make test`** runs pytest (**testcontainers** spins a real Postgres); `alembic upgrade head` for the schema.

## Frontend repo
- **`next dev`** (Fast Refresh — instant component updates) pointed at the backend via env (`NEXT_PUBLIC_API_URL=http://localhost:8000`). No cross-repo compose needed.
- The typed API client is generated from the backend's published `openapi.json` (`@hey-api/openapi-ts`); regenerate when the contract changes.

## Models & data
- Switch the model profile (`local` ↔ `cloud`) by env var — same code, different model names — and spend on cloud only for the **cited benchmark**.
- Seed: SynthPAI loader (text eval) + own labeled photos (image eval).
