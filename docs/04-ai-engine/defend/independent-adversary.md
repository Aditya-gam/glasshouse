# Defend — Independent Adversary (the proof)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `defend/overview.md` (the six safeguards; editor ≠ judge), `attack/text-inference.md` + `image-inference.md` (the pipeline it reuses), `attack/confidence-and-self-consistency.md` (N-run variance), `attack/output-schema.md` (what it emits), `measure/calibration.md` (calibrated before/after), `feasibility-and-cost.md` (adversary = capable slot, ≠ Profiler), `llm-gateway.md` (`adversary` slot + separation assertion)
> - **Consumed by:** `defend/text-remediation.md` + `image-remediation.md` (the result they must beat), `defend/attribution-ablation.md` (ablation is measured *against this adversary*), `defend/noise-floor-and-variance.md` (its N-run variance), `defend/utility-preservation.md` (paired with the privacy result), `07-frontend/user-flows/defend-simulation.md`, `03-data/database/tables/remediations.md`
> - **Hard invalidations:** changing the **adversary model or its pipeline** changes the proven before/after → re-run affected remediations; it has its **own calibration** (`engine_version` of the adversary slot), separate from the Profiler's.
> - **Version:** v1

The safeguard that makes the whole Defend stage honest: a rewrite's success is measured by a **held-out independent adversary** re-attacking the edited content — **never** by the rewriter's self-report. If one model both edits and re-scores, the before/after is meaningless (it can hallucinate the drop or collude with itself). This is the operational core of *editor ≠ judge* and the field standard set by adversarial anonymization (FgAA, Staab et al., ICLR 2025).

## The falsifiable criterion
Success is **not** "confidence went down." Because the user knows their true attribute, success is *"an independent adversary can no longer recover my actual value"* — and we hold it to: **the true value falls out of the adversary's top-3, *and* the calibrated confidence drop beats run-to-run noise** (`noise-floor-and-variance.md`). Both are reported; the binary (recovered / not) is the safety claim, the delta is the headline.

---

## 1. What "independent" means here (the decision)
The adversary is a **different model family** from both the Profiler that made the original guess **and** the anonymizer that edited the text (e.g., Profiler = Claude → adversary = Gemini/GPT or a different open model). Why different-model rather than same-model-fresh-context: two families don't share blind spots, so a rewrite that merely exploits one model's quirk won't fool a different one — which is what makes "we broke the inference" credible. Same-model-fresh-context is allowed **only** as a dev/cost fallback, with an explicit weaker-guarantee flag (it shares the Profiler's blind spots).

**Held-out from the feedback loop too.** If `text-remediation.md` refines edits using an FgAA-style adversary's *feedback*, the **evaluator adversary here must be a different model than that feedback adversary** — otherwise we'd grade the edit with the very model it was tuned to beat. This extends the gateway rule to: **evaluator-adversary ≠ feedback-adversary ≠ anonymizer ≠ judge ≠ profiler.**

**As capable as the threat.** A weak adversary makes a weak claim, so the cited-run adversary is frontier (`feasibility-and-cost.md`); dev uses a capable local model. Under-powering the adversary would manufacture false "safety."

---

## 2. The adversary *is* the attack engine, through a different slot
It reuses the full attack pipeline — retrieval + inference + self-consistency (`text-inference.md`, `image-inference.md`, `confidence-and-self-consistency.md`) — resolved to the gateway **`adversary` slot** (a different model). Key constraints:
- **Blind.** It sees **only the edited content** — never the original text, the edit diff, or the attacker's reasoning. Fresh context, no leakage, no collusion.
- **Scoped.** It re-attacks **only the affected attribute(s)**, not the whole profile (cost lever).
- **Same pipeline before and after** (below) so the only thing that changes between the two measurements is the edited content.

---

## 3. The before/after protocol (fair because same adversary on both ends)
Because the adversary is a *different* model from the Profiler, a fair delta requires measuring **both** endpoints with **this** adversary — not "Profiler-before → adversary-after," which would confound the edit's effect with the model swap:

1. **Baseline** — the independent adversary attacks the **original** content (blind), N times → calibrated `confidence_before` + whether the true value is in its top-3.
2. **Post-edit** — the same adversary attacks the **edited** content (blind), N times → calibrated `confidence_after` + top-3 recovery.
3. **Report** — the calibrated `before → after` delta **with intervals** (N-run variance), and the **value-recovery** flip (true value in top-3 before vs after).

The Profiler's original finding is what *triggered* remediation; the **proven** defense delta is this adversary's own before→after. Large divergence between the two is itself informative (cross-model disagreement) and surfaced, not hidden.

---

## 4. Single adversary for v1 — and the honesty boundary (the decision)
One strong, different-model adversary measures the result in v1. Cross-model privacy-inference capability is fairly consistent, so beating one strong independent adversary is a defensible baseline, and it keeps defense (the supplementary-rigor stage) affordable. A **panel** of 2–3 families — where a rewrite must beat *all* and the headline reports the *worst* (most-confident) adversary — is the roadmap **high-assurance** mode, most warranted for the at-risk persona's **location** claim.

**Never claim absolute safety** (`ethics-and-tone.md`): passing one adversary is **evidence, not proof**, of safety against all models; copies others already made (screenshots, archives) can't be recalled; a stronger or future adversary may still infer. The product states this plainly — especially for the at-risk persona, where false safety is actively harmful.

---

## 5. Separation enforcement (operationalized in the gateway)
The `adversary` slot **must** resolve to a different model than `profiler`, `anonymizer`, and `judge`; the gateway **asserts this at startup** (fail fast). Add the **evaluator-adversary ≠ feedback-adversary** assertion when `text-remediation.md` introduces a feedback adversary (gateway reconciliation note below).

---

## 6. Outputs, failure modes, open items
- **Emits:** the post-edit inference (same `output-schema.md`, `modality`, and the adversary's `engine_version`), the calibrated `before/after` with intervals, and the top-3 value-recovery status → consumed by the dashboard headline, `attribution-ablation.md` (ablation Δ is measured against *this* adversary), and the `remediations` table.
- **Failure modes:** adversary still recovers the true value → rewrite **failed**, surfaced honestly (no success claim); drop within the noise floor → "**not proven**," report the interval; adversary model unavailable → mark the validation **pending** (never silently fall back to same-model for a cited/safety claim).
- **Open params:** adversary model choice (≠ Profiler/anonymizer), re-attack N, top-k recovery threshold (default top-3), and the per-attribute panel escalation (roadmap).

## 7. Cross-references
- **`defend/text-remediation.md`** (when authored) — if it uses an FgAA-style feedback adversary to refine edits, that model must differ from the evaluator adversary here; the editor may consume adversary *feedback*, but the **proof** uses a held-out adversary.
- **`llm-gateway.md`** — extend the startup separation assertion to include **evaluator-adversary ≠ feedback-adversary** once the feedback adversary exists.
- **`defend/noise-floor-and-variance.md`** + **`attribution-ablation.md`** — both build directly on this adversary's N-run behavior; keep N and the adversary model consistent across them.
- **`research-sources.md`** — add the defense reference: Staab et al., "Large Language Models are Advanced Anonymizers" (FgAA, ICLR 2025, arXiv 2402.13846, `eth-sri/llmprivacy`). Fold into `00-index.md` reconciliation #6.
