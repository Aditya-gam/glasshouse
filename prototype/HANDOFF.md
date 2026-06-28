# Glasshouse — Prototype Handoff

> **Purpose:** reconcile the planning docs against what the prototype **actually is**. Where the build differs from the brief or `design-tokens.json`, it's flagged in §7. Where I'm not certain, it says so.

## 0. What this prototype actually is (read first)

- **Stack as-built:** static, multi-page **React 18 + in-browser Babel** (no bundler, no TypeScript, no router). Each screen is its own `.html` file that loads pinned CDN React/ReactDOM/Babel, the Aditya DS bundle, then shared + screen JSX.
- **No modules.** Shared code is published on `window` globals (`window.IEA`, `window.AppShell`, `window.States`, `window.Icon`, plus `window.AttributeCard` etc.). Screens read those globals — there are no `import`/`export` statements.
- **Navigation is real but page-level:** `window.location.href = "X.html"` and `window.history.back()`. There is no SPA route table; "routes" are filenames.
- **All data is mocked/static** in `*-data.jsx` files. There is no network layer. Progress bars, "Live/polling" indicators, and import are client-side `setInterval` simulations.
- **TypeScript interfaces in this doc are reconstructed** from runtime JSX usage — they are an accurate contract to type against, not literal source types (the source is untyped JSX).
- **Seed user:** "Marta Rocha", an at-risk investigative journalist in **Lisbon**. One coherent dataset across screens.

---

## 1. Screen & route inventory

8 HTML files. Five form the core journey; Account and Trust are reachable but off the main spine; States is a dev showcase.

| Screen | Route | Purpose |
|---|---|---|
| Onboarding | `Onboarding.html` | Consent-first wizard (Welcome → Consent → Connect hand-off). **Journey entry.** |
| Connect / import | `Connect.html` | Bring in footprint: read-only OAuth + upload, live import, kept-vs-dropped, retention. |
| Dashboard | `Dashboard.html` | The reveal — 8 attribute cards, persona lens, calibrated reliability. |
| Attribution | `Attribution.html` | "Why this inference?" two-pane evidence + confirm/deny for **location**. |
| Defend | `Defend.html` | Before→after simulation; frontier + decoy; proven 0.86 → 0.21. |
| Account & data rights | `Account.html` | Consents, retention, connected accounts, export, safety resources, delete. |
| Accuracy / trust | `Trust.html` | Public credibility page: SynthPAI benchmark, calibration curve, analogy. |
| State primitives | `States.html` | Showcase of Skeleton/Empty/Error/RunProgress. Not a product screen. |

**Navigation graph (control → destination):**

- `Onboarding` — final step button **"Connect or import"** → `Connect.html`. (In-wizard: "Get started"/"I consent & continue" advance steps; "Back" steps back; consent button is disabled until all three boxes are checked.)
- `Connect` — **"Run my audit"** (appears only after ≥1 source imported) → `Dashboard.html?state=loading`.
- `Dashboard` —
  - **location** card: whole-card click **and** "Fix this" **and** "6 posts pin this ›" → `Attribution.html`.
  - other cards: "Fix this" → toast only (not wired; only location has detail).
  - account avatar menu → `Account.html` (+ `#connected`, `#export` anchors).
  - brand → `Dashboard.html`; **Back** → `history.back()`.
- `Attribution` — **"Break this inference"** → `Defend.html`; breadcrumb "Dashboard" → `Dashboard.html`; **Back** → `history.back()`. (Confirm/Deny is in-page only.)
- `Defend` — within-noise state actions ("Try a stronger edit" / "Remove the post") are **in-page** (swap the frontier option); breadcrumbs → Dashboard/Attribution; **Back** → `history.back()`. CTAs copy/download only.
- `Account` — "Back to dashboard" + breadcrumb → `Dashboard.html`; connected-accounts/export link → `Connect.html`. Reachable from every shell screen's account menu.
- `Trust` — CTAs → `Onboarding.html` and `Dashboard.html`. **No inbound link from the journey** (standalone; see §7).
- `States` — standalone; not linked from the journey.

**Persona lens & theme persist** across screens via `localStorage` (keys in §3).

---

## 2. Component inventory

