# Ingestion — Third-Party Drop

> **Depends on:** `0005-self-audit-scope.md`, `storage-tiers.md` (T3) · **Consumed by:** every source adapter · **Hard invalidations:** none, but this is a **CRITICAL security rule** (rule 5) · **Version:** v1

**`is_subject_authored = false` → discard at ingestion. It must never land in the DB** (T3). This is what keeps us self-audit-only and legal.

## Determining authorship per source
- **Own-export / connector:** everything tied to the user's own account/handle is theirs → kept.
- **Replies & quotes:** the user's *own* reply is kept; **quoted/embedded third-party text** inside it is **scrubbed** (or the item flagged) so we don't store others' content.
- **Group/shared content:** a photo or thread containing other people — the *user's own* item is kept for **context-only** analysis; we never analyze the other people (image: no-faces — `image-inference.md`).
- **Uncertain authorship → drop** (fail closed).

The drop happens **before** encryption/embedding, so third-party content never reaches storage or the embedding index. Enforced in code and asserted in `10-testing/*`.
