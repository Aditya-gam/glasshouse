# Module — `services/export.py`

> **Depends on:** `repositories.md`, `crypto.md`, `08-security-privacy/dsar-export-erasure.md` · **Rules:** `security-privacy` · **Consumed by:** the account API · **Version:** v1

DSAR — the data-subject's "export my data" right.

- Assemble a structured bundle of the user's own data (profiles, items, media, inferences, remediations, consents) — **decrypted in memory** via `crypto`, scope-bound.
- Delivered over an authenticated, expiring download; **never** includes other users' or key material.
- Writes the `export` event to `audit_log`. (GDPR right of access / portability.)
