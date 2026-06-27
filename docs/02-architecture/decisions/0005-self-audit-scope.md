# ADR 0005 — Self-audit-only subjects

**Status:** Accepted (v1)

**Context.** The same inference engine could profile anyone; that's the creepy/illegal lane (Whitebridge's posture).

**Decision.** v1 subjects = **self-audit** (the consenting signed-in user, on data they own) **+ SynthPAI** only. **No arbitrary third-party profiles.**

**Rationale.** Clean consent (you audit yourself), legal/ethical safety, and the demo is the builder's own footprint. Third-party profiling is exactly what we position *against*.

**Consequences.** Third-party-authored content is **dropped at ingestion**; consent gating on every run; the product is positioned as self-audit, the inverse of Whitebridge.
