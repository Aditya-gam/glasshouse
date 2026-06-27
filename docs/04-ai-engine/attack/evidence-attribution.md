# Attack — Evidence Attribution (the "why")

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `attack/output-schema.md` (the `evidence[]` objects it enriches), `attack/text-inference.md` + `image-inference.md` (the cited evidence), `attack/confidence-and-self-consistency.md` (citation frequency across the N runs), `feasibility-and-cost.md` (attribution options-matrix: proxy → ablation), `attributes-taxonomy.md` (Art. 9 reasoning guard)
> - **Consumed by:** `07-frontend/user-flows/attribution.md` (the "six boring posts" view), `defend/attribution-ablation.md` (causal proof; consumes the proxy + fills `marginal_effect`), `measure/per-user-scoring.md` (the "why" beside each finding), `03-data/database/tables/inferences.md` (`inference_evidence`), `05-backend/modules/services-inference.md`
> - **Hard invalidations:** none silent. Changing the proxy/attribution method changes a *displayed ranking*, not a measured number — but if the attack proxy is used to scope defend's ablation, keep them consistent (`defend/attribution-ablation.md`).
> - **Version:** v1

Which items drove each guess, and how we surface them **honestly**. This is the product's signature view — *"six individually-boring posts that together pin your home"* — and the input to the defend simulation. The hard line this doc draws: at attack time we show the model's **claim** of why, corroborated by **free** signals; the **causal proof** ("these 3 posts cause it") is `defend/attribution-ablation.md`, measured against the **independent adversary**.

## The honesty principle (why attack-side attribution is a *claim*)
LLM-stated reasoning is frequently **unfaithful** — a post-hoc rationalization that can misrepresent the true cause, with unstated biases driving the output (Turpin et al. 2023; Arcuschin et al. 2025). So the Profiler's cited evidence and rationale are **what the model says drove it**, not a proven causal account. We present them as such, add cheap corroboration, and defer causal truth to ablation. Presenting model self-attribution as proof would be exactly the self-deception `defend/overview.md` forbids.

---

## 1. The attack-side signals (all free — the decision)
Per candidate, three signals, none requiring an extra model call:

1. **Model-asserted evidence** *(primary, human-readable)* — the cited `item_id`s + `span`/`region` + `rationale` from `output-schema.md` §8. This is the readable "why," and crucially it **can flag implicit items** the proxy misses (the model can cite "the 405 again" as a location cue even though that text isn't semantically near "Los Angeles").
2. **Embedding-proximity proxy** *(ranking aid)* — cosine similarity of each item's existing embedding to the guessed value / attribute (reuses the Retriever's vectors, so **free**). Gives a per-item contribution bar for ranking and can surface items the model under-credited.
   - **Honest limitation, stated in-product:** proximity **under-ranks implicit cues** — the exact non-obvious signals that are our differentiator — because an implicit item isn't embedding-close to the inferred value. So the proxy is a **ranking aid, never the sole signal or a truth claim**; the model's citations and (later) defend's ablation cover what it misses.
3. **Self-consistency citation frequency** *(free robustness signal)* — across the N self-consistency runs (`confidence-and-self-consistency.md`), how often each item was cited for this guess. Modality-agnostic; an item cited 3/3 is a more trustworthy driver than one cited 1/3 — a partial faithfulness check at zero cost.

These combine into a per-item **attack contribution score** used to rank the evidence; the model's `rationale` is the label. **`marginal_effect` stays `null`** at attack (causal, defend-filled).

---

## 2. The collective framing — rank now, prove in defend (the decision)
The signature insight is that **no single item is damning but the set is**. At attack we:
- Show the **ranked** contributing items and the **collective** framing — "individually bland, together they pin your city."
- **Do not** compute a causal "edit these N posts" minimal set here. Identifying the **minimal sufficient set** and each item's **marginal effect** is causal and belongs to `defend/attribution-ablation.md`, done by **leave-one-out against the independent adversary** (not the attacker that made the guess). Approximating it at attack would risk showing an "edit these" target that defend later revises — and would present a proxy as if it were actionable causal truth.
- The honest attack-view message: *"these items most likely drive this guess, and collectively they pin it — the simulation will prove which edits actually break it."*

