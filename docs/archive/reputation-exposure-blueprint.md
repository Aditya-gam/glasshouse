# Reputation & Exposure Intelligence — Build Blueprint

A privacy-first, AI-powered platform that scores online content for **reputational and privacy risk**, tells you (or a business) *what* is exposed and *why*, and recommends action. Designed so one engine powers three products, and architected in the local-first style that maps to redact.dev's culture and roadmap.

---

## 1. The core idea: one engine, three front doors

Build a single **Exposure Analysis Engine** and expose it through three progressively larger products:

| Front door | Subject | When | Why it matters |
|---|---|---|---|
| **Personal Footprint Analyzer** | One individual's own social history | Weekend MVP | Closest to redact's consumer app; you can dogfood it on yourself |
| **Local Business Reputation Monitor** | A business's reviews/complaints/mentions | Extension #1 | Your original "multi-source reputation ops" idea |
| **Executive / Brand Exposure Monitor** | A company + its key people | Extension #2 | Maps to redact's *enterprise* product (exec protection, data-broker monitoring) |

All three share the same pipeline. You only swap the **ingestion adapters** and the **dashboard views**.

---

## 2. Tech stack (reuses your existing strengths)

- **Frontend:** Next.js (dashboard + streaming progress UI)
- **Backend:** FastAPI (Python), background workers for ingestion + analysis
- **DB:** PostgreSQL + **pgvector** (semantic clustering / similarity)
- **AI:**
  - **PII / entity detection:** Microsoft **Presidio** or spaCy — runs *locally*, no API call, no data leaving the box
  - **Risk scoring + reasoning:** an LLM (e.g., Claude via the Anthropic API) with structured JSON output
  - **Embeddings:** for clustering and "find similar exposed items"
- **Deploy:** Vercel (frontend) + Railway / Render / Fly.io (backend + Postgres) → a live URL

### Privacy-first architecture (the redact.dev culture signal — do this deliberately)
- **Bring-your-own-data:** primary input is the user's own platform export, not server-side scraping.
- **No server-side storage of raw content:** analyze in-memory / ephemeral; persist only derived risk metadata + (optionally) a *local* archive the user controls.
- **Local-first option:** the PII pass runs locally; document this explicitly in your README. A privacy company reads this as "this person thinks like us."

---

## 3. The shared AI core (the reusable engine)

Pipeline, identical across all three products:

1. **Ingest** → normalize every input into a common `item`: `{source, author, timestamp, text, media_url, permalink}`.
2. **PII / entity detection** (local, Presidio/spaCy) → flag emails, phones, addresses, full names, geolocation, employer, family mentions. These are *doxxing vectors*.
3. **Risk scoring** (LLM) → for each item, score 0–100 across dimensions and return structured JSON:
   - `pii_exposure` (does it leak identity/location?)
   - `professional_risk` ("would a recruiter flag this without context?")
   - `controversy` (inflammatory / embarrassing / reputationally volatile)
   - `sentiment`
   - plus `reason` (one sentence) and `recommended_action` (`delete` / `archive` / `opt_out` / `respond` / `keep`)
4. **Clustering** (pgvector embeddings) → group related items to surface *systemic* issues or *coordinated* campaigns (key for the business/exec versions).
5. **Recommendation + prioritization** → rank by severity so the user fixes the worst 5% first.
6. **Instrument everything** (see §4).

---

## 4. The instrument → optimize loop (your differentiator)

This is the part 95% of portfolio projects skip. It's what makes you read as an *AI Engineer*, not a prompt-caller.

**Log per item:** model used, tokens, latency, cost, predicted risk, model confidence.

**Eval harness:** hand-label ~100–200 items as a gold set → measure **precision / recall / F1** on risk classification and PII detection.

**Dashboard surfaces:**
- Risk distribution + top-risk items
- Cost per run, p50/p95 latency per step
- **Failure taxonomy:** where false positives/negatives cluster (e.g., "sarcasm flagged as controversy")

**You act, then re-measure:**
- Prompt tuning against the gold set
- **Model routing:** cheap model for clearly-low-risk items, strong model only for ambiguous ones
- Semantic caching, threshold tuning
- Dashboard shows **before/after** → these become your résumé numbers

> The whole point: every claim on your résumé is backed by a number your own dashboard produced.

---

## 5. Data sources (no government data; realistic access)

