# Table — `connected_accounts`

> **Depends on:** `02-architecture/decisions/0008-live-connectors-v1.md`, `encryption.md` · **Consumed by:** `ingestion/sources/connector-*.md`, `repositories.md` · **Hard invalidations:** schema change → repositories + DTOs + migration + ER · **Version:** v1 NEW

Encrypted, read-only OAuth links to the user's *own* connector accounts (Reddit, Mastodon, X). Holds tokens so the ingestion workers can pull the user's content.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → `users` | RLS owner |
| `platform` | text | `reddit \| mastodon \| x` |
| `account_handle` | text | the linked handle (display) |
| `access_token_ct` | bytea | **T2** pgcrypto-encrypted |
| `refresh_token_ct` | bytea | **T2** (nullable) |
| `scopes` | text | **read-only** scopes granted |
| `expires_at` | timestamptz | token expiry |
| `status` | text | `active \| revoked \| expired` |
| `created_at` | timestamptz | |

**Rules:** scopes are read-only (we only pull the user's own content); tokens are T2 (encrypted, crypto-shreddable); revoking a connection sets `status='revoked'` and clears the token ciphertext. Never used to write to any platform (advise-only). Token storage details in `08-security-privacy/key-management.md`.
