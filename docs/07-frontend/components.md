# Frontend — Components

> **Depends on:** `overview.md`, `06-api/schemas.md`, `ethics-and-tone.md`, `prototype-mapping.md` · **Rules:** `frontend` · **Version:** v2 (reconciled with the prototype)

Built on **shadcn/ui** primitives (your DS bundle) + bespoke components, all accessible by construction. The prototype at `./prototype/` is the visual + structural reference; the full `window.*`→TSX map is in `prototype-mapping.md`. **Calibrated reliability only — never raw confidence.**

## Shared (→ `components/`)
- **App shell** (`components/app-shell/`): `Topbar`, `PersonaLens` (**3-way** radiogroup — `persona-lens.md`), `AccountMenu`, `SetupSteps`; hooks `useTheme`, `useToast` (Sonner). shadcn: Button, Avatar, Tooltip, DropdownMenu.
- **States** (`components/states/`): `EmptyState` (role=status), `ErrorState` (role=alert, no stack traces), `RunProgress` (SSE-driven, aria-live), `Skeleton*`. shadcn: Alert, Skeleton, Progress.
- **Attribute** (`components/attribute/`): `AttributeCard` (Card), `SeverityChip` (Badge; icon + label + desaturated), `ReliabilityBar` (role=img + aria-label; **calibrated point + interval**).

## Route-specific (→ each route's `_components/`)
- **Dashboard** — `PageHead`; the 8 `AttributeCard`s ordered by the lens; the run plays on arrival (`useRun`, SSE).
- **Attribution** (`attribute/[code]`) — `KindBadge` (proven | likely), `EvidenceItem` (text spans + photo bbox + EXIF), `Verify` (confirm/deny). **All 8 attributes wired.**
- **Defend** (`defend/[code]`) — `FrontierOption`, `DiffText` (eq/del/ins/decoy-insf), `Hero`, `IntervalCompare`, and the honest-state panels `NotProven` ("within noise") + `CantBreak`.
- **Connect** — `SourceCard`, `ImportRun` (RunProgress), `ConnectError`; kept-vs-dropped summary.
- **Account** — `SafetySection` (promoted under at-risk); consent / retention / connection / export / **crypto-shred delete** controls (Switch, Dialog).
- **Onboarding** — the 3-step wizard (Welcome → Consent (deny-by-default) → Connect hand-off).
- **Trust** (`(marketing)/trust`) — `CalibrationChart` (role=img + a visually-hidden data table), benchmark sections; **linked inbound** from the dashboard reliability affordance.

## Bespoke design components (the signature pieces)
`AttributeCard` · `AttributionEvidence` (span highlight + image-bbox overlay) · `DefendFrontier` (before/after + frontier selector) · `CalibrationChart` · `KeptVsDropped` · `CrisisResourcesPanel`.

## Placement & rules
- **Shared** in `components/` (`components/ui/` = shadcn primitives); **route-specific** colocated in each route's `_components/` (never one giant folder).
- Interactive components are `"use client"`; props are **minimal DTOs** from the generated client (no raw records — DAL rule).
- The **severity ramp** is promoted into the Tailwind v4 `@theme` (the one token group the DS bundle doesn't ship).
