# Product — Scope (v1)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `archive/product-spec.md` §5, `CLAUDE.md` (locked decisions), `overview.md`
> - **Consumed by:** `out-of-scope-and-roadmap.md`, and every downstream subtree (architecture, data, api, frontend, security)
> - **Hard invalidations:** a scope change ripples widely — the `Product scope` row in `00-traceability.md`
> - **Version:** v1

## In v1
- **Modalities:** text **and** images — deterministic **EXIF/GPS** extraction *and* **VLM visual inference** (which survives EXIF stripping).
- **Subject:** **self-audit only** — the consenting signed-in user, on data they own. Third-party-authored content is **dropped at ingestion**.
- **Ingestion:** upload / own-export (universal) **+ live read-only connectors** — **Reddit** (free API), **Mastodon** (open API); **X = upload-first** (live pull needs X's paid tier).
- **Defense:** **advise-only** — suggest rewrite / remove / strip-EXIF / crop-or-blur; the product **never edits or deletes** on any platform.
- **The full Attack → Measure → Defend loop**, the attribution + defend-simulation dashboard, multi-tenant sign-up (anyone audits their own data).

## Out of v1 (→ `out-of-scope-and-roadmap.md`)
Exec/brand **multi-subject** monitoring · any **on-platform actions** (deletion/editing — redact's domain) · **continuous monitoring / alerting** on new exposure.

Locked technical decisions (backend, auth, encryption, async, gateway) → `CLAUDE.md`.
