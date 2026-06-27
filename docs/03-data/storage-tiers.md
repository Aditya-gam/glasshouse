# Data — Storage Tiers

> **Depends on:** `database/tables/*`, `encryption.md` · **Consumed by:** `08-security-privacy/data-flow-pii-map.md` · **Version:** v2 (reconciled: +media, +exif, +tokens)

How every kind of data is classified and protected.

| Tier | What | Protection |
|---|---|---|
| **T1** derived/safe | metrics, eval scores, non-special candidate `value`, run status, calibration | plaintext; cascade-deleted |
| **T1′** derived/invertible | `items.embedding` (pgvector) | treated as **personal data**, never anonymous; cascade-deleted |
| **T2** raw/sensitive (consented) | `items.text_ct`, `inference reasoning_ct` + `rationale_ct`, Art.9/sensitive candidate `value_ct`, `exif_findings.value_ct` (GPS), `connected_accounts` tokens, `remediations.edited_text_ct`, **media objects** (Cloudflare R2, app-side-encrypted under the DEK) | pgcrypto / SSE-encrypted; retention-bound; crypto-shreddable |
| **T3** never persisted | third-party-authored content | **dropped at ingestion** (rule 5) |
| **synthetic** | SynthPAI / VIP labels | unencrypted; erasure-exempt (no data subject) |

Media bytes live in object storage (Cloudflare R2, T2, app-side-encrypted under the user DEK), with the `media_assets` ref + small EXIF findings in the DB. Process-then-discard drops T2 content right after a run.
