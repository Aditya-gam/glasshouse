# Aditya Design System

Warm, approachable, accessible — a design system for AI &amp; full-stack web apps. Built on **Next.js + Tailwind v4 + shadcn/ui** conventions. Shared foundations (Geist type, warm sand neutral, generous spacing, soft rounded surfaces); **each product gets exactly one accent color** (default teal). Only the accent changes between products — everything else stays.

> Voice in one line: *warm and approachable on the surface, engineered underneath.*

---

## Sources (for whoever has access)

These are the inputs this system was built from. You don't need them to use the system, but they're recorded here:

- **Codebase** — `web/` (mounted, read-only): `globals.css` (shadcn-convention CSS variables mapped to Radix Colors, light + dark, Geist), sample `components/button.tsx` &amp; `card.tsx`, and `preview.html`. This is the **source of truth** for color / type / radius.
- **Figma** — *Aditya Design System.fig* (mounted): a single brand-preview frame ("Aditya-Brand"). No component library in the file — METADATA lists **0 component families** — so the components here are authored from the codebase + shadcn/ui conventions, not materialized from Figma.
- **Uploads** — `wordmark.svg`, `logomark.svg`, `lockup.svg`, `og-image.svg`, `favicon.ico` (now in `assets/`).

## Foundations at a glance

- **Color** — Neutral = Radix **Sand** (warm gray). Accent = Radix **Teal** (one scale per project). Status = **Jade** (success) / **Amber** (warning) / **Tomato** (danger) / **Indigo** (info). Light + dark via Radix `*-dark` scales.
- **Type** — **Geist** (text) + **Geist Mono** (code &amp; figures). Tabular numerals on by default. Medium (500) is the heading workhorse — rarely 700.
- **Spacing &amp; shape** — 4px spacing base, generous whitespace. Radii: cards **16px**, controls **12px**, small **8px**, pills **full**. Soft, low, warm-tinted shadows.
- **Motion** — calm, no bounce. 120–260ms, `cubic-bezier(0.2,0,0,1)`.
- **A11y** — WCAG AA contrast, visible focus ring (teal-8), never color-only, sentence case throughout.

---

## CONTENT FUNDAMENTALS

How Aditya writes. Copy is part of the product — keep it plain, warm, and direct.

**Voice.** Plain, warm, direct — the way you'd explain something to a teammate, not a press release. Confident without hype. We describe what a thing does and what the user gets, then stop.

**Person.** Address the user as **"you."** Use **"we"** for the product/team sparingly (e.g. "We'll never share it"). Avoid "I."

**Casing.** **Sentence case everywhere** — buttons, headings, menus, labels, table headers. Never Title Case UI, never ALL-CAPS words for emphasis (small-caps mono labels like `OVERVIEW` are a typographic device for eyebrow labels only, set via letter-spacing — not a copy decision).

**Tone &amp; length.** Short, concrete sentences. Lead with the outcome. Prefer verbs over nouns ("Connect a domain" not "Domain connection"). Helper text is one calm line. Errors are specific and blameless: "That name is taken" not "Invalid input."

**Buttons &amp; actions.** Verb-first and specific: *Save changes*, *Upgrade*, *Connect a domain*, *Delete project*. Avoid "OK" / "Submit." Destructive actions name the object: *Delete project*, not just *Delete*.

**Numbers.** Always tabular figures. Write quantities with units and context: "7.2 GB of 10 GB used", "92% of your monthly quota", "+12.4%". Use the en dash for ranges and negatives.

**Punctuation.** Oxford comma. Curly quotes and apostrophes (" " ' '). En dash for ranges, em dash — like this — for asides. One space after periods.

**Emoji.** **Not used** in product UI or brand copy. The brand expresses warmth through color, type, and spacing — not emoji. (Exception: none by default; ask before introducing any.)

