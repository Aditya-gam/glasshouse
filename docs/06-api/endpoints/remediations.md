# API — Endpoints: Remediations

> **Depends on:** `04-ai-engine/defend/*`, `03-data/tables/remediations.md` · **Version:** v1

| Method | Path | Behavior |
|---|---|---|
| `POST` | `/v1/inferences/{id}/remediations` | `{strategy?, decoy?: bool}` → **`202` + `run_id`** (triggers a remediation run). **Decoy requires per-use consent** (`ethics-and-tone`). |
| `GET` | `/v1/remediations/{id}` | `RemediationRead` — the **proven** before/after (intervals, value-recovery flip, significant), utility score, the diff/`span_changes`, and the frontier options. |
| `GET` | `/v1/remediations?inference_id=` | list (cursor). |

Advise-only: responses are *suggestions* + proven deltas; the product never applies them. The "no false safety" note travels with the result.
