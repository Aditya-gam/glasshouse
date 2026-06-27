# Table — `consents`

> **Depends on:** `01-product/ethics-and-tone.md`, `08-security-privacy/consent-flow.md` · **Consumed by:** the run gate (all services) · **Hard invalidations:** consent model change → run gate + API + privacy docs · **Version:** v1

Lawful basis per user + purpose (GDPR Art. 6, plus Art. 9 when special-category).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → `users` | |
| `purpose` | text | e.g. `self_audit`, `art9_inference`, `decoy` |
| `special_category` | bool | Art. 9 acknowledgment |
| `policy_version` | text | the consented policy version |
| `granted_at` / `revoked_at` | timestamptz | |

**No run executes** without a valid, non-revoked row covering the subject + purpose (CLAUDE.md rule 7). Art. 9 inference and the opt-in **decoy** require their own explicit consent rows.
