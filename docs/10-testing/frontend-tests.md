# Testing — Frontend (unit / integration)

> **Depends on:** `.claude/rules/testing.md` (the Trophy), `07-frontend/*`, `strategy.md` · **Version:** v1

The **Testing Trophy** — static + a thick integration layer. Tooling: **Vitest** + **React Testing Library**; **MSW** (mock service worker) for the API; static = `tsc` strict + ESLint.

## Layers
- **Static (biggest ROI)** — TypeScript strict + ESLint + the **generated-client drift guard** (regenerate from the backend's published `openapi.json`; fail on diff).
- **Component** — render in isolation, assert from the user's perspective: the `AttributeCard` shows a **calibrated band (never raw)**, the severity chip carries **icon + label**, the **abstain** state renders, the persona-lens toggle **reorders** (never hides).
- **Integration (the thick layer)** — a screen + its data hook against **MSW** returning contract-shaped responses: the dashboard renders 8 cards from a mocked run; defend-simulation shows the before/after + frontier; the **loading / empty / error** states render.
- **Minimal pure-unit** — only non-trivial helpers (formatting, the lens-ordering function).

## Principles
- **Behavior, not implementation** — query by role/text, not internals.
- **No real network** — MSW generated from the OpenAPI contract; deterministic.
- **a11y in the test** — `vitest-axe` on rendered components (roles, keyboard, contrast).
- **Honest states tested** — every data screen's loading/empty/error/abstained path has a test.

## Not here
Cross-stack flows **and async Server Components** → E2E (`e2e-tests.md`) — Vitest can't render async RSC. Visual polish → the design pass, not assertions.
