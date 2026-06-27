# Security — Logging Policy

> **Depends on:** `05-backend/observability.md`, `.claude/rules/infra-devops.md` · **Version:** v1

The single most important leak-prevention rule, made explicit (CLAUDE.md rule 1; OWASP A09).

- **Never log:** decrypted content, prompt inputs/outputs containing user text, DEKs/keys, tokens, or any PII.
- **Do log (structured JSON):** request/run/trace/span IDs, user id (not content), service/version/env, status, and `run_metrics` (tokens/cost/latency).
- **The gateway disables request/response bodies** — only metadata leaves it.
- **`audit_log`** records consent/export/erase/connect events (non-sensitive metadata), append-only.
- Logs are event streams to stdout (12-factor); the platform aggregates. Alert on security events (A09).
