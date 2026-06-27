# Frontend — Claude Design Brief (hand-off packet)

> **Depends on:** `design-system.md`, `design-tokens.json`, `app-shell-and-layout.md`, `01-product/personas.md` + `ethics-and-tone.md`, `decisions/0011-ui-stack.md` · **Consumed by:** the Claude Design pass · **Version:** v1

The single packet to hand **Claude Design** (Anthropic Labs) to produce the high-fidelity UI. Claude Design generates real front-end code in Artifacts, **imports design systems**, and **two-way-syncs with Claude Code** — so the flow is: import the tokens → generate screen-by-screen → sync components into `frontend/`.

## The product in one line
A privacy self-audit that runs an LLM **attribute-inference attack on the user's own footprint**, **measures** it on a public benchmark, then helps them **break** the inference and **proves** the drop — *Attack → Measure → Defend*. The signature moment: a calibrated **0.86 → 0.21** before/after.

## Locked design decisions
- **Foundation:** the **personal design system** (`~/Documents/Projects 2/design-system`) — shadcn/ui + Tailwind v4, **Lucide** icons, **Radix Colors**, warm **sand** neutral, **Geist** type, light + dark. This app's **accent = teal**. *(Supersedes the earlier **slate** neutral in ADR 0011: under the personal system's "shared everything, per-project accent" rule, sand is the shared brand neutral and only the accent is per-project.)*
- **Generate the screens with `claude-design-prompts.md`** — the per-screen prompt playbook.
- **Direction:** calm, trustworthy, data-forward (muted sand + the teal accent; hierarchy over alarm).
- **Severity:** the conventional green → amber → orange → red heatmap, **tuned** — desaturated, **always icon + label** (colorblind-safe), used as **accents not floods**, persona-lens-aware (`design-tokens.json` → `color.severity`).
- **Tokens:** `design-tokens.json` is the contract — import it; never hardcode colors.

## Non-negotiables (product + ethics + a11y)
- **Calm, never alarmist** — proven numbers carry the weight; no full-screen red, no panic copy (esp. the at-risk persona).
- **Calibrated reliability, never raw confidence** — always the calibrated band / %.
- **No false safety** — the persistent note (deletion can't recall copies others already made), prominent at the defend step.
- **Abstain is first-class** — "no signal — abstained," never a fabricated guess.
- **WCAG AA** — semantic HTML, full keyboard, focus-visible, AA contrast, `alt`, `prefers-reduced-motion`, never color-only.
- **Two personas, one lens** — the persona-lens toggle reorders severity (job-seeker ↔ at-risk); never hides; never forces self-identification.

## Screens to design (detail in `app-shell-and-layout.md` + `user-flows/*`)
1. **Onboarding wizard** — consent → connect → first run (calm, consent-first).
2. **Dashboard** *(hero)* — 8 attribute cards, persona-lens toggle, calibrated bands, severity chips, "fix this." Reference: the dashboard wireframe produced in the planning session.
3. **Attribution detail** — evidence: highlighted text spans + image-bbox overlays + EXIF; the "six boring posts" collective framing; proxy "likely" vs ablation "proven"; confirm/deny.
4. **Defend simulation** *(hero)* — the before→after with intervals + value-recovery flip; the privacy/utility frontier selector (minimal → stronger → remove → opt-in decoy with warning + per-use confirm); the edit diff; the persistent no-false-safety note.
5. **Connect / import** — OAuth + upload; the kept-vs-dropped transparency summary.
6. **Account & data rights** — consents, retention toggle, connected accounts, export, crypto-shred delete (irreversibility explained); crisis resources.
7. **Accuracy / trust** *(public)* — the SynthPAI numbers + calibration curve + the medical-test analogy (the credibility piece).

## Components (shadcn primitives + bespoke)
shadcn: Card, Dialog, Tabs, Tooltip, Badge, Sonner, Popover, Command, Form, Switch, Skeleton. Charts: Recharts. Bespoke: `AttributeCard`, `AttributionEvidence`, `DefendFrontier`, `CalibrationCurve`, `KeptVsDropped`, `CrisisResourcesPanel` (`design-system.md`).

## Hand-off steps
1. **Import `design-tokens.json`** into Claude Design (and into the Tailwind/shadcn theme — one source of truth).
2. **Generate screen by screen**, pasting that screen's section from `app-shell-and-layout.md` + the relevant `user-flows/*` + these non-negotiables.
3. **Iterate visually** in Artifacts; run the at-risk / no-alarmism check every pass.
4. **Two-way-sync** the approved components into `frontend/` (Claude Code).
5. **Re-validate** the tuned heatmap against the at-risk persona once it's on real screens.
