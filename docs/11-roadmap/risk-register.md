# Roadmap — Risk Register

> **Depends on:** the spec; reviewed at each milestone · **Version:** v1

Living list — action the **High** ones first; revisit each milestone. Sev = likelihood × impact.

| # | Risk | Sev | Mitigation (already in the plan) |
|---|---|---|---|
| 1 | **Cost blow-up** — self-consistency × ablation × adversary balloons model spend | High | Proxy virtual-key budget caps + per-run cap; cap N≈3; scope ablation (top-k, N=1 probes); batch API; cheap/local routing (`llm-gateway`, `feasibility-and-cost`) |
| 2 | **Calibration desync** — a prompt/model/N change silently invalidates calibration | High | `engine_version` pin; the hard-invalidation reflex; CI eval-gate (`00-traceability`, `eval-as-ci-gate`) |
| 3 | **Prompt injection** — untrusted content hijacks a model | High | Datamark/spotlight + data-not-instructions + schema validation + injection red-team gate; third-party-drop shrinks the surface (`prompts/conventions`) |
| 4 | **Special-category / at-risk harm** — Art. 9 inference, false safety, doxxing aid | High | Consent gate + DPIA; advise-only; no-false-safety; self-audit-only; third-party-drop; crisis resources (`08-security-privacy`, `ethics-and-tone`) |
| 5 | **Crypto-shred vs backups** — a restored old backup resurrects a shredded DEK | High | `data_keys` shortest backup retention; ciphertext-only backups (`backup-dr`) |
| 6 | **Solo-dev scope** — a 169-doc spec is ambitious for one person | Med | Milestone gating; the tracer bullet; M0–M3 (text) IS the demo; images/connectors later (`tasks`, `build-order`) |
| 7 | **VIP dataset gated** — no access → weak image numbers | Med | Own labeled photos as the always-available image eval set; image framed supplementary (`dataset-vip`) |
| 8 | **Local-model ceiling** — Ollama ~70–80%; cited numbers need frontier | Med | Local for dev ($0), cloud for cited runs via the profile switch (`feasibility-and-cost`) |
| 9 | **SynthPAI → real-user shift** — benchmark may not transfer | Med | Distribution-shift doc + calibration caveats; confirm/deny live ground truth (`distribution-shift`) |
| 10 | **Async/queue correctness** — at-least-once double-apply, lost jobs | Med | Idempotency keys; idempotent jobs; DLQ; per-run budget abort (`run-lifecycle`, `workers`) |
| 11 | **VLM cost/latency** — per-image VLM calls are pricey | Med | CLIP triage pre-filter + budget cap; supplementary framing (`image-inference`) |
| 12 | **Decoy backfire** — opt-in false-attribute could harm an at-risk user | Med | Off-by-default; global opt-in + per-use confirm; persona warnings; truthful shown alongside (`ethics-and-tone`) |
| 13 | **Vendor lock/limits** — Neon/Railway/R2/Clerk pricing or quota shifts | Low | Attached-resources (swappable handles); provider-agnostic gateway (`architecture`, `infra`) |
| 14 | **Cross-repo contract drift** — polyrepo FE/BE desync if the generated client isn't regenerated after an API change | Med | Backend publishes `openapi.json`; frontend CI **drift guard** fails on a stale client; Schemathesis on the backend (ADR 0013, `contract-tests`) |
