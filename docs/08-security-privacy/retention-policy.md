# Security — Retention Policy

> **Depends on:** `03-data/retention-and-erasure.md`, the configurable-retention decision · **Version:** v1

GDPR **storage limitation** — keep personal data only as long as needed.

- **Default — retain-encrypted** with a per-item `expires_at` (a bounded window) so re-runs + the defend loop work; `workers/purge.py` hard-deletes expired T2 rows + their objects on a schedule.
- **Per-user — process-then-discard** — raw content + media deleted right after a run; only derived results kept.
- **Synthetic** (SynthPAI/VIP) — exempt (no data subject).
- **`audit_log`** — retained under legal-obligation basis (user_id nulled on erasure).
- The retention window + purge cadence are configurable env settings (12-factor).
