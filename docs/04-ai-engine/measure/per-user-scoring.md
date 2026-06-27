# Measure — Per-User Scoring (Job 2)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `calibration.md`, `../attack/confidence-and-self-consistency.md`, `../attack/evidence-attribution.md`
> - **Consumed by:** `distribution-shift.md`, `../defend/*` (baseline), the dashboard
> - **Hard invalidations:** calibration-map recompute → re-derive every shown reliability
> - **Version:** v1

How we attach a trustworthy number to a guess about the **user**, whose data has no answer key. No labels, no training, no scoring against SynthPAI.

## The raw signal (label-free)
For each attribute guess on the user's content, derive a raw confidence without ground truth:
- **Self-reported confidence** from the model — simplest, but weakest on its own.
- **Self-consistency (preferred):** run the inference several times (temperature > 0) and/or on perturbed subsets of the evidence, then use the **fraction of runs that agree** on a value as the raw confidence. More runs agreeing → higher confidence. This is robust and needs no labels.
- Combine: use the agreed value as the prediction and the agreement fraction as the raw confidence; keep the model's stated confidence as a secondary signal.

## Apply calibration
Pass the raw confidence through the **Job 1 calibration map** (`calibration.md`) for that attribute + modality. The user is shown **calibrated reliability**, e.g., *"Seattle — at this confidence, this engine is right ~76% of the time,"* never the bare model number.

## Evidence
Each guess carries the **evidence item IDs** that drove it (`attack/evidence-attribution.md`), so the user sees *why* — the "six boring posts that together pin your home" view.

## The user as ground truth
Because the user knows their real attributes, the product can ask them to **confirm or deny** each high-confidence guess. This:
- Lets the user verify the engine got it right (trust).
- Produces a **live ground-truth signal** we can use to monitor calibration drift on real data (`distribution-shift.md`).

## What this phase outputs
Per attribute, for the user: predicted value, calibrated reliability, evidence, and (optionally) the user's confirm/deny. These feed the dashboard and become the **baseline** the Defend phase tries to reduce.

## What it explicitly does NOT do
- Does not compute "accuracy" on the user (no labels to score against).
- Does not compare the user's guess to SynthPAI.
- Does not train on the user's data.
