# Source — Connector: Mastodon (live)

> **Depends on:** `connected_accounts.md`, `0008-live-connectors-v1.md` · **Version:** v1

Live read-only pull of the user's own Mastodon statuses via the open API.

- **Auth:** OAuth, **read** scope; per-instance (the user supplies their instance); token encrypted in `connected_accounts`.
- **Pull:** the authenticated account's own statuses + media (paginated).
- **Authorship:** own account → kept; boosts of others are scrubbed.
- Method = `connector`, platform = `mastodon`. Open API = no paid tier, no friction.
