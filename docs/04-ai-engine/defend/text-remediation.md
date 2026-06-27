# Defend — Text Remediation (the anonymizer/editor)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `defend/overview.md` (advise-only; separation), `defend/attribution-ablation.md` (the minimal-set edit target + sensitive spans), `defend/utility-preservation.md` (the floor + privacy/utility frontier), `defend/independent-adversary.md` (feedback ≠ evaluator; the proof), `defend/noise-floor-and-variance.md` (significance), `feasibility-and-cost.md` (anonymizer slot), `llm-gateway.md` (separation assertion)
> - **Consumed by:** `defend/image-remediation.md` (sibling pattern), `07-frontend/user-flows/defend-simulation.md`, `03-data/database/tables/remediations.md`, `01-product/ethics-and-tone.md` (decoy-mode warnings)
> - **Hard invalidations:** none silent. Changing the anonymizer model/loop changes the suggested edits → re-run affected remediations; the **separation chain must hold** (editor ≠ feedback-adversary ≠ evaluator-adversary ≠ judges).
> - **Version:** v1

The centerpiece **advise-only** editor: it produces the rewrite/remove suggestions that **break the inference while preserving meaning**, targeting the items `attribution-ablation.md` flagged, and proven by the **held-out evaluator adversary**. This is the engine behind the signature moment — "edit these 3 posts → home-location confidence 0.86 → 0.21." It **never** edits or posts anything; the user acts.

---

## 1. The editing loop (the decision: iterative refine-against-feedback)
Per targeted item (the ablation minimal set, affected attribute only), capped at **k≈3 hops** (the FgAA/RUPTA budget):

1. **Anonymizer edits** — localized, generalization-first (§2), given the item + the sensitive spans + the utility floor.
2. **Feedback adversary re-attacks** the edit — a **held-out** capable model.
3. **Still recovers?** → the anonymizer **refines using that feedback** (what the adversary still latched onto) and loops; **broken or k reached** → stop.
4. **Prove** — the **evaluator** adversary (held-out from the *feedback* adversary) runs the final before/after with intervals + value-recovery (`independent-adversary.md` + `noise-floor-and-variance.md`).

Single-shot was rejected: the literature shows a "substantial gap" — one pass often fails to break the inference, while a few feedback hops reliably reach the privacy+utility sweet spot.

**The separation chain (non-negotiable):** `anonymizer` ≠ `feedback-adversary` ≠ `evaluator-adversary` ≠ match-`judge` ≠ utility-`judge` ≠ `profiler`. The editor *uses* the feedback adversary to refine but is *proven* by a different, held-out evaluator, so it cannot game the final judge.

---

## 2. Edit operations (the decision: truthful default + opt-in decoy)

### Default — truthful, localized, generalization-first
Edit **only** the ablation-flagged spans; preserve the rest (the review, the joke, the question):
1. **Generalize / abstract** the cue — "Gas Works Park" → "a local park", "I work at Acme" → "I work in tech". Highest utility; the first choice.
2. **Remove** the cue/span — only when generalization can't break the inference.
3. **Remove the whole item** — the last resort.

All truthful: the suggestion is content the user can stand behind.

### Opt-in — decoy mode (false-attribute injection)
**OFF by default; explicit opt-in, heavily warned.** Injects plausible *misleading* clues so the adversary confidently predicts the **wrong** value (the IncogniText technique; >90% leakage reduction). Guardrails:
- **It suggests publishing a falsehood about yourself** — stated plainly, every time. The tool only *suggests*; the user chooses to post or not (advise-only).
- **Backfire warnings, persona-specific:** a job-seeker can be caught misrepresenting (reputational damage — the opposite of the goal); for an **at-risk** user a decoy/false alibi can be **dangerous if exposed** and can create **false security**. Never implies false safety.
- The **truthful options are always shown alongside**, and decoy is never auto-selected.
- This makes `01-product/ethics-and-tone.md` own the warning copy and the consent for decoy (reconciliation below).

---

## 3. Advise-only output
A **prioritized action list** for the items in the minimal set — `rewrite` (truthful, or decoy if opted-in) / `remove` — each carrying:
- the **proven before/after** (evaluator adversary, intervals, value-recovery flip),
- the **utility score** and its position on the **privacy/utility frontier** (`utility-preservation.md`),
- the edit diff (so the user sees exactly what changes).

The product **never** writes to or deletes from any platform — the user acts, or hands the list to a deletion tool. It **never implies false safety**: copies others already made (screenshots, archives) can't be recalled (`overview.md`, `ethics-and-tone.md`).

---

## 4. The frontier the user chooses from
Per item, a few options on the privacy/utility curve: **minimal generalization** (high utility, modest drop) → **stronger generalization** → **remove** (max truthful privacy) → **[opt-in] decoy** (max privacy, deception cost). Each shows its proven privacy result + utility, and the user picks.

---

## 5. Scope, cost, failure modes
- **Scope:** the ablation minimal set only, affected attribute only; re-attack only the affected attribute. k≈3 cap; mid-tier anonymizer + feedback adversary (`feasibility-and-cost.md`); bounded per-run budget.
- **Can't break within k without violating the utility floor** → escalate to a broader rewrite once, else surface honestly: *"can't edit this without losing what you said — remove it or accept residual exposure"* (`utility-preservation.md`). No false success.
- **Cross-attribute side effects** — an edit that breaks one attribute may shift another; **re-check all affected attributes** before presenting (don't trade location for occupation silently).

## 6. Cross-references
- **`llm-gateway.md` + `feasibility-and-cost.md`** — register the `feedback-adversary` slot and extend the startup separation assertion to the full chain in §1; the anonymizer is mid-tier.
- **`01-product/ethics-and-tone.md`** — owns the **decoy-mode** ethics, the explicit opt-in consent, and the per-persona warning copy (esp. at-risk). Flag prominently — the decoy decision creates this requirement.
- **`defend/image-remediation.md`** — the sibling; images can't be "rewritten" (strip-EXIF / crop / blur instead).
- **`research-sources.md`** — add FgAA (2402.13846), RUPTA (2407.11770), IncogniText (2407.02956), Self-Refine. Fold into `00-index.md` reconciliation #6.
- **`07-frontend/user-flows/defend-simulation.md`** — render the action list, the frontier, the diff, and the decoy warnings/opt-in.

## 7. Open parameters (finalize during implementation)
k hop cap (default 3) · feedback-loop recovery threshold · generalize→remove escalation rule · decoy default (off) · number of frontier options · cross-attribute re-check set.
