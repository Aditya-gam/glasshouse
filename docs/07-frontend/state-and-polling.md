# Frontend — State & Polling

> **Depends on:** `.claude/rules/frontend.md`, `06-api/endpoints/runs.md` · **Version:** v1

- **Typed API access** — calls go through the **generated OpenAPI client** (`@hey-api/openapi-ts`, from the backend's published `openapi.json`); **Zod** parses/validates at the trust boundary. *Why:* types can't drift from the contract; runtime validation still guards untrusted responses.
- **Server state via TanStack Query** — caching, dedupe, retries; initial data fetched server-side (Server Components / DAL), not refetched on the client unnecessarily.
- **Run progress = polling + SSE** — on `POST /v1/runs` → `202 {run_id}`, the client **subscribes to `GET /v1/runs/{id}/events` (SSE)** for live stage/partial updates, and **falls back to polling `GET /v1/runs/{id}`** if the stream drops. *Why:* SSE gives a moving progress bar; polling is the resilient fallback (the decision).
- **No secrets client-side** — only `NEXT_PUBLIC_*`; everything sensitive stays in the DAL/server.
- **Optimistic UI sparingly** — runs are async + authoritative; show real status, not guesses.
- **Reconnect/cleanup** — close SSE on unmount; resume on remount via the run id.