shadcn/ui primitives are consumed from the Aditya DS bundle as `window.AdityaDesignSystem_25de17.{Button, IconButton, Card, Checkbox, Switch, Avatar, Tooltip, Dialog, Skeleton, Alert, …}`. Everything below is **bespoke** unless noted as a DS primitive. Props are reconstructed TS.

### Shared (in `js/app-shell.jsx`, `js/states.jsx`, `js/icons.jsx`, `js/dashboard-cards.jsx`)

```ts
// icons.jsx — inline Lucide renderer
interface IconProps { name: string; size?: number; /*=18*/ stroke?: number; /*=2*/ className?: string; style?: React.CSSProperties; }

// app-shell.jsx → window.AppShell
type Lens = 'balanced' | 'jobseeker' | 'atrisk';
interface TopbarProps {
  theme: 'light' | 'dark'; setTheme: (t: 'light'|'dark') => void;
  onAccount: (label: string) => void;
  lens?: Lens; setLens?: (l: Lens) => void;
  center?: React.ReactNode;        // run-status pill, breadcrumb, or <SetupSteps/>
  showLens?: boolean;              // default true; false on Connect (pre-audit)
  showBack?: boolean;              // default true; history.back()
}
interface PersonaLensProps { value: Lens; onChange: (l: Lens) => void; }   // radiogroup, arrow-key nav
interface AccountMenuProps { onAction: (label: string) => void; }          // menu items link to Account.html
interface SetupStepsProps { active: 'setup' | 'connect' | 'audit'; }       // setup-path indicator
interface ToastProps { msg: string | null; }
// hooks: useTheme(): [theme, setTheme];  useToast(): [msg, fire(msg)]

// states.jsx → window.States
interface EmptyStateProps {
  title: string; icon?: string; /*='inbox'*/ message?: string; message2?: string;
  action?: string; onAction?: () => void; actionHref?: string;   // actionHref wins over onAction
}
interface ErrorStateProps {
  title?: string; /*='We couldn't complete that'*/ message?: string;
  onRetry?: () => void; retryLabel?: string; /*='Try again'*/ details?: string;   // <details> body, no stack trace
}
interface RunProgressProps {
  stages: string[]; title?: string; current?: number; /*=0*/
  status?: 'running' | 'polling' | 'done'; /*='running'*/ hint?: string; onCancel?: () => void;
}
interface PreviewSwitchProps { views: {key:string;label:string}[]; view: string; onChange:(k:string)=>void; label?: string; }
// useViewState(views, fallback?): [view, setView]   // syncs ?state= in the URL (replaceState)
// Skeleton compositions (no props unless noted): SkelCard, SkelRow, SkelChart; SkelGrid({ n?: number /*=6*/ });
//   Sk(props) is a thin passthrough to DS <Skeleton> (className/style/variant/width/height).

// dashboard-cards.jsx (shared; published as window.SeverityChip / window.ReliabilityBar / window.AttributeCard)
type SeverityLevel = 'low' | 'moderate' | 'high' | 'extreme';
interface SeverityChipProps { level: SeverityLevel | 'abstain'; }
interface ReliabilityBarProps { point: number; lo: number; hi: number; }   // calibrated %, role="img" + aria-label
interface AttributeCardProps {
  attr: AttrItem;                       // see §3
  level: SeverityLevel | 'abstain';
  onFix: () => void;
  onEvidence?: (() => void) | null;     // renders the "evidence ›" link when set
  onOpen?: (() => void) | null;         // makes the whole card role="button" + keyboard-activatable
}
```

### Route-specific (bespoke)

