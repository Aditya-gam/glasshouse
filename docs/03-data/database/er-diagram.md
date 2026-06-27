# Database — ER Diagram

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `overview.md`, `tables/*`
> - **Consumed by:** `05-backend/modules/repositories.md`, API DTOs, migrations
> - **Hard invalidations:** any table/relationship change → regenerate this diagram (`00-traceability.md` DB row)
> - **Version:** v2 (reconciled with all v2 tables)

```mermaid
erDiagram
    users ||--o| data_keys : "has DEK"
    users ||--o{ consents : grants
    users ||--o{ memberships : "member of"
    organizations ||--o{ memberships : has
    users ||--o{ connected_accounts : "linked (OAuth)"

    users ||--o{ profiles : "owns (self)"
    profiles ||--o{ import_sources : "imported via"
    profiles ||--o{ items : "text items"
    profiles ||--o{ media_assets : "image items"
    import_sources ||--o{ items : produced
    import_sources ||--o{ media_assets : produced
    media_assets ||--o{ exif_findings : "EXIF"

    profiles ||--o{ runs : "subject of"
    runs ||--o{ inferences : produces
    attributes ||--o{ inferences : typed_by
    inferences ||--o{ inference_candidates : "ranked 1-3"
    inference_candidates ||--o{ inference_evidence : "cites"
    items ||--o{ inference_evidence : "text evidence"
    media_assets ||--o{ inference_evidence : "image evidence"
    exif_findings ||--o{ inference_evidence : "metadata evidence"

    profiles ||--o{ eval_labels : "ground truth"
    runs ||--o{ eval_results : scores
    attributes ||--o{ calibration : "calibrated per"

    profiles ||--o{ remediations : "fixes for"
    inferences ||--o{ remediations : "targets"
    runs ||--o{ remediations : produced

    runs ||--o{ run_metrics : instrumented_by
    users ||--o{ audit_log : recorded

    attributes {
      text code PK
      text value_type "numeric|categorical|geo_hier|freetext_semantic"
      text match_method
      bool is_art9
      bool is_sensitive_tier
      jsonb allowed_values
      jsonb severity "per-persona weights"
    }
    inferences {
      uuid id PK
      uuid run_id FK
      text attribute_code FK
      text modality "text|image|multimodal"
      text status "inferred|abstained"
      text engine_version "calibration pin"
    }
    inference_candidates {
      uuid id PK
      uuid inference_id FK
      int rank
      jsonb value "typed per value_type"
      bytea value_ct "if Art.9/sensitive"
      numeric raw_confidence
      text confidence_source
      jsonb agreement
    }
    inference_evidence {
      uuid id PK
      uuid candidate_id FK
      text ref_type "item|media_asset|exif_finding"
      uuid ref_id
      jsonb span "text"
      jsonb region "image bbox"
      numeric proxy_score
      numeric citation_frequency
      numeric marginal_effect "defend-filled"
      bytea rationale_ct "T2; Art.9-scrubbed"
    }
    media_assets {
      uuid id PK
      uuid profile_id FK
      uuid owner_user_id FK "RLS"
      text object_ref "S3 key (SSE)"
      text content_hmac
      text mime
      int width
      int height
      bool is_subject_authored
      timestamptz expires_at
    }
    exif_findings {
      uuid id PK
      uuid media_asset_id FK
      text finding_type "gps|timestamp|camera|software"
      bytea value_ct "T2 (e.g. GPS)"
      timestamptz captured_at
    }
    connected_accounts {
      uuid id PK
      uuid user_id FK
      text platform "reddit|mastodon|x"
      bytea access_token_ct "T2"
      bytea refresh_token_ct "T2"
      text scopes "read-only"
      text status
    }
    calibration {
      uuid id PK
      text engine_version
      text attribute_code FK
      text modality
      text signal "self_consistency"
      int n
      numeric confidence_bucket
      numeric empirical_accuracy
      numeric noise_std "run-to-run floor"
      numeric ece
    }
```

Full per-entity columns + tiers in `tables/*`. The **normalized attack output** (`inferences → inference_candidates → inference_evidence`) and **`calibration`** (which also carries the noise model) are the v2 structural changes.
