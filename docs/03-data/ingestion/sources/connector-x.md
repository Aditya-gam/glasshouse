# Source — Connector: X (paid tier — roadmap)

> **Depends on:** `connected_accounts.md`, `0008-live-connectors-v1.md`, `upload-x-archive.md` · **Version:** v1 (deferred)

**Live X pull requires X's paid API tier**, so v1 defaults to the **archive upload** (`upload-x-archive.md`). This connector is specified but **gated** behind the user provisioning paid access.

- **Auth:** OAuth read; token encrypted in `connected_accounts`; only active if a paid app credential is configured.
- **Pull:** the authenticated user's own tweets/replies/media.
- **Authorship:** own account → kept; retweets/quotes scrubbed.
- Method = `connector`, platform = `x`. **Roadmap** — until then, X = upload-first.