---

## 3. Image & EXIF attribution (modality specifics)
- **VLM (visual) — black-box.** Closed cloud VLMs expose no gradients, so Grad-CAM/saliency isn't available. We use the model's self-reported **region** (bbox) + `rationale` as the claim, optionally corroborated by **cheap black-box occlusion** (mask the region, re-run, see if the guess moves) — but heavy occlusion is a perturbation = leans ablation, so at attack it's light/optional; the full version is defend's. Gradient saliency (Grad-CAM/LRP) is feasible only on **local white-box VLMs** → roadmap, not v1.
- **EXIF — the one *provable* attribution.** An `exif_finding` (e.g., GPS coordinates) is a **fact in the file**, not a model claim, so its attribution is deterministic and high-trust — the cleanest "why" we have, and the thing `defend/image-remediation.md` can provably remove.

---

## 4. Validation & anti-fabrication
- **Cited IDs must exist** — references to items not in the subject's set are dropped (`text-inference.md` §6); an all-fabricated guess → `abstained`.
- **Spans must match** — validate each text `span`'s offsets against the item's actual text; on mismatch keep the `quote`, drop the offsets, flag. `region` bboxes must lie within `[0,1]`.
- **Art. 9 reasoning guard** — a `rationale` revealing an Art. 9 category is scrubbed/encrypted at rest (`attributes-taxonomy.md`, `output-schema.md` §3).

---

## 5. The boundary with defend (causal proof)
| | Attack (this doc) | Defend (`attribution-ablation.md`) |
|---|---|---|
| what | the model's **claim** + free corroboration | **causal** marginal effect |
| method | model-asserted + embedding proxy + citation frequency | leave-one-out / ContextCite-style ablation |
| against | the attacker's own output | the **independent adversary** |
| cost | ~zero (every audit) | higher (the "cost bomb" — scoped) |
| fills | `proxy_score`, `citation_frequency` | `marginal_effect` |

**Closing the loop honestly:** the attack proxy is a cheap **preview**; defend's ablation is the **proof**. The **agreement between the proxy and defend's ablation** (on a sample) is the validation metric (`feasibility-and-cost.md`) — if the proxy diverges badly for an attribute/modality, that's a flag that its ranking is unreliable there, and we lean on the model's citations + ablation instead.

---

## 6. Output, failure modes, open items
- **Output:** enriches each `evidence` object with `proxy_score` + `citation_frequency` (attack-populated; see schema reconciliation below); the ranked, labeled evidence list per candidate feeds the dashboard and seeds defend.
- **Failure modes:** missing embedding → fall back to model-asserted + citation frequency; span mismatch → quote-only; proxy unavailable for an attribute → rank by citation frequency alone, noted.
- **Open params** (tune + validate against defend ablation): proxy similarity definition, how `proxy_score` + `citation_frequency` combine into the displayed rank, whether the light image-occlusion check is on in v1.

## 7. Cross-references
- **`attack/output-schema.md` §8** — add two optional attack-populated evidence fields, **`proxy_score`** (embedding-proximity, 0–1) and **`citation_frequency`** (fraction of the N runs that cited this item), distinct from the defend-filled `marginal_effect`. (Applied now.)
- **`defend/attribution-ablation.md`** (when authored) — consumes the proxy as the cheap preview, computes causal `marginal_effect` against the **independent adversary**, and reports proxy↔ablation agreement as the validation metric.
- **`07-frontend/user-flows/attribution.md`** (when authored) — renders the ranked evidence (text spans highlighted in-item, image bboxes overlaid, EXIF field shown) and the collective "six boring posts" framing; shows attack proxy as "likely," defend ablation as "proven."
