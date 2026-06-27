# Ingestion — Images & EXIF

> **Depends on:** `0007-multimodal-v1.md`, `database/tables/media_assets.md` + `exif_findings.md`, `04-ai-engine/image-inference.md` · **Consumed by:** `image-inference.md`, `image-remediation.md` · **Version:** v1 NEW

The image path, two layers (mirrors the attack).

## Layer 1 — EXIF/metadata (deterministic, Tier-1)
On **every** image, extract metadata with `Pillow`/`piexif`/`exiftool` → `exif_findings`: **GPS** (→ `value_ct`, T2 — the provable location leak), **timestamp** (routine/tz), **camera/software** (transparency only). The original encrypted bytes are retained (object storage); a **stripped copy** can be produced for the remediation download.

## Layer 2 — the image itself (for the VLM)
Store bytes in **object storage** (SSE under the DEK); the `media_assets` row holds the ref + dimensions (for normalized-bbox evidence). The VLM is given **only the image, blind to EXIF** (`image-inference.md` §4).

## Drop & scope
Third-party images dropped (rule 5). Photos containing people are kept for **context-only** inference (no facial/biometric analysis). Process-then-discard deletes the object post-run.
