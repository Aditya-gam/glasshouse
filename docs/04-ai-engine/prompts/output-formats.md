# Prompts — Output Formats (the structured-output contract)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `prompts/conventions.md` (the protocol it operationalizes), `attack/output-schema.md` (the emission + canonical shape and Pydantic models — the source of truth), `llm-gateway.md` (`instructor`, provider JSON, Ollama `format`, repair-retry), `attributes-taxonomy.md` (Art. 9 reasoning guard)
> - **Consumed by:** `prompts/attack-text.md`, `attack-image.md`, `anonymize-text.md`, `adversary-judge.md` (each specifies its schema instance and inherits these mechanics), `05-backend/modules/llm-gateway.md`
> - **Hard invalidations:** changing the **emission shape** → update `output-schema.md` + the `instructor` models + re-validate every prompt; a change that affects parsed values feeds the taxonomy→calibration coupling.
> - **Version:** v1

The **prompt-side** half of the structured-output story: how a prompt's `<output_format>` section asks for output, and how the gateway *guarantees* valid, schema-matching JSON. It does **not** redefine the data shape — that's `output-schema.md`; this is the wording + enforcement that produces it.

## What the model emits
The **emission** schema (`output-schema.md` §9 — `RawAttributeGuess`, flat and permissive). The deterministic normalizer turns it into the canonical object afterward. The prompt targets the *emission* shape only — never the canonical typed shape (keeping the model's job shallow, per the flat-schema rule).

---

## 1. The `<output_format>` section (every contract fills this)
```xml
<output_format>
  Return ONLY a JSON object matching this shape — no markdown fences, no preamble, no trailing text.
  <example>
    { "attribute": "location", "status": "inferred",
      "candidates": [ { "value_text": "Seattle, WA", "self_confidence": 0.8,
                        "evidence": [ { "ref_id": "itm_12", "quote": "…", "rationale": "…" } ] } ],
      "reasoning": "<brief justification of the top guess>" }
  </example>
  <field_notes> …one line per field: meaning + allowed values… </field_notes>
</output_format>
```
- **Include a minimal annotated example** (one attribute, not all 8) — few-shot the *format* so weaker/local models comply; it's in the shared system prompt, so **prompt-caching amortizes the tokens**.
- **Tell it what to do** ("Return ONLY a JSON object…"), not what to avoid (conventions §2).

---

## 2. Reasoning ↔ structured output (the decision: provider-thinking + field fallback)
The chain-of-thought drives accuracy, so we let the model reason **freely before committing**, while constrained decoding still guarantees the JSON:
- **Capable cloud slots with a native thinking channel** (e.g., Claude adaptive thinking): the model reasons in the **thinking channel first**, then emits the structured JSON; the schema's `reasoning` field carries a **brief justification** of the top guess.
- **Local models / providers without a thinking channel:** reasoning **is** the `reasoning` field, in a single `instructor` call.
- Either way the **`reasoning` field is always populated** (for the dashboard + audit), with **no extra calls** — the gateway abstracts the provider difference.
- **Art. 9 guard:** a `reasoning` value revealing an Art. 9 category is scrubbed/encrypted at rest (`attributes-taxonomy.md`).

This avoids the 2× cost of an explicit two-phase reason-then-format flow while keeping free-form reasoning quality where it matters most.

---

## 3. Enforcement (consolidated from `llm-gateway.md`)
Defense-in-depth so malformed output never reaches `measure`:
1. **Constrained decoding where available** — Claude/OpenAI **structured outputs**, Ollama **`format=<json-schema>`** (the full schema, not bare `format=json`; temp=0). Guarantees *syntactic* validity at decode time.
2. **`instructor` validation** — wraps the OpenAI-compatible client (pointed at the proxy) and validates the response into the **emission Pydantic model** universally, including providers without constrained decoding.
3. **Bounded repair-retry (N≈2)** — on validation failure, re-prompt with the error; after N, mark the run step **`failed`** (never loop — cost + reliability).
4. **Parsing hygiene** — strip markdown fences / preamble / trailing prose before validation (providers vary).

Flat schema throughout (deep nesting breaks both constrained decoders and prompt-guided models — the reason `output-schema.md` is two-layer).

---

## 4. Provider portability
One **provider-agnostic** emission schema; the gateway adapts enforcement per slot:

| Provider | Constrained mode | Thinking | Notes |
|---|---|---|---|
| Claude (capable slots) | Structured Outputs | adaptive thinking | **prefill deprecated** → use Structured Outputs |
| OpenAI-compatible | Structured Outputs / function-calling | reasoning models | JSON-schema enforced |
| Gemini | JSON mode / schema | thinking variants | VLM slot too |
| Ollama (local) | `format=<schema>` constrained decode | none → field fallback (§2) | temp=0 canonical |

Lowest-common-denominator rule: the schema stays expressible everywhere — **flat, standard JSON types, enums as string literals** (so a single contract serves all slots).

---

## 5. Per-contract instances (this doc owns the *mechanics*; each contract owns its *schema*)
- **`attack-text` / `attack-image`** → `RawAttributeGuess[]` (emission); image adds `region` bbox, `modality:"image"`.
- **`anonymize-text`** → the edit-suggestion shape (rewrite/remove + edited text/diff + which spans).
- **`adversary-judge`** → the verdict shape (`match ∈ {yes,no,partial}` + `level` for hierarchical; or the utility sub-scores) — order-swapped, one-criterion-per-call per `conventions.md` §4.

## 6. Failure & determinism
Validation fail → repair-retry → `failed` (recorded in `run_metrics`, no content). `temperature=0` for the canonical pass; `temp>0` only for self-consistency samples. No prompt/response bodies logged (rule 1).

## 7. Cross-references
- **`llm-gateway.md`** — ✓ reconciled: its local-structured-output line now reads `format=<emission JSON schema>` (**full JSON-schema constrained decoding**, Ollama ≥0.5.0 — the version that shipped schema-constrained `format`; 0.3.0 added tool-calling), with the `instructor` + constrained-decoding split noted here.
- **`attack/output-schema.md`** — remains the single source of truth for the emission/canonical shape; this doc never re-specifies it.
- **The four prompt contracts** — inherit §§1–4; each declares only its own schema instance and field notes.

## 8. Open parameters (finalize during implementation)
In-prompt example verbosity · repair-retry N (default 2) · per-provider constrained-decoding toggles · whether to pin Structured Outputs vs instructor-only per slot.
