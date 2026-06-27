# Security — Sub-Processors

> **Depends on:** `02-architecture/trust-boundaries.md` · **Version:** v1

Third parties that may process personal data — disclosed in the DPA / privacy policy.

| Sub-processor | Role | Data exposure |
|---|---|---|
| **Cloud LLM** | text inference / anonymizer / adversary / judge | decrypted content **in memory only**, never logged/persisted by the gateway |
| **Cloud VLM** | image inference | image bytes decrypted-in-memory only |
| **Clerk** | identity | auth identifiers (no content) |
| **Managed Postgres / Redis** | storage / queue | encrypted at rest |
| **Object storage (S3)** | media | SSE-encrypted under the DEK |
| **KMS** | key wrapping | wraps DEKs (never sees plaintext content) |

The cloud LLM/VLM are the only content egress; in **local/dev** (Ollama) there is **no** external content egress. Adding/changing a sub-processor updates this list + the DPA (traceability).
