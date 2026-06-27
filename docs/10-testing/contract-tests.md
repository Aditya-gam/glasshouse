# Testing — Contract Tests

> **Depends on:** `06-api/schemas.md`, `.claude/rules/api-design.md`, `decisions/0013-polyrepo.md` · **Version:** v2 (Schemathesis · generated-client drift · polyrepo)

Keep the **cross-repo** API contract honest — the backend publishes OpenAPI; the frontend generates its client from it.

- **Schema conformance (Schemathesis)** — property-based fuzzing from the **OpenAPI** schema: every endpoint is exercised for spec conformance, unexpected 500s, and security edge cases (injection / path-traversal / malformed payloads). Errors match **RFC 9457** problem+json.
- **Generated-client drift guard** — the frontend regenerates its typed client (`@hey-api/openapi-ts`) from the backend's **published `openapi.json`** and **fails CI if the committed client differs** (replaces the old hand-mirrored Zod↔DTO drift test).
- **Forward-compat** — clients tolerate unknown fields; servers may add fields without breaking.
- **Zod at the boundary** — the generated client supplies types; **Zod still parses/validates** untrusted responses at the trust boundary.
- Run in CI (backend: Schemathesis; frontend: drift guard); a contract break **fails the build** before it reaches a client.
