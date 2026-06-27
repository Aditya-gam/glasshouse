# Database

> ⚠️ **SUPERSEDED / ARCHIVED.** Split into and replaced by the granular tree — see `03-data/database/*` (authoritative v2: ER diagram + 22 per-table files + `media_assets`/`exif_findings`/`connected_accounts`/`calibration`, normalized `inferences`, enriched `attributes`). Kept for historical provenance only; **do not build from this file.** Migration map: `00-index.md`.

PostgreSQL + `pgvector` + `pgcrypto`. (Historical conceptual reference.)

## ER diagram

```mermaid
erDiagram
    users ||--o| data_keys : "has DEK"
    users ||--o{ consents : grants
    users ||--o{ memberships : "member of"
    organizations ||--o{ memberships : has
    role_permissions }o--|| permissions : grants

    users ||--o{ profiles : "owns (self)"
    organizations ||--o{ profiles : "owns (future)"
    profiles ||--o{ import_sources : "imported via"
    profiles ||--o{ items : contains
    import_sources ||--o{ items : produced

    profiles ||--o{ runs : "subject of"
    runs ||--o{ inferences : produces
    profiles ||--o{ inferences : about
    attributes ||--o{ inferences : typed_by

    profiles ||--o{ eval_labels : "ground truth"
    attributes ||--o{ eval_labels : typed_by
    runs ||--o{ eval_results : scores
    attributes ||--o{ eval_results : typed_by

    profiles ||--o{ remediations : "fixes for"
    items ||--o{ remediations : edits
    runs ||--o{ remediations : produced

    runs ||--o{ run_metrics : instrumented_by
    users ||--o{ audit_log : recorded

    users {
      uuid id PK
      text clerk_user_id UK
      text email
    }
    organizations {
      uuid id PK
      text clerk_org_id UK
    }
    memberships {
      uuid id PK
      uuid user_id FK
      uuid org_id FK
      role_t role
    }
    data_keys {
      uuid user_id PK_FK
      bytea wrapped_dek
      text kms_key_id
    }
    consents {
      uuid id PK
      uuid user_id FK
      text purpose
      bool special_category
      text policy_version
    }
    profiles {
      uuid id PK
      text type "self|synthpai"
      uuid user_id FK "null for synthpai"
      uuid org_id FK
    }
    import_sources {
      uuid id PK
      uuid profile_id FK
      text platform
      text method
    }
    items {
      uuid id PK
      uuid profile_id FK
      uuid owner_user_id FK "RLS"
      bytea text_ct "T2 encrypted"
      text content_hmac
      vector embedding "T1' invertible"
      bool is_subject_authored
      timestamptz expires_at
    }
    attributes {
      text code PK
      bool is_special_category
    }
    runs {
      uuid id PK
      uuid profile_id FK
      text type "attack|eval|remediation"
      run_status_t status
      text idempotency_key UK
    }
    inferences {
      uuid id PK
      uuid run_id FK
      uuid profile_id FK
      text attribute_code FK
      text predicted_value "plain if non-special"
      bytea predicted_value_ct "encrypted if special"
      numeric confidence
      bytea reasoning_ct "T2"
      jsonb evidence_item_ids
    }
    eval_labels {
      uuid id PK
      uuid profile_id FK
      text attribute_code FK
      text true_value
    }
    eval_results {
      uuid id PK
      uuid run_id FK
      text attribute_code FK
      numeric top1_acc
      numeric top3_acc
    }
    remediations {
      uuid id PK
      uuid profile_id FK
      uuid item_id FK
      text action "rewrite|remove"
      numeric confidence_before
      numeric confidence_after
    }
    run_metrics {
      uuid id PK
      uuid run_id FK
      int prompt_tokens
      int completion_tokens
      numeric cost_usd
    }
    audit_log {
      uuid id PK
      uuid user_id FK
      text action
    }
```

## Table reference

| Table | Purpose | Tier |
|---|---|---|
| `users` | Identity mirror of Clerk (`clerk_user_id` is the JWT `sub`) | — |
| `organizations`, `memberships` | Tenancy + RBAC (Clerk Organizations) | — |
| `permissions`, `role_permissions` | Role→permission matrix, checked in API + RLS | — |
| `data_keys` | KMS-wrapped per-user DEK; crypto-shred target | key material |
| `consents` | Lawful basis (Art. 6 + Art. 9 when `special_category`) | — |
| `profiles` | Unifies self-audit + SynthPAI subjects through one pipeline | — |
| `import_sources` | One data-import event | — |
| `items` | Normalized posts; only the subject's own | T2 text / T1′ embedding |
| `attributes` | The 8 PAI attributes; `is_special_category` flag | — |
| `runs` | Async unit: attack / eval / remediation | — |
| `inferences` | Attack output: value, top-3, confidence, evidence, reasoning | T1/T2 |
| `eval_labels` | SynthPAI ground truth | synthetic |
| `eval_results` | Per-attribute top-1/top-3 accuracy | T1 |
| `remediations` | Rewrite/remove + before/after confidence | T2 |
| `run_metrics` | Tokens/cost/latency per run | T1 |
| `audit_log` | Append-only export/delete/consent events | — |

## Storage tiers
- **T1 (derived, safe):** metrics, eval scores, non-special `predicted_value`/`top3`, run status. Plaintext; cascade-deleted.
- **T1′ (derived, invertible):** `items.embedding` — treated as personal data, never as anonymous; cascade-deleted.
- **T2 (raw/sensitive, consented):** `items.text_ct`, `inferences.reasoning_ct`, special-category `predicted_value_ct`, `remediations.original/rewritten`. pgcrypto-encrypted, retention-bound, hard-deletable.
- **T3 (never persisted):** other people's content; dropped at ingestion.
- **Synthetic:** SynthPAI — `profiles.type='synthpai'`, `user_id/org_id NULL`, unencrypted, exempt from erasure.

## Encryption
- **Envelope:** each user has a DEK stored only as `data_keys.wrapped_dek` (KMS-wrapped). The app unwraps it in memory per request.
- **pgcrypto:** `pgp_sym_encrypt/decrypt`; the DEK is **always a bound parameter**; decryption only via a `SECURITY DEFINER` function; the app role cannot read `data_keys`.
- **Crypto-shred:** erasure deletes user rows (cascade) **and** the DEK → residual ciphertext (incl. backups) is unrecoverable.
- **Dedupe:** `content_hmac` (keyed HMAC), not a plain hash.

## Row-Level Security
Per request, after JWT verification:
```sql
SET LOCAL app.user_id = '<users.id>';
SET LOCAL app.org_id  = '<organizations.id>';
```
Policies on `items`, `runs`, `inferences`, `remediations`, `import_sources`, `run_metrics` allow rows where `owner_user_id = app.user_id` (or the subject's `profile` belongs to `app.org_id`), plus read-only access to SynthPAI profiles. `data_keys` has no app-readable policy.

## Retention
- `items.expires_at` set at ingestion per the retention policy.
- `workers/purge.py` runs on a schedule, hard-deleting expired T2 rows.

## Cascade & erasure
Deleting a `users` row cascades to `profiles(self)`, `import_sources`, `items`, `runs`, `inferences`, `remediations`, `run_metrics`, `consents`, `memberships`, `data_keys`. `audit_log.user_id` is set NULL (retained under legal-obligation basis). SynthPAI (`user_id IS NULL`) is untouched.
