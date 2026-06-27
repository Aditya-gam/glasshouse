# Source — Connector: Reddit (live)

> **Depends on:** `connected_accounts.md`, `0008-live-connectors-v1.md` · **Version:** v1

Live read-only pull of the user's **own** Reddit history via the free API.

- **Auth:** OAuth, **read-only** scopes; token stored encrypted in `connected_accounts`.
- **Pull:** the authenticated user's own comments + posts (paginated); **non-commercial**, ~60–100 req/min — rate-limit-aware.
- **Authorship:** own account → kept.
- Method = `connector`, platform = `reddit`. The cleanest live demo (free + Reddit-style text).
