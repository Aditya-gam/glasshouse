# Infra — Dev Workflow (branching · PR · pre-commit · releases)

> **Depends on:** `ci-cd.md`, `github-actions.md`, `decisions/0013-polyrepo.md`, `.claude/rules/code-style.md` · **Version:** v1

Per-repo conventions for both `backend` and `frontend` (polyrepo, ADR 0013).

## Branching — GitHub Flow / trunk-based
- `main` is always deployable. Work on **short-lived branches** off `main`; open a **PR**; merge fast.
- Every change is a PR — even solo — because the PR is where the **CI gates, the preview env, and `/code-review` + `/security-review`** run.
- **Squash-merge** to keep `main` linear and each merge a single conventional commit.
- No long-lived `develop`/release branches (GitFlow is overkill for CD).

## PR hygiene
- **Required status checks** — the gate jobs (`github-actions.md`) are branch-protection-required; a red check blocks merge.
- **CODEOWNERS** + a **PR template** (what/why, screenshots for UI, checklist: tests, docs, migration).
- **Preview env per PR** (Vercel preview + Neon branch) for manual + E2E checks.
- Small PRs; address `/code-review` findings before merge.

## Pre-commit (idiomatic per repo)
- **`backend`** — the **`pre-commit`** framework: `ruff` (lint+format), `mypy`, secret scan, large-file / merge-conflict checks. Fast hooks at commit; slower (full `mypy` / tests) at **pre-push**.
- **`frontend`** — **husky + lint-staged**: `eslint --fix` + `prettier --write` + `tsc` on **staged** files.
- Hooks are a fast local mirror of CI — they catch issues before the push, not a replacement for the CI gate.

## Releases — release-please (per repo)
- **Conventional Commits** drive **release-please**: it maintains a **Release PR** that accumulates changes; merging it bumps the version (semver), writes the **CHANGELOG**, and tags a GitHub release.
- **Decoupled from deploy** — deploys happen on merge to `main` (platform-native, `ci-cd.md`); releases are the **versioned record**, cut when you merge the Release PR.
- Python (`backend`) and Node (`frontend`) are both supported by release-please.
