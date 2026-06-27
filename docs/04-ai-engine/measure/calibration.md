# Measure — Calibration (Job 1, part 2)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `benchmarking.md`, `../attributes-taxonomy.md`, `../attack/confidence-and-self-consistency.md`
> - **Consumed by:** `per-user-scoring.md`, `distribution-shift.md`, `../defend/*`, the `calibration` table
> - **Hard invalidations:** any change to attack **model/prompt** or the **judge/match rule** → recompute the map
> - **Version:** v1

The bridge between "the model said 0.8" and "0.8 means something." Calibration is computed once on labeled data (Job 1) and then **applied** to every user-facing confidence (Job 2).

## Why it's needed
An LLM's raw confidence is not inherently meaningful — it might say 0.8 and be right 50% of the time, or 95%. You cannot know which without checking against ground truth. Calibration measures the true relationship.

## Procedure
1. Run the engine across the whole benchmark (SynthPAI / VIP), collecting, for each guess: the **stated confidence** (or self-consistency score) and whether it was **correct** (from the label).
2. **Bucket** guesses by confidence (e.g., 0.0–0.1, …, 0.9–1.0), per attribute (attributes calibrate differently — `location` ≠ `income`).
3. For each bucket, compute the **empirical accuracy** = fraction correct.
4. Store the resulting curve as the **calibration map** (per attribute, per modality) in the `calibration` table.

## Output
A lookup/curve: `calibrated_reliability = f(attribute, modality, raw_confidence)`.
Example row: `location, text, raw 0.80 → empirical 0.76`.

## Diagnostics
- **Reliability diagram** (predicted vs. empirical) per attribute.
- **ECE** (Expected Calibration Error) as a single summary number; lower = better calibrated.
- If badly miscalibrated, options: temperature-scale the confidence, switch to self-consistency as the raw signal, or display reliability bands instead of point values.

## Versioning
The calibration map is tied to the exact **engine signal** it was built on: the `(model, prompt, pipeline)` **and** the self-consistency parameters it buckets — **N and the agreement/clustering metric** (`../attack/confidence-and-self-consistency.md` §7). **Any change to the attack model, prompt, pipeline, N, or the agreement metric invalidates the map** → recompute. Enforced by versioning `calibration` rows against the `engine_version` used in benchmarking (which encodes all of these, so a mismatch is detectable, never silent).

## Hand-off to Job 2
`per-user-scoring.md` consumes this map: it never shows a user a raw model number — only `f(...)` calibrated reliability.
