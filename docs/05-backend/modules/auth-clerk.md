# Module — `auth/clerk.py`

> **Depends on:** `0002-clerk-auth.md`, `03-data/tables/users.md` · **Consumed by:** `deps.py`, every protected route · **Version:** v1

Verifies the Clerk session JWT and resolves the internal user.

- Cache **JWKS**; verify signature + claims (`iss`, `aud`, `exp`); extract `clerk_user_id` (`sub`) + active `org_id`.
- Resolve the internal `users.id` (the RLS anchor); 401 on invalid/expired.
- API-key auth is **not** used for user requests (Clerk OAuth only).
