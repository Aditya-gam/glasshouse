# Roadmap — Milestones

> **Depends on:** `build-order.md`, `01-product/success-metrics.md` · **Version:** v2 (2026-10: +M5.W write paths, built before M4; M6 connectors revised)

| # | Milestone | Delivers |
|---|---|---|
| **M0** | Foundations | config/db/models/Alembic, auth + RLS, crypto (+ round-trip/shred tests) |
| **M1** | Ingest + Attack (text) | ingestion (+drop test), gateway client, attack-text + self-consistency → `inferences` |
| **M2** | Measure | eval + SynthPAI fixture + calibration + noise model + **CI eval-gate** (the cited number) |
| **M3** | Defend (text) | ablation + anonymizer loop + independent adversary + noise floor → `remediations` (**the 0.86→0.21 moment**) |
| **M4** | Images | media/EXIF ingestion + VLM attack + image remediation |
| **M5** | API + Frontend | the `/v1` API + guided wizard + dashboard + attribution + defend simulation + trust view |
| **M5.W** | Write paths | consent, upload + ingestion run, encrypted object storage, erasure, retention + purge, export, confirm/deny; Onboarding / Connect / Account live (`plans/write-paths.md`) |
| **M6** | Connectors | Bluesky + Mastodon live; Reddit and X upload (Reddit's API has required approval since Nov 2025) |
| **M7** | Polish + case study | the self-audit before/after, the redact outreach artifact, the **live URL** |

The signature demo (M3) is reachable on text alone; images (M4) and connectors (M6) widen it.

**Execution order from 2026-10:** M0–M3 and the read half of M5 are built; next is **M5.W → M4 → M6 → M7**. A 2026-10-07 audit found the upload, consent and account routes were still stubs, and M4 and M6 both depend on them. No real-model run has happened yet; the first is scheduled at M7.
