# Infra — Environments

> **Depends on:** `.claude/rules/infra-devops.md`, `02-architecture/deployment-topology.md` · **Version:** v1

- **local/dev** — everything on the Mac: Ollama (all model slots, **$0**), docker-compose Postgres/Redis/LiteLLM Proxy; **no external content egress**.
- **preview (per PR)** — Vercel preview + a **Neon branch** (throwaway DB) + a Railway preview env; cheap-tier/local models; auto-torn-down on merge.
- **staging** — cloud (Railway + a prod-shaped Neon branch); cheap-tier models; the cited-benchmark dry run.
- **prod** — cloud (Railway + the Neon `prod` branch); frontier models for cited runs; budget caps enforced.
- **Dev/prod parity** (12-factor) — same engines (Postgres/Redis), same container images; only config + model profile differ (env var switches `local` ↔ `cloud`).
- All config/secrets via env; nothing hardcoded.
