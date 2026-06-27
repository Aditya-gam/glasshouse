# Table — `import_sources`

> **Depends on:** `ingestion/overview.md` · **Consumed by:** `items`, `media_assets` (provenance) · **Version:** v1

One data-import event (an upload or a connector pull).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `profile_id` | uuid FK → `profiles` | |
| `platform` | text | `reddit \| mastodon \| x \| google \| linkedin \| photos \| synthpai \| vip` |
| `method` | text | `upload \| connector \| loader` |
| `connected_account_id` | uuid FK → `connected_accounts` | nullable (connector pulls) |
| `created_at` | timestamptz | |

Gives every `item`/`media_asset` its provenance (which import produced it).
