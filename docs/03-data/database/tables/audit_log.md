# Table — `audit_log`

> **Depends on:** `08-security-privacy/dsar-export-erasure.md` · **Consumed by:** compliance/DSAR · **Version:** v1

Append-only record of export / delete / consent events.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → `users` | **set NULL on erasure** (retained under legal-obligation basis) |
| `action` | text | `consent_granted \| consent_revoked \| export \| erase \| connect \| disconnect` |
| `detail` | jsonb | non-sensitive metadata |
| `created_at` | timestamptz | |

Append-only (no updates/deletes). On user erasure, `user_id` is nulled but the event is retained for the legal-obligation record; never stores content.
