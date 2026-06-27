# Product — Ethics & Tone

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `archive/product-spec.md` §3, `personas.md`, `defend/text-remediation.md` (decoy), `defend/overview.md` (advise-only, no false safety), `measure/distribution-shift.md` (humble reliability)
> - **Consumed by:** `07-frontend/*` (copy + flows: decoy consent, crisis resources, the false-safety note), `defend/text-remediation.md` (decoy warnings), `08-security-privacy/*`
> - **Hard invalidations:** none silent, but the **decoy consent**, **false-safety note**, and **crisis resources** are product-safety obligations — never quietly drop them
> - **Version:** v1

The ethics + tone rules, weighted for the **at-risk persona**. This doc owns the decoy consent and the honesty guarantees.

## Core posture
Self-audit only; **advise-only** (the tool never edits/posts/deletes); own-data, **encrypted**, **crypto-shreddable**, **no content logging**. *The tool must never itself become an exposure.*

## Tone
**Inform without alarmism; never induce panic.** Plain and factual — let the *proven* numbers carry the weight, not scary language. The problem statement may be frank internally (`problem-and-threat.md`); **user-facing** copy is calm and matter-of-fact, especially for at-risk users.

## No false safety (persistent + at remediation)
State plainly that **deletion can't recall copies others already made** (screenshots, archives, reposts) — as a **standing principle** in the product **and** prominently **at the moment the user acts** on a remediation (the riskiest point for false comfort). We never imply an attribute is "safe" — only that *these specific adversaries can no longer recover it* (with intervals; `noise-floor-and-variance.md`).

## Decoy mode (global enable + per-use confirm)
The false-attribute decoy is **off by default**. It requires a **one-time global opt-in** (settings, with the full warning) **and** a **per-use confirm** at each application reminding the user it publishes a **falsehood**. Persona-specific backfire warnings: job-seeker (caught misrepresenting → reputational damage); **at-risk** (a false alibi exposed can be dangerous, and can create false security). Truthful options are **always shown alongside**; decoy is **never auto-selected**.

## At-risk crisis resources (include curated pointers)
For the at-risk persona — and on high-severity findings (e.g., an exposed home location) — surface links to reputable **digital-safety + crisis resources** (a doxxing-response guide, a DV hotline). Keep them maintained and region-aware where possible; they are pointers, not advice, and never replace professional help.

## Honesty in measurement
Show **calibrated reliability**, never the model's raw confidence; prefer **intervals** and an "uncertain" state over false precision (`distribution-shift.md`). Image accuracy is presented as supplementary, not overclaimed.
