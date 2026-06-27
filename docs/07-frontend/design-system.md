# Frontend — Design System

> **Depends on:** `overview.md`, `01-product/ethics-and-tone.md` (calm/non-alarmist), `persona-lens.md`, `04-ai-engine/attributes-taxonomy.md` (severity matrix), `decisions/0011-ui-stack.md` · **Consumed by:** `components.md`, `app-shell-and-layout.md`, every screen · **Version:** v1

The visual foundation. **shadcn/ui** (Radix primitives + Tailwind) is the component base — accessible by construction (WCAG / keyboard / focus / screen-reader), copied into the repo so we **own** every component. Direction: **calm, trustworthy, data-forward.** Final high-fidelity polish is handed to a dedicated **Claude Design** pass — this doc is its brief + the token contract.

## Tokens (Tailwind v4, CSS-first `@theme`, OKLCH)
- **Color** — **Radix Colors** (12-step, light + dark): **sand** neutral + **teal** accent; severity ramp green → amber → orange → red. Semantic tokens resolve per mode (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-subtle`, `--color-border`, `--color-accent-solid`). Machine-readable contract: **`design-tokens.json`**; full hand-off packet: **`claude-design-brief.md`**.
- **Type** — **Geist** (humanist sans, per the personal design system); tokens `--text-title / -heading / -body / -body-subtle / -caption`; **tabular numerals** for the confidence/accuracy figures.
- **Spacing / radius / shadow / motion** — 4px spacing scale; `--radius-{sm,md,lg}`; soft (calm) shadows; short ease-out motion that respects `prefers-reduced-motion`.
- **Naming contract** — design-spec name **==** CSS var (`color/primary/600` ⇄ `--color-primary-600`) so the Claude Design pass and the code stay in lockstep.

## Dark mode (ship both)
Semantic tokens only — components **never** hardcode `sand-900` / `dark:sand-100`. `prefers-color-scheme` default + a manual toggle. Both modes meet **WCAG AA** (4.5:1 text, 3:1 large/UI).

## Severity / risk system (the decision: conventional heatmap — tuned)
The familiar **green → yellow → orange → red** risk language, for instant legibility — made to work inside the calm, at-risk-safe direction:
- **OKLCH-balanced, slightly desaturated** stops (`--sev-low / -moderate / -high / -extreme`) — legible, never blaring; AA-contrast checked in both modes.
- **Never color-only** — every severity also carries an **icon + text label** (colorblind-safe; satisfies "don't rely on color").
- **Accents, not floods** — a severity chip / left-border / dot on the attribute card, **not** full-card red fills or full-screen alerts (the no-alarmism rule, esp. at-risk).
- **Persona-lens-aware** — the lens reorders by the `attributes-taxonomy.md` severity matrix; at-risk surfaces high-severity first but keeps the calm presentation; nothing is hidden.
- *Tension noted (honest):* a red heatmap is inherently more alarming than a restrained scale; the tuning above is how we keep it within the ethics rule — **flagged for the Claude Design pass to validate** against the at-risk persona.

## Components (shadcn/ui base + additions)
- **Icons:** **Lucide** (the shadcn/ui default; clean Feather-style outline); severity icons mapped in `design-tokens.json` (`shield-check` / `circle-alert` / `triangle-alert` / `octagon-alert`).
- **shadcn/ui primitives:** Card, Dialog, Tabs, Tooltip, Badge, Toast/Sonner, Popover, Command, Form, Switch, Skeleton.
- **Recharts** (via shadcn Charts) for the dashboard + the before/after viz; `visx` only if a bespoke chart needs it.
- **Bespoke, on the primitives:** `AttributeCard`, `AttributionEvidence` (span highlight + image-bbox overlay), `DefendFrontier` (before/after + frontier selector), `CalibrationCurve`, `KeptVsDropped`, `CrisisResourcesPanel`.

## Accessibility (non-negotiable — at-risk persona)
Semantic HTML first; full keyboard; visible focus rings; AA contrast; `alt` on images; `prefers-reduced-motion`; never color-only. Inherited from Radix, enforced in review.

## Claude Design hand-off
This doc + `app-shell-and-layout.md` are the **brief**; the final high-fidelity visual design is produced via **Claude Design**, then re-expressed as the tokens above (one source of truth for code + design). Any wireframes are structural intent, not final pixels.
