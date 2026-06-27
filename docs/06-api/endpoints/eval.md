# API — Endpoints: Eval

> **Depends on:** `04-ai-engine/measure/*`, `03-data/tables/eval_results.md` + `calibration.md` · **Version:** v1

The engine's credibility numbers (Job 1) — not per-user.

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/v1/eval/results` | top-1/top-3 per attribute + modality + `engine_version` — the accuracy-trust view. |
| `GET` | `/v1/eval/calibration` | the reliability curve (calibrated reliability + the noise model) for the trust display. |
| `POST` | `/v1/runs {type:"eval"}` | **admin/CI only** — trigger a benchmark run (the CI eval-gate). |

Read endpoints are public-ish (the cited number is a selling point); the eval *trigger* is privileged.
