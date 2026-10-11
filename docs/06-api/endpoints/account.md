# API — Endpoints: Account

> **Depends on:** `05-backend/modules/services-consent.md` + `services-export.md` + `services-erasure.md`, `11-roadmap/plans/write-paths.md` (D4, D5, D8) · **Rules:** `security-privacy` · **Version:** v2 (contract frozen in backend PRs #59 + #60; revoke by path, synchronous erasure, export download route)

Data-subject rights + consent.

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/v1/account` | `AccountRead {consents, retention, connected_accounts, current_policy_version}`. `consents` is `ConsentRead {self_audit, art9_inference, decoy}`, each a `ConsentState {granted, policy_version, granted_at}`. |
| `POST` | `/v1/account/consents` | `ConsentGrant {purpose, policy_version}` → `200 AccountRead`. `policy_version` is the version the client displayed; a version that is not the server's current one is refused with `409` so the user is shown the current text. |
| `DELETE` | `/v1/account/consents/{purpose}` | revoke → `204`. Revocation is immediate and stops processing; it does not delete data. |
| `PUT` | `/v1/account/retention` | `RetentionUpdate {retention: retain \| discard}` → `200 AccountRead`. |
| `POST` | `/v1/account/export` | **`202` + `run_id`** — an `export` run assembles the DSAR bundle. |
| `GET` | `/v1/account/export/{run_id}` | owner-only, expiring download of the finished bundle. |
| `DELETE` | `/v1/account` | **erasure**, synchronous → `204`: audit event → delete objects → delete the user (cascade + crypto-shred). The client then deletes the Clerk identity. |

Every consent/export/erase writes to `audit_log` through `write_audit_event`.

**Status (2026-10-11):** the shapes above are published in `openapi.json`; the routes return 501 until W1 (consent, account read), W3 (erasure), W4 (retention) and W5 (export) land. `policy_version` on the grant, `current_policy_version` on the read and the `409` on a stale version were added by the contract amendment WC.1 (backend PR #60); the check itself is enforced from W1.
