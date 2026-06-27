# Glasshouse

**Find out what an AI can infer about you from your own posts — then break it, and prove it broke.**

Glasshouse runs an LLM **attribute-inference attack** on your *own* social footprint (text + images),
**measures** its accuracy against a public benchmark, then helps you **edit a few posts to break the
inference** — and proves the drop with a held-out adversary. The signature moment:

> **home-location confidence `0.86 → 0.21`** after editing 3 posts.

*Attack → Measure → Defend.* A privacy self-audit for the era where anyone can paste your posts into an
LLM and ask "where does this person live?"

## Why it matters
Modern LLMs infer **location, age, occupation, income** and more from innocuous posts — the *mosaic
effect*: six individually-boring posts that, **together**, pin you down. Glasshouse shows you exactly
what's inferable, how reliable each guess is (**calibrated**, never raw confidence), and what minimal
edits actually neutralize it — **advise-only**, never touching your accounts.

## Repositories
| Repo | What |
|---|---|
| **glasshouse** (this) | the spec (`docs/`), the design prototype (`prototype/`), the ADRs |
| **[glasshouse-backend](https://github.com/Aditya-gam/glasshouse-backend)** | FastAPI · SQLAlchemy 2.0 async · arq · the Attack/Measure/Defend engine |
| **[glasshouse-frontend](https://github.com/Aditya-gam/glasshouse-frontend)** | Next.js · the dashboard, attribution + defend-simulation UI |

## The engine (Attack → Measure → Defend)
- **Attack** — a multi-agent profiler (LiteLLM-proxied gateway) infers 8 attributes from text + images, with self-consistency confidence and evidence attribution.
- **Measure** — the same engine is scored on the **SynthPAI** benchmark; predictions are **calibrated** (a 0.8 guess is right ~76% of the time) and a CI gate fails below an accuracy floor.
- **Defend** — ablation finds the minimal load-bearing posts; an anonymizer rewrites them; an **independent, held-out adversary** re-attacks to prove the confidence dropped — with intervals, not self-report.

## Stack
**Backend:** FastAPI (3.12) · SQLAlchemy 2.0 async + Alembic · arq (Redis) · pydantic v2 · Postgres + pgvector + pgcrypto · per-user DEK + crypto-shred · Clerk auth + RBAC.
**Frontend:** Next.js App Router · TS strict · Tailwind v4 · shadcn/ui · TanStack Query · generated OpenAPI client.
**AI:** LiteLLM proxy · Ollama (local, $0 dev) + a cloud frontier model (cited runs) · `instructor` structured output.
**Infra:** Railway · Neon · Cloudflare R2 · Vercel · GitHub Actions (Semgrep · Trivy · testcontainers · an eval-floor gate).

## Privacy by design
Self-audit only (never third-party profiles) · third-party-authored content **dropped at ingestion** ·
per-user encryption with **crypto-shred** erasure · the LLM is a sub-processor that **never logs content** ·
explicit consent (incl. GDPR Art. 9) before any run · **advise-only** (no platform writes).

## Docs
Start at **[`docs/00-index.md`](docs/00-index.md)** — the map of the full spec. The change-trigger map is
**[`docs/00-traceability.md`](docs/00-traceability.md)**; account setup is **[`SETUP.md`](SETUP.md)**.

---
*Portfolio project — built spec-first: ~170 reconciled design docs + a working UI prototype before a line of production code.*
