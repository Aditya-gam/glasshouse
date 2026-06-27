# Inference Exposure Auditor — Build Blueprint

**One-liner:** A privacy-first tool that runs the adversary's LLM attribute-inference attack on *your own* footprint, shows what can be deduced about you (and the evidence trail), then rewrites or removes the right content to break the inference — and re-runs the attack to *prove* it worked.

**The threat it addresses (and why it's new):** Every existing tool — redact, secret scanners, impersonation monitors — operates on content you *explicitly posted*. None touch **inference**: what an adversary deduces from a pile of individually-harmless posts. Research shows LLMs infer location, income, age, sex, occupation from Reddit posts at ~85% top-1 / ~95% top-3 accuracy, far cheaper and faster than human profilers — and that keyword/anonymization defenses (redact's whole model) don't stop it. This product audits that invisible attack surface.

---

## 1. Why this is de-risked (off-the-shelf assets, all MIT-licensed)

You are not building from zero. The ETH Zürich SRI Lab published the hard parts:

- **SynthPAI** (`eth-sri/SynthPAI`, on HuggingFace) — 7,823 synthetic Reddit comments across 103 threads / 300 profiles, **human-verified attribute labels**. Fully synthetic → no ethics problem testing on real people. This is your **ground-truth eval set**.
- **`eth-sri/llmprivacy`** — code + the standardized zero-shot CoT **attack prompts** from "Beyond Memorization" (ICLR 2024).
- **`eth-sri/llm-anonymization`** — "Language Models are Advanced Anonymizers" (ICLR 2025): an **adversarial anonymizer** that rewrites text against a competing inference LLM. This is your **remediation engine** — not just "delete this," but "here's a rewrite that breaks the inference while keeping your meaning."
- **Image attribute inference (VLM)** code — for the optional photo-geolocation extension.

Your job is the *product*: the engine wiring, the attribution + simulation dashboard, the eval harness, the UX, the local-first architecture, and the redact-shaped framing. Cite the papers/repos; build the product around them. That's legitimate and smart engineering.

---

## 2. The core: a three-stage adversarial loop

### Stage 1 — ATTACK (the inference engine)
Input: your posts, normalized to a common `item`. Output: for each of the 8 attributes (age, sex, location, birthplace, occupation, education, relationship status, income), a structured JSON inference with:
- predicted value(s) (top-1 + top-3)
- **confidence** and estimated **hardness**
- **reasoning** (chain-of-thought)
- **evidence**: the specific item IDs that leaked it

Agentic option (your "latest agentic AI" showcase): one sub-agent per attribute, or a `recon → infer → verify` loop. Start single-call, upgrade to agentic once the eval is in place.

### Stage 2 — MEASURE (the eval harness)
Run the engine against **SynthPAI's labeled data** → per-attribute top-1 / top-3 accuracy. This is your headline metric and your résumé number, and it's non-circular: you're scoring against human-verified labels, not your own opinions.
- Also run on **your own export** as a case study — you know your real attributes, so you can show "it pinned my home metro from these 4 posts: correct."

### Stage 3 — DEFEND (remediation + proof)
For each high-confidence inference, the adversarial anonymizer proposes the *minimal* change — a rewrite that preserves meaning, or a flag-for-deletion — that breaks the inference. Then **re-run Stage 1** on the edited footprint and report the confidence delta.
- Output: `attack → defend → re-attack`, e.g., "home-location confidence 0.86 → 0.21 after editing 3 posts."

---

## 3. The dashboard (your optimize / observability layer)

- **Inference panel:** per-attribute predicted value, confidence, and reasoning.
- **Attribution heatmap:** which posts leak which attribute (the "boring tweets that together pin your house" view).
- **Simulation:** before/after inference-confidence curve as items are rewritten/removed — the core interactive moment.
- **Instrumentation:** model, tokens, latency, cost per run; **model routing** (cheap model for low-signal items, strong model only for ambiguous ones); cost-per-run before/after tuning.

---

## 4. Data (real, free, yours — no government, no guesswork)