```ts
// ── dashboard.jsx (route App + helpers) ───────────────────────────────
interface PageHeadProps { sub: React.ReactNode; showCalib: boolean; }
function PreviewSwitch(p: { view: string; onChange: (k: string) => void }): JSX.Element;
//   NOTE: dashboard.jsx keeps its OWN local PreviewSwitch (reads the module-level VIEWS),
//   distinct from window.States.PreviewSwitch that the other screens use.
function useAuditRun(active: boolean, onDone: () => void):
  { stage: number; revealed: number; status: 'running' | 'done' };           // setInterval, elapsed-time
//   VIEWS keys: 'loaded' | 'loading' | 'empty' | 'abstained' | 'error'
//   STAGES = ['Retrieve', 'Infer', 'Calibrate']

// ── connect.jsx ───────────────────────────────────────────────────────
interface Source   { id: string; name: string; icon: string; kind: 'oauth' | 'upload'; kept: number; dropped: number; desc: string; }
interface ImportJob{ id?: string; name: string; icon: string; kind?: 'oauth'|'upload'; kept?: number; dropped?: number; progress: number; count: number; total: number; }
interface SourceCardProps { src: Source; imported: boolean; busy: boolean; onConnect: (s: Source) => void; }
interface ImportRunProps  { job: ImportJob; onCancel: () => void; }            // wraps <RunProgress>; live count in title
interface ConnectErrorProps { onRetry: () => void; }                          // <ErrorState> + per-source hints
//   STAGE_LABELS = ['Parsing items', 'Dropping third-party', 'Encrypting + embedding']
//   stageIndex(progress:number) => 0|1|2 ;  VIEWS keys: 'connect' | 'importing' | 'error'

// ── attribution.jsx ───────────────────────────────────────────────────
interface KindBadgeProps    { kind: 'proven' | 'likely'; }
interface EvidenceItemProps { item: EvidenceItem; }                           // see §3
interface VerifyProps       { fireToast: (msg: string) => void; }             // local state: null|'confirmed'|'denied' + reason chip
function AttrSkeleton(): JSX.Element;                                          // two-pane loading skeleton
function highlight(text: string, quotes: string[], klass: string): React.ReactNode[];  // non-overlapping <mark> spans
//   VIEWS keys: 'loaded' | 'loading' | 'empty' | 'error'  (empty = abstained attribute)

// ── defend.jsx ────────────────────────────────────────────────────────
interface DiffTextProps     { segs: DiffSeg[]; }
interface DiffItemProps     { edit: DefendEdit; }
interface HeroProps         { opt: DefendOption; }
interface FrontierOptionProps { opt: DefendOption; selected: boolean; decoyEnabled: boolean; onSelect: (o: DefendOption) => void; }
interface NotProvenResultProps { onStronger: () => void; onRemove: () => void; }   // "within noise" honest state
interface CantBreakResultProps { onRemove: () => void; onAccept: () => void; }     // "can't break" honest state
function IntervalCompare(): JSX.Element;                                       // before/after interval-overlap chart
function useDefendRun(active: boolean, onDone: () => void): { stage: number; status: 'running' | 'done' };
//   DEFEND_STAGES = ['Find the minimal set', 'Draft edits', 'Re-attack & prove']
//   VIEWS keys: 'loaded' | 'loading' | 'unproven' | 'nomeaning' | 'error'
//   App-local state: selectedKey: DefendOption['key']; decoyEnabled: boolean; dialog: null|'optin'|'confirm'

// ── account.jsx ───────────────────────────────────────────────────────
interface SafetySectionProps { emphasized?: boolean; }                        // emphasized => promoted to top under at-risk lens
//   App-local state:
//     consents:  { purpose: boolean; art9: boolean; decoy: boolean }
//     retention: 'retain' | 'discard'
//     accounts:  { id: string; icon: string; name: string; handle: string; date: string }[]
//     dialog:    null | 'revoke-purpose' | 'revoke-art9' | 'decoy' | 'delete'   (delete gated by an ack Switch)

// ── trust.jsx ─────────────────────────────────────────────────────────
interface BenchmarkSectionProps   { loading: boolean; }
interface CalibrationSectionProps { loading: boolean; }
interface ErrorDataProps          { onRetry: () => void; }
function CalibrationChart(): JSX.Element;     // SVG reliability diagram, role="img" + aria-label
function BenchSkeleton(): JSX.Element;  function CalibSkeleton(): JSX.Element;  function EmptyData(): JSX.Element;
//   VIEWS keys: 'loaded' | 'loading' | 'empty' | 'error'

// ── onboarding.jsx (wizard; all route-local) ──────────────────────────
interface WelcomeProps    { headingRef: React.Ref<HTMLHeadingElement>; }
interface ConsentProps    { headingRef: React.Ref<HTMLHeadingElement>;
                            consents: { purpose: boolean; art9: boolean; noFalse: boolean };
                            toggle: (k: 'purpose' | 'art9' | 'noFalse') => void; }
interface ConnectProps    { headingRef: React.Ref<HTMLHeadingElement>; consentedAt: number | null; }
interface PillarProps     { step: string; title: string; icon: string; children: React.ReactNode; }
interface KvProps         { k: string; children: React.ReactNode; }
interface ConsentRowProps { id: string; checked: boolean; onChange: () => void; title: string; children: React.ReactNode; }
interface PathProps       { icon: string; title: string; children: React.ReactNode; }
//   STEPS keys: 'welcome' | 'consent' | 'connect'  (persisted in localStorage iea_onboarding_v1)
```