**Personal Analyzer — primary path (recommended):**
- **Your own data exports** — X/Twitter archive, Reddit "request my data," Google Takeout, LinkedIn export. Zero API friction, real data today, privacy-aligned. This is also the most honest demo: run it on *your* 5 years of history.
- **Reddit API free tier** — non-commercial, ~60–100 req/min, fine for modest live pulls in a portfolio context. (Commercial use requires a contract, so keep this non-commercial.)
- **HaveIBeenPwned API** — breach/credential exposure for an email/handle (low-cost key; verify current pricing).
- **Public GitHub** — scan public repos/commits for leaked secrets/PII (GitHub API has a generous free tier; trufflehog-style detection). A real, under-appreciated exposure vector — and redact supports GitHub deletion.
- **Public people-search / data-broker listing pages** — scrapable for a demo to show "here's what's already public about you" (respect ToS + rate limits; in a real product you'd use opt-out flows, as redact does).

**Business Monitor — add:**
- Public reviews (Google/Yelp via export or scraper — verify ToS), **BBB** and **state Attorney General** complaint pages.
- **CFPB Consumer Complaint Database** (free, no key, 13.8M+ complaints with narratives) if you target regulated businesses — great for a rich-text demo.

**Ethics note (also a maturity signal to a privacy company):** prefer official APIs and user-owned exports, respect rate limits, never persist others' raw content server-side. Put this in the README.

---

## 6. Weekend deployable slice — Personal Analyzer (hour-by-hour)

~16–18 focused hours. Goal: a **live URL** that ingests your own export, scores it, shows a dashboard, and reports real eval numbers.

- **0:00–2:00** — Scaffold: Next.js + FastAPI + Postgres/pgvector (Docker Compose), repo, env, CI-less but clean.
- **2:00–4:00** — Ingestion: upload your X/Reddit export → parse → normalize → store `items`.
- **4:00–7:00** — AI core v1: local PII pass (Presidio) + one LLM risk-scoring call per item returning structured JSON.
- **7:00–9:00** — Dashboard v1: risk distribution chart, top-risk list, item detail (reason + recommended action).
- **9:00–11:00** — Hand-label ~100 items → eval harness → first precision/recall/F1.
- **11:00–13:00** — Optimize pass: tune prompt + add model routing → re-measure → **capture before/after**.
- **13:00–15:00** — Instrumentation panel: cost/latency/token tracking + failure taxonomy.
- **15:00–17:00** — Polish + deploy (Vercel + backend host) → live URL.
- **Buffer** — README: architecture diagram, the privacy-first design rationale, and your before/after numbers.

---

## 7. Starter schema (Postgres)

```sql
-- raw, normalized content (personal: your data; business: public mentions)
items (
  id, source, author, created_at, text, media_url, permalink,
  embedding vector(1536), ingested_at
)

-- detected PII / doxxing vectors (from local Presidio pass)
entities (
  id, item_id -> items.id, type, value_redacted, confidence, char_span
)

-- LLM risk output, one row per item per model run
risk_scores (
  id, item_id, model, pii_exposure, professional_risk,
  controversy, sentiment, severity, reason, recommended_action,
  confidence, created_at
)

-- semantic groupings (systemic issues / coordinated campaigns)
clusters ( id, label, summary, size )
cluster_items ( cluster_id, item_id )

-- evaluation
eval_labels ( item_id, human_severity, human_action, labeled_by, labeled_at )

-- instrumentation (powers the optimize dashboard)
run_metrics (
  id, item_id, model, prompt_tokens, completion_tokens,
  latency_ms, cost_usd, created_at
)
```

---

## 8. Extension path

- **Local Business Monitor:** swap ingestion adapters to multi-source review/complaint pulls; reuse the same core; add a competitive-benchmark view and a systemic-issue cluster view.
- **Executive / Brand Exposure:** add breach (HIBP) + data-broker listing + impersonation-account detection; add an audit trail and a multi-person dashboard. This is the redact.dev *enterprise-shaped* version (exec protection, compliance, removal tracking).

---

## 9. redact.dev positioning (how to actually get noticed)

1. Build the **Personal Analyzer**, run it on your own footprint, screenshot the dashboard and the "what keyword filters miss" findings.
2. Outreach framing: *"I built the AI risk-scoring layer that sits on top of bulk deletion — it tells you which posts are actually risky and why, instead of relying on keyword filters. It's local-first, and I ran it on my own 5 years of Reddit/X history. Here's what it flagged."*
3. Lean on the **local-first architecture** as culture fit, and the clean ethics (own-data, official APIs, rate-limit respect) as engineering maturity.
4. This doubles as a feature-shaped portfolio piece *and* a "hire me" artifact — far stronger than a cold application.

---

## 10. Résumé bullets (fill in numbers after the eval)

- **Personal:** "Built and deployed a privacy-first, local-first AI tool that scores a user's social history for reputational and privacy risk; risk-classification F1 ___% on a hand-labeled set, with a footprint-risk dashboard and cost/latency instrumentation."
- **Business:** "Extended the engine into a multi-source business reputation monitor (reviews + complaints + mentions) with semantic clustering to surface systemic issues; categorization accuracy ___%."
- **Engineering craft (the rare one):** "Designed an eval harness + observability dashboard that drove a ___% cost-per-run reduction at equal classification quality via model routing and prompt tuning."
