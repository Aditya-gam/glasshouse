# Attack — Output Schema (the Profiler contract)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attributes-taxonomy.md` (the 8 attributes, value types, match rules, allowed values), `overview.md` (raw-confidence-only separation rule), `feasibility-and-cost.md` (Tier-1 deterministic normalization: GeoNames, band/bracket parsing), `llm-gateway.md` (instructor validation + bounded repair-retry)
> - **Consumed by:** `attack/text-inference.md`, `attack/image-inference.md`, `attack/confidence-and-self-consistency.md`, `attack/evidence-attribution.md`, `prompts/attack-text.md`, `prompts/attack-image.md`, `prompts/output-formats.md`, `measure/*` (parsing + calibration input), `defend/independent-adversary.md` (re-emits this schema), `defend/attribution-ablation.md` (fills `marginal_effect`), `03-data/database/tables/inferences.md` + `attributes.md`, `05-backend/modules/llm-gateway.md` + `repositories.md`, `06-api/schemas.md`, `07-frontend/*`
> - **Hard invalidations:** changing the **attribute set / value format / match rule** (upstream in `attributes-taxonomy.md`) changes this schema → recompute **calibration**, update **`attributes` enum + attack prompts**. Changing **this schema** → update **attack prompts (must emit it), instructor models, repositories/DTOs, measure parsing, frontend**.
> - **Version:** v1

The exact JSON the Profiler emits, per subject, per attack pass. It is the single contract that ties the attack stage to measure and defend: the gateway's `instructor` models validate against it, `measure/*` parses it to compute accuracy and feed calibration, and `defend/*` re-emits it (adversary) and annotates it (ablation). Everything here is **pinned to `attributes-taxonomy.md`** — this doc defines *shape*, the taxonomy defines *meaning, allowed values, and matching*.

---

## 1. Two layers (the central design decision)

