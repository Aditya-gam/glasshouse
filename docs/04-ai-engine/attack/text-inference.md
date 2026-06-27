# Attack — Text Inference (the Profiler's text path)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attributes-taxonomy.md` (the 8 targets + value types), `attack/output-schema.md` (emits `RawAttributeGuess`), `overview.md` (agent decomposition + separation rules), `feasibility-and-cost.md` (Profiler = capable slot; Retriever/embeddings = Tier-1; cost levers), `llm-gateway.md` (instructor validation, budget caps, prompt caching), `03-data/ingestion/canonical-item.md` (the text items it reads)
> - **Consumed by:** `prompts/attack-text.md` (verbatim prompt contract), `attack/confidence-and-self-consistency.md` (wraps this pass), `attack/evidence-attribution.md`, `measure/benchmarking.md` (runs this exact engine on SynthPAI), `defend/independent-adversary.md` (re-runs a variant), `05-backend/modules/services-inference.md` + `workers.md`, `02-architecture/run-lifecycle.md`
> - **Hard invalidations:** **changing this pipeline — retrieval strategy, joint-vs-per-attribute structure, or the attack prompt — changes the engine → recompute `measure/benchmarking.md` + `measure/calibration.md`** (the calibration map is pinned to the exact attack model+prompt+pipeline, via `engine_version`). Changing the emitted shape → `attack/output-schema.md`.
> - **Version:** v1

How the attack infers the 8 attributes from a subject's **text** (the image path is `image-inference.md`; fusion of the two is the Summarizer's job). This doc defines the *orchestration and behavior*; the verbatim prompt is `prompts/attack-text.md`, the JSON it emits is `attack/output-schema.md`, and the self-consistency/evidence/consolidation steps are their own sibling leaves.

---

## 1. The pipeline (v1, as decided)

```
 text items (canonical, decrypted in-memory)
   │
   ├─▶ Presidio explicit-PII  ── side annotation only (never narrows the Profiler's input)   [Tier-1, §6]
   │
   ▼
 Retriever  ── ALWAYS ON ── high-recall hybrid selection → one global evidence set            [Tier-1, non-LLM, §3]
   │            (embedding-relevance ∪ recency ∪ always-include, generous k, token-budget cap)
   ▼
 Profiler — JOINT pass: one capable-LLM call, all 8 attributes, reason → top-3 + confidence + evidence
   │            emits  RawAttributeGuess[]  (attack/output-schema.md §9)                        [capable slot, §4]
   ▼
 Targeted escalation — re-run only high-stakes / uncertain attributes, focused + deeper N      [§5]
   │
   ▼
 Normalize → canonical AttributeGuess[]  (GeoNames, band/bracket parsers — output-schema.md §6)
   │
   ▼
 (self-consistency wrap N≈3 → confidence-and-self-consistency.md ; consolidation → Summarizer)
```

Two posture decisions baked in (your calls):
- **Retrieval is always on** — one uniform path. Because the Retriever is high-recall and capped by a token budget, it **returns the whole footprint when the footprint is small** and only down-selects when it's large. So we get bounded, predictable cost on big footprints *and* full cross-attribute context on small ones, with a single code path.
- **One joint inference call for all 8**, then a **targeted re-pass** for the attributes that matter or look shaky.

**Benchmark equivalence (important):** SynthPAI authors have modest comment counts, so the high-recall Retriever returns essentially all of an author's comments → the joint pass sees everything → this matches the canonical single-prompt attack the ~85%/~95% numbers come from, and satisfies `measure/benchmarking.md`'s rule that *the same engine runs on benchmark and user data*. "Always retrieve" does **not** distort benchmark comparability.

