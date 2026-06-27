# Frontend — Prototype Mapping (build reference)

> **Depends on:** `02-architecture/repo-structure.md`, `components.md`, `06-api/schemas.md`, `decisions/0011-ui-stack.md` · **Consumed by:** the frontend build (syncs from `./prototype/`) · **Version:** v1

The Claude Design prototype lives at **`./prototype/`** (repo root, read-only reference). Source of truth for what it *is*: `./prototype/HANDOFF.md`. This doc maps it to the real `frontend` repo.

## What the prototype actually is
Static multi-page **React 18 + in-browser Babel** (no bundler / TS / router). Shared code on `window` globals (`window.AppShell`, `window.States`, `window.AttributeCard`, …); navigation is page-level (`location.href`); **all data mocked** in `*-data.jsx`; progress / "polling" are `setInterval` simulations. Seed user: "Marta Rocha", at-risk journalist, Lisbon. The TS interfaces in HANDOFF §2–3 are reconstructed-but-accurate contracts.

## `window.*` → target TSX module + shadcn primitive
| Prototype (`window.*` / file) | → Target TSX | shadcn |
|---|---|---|
| `Icon` (`icons.jsx`) | `components/ui/icon.tsx` (lucide-react wrapper) | — |
| `IEA` data (`dashboard-data.jsx`) | `lib/fixtures/attributes.ts` (typed) → API client | — |
| `AppShell.{Topbar,PersonaLens,AccountMenu,SetupSteps}` | `components/app-shell/*` | Button, Avatar, Tooltip, DropdownMenu, RadioGroup |
| `AppShell.{useTheme,useToast,Toast}` | `lib/hooks/*` + `components/ui/sonner.tsx` | Sonner |
| `States.{EmptyState,ErrorState,RunProgress,Skel*}` | `components/states/*` | Alert, Skeleton, Progress |
| `States.{PreviewSwitch,useViewState}` | **drop** (dev-only) | — |
| `SeverityChip / ReliabilityBar / AttributeCard` | `components/attribute/*` | Badge, Card |
| `dashboard.jsx` (+ `useAuditRun`) | `app/(app)/dashboard/page.tsx` + `_components/`; `lib/hooks/use-run.ts` (SSE) | Card |
| `connect.jsx` | `app/(app)/connect/page.tsx` + `_components/{source-card,import-run,connect-error}` | Card, Button, Alert |
| `attribution.jsx` | `app/(app)/attribute/[code]/page.tsx` + `_components/{kind-badge,evidence-item,verify}` | Badge, Card, Button |
| `defend.jsx` | `app/(app)/defend/[code]/page.tsx` + `_components/{frontier-option,diff-text,hero,interval-compare,not-proven,cant-break}` | Card, RadioGroup, Dialog, Switch |
| `account.jsx` | `app/(app)/account/page.tsx` + `_components/{safety-section}` | Switch, Dialog, Separator, Button |
| `trust.jsx` | `app/(marketing)/trust/page.tsx` + `_components/{benchmark,calibration,calibration-chart}` | Card, Skeleton |
| `onboarding.jsx` | `app/(app)/onboarding/page.tsx` + `_components/{welcome,consent,connect-step,pillar}` | Checkbox, Button, Card |
| DS primitives `AdityaDesignSystem_*.{Button,Card,Checkbox,Switch,Avatar,Tooltip,Dialog,Skeleton,Alert,Separator}` | `components/ui/*` | the named primitive |
| `styles/app.css` severity ramp | promote into Tailwind v4 `@theme` | — |

## Data shapes → API contract
The §3 shapes (`AttrItem`, `LocationFinding`, `EvidenceItem`, `DefendOption`, …) are the backend contract — see `06-api/schemas.md` (`AttributeRead` / `AttributeFindingRead` / `EvidenceRead` / `RemediationRead` / `DefendOptionRead` / `BenchmarkRead`). **Calibrated point + interval only.** The `*-data.jsx` constants become typed fixtures mirroring those DTOs (MSW serves them until the API exists).

## Sync plan (JSX prototype → Next + Tailwind v4 + shadcn + pnpm)
1. Each `window.*` component → a real module export (table above); JSX→TSX using the §2–3 interfaces.
2. Replace `window.location.href` with the App Router; `*.html` → `app/(app)/<route>/page.tsx`.
3. Replace CDN React/Babel with the build pipeline.
4. Lift `*-data.jsx` constants into typed fixtures mirroring the API DTOs.
5. Promote the **severity ramp** into the Tailwind `@theme`.
6. Drop the dev-only `PreviewSwitch`/`useViewState`.
7. Replace the simulated run timers with the real **SSE + polling** (`state-and-polling.md`).

## Deviations resolved (HANDOFF §7)
sand (tokens v2), **3-way** persona lens (`persona-lens.md` v2), DS radius/shadow/type (`design-tokens.json` v2), Dashboard→Attribution→Defend + **all 8 attributes**, Trust linked inbound. Mocked progress / illustrative numbers / stubbed backend are expected — the real build supplies them.

## Tracked work
A11y refactors + sync steps → `11-roadmap/tasks-frontend.md`; the backend data contract → `tasks-backend.md`.
