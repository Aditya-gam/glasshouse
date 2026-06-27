# API — Endpoints: Connectors

> **Depends on:** `03-data/tables/connected_accounts.md`, `ingestion/sources/connector-*.md` · **Version:** v1

| Method | Path | Behavior |
|---|---|---|
| `POST` | `/v1/connectors` | `{platform}` → start read-only OAuth (returns the authorize URL). |
| `GET` | `/v1/connectors/callback` | finish OAuth → store the **encrypted** token (`connected_accounts`, read-only scopes). |
| `GET` | `/v1/connectors` | list linked accounts (status, handle — never tokens). |
| `DELETE` | `/v1/connectors/{id}` | revoke (clear token ciphertext). |
| `POST` | `/v1/connectors/{id}/sync` | **`202` + `run_id`** — pull the user's **own** content (ingestion). |

Reddit/Mastodon live; **X = upload-first** (connector gated behind paid access).
