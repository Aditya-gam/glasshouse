# Module — `auth/rbac.py`

> **Depends on:** `03-data/tables/permissions.md` + `memberships.md` · **Consumed by:** route deps · **Version:** v1

The role→permission matrix + a `require_permission("run:create")` dependency.

- Static matrix (`owner/admin/analyst/viewer` → permission codes), mirrored in RLS.
- v1: a self-audit user is effectively **owner** of their personal scope; the matrix is already complete for the future enterprise roles.
- Enforced **in the API layer AND RLS** (defense-in-depth).
