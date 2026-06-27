# Source — Upload: X (Twitter) Archive

> **Depends on:** `canonical-item.md`, `third-party-drop.md` · **Version:** v1

The **no-cost X path** (live pull needs X's paid API → upload-first). The user downloads their X data archive (zip) and uploads it.

- **Parse:** `data/tweets.js` (+ media folder) → tweets, replies, retweets, media.
- **Authorship:** the whole archive is the user's own → `is_subject_authored = true`; **retweets/quotes** keep the user's wrapper but **scrub the quoted third-party text** (`third-party-drop.md`).
- **Media:** archive images → `media_assets` + EXIF (often stripped by X; the VLM still infers — the thesis).
- No API, no tokens. Method = `upload`, platform = `x`.
