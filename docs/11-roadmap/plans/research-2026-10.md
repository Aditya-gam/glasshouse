# Research record — October 2026 (before M5.W, M4, M6, M7)

> **Dependencies** (see `00-traceability.md`)
> - **Depends on:** the June 2026 spec for M4, M6 and M7 (`04-ai-engine/attack/image-inference.md`, `defend/image-remediation.md`, `feasibility-and-cost.md`, `llm-gateway.md`, `02-architecture/decisions/0008-live-connectors-v1.md`, `09-infra-devops/*`)
> - **Consumed by:** `plans/write-paths.md`, the M4, M6 and M7 plans (to be written when each is next), `milestones.md`
> - **Hard invalidations:** none by itself. Items marked **spec correction** below must be applied to the named doc when the milestone that owns it is planned.
> - **Version:** v1 — research run 2026-10-07; facts are dated and must be re-checked before a later milestone relies on them.

Planning finished in June 2026. This is what a re-check four months later found. It records findings and the decisions taken on them; it is not a plan.

## 1. Decisions taken (2026-10-07 to 2026-10-11)

| Decision | Choice |
|---|---|
| Order of work | **M5.W write paths → M4 images → M6 connectors → M7 deploy** |
| First real-model run (benchmark, calibration, multi-model defend) | Deferred to **M7** |
| M6 live connectors | **Bluesky + Mastodon**. Reddit and X by upload. Apply for Reddit API access in the background |
| M4 image accuracy slice | **The user's own photos + a sample of OSV-5M** |
| Working copies | Fresh clones in `~/Developer/glasshouse/` (moved out of an iCloud-synced folder on 2026-10-10) |

## 2. State of the build, as found

- **No real-model run has ever happened.** `eval_floor.json` is `{}`. Only the profiler model is pulled locally. The backend session confirmed on 2026-10-11 that every eval, attack and remediation run used fake gateways and seeded rows.
- **The cloud gateway profile has never been exercised.** Its slot names are placeholders. Two incompatibilities with current Claude models are known and unhandled: they reject `temperature` (the engine sends 0, 0.3 and 0.7; `drop_params` may hide this and silently turn `sampling_temperature` into a no-op), and they can stop with a refusal, for which the engine has no state. Whether `instructor` JSON mode survives the LiteLLM-to-Anthropic path is untested.
- **Sixteen routes were still 501** and three frontend screens had no data wiring. See `plans/write-paths.md` §1.

## 3. Findings that change the June spec

| # | Finding | Evidence | Effect |
|---|---|---|---|
| 1 | **Reddit's Data API is no longer self-service.** Any new access needs approval (Responsible Builder Policy, November 2025); developers report hobby apps are refused | Reddit help-center pages (read through search summaries; the pages blocked a direct fetch) and r/redditdev reports | **Spec correction:** ADR 0008 and `connector-reddit.md` assume a free API. Reddit becomes upload-only; the export adapter already exists |
| 2 | **The VIP image benchmark is not publicly downloadable.** The repository ships code and a labelling tool; no request procedure was found | `eth-sri/privacy-inference-multimodal` README and dataset README | `benchmarking.md` already hedged this. Image slice uses own photos + OSV-5M |
| 3 | **The dev Mac cannot run the local model set the plan names.** 16 GB RAM, about 22 GB free disk; seven distinct local models are named, one is pulled; `sdxl` is not something Ollama serves | Direct inspection | Local dev can run one small vision model (`qwen3-vl` 4b or 8b, which supports bounding boxes). Local generative inpainting is impractical. The multi-model defend chain needs cloud models or very small local ones |
| 4 | **`piexif` is unmaintained** (last release 2019) | PyPI | **Spec correction:** `images-and-exif.md`, `feasibility-and-cost.md`. Use Pillow's EXIF support and `pillow-heif` for iPhone HEIC |
| 5 | **Neon's Terraform provider is community-maintained**, and Railway has none | Neon docs; Railway feedback board | **Spec correction:** `09-infra-devops/iac.md` calls the Neon provider official |
| 6 | **Model names in the plan are stale** (o3, Gemini 2.5 Pro, `gpt-4o`, `gemini-pro-vision`) | Official pricing pages, 2026-10-07 | **Spec correction:** `feasibility-and-cost.md` slot map and `app/gateway/slots.py`, at M7 |
| 7 | **Compose runs LiteLLM on `main-stable` and Ollama on `latest`.** LiteLLM's PyPI package was compromised in March 2026 (the Docker image was reported unaffected) | Datadog Security Labs and others | Pin both by version and digest (`.claude/rules/infra-devops.md`: pinned builds) |

