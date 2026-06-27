# Attack — Confidence & Self-Consistency

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attack/output-schema.md` (the `confidence{}` object it fills), `attributes-taxonomy.md` (match rules = the clustering function), `attack/text-inference.md` + `image-inference.md` (the passes it wraps), `feasibility-and-cost.md` (N cap, cost levers), `measure/per-user-scoring.md` (the raw signal), `measure/calibration.md` (consumes `raw`)
> - **Consumed by:** `measure/calibration.md` + `per-user-scoring.md`, `measure/distribution-shift.md`, `prompts/*` (sampling temps), `05-backend/modules/services-inference.md` + `workers.md`, `defend/independent-adversary.md` + `noise-floor-and-variance.md` (same machinery, run-to-run variance)
> - **Hard invalidations:** **changing the raw-confidence design — N, the agreement/clustering metric, or sampling (temp / perturbation) — invalidates the calibration map → recompute `benchmarking.md` + `calibration.md`.** The calibration map is only valid for the exact signal it was built on.
> - **Version:** v1

How a guess gets a **raw confidence** that is actually trustworthy. The model's own stated number is badly overconfident, so we derive confidence from **self-consistency** — run the inference several times and measure how much it agrees with itself, clustering answers **by meaning** (the taxonomy match rules), not by exact text. This doc defines that mechanism and how it fills the `confidence{}` object of `output-schema.md` §7. Calibration then turns `raw` into the user-facing reliability (`measure/calibration.md`) — never shown bare.

## Why not just ask the model
Verbalized confidence is **systematically overconfident** (a stated "99%" is empirically right ~65% of the time; VLMs are no better). Sampling-agreement is the better-calibrated signal and beats logit/verbalized proxies. So `self_reported` is kept only as a **secondary diagnostic + tie-breaker**, never the primary signal and never displayed.

---

## 1. The two signals (recap of `output-schema.md` §7)
- **`self_reported`** — the model's stated 0–1 number. Overconfident; secondary only.
- **`self_consistency`** — agreement across N runs, clustered by meaning. **Primary.** `raw = agreement fraction`.

`raw ∈ [0,1]` is the *only* number that enters `f(attribute, modality, raw) → calibrated_reliability`.

---

## 2. Generating the N runs
**Self-consistency is default-on for every guess** (the decision). The canonical inference **is** the N-run ensemble — there is no separate "single pass" whose value we keep; the reported value is the ensemble's majority (§4).

- **Sampling = temperature > 0** (default). Each run re-executes the same pass with `temperature` raised so the runs can differ; identical runs ⇒ high agreement ⇒ high confidence.
- **Evidence-perturbation** (each run sees a different subset of the retrieved evidence) is **reserved for the escalation pass** (§6) — it's more informative (a guess that survives evidence drop-out is more trustworthy) but costlier, so it's spent where it matters.
- **Per modality:**
  - **Text** — the attack is one *joint* call for all 8 attributes, so N=3 is just 3 calls. **Default N = 3.**
  - **Image** — each image is its own VLM call, so N multiplies per image. **Default N is lower** (e.g., 1–3) and self-consistency is concentrated on the **top-triaged images** and the escalation set, not every photo (`image-inference.md` §5).
- **Dev/fast mode:** N=1 at `temperature = 0` (→ `source = "self_reported"`) — for local iteration only, **never** the cited/production signal.

---

## 3. Agreement = clustering by the match rule (semantic, not string)
For each attribute, cluster the N runs' values using **that attribute's taxonomy match rule** — the same function that judges correctness in eval, so "agreement" and "correctness" are measured identically (which is what makes the calibration transfer valid). This is the **semantic-entropy** approach (cluster by meaning before counting), and it's nearly free for us because the match rules already exist:

| value_type | clustering rule |
|---|---|
| `geo_hier` (`location`, `birthplace`) | **hierarchical via GeoNames** — cluster at each level; "Seattle" and "Seattle, Fremont" agree at **city** |
| `numeric` (`age`, `income`) | tolerance band / bracket — 28 ≈ 29; same income bracket |
| `categorical` (`sex`, `education`, `relationship`) | normalized exact |
| `freetext_semantic` (`occupation`) | the **semantic judge** on the few candidate pairs — "SWE" ≈ "software engineer" |

Why this and not exact-string: naive exact match registers "SWE" vs "software engineer" (and "Seattle" vs "Seattle, Fremont") as **disagreement**, producing falsely-low, miscalibrated confidence on every fuzzy attribute — the documented failure mode. Clustering by meaning fixes it at the source.

### Geo yields confidence *per precision level*
Because geo clusters hierarchically, agreement is measured at each level — e.g., **4/4 runs agree on city, 2/4 on neighborhood**. This directly sets `precision_level` (report the finest level that clears a threshold) and gives a `raw` *per level*, which calibrates per level (`calibration.md`). It's the principled source of the "pinned to your state vs your block" framing.

---

## 4. Filling the `confidence{}` object
After clustering the N runs for an attribute:
- The **largest cluster's representative value** = top-1 (majority vote). Runner-up clusters become candidates 2–3, each with its own fraction.
- `raw` = top cluster size ÷ N (the **agreement fraction**).
- `source = "self_consistency"`, `agreement = { n_runs: N, n_agree: top-cluster size, fraction }`.
- `self_reported` = mean of the top cluster's stated confidences (secondary; in-bucket tie-breaker).

**Coarse buckets are expected and fine.** At N=3 the fraction takes few values (≈ ⅓, ⅔, 1, plus split cases) → ~4 reliability levels, which calibrates cleanly into ~4 buckets. We **display bands**, not false-precision percentages; `self_reported` breaks ties within a band; a finer blend of the two signals is a roadmap option if calibration shows it helps (literature: combining verbalized + consistency helps, and "two samples are enough").

---

## 5. Worked micro-example (location, text, N=3)
Runs → `{Seattle/Fremont}`, `{Seattle}`, `{Portland}`. Hierarchical clustering: **country** US 3/3; **region** WA-or-OR → WA 2/3; **city** Seattle 2/3; **neighborhood** Fremont 1/3.
→ top-1 = Seattle (city), `precision_level = city`, city-level `raw = 0.67`; neighborhood reported only if it clears threshold (here 1/3 → dropped); a Portland candidate at rank-2 with `raw = 0.33`. Country is near-certain (`raw ≈ 1.0`) — the safe thing the dashboard can always state.

---

## 6. Disagreement → abstention & escalation
- **Abstain on no plurality** — if no cluster reaches the plurality threshold (default: top cluster < ⌈N/2⌉, or below a floor), emit `status: abstained` rather than surface a near-coin-flip (anti-hallucination; `distribution-shift.md`, ethics).
- **Disagreement triggers escalation** — a high-entropy / no-dominant-cluster result is exactly the signal that fires the targeted re-pass (`text-inference.md` §5): **higher N + evidence-perturbation + attribute-specific retrieval**, concentrated on that one attribute. If it still won't converge → abstain.
- This is also the bridge to defense: the same N-run variance defines the **noise floor** a real confidence drop must beat (`defend/noise-floor-and-variance.md`).

---

## 7. N, cost, and the calibration coupling
- **Default N = 3** (text); literature finds even 2 samples strong, so 3 is safe. Final N is set by **measuring ECE per N** on a SynthPAI slice (`feasibility-and-cost.md` options-matrix) — more samples, better calibration, more cost.
- **Cost levers:** cap N≈3; concentrate extra sampling via escalation, not blanket high-N; batch API for eval runs; image N kept low per-image.
- **The hard coupling:** calibration must be built on the **identical** raw signal — same N, same clustering metric, same sampling — used at inference. The calibration map is therefore pinned (via `engine_version`) to `(signal=self_consistency, N, agreement-metric, attribute, modality)`. **Changing N, the clustering rule, or the sampling scheme → recompute benchmarking + calibration** (header hard-invalidation). Geo's per-level confidence calibrates per level.

---

## 8. Failure modes & resilience
- **All runs abstain / empty** → guess abstained.
- **Judge unavailable** for occupation clustering → fall back to normalized-string within that attribute and flag the run (degraded clustering).
- **Budget cap mid-ensemble** → use the completed runs if ≥2; otherwise mark the step incomplete (never present a 1-run guess as self-consistency).
- **No content logging** — only counts/metadata reach `run_metrics` (`llm-gateway.md`, CLAUDE.md rule 1).

## 9. Cross-references
- **`text-inference.md`** — its §4 "temperature = 0 single canonical pass" is the **dev/fast mode**; the default canonical text signal is the **N≈3 self-consistency ensemble (temp>0)**, value = ensemble majority. (Reconciled now.)
- **`image-inference.md`** — confirm per-image self-consistency uses the **lower default N** concentrated on top-triaged images (consistent with its §8).
- **`measure/calibration.md`** — bucket on the **agreement-fraction** signal at the fixed N; add **N + agreement-metric** to the calibration version key so a mismatch is detectable. Apply when revisiting `measure/*`.

## 10. Open parameters (finalize during implementation)
N (text default 3; image default; escalation N) · plurality/abstain threshold · per-precision-level confidence threshold · evidence-perturbation subset size · self-reported vs agreement blend (default: none in v1). Each defines the engine → changing it re-triggers benchmarking + calibration.
