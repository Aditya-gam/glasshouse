# ADR 0002 — Clerk for auth + RBAC

**Status:** Accepted (v1)

**Context.** Multi-tenant app needing secure identity now and an org/role model for the future exec/enterprise tier.

**Decision.** **Clerk** (session JWTs verified via JWKS) + **RBAC** (organizations + roles: `owner`/`admin`/`analyst`/`viewer`).

**Rationale.** Hosted, secure, fast to integrate; org/role primitives shape the future enterprise product; webhooks handle user lifecycle. Rolling our own is a security/time sink; Auth0 is heavier for no gain here.

**Consequences.** Clerk is a sub-processor; JWT verification + webhook sync (`user.created/deleted`); the RBAC model lives in the DB; every tenant query scoped by user/org.
