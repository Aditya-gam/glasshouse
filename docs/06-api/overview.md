# API — Overview

> **Depends on:** `.claude/rules/api-design.md`, `02-architecture/run-lifecycle.md`, `05-backend/error-model.md` · **Consumed by:** `07-frontend/*`, contract tests · **Version:** v1

REST/HTTP, governed by the `api-design` rule.

## Conventions
- **Versioned `/v1`** (URL path); **resource-oriented** (nouns + standard methods); **stateless**.
- **Errors:** RFC 9457 **`application/problem+json`** (`type/title/status/detail/instance`); never leak internals.
- **Async runs:** `POST /v1/runs {type}` → **`202` + `run_id`**; **`GET /v1/runs/{id}`** polls; **`GET /v1/runs/{id}/events`** streams live progress via **SSE**; **idempotency key** on create.
- **Lists:** **cursor pagination** (opaque cursor, not offset).
- **AuthZ on every route**; scope every tenant query (RLS + app check); re-check ownership (**no IDOR**).
- **OpenAPI is the contract** — generated from the DTOs (`schemas.md`), published, used for contract tests + client codegen. Clients **ignore unknown fields** (forward-compat).

## Resource map
`imports` · `connectors` · `runs` · `inferences` · `remediations` · `eval` · `account` · `webhooks`.
