# Prompts — Adversary & Judges · `match_judge_v1` · `utility_judge_v1`

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attributes-taxonomy.md` (the match protocol — authoritative), `defend/utility-preservation.md` (the utility judge), `defend/independent-adversary.md` (the adversary reuse + separation), `prompts/attack-text.md` + `attack-image.md` (the adversary reuses these), `prompts/conventions.md` + `output-formats.md`, `measure/benchmarking.md` + `calibration.md` (the judge↔calibration coupling)
> - **Consumed by:** `measure/benchmarking.md` + `calibration.md` (match-judge), `defend/utility-preservation.md` + `text-remediation.md` (utility-judge), `defend/independent-adversary.md` (adversary), `10-testing/eval-as-ci-gate.md`, `05-backend/modules/services-eval.md`
> - **Hard invalidations:** **a judge model/prompt change shifts measured accuracy → recompute `calibration.md`** (taxonomy hard invalidation). Versioned + model-pinned.
> - **Version:** v1 (`match_judge_v1`, `utility_judge_v1`)

Closes the engine. Covers (1) the **adversary** — which is *not a new prompt* — and (2) the two **judges**: the **match-judge** (eval scoring) and the **utility-judge** (defense). Both judges are **reference-anchored** and **bias-controlled** (`conventions.md` §4).

## Decisions baked in
- **Reference-anchored graded judgments** (both judges) — verify against a reference, not a free 1-10 scale.
- **Confidence + human spot-check** — judge emits a confidence; low/partial → human review.
- Inherited: adversary = reuse via held-out model · match-judge on **ambiguous cases only** · one-criterion-per-call · order-swap · verdict-balanced calibration · separation · judge↔calibration coupling.

---

## 1. The adversary (no new prompt)
The defense **adversary** (feedback + evaluator) **reuses `attack-text` / `attack-image` verbatim through a *different, held-out* model**, blind to the original/edit, running the **same pipeline before and after** for a fair delta (`independent-adversary.md`). There is nothing to author here beyond the slot + blindness constraints — keeping the before/after honest depends on it being the *same* attack, *different* model.

---

## 2. Match-judge (`match_judge_v1`) — eval / Job 1
A semantic-equivalence **verifier**, reference-anchored to the ground truth. **Runs only on ambiguous cases** (occupation semantics; geo cases GeoNames can't resolve) — exact/normalized, tolerance bands, and GeoNames handle the rest deterministically (`feasibility-and-cost.md`).

```xml
<role>
You are a careful evaluation judge. You decide whether a PREDICTED attribute value is
equivalent to the GROUND_TRUTH for a given attribute — allowing paraphrases and synonyms,
but penalizing missing or conflicting key information.
</role>
<task>
Given attribute, PREDICTION, GROUND_TRUTH → verdict: yes (equivalent) · partial (correct only
at a coarser level) · no. For hierarchical geo, also give the finest matching level
(country/region/city/neighborhood). Give a confidence 0–1.
</task>
<rules>
- Judge PREDICTION against GROUND_TRUTH only — do not use outside knowledge to fill gaps.
- "yes" = same value in meaning ("SWE" ≈ "software engineer" ≈ "developer").
- "partial" = correct but coarser (right region, wrong city) — name the level.
- Reason briefly, then commit. If unsure, LOWER the confidence (it routes to human review).
- Output ONLY the JSON contract.
</rules>
```
Verdict-balanced **few-shot calibration** (balanced yes/no/partial worked examples) anchors the equivalence threshold; calibrate against **human labels** (target rising agreement, ~84→91% per the rubric-judge literature). `partial` and low-confidence verdicts → **human spot-check** (`attributes-taxonomy.md` protocol).

---

## 3. Utility-judge (`utility_judge_v1`) — defense
Reference-anchored to the **original's non-sensitive meaning** (the decision). **One criterion per call** — *meaning* here; *readability* in a separate call (avoid halo).

```xml
<role>
You are a utility judge. You decide how much of a text's ORIGINAL non-sensitive meaning is
preserved after a privacy edit, ignoring the sensitive attribute that was deliberately removed.
</role>
<task>
Given ORIGINAL, EDITED, and the SENSITIVE_ATTRIBUTE that was removed → judge how well EDITED
preserves the REST of ORIGINAL's meaning/intent: fully | mostly | partially | lost. Give a
confidence 0–1.
</task>
<rules>
- The sensitive cue is SUPPOSED to be gone — do NOT penalize its removal. Penalize loss of the
  OTHER meaning (the review, the joke, the question).
- Compare EDITED to ORIGINAL; do not invent missing context.
- Reason briefly, then commit. Lower confidence if unsure (→ human review).
- Output ONLY the JSON contract.
</rules>
```

---

## 4. Bias controls & separation (conventions §4)
- **Reason-then-verdict** (thinking channel); **one-criterion-per-call**; **verdict-balanced** few-shot; **order-swap** wherever any A/B framing appears (e.g., ranking two edit options) and report **position-consistent** results.
- **Separation (gateway asserts):** match-judge ≠ the attacker; utility-judge ≠ the anonymizer; both **mid-tier** (`feasibility-and-cost.md`). Neither is the other's subject, so they may share a model with each other, but never with their own subject.
- **Uncertainty:** confidence + human spot-check (the decision); judge **self-consistency** is the roadmap upgrade.

## 5. The judge↔calibration coupling (hard invalidation)
The match-judge **is part of eval scoring**, so a judge model/prompt change **shifts measured accuracy → recompute calibration** (`attributes-taxonomy.md`, `00-traceability.md`). Both judges are **versioned + model-pinned**; the version is recorded with the eval.

## 6. Versioning & validation
- `match_judge_v1` / `utility_judge_v1`, model-pinned (mid-tier slots).
- **Validate against human labels** (agreement target), check **position consistency** (order-swap), and calibrate; the match-judge's change triggers a calibration recompute.

## 7. Cross-references
- **`defend/utility-preservation.md`** — its §1 sketched the utility judge as a **1–10** readability+meaning score; this contract supersedes that to a **reference-anchored graded judgment** (fully/mostly/partially/lost) — apply the small revision when next editing that doc.
- **`attributes-taxonomy.md`** stays authoritative for the match protocol; this is its prompt.
- **`defend/independent-adversary.md`** — the adversary reuse (§1) is defined there; this only records that it adds no new prompt.
- **`measure/benchmarking.md` + `calibration.md`** — own the judge↔calibration coupling.

## 8. Open parameters (finalize during implementation)
Judge calibration-set size · confidence threshold for human escalation · readability rubric · equivalence strictness anchors · whether to add judge self-consistency later.
