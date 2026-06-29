# Architecture — Trust Boundaries

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `system-overview.md`, `archive/architecture.md`, `04-ai-engine/llm-gateway.md`, `03-data/encryption.md`
> - **Consumed by:** `08-security-privacy/threat-model.md` + `sub-processors.md` + `logging-policy.md`
> - **Hard invalidations:** adding a model backend / sub-processor or a new egress → update `sub-processors.md` + the gateway config
> - **Version:** v1 (reconciled: **+VLM sub-processor**, **+connector tokens**)

## The egress boundary
The **LiteLLM Proxy** is the **only** path that sends decrypted (in-memory) content outside the VPC — to documented sub-processors: the **cloud LLM and the cloud VLM**. It **never logs or persists** request/response bodies (only tokens/cost/latency). Images cross to the VLM **only decrypted-in-memory**, same as text. (CLAUDE.md rule 8.)

## The geocoding egress (secondary)
The **GeoNames API** (via `geopy`) is a **second, narrow egress**, used only by location-normalization (`M1.7b`): it sends an **inferred place name** (e.g. `"Seattle"`) to resolve a `{country, region, city}` hierarchy — **never user content, never identity, never tied to the subject** in the call. Lower-sensitivity than the model egress (the place name is the attack's *output*, not the subject's text), but it **is** an egress, so it is named here and in `sub-processors.md`. The geocoder sits behind a DI port, so **pgeocode / a local GeoNames dump** (zero-egress) stay drop-in if a stricter posture is wanted later. *(Decision 2026-06-28: GeoNames API chosen for coverage; logged to keep the egress inventory honest.)*

## The decryption boundary
`data_keys` sits behind a **privileged role**; the application role reaches plaintext **only** via the `SECURITY DEFINER` decrypt function, with keys passed as **bound parameters** (never string-interpolated — CLAUDE.md rules 2–3). Crypto-shred = delete the DEK.

## The network boundary
All inter-service calls stay **inside the VPC**; only the **Next.js app** and the **`/webhooks/clerk`** endpoint are public. The LiteLLM Proxy, workers, DB, Redis, and KMS are private.

## Connector tokens
Read-only OAuth tokens (Reddit/Mastodon/X) are stored **encrypted** (`connected_accounts`), scoped read-only, and used only to pull the user's **own** content. Third-party-authored content is dropped at ingestion (rule 5).

## Sub-processor list
Cloud LLM · cloud VLM · **GeoNames (geocoding — inferred place names only)** · Clerk (identity) · the hosting/DB/Redis/KMS providers — enumerated in `08-security-privacy/sub-processors.md` and reflected in the DPA/privacy policy.
