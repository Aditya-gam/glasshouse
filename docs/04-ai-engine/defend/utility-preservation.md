# Defend — Utility Preservation (the floor that stops "cheat by deleting")

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `defend/overview.md` (safeguard #3; the research standard), `defend/attribution-ablation.md` (the sensitive spans to ignore), `attack/output-schema.md` (those spans), `feasibility-and-cost.md` (judge slot), `llm-gateway.md` (separation assertion)
> - **Consumed by:** `defend/text-remediation.md` (the constraint + the frontier it presents), `defend/image-remediation.md` (utility = fraction preserved), `07-frontend/user-flows/defend-simulation.md`, `03-data/database/tables/remediations.md`
> - **Hard invalidations:** none silent. But the **utility judge must stay ≠ the anonymizer** (editor ≠ judge); changing the judge model/rubric shifts which edits pass the floor.
> - **Version:** v1

The constraint that makes the defense meaningful: a rewrite is only valid if it **breaks the inference AND keeps the meaning**. Without it, the trivially "best" anonymization is to **delete everything** — inference confidence → 0, but the user's post is destroyed. Our product is **minimal, meaning-preserving** edits, so utility preservation is the floor that stops the editor "cheating by deleting." This is the privacy↔utility half of the research standard (FgAA, RUPTA): optimize both, not just privacy.

## The two-objective frame ("no free lunch")
Every defense is a trade-off: removing the sensitive cue necessarily changes the text. A **valid** defense lives in the region where **inference is broken** (`independent-adversary.md` + `noise-floor-and-variance.md`) **and utility ≥ the floor** (here). We surface the trade-off honestly rather than pretend it's free.

---

## 1. How utility is measured (the decision)
**Independent LLM utility judge + a free embedding pre-filter:**
- **Embedding pre-filter (free, Tier-1)** — cheap cosine screen that drops obviously-destructive edits before spending the judge.
- **Independent LLM judge (the verdict)** — a model **separate from the anonymizer** gives a **reference-anchored graded** verdict on **meaning/intent preservation** (`fully | mostly | partially | lost`) plus a separate **readability** verdict — *one criterion per call* to avoid halo (the authoritative contract is `prompts/adversary-judge.md` `utility_judge_v1`). This is the field standard *because* surface/reference metrics (BLEU, ROUGE, BERTScore, raw cosine) **"fail to account for the context-dependent utility of anonymized texts"** — they can't tell a meaning-preserving paraphrase from a meaning-losing one. So embeddings gate, the judge decides.
- **The user is the ultimate check** — advise-only means the user approves/rejects every suggested edit, which *is* the research's "human preference" standard, free and authoritative for us.
- **Downstream-task accuracy** (RUPTA-style) is more rigorous but needs a defined task that free-form self-audit posts lack → roadmap/enterprise.

**Editor ≠ judge:** the utility judge is its own gateway slot, distinct from the `anonymizer` (and the `adversary` and match-`judge`). The editor can't grade its own utility (gateway asserts the separation).

---

## 2. What utility is measured against (the decision)
**The non-sensitive content / intent — not the whole original.** The judge is told to **ignore the sensitive attribute** (the spans `attribution-ablation.md` already identified) and score whether the edit preserves the **rest** of the meaning/intent — the review, the joke, the question — minus the location cue. Why not whole-original similarity: the edit *must* change the sensitive part, so comparing to the full original wrongly penalizes the very removal we want (conflating "removed the sensitive part" — good — with "lost meaning" — bad). Utility = *preserve the user's intent except the sensitive signal.*

---

## 3. The privacy/utility frontier (advise-only)
We don't pick one point — we present a few options on the trade-off curve and let the user choose:
- **Minimal edit** — smallest change that meaningfully dents the inference; highest utility.
- **Balanced** — breaks recovery with modest meaning cost.
- **Aggressive / remove** — maximal privacy, lower utility (down to "remove the post").

Each option shows its **proven privacy result** (independent-adversary before/after with intervals) and its **utility score**. The **floor** is a pre-filter — below a meaning-preservation threshold we don't *suggest* an edit — but it is **not a hard gate**: advise-only means the user may still choose a lower-utility option for maximum privacy.

---

## 4. Image utility
You can't "rewrite" an image, so utility = **how much of the image is preserved**:
- **Strip-EXIF** — image pixels unchanged → **full utility**; the best remediation when it suffices (`image-remediation.md`).
- **Crop / blur** the identifying region — **partial utility** (fraction preserved); the floor concept applies — don't blur the whole photo to kill one cue.

---

## 5. Outputs, failure modes
- **Emits:** per candidate edit — `utility_score` (+ readability / meaning sub-scores), pass/fail vs the floor, and the option's position on the frontier → consumed by `text-remediation.md` and the dashboard.
- **No edit clears both bars** (can't break the attribute without losing meaning) → report the **true trade-off** honestly: *"this can't be broken by editing without losing what you said — your options are remove the post or accept residual exposure."* No false success.
- **Judge unavailable** → fall back to the embedding pre-filter + user approval, flagged degraded.

## 6. Cross-references
- **`defend/text-remediation.md`** — the editor optimizes privacy **subject to** this floor and presents the frontier; consumes `utility_score`.
- **`defend/image-remediation.md`** — utility = fraction preserved; the floor applies to crop/blur.
- **`llm-gateway.md` + `feasibility-and-cost.md`** — add a **utility-judge** slot (mid-tier, ≠ `anonymizer`/`adversary`/`profiler`; may share the model with the match-`judge` but must differ from the editor) and include it in the startup separation assertion.
- **`07-frontend/user-flows/defend-simulation.md`** — render the privacy/utility frontier and the per-option proven-result + utility score.
- **`research-sources.md`** — add the utility/anonymization references (RUPTA, arXiv 2407.11770, ACL 2025; the reference-metric critique). Fold into `00-index.md` reconciliation #6.

## 7. Open parameters (finalize during implementation)
Utility floor threshold · judge rubric weights (readability vs meaning) · embedding pre-filter threshold · number of frontier options to present.
