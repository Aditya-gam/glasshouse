# ADR 0001 — Cloud backend (not local-only)

**Status:** Accepted (v1)

**Context.** The product needs a clickable **live demo URL** (a core success metric, for recruiters/redact), multi-tenant sign-up, and server-side model orchestration.

**Decision.** A **cloud, service-oriented backend** (FastAPI + managed Postgres/Redis), not a local/desktop app.

**Rationale.** A shareable live URL and multi-tenant audits require hosting; the heavy model work runs server-side through the gateway. A local-only app (redact's on-device model) gives neither a demo URL nor multi-tenant.

**Alternatives rejected.** Local/desktop (no live URL, no multi-tenancy).

**Consequences.** A fixed hosting bill; the cloud LLM/VLM as a sub-processor; encryption + RLS required for multi-tenant data.
