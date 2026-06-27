# Backend — Error Model

> **Depends on:** `api-design` rule (RFC 9457), `backend` rule · **Consumed by:** `06-api/*`, services, workers · **Version:** v1

One consistent error surface; transport concerns at the edge only.

- **Typed domain exceptions** raised in services/domain (e.g. `ConsentMissing`, `NotOwner`, `RunFailed`) — transport-agnostic.
- **Mapped to RFC 9457 `application/problem+json` at the API edge** (one exception handler): `type` (absolute URI), `title`, `status`, `detail`, `instance` (+ extension members for machine data). **Never leak stack traces/internals.**
- **Workers** convert failures to `runs.status='failed'` + a non-sensitive `error`; terminal failures → dead-letter.
- **Fail closed** (`security-privacy`): on ambiguity (authz/consent/authorship), deny. Bounded gateway repair-retry (N≈2) then fail — never loop.
