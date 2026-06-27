# Flow — Onboarding & Consent

> **Depends on:** `01-product/ethics-and-tone.md`, `06-api/endpoints/account.md` · **Version:** v1

The **guided wizard**, step 1 — consent precedes all processing.

1. **Welcome** — plainly what this is (a self-audit of *your* footprint), calm/non-alarmist framing.
2. **Consent** — purpose `self_audit`; explicit **Art. 9 acknowledgment** for sensitive attributes (birthplace etc.); the **no-false-safety** statement ("deletion can't recall copies others made"); at-risk tone. **Deny-by-default** — nothing runs without it.
3. Consent written to `consents` (+ `audit_log`), then proceed to connect/import.

No content is ingested or processed before consent is recorded.
