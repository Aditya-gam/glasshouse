# Source — Upload: Reddit Export

> **Depends on:** `canonical-item.md`, `third-party-drop.md` · **Version:** v1

Reddit "request my data" export (zip of CSVs) — the no-friction path, complementary to the live connector.

- **Parse:** `comments.csv`, `posts.csv` → text items with `posted_at`, subreddit, permalink.
- **Authorship:** the export is the user's own → kept; quoted text inside a comment is the user's own writing (kept).
- Method = `upload`, platform = `reddit`. Matches SynthPAI's distribution well (Reddit-style English).
