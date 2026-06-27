# Frontend — App Shell & Layout

> **Depends on:** `overview.md`, `design-system.md`, `screens/overview.md`, `user-flows/*`, `persona-lens.md`, `prototype-mapping.md` · **Version:** v2 (3-way lens · Trust linked inbound · reconciled w/ prototype)

The structural layer (information architecture + layout) the **Claude Design** pass renders. Next.js App Router.

## Route structure (App Router)
```
/(marketing)              landing + the accuracy/trust view (public; the credibility piece)
/(app)                    authenticated shell (Clerk-gated in the DAL, not middleware)
  /onboarding             guided wizard (consent → connect → first run)
  /dashboard              the 8 attribute cards + persona-lens toggle (home)
  /attribute/[code]       attribution detail (evidence + confirm/deny)
  /defend/[code]          the before→after simulation + frontier (per attribute)
  /connect                connect / import (OAuth + upload, kept-vs-dropped)
  /account                consents · retention · connected accounts · export · delete
```
- **Server Components** render the shell + initial data (via the DAL); `"use client"` only for the interactive islands (dashboard cards, simulation, toggles, polling).

## App shell
- **Top bar** — product mark · the **persona-lens toggle** (3-way: Balanced · Job-seeker · At-risk; default Balanced, never forced) · account menu · a run-status indicator (live via SSE).
- **Nav** — left rail (`md+`) / bottom tab bar (mobile): Dashboard · Attribution · Defend · Connect · Account.
- **Run progress** — a global, dismissible strip driven by the SSE stream, with poll fallback (`state-and-polling.md`).

## Layout patterns (structural intent)
- **Dashboard** — responsive grid of `AttributeCard`s (1-col mobile → 2 → 3/4), ordered by the active persona lens; each card: value · **calibrated reliability band** · severity chip (icon + label + heatmap accent) · top-evidence peek · "fix this" → **Attribution** (→ Defend).
- **Attribution** — two-pane (`md+`): the item/evidence list with highlighted spans + image-bbox overlays | the inference summary + **confirm/deny**. Single column, stacked, on mobile.
- **Defend simulation** — the **hero** before→after: the calibrated `0.86 → 0.21` with intervals + the **value-recovery flip**, a frontier selector (minimal → stronger → remove → [opt-in] decoy), and the edit **diff**. The **no-false-safety** note is persistent here.
- **Accuracy / Trust** — the SynthPAI numbers + the calibration curve + the medical-test analogy. Public on `(marketing)`, **and linked inbound** from the dashboard's calibrated-reliability affordance.

## Responsive & a11y
- Breakpoints: base (mobile-first) · `md` (two-pane) · `lg/xl` (multi-col dashboard). Keyboard-first, `focus-visible`, AA contrast, `prefers-reduced-motion` (`design-system.md`).
