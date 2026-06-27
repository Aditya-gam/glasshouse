# Module — `db/rls.py`

> **Depends on:** `03-data/rls-policies.md` · **Consumed by:** `deps.py`, every scoped session · **Version:** v1

Sets the RLS context per request.

- `SET LOCAL app.user_id` / `app.org_id` after JWT verification, on the scoped session.
- Paired with **app-layer scope checks** (defense-in-depth — rule 4): never read `items`/`inferences`/`remediations`/`media_assets` without a scope.
- `data_keys` has no app-readable policy (reached only via the decrypt function).
