# Testing — Fixtures

> **Depends on:** `strategy.md`, `.claude/rules/backend.md` · **Version:** v1

- **DB isolation** — `pytest` fixtures: a **session-scoped testcontainers** Postgres (pgvector/pgcrypto) + **transaction rollback** per test; no shared state.
- **Gateway stub** — a fake gateway returning **golden-JSON** fixtures (emission shapes) so service tests don't hit the network; deterministic.
- **SynthPAI fixture** — a small seeded slice for integration + the eval gate.
- **DI overrides** — `app.dependency_overrides` to inject fakes (session, current user, gateway) — **not** monkeypatching internals.
- **Async client** — `httpx.AsyncClient` + `ASGITransport` for API tests.
- **Crypto fixture** — a test DEK + KMS stub for round-trip/shred tests.
