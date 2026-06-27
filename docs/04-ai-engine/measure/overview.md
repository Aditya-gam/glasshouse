# Measure — Overview

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attributes-taxonomy.md`, `benchmarking.md`, `calibration.md`, `per-user-scoring.md`, `distribution-shift.md`
> - **Consumed by:** `defend/*`, `07-frontend/user-flows/accuracy-trust-view.md`, the dashboard
> - **Hard invalidations:** none (framing) — the silent couplings live in `benchmarking.md` + `calibration.md`
> - **Version:** v1

The Measure phase answers a subtle question: *how do we attach trustworthy numbers to inferences about a user, when the user's own data has no answer key?* The resolution is to separate two jobs that were previously (incorrectly) conflated.

## We are not training anything
There is **no model fitted to SynthPAI**. The "attacker" is an off-the-shelf LLM/VLM driven by prompts. SynthPAI and VIP are **test sets with known answers** — used to measure properties of the engine, never to train it.

## Two jobs

### Job 1 — Benchmark + calibrate the *engine* (runs on labeled data)
Runs on **SynthPAI** (text) and **VIP + own labeled photos** (images), which have ground truth, so accuracy is directly computable. Produces:
1. **General accuracy** per attribute (e.g., location top-1 = 72%) — the credibility/résumé number and the CI regression gate. Describes the *engine*, not any user.
2. **Calibration** — a map from the engine's stated confidence to its *empirical* hit rate (e.g., "a 0.8 location guess is right ~76% of the time"). See `calibration.md`.

These are **properties of the engine** and therefore transfer to new inputs — the same way a validated test keeps its accuracy on a new patient.

### Job 2 — Produce the *user's* findings + prove the defense (runs on unlabeled data)
Runs on the user's own footprint, which has no stored answer key, so we **never** score the user's guesses against SynthPAI. Instead:
- The **raw** confidence for a guess about the user comes from the model — its self-reported score, or better, **self-consistency** (repeat/perturb and use agreement fraction). No labels needed. See `per-user-scoring.md`.
- We pass that raw number through the **Job 1 calibration map**, so the user sees calibrated reliability, not a vibe.
- The **defense before/after** is measured **directly and relatively** on the user's data (can an independent adversary still recover the attribute after the edit?). This needs no external labels. See `../defend/overview.md`.
- The user is their **own ground truth** — they know their real city — so before/after is self-verifiable.

## The analogy (keep this in the README)
A **validated medical test**: it's validated on a population with known outcomes ("95% accurate"); when *you* take it, no one re-validates it on you — you're handed "positive, and this test is right 95% of the time." SynthPAI/VIP is the validation population for our inference "test"; the user is the new patient. The data being unrelated to the user is exactly what makes the validation a general, honest measure rather than circular self-grading.

## One-line summary
**SynthPAI/VIP validate and calibrate the engine (Job 1); the user's own data produces the actual findings and the relative, self-verifiable defense result (Job 2). No training; no scoring the user's specific guess against strangers' data.**

## Open caveat
Transfer holds only while the user's data resembles the benchmark distribution (Reddit-style English text; innocuous photos). See `distribution-shift.md`.
