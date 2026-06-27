# Product — Overview

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `archive/product-spec.md` (the flat source this subtree splits), `CLAUDE.md` (locked decisions), `04-ai-engine/*` (the engine it summarizes)
> - **Consumed by:** the rest of `01-product/*` (which elaborate each section), and every downstream subtree for product context
> - **Hard invalidations:** a change to **scope, personas, or positioning** ripples to the detail leaves below + downstream architecture/data
> - **Version:** v1 (consolidates `archive/product-spec.md` §1–2, §8–9 + locked decisions; supersedes those sections)

The entry point to the product subtree — a tight summary; each section points to its detail leaf.

## What it is
A **privacy-first web app** that runs the adversary's **attribute-inference attack on the user's *own* footprint** (text **and** images), **measures** the engine against a public benchmark so the numbers aren't circular, then helps the user **break** the inference and **proves** the result. Three stages, end to end — **Attack → Measure → Defend**.

**The signature moment:** *"home-location confidence 0.86 → 0.21 after editing 3 posts."* That single, proven before/after is the demo, the eval, and the headline metric at once.

## The problem (→ `problem-and-threat.md`)
Every consumer privacy tool operates on what you *explicitly* posted — keyword filters, typed PII, deletion. None address **inference**: what a modern LLM can *deduce* from a pile of individually-harmless posts and unremarkable, people-free photos (location, occupation, age…), at high accuracy — and which **keyword/anonymization defenses don't stop**. No consumer product shows a person what an adversary can infer about *them* and helps them break it.

## The three stages (→ `04-ai-engine/*`)
- **Attack** — infer the **8 attributes** from the user's posts/photos, each with **evidence** and a **calibrated** confidence (text: a multi-agent profiler; image: EXIF + a context-only VLM).
- **Measure** — benchmark the *engine* on **SynthPAI** (text) and **VIP + own photos** (image), and calibrate confidence → empirical reliability, so claims are grounded, not self-graded.
- **Defend** — for each high-confidence inference, suggest the **minimal** truthful edit (or remove / strip-EXIF / crop), then **re-attack with an independent adversary** and report the **proven** drop with intervals.

## Two co-primary personas (→ `personas.md`)
- **Privacy-conscious job-seeker** — professional-reputation exposure (occupation, education, controversial content).
- **At-risk individual** (journalist, activist, abuse survivor, public figure) — physical-safety doxxing vectors (location, routine, relationships, birthplace).

A **persona lens** reorders/reframes severity; all 8 attributes are always shown. The at-risk persona raises the bar on guarantees and tone.

## v1 scope (→ `scope-v1.md`, `out-of-scope-and-roadmap.md`)
**In:** multimodal (text + images: deterministic EXIF/GPS **and** VLM visual inference); **self-audit only** (subject = the consenting signed-in user, on data they own); ingestion via upload/own-export **+ live read-only connectors** (Reddit, Mastodon; **X upload-first**); **advise-only** defense (the product never edits or deletes on any platform). **Out:** exec/brand multi-subject monitoring, on-platform actions, continuous monitoring — all roadmap.

## Positioning (→ `positioning.md`)
**Complement to redact, not a competitor** — redact *deletes*; we're the **targeting brain** that says *what* to remove (the non-obvious items keyword filters miss) and proves anonymization alone doesn't stop inference. **Opposite of Whitebridge.ai**, which profiles *other* people for background checks — we are self-audit, with a benchmark and a defense loop neither competitor has.

## Trust posture (→ `08-security-privacy/*`)
Self-audit only; own-data (third-party content dropped at ingestion); **encrypted at rest** (per-user DEK, **crypto-shred** on erasure); **explicit consent** incl. Art. 9 before any run; the cloud LLM/VLM is a documented **sub-processor**; **advise-only** and **never implies false safety** (copies others already made can't be recalled).

## Success in one line (→ `success-metrics.md`)
A **live URL** a recruiter/redact can click, a written **self-audit case study** (real before/after), and a credible **SynthPAI benchmark number** — the proof the loop works.