- **Bootstrap + eval:** SynthPAI (download from HuggingFace; MIT). Labeled, ethical, ready.
- **Self-audit demo:** your own X / Reddit / Google Takeout export. Ground truth = you. Sidesteps all API limits and is on-brand for a privacy pitch.
- **Optional live pulls:** Reddit free tier (non-commercial, ~60–100 req/min). Fine for a portfolio; don't go commercial without a contract.
- **Image extension:** your own photos, run through the VLM inference path.

---

## 5. Tech stack (reuses your strengths)

- **Frontend:** Next.js (dashboard + simulation UI)
- **Backend:** FastAPI (Python), workers for attack/defend runs
- **DB:** PostgreSQL + pgvector
- **AI:** an LLM (e.g., Claude via the Anthropic API) for inference + anonymization; reuse the ETH attack prompts and anonymizer baseline
- **Privacy-first architecture (the culture signal):** BYO-data, ephemeral processing, no server-side storage of raw content, optional fully-local run. Document this in the README.
- **Deploy:** Vercel (frontend) + Railway / Render / Fly.io (backend + Postgres) → live URL

---

## 6. Weekend slice — Attack + Measure + minimal Defend (hour-by-hour)

~16–18 focused hours. Target: a live URL that scores against SynthPAI *and* runs a before/after self-audit on your own data.

- **0:00–2:00** — Scaffold (Next.js + FastAPI + Postgres/pgvector via Docker), repo, env.
- **2:00–4:00** — Load SynthPAI; parse your own export into the common `item` schema.
- **4:00–7:00** — ATTACK engine v1: adapt the ETH attack prompt → structured JSON inference with evidence + confidence.
- **7:00–9:00** — MEASURE: eval vs SynthPAI labels → first per-attribute accuracy numbers.
- **9:00–11:00** — Dashboard v1: inference results + attribution view.
- **11:00–13:00** — DEFEND v1: rewrite/remove suggestion (anonymizer) + RE-ATTACK to show the confidence delta.
- **13:00–15:00** — Instrumentation panel (cost/latency/tokens) + model routing; capture before/after cost.
- **15:00–17:00** — Deploy → live URL; README with the SynthPAI metric + your self-audit case study.

---

## 7. Starter schema (Postgres)

```sql
items ( id, source, author, created_at, text, media_url, permalink,
        embedding vector(1536), is_eval bool, ingested_at )

inferences ( id, item_scope, attribute, predicted_value, top3 jsonb,
             confidence, hardness, reasoning, evidence_item_ids jsonb,
             model, run_id, created_at )

eval_labels ( profile_id, attribute, true_value, source )  -- from SynthPAI

remediations ( id, attribute, original_text, rewritten_text, action,
               confidence_before, confidence_after, run_id )

run_metrics ( id, run_id, model, prompt_tokens, completion_tokens,
              latency_ms, cost_usd, created_at )
```

---

## 8. Ethics / dual-use guardrails (these also strengthen the pitch)

- **Self-audit only**, on data the user owns. Defensive framing throughout ("see what they see, then fix it" — a pentest for your identity).
- **SynthPAI for evaluation** so you never benchmark on real strangers.
- Always surface **confidence + evidence** so the tool never makes hallucinated accusations.
- A privacy company reads this responsible design as maturity and culture fit, not as a limitation.

---

## 9. redact.dev positioning

- It's the **targeting brain** for their deletion engine: redact deletes what you flag; this tells you *what to flag* — the non-obvious items — and demonstrates that their keyword/anonymization model doesn't defend against inference.
- **Outreach:** dogfood on your own footprint; lead with the SynthPAI benchmark number + your self-audit before/after ("here's what your filters miss, and here's the fix that preserves the post").
- **Extension:** point the same engine at an executive — "what can an attacker infer and dox about your CEO from public posts" — which maps to redact's enterprise exec-protection product.

---

## 10. Résumé bullets (fill in numbers after the eval)

- "Built a privacy inference-exposure auditor that runs LLM attribute-inference attacks against a user's own footprint; achieved __% top-1 / __% top-3 inference accuracy benchmarked on the SynthPAI dataset, with an attribution + removal-simulation dashboard."
- "Implemented an adversarial attack→defend→re-attack loop that cut model inference confidence on sensitive attributes from __ to __ while preserving text utility."
- "Designed the eval + observability layer (per-attribute accuracy, cost/latency, model routing) that reduced cost-per-run __% at equal accuracy."
```
