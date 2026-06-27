# Testing — Crypto

> **Depends on:** `03-data/encryption.md`, `05-backend/modules/crypto.md` · **Version:** v1

Prove the encryption + erasure actually work.

- **Round-trip** — `encrypt(text, dek)` → `decrypt(ct, dek)` returns the original; the DEK is passed as a **bound parameter** (assert no key in the SQL string).
- **Crypto-shred** — after deleting the DEK, the stored ciphertext is **unrecoverable** (decrypt fails) — proving erasure is total.
- **Isolation** — the app role **cannot read `data_keys`**; decryption only via the `SECURITY DEFINER` function.
- **Object/token** — media SSE + connector tokens are recoverable only with the DEK (shred covers them).
- **No leakage** — assert no plaintext/keys appear in logs during these operations.