**Examples (house style):**
- Title: *Warm, engineered underneath* · *Project storage* · *You're close to your limit*
- Helper: *We'll never share it.* · *This can't be undone.*
- Empty state: *No projects yet — create your first to get started.*
- Toast: *Saved* · *Copied to clipboard* · *Deploy complete*

---

## VISUAL FOUNDATIONS

The visual language. Answers the "why does this look like Aditya" questions.

**Overall vibe.** Calm, warm, and quietly engineered. Lots of breathing room; soft rounded surfaces sitting a hair above a warm off-white canvas. Nothing shouts. The teal accent is used like a highlighter — sparingly, on the one thing that matters.

**Color &amp; palette.**
- The neutral is **warm** (Radix Sand), never a cool blue-gray. Backgrounds are off-white `sand-2`; raised surfaces are `sand-1`. Text is `sand-12` (near-black with a warm cast), secondary text `sand-11`.
- **One accent per product.** Teal by default. Step 9 is the solid accent (`--primary`); step 3 is the soft accent fill; step 11 is accent text. To re-theme, swap the teal scale for another Radix scale — that's the only change.
- Status colors are reserved for status: jade/amber/tomato/indigo, always as a soft-fill + darker-text pair, never as decoration.
- **No gradients** as a brand device (no bluish-purple hero gradients). Color is flat and intentional. The only "gradient" is the soft shadow.

**Typography.** Geist throughout. Display/titles are Medium (500) with tight tracking (−0.01 to −0.02em) and tight leading (1.15). Body is Regular (400) at 15px with generous 1.6 leading. Mono (Geist Mono) for code, IDs, and any aligned numbers. Headings are sentence case. Type scale is short and calm — few steps, big jumps.

**Spacing &amp; layout.** 4px base; the system leans generous (24–48px section padding, 16–20px inside cards). Content max-width ~1120px; prose ~680px. Layouts are simple and grid-aligned; whitespace does the structuring, not borders.

**Corners &amp; cards.** Soft, consistent rounding: **cards 16px**, **controls 12px**, small chips 8px, pills/avatars full. A card = `sand-1` surface + `sand-6` 1px border + `--shadow-xs`. Hover-able cards lift 1px with `--shadow-md`. No heavy borders; the border is a whisper.

**Shadows &amp; elevation.** Soft, low, and **warm-tinted** — shadows use a sand-black (`rgba(33,32,28,…)`), never pure black, at low opacity. Four steps: xs (cards) → sm (raised) → md (popovers/menus) → lg (modals). Elevation is communicated by shadow + a touch of translateY, not by big borders.

**Borders &amp; lines.** 1px, `sand-6` for dividers and card edges, `sand-7` for input borders (a touch stronger). Separators are barely-there.

**Backgrounds.** Flat warm neutrals. No textures, no patterns, no full-bleed photography as a default. Imagery, when present, is incidental (avatars, product screenshots) — warm-leaning, never cold. The brand surface is the off-white canvas itself.

**Motion.** Calm and quick. Durations 120/180/260ms; standard easing `cubic-bezier(0.2,0,0,1)`, entrances use `cubic-bezier(0.16,1,0.3,1)`. **No bounce, no spring overshoot.** Dialogs scale-in from 0.98 + fade; toasts slide a few px; skeletons pulse gently. Everything respects `prefers-reduced-motion`.

**Hover states.** Primary buttons darken one Radix step (9 → 10), never lighten. Ghost/secondary fill with `sand-3/4`. Cards lift. Links and muted text move toward `--foreground`. Icon buttons get a `sand-3` background.

**Press / active states.** A tiny `translateY(0.5px)` on buttons; sliders' thumb scales to 1.1. No color flash. Restrained and physical.

**Focus.** Always visible: a 3px ring using `--ring` (teal-8) via `box-shadow`, never an outline that shifts layout. Invalid fields swap the ring to a tomato tint.

**Transparency &amp; blur.** Used only for scrims: the dialog overlay is a 38%-opacity sand-12 wash with a 2px backdrop blur. No frosted-glass panels elsewhere.

