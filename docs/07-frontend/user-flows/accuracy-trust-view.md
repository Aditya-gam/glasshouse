# Flow — Accuracy / Trust View

> **Depends on:** `04-ai-engine/measure/*`, `06-api/endpoints/eval.md` · **Version:** v1

"How do we know these numbers?" — the credibility view (and the outreach artifact).

- The **SynthPAI benchmark** — top-1/top-3 per attribute (the engine's measured accuracy), and the **calibration curve** ("a 0.8 location guess is right ~76% of the time").
- The **medical-test analogy** — validated on a population with known outcomes, then applied to *you*; you're the new patient, not re-validated.
- **Humble image framing** — image accuracy is supplementary, reported with intervals, not overclaimed.
- This view turns "the AI says..." into "here's why you can trust the number," and doubles as the recruiter/redact credibility piece. **Reachable** from the public `(marketing)` route **and** linked inbound from the dashboard's calibrated-reliability affordance.
