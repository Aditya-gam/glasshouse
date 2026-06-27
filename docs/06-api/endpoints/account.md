# API — Endpoints: Account

> **Depends on:** `05-backend/modules/services-consent.md` + `services-export.md` + `services-erasure.md` · **Rules:** `security-privacy` · **Version:** v1

Data-subject rights + consent.

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/v1/account` | profile + consents + linked accounts + retention setting. |
| `POST` / `DELETE` | `/v1/account/consents` | grant / revoke a consent (purpose; Art. 9; decoy). |
| `PUT` | `/v1/account/retention` | switch retain-encrypted ↔ process-then-discard. |
| `POST` | `/v1/account/export` | **`202`** → DSAR export bundle (expiring authenticated download). |
| `DELETE` | `/v1/account` | **erasure** — crypto-shred + cascade + object deletion. |

Every consent/export/erase writes to `audit_log`.
