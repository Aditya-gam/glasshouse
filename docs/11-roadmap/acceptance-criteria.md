# Roadmap — Acceptance Criteria

> **Depends on:** `01-product/success-metrics.md`, `10-testing/*` · **Version:** v1

What "done" means, per stage.

- **Attack** — all 8 attributes inferred with **evidence + calibrated reliability**; abstains on weak signal; emits the `output-schema` shape.
- **Measure** — SynthPAI **top-1/top-3 baseline** established; the **CI eval-gate** is green at the floor; calibration map + noise model produced.
- **Defend** — a **proven** before/after on the affected attribute (held-out adversary, intervals, value-recovery flip) with utility preserved; advise-only.
- **Security** — RLS-isolation + crypto round-trip/shred + third-party-drop + contract tests pass; consent gate enforced; **no content in logs**.
- **Product** — a clickable **live URL**; a written **self-audit case study** (real before/after); the trust view shows the SynthPAI number.
