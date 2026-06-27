# Defend — Attribution by Ablation (the causal "which edits")

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `defend/independent-adversary.md` (the adversary it ablates against), `defend/noise-floor-and-variance.md` (gating + the final paired-bootstrap), `attack/evidence-attribution.md` (the proxy ranking / top-k suspects + the `marginal_effect` slot), `attack/output-schema.md` (the field), `attack/confidence-and-self-consistency.md` (the meaning-clustering it reuses), `feasibility-and-cost.md` (scope/cost levers)
> - **Consumed by:** `defend/text-remediation.md` + `image-remediation.md` (the edit target), `07-frontend/user-flows/attribution.md` + `defend-simulation.md`, `03-data/database/tables/remediations.md`
> - **Hard invalidations:** the result is pinned to the **adversary `engine_version` + noise-floor version**; a stale adversary or floor → re-run. Changing the **ablation method** changes the attribution.
> - **Version:** v1

The **causal** counterpart to the attack-side proxy: it measures which items *actually* drive the inference (not just which the model claimed), fills `marginal_effect`, and produces the actionable **"edit these N posts"** minimal set — the target deferred from `evidence-attribution.md`. Everything is measured against the **independent adversary**, gated by the **noise floor**.

## The crux: redundancy breaks leave-one-out
If two posts *each independently* pin your city, removing either alone changes nothing, so naive leave-one-out (LOO) scores **both ~0** and reports "nothing to edit" — missing the "six boring posts together" case that is the product's whole point. The literature confirms LOO "lacks robustness." The fix is **clustering redundant items + a greedy minimal-sufficient-subset search**.

---

## 1. The method (the decision)
Operates on the **original** content (to *find* the target; the before/after later *validates* it), against the single independent adversary, **affected attribute only**.

1. **Scope** — take the **top-k** proxy-ranked suspect items (`evidence-attribution.md`), not the whole footprint.
2. **Cluster redundancy** — group semantically-redundant suspects using the **meaning-clustering reused from self-consistency**, so two posts that each independently pin the city become **one "cause" cluster** (and both end up flagged). This is the cheap, built-in version of Cluster-Shapley's idea.
3. **Greedy minimal-sufficient-subset search** — greedily remove the cluster/item whose removal most drops the adversary (cheap **N=1 probes**, below), continuing until the adversary can **no longer recover** the value (out of top-3). Then **prune**: add any removed item back if recovery stays broken without it. What remains is the **subset-minimal** removal set = the "edit these N posts" target. Linear in k, not exponential.
4. **Confirm** — on that final minimal set's before/after, run the **full N self-consistency + paired bootstrap vs the noise floor** (`noise-floor-and-variance.md`) for the rigorous significance claim.

`marginal_effect` per item/cluster = the calibrated confidence-drop attributed at its removal step, **gated by the floor** (a drop within noise → not attributable, recorded ~0).

---

## 2. Probe cost (the decision)
- **Search = cheap N=1 probes.** Each "is this subset still recoverable?" check is a **single** adversary pass — just enough to navigate by the point estimate. The search runs many probes, so a full ensemble each time would multiply the dominant cost by N for little gain.
- **Final = full rigor.** Only the **one** candidate-minimal-set before/after gets the full N self-consistency + bootstrap. Cheap navigation, one rigorous claim.
- Cost is therefore **linear in k** (top-k scoped) × cheap probes, plus one full-N final check — keeping the "cost bomb" defused.

---

## 3. Outputs
- **`marginal_effect`** filled per evidence item (causal Δ, floor-gated) — non-zero for the minimal-set members, ~0/within-noise for the rest.
- **The minimal sufficient set** = the actionable "edit these N" target → drives `text-remediation`/`image-remediation` and the dashboard ("edit these 3 to break it").
- **Proxy↔ablation agreement** — compare the attack-side `proxy_score` ranking to this causal result; report agreement (validates the cheap proxy, flags when it misled, e.g., when it under-ranked an implicit cue).

---

## 4. The collective story, told honestly
The minimal set **is** the "six boring posts together" proof: we surface the **group** effect (none alone may matter, but the set is sufficient), never misleading per-item zeros. Redundancy clustering ensures **both** redundant pins are flagged (you must edit both to break it). We never assert a per-item cause whose effect is within noise.

---

## 5. Relationship to remediation (find vs prove)
- **Ablation FINDS** the target (the minimal set, on the original content).
- **The before/after PROVES** it: after the user edits, `independent-adversary.md` + `noise-floor-and-variance.md` measure the actual, significant drop and the value-recovery flip.
- Re-attack/ablate **only the affected attribute** (cost lever).

---

## 6. Failure modes
- **No sufficient subset within top-k** (removing all top-k still doesn't break recovery) → expand k once, else report honestly: *"no small edit breaks this — the signal is spread across your footprint,"* which is itself a true, useful finding (cheap remediation may be impossible for that attribute).
- **All probes within noise** → no attributable items; report "couldn't localize a cause," don't fabricate one.
- **Proxy badly disagrees with ablation** → flag the proxy as unreliable for that attribute/modality (lean on ablation + model citations).

## 7. Cross-references
- **`attack/evidence-attribution.md` + `output-schema.md`** — `marginal_effect` is filled here; the **proxy↔ablation agreement** is the validation metric promised there.
- **`defend/text-remediation.md` + `image-remediation.md`** — consume the **minimal sufficient set** as the edit target.
- **`feasibility-and-cost.md`** — its attribution row ("embedding-proximity proxy → top-k ablation → full leave-one-out") should name the chosen method: **greedy minimal-sufficient-subset + redundancy clustering, cheap N=1 probes + full-N final**, with Cluster-Shapley as the roadmap high-assurance option. Update when revisited.
- **`07-frontend/user-flows/attribution.md` + `defend-simulation.md`** — render the minimal set, the collective framing, and proxy ("likely") vs ablation ("proven").

## 8. Open parameters (finalize during implementation)
top-k suspects · recovery threshold (top-3, from `independent-adversary.md`) · greedy granularity (item vs cluster) · redundancy-cluster similarity threshold · max ablation-run cap (hard cost ceiling).
