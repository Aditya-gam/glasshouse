# Roadmap — Milestones

> **Depends on:** `build-order.md`, `01-product/success-metrics.md` · **Version:** v1

| # | Milestone | Delivers |
|---|---|---|
| **M0** | Foundations | config/db/models/Alembic, auth + RLS, crypto (+ round-trip/shred tests) |
| **M1** | Ingest + Attack (text) | ingestion (+drop test), gateway client, attack-text + self-consistency → `inferences` |
| **M2** | Measure | eval + SynthPAI fixture + calibration + noise model + **CI eval-gate** (the cited number) |
| **M3** | Defend (text) | ablation + anonymizer loop + independent adversary + noise floor → `remediations` (**the 0.86→0.21 moment**) |
| **M4** | Images | media/EXIF ingestion + VLM attack + image remediation |
| **M5** | API + Frontend | the `/v1` API + guided wizard + dashboard + attribution + defend simulation + trust view |
| **M6** | Connectors | Reddit/Mastodon live; X upload |
| **M7** | Polish + case study | the self-audit before/after, the redact outreach artifact, the **live URL** |

The signature demo (M3) is reachable on text alone; images (M4) and connectors (M6) widen it.
