# ADR 0009 — Advise-only defense

**Status:** Accepted (v1)

**Context.** Breaking an inference requires editing/removing content — but acting on platforms is risky and is redact's domain.

**Decision.** Defense is **advise-only**: output a prioritized action list (rewrite / remove / strip-EXIF / crop) with the proven before→after. The product **never** edits or deletes on any platform.

**Rationale.** On-platform actions duplicate redact and add credential/automation risk + liability; advise-only keeps the user in control and our ethics clean (no false safety, the user decides). We complement redact rather than compete.

**Consequences.** Output = suggestions + proven deltas; the user (or redact) applies them; we **never imply false safety** (copies others made can't be recalled).
