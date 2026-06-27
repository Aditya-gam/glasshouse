# Measure — Benchmarking (Job 1, part 1)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `../attributes-taxonomy.md` (matching fns), `../research-sources.md` (SynthPAI/VIP), `../attack/text-inference.md`, `../attack/image-inference.md`
> - **Consumed by:** `calibration.md`, the `eval_results` table, the CI eval-gate (`../../10-testing/eval-as-ci-gate.md`)
> - **Hard invalidations:** any change to attack **model/prompt/pipeline** → re-run benchmark (accuracy + floor)
> - **Version:** v1

Compute the engine's accuracy on labeled data. This is the credibility number and the regression gate. It does **not** touch user data.

## Inputs
- **Text:** SynthPAI (`RobinSta/SynthPAI` on HuggingFace) — synthetic Reddit-style comments with human-verified attribute labels. Fully synthetic → no data subjects.
- **Image:** VIP (Visual Inference-Privacy, `eth-sri/privacy-inference-multimodal`) — 554 human-labeled innocuous images (no people depicted) across the 8 attributes, hardness-graded — **where obtainable** (real photos → access may be gated), supplemented by **our own labeled photos** (perfect ground truth, ethically clean).

## Procedure
1. Run the **same** attack engine (same prompts, same model) used on real users over each benchmark item.
2. Extract the predicted value(s) per attribute.
3. Compare to the label using the per-attribute **matching function** (see `../attributes-taxonomy.md`): exact for categorical; semantic/geo for `location`; tolerance bands for `age`/`income`.
4. Aggregate.

## Metrics
- **Top-1 accuracy** and **Top-3 accuracy**, per attribute and overall.
- Optionally broken down by **hardness** (both datasets are hardness-graded), since easy vs. hard items behave very differently.
- Recorded to the `eval_results` table per run.

## Reference points (sanity, not targets)
- Text: the original attack reached ~85% top-1 / ~95% top-3 on real Reddit in the literature; SynthPAI is a faithful proxy.
- Image: GPT-4V reached 77.6% on VIP. Use these to sanity-check that our pipeline is wired correctly, not as hard goals.

## CI gate
A CI job runs benchmarking on a fixed SynthPAI slice and **fails if accuracy drops below a floor** (floor set from the first clean run). This prevents a prompt/model change from silently regressing the engine.

## Separation of concerns
Benchmarking only produces accuracy. The mapping from confidence to reliability is a **separate** step (`calibration.md`) so the two never get tangled again.

## Rigor levels (explicit)
- **Text = rigorous headline metric** (SynthPAI is public + synthetic).
- **Image = supplementary/demonstrative** (VIP gated; own-photo set is small). We do not overclaim image accuracy.
