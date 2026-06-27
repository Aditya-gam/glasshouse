# Build Plan & Documentation Index

**Approach:** doc-first. We complete and review *every* build doc before any implementation. When the set is finished and understood, a single "build end-to-end" instruction is enough — the docs are the spec. This file is the spine: the index of all docs, their status, and the order to write them.

**Status:** ✅ done · ✍️ to write · 🔜 recommended next

---

## 0. Foundations / product
| Doc | Status | Contains |
|---|---|---|
| `CLAUDE.md` | ✅ | Project brain: overview, locked decisions, doc index, conventions, the 8 security rules |
| `README.md` | ✍️ | Top-level overview, how the docs fit together, quickstart placeholder |
| `docs/product-spec.md` | ✍️ 🔜 | Problem, target users, the core attack→measure→defend loop, v1 scope, explicit out-of-scope, success metrics, positioning (redact complement; Whitebridge as nearest neighbor) |
| `docs/decisions/` (ADRs) | ✍️ | One short record per locked decision (cloud vs local, Clerk, pgcrypto, async, self-audit scope, SynthPAI) with the "why" |
| `docs/glossary.md` | ✍️ | Domain dictionary (DEK, crypto-shred, PAI, run types, …) — or keep folded in CLAUDE.md |

## 1. Architecture
| Doc | Status | Contains |
|---|---|---|
| `docs/architecture.md` | ✅ | Components, system diagram, async run lifecycle, trust boundaries, deployment |
| `docs/repo-structure.md` | ✍️ | Full monorepo tree: `frontend/`, `backend/`, `infra/`, `docs/` |

## 2. Data & database
| Doc | Status | Contains |
|---|---|---|
| `docs/database.md` | ✅ | Schema, ER diagram, storage tiers, encryption, RLS, retention |
| `docs/attributes-taxonomy.md` | ✍️ 🔜 | The 8 PAI attributes: precise definitions, allowed values/format, special-category flags, and the per-attribute **matching/scoring rules** used in eval |
| `docs/data-ingestion-spec.md` | ✍️ | Source formats (X archive, Reddit export, Google Takeout, SynthPAI `.jsonl`) → field mappings to the canonical `item`; third-party-drop rules; embedding step |

## 3. Backend
| Doc | Status | Contains |
|---|---|---|
| `docs/backend-structure.md` | ✅ | Layout, layers, workers, gateway, build order |
| `docs/api-spec.md` | ✍️ | Every endpoint: method, path, request/response schema, status codes, **error model**, auth + permission per route, pagination, the run-create/poll pattern |
| `docs/pipeline-spec.md` | ✍️ | Detailed attack / measure / defend pipelines: inputs → steps → outputs, idempotency, exactly what each writes, error/retry behavior |

## 4. AI / prompts (the product IP)
| Doc | Status | Contains |
|---|---|---|
| `docs/research-sources.md` | ✅ | Papers, repos, datasets, methodology, data sources |
| `docs/prompt-spec.md` | ✍️ 🔜 | Concrete prompt contracts: **attack** (system + user structure, strict output JSON, confidence/hardness scales, evidence format); **eval** matching rules; **defense** anonymizer loop + stop criteria. Versioned. |
| `docs/eval-and-metrics.md` | ✍️ | Eval harness, top-1/top-3 definitions, accuracy floors for CI, the optimize loop, model-routing policy, cost/latency KPIs, dashboard metric definitions |

## 5. Frontend
| Doc | Status | Contains |
|---|---|---|
| `docs/frontend-spec.md` | ✍️ | Screens (upload/consent, dashboard, attribution heatmap, attack→defend simulation, account/export/delete), component breakdown, state, run-polling UX, design direction |

## 6. Security, privacy & compliance
| Doc | Status | Contains |
|---|---|---|
| `docs/security.md` | ✍️ | Threat model, key-management (KMS/DEK) runbook, secrets handling, authz model, logging policy, RLS verification approach |
| `docs/privacy-compliance.md` | ✍️ | Data-flow/PII map, canonical three-tier model, retention policy, consent flow + copy, DSAR (export/erasure) procedures, sub-processor list |
| `docs/dpia.md` | ✍️ | The Data Protection Impact Assessment artifact for high-risk profiling |

## 7. Infra / DevOps
| Doc | Status | Contains |
|---|---|---|
| `docs/infrastructure.md` | ✍️ | Environments, hosting (Vercel + backend host + managed Postgres + Redis + KMS), env vars, secrets |
| `docs/local-dev.md` | ✍️ | docker-compose, make targets, seeding SynthPAI locally |
| `docs/ci-cd.md` | ✍️ | Pipeline, migration workflow, the **eval-as-CI-gate** |

## 8. Testing
| Doc | Status | Contains |
|---|---|---|
| `docs/testing-strategy.md` | ✍️ | Test pyramid, fixtures, SynthPAI eval-as-test, RLS isolation tests, crypto + crypto-shred tests, API contract tests |

## 9. Project plan
| Doc | Status | Contains |
|---|---|---|
| `docs/roadmap.md` | ✍️ | Phased milestones (M0…Mn) with acceptance criteria per phase — the index the eventual end-to-end build follows |

---

## Recommended authoring order
Ordered so each doc builds on understanding from the previous, ending with the roadmap that sequences the build:

1. **product-spec** — anchors the "what/why"; everything else serves it
2. **attributes-taxonomy** — the domain core that both the prompts and the schema depend on
3. **prompt-spec** — the product IP (attack / eval / defense contracts)
4. **api-spec** — the contract the frontend and workers will code against
5. **pipeline-spec** — ties prompts + API + DB into concrete flows
6. **data-ingestion-spec** — how real/synthetic data enters those flows
7. **frontend-spec** — the surfaces over the API
8. **eval-and-metrics** — how we measure and optimize
9. **security** → **privacy-compliance** → **dpia** — the trust layer
10. **infrastructure** → **local-dev** → **ci-cd** — how it runs
11. **testing-strategy** — how we prove it works
12. **roadmap** — last; turns all of the above into a build sequence
13. **repo-structure**, **README**, **ADRs**, **glossary** — housekeeping; slot in anytime

## How we'll work
One doc (or a small batch) at a time. You review and confirm you fully understand each before we move on. When every row above is ✅, you give the single "build end-to-end" instruction, and these docs are the complete specification.
```
