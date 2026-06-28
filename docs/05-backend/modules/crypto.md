# Module — `db/crypto.py`

> **Depends on:** `03-data/encryption.md`, `tables/data_keys.md` · **Consumed by:** repositories that touch T2 columns, erasure · **Hard invalidations:** DEK/crypto change → all T2 columns + erasure · **Version:** v1

The pgcrypto + KMS envelope.

**Decrypt model A (decided at T2): the per-user DEK never leaves Postgres.** Field crypto runs inside the `SECURITY DEFINER` functions, which unwrap the DEK in-database; the app passes only the **master key as a bound parameter** (local-MVP env key → KMS-derived in prod), never a raw per-user DEK.

- `encrypt_field(user_id, plaintext, master_key)` / `decrypt_field(user_id, ciphertext, master_key)` — `SECURITY DEFINER` (fixed `search_path`); they read `wrapped_dek`, unwrap the DEK into a local variable, and run `pgp_sym_*`. The app role has **EXECUTE only** and **cannot read `data_keys`**; keys are **bound parameters**, never interpolated.
- `provision_user_dek(user_id, master_key)` — `SECURITY DEFINER`, **owner-only**: generates + wraps the DEK entirely in SQL, so the raw DEK never enters the app process.
- *(Prod KMS:* the app KMS-unwraps the **master key** in memory per request and passes it as the bound parameter; the per-user DEK is still unwrapped only inside the function — `unwrap_dek` is the master-key step, not a per-user-DEK handoff to the app.)*
- Media objects: derive/wrap the SSE key from the DEK so crypto-shred covers objects.
- **Never logs keys or plaintext** (rule 1).
