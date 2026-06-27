# Documentation Index (granular tree)

Supersedes `00-build-plan.md`. This is the authoritative map of the whole doc set. We populate it **component by component**; each leaf is a small, detailed file so factual/logical consistency and feasibility can be checked locally.

**Legend:** ✅ written · ⭐ written this pass · 🔄 exists but needs reconciliation · ✍️ to write

```
docs/
  00-index.md                              ⭐ this file
  glossary.md                              ⭐  key terms

  01-product/
    overview.md                            ⭐  product summary (consolidated from product-spec)
    problem-and-threat.md                  ⭐  inference threat; both personas; stats + incidents
    personas.md                            ⭐  job-seeker + at-risk; persona lens
    scope-v1.md                            ⭐  multimodal + connectors + advise-only; self-audit
    out-of-scope-and-roadmap.md            ⭐  v1 boundary + engine/product roadmap
    positioning.md                         ⭐  complement redact; opposite Whitebridge
    success-metrics.md                     ⭐  SynthPAI baseline + CI floor; proven drop; live URL
    business-model.md                      ⭐  portfolio/hire-me artifact; freemium noted not built
    ethics-and-tone.md                     ⭐  no-false-safety; decoy consent; crisis resources

  02-architecture/
    system-overview.md                     ⭐  +LiteLLM Proxy, +VLM, +connectors, +media
    run-lifecycle.md                       ⭐  run state machine; stage flow (split from architecture.md)
    trust-boundaries.md                    ⭐  egress/decryption/network; +VLM sub-processor
    tech-stack.md                          ⭐  locked stack
    deployment-topology.md                 ⭐  +LiteLLM Proxy Docker service
    repo-structure.md                      ⭐  two-repo (polyrepo) layout
    decisions/                             ⭐  13 ADRs (locked decisions recorded)
      0001-cloud-vs-local.md
      0002-clerk-auth.md
      0003-pgcrypto-encryption.md
      0004-async-from-start.md
      0005-self-audit-scope.md
      0006-synthpai-eval.md
      0007-multimodal-v1.md
      0008-live-connectors-v1.md
      0009-advise-only-defense.md
      0010-hosting-stack.md
      0011-ui-stack.md
      0012-cicd-strategy.md
      0013-polyrepo.md

  03-data/
    database/
      overview.md                          ⭐  v2 (media/exif/connectors/calibration/normalized)
      er-diagram.md                        ⭐  full v2 ER
      tables/                              ⭐  one file per table (22)
        users.md  organizations.md  memberships.md  permissions.md
        data_keys.md  consents.md  profiles.md
        connected_accounts.md ⭐NEW   import_sources.md
        items.md  media_assets.md ⭐NEW   exif_findings.md ⭐NEW
        attributes.md ⭐enriched  runs.md  inferences.md ⭐normalized
        eval_labels.md  eval_results.md  calibration.md ⭐NEW
        remediations.md ⭐updated  run_metrics.md  audit_log.md
      indexes.md  rls-policies.md  retention-and-erasure.md  migrations.md  ⭐
    storage-tiers.md                       ⭐
    encryption.md                          ⭐
    ingestion/
      overview.md                          ⭐
      canonical-item.md                    ⭐
      third-party-drop.md                  ⭐
      images-and-exif.md                   ⭐ NEW
      sources/                             ⭐  9 source adapters
        upload-x-archive.md  upload-reddit-export.md
        upload-google-takeout.md  upload-photos.md
        connector-reddit.md  connector-mastodon.md  connector-x.md (paid tier)
        loader-synthpai.md  dataset-vip.md

  04-ai-engine/
    overview.md                            ✅  (attack/measure/defend roles + separation)
    attributes-taxonomy.md                 ✅  (8 attributes: defs, values, matching)
    feasibility-and-cost.md                ✅  (model slots, cost levers, options-matrix)
    attack/
      output-schema.md                     ⭐  Profiler JSON contract (two-layer; pinned to taxonomy)
      text-inference.md                    ⭐  text pipeline: always-retrieve + joint-8 + escalation
      image-inference.md                   ⭐  EXIF (deterministic) + VLM (context-only, triaged)
      confidence-and-self-consistency.md   ⭐  self-consistency default; meaning-clustered agreement
      evidence-attribution.md              ⭐  model-claim + free proxies; causal proof deferred to defend
    measure/
      overview.md                          ⭐  Job 1 vs Job 2 framing
      benchmarking.md                      ⭐  engine accuracy on SynthPAI/VIP
      calibration.md                       ⭐  confidence → empirical accuracy
      per-user-scoring.md                  ⭐  label-free pipeline on user data
      distribution-shift.md                ⭐  caveats + drift detection
    defend/
      overview.md                          ⭐  advise-only + editor/judge separation
      independent-adversary.md             ⭐  held-out re-attack; different-model; before/after proof
      noise-floor-and-variance.md          ⭐  paired bootstrap vs global noise floor; intervals
      attribution-ablation.md              ⭐  greedy minimal-set + clustering; fills marginal_effect
      utility-preservation.md              ⭐  LLM-judge (readability+meaning) of non-sensitive content
      text-remediation.md                  ⭐  iterative refine-against-feedback; truthful + opt-in decoy
      image-remediation.md                 ⭐  EXIF strip + crop/inpaint/remove; prove all options
    prompts/                               versioned prompt contracts
      conventions.md                       ⭐  template + protocols + create/validate (injection-hardened)
      output-formats.md                    ⭐  structured-output contract; reasoning via provider-thinking
      attack-text.md                       ⭐  adversarial-investigator; zero-shot; datamarked; probscore
      attack-image.md                      ⭐  VLM; hierarchical geo-CoT; single-pass; context-only; EXIF-blind
      anonymize-text.md                    ⭐  FgAA editor; localized span-edits; self-arbitration; decoy gated
      adversary-judge.md                   ⭐  reference-anchored judges; adversary reuses attack; bias-controlled
    llm-gateway.md                         ✅  (LiteLLM Proxy; instructor; slots; budget caps)
    research-sources.md                    ✅  (v2 — reconciled this pass)

  05-backend/
    overview.md  layout.md                 ⭐ (split from backend-structure; gateway=thin proxy client)
    modules/                               ⭐  one file per module (16, rule-governed)
      auth-clerk.md rbac.md webhooks.md db-session.md crypto.md rls.md
      repositories.md services-ingestion.md services-inference.md
      services-eval.md services-anonymize.md services-consent.md
      services-erasure.md services-export.md llm-gateway.md workers.md
    error-model.md  config-and-secrets.md  observability.md   ⭐

  06-api/
    overview.md  auth-and-permissions.md   ⭐ (generic /runs; problem+json; cursor; idempotency)
    endpoints/                             ⭐  8 groups (poll + SSE)
      imports.md connectors.md runs.md inferences.md
      remediations.md eval.md account.md webhooks.md
    schemas.md                             ⭐

  07-frontend/
    overview.md  persona-lens.md  components.md  state-and-polling.md   ⭐ (wizard; lens toggle; poll+SSE)
    design-system.md  app-shell-and-layout.md                ⭐ (shadcn/ui · tokens · IA · Claude Design brief)
    design-tokens.json  claude-design-brief.md                ⭐ (sand+teal · Radix · Lucide · hand-off packet)
    claude-design-prompts.md  prototype-mapping.md          ⭐ (per-screen playbook · window.*→TSX build map; prototype at ./prototype/)
    user-flows/                            ⭐  7 flows
      onboarding-consent.md connect-import.md run-audit.md
      attribution.md defend-simulation.md account-data-rights.md
      accuracy-trust-view.md
    screens/                               ⭐  screen inventory

  08-security-privacy/
    threat-model.md  key-management.md  authz-model.md  logging-policy.md
    data-flow-pii-map.md  consent-flow.md  dsar-export-erasure.md
    retention-policy.md  sub-processors.md  dpia.md                    ⭐ (10; OWASP/GDPR governed)

  09-infra-devops/
    environments.md infrastructure.md local-dev.md ci-cd.md secrets-management.md  ⭐ (12-factor; $0 local)
    observability.md iac.md backup-dr.md github-actions.md dev-workflow.md   ⭐ (OTel · Terraform · backup/DR · CI checks · branching/release/pre-commit)

  10-testing/
    strategy.md fixtures.md eval-as-ci-gate.md
    rls-isolation-tests.md crypto-tests.md contract-tests.md            ⭐ (pyramid+trophy; security/eval gates)
    frontend-tests.md e2e-tests.md                          ⭐ (RTL/trophy · Playwright E2E)

  11-roadmap/
    milestones.md acceptance-criteria.md build-order.md                ⭐ (M0–M7; build order)
    tasks.md  tasks-backend.md  tasks-frontend.md  definition-of-ready-done.md   ⭐ (cross-repo task map + per-repo backlogs + DoR/DoD)
    risk-register.md  preflight-checklist.md                 ⭐ (risks + accounts/data/secrets to gather)
```