## 4. Findings that confirm the June spec

- **Mastodon** live connector is viable as planned: 4.6 is current (API v10), PKCE since 4.3, the password grant is gone, `Mastodon.py` is maintained.
- **X stays upload-first.** The API has been pay-per-use since February 2026 (about $0.005 per post read) with no free tier for new developers.
- **Bluesky** has an open API and OAuth with scoped permissions; the `atproto` Python SDK is maintained. Posts are public, so OAuth is used to prove account ownership, which the self-audit rule requires.
- **Hosting:** Railway Hobby is $5 a month with $5 of usage; Neon's free plan scales to zero; both official pricing pages.
- **`fastembed`**, already a dependency, runs CLIP-style image embeddings on ONNX, so image triage needs no PyTorch.
- **Frontend dependencies are current** (Next 16.3, React 19.2, Clerk 7, Zod 4).

## 5. Reference numbers (2026-10-07, official pricing pages unless noted)

| Item | Figure |
|---|---|
| Claude Opus 5.5 / Sonnet 5.5 / Haiku 4.5 | $4 / $20, $2 / $10, $1 / $5 per million input / output tokens |
| Gemini 3.1 Pro (preview) / 3.8 Flash | $2 / $12, $0.75 / $3.75 |
| OpenAI `gpt-6.1-sol` / `gpt-6-luna` | $2 / $10, $0.10 / $0.50 |
| Claude vision input | about 1,200 tokens for a 1280×720 image |
| Batch processing | 50% off (Anthropic, Google, OpenAI) |
| Hosted inpainting | FLUX Fill about $0.05 per image; Gemini 3.1 Flash Image about $0.03–0.07 |

Free API tiers that may use prompts to improve the provider's products must not receive user content.

## 6. Other candidates noted, not adopted

- **MinIO is gone as a local S3 server** (found 2026-10-12, when the backend could not pull it): community edition source-only since October 2025, repository archived April 2026, Docker Hub repositories deleted and Quay closed to anonymous pulls in September 2026. Confirmed from this machine: `minio/minio` and `quay.io/minio/minio` fail; SeaweedFS, VersityGW, Garage, RustFS, S3Mock and moto all resolve. Local dev uses SeaweedFS.
- **arq is maintenance-only.** It still works and had a release in April 2026. `streaQ`, `SAQ` and `taskiq` are active. Not worth migrating mid-build.
- **DoxBench** (500 GPS-labelled casual photos, ICLR 2026) is a closer match to personal photos than OSV-5M, but access is gated under a strict custom licence.
- **`aioboto3` lags `boto3` by about a year**; current AWS SDKs send upload checksums that R2 has rejected, fixed by setting checksum calculation to "when required".
- **Claude Desktop Projects** (the Code-tab beta) were evaluated on 2026-10-01 and not adopted; the build stays on local sessions.

## 7. What was discarded

- A blog claiming Railway Hobby rose to $7 (the official page says $5).
- Per-image prices for OpenAI's image models as returned by a summarising fetch (garbled).
- Launch-week and SEO pricing round-ups, where an official page existed.
- All Reddit and X sentiment: none of it could be opened.

## Sources

Reddit Responsible Builder Policy and data-access articles (support.reddithelp.com) · `github.com/eth-sri/privacy-inference-multimodal` · arXiv 2404.10618 (VIP) · arXiv 2504.19373 and `huggingface.co/datasets/MomoUchi/DoxBench` · `github.com/gastruc/osv5m` · `ollama.com/library/qwen3-vl` · `blog.joinmastodon.org/2026/06/mastodon-4-6-for-devs` · Datadog Security Labs on the LiteLLM compromise · `ai.google.dev/gemini-api/docs/pricing` · `developers.openai.com/api/docs/pricing` · `railway.com/pricing` · `neon.com/docs/reference/terraform` · `developers.cloudflare.com/r2/api/s3/api` · PyPI release data.
