# Flow — Connect & Import

> **Depends on:** `06-api/endpoints/connectors.md` + `imports.md`, `03-data/ingestion/*` · **Version:** v1

Step 2 — bring in the user's own footprint.

- **Connect** (read-only OAuth): Reddit, Mastodon; **X = upload-first**. Or **upload**: X archive, Reddit export, Google Takeout, photos.
- Triggers an **ingestion run** → live progress.
- **Transparency:** show a **kept-vs-dropped** summary (third-party content dropped at ingestion) so the user sees we only keep their own data.
- Retention choice surfaced (retain-encrypted vs process-then-discard).
