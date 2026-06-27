# API — Endpoints: Webhooks

> **Depends on:** `05-backend/modules/webhooks.md` · **Version:** v1

Inbound only.

| Method | Path | Behavior |
|---|---|---|
| `POST` | `/webhooks/clerk` | **Svix signature-verified**; handle `user.created` / `user.deleted` (→ erasure flow) + membership/org sync. Idempotent. |

One of only two public endpoints (with the Next.js app). Rejects unsigned/replayed requests; never trusts the payload without verifying the signature.
