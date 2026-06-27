# Backend — Config & Secrets

> **Depends on:** `infra-devops` rule (12-factor), `02-architecture/tech-stack.md` · **Consumed by:** every module, `09-infra-devops/*` · **Version:** v1

12-factor config; secrets never in code.

- **`pydantic-settings`** loads all config from the **environment** (DB/Redis URLs, KMS key id, Clerk keys, proxy base_url + virtual key, S3 config). Split `BaseSettings` per module.
- **Secrets in a secret manager / env injection, rotated.** The **LiteLLM Proxy holds all provider keys centrally**; the app holds only the proxy **virtual key** (budget-capped).
- **No secrets in code or VCS; never logged.** Public client config only via `NEXT_PUBLIC_*` (frontend).
- **Backing services as attached resources** — every external is a swappable URL/handle.
