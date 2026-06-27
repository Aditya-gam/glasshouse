# ADR 0006 — SynthPAI as the eval set

**Status:** Accepted (v1)

**Context.** We need grounded accuracy numbers without profiling real people.

**Decision.** Benchmark on **SynthPAI** (synthetic, human-labeled text) + **VIP / own labeled photos** (image). **Never** use the unreleased **PersonalReddit (PR)** set.

**Rationale.** SynthPAI is fully synthetic → **no data subjects** → safe for CI and citation; PR is real Reddit, withheld for ethics. The same engine runs on benchmark and user data, so the benchmark number transfers.

**Consequences.** SynthPAI seeded once as `profiles.type='synthpai'` + `eval_labels`; calibration + noise model become engine properties measured here; the CI floor gate.
