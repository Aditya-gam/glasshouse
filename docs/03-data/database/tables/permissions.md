# Table — `permissions` / `role_permissions`

> **Depends on:** `memberships.md` · **Consumed by:** API authz + RLS · **Version:** v1

The role→permission matrix, checked in the API and mirrored in RLS.

**`permissions`** — `id PK · code (e.g. run:create, inference:read, account:erase) · description`.
**`role_permissions`** — `role_t role · permission_id FK` (which role grants which permission).

Seeded reference data. RBAC model shaped for the future enterprise tier; v1 self-audit users are effectively `owner` of their own profile.
