# Infra — CI/CD

> **Depends on:** `.claude/rules/testing.md` + `infra-devops.md`, `10-testing/*`, `iac.md`, `infrastructure.md`, `decisions/0012-cicd-strategy.md`, `decisions/0013-polyrepo.md`, `github-actions.md` · **Consumed by:** contributors, the release process · **Version:** v3 (polyrepo · hybrid deploy · uv · Semgrep/Trivy · testcontainers/Schemathesis · release-please)

**GitHub Actions** runs one single-purpose pipeline **per repo** (`backend`, `frontend`) — **no path-filtering** (polyrepo, ADR 0013). GHA is the **quality gate**; **Vercel** and **Railway** **deploy** via their native Git integrations. Gate everything; ship small and reversible (GitHub Flow).

## CI (per PR) — backend repo
1. **Static** — `ruff` + `mypy --strict`, built on **uv** (`setup-uv` + `enable-cache`; `uv sync --locked`; `uv cache prune --ci`).
2. **Semgrep** — SAST / SCA / secrets (same engine as the editor plugin).
3. **Unit** — the pure `domain/` (matching, scoring, clustering, ablation, noise) — fast, no IO; **Hypothesis** property tests on invariants.
4. **Integration** — **testcontainers** spins a real Postgres (pgvector/pgcrypto) — repositories, services, the worker path.
5. **Mandatory security/correctness gates** — **RLS-isolation** · **crypto round-trip + shred** · **third-party-drop** (the `testing` rule's gates).
6. **Schemathesis** — property-based API fuzzing from the OpenAPI schema (conformance, 500s, injection / path-traversal).
7. **Eval-as-CI-gate** — the attack engine over a fixed **SynthPAI** slice; **fail below the per-attribute accuracy floor** (`eval-as-ci-gate.md`), on the **local/cheap** profile.
8. **Build + Trivy** — build the **distroless** prod image and **Trivy**-scan it for CVEs.
9. **Publish the contract** — export `openapi.json` as a versioned artifact for the frontend.

## CI (per PR) — frontend repo
1. **Static** — `tsc` + ESLint.
2. **Client regen + drift guard** — download the backend's published `openapi.json`, run `@hey-api/openapi-ts`; **fail if the committed client differs** (replaces the old Zod↔OpenAPI drift test).
3. **Semgrep** — SAST / secrets.
4. **Component / integration** — **Vitest** + RTL + **MSW** (Testing Trophy); async Server Components are covered by E2E, not Vitest.
5. **E2E** — **Playwright** against the **preview env**, critical paths only.
6. **Build** — `next build`.

**Shared CI hygiene:** `concurrency: group: ci-${{ github.ref }}` + **`cancel-in-progress: true`**; **pinned action SHAs**; **least-privilege `permissions:`** per workflow; a **Neon branch** (throwaway DB) per PR. A red gate **does not merge**.

## CD (hybrid — platform-native, gated)
- PR → **preview env** (Vercel preview + Neon branch), all gates green.
- **Merge to `main` → staging (auto)** — Vercel + Railway deploy to their **staging** environments via native Git integration; migrations run (below); smoke + the **cited-benchmark dry-run** (cheap-tier).
- **Manual promote → prod** — a **GitHub Environments protection rule** (one approval) gates the prod promotion; prod deploys the **same build**, applies migrations, then smoke-checks. Prod changes stay deliberate.
- **Releases** — **release-please** per repo cuts versioned changelogs/tags from conventional commits (decoupled from deploy).

## Migrations in the release (expand-contract)
**Zero-downtime, backward-compatible** (`03-data/database/migrations.md`): EXPAND (add nullable) → deploy code → backfill → CONTRACT in a later release. `alembic upgrade head` runs **before** new traffic; indexes `CONCURRENTLY`; a **`lock_timeout`** per migration (a failed migration beats a lock-queue outage). Never rename/drop while old code runs.

## Rollback
**Instant redeploy-previous** — Railway/Vercel keep prior builds; rollback = redeploy the last green build (minutes). Safe **because** expand-contract keeps the schema backward-compatible, so the old code runs against the new DB.

## Secrets & deploy auth
Provider keys live in the LiteLLM Proxy; the app holds only a virtual key. Deploys are authenticated by the **platform Git integrations** (Vercel / Railway) — no long-lived cloud secrets in Actions. Infra provisioning (Terraform: Neon / R2 / KMS) uses scoped API tokens in **GitHub Actions secrets / environments**, or OIDC where the provider supports it; **never** print content/keys in logs (`logging-policy.md`).
