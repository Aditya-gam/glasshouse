# Roadmap — Frontend Tasks (`frontend` repo)

> **Depends on:** `tasks.md` (cross-repo map), `decisions/0013-polyrepo.md`, `07-frontend/*` · **Version:** v1 (split from tasks.md)

`id — task — (⟵ needs) — [doc] — done`. The **one cross-repo gate is M5.4** (needs the backend's published OpenAPI). Everything before it — bootstrap, scaffold, all 7 screens on **MSW mocks** — runs **fully in parallel** with the backend.

## Bootstrap
- [x] R2 — Next.js + TS strict + **pnpm** + Tailwind v4 + shadcn/ui + Lucide, husky + lint-staged, `instrumentation.ts` (OTel), `ci.yml` (tsc/ESLint/Semgrep) — [repo-structure] — done: `next dev` runs; CI green **[no backend dep]**
- [x] R3 — release-please + branch protection + required checks + CODEOWNERS + PR template — (⟵ R2) — [dev-workflow] — done: Release PR opens; red blocks

## M5 — Frontend (parallel-friendly)
- [x] M5.3 — scaffold wired to the design tokens (**sand** + teal · Geist · Lucide); promote the **severity ramp** into the Tailwind v4 `@theme` — (⟵ R2) — [design-system/prototype-mapping] — done: theme + a11y baseline **[no backend dep]**
- [x] M5.5 — sync the 7 screens from **`./prototype/`** (JSX→TSX per `prototype-mapping.md`; `window.*`→exports, `location.href`→router) + empty/loading/error/abstain states, on **MSW mocks** — (⟵ M5.3) — [prototype-mapping] — done: screens render on mocked data **[no backend dep]**
- [ ] M5.4 — DAL + TanStack Query + poll/SSE on the **generated client** + **Zod** at the boundary — (⟵ M5.3, ⛔ **BE/M5.1 + BE/M5.C** cross-repo) — [state-and-polling] — done: typed, server-auth in the DAL, live data
  > **M5.4 gate (clarified):** needs the **live backend**, not just the published contract. Backend preconditions (6): reachable URL + CORS · critical-path endpoints return real data · SSE auth method · shared Clerk instance · canonical `openapi.json` · `Idempotency-Key` contract. Resume on the backend's **READY SIGNAL**. Ships as 2 PRs — (1) generated `@hey-api` client + CI drift-guard; (2) server-only DAL + Clerk token + TanStack Query + SSE/poll + `lib/data` swap.
- [ ] M5.6 — tests: **Vitest + RTL + MSW** (async RSC → Playwright) + **Playwright** E2E vs preview env — (⟵ M5.4, M5.5, ⛔ **BE deployed** for E2E) — [10-testing] — done: green in CI
- [x] M5.7 — a11y refactors (prototype HANDOFF §6): card-as-link + overlay (drop nested buttons), focus-on-route-change, verify Dialog focus-trap, calibration-chart data table — (⟵ M5.5) — [prototype-mapping] — done: axe clean + keyboard pass

## M7 — Polish (frontend)
- [ ] M7.2 — deploy: Vercel (native Git, PR previews) — (⟵ R2) — [infrastructure] — done: live URL, previews per PR
- [ ] M7.3 — CI/CD: tsc/ESLint · **client drift-guard** · Semgrep · Vitest · Playwright + merge→staging→manual-promote→prod — [ci-cd/github-actions] — done: red gate blocks
