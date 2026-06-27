# Module — `services/anonymize.py` (Defend)

> **Depends on:** `04-ai-engine/defend/*`, `gateway/`, `repositories.md` · **Rules:** `backend`, `security-privacy` · **Consumed by:** `workers/remediation` · **Version:** v1

Advise-only remediation, **proven** not asserted.

- **Ablation** (greedy minimal-sufficient-subset + redundancy clustering, cheap N=1 probes) finds the "edit these N" target on the original content.
- **Anonymizer loop** (k≈3 refine-against-feedback): localized generalization-first edits + self-arbitration; truthful default, **opt-in decoy** (consent-gated).
- **Held-out evaluator adversary** (different model, blind) measures before/after on both endpoints; **paired-bootstrap vs the noise floor** for significance; **utility judge** scores meaning preservation → `remediations`.
- **Separation enforced** (anonymizer ≠ feedback-adversary ≠ evaluator ≠ judges — asserted in the gateway). Output is a *suggestion*; nothing is applied. **Never implies false safety.**
