# Attributes Taxonomy

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `01-product/personas.md` (severity lens), benchmark conventions (`research-sources.md`)
> - **Consumed by:** `attack/output-schema.md`, `prompts/attack-text.md`, `prompts/attack-image.md`, `measure/benchmarking.md`, `measure/calibration.md`, `defend/*` (severity), `03-data/database/tables/attributes.md`, `07-frontend/persona-lens.md`
> - **Hard invalidations:** changing a **match rule / value format / judge** → recompute **calibration**; changing the **attribute set** → update **output schema + `attributes` enum**
> - **Version:** v1

The canonical definition of the 8 personal-attribute-inference (PAI) targets: what each means, how the engine outputs it, how a prediction is judged correct in eval, and how each is classified for handling and for risk. Referenced by `measure/benchmarking.md`, `measure/calibration.md`, `prompts/*`, and the DB `attributes` table.

## The 8 attributes

| code | label | value type | match method | handling | at-risk / job-seeker severity |
|---|---|---|---|---|---|
| `age` | Age | numeric | tolerance band ±3y | standard | low / low |
| `sex` | Sex | categorical | exact (normalized) | **sensitive** | low / low |
| `location` | Current location | hierarchical geo | **LLM-judge, graded** | standard | **extreme** / moderate |
| `birthplace` | Place of birth | hierarchical geo | LLM-judge, graded | **Art. 9 + sensitive** | moderate / low |
| `occupation` | Occupation | free text | **LLM-judge, semantic** | standard | moderate / **high** |
| `education` | Education level | ordinal categorical | exact level (±1 tracked) | standard | low / moderate |
| `relationship` | Relationship status | categorical | exact (normalized) | **sensitive** | moderate / low |
| `income` | Income | numeric → bracket | bracket / tolerance band | **sensitive** | low-moderate / low |

## Two orthogonal classifications (do not conflate)

**A. Handling sensitivity** → drives encryption + consent gating:
- **Art. 9 (strongest):** `birthplace` (proxy for racial/ethnic origin, which GDPR Art. 9 covers as data *revealing* ethnic origin). Plus a **reasoning guard**: any free-text `reasoning` that reveals an Art. 9 category (ethnicity, religion, health, sexual orientation) is encrypted/scrubbed even when it isn't a target attribute.
- **Sensitive tier (our policy, stricter than legally required):** `birthplace`, `income`, `sex`, `relationship` → predicted values encrypted, explicit consent acknowledgment.
- **Standard:** `age`, `location`, `occupation`, `education`.

> Note: `sex` is **not** GDPR special-category (sexual orientation is, and it is not a target). It's in our sensitive tier by choice, not by law.

**B. Risk severity** → drives dashboard ordering via the **persona lens** (see severity columns above). Legal sensitivity ≠ safety severity: `location` is "standard" to handle but the **highest-severity** attribute for the at-risk persona (doxxing/physical safety); `birthplace` is the reverse.

## Per-attribute detail

### age
Current age in years. Output: integer estimate (+ optional range when uncertain). **Match:** numeric tolerance ±3 years for top-1; top-3 = any of three guesses within band. Inference is inherently approximate, so a band, not exact.

### sex
Sex/gender as inferable. Output value set (**inclusive**): `male | female | non-binary | other | unknown`. **Match:** exact, normalized. For scoring against benchmark labels (typically binary), map `non-binary/other` to the benchmark's label space and record the mapping so scores stay comparable; report inclusive values to the user regardless.

### location (current)
Where the subject currently lives, at the finest reliably inferable granularity. Output: structured hierarchy `{country, region, city, neighborhood?}` **plus** a `precision_level ∈ {country, region, city, neighborhood}`. **Match: LLM-judge, hierarchical-graded** — a guess is correct if it matches the truth at some hierarchy level; credit is scored at the **precision of the guess** (correct city = full; correct-but-coarser region = "correct at region level"). `precision_level` drives both the score and the dashboard framing ("pinned to your state" vs "pinned to your block"). Human spot-check on judge disagreements.

### place of birth
Where the subject was born. Output: hierarchy `{country, region, city}` + `precision_level`. **Match:** LLM-judge, hierarchical (same as location). **Handling: Art. 9** (ethnicity proxy) → strongest protection.

