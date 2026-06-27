# Table — `memberships`

> **Depends on:** `users.md`, `organizations.md`, `permissions.md` · **Consumed by:** RBAC checks (API + RLS) · **Version:** v1

User ↔ organization membership + role.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → `users` | |
| `org_id` | uuid FK → `organizations` | |
| `role` | role_t | `owner \| admin \| analyst \| viewer` |
| `created_at` | timestamptz | |

Role drives the permission matrix (`permissions.md`), enforced in both the API layer and RLS.
