# Attack — Image Inference (EXIF + the VLM path)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attributes-taxonomy.md` (targets + geo precision), `attack/output-schema.md` (emits `RawAttributeGuess`; image evidence = `media_asset` region + `exif_finding`), `overview.md` (VLM = capable slot, separation), `feasibility-and-cost.md` (VLM capable; EXIF = Tier-1; image = supplementary rigor), `llm-gateway.md` (`vlm` slot, instructor, budget, VLM sub-processor), `03-data/ingestion/images-and-exif.md` (extraction → `media_assets`/`exif_findings`), `attack/text-inference.md` (sibling pattern)
> - **Consumed by:** `prompts/attack-image.md` (verbatim prompt), `attack/confidence-and-self-consistency.md`, `attack/evidence-attribution.md`, `measure/benchmarking.md` + `calibration.md` (image-modality slice), `defend/image-remediation.md` (strip-EXIF / crop, then re-attack), `05-backend/modules/services-inference.md` + `workers.md`, `02-architecture/run-lifecycle.md` + `trust-boundaries.md` (VLM sub-processor)
> - **Hard invalidations:** **changing the image pipeline — triage/pre-filter, VLM model, or the VLM prompt — changes the engine → recompute the *image-modality* `benchmarking.md` + `calibration.md`** (image is calibrated separately from text — `distribution-shift.md`). Changing the emitted shape → `attack/output-schema.md`.
> - **Version:** v1

How the attack infers attributes from a subject's **images**. Two complementary layers — deterministic **EXIF/metadata** and probabilistic **VLM visual inference** — feeding the same `output-schema.md` contract. The text path is `text-inference.md`; text+image fusion per attribute is the Summarizer's job. Image is the **supplementary/demonstrative** modality (`benchmarking.md`): we do not overclaim its accuracy.

## Why this path exists (the headline)
Social platforms strip GPS metadata on upload, so users assume photos are location-safe. They aren't: modern VLMs geolocate from **visual content alone** — architecture, vegetation, signage, team logos, vehicles. This is documented in the wild — the 404 Media investigation (2025) found **GeoSpy** (a VLM geolocator needing no metadata) had been public and used for **stalking**, after which it was restricted to law enforcement. That is precisely the at-risk-persona threat we audit, and the reason this product is **advise-only and self-audit-only** rather than a geolocation service. The benchmark (VIP, NeurIPS 2024, same lab as the text attack) reaches **77.6% top-1** on **images that contain no people** — all inference from context.

---

## 1. The pipeline (v1, as decided)

```
 image assets (decrypted in-memory)
   │
   ├─▶ EXIF / metadata extraction ── ALL images ── deterministic, provable        [Tier-1, §3]
   │       GPS → location · timestamp → routine/timezone · camera → transparency
   │       writes exif_findings
   │
   └─▶ Free local pre-filter (geolocatability) ── ranks ALL images                 [Tier-1, §5]
           │  high: outdoor/scene/signage/landmark   low: screenshot/meme/indoor-selfie
           ▼
        triage = top geolocatable ∪ recency ∪ always-include(EXIF-GPS or stripped-scene), VLM-budget-capped
           ▼
        VLM — PER IMAGE: context/scene only (NO faces), hierarchical country→region→city→neighborhood
           │     emits RawAttributeGuess (value_text + self_confidence + region evidence + reasoning)   [capable slot, §4]
           ▼
 Normalize → canonical AttributeGuess[] (modality:"image"; GeoNames for geo — output-schema.md §6)
   │   (EXIF + VLM merged into one candidate where they corroborate — §6)
   ▼
 (per-image self-consistency → confidence-and-self-consistency.md ; cross-image + cross-modal consolidation → Summarizer)
```

