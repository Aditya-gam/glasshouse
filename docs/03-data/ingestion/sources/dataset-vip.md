# Source — Loader: VIP (image eval)

> **Depends on:** `0007-multimodal-v1.md`, `04-ai-engine/research-sources.md`, `eval_labels.md`, `upload-photos.md` · **Consumed by:** `measure/benchmarking.md` (image) · **Version:** v1

Seeds the **image benchmark** where obtainable, supplemented by own labeled photos.

- **Load:** VIP (`eth-sri/privacy-inference-multimodal`) — 554 people-free, attribute-labeled images. **Code is MIT; the image data carries separate terms → confirm access**; if gated, rely on the **builder's own labeled photos** (`upload-photos.md`) as the always-available image eval set.
- **Map:** images → `media_assets` (benchmark profile); labels → `eval_labels(modality='image')`.
- **Rigor:** image is **supplementary** (VIP small/gated, own-set small) — humble framing, never overclaimed.
- Method = `loader`, platform = `vip`.
