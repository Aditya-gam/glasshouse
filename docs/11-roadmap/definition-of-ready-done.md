# Roadmap — Definition of Ready / Done

> **Depends on:** `tasks.md`, `acceptance-criteria.md`, `.claude/rules/*` · **Version:** v1

Unambiguous gates for each task in `tasks.md` — especially important for an AI-assisted build (a clear DoD is what keeps the agent on-rails).

## Definition of Ready (before starting a task)
- **Atomic** — one behavior, implementable + testable in isolation.
- **Deps done**; the **doc(s) it implements** are identified.
- The **acceptance check** (the test or observable outcome) is written **first** (TDD-style).
- Any **fixtures/data** it needs exist (or are a listed sub-task).
- It touches **one code path** (`router → service → repo → db`); no logic leaking across layers.

## Definition of Done (before checking it off)
- **Behavior** — the acceptance check passes; matches the doc.
- **Tests** — unit (pure `domain/`) and/or narrow integration added; the relevant **mandatory gate** passes (RLS · crypto round-trip/shred · third-party-drop · contract · eval-floor) where applicable.
- **Static** — `ruff` + `mypy --strict` (backend) / `tsc` + ESLint (frontend) clean; no implicit `Any`.
- **Security** — scope-bound query (RLS + app check); no secret/content in logs; consent gate on any run path.
- **Contract** — if it touches the API, OpenAPI is updated and the **generated client regenerated** (frontend drift guard); Schemathesis + contract tests green.
- **Migration** — one Alembic migration per schema change; expand-contract; reversible.
- **Commit** — Conventional Commit, one logical change, references the task id.
- **Docs** — if behavior diverged from the spec, the doc is updated (the spec stays source of truth).

## The hard-invalidation reflex (never skip)
Any change to the **attack model / prompt / pipeline / N / agreement-metric / judge / match-rule** → **recompute benchmarking + calibration** (`00-traceability.md`). Do not merge such a change without it — calibration desyncs silently and corrupts every reliability number.
