# Roadmap — Task Map (cross-repo reference)

> **Depends on:** `tasks-backend.md`, `tasks-frontend.md`, `build-order.md`, `milestones.md`, `decisions/0013-polyrepo.md` · **Version:** v3 (polyrepo — split per repo; this is the cross-repo map)

`/specify` + `/plan` = the docs. `/tasks` is **split per repo** so each proceeds at its own pace:
- **`tasks-backend.md`** — the `backend` repo (Python · uv): bootstrap → tracer bullet → M0–M4 → API (M5.1/M5.2/M5.C) → M6 → M7.
- **`tasks-frontend.md`** — the `frontend` repo (TS · pnpm): bootstrap → scaffold → screens (mocked) → data layer → tests → M7.

## Parallelization (for parallel implementation sessions)
The two repos are **independent except one seam** — run two sessions side by side:

```
backend:   R1 → tracer → M0 → M1..M4 → M5.1 ─┐(publish openapi.json)→ M5.C ─┐ → M6 → M7
                                             │                              │
frontend:  R2 → M5.3 → M5.5 (MSW mocks) ─────┘ ···wait for contract··· → M5.4 ┘ → M5.6 → M7
```

## The ONE cross-repo dependency (don't trip over this)
- **FE/M5.4** (real data layer) is **blocked-by BE/M5.1 + BE/M5.C** — the frontend can't generate its typed client until the backend **publishes `openapi.json`**.
- Everything before that is parallel: the frontend builds bootstrap → scaffold → all 7 screens on **MSW mocks** with no backend; the backend builds through M4 with no frontend.
- **E2E (FE/M5.6)** also needs the **backend deployed** to a preview env.

## Drift-catch (keep the two backlogs honest)
- A new endpoint/DTO in the backend reaches the frontend **only** via the regenerated client — the **drift guard** fails CI if the committed client is stale (`contract-tests.md`). When you add a BE API task, check whether an FE/M5.4 sub-task needs the new shape.
- Build the **tracer bullet (BE) first** — it proves DB+RLS+crypto+gateway before anything else.
- Gates per task: `definition-of-ready-done.md`. Hard-invalidation reflex: `00-traceability.md`.
