# Table — `users`

> **Depends on:** `02-architecture/decisions/0002-clerk-auth.md` · **Consumed by:** every owned table (RLS anchor) · **Version:** v1

Identity mirror of Clerk; the RLS scope anchor.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | internal id (RLS `app.user_id`) |
| `clerk_user_id` | text UK | the JWT `sub` |
| `email` | text | |
| `created_at` | timestamptz | |

Synced via the `/webhooks/clerk` handler (`user.created/deleted`). Deleting a user **cascades** to all owned rows + the DEK (crypto-shred).
