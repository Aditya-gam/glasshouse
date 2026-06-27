# Security — Authorization Model

> **Depends on:** `05-backend/modules/auth-clerk.md` + `rbac.md` + `rls.md`, `.claude/rules/security-privacy.md` · **Version:** v1

Defense-in-depth against **A01 Broken Access Control** (#1).

- **Authentication** — Clerk JWT verified via JWKS → internal `users.id`.
- **RBAC** — roles (`owner/admin/analyst/viewer`) → permission matrix; `require_permission(code)` on every route; **deny-by-default**.
- **Tenant scoping (two layers)** — RLS GUC policies **and** explicit app-layer filters; never read owned tables without a scope (rule 4).
- **No IDOR** — re-check **resource ownership** on every object access, not just "is authenticated."
- **Consent gate** — run-creating actions require a valid consent row first.
- **Key material** — outside the model entirely (no role can read `data_keys`).
