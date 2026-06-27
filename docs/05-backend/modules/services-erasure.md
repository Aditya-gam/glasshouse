# Module — `services/erasure.py`

> **Depends on:** `03-data/retention-and-erasure.md`, `crypto.md` · **Rules:** `security-privacy`, `database` · **Consumed by:** `webhooks` (user.deleted), the account API · **Version:** v1

Right-to-erasure, total and verifiable.

1. **Crypto-shred** — delete `data_keys` → all of the user's ciphertext (DB + backups + objects) is unrecoverable.
2. **Cascade delete** — `users` → all owned rows (profiles/items/media/exif/connected_accounts/runs/inferences+children/remediations/run_metrics/consents/memberships).
3. **Object storage** — delete all of the user's S3 objects (media/artifacts) in the same flow.
4. **Retain** — `audit_log` (user_id nulled, legal-obligation basis); SynthPAI untouched.
5. Write the `erase` event to `audit_log`. Idempotent + transactional.
