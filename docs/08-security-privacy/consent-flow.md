# Security — Consent Flow

> **Depends on:** `03-data/tables/consents.md`, `05-backend/modules/services-consent.md`, `07-frontend/user-flows/onboarding-consent.md` · **Version:** v1

GDPR lawful basis, enforced.

- **Purposes** — `self_audit` (Art. 6); **`art9_inference`** (explicit Art. 9 consent for special categories, e.g. birthplace); **`decoy`** (global opt-in + per-use confirm).
- **The gate** — **no run executes** without a valid, non-revoked `consents` row covering the subject + purpose (deny-by-default). Special-category inference is masked without Art. 9 consent.
- **Lifecycle** — granted at onboarding (before any processing) and manageable in account settings; **revocation is immediate**; every grant/revoke → `audit_log` with the `policy_version`.
