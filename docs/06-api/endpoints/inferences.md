# API — Endpoints: Inferences

> **Depends on:** `06-api/schemas.md`, `03-data/tables/inferences.md` · **Version:** v2 (confirm takes a candidate id — backend PR #59)

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/v1/inferences?run_id=\|profile_id=` | list (cursor), scope-bound. |
| `GET` | `/v1/inferences/{id}` | `InferenceRead` — ranked candidates with **calibrated reliability** (never raw confidence), evidence (the "six boring posts" join), persona-severity order. |
| `POST` | `/v1/inferences/{id}/confirm` | `InferenceConfirm {candidate_id, confirmed: bool}` → `InferenceConfirmRead {inference_id, candidate_id, confirmed}` — the user confirms/denies (trust + a live ground-truth/drift signal). Takes the candidate's `id` (returned on `AttributeFindingRead.candidates[]`), never the value, so a special-category value is not sent back or stored twice. Returns 501 until W6 lands. |

Special-category (`is_art9`/sensitive) values are decrypted + returned only under valid **Art. 9 consent**; otherwise masked.
