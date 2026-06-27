# Module — `db/crypto.py`

> **Depends on:** `03-data/encryption.md`, `tables/data_keys.md` · **Consumed by:** repositories that touch T2 columns, erasure · **Hard invalidations:** DEK/crypto change → all T2 columns + erasure · **Version:** v1

The pgcrypto + KMS envelope.

- `unwrap_dek(user_id)` → KMS-decrypt `wrapped_dek` **in memory only**.
- `encrypt/decrypt` → `pgp_sym_*` with the **DEK as a bound parameter**; decryption routed through the `SECURITY DEFINER` function (the app role can't read `data_keys`).
- Media objects: derive/wrap the SSE key from the DEK so crypto-shred covers objects.
- **Never logs keys or plaintext** (rule 1).
