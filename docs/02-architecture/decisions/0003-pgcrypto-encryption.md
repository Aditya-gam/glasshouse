# ADR 0003 — pgcrypto + per-user DEK encryption

**Status:** Accepted (v1)

**Context.** We store sensitive **inferred** attributes and the user's own content; we must support hard erasure.

**Decision.** **Per-user DEK** (KMS-wrapped) + **pgcrypto** field-level encryption; decryption only via a `SECURITY DEFINER` function with keys as **bound parameters**; **crypto-shred** (delete the DEK) on erasure.

**Rationale.** Per-user DEKs make erasure instant and total (delete the key → all ciphertext is unrecoverable); the app role can't read `data_keys`; bound parameters keep keys out of query logs. App-layer-only crypto puts key handling in the app and risks key leakage into logs.

**Consequences.** Keys never string-interpolated into SQL; the `SECURITY DEFINER` decrypt boundary; erasure = DEK deletion; T2 columns enumerated in `03-data/encryption.md`.
