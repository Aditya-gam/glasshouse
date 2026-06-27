# Testing — End-to-End (Playwright)

> **Depends on:** `.claude/rules/testing.md`, `07-frontend/user-flows/*`, `06-api/*` · **Version:** v1

**Playwright** — the 2026 default (native multi-origin auth for Clerk SSO, free CI sharding, cross-browser incl. WebKit). **Few, high-value** tests (top of the pyramid) — the critical paths only.

## Setup
- Lives in the **`frontend` repo** (ADR 0013); runs against the deployed **preview environments** (Vercel preview + the backend's staging/preview), seeded; **never** production. (For fully local runs, point at the backend dev stack.)
- **Auth** — a Clerk test user + `storageState` to skip re-login.
- **Determinism** — `local` profile + low temp; assert **semantic/structural** outcomes (a reliability band appears; a before/after renders), not byte-exact model text.
- **Sharding** — `--shard` across CI workers; run on `main` + nightly (not every PR).

## Critical paths (≈5 tests)
1. **Onboarding + consent** — sign in → wizard → consent recorded → land on connect. (No run without consent.)
2. **Connect/import → audit** — upload a fixture export → kept-vs-dropped shown → run attack → dashboard shows ≥1 calibrated inference.
3. **Attribution** — open an attribute → evidence spans render → confirm/deny works.
4. **Defend simulation** *(hero)* — "break this" → run remediation → a proven before→after with intervals renders; advise-only (no platform write).
5. **Account / data rights** — export produces a bundle; delete shows the crypto-shred + irreversibility copy.

## Gate
- E2E is **required on `main`**; a failure blocks the deploy (`ci-cd.md`). Trace + video on failure (Trace Viewer).
