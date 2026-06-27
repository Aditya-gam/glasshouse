# Infra — GitHub Actions & CI Checks

> **Depends on:** `ci-cd.md` (pipeline + decisions), `decisions/0013-polyrepo.md`, `.claude/rules/testing.md` + `infra-devops.md`, `10-testing/*`, `iac.md` · **Version:** v2 (polyrepo · per-repo pipelines · hybrid deploy · uv/Semgrep/Trivy/testcontainers/Schemathesis · release-please)

The concrete workflows + the explicit check list, **per repo** (`backend`, `frontend`) — **no path-filtering** (polyrepo, ADR 0013). GHA is the **gate**; Vercel/Railway **deploy** natively.

## Backend repo — `.github/workflows/`
- **`ci.yml`** (PR + push) — the backend check list below; built on **uv** (`setup-uv` + `enable-cache`).
- **`release.yml`** — **release-please**: maintains a Release PR from conventional commits → version + CHANGELOG + tag on merge.
- **`eval-nightly.yml`** (cron) — the fuller SynthPAI benchmark on cheap-tier (credibility number), non-blocking.
- **Deploy:** Railway's native Git integration (merge→staging; manual promote→prod via a GitHub Environment) — no deploy workflow needed.

## Frontend repo — `.github/workflows/`
- **`ci.yml`** (PR + push) — the frontend check list below.
- **`release.yml`** — release-please.
- **Deploy:** Vercel's native Git integration (preview per PR; merge→staging; promote→prod).

## Backend CI check list (every PR — red blocks merge)
1. `ruff check` + `ruff format --check`
2. `mypy --strict`
3. **Semgrep** — SAST / SCA / secrets
4. **unit** — `pytest tests/unit` (pure `domain/`) + **Hypothesis** property tests
5. **integration** — `pytest tests/integration` on a **testcontainers** Postgres (pgvector/pgcrypto)
6. **RLS isolation** — every owned table: A can't see B (read + write); fails-closed
7. **crypto** — round-trip + crypto-shred + app-role-can't-read-`data_keys`
8. **third-party-drop** — `is_subject_authored=false` never persists
9. **Schemathesis** — API fuzz from the OpenAPI schema (conformance / 500s / injection / path-traversal)
10. **eval-as-CI-gate** — attack over a fixed SynthPAI slice; **fail below the per-attribute floor** (local/cheap profile)
11. **build + Trivy** — build the distroless prod image; Trivy-scan for CVEs
12. **publish `openapi.json`** — versioned artifact for the frontend

## Frontend CI check list (every PR — red blocks merge)
1. `tsc --noEmit` + ESLint
2. **client regen + drift guard** — fetch the backend's `openapi.json`, run `@hey-api/openapi-ts`; **fail if the committed client differs**
3. **Semgrep** — SAST / secrets
4. **component/integration** — Vitest + RTL + MSW (`frontend-tests.md`)
5. **a11y** — `axe` on key components
6. **build** — `next build` succeeds
7. **E2E** — Playwright critical paths against the preview env (`e2e-tests.md`) — on PR + `main`

## Shared conventions
- **No path-filtering** — each repo's CI is single-purpose (polyrepo).
- **Cache** uv (backend) + Node deps + Playwright browsers.
- **Concurrency** — `cancel-in-progress: true` for CI (`false` for any deploy job). **Pinned action SHAs**; **least-privilege `permissions:`** per workflow.
- **Required checks** — the gate jobs are branch-protection-required; **secret scanning / push protection** on; **dependency audit** (`pip-audit` / `npm audit`) — Semgrep SCA + Trivy cover most of this.
- **Deploy auth** — platform Git integrations (Vercel / Railway), not long-lived cloud secrets.
