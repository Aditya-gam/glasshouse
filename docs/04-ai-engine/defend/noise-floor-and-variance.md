# Defend — Noise Floor & Variance (is the drop real?)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `defend/independent-adversary.md` (the N re-attack runs), `attack/confidence-and-self-consistency.md` (where the per-pass samples come from), `measure/benchmarking.md` + `calibration.md` (Job-1 estimation of the noise model), `measure/distribution-shift.md` (reliability honesty), `feasibility-and-cost.md` (N cap)
> - **Consumed by:** `defend/attribution-ablation.md` (per-item Δ gated by the floor), `defend/text-remediation.md` + `image-remediation.md` (the "proven drop" they report), `07-frontend/user-flows/defend-simulation.md` (intervals + "within noise" state), `03-data/database/tables/remediations.md` + `calibration.md`
> - **Hard invalidations:** the noise model is an **adversary-engine property** — changing the adversary model/pipeline/N re-estimates it (re-run in Job 1). A stale floor silently mis-judges significance.
> - **Version:** v1

The safeguard that stops us claiming a confidence drop that is just sampling noise. LLM attacks are stochastic (self-consistency runs at `temperature > 0`), so the **same** content re-attacked gives **different** confidences run to run — in the literature, identical-input scores swing dramatically. A raw before/after pair (`0.86 → 0.21`) therefore mixes a real effect with noise. This doc defines the **noise floor** (how much movement is just noise) and the **significance rule** (when a drop beats it). Two failure modes it prevents: **false positives** (claiming a drop that's noise — actively dangerous as false safety for the at-risk persona) and **false negatives** (missing a real drop).

## The methodology
We follow the eval-statistics standard ("Adding Error Bars to Evals," Anthropic 2024): treat each before/after as a **paired experiment**, report **bootstrap** confidence intervals, and exploit the pairing for power at small N.

---

## 1. The noise floor = the adversary's run-to-run variance (the decision: global, from Job 1)
The floor is a **property of the adversary engine**, measured once and reused — exactly like calibration:
- **Estimated in Job-1 benchmarking** on the **adversary** engine (defense validates with the independent adversary, not the Profiler): re-attack benchmark items repeatedly → the spread of confidence on identical inputs.
- **Stored per `(attribute, modality, confidence-level)`** — variance is **heteroscedastic** (typically larger in the mid-confidence range than near 0/1), so a single global number would mis-judge; we bucket by level. Pinned to the adversary's `engine_version`.
- **Reused** as the significance margin for every before/after, so remediation pays nothing to "know" the noise.
- **Local sanity check** — the per-remediation samples (below) flag gross outliers where local spread far exceeds the global expectation.

Why not estimate per-remediation: a stable variance needs many samples; the affordable per-remediation N≈3–5 would estimate the noise *with a noisy ruler*. Job 1 has the data; remediation reuses the result — the same logic as calibration.

---

## 2. The significance rule (the decision: paired bootstrap vs the floor)
Per remediation, the independent adversary runs **N self-consistency samples** on the **original** (blind) and **N** on the **edited** (blind) content — the runs it already does (`independent-adversary.md`). Then, with **no extra model calls**:
1. **Bootstrap each endpoint** — resample the N samples (~1000×) → a confidence CI for *before* and for *after*. (This is why N runs suffice: the bootstrap recovers the sampling distribution from the samples we already have.)
2. **Bootstrap the paired difference** — because it's the same content, resample the paired runs to get a CI on the **drop** itself (more power at small N than two independent means).
3. **Significant iff** the difference CI **excludes zero by at least the global noise-floor margin** for that `(attribute, modality, level)`.

Report the **interval**, never a point: `0.84 [0.79–0.88] → 0.22 [0.17–0.28]`, drop `0.62 [0.55–0.69]`.

**Value-recovery is the primary, noise-robust signal.** The binary *"true value in the adversary's top-3 before, out after"* is far less noise-sensitive than the confidence float, so it is the headline safety claim; the calibrated confidence drop (gated by the rule above) is the **magnitude**.

---

## 3. What a remediation emits
`before [CI] → after [CI]`, `difference [CI]`, `significant: bool`, `value_recovery_flip: bool`, plus the adversary `engine_version` and the floor version used. Consumed by the dashboard, the `remediations` table, and `attribution-ablation.md`.

---

## 4. Reporting honesty (esp. at-risk)
- **Not significant → "no proven drop / within noise,"** never a quiet success. False safety is harmful (`ethics-and-tone.md`).
- **Value flips but confidence drop within noise** → report the value-recovery as the win, confidence as "directionally down, within noise."
- Always **intervals, not points**; an "uncertain" state when the CI is wide (`distribution-shift.md`).

---

## 5. Gate on attribution (coupling to ablation)
The floor gates **per-item attribution** too: in `attribution-ablation.md`, an item's leave-one-out marginal effect counts as a **real** contributor only if **it** beats the noise floor. A per-item Δ within noise is **not attributable** — preventing "these 3 posts caused it" claims built on noise.

---

## 6. Cost & failure modes
- **Cost:** the only model cost is the N adversary re-attacks per endpoint (already counted in `independent-adversary.md`); the bootstrap (~1000 resamples) and the floor lookup are **pure compute, no model calls**. Per-remediation N default ≈ 5 (a touch above the attack's N=3, since variance estimation benefits slightly).
- **No global floor yet** (new, un-benchmarked adversary engine) → fall back to per-remediation bootstrap variance with a **wider margin** and mark the result **provisional**.
- **Degenerate zero-variance** (all N identical) → still apply the **global** floor; never claim infinite significance from a lucky-identical local sample.

## 7. Cross-references
- **`measure/benchmarking.md` + `calibration.md`** — Job 1 must additionally estimate the **adversary engine's run-to-run noise model** (variance per `attribute, modality, confidence-level`) alongside its calibration, pinned to the adversary `engine_version`. Likely the same `calibration` table or a sibling `noise_model` (note for the data subtree).
- **`attribution-ablation.md`** — per-item `marginal_effect` is gated by this floor.
- **`defend/text-remediation.md` + `image-remediation.md`** — the "proven drop" they surface is this significant, interval-reported delta + value-recovery flip.
- **`07-frontend/user-flows/defend-simulation.md`** — render intervals and the "within noise"/"uncertain" states, with value-recovery as the headline.

## 8. Open parameters (finalize during implementation)
Per-remediation N (default ≈5) · bootstrap iterations (default 1000) · the noise-floor margin (k×σ or a percentile of the Job-1 run-to-run delta distribution) · confidence-level bucketing for the heteroscedastic noise model.
