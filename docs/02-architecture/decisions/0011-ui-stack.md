# ADR 0011 — Frontend UI stack & design direction

**Status:** Accepted (v2 — amended: **sand** neutral per the personal design system; supersedes the original slate)

**Context.** The frontend had architecture + flows but no visual design. It must serve two personas (job-seeker, at-risk), meet WCAG AA, and stay calm/non-alarmist while still communicating real risk.

**Decision.**
- **Foundation:** **shadcn/ui** (Radix primitives + Tailwind v4), **Lucide** icons, **Radix Colors** (**sand** neutral + **teal** accent; light + dark) — accessible-by-construction, copied into the repo (we own the components); **Recharts** for charts. Tokens: `07-frontend/design-tokens.json`; hand-off: `claude-design-brief.md`. *(Sand supersedes the original slate, aligning with the personal design system — see `claude-design-brief.md`.)*
- **Direction:** **calm, trustworthy, data-forward** (muted neutral base + one accent; hierarchy over alarm).
- **Severity:** the **conventional green→yellow→orange→red heatmap** for instant legibility — but OKLCH-balanced/desaturated, **always paired with icon + label** (colorblind-safe, never color-only), used as accents not floods, and persona-lens-aware.
- **Theming:** **light + dark** via semantic design tokens.
- **Final visual design:** produced via a dedicated **Claude Design** pass; `07-frontend/design-system.md` + `app-shell-and-layout.md` are its brief + the token contract.

**Rationale.** shadcn/ui gives WCAG-grade primitives without lock-in (best for an a11y-critical, craft-showcase portfolio piece). The heatmap was chosen over a more restrained scale for legibility; the tuning keeps it within the no-alarmism ethics. Tokens-first dark mode is nearly free in Tailwind v4 and expected in 2026.

**Consequences.** A small **tension** between a red heatmap and the at-risk no-alarmism rule — mitigated by desaturation + icon/label + accent-only usage + the persona lens, and flagged for the Claude Design pass to validate. The token naming contract keeps Claude Design and the code in lockstep.
