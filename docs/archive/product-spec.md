# Product Specification — Inference Exposure Auditor (v1)

> ⚠️ **SUPERSEDED / ARCHIVED.** Split into and replaced by the granular tree — see `01-product/*` (authoritative). Its §10 "open items" pointers (`prompt-spec.md`, `data-ingestion-spec.md`, `security.md`, `eval-and-metrics.md`) are **historical names** now realized under `04-ai-engine/prompts/*`, `03-data/ingestion/*`, `08-security-privacy/*`, and `04-ai-engine/measure/*`. Kept for historical provenance only; **do not build from this file.** Migration map: `00-index.md`.

## 1. Problem
Every consumer privacy tool — including redact — operates on content a person *explicitly* posted: keyword filters, typed PII, deletion. None address **inference**: what a modern LLM can *deduce* about someone from a pile of individually-harmless posts and unremarkable photos. Research shows this attack infers attributes like location, occupation, and age from ordinary Reddit text at high accuracy, and from photos with no people in them — and that keyword/anonymization defenses do **not** stop it. There is no consumer product that shows a person what an adversary can infer about *them* and helps them break it.

## 2. What it is
A privacy-first web app that runs the adversary's **attribute-inference attack on the user's own footprint** (text + images), **measures** it, then helps the user **break** the inference and proves the result.

**Core loop — Attack → Measure → Defend:**
1. **Attack** — infer the 8 attributes from the user's own posts/photos, with evidence and confidence.
2. **Measure** — score the engine against the synthetic **SynthPAI** benchmark (text) and a labeled image set (images), so accuracy claims are grounded, not circular.
3. **Defend** — for each high-confidence inference, suggest the minimal rewrite (text) or remove/strip-EXIF/crop (image), then **re-run the attack** and show the confidence drop.

The signature moment: *"home-location confidence 0.86 → 0.21 after editing 3 posts."*

## 3. Target users (two co-primary personas)
| Persona | Cares most about | Framing | Leads dashboard with |
|---|---|---|---|
| **Privacy-conscious job-seeker** | Professional-reputation exposure | "Clean up before recruiters look" | occupation, employer, education, controversial-content risk |
| **At-risk individual** (journalist, activist, abuse survivor, public figure) | Physical-safety doxxing vectors | "What a stalker or hostile party can deduce" | location, routine/timezone, relationships, place of birth |

The dashboard surfaces all 8 attributes but offers a **persona lens** that reorders and reframes severity (reputation-first vs. safety-first). The at-risk persona raises the bar on privacy guarantees and on tone.

### Tone & ethics rules (esp. for at-risk users)
- Inform without alarmism; never induce panic.
- Never imply false safety after remediation — deletion cannot recall copies others already made (screenshots, archives, reposts). State this honestly.
- The tool must never itself become an exposure: advise-only, own-data, encrypted, crypto-shreddable.

## 4. The 8 attributes
age · sex · location (current) · place of birth · occupation · education · relationship status · income. Special-category attributes (e.g., sex) are flagged, encrypted, and gated behind explicit consent.

## 5. v1 scope

### In
- **Modalities:** text **and** images.
  - Text: LLM attribute inference.
  - Images: two layers — deterministic **EXIF/GPS metadata** extraction, plus **VLM visual inference** (geolocation/attributes even after EXIF is stripped).
- **Subject:** personal self-audit only — the single subject is the signed-in user, on data they own.
- **Ingestion:** upload/own-export (universal) **+ live connectors** (read-only OAuth into the user's own accounts):
  - **Reddit** — free API, live pull.
  - **Mastodon** — open API, live pull.
  - **X** — **live pull requires X's paid API tier**; the **X archive upload** is the no-cost path. (Spec assumes upload-first for X unless the user provisions paid access.)
- **Defense:** **advise-only.** Text → rewrite suggestion or remove flag. Image → remove / strip-EXIF / crop-or-blur advice. The product **never writes to or deletes from** any platform.
- **Full attack→measure→defend loop**, the attribution + simulation dashboard, multi-tenant sign-up (anyone audits their own data).

### Out (roadmap)
- Exec/brand **multi-subject** monitoring (the enterprise extension; maps to redact's exec-protection product).
- Any **on-platform actions** (deletion/editing) — that's redact's domain; we complement it.
- Continuous monitoring / alerting on new exposure.

## 6. Distribution & business model
- **Primary distribution:** portfolio piece + targeted outreach to redact.dev (a feature-shaped "hire me" artifact). Dogfood on the builder's own footprint; lead outreach with the SynthPAI benchmark number + a self-audit before/after.
- **Plausible model (noted, not built in v1):** free self-audit on your own data; paid continuous monitoring; org tier for exec/brand protection.

## 7. Success metrics
**Technical (provable):**
- Text inference **top-1 / top-3 accuracy** on SynthPAI — establish a baseline on the first eval run, then improve (CI floor prevents regressions).
- Image inference accuracy on the **eth-sri image dataset + the builder's own labeled photos**.
- Defense effectiveness: **median confidence drop** on targeted attributes after remediation.
- Latency and cost per audit.

**Project (the real point):**
- A **live URL** a recruiter/redact can click.
- A written **self-audit case study** (before/after on real personal data).
- The **redact outreach** artifact.

## 8. Positioning
- **Complement to redact, not a competitor.** redact deletes content and removes you from data brokers; this is the **targeting brain** that tells you *what* to remove — specifically the non-obvious items keyword filters miss — and demonstrates that anonymization alone doesn't stop inference.
- **Nearest neighbor:** Whitebridge.ai (an AI "online reputation report"), but it profiles *other* people for background/verification — the opposite ethical posture from a self-audit, and it has no benchmark or defense loop.
- **Not** a deletion tool, **not** a people-search/OSINT tool, **not** a social-media manager.

## 9. Privacy & trust posture (product-level)
- Self-audit only; subject = the consenting signed-in user.
- Own-data: upload or read-only OAuth into the user's own accounts; third-party content dropped at ingestion.
- Encrypted at rest (per-user DEK); **crypto-shred** on erasure; explicit consent (incl. Art. 9) before any run.
- Cloud LLM/VLM is a documented sub-processor; content is never logged or persisted by the gateway.

## 10. Open items pushed to later docs
- Exact attribute definitions, allowed values, and matching rules → `attributes-taxonomy.md`.
- Concrete attack/eval/defense prompt contracts → `prompt-spec.md`.
- Connector OAuth scopes + token storage → `data-ingestion-spec.md` + `security.md`.
- Image-eval dataset specifics + floors → `eval-and-metrics.md`.
```
