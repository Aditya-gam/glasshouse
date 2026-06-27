# Security — Threat Model

> **Depends on:** `.claude/rules/security-privacy.md`, `02-architecture/trust-boundaries.md` · **Version:** v1

Threats → mitigations (the product's whole point is privacy, so this is load-bearing).

| Threat | Mitigation |
|---|---|
| **Tenant isolation breach** (see another user's data) | RLS (fails closed) **+** app-layer scope checks; RLS isolation tests (A01) |
| **Data breach at rest** | per-user DEK (KMS-wrapped) + pgcrypto/SSE; **crypto-shred** on erasure |
| **Key compromise** | app role can't read `data_keys`; decrypt only via `SECURITY DEFINER`; keys as bound params |
| **Prompt injection** (untrusted user content) | datamark/spotlight + instruction-data separation + schema validation + red-team set (LLM01) |
| **Sub-processor leak** (LLM/VLM) | content crosses **decrypted-in-memory only**, never logged/persisted by the gateway |
| **Content in logs** | structured metadata only; no content/keys/PII (`logging-policy.md`) |
| **Misuse for third-party profiling** | self-audit only; third-party content dropped at ingestion; consent-gated |
| **Connector token theft** | tokens T2-encrypted, read-only scopes, revocable |
| **False sense of safety** | advise-only; never imply safety; honest intervals (`ethics-and-tone.md`) |

Verified against OWASP Top 10:2025 + ASVS; the high-risk processing (special-category inference) is assessed in `dpia.md`.
