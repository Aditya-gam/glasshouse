# Product — Personas

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `archive/product-spec.md` §3, `attributes-taxonomy.md` (the severity matrix), `overview.md`
> - **Consumed by:** `07-frontend/persona-lens.md`, `attributes-taxonomy.md` (severity), `measure/*` (persona weighting), `ethics-and-tone.md`
> - **Hard invalidations:** changing the persona set → update the frontend persona-lens + severity weighting
> - **Version:** v1

Two **co-primary** personas. The dashboard always shows all 8 attributes; a **persona lens** reorders/reframes severity — it never hides.

| Persona | Cares most about | Framing | Leads with |
|---|---|---|---|
| **Privacy-conscious job-seeker** | professional-reputation exposure | "clean up before recruiters look" | occupation, employer, education, controversial-content |
| **At-risk individual** (journalist, activist, abuse survivor, public figure) | physical-safety doxxing vectors | "what a stalker or hostile party can deduce" | location, routine/timezone, relationships, birthplace |

The per-attribute, per-persona **severity matrix** is authoritative in `attributes-taxonomy.md`; the lens consumes it (e.g., `location` = *extreme* for at-risk, *moderate* for job-seeker).

**At-risk raises the bar** — stronger tone rules (no alarmism, no false safety — `ethics-and-tone.md`) and stronger guarantees (the safety claim rests on the independent-adversary proof; an adversary **panel** for location is the roadmap high-assurance mode).

**Not a v1 persona:** the exec/brand (multi-subject) protectee — the roadmap enterprise extension (`out-of-scope-and-roadmap.md`).
