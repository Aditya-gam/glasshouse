# Infra — Secrets Management

> **Depends on:** `05-backend/config-and-secrets.md`, `.claude/rules/security-privacy.md` · **Version:** v1

- **All secrets in Railway's secret store / Vercel env / the Terraform variable store** — Neon DB URL, Redis URL, **R2** access keys, KMS key id, Clerk keys, the LiteLLM Proxy virtual key. **Never in code or VCS.**
- **Terraform** reads provider creds from the secret store and **writes resource outputs** (DB URL, R2 keys, KMS key id) back to it — nothing hardcoded in `.tf` (`iac.md`).
- **Provider keys live centrally in the LiteLLM Proxy** (config-as-secret); the app holds only the proxy **virtual key** (budget-capped per env: a tiny `dev` cap, a separate `cited-benchmark` cap).
- **Rotation** — rotate KMS master + provider keys; the proxy is the single place to rotate model-provider creds.
- **Least privilege** — each service's credentials grant only what it needs (the app DB role can't read `data_keys`).
- **Never logged** (logging-policy).