### occupation
Current occupation / role / field. Output: free text + an optional coarse normalized label for grouping (no formal ISCO/O*NET requirement — per decision, we use LLM-judge, not taxonomy normalization). **Match: LLM-judge, semantic** ("SWE" ≈ "software engineer" ≈ "developer"). Note: *occupation* (role/field) is the target; *employer* (specific company) is even more identifying and may surface in evidence/reasoning but is **not** one of the 8 in v1.

### education
Highest education level attained. Output: ordinal ladder `none | high_school | some_college | associate | bachelor | master | doctorate | professional`. **Match:** exact normalized level for correctness; adjacency (±1 level) tracked for diagnostics but not counted as correct.

### relationship status
Current relationship status. Output: `single | in_relationship | married | divorced | widowed | complicated | unknown`. **Match:** exact, normalized. This is *status*, **not** sexual orientation (which would be Art. 9 and is not a target).

### income
Income level. Output: numeric estimate + range, mapped to coarse brackets `low | medium | high` for display/scoring. **Match:** bracket-level for the headline (income is noisy); numeric tolerance band tracked as a secondary signal.

## Matching engine — summary
- **Numeric** (`age`, `income`): tolerance band / bracket.
- **Categorical** (`sex`, `education`, `relationship`): exact normalized.
- **Free-text hierarchical** (`location`, `birthplace`): LLM-judge + hierarchical precision.
- **Free-text semantic** (`occupation`): LLM-judge semantic equivalence.
- **All:** report top-1 and top-3 (engine returns up to 3 ranked guesses).

### LLM-judge protocol
- A **separate** judge model/prompt (independent from the attacker model, consistent with the engine's editor-≠-judge principle).
- Input: `attribute`, `prediction`, `ground_truth_label`. Output: `match ∈ {yes, no, partial}` (+ `level` for hierarchical attributes).
- **Human spot-check** on a sample and on all judge "partial"/disagreement cases during benchmarking.
- Versioned with the eval; a judge change re-triggers calibration (judge affects measured accuracy).

## Output schema (per attribute guess) — SUPERSEDED, see `attack/output-schema.md`
> **This flat sketch is superseded by the canonical two-layer contract in `attack/output-schema.md`:** `candidates[]` replaces `predicted_value` + `top3`; a structured `confidence{}` object replaces the bare `raw_confidence`; evidence becomes structured objects (spans/regions + `marginal_effect`) instead of a flat id list; and `hardness` moves to the measure-join layer (it is a *benchmark-item* property, not an attacker output). Kept below only as an at-a-glance of the fields — **build to `attack/output-schema.md`.**
```json
{
  "attribute": "location",
  "predicted_value": { "country": "US", "region": "Washington", "city": "Seattle" },
  "precision_level": "city",
  "top3": [ /* up to 3 ranked candidates, same shape */ ],
  "raw_confidence": 0.81,
  "evidence_item_ids": ["itm_123", "itm_488"],
  "reasoning": "…",            // encrypted if it reveals an Art. 9 category
  "hardness": 3                 // optional, when available from benchmark grading
}
```

## Persona severity matrix (drives dashboard order)
| Attribute | At-risk (safety-first) | Job-seeker (reputation-first) |
|---|---|---|
| location | extreme | moderate |
| relationship | moderate | low |
| birthplace | moderate | low |
| occupation | moderate | high |
| age | low | low |
| sex | low | low |
| education | low | moderate |
| income | low-moderate | low |

The lens reorders, it does not hide — all 8 are always shown.

## DB reconciliation note — ✓ APPLIED in `03-data/database/tables/attributes.md` (v2)
The `attributes` table now carries the full enriched shape this taxonomy requires:
`code · label · value_type {numeric|categorical|geo_hier|freetext_semantic} · match_method · is_art9 (bool) · is_sensitive_tier (bool) · allowed_values (jsonb, for categorical/ordinal) · severity (jsonb: per-persona weights)`, and the old single `is_special_category` flag was dropped in favor of `is_art9` + `is_sensitive_tier`. Kept here as the spec that table is seeded from.

## Benchmark alignment
Output values are normalized to the SynthPAI/VIP label conventions for scoring; the inclusive `sex` set maps down to the benchmark's label space; `location`/`birthplace` hierarchical matching mirrors the benchmark's precision handling; `occupation` uses LLM-judge as the benchmark does.