## Migration map (flat docs — now archived ✓)
The original flat drafts have been **split into the granular tree and moved to `archive/`** (historical provenance only; each carries a SUPERSEDED banner — do not build from them):
- `archive/product-spec.md` → split into `01-product/*`
- `archive/architecture.md` → `02-architecture/*`
- `archive/database.md` → `03-data/database/*` (ER + per-table files)
- `archive/backend-structure.md` → `05-backend/*`
- `research-sources.md` → **moved** to `04-ai-engine/research-sources.md` (active — kept, not archived)
- `CLAUDE.md` stays at repo root (points here)
- `00-build-plan.md` → retired (now in `archive/`) in favor of this index

## Reconciliation checklist (recent decisions not yet in the flat docs)
Apply these as we populate each subtree:
1. **Multimodal v1** → new tables `media_assets`, `exif_findings`; ingestion `images-and-exif.md`; engine `attack/image-inference.md`, `defend/image-remediation.md`; VLM in `llm-gateway.md` + `trust-boundaries.md`.
2. **Live connectors (Reddit/Mastodon/X)** → new table `connected_accounts` (encrypted OAuth tokens); ingestion `sources/connector-*.md`; X marked paid-tier/upload-first.
3. **Measurement model (Job 1 / Job 2)** → `04-ai-engine/measure/*` (written this pass) + new `calibration` table.
4. **Defense validation** → `04-ai-engine/defend/*` (overview written this pass).
5. **Two co-primary personas + persona lens** → `01-product/personas.md`, `07-frontend/persona-lens.md`, severity weighting in `04-ai-engine/attributes-taxonomy.md` and `eval`.
6. **AutoProfiler grounding** (from `attack/text-inference.md` research) → `04-ai-engine/overview.md`: its actual agents are **Strategist / Retriever / Extractor / Summarizer** (no separate "Tagger"; our Tagger + embedding-Retriever are *our* additions — keep, but say so); and **license check resolved** — the repo has **no LICENSE → method-only reuse, no code copied** (replace "license verification pending"). `04-ai-engine/research-sources.md`: add AutoProfiler (`zealscott/AutoProfiler`, arXiv 2505.12402, ACL 2026) and confirm Staab/`eth-sri/llmprivacy` (arXiv 2310.07298); **and the image refs** — VIP / "Private Attribute Inference from Images with VLMs" (Tömekçe et al., NeurIPS 2024, arXiv 2404.10618, `eth-sri/privacy-inference-multimodal`, code MIT / data separate terms), GeoSpy + 404 Media 2025 (real-world geolocation-abuse + ethics), VLM-geolocation benchmarks, and the **defense ref** (Staab et al., "Large Language Models are Advanced Anonymizers" — FgAA, ICLR 2025, arXiv 2402.13846). **Status:** `research-sources.md` ✅ done (v2, this pass); the `overview.md` half (agent scheme labelled as *ours*; "license check pending" → "no license → method-only") is **✅ done**.
7. **Opt-in decoy mode** (from `defend/text-remediation.md`) → `01-product/ethics-and-tone.md` owns the deception ethics + explicit opt-in consent + per-persona warning copy (esp. at-risk); `07-frontend/user-flows/defend-simulation.md` renders the opt-in/warnings; possible `consents`/`remediations` flag for decoy usage. Decoy is **off by default**, truthful edits always shown alongside.

## How we work
One subtree at a time, smallest leaves first. For each leaf I bring recommendations + open questions, you decide, I write it, and we check it against neighbors for consistency. When the tree is all ✅, the docs are the complete build spec.