### shadcn/ui primitives consumed (from the Aditya DS bundle, `window.AdityaDesignSystem_25de17`)

`Button`, `IconButton`, `Card` (+ `CardHeader/Title/Description/Content/Footer`), `Checkbox`, `Switch`, `Avatar`, `Tooltip`, `Dialog`, `Skeleton`, `Alert`, `Separator`. These are **not** redefined — the prototype composes them. Map each to the repo's shadcn component of the same name during sync.

---

## 3. Data shapes the UI consumes (→ backend API contract)

```ts
type SeverityLevel = 'low' | 'moderate' | 'high' | 'extreme';      // runtime also uses 'abstain'
type Lens = 'balanced' | 'jobseeker' | 'atrisk';

// Dashboard — window.IEA.ATTRS[] (the 8 attributes)
interface AttrItem {
  code: string;                 // 'location'|'occupation'|'sex'|'age'|'relationship'|'education'|'birthplace'|'income'
  label: string;                // "Current location"
  value: string | null;         // null when abstain
  detail: string | null;        // "city-level" | "estimated range" | null
  reliability?: number;         // calibrated POINT %, 0–100  (omitted when abstain)
  lo?: number; hi?: number;     // calibrated INTERVAL %      (omitted when abstain)
  evidence: string;             // human summary, e.g. "6 posts pin this"
  evidenceCount?: number;
  abstain?: boolean;            // true => first-class "no signal"
  sensitive?: boolean;          // sex/relationship/birthplace/income
  art9?: boolean;               // GDPR Art. 9 special category (birthplace)
  sev: { atrisk: SeverityLevel; jobseeker: SeverityLevel };  // per-persona; 'balanced' is computed = max of the two
}
// REQUIRED: code, label, value(nullable), detail(nullable), evidence, sev.
// OPTIONAL: reliability, lo, hi, evidenceCount, abstain, sensitive, art9.
// Severity is a per-attribute × per-persona matrix supplied by the backend (taxonomy). Reliability MUST be
// the calibrated value + interval — the UI never shows raw model confidence.

// Shared lookup maps & copy (window.IEA) — drive ordering, chips, and lens reframing
const SEV_RANK:  Record<'extreme'|'high'|'moderate'|'low'|'abstain', number> = { extreme:4, high:3, moderate:2, low:1, abstain:-1 };
const SEV_META:  Record<SeverityLevel|'abstain', { label: string; icon: string }> = {
  low:{label:'Low',icon:'shield-check'}, moderate:{label:'Moderate',icon:'circle-alert'},
  high:{label:'High',icon:'triangle-alert'}, extreme:{label:'Extreme',icon:'octagon-alert'},
  abstain:{label:'No signal',icon:'circle-minus'} };
const LENSES:    { key: Lens; label: string }[];                    // Balanced / Job-seeker / At-risk
const LENS_COPY: Record<Lens, string>;                              // the page-sub reframing per lens
// helpers: severityFor(attr, lens): SeverityLevel|'abstain';  orderFor(lens): AttrItem[];  INFERRED_COUNT: number
const LOCATION_WHY:   Record<Lens, string>;                         // attribution "why it matters" reframing
const DECOY_BACKFIRE: Record<Lens, string>;                         // defend decoy persona-specific warning

// Attribution — window.IEA_ATTR
interface LocationFinding {
  code: string; label: string; value: string;
  precision: string;            // "city-level"
  neighborhood: string;         // "Alfama"
  reliability: number; lo: number; hi: number;
  sev: { atrisk: SeverityLevel; jobseeker: SeverityLevel };
  reasoning: string;
  candidates: { rank: number; label: string; note: string }[];   // top-3 weighed
  textOnlyReliability: number;  // reliability if the GPS photo is removed (sets up defend)
}
interface EvidenceItem {
  id: string;
  kind: 'proven' | 'likely';    // proven = ablation/causal; likely = attack-side/correlational
  type: 'text' | 'photo';
  source: string; date: string;
  text?: string; spans?: string[];                              // text: substrings to highlight
  caption?: string;                                             // photo:
  region?: { x: number; y: number; w: number; h: number };     //   bbox as 0..1 fractions
  exif?: { gps: string; place: string; device: string; taken: string };
  rationale: string;
  marginal?: number;            // proven: ablation Δ, negative % ("−19% if removed")
  proxy?: number;               // likely: 0..100 proxy_score*100
  citation?: number;            // likely: 0..100 citation_frequency
}

// Defend — window.IEA_DEFEND
interface DefendTarget { attribute: string; value: string; before: number; beforeLo: number; beforeHi: number; } // 0..1
type DiffSeg = { t: 'eq' | 'del' | 'ins' | 'insf'; v: string };   // insf = inserted FALSEHOOD (decoy)
interface DefendEdit {
  src: string; date: string;
  segs?: DiffSeg[];                         // rewrite/decoy diff
  remove?: boolean; original?: string;      // removal
  exif?: boolean; crop?: boolean;           // photo: strip GPS / crop
  decoy?: boolean; note?: string;
}
interface DefendOption {
  key: 'minimal' | 'stronger' | 'remove' | 'decoy';
  name: string; desc: string;
  truthful: boolean;                        // decoy => false
  recommended?: boolean; optIn?: boolean; remove?: boolean;
  after: number; lo: number; hi: number;    // 0..1 calibrated after-value + interval (from noise floor)
  recovered: boolean;                       // is the true value still in the adversary's top-3
  misled?: string;                          // decoy: the wrong city the adversary now guesses
  utility: number | null;                   // 0..100; 0 = content removed; null = publishes a falsehood
  utilityLabel: string;
  edits: DefendEdit[];
}
// Honest non-success states (currently hardcoded constants NOISE / LOADBEARING in defend.jsx):
interface NoiseResult  { before:number; beforeLo:number; beforeHi:number; after:number; afterLo:number; afterHi:number; } // overlapping intervals
interface LoadBearing  { src:string; date:string; before:string; after:number; afterLo:number; afterHi:number; }

// Connect — local constants
interface Source { id:string; name:string; icon:string; kind:'oauth'|'upload'; kept:number; dropped:number; desc:string; }
interface ImportJob { name:string; icon:string; progress:number; count:number; total:number; }

// Trust — local constants
interface BenchRow { label:string; top1:number; top3:number; }   // SynthPAI per-attribute accuracy %
type CalibPoint = [predicted:number, empirical:number];          // 0..1 reliability-diagram points

// localStorage keys (client persistence; not a server contract):
//   iea_theme 'light'|'dark' · iea_lens Lens · iea_decoy '0'|'1' ·
//   iea_safety_dismissed '0'|'1' · iea_retention 'retain'|'discard' ·
//   iea_onboarding_v1 { step:number; consents:{purpose,art9,noFalse:boolean}; consentedAt:number|null }
```

