# Module — `services/consent.py`

> **Depends on:** `03-data/tables/consents.md`, `01-product/ethics-and-tone.md` · **Rules:** `security-privacy` · **Consumed by:** every run-creating service · **Version:** v1

The hard gate (CLAUDE.md rule 7; GDPR lawful basis).

- **No run starts** without a valid, **non-revoked** `consents` row covering the subject + purpose.
- **Art. 9** inference (e.g. `birthplace`) requires explicit special-category consent; the **decoy** requires its own consent (global enable + per-use confirm).
- Revocation is immediate; consent events are written to `audit_log`.
- Deny-by-default (`security-privacy` rule): missing/ambiguous consent → block.