**Structural difference from text (inherent, not a choice):** text does one joint call over the whole footprint; images are processed **per-image** (you can't pack many photos into one context), each emitting its own guesses, then consolidated per-attribute across images.

---

## 2. What images can (and can't) reveal — under context-only
- **Strong:** `location`, `birthplace` (architecture/landscape/signage), `occupation` (workplace setting, uniform-in-context, tools), `income` (neighbourhood, vehicles, possessions).
- **Weak/contextual:** `education` (campus/credential cues — rare).
- **Generally NOT image-inferable here:** `age`, `sex`, `relationship` — these require analysing depicted **people**, which we deliberately do not do (§7). For these, the image path normally **abstains** and text carries them. This is honest scoping, not a gap.

---

## 3. Layer 1 — EXIF / metadata (deterministic, Tier-1, provable)
Runs on **every** image (cheap, no LLM; `Pillow`/`piexif`/`exiftool`). Extraction itself lives in ingestion (`images-and-exif.md`, → `exif_findings`); this doc defines **how findings become attribute evidence**:
- **GPS → `location`** — reverse-geocode the coordinates via **GeoNames** to a `geo_hier` value + `precision_level`. Provable (coordinates are present or not), so it's the deterministic counterpart to the VLM's guess.
  - **Caveat baked into the rule:** EXIF GPS is the **photo's** location, which may be home, work, travel, or a re-shot image/postcard. So it is **strong evidence, not blind truth** — high confidence, but the "is this *home*?" call is left to consolidation (corroboration across photos + the text signal), never auto-equated to home from one geotag.
- **Timestamp → routine/timezone annotation** — surfaced for the at-risk lens (activity pattern), **not** a standalone attribute guess.
- **Camera make/model, software → transparency only** — extracted and shown so the user sees what leaks, but **not** used as `income` evidence in v1 (a camera model is too weak/noisy to claim income from — it would pollute calibration). 

EXIF findings are emitted as `exif_finding` evidence (`output-schema.md` §8). This deterministic layer is also what `defend/image-remediation.md` proves it can remove (strip GPS → finding gone).

---

## 4. Layer 2 — VLM visual inference (the capable slot)
**One VLM call per triaged image** (dev: local Qwen-VL/Gemma; cited: cloud frontier — `feasibility-and-cost.md`; exact model is a tested param). Through the gateway's `instructor` wrapper; emits the emission-layer `RawAttributeGuess` (`output-schema.md` §9). Runs **regardless of whether EXIF is present** — recovering location from a metadata-stripped photo is the entire point.

**Behaviour the prompt enforces** (verbatim in `prompts/attack-image.md`):
- **Context/scene only — never analyse depicted people's faces/bodies** (§7). Read the *environment*: architecture, vegetation, signage, language on signs, road markings, license plates, sun/shadow, store logos, sports paraphernalia.
- **Reason hierarchically, coarse→fine** — country → region → city → neighbourhood — and report the finest level the evidence supports as `precision_level`. (Matches our geo schema and current geolocation SOTA, which reasons hierarchically.)
- **Cite the region** — every non-abstain guess references the image region (normalized `[0,1]` bbox) and the cue that drove it (`output-schema.md` §8). No identifiable cue → abstain.
- **Up to 3 ranked candidates** with 0–1 self-confidence; **abstain** on generic images (blank interiors, sky, close-up food) rather than hallucinate a city.

**Honest cap:** we do VLM *reasoning* only — **not VPR** (Visual Place Recognition, GeoSpy-Pro-style matching against a global image database for metre-level fixes). That needs proprietary infra and is out of scope/cost. We target country→neighbourhood, not a street address.

---

## 5. Image triage (which images get the expensive VLM)
EXIF runs on all images (cheap); the VLM is the cost, so we select. Mirrors the text Retriever's **recall-first-but-bounded** posture, with an image pre-filter standing in for embeddings:
- **Free local pre-filter** — a local image model (e.g., **CLIP**: scores how well an image matches a text description) ranks each image's **geolocatability** ("outdoor street scene with signage" high; "screenshot / meme / indoor selfie" low). Free, on-device, the image analog of the text embedding query.
- **Triage set** = top-ranked geolocatable ∪ **recency** ∪ **always-include** (images with EXIF-GPS to corroborate, or clearly EXIF-stripped-but-scene-rich — the suspicious ones) → deduped → **capped by the per-run VLM budget** (`llm-gateway.md`).
- **Small sets pass through whole** (cap doesn't bind) → no needless skipping; large sets spend the budget on images that can actually leak, not on memes.
- **Params to finalize empirically** (`feasibility-and-cost.md` options-matrix, measured on VIP + own photos; metric: recall of known-geolocatable images): pre-filter model + threshold, VLM budget cap, recency N.

---

## 6. Combining the two layers (EXIF + VLM)
EXIF and VLM are **independent evidence** for the same attribute (`output-schema.md` lets one candidate carry both an `exif_finding` and a `media_asset` region):
- **Agree** (EXIF GPS ≈ VLM guess) → high confidence; the pair is a strong "your photo pins you" finding.
- **Conflict** → surface both and **lower** confidence; never silently let EXIF override the VLM (the geotag could be travel; the scene could be the real home) — flag for the user's confirm/deny.
- The **home vs. visited** disambiguation (one geotag ≠ residence) is a **consolidation** concern: corroborate across multiple photos and the text signal before labelling a location "home."

---

## 7. Scope: context-only, no facial/biometric inference (the decision)
We infer from the **scene**, including in photos that contain people, but we **never** run face/body analysis to guess a person's age, sex, etc. Why:
- **Benchmarkable** — VIP is built with no people-derived attributes, so context-only is the only image inference we can **measure and calibrate**; face-based inference has no benchmark here, and showing an uncalibrated confidence would break our honest-measurement rule (`measure/*`).
- **Ethics/compliance** — avoids biometric-data sensitivity (GDPR) and the "face-scanner" tone that conflicts with the at-risk persona and our advise-only/self-audit posture (`ethics-and-tone.md`).
- **It's the differentiator** — the non-obvious leak (the bland photo) is the point; face age/sex is the already-understood risk.

Implementation: the VLM is instructed to ignore people for attribute purposes (optionally blur/skip face regions). We **document** facial inference as a known adversary capability we deliberately don't replicate — honesty without doing it.

---

## 8. Abstention & anti-hallucination (image-specific)
VLMs confidently hallucinate locations on ambiguous images — guard hard:
- **Evidence-gated** — a guess must cite a concrete visual cue (region) or an EXIF finding; no cue → `abstained`.
- **Generic-image abstain** — blank walls, sky, food close-ups, screenshots → abstain, don't guess.
- **Supplementary rigor** — image accuracy is demonstrative, not the headline (`benchmarking.md`); prefer reliability **bands** and "uncertain" over false precision, especially for the at-risk persona.
- **Per-modality calibration** — image confidence is calibrated on the image slice (VIP + own photos), never borrowed from text (`distribution-shift.md`).

---

## 9. Where it sits & what it emits
- **Run lifecycle:** the **attack worker**, async; content decrypted in-memory only, never logged (the VLM is a documented sub-processor — `trust-boundaries.md`, `llm-gateway.md`).
- **Emits:** per-image `RawAttributeGuess[]` → normalized canonical `AttributeGuess[]` tagged `modality:"image"`, carrying `engine_version` (the image-calibration pin).
- **Consumed by:** `measure` (VIP + own-photo benchmark/calibration) and `defend/image-remediation.md` (strip-EXIF / crop-or-blur the identifying region, then re-attack to prove the drop).

## 10. Failure modes & resilience
- **No images / all low-yield** → all-attribute `abstained`, run completes honestly.
- **EXIF parse failure** → skip that finding, continue (VLM still runs).
- **Normalization miss** (GeoNames can't resolve a VLM place) → drop that candidate (`output-schema.md` §6).
- **Invalid VLM JSON** → gateway bounded repair-retry (N≈2), then mark the step `failed`.
- **Budget exceeded** → triage cap / per-run cap aborts before a runaway (per-image cost makes this essential).

## 11. Cross-references (reconciliations ✓ applied)
- **`research-sources.md`** — ✓ done (v2): the image refs are listed — VIP (Tömekçe, Vero, Staab, Vechev — NeurIPS 2024, arXiv 2404.10618, `eth-sri/privacy-inference-multimodal`, **code MIT; image data has separate terms** → confirm VIP access or rely on own labeled photos), GeoSpy / 404 Media 2025 (real-world threat + ethics), and the VLM-geolocation benchmarks.
- **`03-data/ingestion/images-and-exif.md`** — owns extraction + the `media_assets`/`exif_findings` tables this doc consumes; keep the EXIF field set there aligned with §3 (GPS, timestamp, camera/software).
- **`prompts/attack-image.md`** — owns the verbatim VLM prompt operationalizing §4 (context-only, hierarchical, region-cited, abstain).

## 12. Open parameters (finalize during implementation)
Pre-filter model + geolocatability threshold · VLM budget cap · recency N · VLM model choice (local vs cloud) · per-image self-consistency N. Each defines the engine, so changing it re-triggers image benchmarking + calibration.
