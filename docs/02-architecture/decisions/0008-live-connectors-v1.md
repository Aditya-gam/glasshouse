# ADR 0008 — Live connectors (Reddit/Mastodon; X upload-first)

**Status:** Accepted (v1)

**Context.** Manual export is friction; live read-only pulls of the user's *own* accounts are better UX.

**Decision.** **Live read-only OAuth connectors** for **Reddit** (free API) and **Mastodon** (open API); **X = upload-first** (live pull deferred to X's paid tier).

**Rationale.** Reddit/Mastodon are free/open, so live pull is cheap and smooth; X's live API is paid, so the X archive upload keeps v1 free. Upload-only everywhere would add friction for no reason on the free platforms.

**Consequences.** New table `connected_accounts` (encrypted OAuth tokens, read-only scopes); ingestion connector sources; an X paid-tier live connector on the roadmap.
