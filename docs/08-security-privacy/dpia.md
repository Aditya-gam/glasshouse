# Security — DPIA (Data Protection Impact Assessment)

> **Depends on:** `threat-model.md`, `01-product/problem-and-threat.md`, GDPR Art. 35 · **Version:** v1

Required because we process **special-category data** (Art. 9 inference) at scale — a high-risk activity.

- **Processing** — inferring personal attributes (incl. birthplace, an ethnicity proxy) from a user's own footprint, for a self-audit; advise-only remediation.
- **Necessity/proportionality** — purpose is the user's *own* protection; self-audit-only + third-party-drop minimize the surface; consent (incl. explicit Art. 9) is the lawful basis.
- **Risks** — re-exposure of sensitive inferences; breach; sub-processor leak; false sense of safety; misuse for profiling others.
- **Mitigations** — encryption + crypto-shred; RLS + app-layer scope; no-logging; in-memory-only egress; consent gate; advise-only + no-false-safety; self-audit-only by design.
- **Residual risk** — low and justified given the user-protective purpose, encryption, and consent; reviewed when scope/sub-processors change.
