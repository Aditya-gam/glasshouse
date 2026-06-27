# Table — `organizations`

> **Depends on:** `0002-clerk-auth.md` · **Consumed by:** `memberships`, future org-owned `profiles` · **Version:** v1

Tenancy unit (Clerk Organizations); shaped for the future exec/enterprise tier (org-owned multi-subject profiles).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | RLS `app.org_id` |
| `clerk_org_id` | text UK | |
| `name` | text | |
| `created_at` | timestamptz | |

In v1 most profiles are user-owned (self-audit); org-owned profiles are the roadmap.
