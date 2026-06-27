# Infra — Infrastructure as Code (Terraform)

> **Depends on:** `infrastructure.md`, `decisions/0010-hosting-stack.md`, `secrets-management.md` · **Consumed by:** `ci-cd.md` · **Version:** v1

**Terraform** codifies the cloud resources (the decision); deploy of the app **containers** rides Railway's GitHub integration (config-as-code, not Terraform).

## What Terraform owns
- **Neon** (official provider) — project, branches (a `prod` branch + a preview template), **roles** (the least-privilege app role; the privileged decrypt-owner role for the `SECURITY DEFINER` function), databases, and `pgvector`/`pgcrypto` enablement.
- **Cloudflare R2** (Cloudflare provider) — the private bucket(s), lifecycle/versioning rules, scoped access keys (as outputs → secret store).
- **KMS** (AWS/GCP provider) — the master key + key policy (the app may `Encrypt`/`Decrypt`-wrap only; **no key export**).
- **Vercel** (provider) — project + env wiring + domains.
- **DNS / TLS** (Cloudflare) — records, certs.

## What is NOT Terraform (the honest boundary)
- **Railway services** — Railway's Terraform support is thin, so the API/worker/Proxy/Redis are defined by committed **Dockerfiles + `railway.json`/service config** and deployed via Railway's **GitHub integration** (push-to-deploy).
- **App schema** — owned by **Alembic** migrations, never Terraform (`migrations.md`); Terraform creates the database + roles, Alembic creates the tables.

## Conventions
- **Remote state with locking** (Terraform Cloud, or an S3/R2-backed backend) — **never** local state.
- **Per-environment workspaces** (`dev`/`staging`/`prod`); no secrets in `.tf` — values come from the secret store / TF variables (`secrets-management.md`).
- **`plan` on PR, `apply` on merge** (gated) — wired in `ci-cd.md`.
- Provider versions **pinned**; one module per resource group; outputs feed the app's env (DB URL, R2 keys, KMS key id).
