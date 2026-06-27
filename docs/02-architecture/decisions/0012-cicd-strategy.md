# ADR 0012 — CI/CD & deploy strategy

**Status:** Accepted (v2 — amended: **hybrid deploy** (GHA gates + platform-native, staging + manual promote); **polyrepo** per ADR 0013; uv / Semgrep / Trivy / testcontainers / Schemathesis)

**Context.** Two repos (`backend`, `frontend`; ADR 0013) each need a pipeline that gates on the security/eval invariants and deploys safely, while staying right-sized for a portfolio app.

**Decision.**
- **CI:** **GitHub Actions**, one single-purpose pipeline **per repo** (no path-filtering); the backend is built on **uv**. Gates = static → **Semgrep** (SAST) → unit (+**Hypothesis**) → integration (**testcontainers** Postgres) → **RLS / crypto / third-party-drop** → **Schemathesis** (API fuzz) + **generated-client drift** → **eval-floor** (a fixed SynthPAI slice) → **Trivy** image scan. PR **preview** = Vercel preview + a Neon branch.
- **CD (hybrid):** GitHub Actions runs the gates as **required checks**; **Vercel** (frontend) + **Railway** (backend) deploy via their **native Git integrations**. **Merge → staging (auto) → manual promote → prod** (a GitHub Environments protection rule on prod); the same build is promoted staging→prod. Releases are versioned by **release-please** per repo (decoupled from deploy).
- **Migrations:** **expand-contract** zero-downtime (add-nullable → deploy → backfill → contract; indexes `CONCURRENTLY`; `lock_timeout`; never rename/drop under old code).
- **Rollback:** **instant redeploy-previous** (the last green build), kept safe by the backward-compatible schema.

**Rationale.** Platform-native deploys give free per-PR preview environments and remove most deploy plumbing, while GitHub Actions stays the quality gate (nothing merges red); the staging gate + manual prod promote keep prod changes deliberate; expand-contract is what makes instant rollback safe (the schema never breaks old code). **GitHub Flow / trunk-based** + small PRs fit CD; heavier options (blue-green/canary, GitFlow) are overkill at this scale.

**Consequences.** Two CI pipelines (one per repo); the OpenAPI contract is published by the backend and consumed by the frontend (ADR 0013). Every schema change ships as a backward-compatible migration (`03-data/database/migrations.md`); the eval-floor can block a merge (prompt/model drift); staging carries the cited-benchmark dry-run; prod needs a human approval. Pipeline detail in `09-infra-devops/ci-cd.md`.
