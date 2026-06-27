# Prompts — Anonymize (Text) · `anonymize_text_v1`

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `defend/text-remediation.md` (the strategy + the k≈3 loop), `defend/utility-preservation.md` (the utility floor), `defend/attribution-ablation.md` (the genuine-leak spans), `defend/independent-adversary.md` (the held-out proof + feedback-adversary separation), `prompts/conventions.md` + `output-formats.md`, `attack/output-schema.md` (the edit emission instance), `attributes-taxonomy.md`
> - **Consumed by:** `defend/text-remediation.md` (the editor call), `07-frontend/user-flows/defend-simulation.md` (the diff + options), `03-data/database/tables/remediations.md`, `01-product/ethics-and-tone.md` (decoy variant)
> - **Hard invalidations:** none silent. Editing this prompt changes the suggested edits → re-run affected remediations; the **separation chain must hold** (anonymizer ≠ feedback-adversary ≠ evaluator).
> - **Version:** v1 (`anonymize_text_v1`)

The verbatim **FgAA editor** prompt. One hop of the iterative refine-against-feedback loop (`text-remediation.md` §1): given the text, the genuine-leak spans, and the feedback adversary's latest inference, propose the **minimal localized** edit that breaks the inference while preserving meaning. **Advise-only** — it suggests; the user decides. Models the FgAA/RUPTA/RLAA pattern, reimplemented.

## Decisions baked in
- **Output = edited text + structured span-changes** (localized, verifiable, clean diff).
- **Lightweight self-arbitration** — validate the feedback is a *genuine* leak before editing (prevents utility collapse on spurious inferences).
- Inherited: generalization-first localized ops · k≈3 loop · **decoy is a separate gated prompt** · utility floor · separation · advise-only.

---

## 1. System prompt (template)
```xml
<role>
You are a privacy editor. You rewrite a person's own text so an AI cannot infer a specific
personal attribute from it, while preserving what the person was actually saying.
</role>
<context>
This is a CONSENTED self-audit: the text is the user's own, and they want a minimal edit that
breaks a specific inference. You only SUGGEST the edit; the user decides whether to use it.
</context>
<task>
Given ORIGINAL_TEXT, the LEAK_SPANS an attack attributed the inference to, and ADVERSARY_FEEDBACK
(what an inference model just guessed and the cues it used), propose the MINIMAL, LOCALIZED edit
that breaks that inference while preserving the non-sensitive meaning.
</task>
<rules>
- VALIDATE FIRST: confirm each cue in ADVERSARY_FEEDBACK is genuinely present in the text. If the
  inference is a spurious guess with no real supporting cue, do NOT edit for it — say so.
- LOCALIZED: change ONLY the genuine-leak spans; reproduce the rest of the text verbatim.
- OPERATIONS, in order of preference: generalize/abstract the cue ("Gas Works Park" → "a local
  park") → obfuscate → remove the cue → (last resort) remove the whole item.
- PRESERVE MEANING: keep the sentence's communicative intent — the review, the joke, the question
  — minus the sensitive signal. Do not over-anonymize.
- OUTPUT: the edited text AND a structured list of every change (original span, operation,
  replacement). Brief rationale in `reasoning`.
</rules>
```

## 2. User prompt (template)
```xml
<original_text> … the user's own item being edited … </original_text>
<leak_spans> … genuine-leak spans from ablation (the minimal set) … </leak_spans>
<adversary_feedback>
  attribute: location · guess: Seattle · confidence: 0.7
  cues: ["walk to Gas Works Park" (itm_12), "my PST mornings" (itm_14)]
</adversary_feedback>
<utility_constraint> Preserve everything except the location signal. </utility_constraint>
<output_format> … edited_text + span_changes[{ span, op, replacement }] skeleton … </output_format>

Propose the minimal localized edit now, following the rules.
```

---

## 3. Self-arbitration (the decision)
Before editing, the model **validates** that each cue the feedback adversary cited is real in the text; it **skips spurious inferences** (no genuine cue → no edit). This is the RLAA insight folded into the prompt — cheap (no extra model), it prevents the editor from burning hops and collapsing utility on hallucinated feedback, and it complements the ablation (which already scoped genuine-leak spans) + the post-hoc utility floor.

## 4. Output: edited text + structured span-changes (the decision)
The model returns the **edited text** *and* `span_changes` (each `{ original span, op ∈ generalize|obfuscate|remove, replacement }`). This gives the user a **clean diff**, lets us **verify only the leak spans changed** (localization guarantee), and feeds the utility judge a precise before/after. Emission instance defined here; mechanics inherited from `output-formats.md`.

## 5. The loop, utility floor & frontier
- **One hop**; `text-remediation.md` runs it k≈3, re-attacking with the held-out **feedback adversary** each hop and refining on what it still inferred.
- The in-prompt "preserve meaning / don't over-anonymize" pairs with the **post-hoc utility judge** (`utility-preservation.md`); the editor produces a **minimal** and an **aggressive** variant so the dashboard can show the privacy/utility **frontier** (+ "remove" as the max).
- Reasoning runs in the thinking channel → brief `reasoning` field.

## 6. Decoy variant — `anonymize_decoy_v1` (separate, gated)
A **separate** opt-in prompt that, instead of removing the cue, injects a **plausible false cue** so the adversary infers the *wrong* value (IncogniText). **Off by default, heavily warned** — it suggests publishing a falsehood (`01-product/ethics-and-tone.md` owns the consent + per-persona warnings). The main prompt stays **truthful-only**; the decoy logic is isolated here so it can't leak into default behavior.

## 7. Advise-only, separation, versioning & validation
- **Advise-only:** the output is a *suggestion*; the product never edits/posts (`overview.md`). **Separation:** anonymizer ≠ feedback-adversary ≠ evaluator-adversary (gateway asserts).
- **Versioned + model-pinned** (`anonymize_text_v1`, mid-tier anonymizer slot).
- **Validate:** the **held-out evaluator** proves the before/after (`independent-adversary.md`); the **utility judge** scores meaning preservation; the eval set covers both **privacy-break** and **utility-preservation**, plus an **over-anonymization** (spurious-feedback) red-team case.

## 8. Cross-references
- **`prompts/adversary-judge.md`** — the sibling contract for the feedback/evaluator adversary re-attack (reuses `attack-text` via a different model) and the utility judge.
- **`defend/text-remediation.md`** owns the loop + frontier; this is the per-hop editor prompt.
- **`01-product/ethics-and-tone.md`** owns the decoy consent/warnings.

## 9. Open parameters (finalize during implementation)
k hop cap · generalize→remove escalation rule · minimal-vs-aggressive variant count · decoy default (off) · span-reference format.
