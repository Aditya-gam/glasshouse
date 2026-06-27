# Testing — Strategy

> **Depends on:** `.claude/rules/testing.md`, `decisions/0013-polyrepo.md` · **Consumed by:** the other testing leaves, `09-infra-devops/ci-cd.md` · **Version:** v2 (testcontainers · property-based · polyrepo)

- **Shape** — *lots* of fast **unit** tests on the pure `domain/` (matching, scoring, clustering, ablation, noise) **+ Hypothesis** property tests; a *strong* **integration** layer (**testcontainers** real Postgres + RLS/crypto + SynthPAI fixture); **Schemathesis** API fuzzing; *few* **E2E** (Playwright). Frontend leans static + integration (trophy); **async Server Components → Playwright**. Avoid the ice-cream cone.
- **Polyrepo** — backend tests live in the `backend` repo (pytest), frontend tests in the `frontend` repo (Vitest); **E2E in the `frontend` repo** vs preview envs. Each repo's CI runs its own.
- **Principle** — test **behavior, not implementation**; **Arrange-Act-Assert**; push tests down; deterministic (semantic-equivalence for stochastic LLM output, not byte-exact).
- **Mandatory gates** — RLS isolation · crypto round-trip + shred · third-party-drop · contract (**Schemathesis** + **generated-client drift**) · **eval-as-CI-gate**. Security/correctness properties, not nice-to-haves.
- **Coverage is a floor, not a goal.**
