# Product — Problem & Threat

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** `archive/product-spec.md` §1, `04-ai-engine/research-sources.md` (the cited studies), `04-ai-engine/*` (the threat it operationalizes)
> - **Consumed by:** `overview.md`, `positioning.md`, `08-security-privacy/threat-model.md`
> - **Hard invalidations:** none (problem framing)
> - **Version:** v1

*Internal doc — frank by design. User-facing tone lives in `ethics-and-tone.md`.*

**The gap, in one line:** every privacy tool works on what you *typed*; none on what an AI can *infer*. That's the hole we fill.

**What "inference" means here:** an AI deduces personal facts you never stated — our **8 attributes** (age, sex, current location, birthplace, occupation, education, relationship, income) — from your *own* ordinary posts and photos.

**Threat A — text.** GPT-4 inferred attributes from ordinary Reddit comments at **~85% top-1 / ~95% top-3** — no explicit "I live in X," just normal chatter ("the 405 again" → LA) — and **~100× cheaper, ~240× faster** than humans, run on everyone at once. [Staab]

**Threat B — images.** No face or geotag needed: architecture, plants, signage, light. **~78%** on deliberately people-free photos [VIP]; the tool **GeoSpy** pinpoints a photo in seconds. EXIF GPS is the easy leak; the *visual* leak survives stripping it.

**Why the usual fixes fail.** Deleting posts, keyword filters, "removing PII," redaction/anonymization — studies show people edit text to *look* different while the AI still infers the same thing, even SOTA sanitizers failed, and context alone reconstructs redacted info at **98.5%** accuracy. Worse, people guess at **random** about what's inferable. This is *why the product exists*: the thing people trust doesn't work, and they can't feel the gap. [Beyond PII]

**Why now.** This used to need an OSINT pro and years of skill; LLMs/VLMs made it cheap and put it in *anyone's* hands (GeoSpy let "essentially anyone" do it). The capability crossed from specialists to the public in ~2 years.

**Who it hits — both personas.**
- *Everyone's more exposed than they think* (job-seeker / general): a recruiter, an ex, or a stranger can infer your job, age, city, and income from a bland feed.
- *And for some it's dangerous* (at-risk): the same tech is already used to find and harm people — GeoSpy users asked it to help **stalk specific women**; Grok handed out strangers' **home addresses**; orgs tracking violence-against-women flag AI doxxing/stalking as "more scalable, more anonymous, harder to stop." *(as of 2025)* [Privacy International, Grok/Futurism, Stimson]

**Scale.** The average person leaves years of posts and photos across platforms — a large, mostly-forgotten surface an attacker mines in a single pass. You've left more cues than you remember.

**Compliance angle.** Under GDPR, **inferred** data about a person is still personal data — so attribute inference is a regulatory exposure, not only a safety one (detail in `08-security-privacy/*`).

**The hole nobody fills.** redact *deletes* what you posted; Whitebridge *profiles other people*. Neither shows you *your own inferable exposure* and *proves* you broke it. That's us: make the invisible inference visible, measure it honestly, prove the drop.

**Sources:** [Staab, Beyond Memorization](https://arxiv.org/abs/2310.07298) · [VIP](https://arxiv.org/abs/2404.10618) · [GeoSpy/Malwarebytes](https://www.malwarebytes.com/blog/news/2025/01/ai-tool-geospy-analyzes-images-and-identifies-locations-in-seconds) · [Privacy International](https://privacyinternational.org/report/5736/nowhere-hide-privacy-risks-and-policy-implications-ai-geolocation) · [Grok/Futurism](https://futurism.com/artificial-intelligence/grok-doxxing) · [Beyond PII](https://arxiv.org/abs/2509.12152) · [Stimson Center](https://www.stimson.org/2026/the-impact-of-artificial-intelligence-on-violence-against-women-and-girls/)
