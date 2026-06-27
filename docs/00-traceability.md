# Traceability & Change-Trigger Map

**Purpose:** when you change one component, this tells you what else to re-check, so edits don't silently desync. Use it together with the **header block** every doc carries (template at the bottom).

**How to use:** before committing a change, find the row for what you touched, update everything under "Re-check / update," and treat **Hard invalidation** rows as mandatory — those desync *silently* and corrupt results (wrong accuracy, stale calibration, broken isolation).

---

## Hard invalidations (the dangerous, silent ones)
These don't throw errors; they just make the system quietly wrong. Always action them.

1. **Attack model or attack prompt changes** → the calibration map is no longer valid → **recompute benchmarking + calibration**.
2. **Match rule / value format / judge model changes** (taxonomy) → measured accuracy shifts → **recompute calibration**; update output schema if the shape changed.
3. **Attribute set changes** (add/remove/rename/split) → update **attack output schema + `attributes` DB enum + attack prompts + dashboard**.
4. **Sensitivity reclassification** (Art. 9 / sensitive / standard) → update **encrypted columns + consent gating + `attributes` flags**.
5. **Any DB table schema change** → update **repositories + API DTOs + Alembic migration + ER diagram**.

---

## Dependency table

| Source / if you change… | Re-check / update | Hard? |
|---|---|---|
| **Product scope** (`01-product/scope-v1.md`, ADRs) — modality, connectors, advise-vs-act, personas | architecture, DB tables (`media_assets`/`connected_accounts`), ingestion sources, engine attack/defend paths, LLM gateway, frontend | — |
| **Taxonomy — attribute set** | attack output-schema, attack prompts, `attributes` DB enum, measure (bench+calib), defend, dashboard | **Yes** |
| **Taxonomy — value format / allowed values** | output-schema, `attributes.allowed_values`, scoring, frontend | **Yes**¹ |
| **Taxonomy — match rule / params** (age band, income brackets, location grading) | benchmarking, **calibration (recompute)** | **Yes** |
| **Taxonomy — sensitivity class** | crypto (encrypted columns), consent gating, `attributes` flags (`is_art9`/`is_sensitive_tier`) | —² |
| **Taxonomy — severity matrix / personas** | frontend persona-lens, measure persona weighting | — |
| **Judge model / judge prompt** | measured accuracy → **calibration (recompute)** | **Yes** |
| **Attack model / attack prompt / pipeline** (retrieval strategy, pass structure, **self-consistency N / agreement-clustering metric / sampling** — `attack/text-inference.md`, `confidence-and-self-consistency.md`) | benchmarking, **calibration (recompute)**, output parsing | **Yes** |
| **Independent adversary** (model / pipeline — `defend/independent-adversary.md`) | re-run affected **remediations**, **adversary calibration** (own `engine_version`), attribution-ablation, noise-floor, defend-simulation UI; assert adversary ≠ profiler ≠ anonymizer ≠ judge ≠ feedback-adversary | — |
| **Output schema** (attack) — *now defined in `attack/output-schema.md` (two-layer: emission `RawAttributeGuess` → canonical `AttributeGuess`)* | attack prompts (must emit emission shape), gateway **instructor emission models**, normalizer (GeoNames/band/bracket), repositories/DTOs + `inferences` table, frontend, measure parsing, **defend** (adversary re-emits the schema; ablation writes `evidence[].marginal_effect`) | — |
| **Calibration map** (recompute / new version) | per-user-scoring, frontend reliability display | — |
| **DB schema** (any table) | repositories, API schemas/DTOs, Alembic migration, ER diagram | **Yes** |
| **Encryption / DEK design** | crypto module, erasure (crypto-shred), all T2 columns, security docs | —² |
| **Consent model** (purposes/gating) | run gate (all services), API, privacy docs | —² |
| **API contract** (endpoint/DTO) | **republish `openapi.json` → regenerate the frontend client (`@hey-api/openapi-ts`, drift guard)**, frontend, workers, Schemathesis + contract tests | — |
| **Connectors** (add/change platform) | `connected_accounts`, ingestion sources, OAuth scopes, security (token storage) | — |

¹ Hard only if the format change affects matching. ² Not silent-corrupting, but **security/compliance-critical** — never skip.

---

## The two couplings to memorize
- **Match rule ↔ calibration** — any change to *how a prediction is judged* (rule, value format, or judge model) invalidates the calibration map.
- **Attribute set ↔ output schema + DB enum** — adding/removing/renaming an attribute breaks both unless updated together.

---

## Per-doc header-block convention
Every doc carries this block directly under its H1, so dependencies live next to the content:

```md
> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** <upstream docs this reads from>
> - **Consumed by:** <downstream docs that read this>
> - **Hard invalidations:** <what a change here forces to recompute/regenerate>
> - **Version:** v<N>
```

Versioned docs let tightly-coupled artifacts (output schema, `attributes` table, calibration map) reference the version they were built against, so a mismatch is detectable instead of silent.
