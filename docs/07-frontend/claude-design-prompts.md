# Claude Design — Generation Playbook (the complete UI, screen by screen)

> **Depends on:** `claude-design-brief.md`, `app-shell-and-layout.md`, `user-flows/*`, `design-system.md` · **Version:** v1

How to generate the **full** Inference Exposure Auditor UI in Claude Design against your imported personal design system.

**Foundation = your personal design system** (`~/Documents/Projects 2/design-system`): warm **sand** neutral, **teal** accent (this app's accent), **Geist**, shadcn/ui, **Lucide**, light + dark. The earlier **slate** neutral (ADR 0011) is **superseded** — sand is the shared brand; teal is this app's accent.

## Workflow
1. **Set up the design system in Claude Design** (one-time) — the setup form: name/blurb + the `web/` folder + the saved `.fig` + assets (`logomark.svg`, `lockup.svg`, a `preview.html` screenshot) + the notes (`design-system/claude-design-setup.md`). This registers the system so every generation is on-brand.
2. **New Claude Design chat → paste Prompt 0** (project context) once.
3. **Generate screen by screen** (Prompts 1–7). Order: **Dashboard → Defend** first (the two hero screens prove the look *and* yield the shared components), then Onboarding, Attribution, Connect, Account, Trust.
4. **Extract shared components after the dashboard** — `AttributeCard`, the severity chip, the calibrated-reliability bar, the persona-lens toggle, the top bar — and reuse them everywhere (keep it DRY).
5. **Two-way-sync** each approved screen/component into the project `frontend/` via Claude Code.
6. **Every pass:** light + dark, the at-risk / no-alarmism check, WCAG AA, keyboard + focus-visible.

---

## Prompt 0 — project context (paste once, first)
```
You have my design system imported (warm sand neutral, teal accent, Geist + Geist Mono, shadcn/ui,
Lucide, light + dark, generous spacing, rounded corners, soft shadows, calm motion, WCAG AA,
sentence case). I'm building a privacy self-audit web app: it runs an AI attribute-inference attack
on the user's OWN footprint, measures it, then helps break it and proves the drop (Attack → Measure →
Defend). Tone: calm, trustworthy, data-forward — never alarmist (one persona is at-risk: journalists,
activists, abuse survivors). Accent for this app = teal.

Non-negotiables for EVERY screen:
- Show CALIBRATED reliability (a band/%), never the model's raw confidence.
- Severity uses a green→amber→orange→red heatmap as a RESTRAINED accent only (chip/dot + Lucide icon +
  text label; never full-card fills or full-screen red alerts).
- A persona-lens toggle (job-seeker ↔ at-risk) reorders severity but never hides; never force the user
  to self-identify.
- "No false safety" — never imply something is safe; deletion can't recall copies others made.
- "Abstained — no signal" is a first-class state, not an error.
- Light + dark; keyboard-first; visible focus; prefers-reduced-motion.

I'll send one screen at a time. Confirm you've got the system, then I'll send screen 1.
```

## Prompt 1 — Onboarding wizard
```
Screen 1 — ONBOARDING WIZARD (guided first run, consent-first). A calm, centered, multi-step wizard:
(1) Welcome — plainly "a self-audit of YOUR footprint," non-alarmist; (2) Consent — purpose
"self-audit," an explicit Art. 9 acknowledgment for sensitive attributes (e.g. birthplace), the
no-false-safety statement, deny-by-default (nothing runs without it); (3) hand-off to connect/import.
Step indicator, a primary "I consent & continue" (teal), a secondary back, reassuring microcopy.
```

## Prompt 2 — Dashboard (hero)
```
Screen 2 — DASHBOARD (home/hero; the reveal). Top bar: product mark (the node "A"), a persona-lens
segmented toggle (job-seeker | at-risk), a run-status indicator ("audit complete"), an account menu.
Below: a responsive grid of 8 attribute cards (location, relationship, birthplace, occupation, income,
age, education, sex), ordered by the active lens (at-risk leads with location). Each card: attribute
label, inferred value, a CALIBRATED reliability bar + % (never raw), a severity chip (heatmap color +
Lucide icon + label, small accent), a top-evidence peek ("6 posts pin this"), a "fix this" button.
Show ONE card in the "abstained — no signal" state (no bar). Calm, data-forward, generous spacing.
```

## Prompt 3 — Attribution detail
```
Screen 3 — ATTRIBUTION DETAIL ("why this inference?"). Open one attribute. Two-pane on desktop,
stacked on mobile. Left: the evidence list — the user's items with exact text spans HIGHLIGHTED, image
thumbnails with a bounding-box overlay on the revealing region, and EXIF findings (e.g. GPS). The
collective framing: "these six individually-bland posts together pin your city." Distinguish attack-side
"likely" evidence from ablation-"proven" evidence with two clear styles. Right: the inference summary
(value, calibrated reliability, severity) + a CONFIRM / DENY control to verify.
```

## Prompt 4 — Defend simulation (hero)
```
Screen 4 — DEFEND SIMULATION (the signature before→after). The hero. Show the proven before→after for
the targeted attribute: a large calibrated "0.86 → 0.21" with confidence INTERVALS and a "true value no
longer recovered" flip — measured by an independent adversary, not self-reported. A privacy/utility
FRONTIER selector: minimal generalization → stronger → remove → [opt-in] decoy (the decoy needs a
prominent warning that it publishes a falsehood + a per-use confirm). Show the edit DIFF (original vs
suggested). A PERSISTENT "no false safety" note, most prominent here. Advise-only: the CTA is "copy the
rewrite" / "download edited image," never "apply."
```

## Prompt 5 — Connect / import
```
Screen 5 — CONNECT / IMPORT (step 2; bring in the footprint). Two paths: (a) connect read-only OAuth —
Reddit, Mastodon (X = upload-first); (b) upload — X archive, Reddit export, Google Takeout, photos.
After import, a TRANSPARENCY summary: "kept N of your own items · dropped M third-party items" (we only
keep your own data). A retention choice: retain-encrypted vs process-then-discard. Live progress while
importing.
```

## Prompt 6 — Account & data rights
```
Screen 6 — ACCOUNT & DATA RIGHTS (control + transparency). Sections: Consents (view/grant/revoke —
purpose, Art. 9, decoy); Retention (toggle retain-encrypted ↔ process-then-discard); Connected accounts
(view/revoke, clears the token); Export (download my data bundle); Delete account — a calm destructive
action explaining crypto-shred + irreversibility (+ the honest caveat that copies others made can't be
recalled). A curated crisis/safety-resources panel for at-risk users.
```

## Prompt 7 — Accuracy / trust
```
Screen 7 — ACCURACY / TRUST (the public credibility view). "How do we know these numbers?" Show the
SynthPAI benchmark — top-1/top-3 accuracy per attribute (a clean chart) — and the CALIBRATION curve
("a 0.8 location guess is right ~76% of the time"). Explain the medical-test analogy (validated on a
population, then applied to you). Humble image framing: image accuracy is supplementary, shown with
intervals, not overclaimed. This doubles as the recruiter/credibility page, so make it polished.
```

---

## States (empty / loading / error) — generate after the happy paths
The "honest states" principle: every data screen designs these, not just the happy path. Generate the shared primitives once, then the per-screen specifics reuse them.

### Prompt 8 — shared state primitives (generate once, reuse everywhere)
```
States — SHARED PRIMITIVES (generate once; reuse on every data screen), on my design system:
1) Skeleton — calm placeholders matching the real layout (cards, rows, charts); reduced-motion safe.
2) EmptyState — centered: a soft Lucide icon, a one-line plain message, an optional secondary line, a
   primary action (teal). Never alarmist.
3) ErrorState — calm (NOT red-alert): a muted Lucide icon, what happened in plain words, a "try again"
   button, a quiet details affordance. No stack traces.
4) RunProgress — for async runs (attack/eval/remediation go through a queue with live SSE stages): a
   stepper/progress strip with named stages, the current stage, a cancel button, a "this can take a
   moment" line; resilient to a dropped stream (falls back to polling). Light + dark.
```

### Prompt 9 — dashboard states
```
Dashboard STATES (reuse the shared primitives):
- Loading: the attack run is running — RunProgress (retrieve → infer → calibrate) with the 8 cards as
  Skeletons; reveal cards as results stream in.
- Empty (no footprint yet): EmptyState — "Nothing to analyze yet" + a connect/import CTA.
- All-abstained (ran, no signal anywhere): a calm note — "We couldn't infer anything from your current
  footprint" (framed as good news, honestly), each card showing "abstained — no signal."
- Error (run failed): ErrorState with "Re-run audit."
```

### Prompt 10 — attribution states
```
Attribution detail STATES:
- Loading: Skeleton of the two-pane (evidence list + summary).
- Empty (abstained attribute): EmptyState — "No signal found for <attribute> — the engine looked and
  found nothing to infer," calm, with a back link. (Distinct from an error.)
- Error: ErrorState with "try again."
```

### Prompt 11 — defend simulation states
```
Defend simulation STATES (longer run: ablation → rewrite loop → independent-adversary re-attack):
- Loading: RunProgress with stages (find the minimal set → draft edits → re-attack & prove); a "proving
  against an independent adversary" line; cancel.
- "Not proven / within noise": an HONEST state — "We couldn't prove a real drop (it's within run-to-run
  noise)" — show the interval, not a fake success. Never imply safety.
- "Can't break without losing meaning": "No small edit breaks this without changing what you said — your
  options are remove the post or accept residual exposure." Offer remove.
- Error: ErrorState with "re-run simulation."
```

### Prompt 12 — connect / import states
```
Connect / import STATES:
- Loading (importing): RunProgress (parse → drop third-party → encrypt + embed); a live count; cancel.
- Empty (nothing connected): EmptyState — the connect/upload options as the primary content.
- Error (OAuth fail / unparseable upload): ErrorState — "Couldn't read that export" + what to try, with
  a per-source hint.
```

### Prompt 13 — accuracy / trust states
```
Accuracy / trust STATES:
- Loading: Skeleton of the chart + calibration curve.
- Empty (no benchmark yet): EmptyState — "No benchmark yet — run the eval to populate this," with the
  medical-test analogy as context.
- Error: ErrorState with retry.
```

## After the screens
- **Assemble a clickable flow** in Claude Design: onboarding → connect → dashboard → attribution → defend.
- **Generate empty / loading / error states** for the data-driven screens (dashboard, attribution, defend) — first-class, per the "honest states" principle.
- **Sync the component library** into `frontend/components/` and wire it to the API DTOs (`06-api/schemas.md`); polling/SSE per `state-and-polling.md`.