---

## 4. Design tokens actually used

Sourced from the **Aditya DS** token layer (`_ds/.../tokens/*.css`) plus an app severity ramp in `styles/app.css`. Values below are the real ones in the code.

**Color** — Radix scales via CDN. Neutral = **Sand** (warm). Accent = **Teal**. Status = Jade/Amber/Tomato/Indigo. Light + dark via Radix `*-dark` under a `.dark` wrapper.
- Semantic aliases (shadcn convention): `--background: sand-2`, `--surface/--card: sand-1`, `--foreground: sand-12`, `--muted-foreground: sand-11`, `--subtle-foreground: sand-10`, `--primary: teal-9`, `--primary-hover: teal-10`, `--accent: teal-3`, `--accent-foreground/-text: teal-11`, `--accent-border: teal-7`, `--border: sand-6`, `--border-strong: sand-7`, `--ring: teal-8`.
- **Severity heatmap** (app-added; matches `design-tokens.json` exactly): low **green**, moderate **amber**, high **orange**, extreme **red**. Each as `--sev-*-bg: <scale>-3`, `--sev-*-text: <scale>-11`, `--sev-*-border: <scale>-7`, `--sev-*-solid: <scale>-9`. Rendered as **chip-bg + 2px desaturated accents only** — never a full card fill — always with a Lucide icon + text label. Icons: `shield-check / circle-alert / triangle-alert / octagon-alert` (+ `circle-minus` for abstain).

