# Glossary

> **Depends on:** `CLAUDE.md`, `04-ai-engine/*` · **Consumed by:** all docs · **Version:** v1

- **PAI** — Personal Attribute Inference: deducing personal attributes from a person's text/images.
- **The 8 attributes** — age · sex · location · birthplace · occupation · education · relationship · income.
- **Attack → Measure → Defend** — the three stages: infer → benchmark/calibrate → break-and-prove.
- **Run** — one async unit of work: `attack | eval | remediation`.
- **SynthPAI** — synthetic, human-labeled Reddit-style text benchmark (no data subjects). **VIP** — people-free image benchmark.
- **Self-consistency** — run an inference N times; agreement (meaning-clustered) = the raw confidence.
- **Calibration** — map from raw confidence → empirical accuracy (per attribute/modality), measured in Job 1.
- **Noise floor** — the engine's run-to-run variance; a before/after drop must beat it.
- **Independent adversary** — a held-out, different model that re-attacks to *prove* a remediation (editor ≠ judge).
- **Ablation** — leave-one-out (greedy minimal-set) to find which items causally drive an inference (`marginal_effect`).
- **Persona lens** — a reversible view that reorders attribute severity (job-seeker ↔ at-risk); never hides.
- **Advise-only** — the product suggests edits/removals; never acts on any platform.
- **Decoy** — opt-in false-attribute injection (IncogniText) that misleads the adversary; heavily warned.
- **DEK** — per-user Data Encryption Key (KMS-wrapped). **Crypto-shred** — delete the DEK → all ciphertext unrecoverable.
- **RLS** — Postgres Row-Level Security (tenant isolation, fails closed). **T1/T1′/T2/T3** — storage tiers (safe / invertible / sensitive-encrypted / never-persisted).
- **EXIF** — image metadata (GPS etc.). **VLM** — vision-language model. **LiteLLM Proxy** — the self-hosted gateway to all model backends.
- **problem+json** — RFC 9457 error format. **engine_version** — the (model+prompt+pipeline) pin tying results to a calibration map.
