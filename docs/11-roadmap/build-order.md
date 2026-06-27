# Roadmap — Build Order

> **Depends on:** `05-backend/overview.md`, `milestones.md` · **Version:** v1

Dependency-ordered (smallest-dependency-first); each step is testable before the next.

1. **config + db/session + models + Alembic `0001` + RLS** (+ RLS isolation test).
2. **auth (Clerk) + deps + RBAC.**
3. **crypto + KMS** (+ round-trip/shred test).
4. **ingestion + third-party-drop + embeddings** (+ drop test).
5. **gateway client + `instructor` + slots** (+ separation assertion).
6. **attack-text service + self-consistency** → `inferences`.
7. **eval + SynthPAI fixture + calibration + noise model + CI eval-gate.**
8. **defend** — ablation + anonymizer loop + independent adversary + noise-floor → `remediations`.
9. **images** — media/EXIF + VLM attack + image remediation.
10. **API (`/v1`) + schemas + SSE.**
11. **frontend** — wizard → dashboard → attribution → defend simulation → trust view.
12. **connectors** (Reddit/Mastodon; X upload).
13. **polish + case study + deploy** (the live URL).

**Two repos** (ADR 0013): steps 1–10 and 12 build the `backend` repo; step 11 builds the `frontend` repo, which consumes the OpenAPI client published by step 10. Mirrors `backend-structure` build order, extended through images, API, frontend, connectors.