**Type** — `--font-sans: Geist`, `--font-mono: Geist Mono`, tabular numerals on. DS scale tokens exist (`--text-display 48 / --text-title 32 / --text-h1 30 / --text-h2 24 / --text-h3 18 / --text-body 15 / --text-sm 13 / --text-xs 12`), weights 400/500/600, leading 1.15/1.3/1.6. **In practice the screen CSS uses ad-hoc px sizes** (e.g. page titles 26–28px, body 13–15px) rather than referencing these tokens consistently.

**Spacing / radius / shadow / motion** (DS):
- Space 4px base: `--space-1..20` (4,8,12,16,20,24,32,40,48,64,80).
- Radius: `--radius-sm 8 / --radius-md 12 / --radius-lg 16 / --radius-xl 20 / --radius-full 9999`.
- Shadow: warm sand-tinted `rgba(33,32,28,α)` — `--shadow-xs/sm/md/lg` + `--shadow-focus: 0 0 0 3px var(--ring)`.
- Motion: `--duration-fast 120 / base 180 / slow 260`, `--ease-standard cubic-bezier(0.2,0,0,1)`, `--ease-out cubic-bezier(0.16,1,0.3,1)`.

**Differences vs `design-tokens.json`** (planning doc): see §7 — neutral, radius, shadow tint, and the type scale differ; the **severity ramp and motion match exactly**.

---

## 5. States implemented per screen

Data screens use a shared `useViewState`/`PreviewSwitch` (a **dev preview switcher**, hidden in print; states also addressable via `?state=`).

- **Onboarding** — wizard only (3 steps). No async states. Deny-by-default: continue disabled until all 3 consents checked. (No loading/empty/error/abstain.)
- **Connect** — `connect` (default = the connect/upload options, i.e. the empty state) · `importing` (shared **RunProgress**: parse → drop third-party → encrypt + embed, live count in the title, cancel) · `error` (**ErrorState** "Couldn't read that export" + per-source hints). Live import also runs the same RunProgress and ends in the kept-vs-dropped summary.
- **Dashboard** — `loaded` · `loading` (**RunProgress** retrieve → infer → calibrate **with cards streaming in over SkelCards**) · `empty` (**EmptyState** connect CTA) · `abstained` (all 8 cards in the abstain state + calm "good news" note) · `error` (**ErrorState** "Re-run audit"). Arriving via `?state=loading` plays the run then reveals.
- **Attribution** — `loaded` · `loading` (two-pane **skeleton**) · `empty` (**EmptyState** "No signal found for {attribute}" — distinct from error, with back link) · `error` (**ErrorState** "Try again").
- **Defend** — `loaded` (proven hero) · `loading` (**RunProgress** find minimal set → draft edits → re-attack & prove + "proving against an independent adversary" line) · `unproven` ("within noise" — interval-overlap chart, never implies safety) · `nomeaning` ("can't break without losing meaning" — load-bearing phrase + remove/accept-residual) · `error` ("Re-run simulation").
- **Account** — static control panel; no async states. Interactive confirm **dialogs** (revoke consent, enable decoy, delete account with required acknowledgment).
- **Trust** — `loaded` · `loading` (benchmark + calibration **skeletons**) · `empty` ("No benchmark yet — run the eval", analogy stays as context) · `error` ("Couldn't load the benchmark" + retry). Only the two data sections swap; hero/analogy/CTA persist.
- **States.html** — showcase of Skeleton / EmptyState / ErrorState / RunProgress (incl. the polling-fallback variant).

---

## 6. Accessibility implemented

