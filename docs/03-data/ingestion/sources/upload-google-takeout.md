# Source — Upload: Google Takeout

> **Depends on:** `canonical-item.md`, `images-and-exif.md` · **Version:** v1

Google Takeout multi-service export — primarily a **photos** source (Google Photos), plus optional text (e.g., YouTube comments).

- **Parse:** select relevant services; **Google Photos** → `media_assets` + EXIF (Takeout often **preserves GPS** — a strong leak to surface).
- **Authorship:** the user's own account export → kept; photos *of* others are kept for **context-only** analysis (no faces).
- Method = `upload`, platform = `google`. Large archives stream-parsed to avoid memory blowup.
