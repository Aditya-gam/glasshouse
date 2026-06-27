# Measure — Distribution Shift (the honest caveat)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `calibration.md`, `per-user-scoring.md`
> - **Consumed by:** `../../01-product/ethics-and-tone.md`, the accuracy-trust view (`../../07-frontend/user-flows/accuracy-trust-view.md`)
> - **Hard invalidations:** none (caveat doc) — tracks calibration validity over real-world drift
> - **Version:** v1

Calibration computed on SynthPAI/VIP transfers to a user **only while the user's data resembles the benchmark distribution**. This is ordinary distribution shift, and we state it plainly rather than hide it.

## Where transfer is strong
- English, Reddit-style short text → close to SynthPAI.
- Innocuous photos with contextual cues (signage, architecture, vegetation) → close to VIP.

## Where transfer weakens
- Other languages or heavy code-switching.
- Very different platforms/registers (e.g., LinkedIn formal posts, image-only feeds).
- Highly sparse footprints (little signal → the model guesses; the literature notes hallucination risk on sparse inputs).

## Mitigations (in priority order)
1. **Separate calibration per modality** — text and image are calibrated independently (already in the design).
2. **Self-consistency as the raw signal** — more robust under shift than self-reported confidence (`per-user-scoring.md`).
3. **User confirm/deny → live ground truth** — aggregated across users, this lets us detect drift (predicted reliability vs. observed confirm rate) and recalibrate on real-world data over time.
4. **Show reliability bands, not false precision** — when confidence is low or out-of-distribution, present a range and an "uncertain" state instead of a crisp percentage.
5. **Per-language / per-platform calibration slices** — as data allows, calibrate within slices rather than globally.

## Product consequence
Reliability shown to users is always **calibrated and honest about uncertainty**. We would rather say "uncertain" than display a confident-looking number we can't stand behind — which also matters for the at-risk persona (`../../01-product/ethics-and-tone.md`): never imply false precision or false safety.
