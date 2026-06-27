# Backend — Overview

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `archive/backend-structure.md` (the flat source this splits/supersedes), `02-architecture/*`, `03-data/*`, `04-ai-engine/*`
> - **Consumed by:** `layout.md`, `modules/*`, `06-api/*`
> - **Hard invalidations:** layering/dependency-direction change → update modules + tests
> - **Version:** v2 (reconciled: **gateway = thin proxy client**, +connectors, +media/EXIF, +calibration, +separation slots)

Clean layering, async-first, the three stages (attack/measure/defend) as **services behind workers**.

## Dependency direction
`api → services → repositories → db`. `domain` is pure (no IO) and depended on by services. **Workers call the same services as the API** (no logic duplicated). Nothing lower depends on anything higher.

## The v2 reconciliations over `archive/backend-structure.md`
- **LLM gateway = a thin client** to the self-hosted **LiteLLM Proxy** (OpenAI-compatible HTTP at an internal `base_url`) + the `instructor` wrapper — **not** an in-process SDK (`modules/llm-gateway.md`).
- **New modules:** connectors (OAuth pulls), media/EXIF ingestion, calibration/noise read+write, the **separation slots** (profiler ≠ feedback-adversary ≠ evaluator-adversary ≠ judges ≠ anonymizer), asserted at startup.
- **Richer services:** retrieval + self-consistency (attack), ablation + independent-adversary + noise-floor (defend), the match/utility judges (measure/defend).

## Build order (recommended)
config + db/session + models + Alembic `0001` → auth + RLS → crypto (+ round-trip test) → ingestion (+ third-party-drop test) → gateway client + attack service → eval + SynthPAI floor → defend (ablation + adversary + anonymizer) → workers + queue → **then** the API.