**Don'ts.** No bluish-purple gradients. No emoji cards. No cards with a colored left-border-only accent. No cool grays. No all-caps body copy. No drop shadows in pure black. No bounce easing.

---

## ICONOGRAPHY

**System: Lucide.** Aditya uses **[Lucide](https://lucide.dev)** — the icon set that ships with shadcn/ui — exclusively. Outline style, **2px stroke**, round caps and joins, 24×24 viewBox, drawn on a 1px grid. Icons inherit `currentColor` so they pick up text color automatically.

- **In components** (this repo): the small inline icons baked into primitives (checkbox tick, select caret, dialog/toast close, breadcrumb chevron) are hand-inlined **Lucide paths** at 2px stroke so components stay dependency-free. Match this style for any new component glyphs.
- **In UI kits &amp; mocks:** load Lucide from CDN and render with `data-lucide`:
  ```html
  <script src="https://unpkg.com/lucide@latest"></script>
  <i data-lucide="search"></i>
  <script>lucide.createIcons();</script>
  ```
  Common glyphs in use: `search, plus, settings, bell, check, x, chevron-right, chevron-down, arrow-right, sparkles, message-square, folder, file, trash-2, copy, external-link, more-horizontal, zap, shield-check, git-branch`.
- **Sizing.** 16px inline with text, 18–20px in buttons/toolbars, 24px standalone. Keep the 2px stroke — don't rescale stroke with size.
- **Color.** Icons are `--muted-foreground` at rest, `--foreground` on hover, `--primary` only when they represent the accent action. Never multicolor.
- **Emoji / unicode as icons:** **not used.** Use Lucide. The only non-Lucide marks are the brand logomark and the chevron carets that are part of a control.

**Brand marks** live in `assets/`: `logomark.svg` (the teal "A" drawn as a circuit — three nodes + struts), `wordmark.svg`, `lockup.svg` (mark + wordmark), `og-image.svg`, `favicon.ico`. The mark is teal `#12A594`; on dark surfaces it stays teal, the wordmark goes white (it's `currentColor`).

---

## INDEX — what's in this folder

**Foundations**
- `styles.css` — the global entry point (consumers link this). `@import` list only.
- `tokens/colors.css` · `typography.css` · `spacing.css` · `fonts.css` · `base.css` — the token layer.
- `guidelines/cards/*.html` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.

**Components** (`components/` — React primitives, consumed via `window.AdityaDesignSystem_25de17`)
- `forms/` — Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Field
- `data-display/` — Card (+ Header/Title/Description/Content/Footer), Badge, Avatar, Progress, Separator, Skeleton, Tag
- `feedback/` — Alert, Toast, Tooltip, Dialog
- `navigation/` — Tabs, Breadcrumb

**UI kits** (`ui_kits/` — full-screen, interactive recreations)
- `console/` — the Aditya **product console** (an AI app dashboard) — default teal accent.
- `marketing/` — the Aditya **marketing site** — landing surfaces.

**Templates** (`templates/` — starting folders consuming projects can copy)
- See each `templates/<slug>/`.

**Meta**
- `assets/` — logos &amp; brand marks.
- `SKILL.md` — makes this folder usable as a Claude Agent Skill.
- `readme.md` — this file.

---

## Re-theming a product (the one knob)

In a consuming project, copy `globals.css` (or link `styles.css`) and change **one** thing — the accent scale. Swap `teal` → another Radix scale and repoint:

```css
@import url('https://cdn.jsdelivr.net/npm/@radix-ui/colors@3/iris.css');
:root {
  --primary: var(--iris-9);
  --primary-hover: var(--iris-10);
  --accent: var(--iris-3);
  --accent-foreground: var(--iris-11);
  --ring: var(--iris-8);
}
```

For light accents (amber, lime, sky) set `--primary-foreground` to a dark value for contrast. Everything else — sand neutral, type, spacing, components — stays identical.
