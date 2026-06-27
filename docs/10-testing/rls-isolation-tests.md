# Testing — RLS Isolation

> **Depends on:** `03-data/rls-policies.md`, `.claude/rules/security-privacy.md` · **Version:** v1

Tenant isolation is a **security property** — test it, don't hope.

- For **every owned table** (`items`, `media_assets`, `connected_accounts`, `runs`, `inferences`+children, `remediations`, `import_sources`, `run_metrics`): set the RLS context to user A, assert **user B's rows are invisible** (read **and** write).
- Assert **fails-closed** — with no/forged GUC, queries return nothing, not everything.
- Assert `data_keys` has **no** app-readable path (only via the `SECURITY DEFINER` function).
- Assert SynthPAI profiles are read-only-shared.
- A new owned table without a matching isolation test should fail CI.
