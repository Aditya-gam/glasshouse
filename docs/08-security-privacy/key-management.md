# Security — Key Management

> **Depends on:** `03-data/encryption.md`, `0003-pgcrypto-encryption.md` · **Version:** v1

- **Envelope encryption** — one **DEK per user**, stored only as `data_keys.wrapped_dek` (wrapped by **KMS**). Unwrapped **in memory, per request**.
- **Decryption boundary** — pgcrypto `pgp_sym_*` with the DEK as a **bound parameter** (never interpolated → no key in query logs); reachable only via the `SECURITY DEFINER` function; the app role **cannot read `data_keys`**.
- **Object + token keys** — media SSE key + connector tokens derive from / are wrapped by the same DEK, so **crypto-shred covers them too**.
- **Crypto-shred** — erasure deletes the DEK → all ciphertext (DB + backups + objects) is unrecoverable.
- **Rotation** — KMS master key rotation supported; DEK re-wrap on rotation. MVP may use an env master key with an explicit upgrade-to-KMS note.