Local Ollama models degrade on deep/recursive schemas (Ollama's own guidance: keep schemas shallow, `temperature=0`), and `feasibility-and-cost.md` puts geocoding and band/bracket parsing in **Tier-1 (deterministic, free)**. So we split emission from the canonical contract:

```
  ┌─ LLM (Profiler) ─┐   ┌─ Tier-1 code ─┐   ┌─ orchestrator ─┐   ┌─ defend ─┐
  │ RawAttributeGuess │ → │  normalizer   │ → │ self-consistency │ → │ ablation │
  │ (permissive,      │   │  GeoNames,    │   │ + Summarizer     │   │ fills    │
  │  shallow, what    │   │  age/income   │   │ (merge passes,   │   │ marginal │
  │  instructor       │   │  parsers,     │   │  agreement → raw │   │ _effect  │
  │  validates)       │   │  ref typing)  │   │  confidence)     │   │          │
  └───────────────────┘   └───────────────┘   └──────────────────┘   └──────────┘
        §9                       §6                  §8                   §9
                         ─────────────►  AttributeGuess (canonical, §2–§5)  ◄─────────
```

- **Emission layer — `RawAttributeGuess` (§9).** Flat and permissive: the model returns a free-text value and a self-confidence per candidate, plus evidence references and reasoning. This is the only thing the model has to produce reliably; `instructor` validates *this*.
- **Canonical layer — `AttributeGuess` (§2–§5).** The typed, taxonomy-pinned object that `measure`, the DB, and the frontend consume. Produced from the emission by deterministic normalizers + the self-consistency aggregator + the Summarizer. **`defend` later writes `marginal_effect` into the evidence.**

Decoupling means a flaky local model never breaks the typed contract — the worst case is a normalizer that can't resolve a free-text value, which is an explicit, catchable state, not a schema-validation failure mid-measure.

---

## 2. The envelope — `ProfilerOutput`

One per attack pass over one subject.

```jsonc
{
  "schema_version": "1",
  "engine_version": "profiler@2026-06-01+attack_text_v3",  // model + prompt id — pins the calibration map
  "modality": "text",                  // text | image  — the pass modality (calibration is per-modality)
  "subject_ref": "prof_8fa1…",         // user profile id, OR a benchmark item id in Job-1 runs
  "run_id": "run_3b2c…",               // the async run that produced this (null in pure-eval harness)
  "guesses": [ /* up to 8 AttributeGuess, one per attribute attempted */ ]
}
```

- `engine_version` is the **calibration pin** (`measure/calibration.md` versioning): a stored inference records the exact (model, prompt) it came from, so a calibration-map mismatch is *detectable*, never silent.
- `modality` here is the **pass** modality and is always `text` or `image` — a single Profiler/VLM pass is single-modality (`feasibility-and-cost.md` runs them separately). A *consolidated* guess that fuses both passes can carry `modality: "multimodal"` at the guess level (§3); see the calibration caveat in §11.
- `subject_ref` is opaque: a `prof_…` for user audits, a benchmark item id for Job-1 benchmarking. The schema is source-agnostic so the same engine runs on both (`measure/benchmarking.md`).

---

## 3. `AttributeGuess` — the canonical per-attribute object

```jsonc
{
  "attribute": "location",             // one of the 8 codes (attributes-taxonomy.md)
  "modality": "text",                  // text | image | multimodal  (multimodal = consolidated across passes)
  "status": "inferred",                // inferred | abstained
  "candidates": [ /* ranked 1–3; [0] = top-1; empty iff status=abstained */ ],
  "reasoning": "…",                    // about the leading candidate; encrypt/scrub at rest if Art. 9 (§ below)
  "reasoning_reveals_art9": false      // optional hint for the at-rest scrubber; authoritative scrub is DB-layer
}
```

| field | type | notes |
|---|---|---|
| `attribute` | enum(8) | `age · sex · location · birthplace · occupation · education · relationship · income`. The DB `attributes` enum is the source of truth. |
| `modality` | enum | `text` \| `image` \| `multimodal`. |
| `status` | enum | `inferred` \| `abstained`. **Abstained ≠ omitted**: it records "the engine looked and found no signal," distinct from "the attribute wasn't attempted." Sparse-footprint honesty (`distribution-shift.md`, ethics) — the model is told it may abstain rather than hallucinate. |
| `candidates` | list | 1–3 ranked `Candidate` (§4); **empty** iff `status = abstained`. |
| `reasoning` | str \| null | Short rationale for the top-1. **Reasoning guard** (`attributes-taxonomy.md`): if it reveals an Art. 9 category (ethnicity, religion, health, sexual orientation) it is encrypted/scrubbed at rest **even when the target attribute is not Art. 9**. |
| `reasoning_reveals_art9` | bool | Optional pipeline hint to trigger the at-rest scrub; the DB/crypto layer is authoritative (CLAUDE.md rule 6). |

There is **no `calibrated_reliability` field here.** The attacker emits only the *raw* signal (`overview.md` separation rule: "we never display the model's bare confidence"). `measure` (Job 2) computes calibrated reliability downstream and stores it on the `inferences` row — not in this contract.

---

## 4. `Candidate` — a single ranked guess

The decision was a **single ranked `candidates[]`**, each carrying its own value + confidence; top-1 is `candidates[0]`, top-3 is the set. No duplicated `predicted_value`, and per-rank confidence is available to calibration/eval.

```jsonc
{
  "rank": 1,                           // 1-based; candidates are sorted by confidence.raw desc
  "value": { /* one of the 4 value shapes, see §5 */ },
  "confidence": { /* structured confidence object, see §7 */ },
  "evidence": [ /* structured evidence objects, see §8 */ ]
}
```

- **Top-1 / top-3** (`attributes-taxonomy.md`, `measure/benchmarking.md`): top-1 = `candidates[0]`, top-3 = the whole list judged as a set.
- Evidence lives **per candidate**, not per guess — different candidate values are pinned by different items (the rank-2 "Portland" guess cites different posts than rank-1 "Seattle"). The headline highlight view uses `candidates[0].evidence`.

---

## 5. Value shapes — four variants, discriminated by `value_type`

The eight attributes collapse to **four value shapes** (the taxonomy's `value_type {numeric | categorical | geo_hier | freetext_semantic}`). The canonical `value` is a discriminated union on `value_type`; a model-level validator asserts `attribute ↔ value_type` consistency (e.g., `age` must be `numeric`). Four shallow shapes beats an 8-way union for both Pydantic ergonomics and local-model reliability.

| attribute | `value_type` | match rule (from taxonomy) |
|---|---|---|
| `age` | `numeric` | tolerance band ±3y |
| `income` | `numeric` | bracket (`low/medium/high`); numeric band tracked as secondary |
| `sex` | `categorical` | exact, normalized |
| `education` | `categorical` (ordinal) | exact level; ±1 adjacency tracked, not counted correct |
| `relationship` | `categorical` | exact, normalized |
| `location` | `geo_hier` | LLM-judge, hierarchical-graded (GeoNames first) |
| `birthplace` | `geo_hier` | LLM-judge, hierarchical-graded |
| `occupation` | `freetext_semantic` | LLM-judge, semantic equivalence |

### 5.1 `numeric` — `age`, `income`
```jsonc
{ "value_type": "numeric",
  "estimate": 95000,                   // point estimate (int for age, number for income)
  "range":   { "low": 85000, "high": 110000 },   // optional band when uncertain
  "bracket": "high",                   // income → low|medium|high (taxonomy headline); null for age
  "unit":    "USD/yr" }                // null for age; income normalized to USD/yr by the normalizer
```
Normalizer: parses "late 20s" → `estimate 28, range [27,29]`; "about $95k" → `estimate 95000, range …, bracket high, unit USD/yr`. Bracket thresholds and currency/period normalization are owned by the taxonomy + normalizer, not the model.

### 5.2 `categorical` — `sex`, `education`, `relationship`
```jsonc
{ "value_type": "categorical",
  "value": "married" }                 // MUST be in attributes.allowed_values for this attribute
```
`value` is validated against **`attributes.allowed_values`** (DB, sourced from the taxonomy) — this schema does **not** re-declare the allowed sets (single source of truth; a value-format change touches taxonomy + the DB column, not this doc). Non-authoritative mirror, for reading convenience:
- `sex`: `male | female | non-binary | other | unknown`
- `education`: `none | high_school | some_college | associate | bachelor | master | doctorate | professional` (ordinal; ±1 adjacency computed at measure from ladder order)
- `relationship`: `single | in_relationship | married | divorced | widowed | complicated | unknown`

`sex` is reported with the inclusive set to the user; the down-map to a benchmark's binary label space happens at scoring time (`attributes-taxonomy.md`), not here.

### 5.3 `geo_hier` — `location`, `birthplace`
```jsonc
{ "value_type": "geo_hier",
  "country": "US", "region": "Washington", "city": "Seattle", "neighborhood": "Fremont",
  "precision_level": "neighborhood",   // country | region | city | neighborhood
  "geonames_id": 5809844 }             // optional: set when the normalizer resolves via GeoNames
```
Normalizer resolves the model's free-text place ("Seattle, WA" / "Pacific NW") through **GeoNames** (`feasibility-and-cost.md` Tier-1) to fill the hierarchy and set `precision_level` from the resolution depth. `precision_level` drives both the graded score and the dashboard framing ("pinned to your state" vs "your block"). `neighborhood` applies to `location` only; `birthplace` resolves to at most `city` (taxonomy hierarchy `{country, region, city}`).

### 5.4 `freetext_semantic` — `occupation`
```jsonc
{ "value_type": "freetext_semantic",
  "text": "backend software engineer",     // as inferred, free text
  "normalized_label": "software_engineer" } // optional coarse grouping label (no ISCO/O*NET requirement)
```
Match is **LLM-judge semantic** ("SWE" ≈ "software engineer"), so no taxonomy normalization is required; `normalized_label` is only a convenience for grouping. *Employer* is not one of the 8 in v1 but may surface in `evidence`/`reasoning`.

---

## 6. Normalization (emission → canonical)

Deterministic, Tier-1, no LLM (`feasibility-and-cost.md`):

| from emission `value_text` | normalizer | canonical |
|---|---|---|
| "Seattle, WA" / "the PNW" | **GeoNames** (`geopy`/`pgeocode`) | `geo_hier` + `precision_level` + `geonames_id` |
| "late 20s" / "I'm 31" | age band parser | `numeric` `estimate` (+`range`) |
| "~$95k" / "six figures" | income parser → bracket | `numeric` `estimate`/`range`/`bracket`/`unit` |
| "married", "hitched" | categorical normalizer vs `allowed_values` | `categorical.value` |
| "SWE", "I write backend code" | passthrough + optional label | `freetext_semantic.text` (+ `normalized_label`) |

If a `value_text` cannot be normalized (e.g., GeoNames can't resolve a place), the candidate is **dropped** and logged as a normalization miss; if that empties `candidates`, the guess becomes `status: abstained`. Normalization never silently invents structure the model didn't assert.

---

## 7. Confidence — structured object, populated in two stages

Decision: a structured object, not a bare float, so the **single canonical `raw`** that feeds calibration carries its provenance and the self-consistency `N` that `measure` needs for ECE.

```jsonc
{
  "raw": 0.75,                         // THE number calibration consumes — never shown to the user bare
  "source": "self_consistency",        // self_reported | self_consistency
  "self_reported": 0.81,               // the model's stated confidence (secondary signal)
  "agreement": { "n_runs": 4, "n_agree": 3, "fraction": 0.75 }   // null until self-consistency runs
}
```

Two-stage population (`per-user-scoring.md`, `confidence-and-self-consistency.md`):
- **Single Profiler pass:** `source = "self_reported"`, `raw = self_reported`, `agreement = null`.
- **After self-consistency** (repeat at `temp>0` / perturbed evidence subsets, `N≈3`, capped per `feasibility-and-cost.md`): the agreed value's `raw = agreement.fraction`, `source = "self_consistency"`, `self_reported` = mean of that value's self-reports, `agreement` filled. Self-consistency is the **preferred** raw signal (more robust under distribution shift).

`raw ∈ [0,1]`. The boundary is hard: **only `raw` enters `f(attribute, modality, raw) → calibrated_reliability`**; the calibrated number is produced and stored by `measure`, never emitted here.

---

## 8. Evidence — structured objects

Decision: structured evidence objects (not a flat id list), so the contract carries text spans, image regions, and a slot for ablation — powering the "six boring posts that together pin your home" view and image-region attribution.

```jsonc
{
  "ref_type": "item",                  // item | media_asset | exif_finding
  "ref_id": "itm_4471",                // FK into the resolved source (or a benchmark item id)
  "modality": "text",                  // text | image
  "span":   { "quote": "walk to Gas Works Park", "start": 14, "end": 36 },  // text only; char offsets
  "region": null,                      // image only: { "x":0.31,"y":0.55,"w":0.2,"h":0.15 } normalized [0,1]
  "rationale": "names a Seattle-specific park",
  "proxy_score": 0.62,                 // attack-side: embedding-proximity contribution (0–1), a ranking aid only
  "citation_frequency": 1.0,           // attack-side: fraction of the N self-consistency runs that cited this item
  "marginal_effect": null              // ← FILLED BY defend/attribution-ablation (leave-one-out Δ on the adversary)
}
```

- **`ref_type`/`modality` are resolved by the orchestrator**, not the model — the Retriever's candidate set already knows each item's type (text item, media asset, EXIF finding). The model emits only `ref_id` + `quote`/`region` + `rationale` (§9).
- `span.start/end` are character offsets into the item's decrypted text at attack time; store the `quote` alongside so the highlight survives without re-decrypting.
- `region` is a normalized `[0,1]` bbox into the image (resolution-independent), e.g., the storefront whose signage geolocates the photo (`image-inference.md`).
- `proxy_score` + `citation_frequency` are **attack-populated** correlational signals for ranking the "why" (`evidence-attribution.md`) — explicitly **not** causal. `proxy_score` under-ranks implicit cues by design, so it is a ranking aid, never a truth claim.
- `marginal_effect` is **null at attack time** and written later by `defend/attribution-ablation.md` (the item's measured leave-one-out effect on the independent adversary) — the **causal** counterpart to the attack-side `proxy_score`. The attacker *proposes* which items mattered; ablation *measures* how much.
- Image guesses commonly mix an `exif_finding` (deterministic GPS) and a `media_asset` region (VLM visual cue) in one candidate's evidence — both are first-class.

---

## 9. Emission layer — `RawAttributeGuess` (what the model actually returns)

The shallow, permissive shape `instructor` validates straight from the LLM/VLM. Kept deliberately small for local-model reliability.

```jsonc
// RawProfilerOutput envelope: { engine_version, modality, subject_ref, guesses: [RawAttributeGuess] }
{
  "attribute": "location",
  "status": "inferred",                // inferred | abstained
  "candidates": [                      // 0–3, model-ranked best-first; empty iff abstained
    { "value_text": "Seattle, Washington, US",   // free text — normalizer structures it (§6)
      "self_confidence": 0.81,                    // model's own 0–1 score
      "evidence": [
        { "ref_id": "itm_4471",
          "quote":  "walk to Gas Works Park",     // text: the snippet; image: null
          "region": null,                         // image: normalized bbox; text: null
          "rationale": "names a Seattle-specific park" }
      ] }
  ],
  "reasoning": "Two posts reference Seattle-specific places and a PST routine."
}
```

The model does **not** emit `value_type`, structured geo, `precision_level`, brackets, `ref_type`, `modality`, `rank`, or the structured confidence object — all of those are derived deterministically downstream. This is the whole payoff of the two-layer split.

---

## 10. The validated types (instructor / Pydantic v2 sketch)

Illustrative — authoritative types live in code and are imported by the gateway's `instructor` wrapper (`llm-gateway.md`). The **emission** model is what `instructor` enforces; the **canonical** model is what `measure`/DB consume.

```python
from typing import Annotated, Literal, Union
from pydantic import BaseModel, Field, model_validator

# ---- canonical value variants (discriminated by value_type) ----
class NumericValue(BaseModel):
    value_type: Literal["numeric"]
    estimate: float
    range: "Range | None" = None
    bracket: Literal["low", "medium", "high"] | None = None
    unit: str | None = None

class CategoricalValue(BaseModel):
    value_type: Literal["categorical"]
    value: str                      # validated against attributes.allowed_values at the service layer

class GeoHierValue(BaseModel):
    value_type: Literal["geo_hier"]
    country: str | None = None; region: str | None = None
    city: str | None = None;     neighborhood: str | None = None
    precision_level: Literal["country", "region", "city", "neighborhood"]
    geonames_id: int | None = None

class FreeTextValue(BaseModel):
    value_type: Literal["freetext_semantic"]
    text: str
    normalized_label: str | None = None

AttributeValue = Annotated[
    Union[NumericValue, CategoricalValue, GeoHierValue, FreeTextValue],
    Field(discriminator="value_type"),
]

# ---- canonical guess (measure/DB/frontend consume this) ----
class Confidence(BaseModel):
    raw: float = Field(ge=0, le=1)
    source: Literal["self_reported", "self_consistency"]
    self_reported: float | None = Field(default=None, ge=0, le=1)
    agreement: "Agreement | None" = None

class Evidence(BaseModel):
    ref_type: Literal["item", "media_asset", "exif_finding"]
    ref_id: str
    modality: Literal["text", "image"]
    span: "Span | None" = None
    region: "BBox | None" = None
    rationale: str | None = None
    proxy_score: float | None = None         # attack-side: embedding-proximity rank aid (evidence-attribution)
    citation_frequency: float | None = None  # attack-side: fraction of N self-consistency runs that cited this item
    marginal_effect: float | None = None     # filled by defend/attribution-ablation (causal)

class Candidate(BaseModel):
    rank: int = Field(ge=1, le=3)
    value: AttributeValue
    confidence: Confidence
    evidence: list[Evidence] = []

class AttributeGuess(BaseModel):
    attribute: Literal["age","sex","location","birthplace",
                       "occupation","education","relationship","income"]
    modality: Literal["text", "image", "multimodal"]
    status: Literal["inferred", "abstained"]
    candidates: list[Candidate] = Field(max_length=3)
    reasoning: str | None = None
    reasoning_reveals_art9: bool = False

    @model_validator(mode="after")
    def _consistency(self):
        VT = {"age":"numeric","income":"numeric","sex":"categorical",
              "education":"categorical","relationship":"categorical",
              "location":"geo_hier","birthplace":"geo_hier","occupation":"freetext_semantic"}
        if self.status == "abstained" and self.candidates:
            raise ValueError("abstained guess must have no candidates")
        for c in self.candidates:
            if c.value.value_type != VT[self.attribute]:
                raise ValueError(f"{self.attribute} requires value_type={VT[self.attribute]}")
        return self

# ---- emission model (instructor enforces THIS on the raw LLM call) ----
class RawEvidence(BaseModel):
    ref_id: str; quote: str | None = None
    region: "BBox | None" = None; rationale: str | None = None

class RawCandidate(BaseModel):
    value_text: str
    self_confidence: float = Field(ge=0, le=1)
    evidence: list[RawEvidence] = []

class RawAttributeGuess(BaseModel):
    attribute: Literal["age","sex","location","birthplace",
                       "occupation","education","relationship","income"]
    status: Literal["inferred", "abstained"]
    candidates: list[RawCandidate] = Field(default=[], max_length=3)
    reasoning: str | None = None
```

---

## 11. Validation & failure policy

- `instructor` validates the **emission** model; on failure the gateway runs a **bounded repair-retry (N≈2)**, then marks the run step `failed` — never an infinite loop (`llm-gateway.md`). The schema is the contract.
- **Local Ollama:** pass the emission JSON schema to Ollama's `format` parameter for **constrained decoding** (shallow shape = high adherence), `temperature=0` for the single deterministic pass; `temp>0` only for the self-consistency samples.
- **Normalization failures** (§6) are a *post-validation* state, not a schema error: drop the unresolvable candidate, possibly demote the guess to `abstained`, record the miss in `run_metrics`.
- **Multimodal calibration caveat:** `text` and `image` are calibrated independently (`distribution-shift.md`). A consolidated `modality:"multimodal"` guess has no v1 calibration slice → report it under the **more conservative** of the two modality maps and flag "uncertain"; a dedicated multimodal slice is roadmap. The Summarizer only emits `multimodal` when it actually fused evidence from both passes.

---

## 12. Worked examples (canonical)

**Location, text, after self-consistency:**
```jsonc
{ "attribute":"location","modality":"text","status":"inferred",
  "candidates":[
    {"rank":1,
     "value":{"value_type":"geo_hier","country":"US","region":"Washington","city":"Seattle",
              "neighborhood":"Fremont","precision_level":"neighborhood","geonames_id":5809844},
     "confidence":{"raw":0.75,"source":"self_consistency","self_reported":0.81,
                   "agreement":{"n_runs":4,"n_agree":3,"fraction":0.75}},
     "evidence":[
       {"ref_type":"item","ref_id":"itm_4471","modality":"text",
        "span":{"quote":"walk to Gas Works Park","start":14,"end":36},
        "rationale":"Seattle-specific park","marginal_effect":null},
       {"ref_type":"item","ref_id":"itm_4490","modality":"text",
        "span":{"quote":"my PST mornings","start":0,"end":15},
        "rationale":"timezone cue","marginal_effect":null}]},
    {"rank":2,
     "value":{"value_type":"geo_hier","country":"US","region":"Washington","city":"Seattle",
              "neighborhood":null,"precision_level":"city","geonames_id":5809844},
     "confidence":{"raw":0.20,"source":"self_consistency","self_reported":0.30,
                   "agreement":{"n_runs":4,"n_agree":1,"fraction":0.25}},
     "evidence":[{"ref_type":"item","ref_id":"itm_4471","modality":"text",
                  "span":null,"region":null,"rationale":"city-level only","marginal_effect":null}]}],
  "reasoning":"Multiple posts name Seattle places; one states a PST routine.",
  "reasoning_reveals_art9":false }
```

**Income, text (numeric + bracket):**
```jsonc
{ "attribute":"income","modality":"text","status":"inferred",
  "candidates":[{"rank":1,
    "value":{"value_type":"numeric","estimate":95000,"range":{"low":85000,"high":110000},
             "bracket":"high","unit":"USD/yr"},
    "confidence":{"raw":0.55,"source":"self_reported","self_reported":0.55,"agreement":null},
    "evidence":[{"ref_type":"item","ref_id":"itm_5012","modality":"text",
                 "span":{"quote":"maxing out my 401k again","start":0,"end":24},
                 "rationale":"savings behavior implies upper bracket","marginal_effect":null}]}],
  "reasoning":"Discretionary-savings language consistent with a high bracket.","reasoning_reveals_art9":false }
```

**Birthplace, image (EXIF GPS + VLM region) — also illustrates Art. 9 reasoning:**
```jsonc
{ "attribute":"birthplace","modality":"image","status":"inferred",
  "candidates":[{"rank":1,
    "value":{"value_type":"geo_hier","country":"PT","region":"Porto","city":"Porto",
             "neighborhood":null,"precision_level":"city","geonames_id":2735943},
    "confidence":{"raw":0.40,"source":"self_reported","self_reported":0.40,"agreement":null},
    "evidence":[
      {"ref_type":"exif_finding","ref_id":"exif_201","modality":"image",
       "span":null,"region":null,"rationale":"GPS in an early childhood photo","marginal_effect":null},
      {"ref_type":"media_asset","ref_id":"med_88","modality":"image",
       "span":null,"region":{"x":0.10,"y":0.62,"w":0.35,"h":0.20},
       "rationale":"azulejo tilework typical of Porto","marginal_effect":null}]}],
  "reasoning":"Photo metadata and regional architecture point to Porto.",
  "reasoning_reveals_art9":true }   // birthplace is Art. 9 → value + reasoning encrypted at rest
```

**Abstention (no signal, honestly recorded):**
```jsonc
{ "attribute":"sex","modality":"text","status":"abstained","candidates":[],
  "reasoning":"No gendered self-reference in the available items.","reasoning_reveals_art9":false }
```

---

## 13. What lands where downstream

| schema element | downstream home |
|---|---|
| envelope (`engine_version`, `modality`, `run_id`) | `runs` / `run_metrics` rows; the calibration-version pin |
| `AttributeGuess` (one per attribute) | one `inferences` row (`03-data/.../inferences.md`) |
| `candidates[]` | ranked predictions on the `inferences` row (top-1 / top-3) |
| `confidence.raw` | input to `f()` in `measure/calibration.md`; calibrated result stored *back* on `inferences`, not here |
| `evidence[]` | `inference_evidence` join (FKs to `items` / `media_assets` / `exif_findings`) |
| `evidence[].marginal_effect` | written by `defend/attribution-ablation.md` |
| Art. 9 `value` + `reasoning` | encrypted columns + consent gate (`attributes.is_art9`, CLAUDE.md rules 6–7) |

The **independent adversary** (`defend/independent-adversary.md`) emits this *same* schema on edited content; before/after is a diff of two `ProfilerOutput`s for the affected attribute — which is exactly why a single, stable contract matters.

---

## 14. Invariants (do not break)

1. **Raw only.** The attacker emits `confidence.raw`; it never emits or shows a calibrated number (`overview.md`).
2. **One value_type per attribute.** Enforced by the validator; a change here is a taxonomy change → recompute calibration (`00-traceability.md` hard invalidation #2/#3).
3. **`allowed_values` is not redeclared here** — it lives in `attributes.allowed_values` (sourced from the taxonomy). This doc mirrors it non-authoritatively.
4. **Evidence references real rows** (or benchmark ids); `ref_type`/`modality` are orchestrator-resolved, never model-asserted.
5. **Abstain is explicit**, never silent omission.

---

## 15. Cross-references
- **`llm-gateway.md`** — ✓ reconciled: it now specifies `format=<emission JSON schema>` (full-schema constrained decoding, Ollama ≥0.5.0 — the release that added schema-constrained `format`), matching `prompts/output-formats.md` §3, so the gateway hands `instructor`'s emission schema straight to Ollama.
- **`03-data/database/tables/inferences.md`** (when authored) must hold: ranked candidates, the structured confidence (`raw`/`source`/`agreement`), the evidence join with `marginal_effect`, `engine_version`, and `status`. Note this against that leaf.
- **`attributes-taxonomy.md` §"Output schema (per attribute guess)"** is the earlier flat sketch (single `predicted_value` + `top3` + `raw_confidence` + `hardness`). **This doc supersedes it**: `candidates[]` replaces `predicted_value`+`top3`; `confidence{}` replaces the bare float; `hardness` moves to the measure-join layer (it is a benchmark-item property, not an attacker output). Leave a one-line pointer there when we next touch the taxonomy.
