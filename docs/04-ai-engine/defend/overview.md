# Defend — Overview

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attack/*`, `measure/calibration.md`, `attributes-taxonomy.md`
> - **Consumed by:** `defend/*` (the six safeguards), `01-product/ethics-and-tone.md`
> - **Hard invalidations:** changing the **separation rules / safeguards** → update the sibling defend docs
> - **Version:** v1

Advise-only remediation that is **proven**, not asserted. The hard requirement: the system must not fool itself into reporting a confidence drop that isn't real. Detailed mechanisms live in the sibling files; this is the principle and the rules.

## Principle: the editor is never the judge
If one model both rewrites text and re-scores its own confidence, the before/after is meaningless — it can hallucinate the numbers or collude with itself. So **success is measured by an independent adversary**, not by the rewriter's self-report. (This mirrors the research standard: validate anonymization against an adversarial inference model, with a utility constraint and human preference.)

## The six safeguards
1. **Independent adversary** — after a rewrite, a held-out inference pass (different model, or at minimum a fresh context blind to the change) re-attacks the edited content. The rewriter can't game a judge it can't see. → `independent-adversary.md`
2. **Calibrated confidence, not face value** — any number shown comes through the Job 1 calibration map, never the rewriter's raw output. → `../measure/calibration.md`
3. **Utility floor** — reject rewrites that don't preserve meaning, so the editor can't "cheat by deleting." Score semantic preservation; a valid defense drops inference **and** keeps meaning. → `utility-preservation.md`
4. **Beat the noise floor** — re-attack N times; a drop counts only if it exceeds measured run-to-run variance; report intervals, not a single pair. → `noise-floor-and-variance.md`
5. **Attribution by ablation** — to claim "these 3 posts caused the drop," do leave-one-out and measure each item's marginal effect on the independent adversary. → `attribution-ablation.md`
6. **Deterministic where possible** — EXIF/GPS removal is provable (coordinates present or not); no model judgment needed for that vector. → `image-remediation.md`

## The falsifiable success criterion
Because the user knows their true attribute, success is not "confidence went down" but **"independent adversaries can no longer recover my *actual* value"** — verifiable by the user directly.

## Advise-only boundary
The product outputs a prioritized action list (rewrite suggestion / remove flag / strip-EXIF / crop) and the proven before→after. It **never** edits or deletes on any platform — the user acts, or hands the list to a deletion tool (e.g., redact). And it never implies false safety: copies others already made (screenshots, archives) cannot be recalled. → `../../01-product/ethics-and-tone.md`

## Modality split
- Text → rewrite or remove (`text-remediation.md`).
- Image → remove / strip-EXIF / crop-or-blur the identifying region; you cannot "rewrite" an image (`image-remediation.md`).
