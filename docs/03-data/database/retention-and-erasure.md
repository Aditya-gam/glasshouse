# Database — Retention & Erasure

> **Depends on:** `tables/*`, `encryption.md`, `01-product/ethics-and-tone.md`, the **configurable-retention** decision · **Consumed by:** `05-backend/modules/workers.md` (purge), `services-erasure.md`, `08-security-privacy/dsar-export-erasure.md` · **Version:** v1

## Retention (configurable per user)
- **Default — retain-encrypted:** ingested `items`/`media_assets` carry an `expires_at` (retention window); content stays encrypted + crypto-shreddable so the user can re-run + use the defend simulation.
- **Per-user — process-then-discard:** after a run, raw `text_ct` + the media object are deleted immediately, keeping only derived results (`inferences`, scores). The embedding may be retained for re-retrieval per the user's choice.
- `workers/purge.py` runs on a schedule, hard-deleting expired T2 rows **and** their media objects.

## Erasure (DSAR / account delete)
1. **Crypto-shred** — delete `data_keys` → all of the user's ciphertext (incl. DB backups) is unrecoverable.
2. **Cascade** — deleting `users` cascades to `profiles(self)`, `items`, `media_assets`, `exif_findings`, `connected_accounts`, `runs`, `inferences(+candidates+evidence)`, `remediations`, `run_metrics`, `consents`, `memberships`, `data_keys`.
3. **Object storage** — the erasure service deletes all of the user's S3 objects (media/artifacts) as part of the same flow.
4. **Retained:** `audit_log` (user_id nulled, legal-obligation basis); SynthPAI (`user_id IS NULL`) untouched.