- **Semantic roles:** `radiogroup`/`radio` (persona lens, defend frontier, retention), `role="button"` + `tabIndex=0` + Enter/Space (clickable location card, preview switcher), `menu`/`menuitem` (account), `status`/`alert` (EmptyState=status, ErrorState=alert, RunProgress=status `aria-live="polite"`), `role="img"` + `aria-label` on the reliability bar and calibration SVG, `role="note"` (safety + no-false-safety), `aria-current="step"` (steppers).
- **Keyboard:** persona lens is arrow-key navigable with roving `tabIndex`; account menu and dialogs close on `Esc`; clickable card activates on Enter/Space; all controls are real `<button>`/`<a>`/`<input>`.
- **Focus:** visible `--shadow-focus` (3px teal-8 ring) via `:focus-visible` on every interactive element; never an outline that shifts layout.
- **Contrast:** Radix step-11 text on step-3 fills targets WCAG AA; theme tokens carry through to dark.
- **Never color-only:** severity is always icon + text label + desaturated color; "proven vs likely" evidence uses badge + fill **and** underline style.
- **Reduced motion:** every animation (card entrance, spinners, toasts, step transitions, run pulse) is gated on `@media (prefers-reduced-motion: no-preference)`; entrances are transform-only so content is visible at rest.
- **Known gaps:**
  1. **Nested interactive elements** — the location card is `role="button"` yet contains an evidence `<button>` and a "Fix this" `<button>` (mitigated with `stopPropagation`, but still an a11y anti-pattern; recommend a card-link + overlay refactor).
  2. **Focus is not restored across page navigations** (full reloads reset focus to top; only the onboarding wizard moves focus to the step heading).
  3. **Dialog focus-trap** relies on the DS `Dialog`; not independently verified.
  4. The calibration chart is an SVG with a summary `aria-label` only — no underlying data table.
  5. The **preview-state switcher** uses `aria-pressed` buttons, not a roving tablist (acceptable since it's a dev affordance).

---

## 7. Deviations from the brief / `design-tokens.json`

1. **Neutral = Sand, not Slate.** `design-tokens.json` specifies `neutral: slate`; the build uses **sand** per `claude-design-brief.md` and the kickoff brief, which explicitly supersede the slate planning token. Accent **teal** and the severity ramp are unchanged. → **Reconcile the planning token to sand.**
2. **Persona lens is 3-way, not binary.** Brief said a job-seeker ↔ at-risk toggle; the build ships **Balanced · Job-seeker · At-risk**, defaulting to **Balanced** (a safety-aware neutral) so the user is **never forced to self-identify** (ethics rule). "Balanced" severity = max of the two persona severities.
3. **Radius / shadow / type differ from `design-tokens.json`.** Build uses Aditya DS radii (8/12/16/20) vs the doc's 6/8/12; warm sand-tinted shadows vs the doc's `rgba(0,0,0,…)`; and **does not** follow the doc's 5-step type scale token-for-token (screen CSS uses ad-hoc px). Font is **Geist** (doc allowed "Inter or Geist"). Severity ramp and motion **match** the doc.
4. **Dashboard "Fix this" → Attribution.** In the assembled flow the location card and its "Fix this" both open **Attribution** (then Attribution → Defend), rather than jumping straight to Defend. Only the **location** attribute is fully wired end-to-end; other cards' "Fix this" shows a toast.
5. **Run progress & "Live/polling" are simulated.** Timers are client `setInterval`s driven by elapsed wall-clock; they **freeze while the tab is backgrounded and self-heal on return**. There is no real SSE or polling — the connection indicator is presentational.
6. **Trust image accuracy is illustrative** (77.6% VIP, supplementary framing) — not from a real eval.
7. **Preview-state switcher** is a review affordance, not product UI (hidden in print).
8. **All 7 screens exist** (Onboarding, Connect, Dashboard, Attribution, Defend, Account, Trust) plus a **States** showcase. Onboarding is one screen with three internal wizard steps (not three screens). Trust is **not** linked into the journey from the dashboard (standalone credibility page) — wire an inbound link if desired.
9. **Not built / stubbed:** real auth/session, real OAuth + file parsing, any server persistence, real PDF/data-bundle export, and per-attribute Attribution/Defend for the seven non-location attributes.

All hard non-negotiables are honored: calibrated bands only (never raw), a first-class **abstain** card (income), the persistent **no-false-safety** note on Defend (plus the honest within-noise/can't-break states), severity as icon + label + desaturated heatmap, advise-only CTAs (copy/download — no platform writes), and the deny-by-default Art. 9 consent.

---

## 8. Open questions / TODOs

- **Everything is mocked.** Backend must supply, as calibrated values (point + interval, never raw): the 8-attribute result set, per-attribute × per-persona severity, attribution evidence (with `proven` ablation `marginal` and `likely` `proxy`/`citation`), the defend simulation (independent-adversary re-attack producing `after`/`lo`/`hi` + `recovered`), and the benchmark/calibration figures.
- **Severity matrix** is hardcoded in `dashboard-data.jsx` — should come from the taxonomy service.
- **Honest defend outcomes** ("within noise", "can't break") use constants in `defend.jsx` — define the real decision rule (noise floor / interval overlap; load-bearing detection).
- **Decoy gating** (off by default → global opt-in → per-use confirm) is client-only; needs a server-recorded consent + audit log.
- **Account actions** (revoke consent, retention switch, revoke connection, export, crypto-shred delete) are local state only.
- **Reconcile the token deltas** in §7 (neutral, radius, shadow, type scale) — decide whether the planning doc moves to match the build (recommended) or vice-versa.
- **Decide Trust's place** in the IA (inbound link from dashboard's "calibrated reliability" affordance?).
- **A11y refactors** from §6 (nested card buttons; cross-page focus restoration).

---

## 9. File / artifact structure

```
/                         # one HTML entry per screen (loads CDN React/Babel + DS bundle + JS/CSS)
  Onboarding.html  Connect.html  Dashboard.html  Attribution.html
  Defend.html  Account.html  Trust.html  States.html
/js
  icons.jsx               # window.Icon + ICONS map (inline Lucide paths)
  dashboard-data.jsx      # window.IEA: ATTRS, LENSES, LENS_COPY, SEV_META, SEV_RANK, severityFor(), orderFor()
  app-shell.jsx           # window.AppShell: Topbar, PersonaLens, AccountMenu, SetupSteps, useTheme, useToast, Toast
  states.jsx              # window.States: EmptyState, ErrorState, RunProgress, Skel*, PreviewSwitch, useViewState
  dashboard-cards.jsx     # window.{SeverityChip, ReliabilityBar, AttributeCard}
  dashboard.jsx           # Dashboard App + useAuditRun
  attribution-data.jsx    # window.IEA_ATTR: LOCATION, LOCATION_WHY, EVIDENCE
  attribution.jsx         # Attribution App
  defend-data.jsx         # window.IEA_DEFEND: TARGET, OPTIONS, DECOY_BACKFIRE
  defend.jsx              # Defend App + useDefendRun + honest-state panels
  connect.jsx             # Connect App (sources, ImportRun, ConnectError)
  account.jsx             # Account App + SafetySection
  onboarding.jsx          # Onboarding wizard
  trust.jsx               # Trust App + CalibrationChart + section/skeleton components
/styles
  app.css                 # severity ramp vars + onboarding + shared primitives
  dashboard.css           # shell topbar, attribute cards, preview-switch, setup-steps, run-status
  attribution.css  defend.css  connect.css  account.css  trust.css  states.css
/_ds/aditya-…/            # design system (READ-ONLY dependency): _ds_bundle.js + tokens/*.css + styles.css
```

**Load order on every page:** React → ReactDOM → Babel → DS bundle → `icons.jsx` → `dashboard-data.jsx` → `app-shell.jsx` → `states.jsx` → screen `*-data.jsx` → screen `*.jsx`.

**For two-way sync into a Next + Tailwind v4 + shadcn repo:** each `window.*` component maps 1:1 to a real module export; convert JSX→TSX using the interfaces in §2–§3; replace `window.location.href` with the router and the CDN React/Babel with the build pipeline; lift the `*-data.jsx` constants into typed fixtures that mirror the §3 API contract; promote `app.css`'s severity vars into the Tailwind theme (they're the one thing the DS bundle doesn't already ship).
