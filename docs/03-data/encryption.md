# Data — Encryption

> **Depends on:** `0003-pgcrypto-encryption.md`, `database/tables/data_keys.md`, `08-security-privacy/key-management.md` · **Consumed by:** `05-backend/modules/crypto.md`, `services-erasure.md` · **Version:** v2 (reconciled: +media objects, +connector tokens)

## Envelope
Each user has a **DEK** stored only as `data_keys.wrapped_dek` (KMS-wrapped). The app unwraps it **in memory, per request**.

## Field encryption (pgcrypto)
`pgp_sym_encrypt/decrypt`; the **DEK is always a bound parameter** (never string-interpolated — prevents key leakage into query logs); decryption **only** via the `SECURITY DEFINER` function; the app role **cannot read `data_keys`**.

## Object encryption (media)
Media bytes in S3 use **SSE**, ideally with a per-user key derived from / wrapped by the DEK, so **crypto-shred covers objects too** (deleting the DEK + the objects renders them unrecoverable).

## Token encryption (connectors)
`connected_accounts` access/refresh tokens are T2 ciphertext under the same DEK.

## Crypto-shred & dedupe
Erasure deletes the DEK → all ciphertext (DB + backups + objects) is unrecoverable. Deduplication uses a **keyed HMAC** (`content_hmac`), never a plain hash (a plain hash of short text is reversible).
