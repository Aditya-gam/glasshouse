# Frontend — Overview

> **Depends on:** `.claude/rules/frontend.md`, `06-api/*`, `01-product/personas.md` + `ethics-and-tone.md` · **Consumed by:** `persona-lens.md`, `user-flows/*`, `screens/*` · **Version:** v1

Next.js App Router, governed by the `frontend` rule.

- **Server Components by default; `"use client"` only for interactive** (dashboard, simulation, toggles). A **Data Access Layer** (`server-only`) does authz + returns minimal DTOs; only the DAL reads `process.env`.
- **Client data via TanStack Query**; **run progress via polling + SSE** (`GET /v1/runs/{id}/events`) — a moving progress bar (`state-and-polling.md`).
- **Security:** auth re-checked in Server Actions (not middleware), validate all client input, nonce-based CSP, taint sensitive data. **TS strict + Zod** at the boundary (mirrors the API DTOs).
- **Accessibility:** semantic HTML, keyboard, WCAG AA — matters for the at-risk persona.
- **Honest UI:** show **calibrated reliability** (bands, never raw confidence), the persistent **no-false-safety** note, calm/non-alarmist tone.
- **Design system:** **shadcn/ui** (Radix + Tailwind, accessible-by-construction) on a calm, data-forward token system; light + dark; final visual via the **Claude Design** pass (`design-system.md`, `app-shell-and-layout.md`).

## Shape
A **guided wizard** for first run (consent → connect → audit → results), then a **dashboard** of all 8 attributes with the **persona lens** (`persona-lens.md`). Flows in `user-flows/*`, screens in `screens/`.
