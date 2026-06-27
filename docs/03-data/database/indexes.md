# Database — Indexes

> **Depends on:** `tables/*`, `04-ai-engine/text-inference.md` (retrieval) · **Consumed by:** `migrations.md` · **Version:** v1

| Index | On | Why |
|---|---|---|
| **HNSW** (pgvector) | `items.embedding` | retrieval (the one index that grows infra at scale) |
| FK + RLS | `items.owner_user_id`, `media_assets.owner_user_id`, `*.profile_id` | tenant-scoped queries + RLS |
| UK | `runs.idempotency_key`, `users.clerk_user_id`, `organizations.clerk_org_id` | idempotency + identity |
| dedupe | `items.content_hmac`, `media_assets.content_hmac` | skip re-ingesting duplicates |
| lookup | `calibration (engine_version, attribute_code, modality, signal, n, confidence_bucket)` | O(1) reliability lookup |
| join | `inference_candidates.inference_id`, `inference_evidence.candidate_id`, `exif_findings.media_asset_id` | the dashboard/ablation joins |
| time | `items.expires_at`, `media_assets.expires_at` | the purge worker scan |

Embeddings + the HNSW index are the only items that scale infra (RAM); everything else is bounded.
