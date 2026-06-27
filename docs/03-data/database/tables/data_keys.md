# Table — `data_keys`

> **Depends on:** `0003-pgcrypto-encryption.md`, `encryption.md` · **Consumed by:** the `SECURITY DEFINER` decrypt function only · **Version:** v1

The KMS-wrapped per-user DEK; the **crypto-shred** target.

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid PK FK → `users` | one DEK per user |
| `wrapped_dek` | bytea | DEK wrapped by KMS |
| `kms_key_id` | text | the KMS key reference |
| `created_at` | timestamptz | |

**The application role has NO read policy on this table** (CLAUDE.md rule 3). Plaintext is reachable only through the `SECURITY DEFINER` decrypt function, with the DEK passed as a **bound parameter**. Erasure deletes this row → all of the user's ciphertext (incl. backups) is unrecoverable.
