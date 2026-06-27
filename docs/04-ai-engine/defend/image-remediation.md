# Defend — Image Remediation (strip · crop · inpaint · remove)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `defend/overview.md` (deterministic-where-possible; advise-only), `attack/image-inference.md` (the two layers, the geo-revealing region, EXIF findings), `defend/independent-adversary.md` (the VLM evaluator), `defend/noise-floor-and-variance.md` (significance), `defend/attribution-ablation.md` (which images/regions), `defend/utility-preservation.md` (image utility = fraction preserved), `defend/text-remediation.md` (sibling pattern), `feasibility-and-cost.md` (VLM + inpaint slots), `03-data/ingestion/images-and-exif.md` (EXIF strip)
> - **Consumed by:** `07-frontend/user-flows/defend-simulation.md`, `03-data/database/tables/remediations.md`, `01-product/ethics-and-tone.md`
> - **Hard invalidations:** none silent. Changing the **VLM evaluator or the inpaint model** changes results → re-run affected remediations; the evaluator must stay **≠ the attack VLM**.
> - **Version:** v1

You **can't "rewrite" an image**, so image remediation is two layers: the **deterministic EXIF strip** (provable) and **visual content remediation** (the hard part — the photo still geolocates from pixels even with no metadata). Both proven by the **independent VLM adversary**. This is the image half of the signature before/after and the close of the defend subtree.

## The product thesis, demonstrated
Stripping GPS feels like enough; it isn't. We **strip EXIF, then re-attack the stripped image** and show the VLM **still geolocates** from architecture/signage/vegetation — proving **EXIF removal is necessary but not sufficient**, and that visual remediation is required. That demonstration is the image headline.

---

## 1. Layer 1 — deterministic EXIF/metadata strip (provable)
Strip GPS, timestamp, camera/software (`images-and-exif.md`). **Provable** — the coordinate is present or not, no model judgment (safeguard #6) — and **full utility** (pixels unchanged). The easy, certain win — but insufficient alone (above).

---

## 2. Layer 2 — visual remediation (the decision: crop + inpaint + remove; blur = weak)
Target the **geo-revealing region** (the VLM's cited bbox + ablation). Operations offered:
- **Inpaint** *(generative, the effective method)* — remove the cue and coherently fill the area. The literature's recommended approach: effective **and** keeps the image looking natural. Cost: a generative image model (the most expensive image op); produces **synthetic fill pixels** (removal/fill, not false facts — milder than the text decoy, but flagged as generated).
- **Crop** *(deterministic fallback)* — cut out the region; provable removal, but changes composition and the VLM may use other cues.
- **Remove** *(max)* — delete the photo; zero utility.
- **Blur / mask** — offered but **honestly labeled weak**: the literature finds blur/pixelate **ineffective** against VLMs, and the proof (below) will usually show it still geolocates — a useful teaching moment, not a recommendation.
- **Adversarial perturbation (GeoShield)** — *roadmap.* Looks identical to humans but is fragile: platform re-compression can destroy it, and tuned to one model it often won't fool our **different** evaluator (our own proof would show it failing).

### Iterative, cue-by-cue
VLMs read **multiple** cues, so removing one rarely suffices. Remediate the top cue → re-attack → still found → remediate the next → … until broken or we recommend **remove** (capped, mirroring the text k-hop loop).

---

## 3. Validation — prove all options up-front (the decision)
Run the **independent VLM adversary** before/after on **each** offered remediation (strip-only, blur, crop, inpaint) and show the **proven comparison side by side**:

> EXIF-strip + blur → *still found you* `0.71 [0.64–0.77]` · crop → `0.38` · **inpaint → broke it** `0.09 [0.05–0.14]`

Same machinery as text: independent VLM adversary (≠ the attack VLM), noise-floor intervals, value-recovery flip (`independent-adversary.md`, `noise-floor-and-variance.md`). This is essential **because you can't tell by looking** whether a remediation worked, and blur is deceptively weak — the comparison teaches the thesis concretely. Cost: the VLM adversary runs **×(options)** on the targeted (ablation-flagged) images only.

---

## 4. Advise-only: generate the artifact, never touch the platform
We **generate the download-ready remediated image** (stripped / cropped / inpainted) for the user to re-upload — the exact parallel to generating a text rewrite suggestion, and still advise-only: we **never** modify or delete on any platform. Honesty holds: **no false safety** — copies others already saved (screenshots, reposts) can't be recalled; the EXIF strip is *provable*, but visual remediation is proven only *against this VLM adversary, not guaranteed against all* (image = the supplementary modality — humble intervals).

---

## 5. The privacy/utility frontier (images)
Utility = **fraction of the image preserved** (`utility-preservation.md`): **strip-only** (full utility, often insufficient) → **inpaint** (high utility, effective) → **crop** (partial) → **remove** (zero). Each option carries its proven before/after; the user picks.

---

## 6. Scope, cost, failure modes
- **Scope:** ablation-flagged images + region, affected attribute; cap iterations. Multiple photos pinning the same place → remediate the **set** (image analog of the text minimal set).
- **Cost:** inpaint = generative model; proof = VLM adversary ×options — both scoped to the few flagged images.
- **Nothing short of removal breaks it** (every visual op still geolocates) → recommend **remove** or surface residual exposure honestly. No false success.

## 7. Cross-references
- **`llm-gateway.md` + `feasibility-and-cost.md`** — add a generative **inpaint** slot (capable image model); the VLM evaluator slot already exists; keep evaluator ≠ attack VLM.
- **`03-data/*`** — remediated artifacts: generate on-demand vs store (encrypted derivative media) — note for the data subtree.
- **`07-frontend/user-flows/defend-simulation.md`** — render the side-by-side proven comparison, the "strip-isn't-enough" demonstration, and the download artifacts.
- **`research-sources.md`** — add GeoShield (arXiv 2508.03209), ROAR / object-scrubbing (2504.16557), granular geo-privacy control (2407.04952), the VLM-geolocation refs. Fold into `00-index.md` reconciliation #6.
- **`01-product/ethics-and-tone.md`** — inpaint generates synthetic pixels (minor honesty note; far milder than the text decoy).

## 8. Open parameters (finalize during implementation)
Iteration cap · inpaint model · number of options proven up-front · recovery threshold · blur inclusion (offered, weak-labeled) · on-demand vs stored artifacts.
