# API — Endpoints: Inferences

> **Depends on:** `06-api/schemas.md`, `03-data/tables/inferences.md` · **Version:** v1

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/v1/inferences?run_id=\|profile_id=` | list (cursor), scope-bound. |
| `GET` | `/v1/inferences/{id}` | `InferenceRead` — ranked candidates with **calibrated reliability** (never raw confidence), evidence (the "six boring posts" join), persona-severity order. |
| `POST` | `/v1/inferences/{id}/confirm` | `{value, confirmed: bool}` — the user confirms/denies (trust + a live ground-truth/drift signal). |

Special-category (`is_art9`/sensitive) values are decrypted + returned only under valid **Art. 9 consent**; otherwise masked.
