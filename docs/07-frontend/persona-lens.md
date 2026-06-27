# Frontend — Persona Lens

> **Depends on:** `01-product/personas.md`, `04-ai-engine/attributes-taxonomy.md` (severity matrix), `ethics-and-tone.md` · **Consumed by:** the dashboard, `components.md` · **Version:** v2 (3-way lens — reconciled with the prototype)

A soft, reversible view over the same data — **it reorders/reframes severity, never hides** (all 8 attributes always shown).

- **Three-way control, default Balanced** (the decision, reconciled with the build) — `Balanced · Job-seeker · At-risk`. **Balanced** is a safety-aware neutral that is a *first-class, labeled* option, so the user is **never forced to self-identify**. *Why:* making an at-risk user (journalist/activist/abuse-survivor) click "I'm at-risk" can be uncomfortable or unsafe; a labeled "Balanced" gives a real default with no label cost.
- **Balanced severity = `max(atrisk, jobseeker)`** per attribute, so nothing is under-weighted in the neutral view.
- **Reorder + reframe** from the taxonomy **severity matrix** — e.g. `location` leads (extreme) for at-risk, `occupation` for job-seeker; the copy reframes ("what a stalker could deduce" vs "clean up before recruiters look").
- **At-risk raises the bar** — stronger no-false-safety/no-alarmism tone, surfaces crisis resources, prefers humble reliability bands.
- The lens is **per-session, reversible, and persisted** (`localStorage`); it never changes what's computed, only what's emphasized.

**Contract:** each `AttrItem` carries `sev: { atrisk, jobseeker }` (per-persona, from the taxonomy). The UI computes `balanced = max(atrisk, jobseeker)` and orders/reframes by the active lens — `severityFor(attr, lens)` and `orderFor(lens)` (see `components.md` / `prototype-mapping.md`).
