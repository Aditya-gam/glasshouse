# Module — `auth/webhooks.py`

> **Depends on:** `auth-clerk.md`, `03-data/tables/users.md` · **Consumed by:** Clerk · **Version:** v1

`/webhooks/clerk` — keeps the `users`/`memberships` mirror in sync.

- **Verify the webhook signature** (Svix) before processing.
- Handle `user.created` / `user.deleted` (→ erasure flow) and membership/org sync.
- One of only two public endpoints (with the Next.js app); idempotent handlers.