Skipped in v1 (stated, not silently dropped):
- **Tagger** — the optional pre-filter that labels which attributes a comment might reveal. Skipped because the Profiler sees the full retrieved set regardless, so a Tagger saves tokens, never accuracy (`feasibility-and-cost.md`). Add later only if token cost demands it.
- **Agentic Strategist loop** (AutoProfiler's retrieve→infer→refine controller) — deferred to a roadmap "deep audit" mode for footprints that exceed even the retrieval budget; v1's always-on Retriever + token cap covers the bounded subjects we actually have.

---

## 2. Input

The decrypted-in-memory **canonical text items** for one subject (a user profile, or a SynthPAI author in benchmarking). Each item is third-party-dropped already (`is_subject_authored = true` only) and carries an opaque `item_id` used as the evidence reference (`output-schema.md` §8). Nothing here is logged or persisted (`llm-gateway.md`, CLAUDE.md rule 1).

---

## 3. The Retriever (always-on, non-LLM, Tier-1)

Picks the evidence set the Profiler reads. **No LLM** — free local embeddings + `pgvector` similarity search (`feasibility-and-cost.md`). Tuned for **recall**, because the product's whole value is catching the *implicit, non-obvious* signal (a bland "ugh, the 405 again" geolocates to LA) — missing such an item is far worse than paying for a few extra tokens.

**Selection = union of three signals, deduped, capped by a token budget:**
1. **Embedding-relevance** — every item is embedded once at ingestion (`sentence-transformers`, e.g. `all-mpnet-base-v2` for quality or `all-MiniLM-L6` for speed) and stored in `pgvector` (a Postgres extension that indexes vectors and does fast nearest-neighbour search via HNSW). At attack time we run **one query per attribute** (e.g., a location-flavoured query, an occupation-flavoured query) and take the top matches for each — so attribute-specific signal isn't crowded out by a single global query.
2. **Recency** — the most recent N items, regardless of relevance (recent life ≠ what reads as "relevant").
3. **Always-include heuristics** — items flagged by Presidio or simple rules as carrying explicit location/identity/employer tokens; these are high-value and must never be ranked out.

**Recall-first sizing:** k is set generously; the union is then **capped by the per-run token budget** (`llm-gateway.md`). When the footprint is smaller than the budget, the cap never binds → the whole footprint passes through. When it's larger, we keep the highest-signal union under budget.

**Parameters to finalize empirically** (per the `feasibility-and-cost.md` options-matrix, measured on a SynthPAI slice — metric: *recall of known signal-bearing items*): per-attribute k, recency N, token budget, embedding model. The doc fixes the *requirement* (high recall on implicit signals); implementation fixes the numbers.

---

## 4. The Profiler — joint pass (the capable-LLM slot)

**One LLM call** — the full retrieved set as context — infers **all 8 attributes at once**, and by default that call is **repeated as a small self-consistency ensemble** (N≈3, below). This is the only genuinely capable-model step in the text path (dev: Ollama 27–32B; cited runs: frontier — `feasibility-and-cost.md`). It goes through the gateway's `instructor` wrapper and emits the **emission-layer `RawAttributeGuess[]`** of `output-schema.md` §9.

**Behaviour the prompt must enforce** (verbatim contract in `prompts/attack-text.md`):
- **Reason, then answer.** For each attribute, free-text reasoning *before* committing a value — chain-of-thought before the structured guess measurably improves accuracy and yields the `reasoning` field. (Reasoning that reveals an Art. 9 category is scrubbed/encrypted at rest — `output-schema.md` §3, taxonomy reasoning guard.)
- **Chase the implicit signal.** Explicitly push for non-obvious inference from mundane cues (idioms, sports teams, commute references, slang, timezone-of-activity), not just literal self-statements. This is the product's core and the thing keyword filters miss.
- **Cite evidence.** Every non-abstain guess must reference the `item_id`(s) and quote the span(s) that drove it — no evidence, no guess (anti-fabrication; §6).
- **Up to 3 ranked candidates** per attribute with a 0–1 self-confidence each; cross-attribute reasoning is encouraged (knowing "senior SWE" sharpens income/education).
- **Abstain over hallucinate** — emit `status: abstained` when the signal is genuinely weak (§6).

**Self-consistency & cost controls:** by default this joint call is the unit of a **self-consistency ensemble** — run **N≈3 times at `temperature > 0`**, with the reported value = the ensemble's meaning-clustered majority and the raw confidence = the agreement fraction (`confidence-and-self-consistency.md`). A single `temperature = 0` pass (Ollama constrained to the emission JSON schema) is the **dev/fast mode** only, not the cited/production signal. **Prompt-cache** the large shared system prompt across the N runs (`llm-gateway.md`); the whole step is bounded by the per-run token/cost budget.

---

## 5. Targeted escalation (the "joint, then focus" half of the decision)

After the joint pass, re-run **only** the attributes that warrant it — never the whole profile (cost lever: "re-attack only the affected attribute").

**Triggers:**
- **Persona high-severity** — the attributes the active persona lens ranks top: `location` for the at-risk persona, `occupation` for the job-seeker (`attributes-taxonomy.md` severity matrix). These get the deepest treatment because they carry the most risk.
- **Self-consistency disagreement** — when the N self-consistency runs (`confidence-and-self-consistency.md`) don't converge on a value.
- **Borderline confidence** — guesses near the decision boundary where a focused look could flip top-1.

**Mechanism:** a focused, attribute-specific prompt over an attribute-specific high-recall retrieval (tighter, deeper k for that one attribute), with a higher self-consistency N spent only here. Output merges back as additional/updated candidates for that attribute via the Summarizer.

---

## 6. Abstention & anti-hallucination (text-specific)

Sparse or out-of-distribution footprints are where LLMs invent confident nonsense (`measure/distribution-shift.md`; the at-risk persona makes false precision actively harmful — `ethics-and-tone.md`). Guards:
- **Evidence-gated guesses** — a non-abstain candidate **must** carry ≥1 evidence item; the orchestrator validates that every cited `item_id` actually exists in the subject's set and **drops fabricated references** (a guess whose evidence all vanishes → demoted toward `abstained`).
- **Explicit abstain path** — the prompt offers `status: abstained` as a first-class, unpenalised outcome, so "no signal" is recorded distinctly from a forced guess (`output-schema.md` §3).
- **Disagreement → abstain** — strong self-consistency disagreement downgrades a guess to abstained rather than surfacing a coin-flip.
- **Presidio is annotation, not a gate** — explicit-PII detection runs alongside to *enrich* always-include and to power the deterministic side of the dashboard, but it **never** narrows what the Profiler reads (narrowing to explicit PII would destroy the implicit-inference value).

---

## 7. Where it sits & what it emits

- **Run lifecycle:** executes inside the **attack worker** (`workers/attack.py`, async via the Redis queue) for one subject; writes `inferences` + `run_metrics` (`CLAUDE.md` stage table). Content is decrypted in-memory only.
- **Emits:** `RawAttributeGuess[]` → normalized to canonical `AttributeGuess[]` (`output-schema.md`), tagged `modality: "text"`, carrying `engine_version` (the calibration pin).
- **Consumed by measure:** on SynthPAI the same pass produces the benchmark predictions; on user data it produces findings whose raw confidence is calibrated downstream (never shown bare).

---

## 8. Failure modes & resilience
- **Empty retrieval** (no items / all dropped) → all-attribute `abstained`, run completes honestly.
- **Normalization miss** (e.g., GeoNames can't resolve a place) → drop that candidate; if it empties an attribute, that attribute is `abstained` (`output-schema.md` §6).
- **Invalid JSON from the model** → gateway bounded repair-retry (N≈2), then mark the step `failed` — never an infinite loop (`llm-gateway.md`).
- **Budget exceeded mid-run** → the per-run cap aborts before a runaway; partial results are marked incomplete, not silently presented as full.

---

## 9. Cross-references (reconciliations ✓ applied)
- **`overview.md`** — ✓ done: the agent scheme is labelled as *our adaptation* (AutoProfiler's actual agents are Strategist/Retriever/Extractor/Summarizer, no Tagger), and "license verification pending" was replaced with "no LICENSE → method-only reuse, no code copied."
- **`research-sources.md`** — ✓ done (v2): AutoProfiler (`zealscott/AutoProfiler`, 2505.12402, ACL 2026) + Staab/`eth-sri/llmprivacy` (2310.07298) are both listed as the attack references.
- **`prompts/attack-text.md`** — owns the verbatim system/user prompt that operationalizes §4 (reason→guess, implicit-signal push, evidence-citation, abstain option) and emits the `output-schema.md` emission shape.

## 10. Open parameters (finalize during implementation, per `feasibility-and-cost.md` options-matrix)
Retriever per-attribute k · recency N · token budget · embedding model (`mpnet` vs `MiniLM` vs `GTE`) · self-consistency N (default ≈3) · escalation confidence threshold. Each is *measured, then fixed* — and because they define the engine, a change to any of them re-triggers benchmarking + calibration.
