# Security — Data-Flow / PII Map

> **Depends on:** `03-data/storage-tiers.md`, `02-architecture/trust-boundaries.md` · **Version:** v1

Where personal data lives, moves, and crosses out.

- **In** — own content via upload/connector/loader → **third-party-drop** (T3 discarded) → encrypt (T2) + embed (T1′) + EXIF.
- **At rest** — **T2** (encrypted: text, media objects, reasoning, sensitive values, GPS, tokens) · **T1′** (embeddings, invertible → personal) · **T1** (derived/safe) · **synthetic** (SynthPAI, no subject).
- **In use** — decrypted **in memory only** for a run.
- **Out** — the **only egress** is the LiteLLM Proxy → cloud LLM/VLM (decrypted-in-memory, **never logged/persisted**). Object storage holds encrypted media.
- **Deleted** — crypto-shred + cascade + object deletion; or process-then-discard right after a run.

PII never reaches logs, metrics, or any non-sub-processor egress.
