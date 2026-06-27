# API — Auth & Permissions

> **Depends on:** `05-backend/modules/auth-clerk.md` + `rbac.md` + `rls.md`, `.claude/rules/security-privacy.md` · **Consumed by:** every route · **Version:** v1

- **Authentication** — verify the Clerk session JWT via JWKS; resolve the internal `users.id`; set the RLS GUCs (`app.user_id`/`app.org_id`) on the request session. 401 on invalid/expired. API-key auth not used for user requests.
- **Authorization** — `require_permission("run:create")`-style dependency on every route; **deny-by-default** (A01). Re-check **resource ownership** on every object access (no IDOR) — not just "is logged in".
- **Tenant scoping** — RLS **and** an explicit app-layer filter (defense-in-depth, rule 4).
- **Public surfaces** — only the Next.js app and `POST /webhooks/clerk` (signature-verified). Everything else is authenticated.
- **Consent gate** — run-creating routes call `services/consent` first (no run without valid consent; Art. 9 / decoy need their own).
