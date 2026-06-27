# Security — DSAR: Export & Erasure

> **Depends on:** `05-backend/modules/services-export.md` + `services-erasure.md`, `03-data/retention-and-erasure.md` · **Version:** v1

Data-subject rights (GDPR Arts. 15/17/20).

- **Access / portability (export)** — `POST /v1/account/export` assembles the user's own data (decrypted, structured) → an authenticated, expiring download. Never includes others' data or keys.
- **Erasure** — `DELETE /v1/account`:
  1. **crypto-shred** (delete the DEK → all ciphertext unrecoverable),
  2. cascade delete owned rows,
  3. delete object-storage media/artifacts,
  4. retain `audit_log` (user_id nulled, legal-obligation basis); SynthPAI untouched.
- Both write to `audit_log`; both are idempotent + transactional. Also triggered by the Clerk `user.deleted` webhook.
