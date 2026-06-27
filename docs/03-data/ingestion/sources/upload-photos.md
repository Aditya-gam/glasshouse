# Source — Upload: Photos

> **Depends on:** `images-and-exif.md`, `media_assets.md` · **Version:** v1

Direct image upload — the simplest image path, and the builder's **own-labeled photo** set for image eval.

- **Parse:** each file → `media_assets` (object storage) + `exif_findings`.
- **Authorship:** the user's own uploads → kept; context-only (no faces).
- Doubles as the **own labeled photo** source for image benchmarking (supplements VIP) — labels go to `eval_labels`.
- Method = `upload`, platform = `photos`.
