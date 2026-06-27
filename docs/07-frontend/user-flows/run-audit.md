# Flow — Run Audit

> **Depends on:** `06-api/endpoints/runs.md`, `state-and-polling.md` · **Version:** v1

Step 3 — the reveal.

- Trigger the **attack run** (`POST /v1/runs {type:"attack"}`) → **live progress via SSE** (retrieve → infer → calibrate).
- Land on the **dashboard**: all **8 attributes**, each with its **calibrated reliability band**, persona-lens ordering, and an evidence affordance.
- The emotional beat: "here's what an AI can infer about you from ordinary posts/photos" — calm, factual, evidence-backed.
- High-severity findings (e.g. exposed location for at-risk) lead, with a clear "break this" path into the defend simulation.
