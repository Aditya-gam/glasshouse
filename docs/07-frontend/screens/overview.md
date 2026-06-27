# Frontend — Screens (inventory)

> **Depends on:** `user-flows/*`, `components.md` · **Version:** v1

The screens that realize the flows.

| Screen | Realizes | Notes |
|---|---|---|
| **Onboarding wizard** | onboarding-consent, connect-import, run-audit | guided, step-by-step; consent-first |
| **Dashboard** | run-audit results | all 8 attribute cards + the **persona-lens toggle** |
| **Attribute detail / Attribution** | attribution | evidence highlights, image bboxes, confirm/deny |
| **Defend simulation** | defend-simulation | before/after, frontier options, diff, decoy opt-in |
| **Connect / Import** | connect-import | OAuth + upload, kept-vs-dropped summary |
| **Account & data rights** | account-data-rights | consents, retention, export, erasure, crisis resources |
| **Accuracy / Trust** | accuracy-trust-view | benchmark + calibration; the credibility artifact |

App shell: authenticated, responsive, **WCAG AA**, calm/honest tone throughout. Server Components for static/initial data; `"use client"` only for the interactive screens (dashboard, simulation, toggles).
