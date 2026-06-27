# ADR 0007 — Multimodal (images) in v1

**Status:** Accepted (v1)

**Context.** Photo geolocation (GeoSpy-style) is a core, visceral part of the threat — especially for the at-risk persona — and survives EXIF stripping.

**Decision.** Include **images in v1**: deterministic **EXIF/GPS** extraction **+ VLM visual inference** (context-only, no faces).

**Rationale.** Half the real threat is visual; EXIF is cheap and provable, the VLM is the headline ("we stripped your GPS, the photo still pins you"); differentiates from text-only tools. Text-only would miss the most dangerous vector.

**Consequences.** New tables `media_assets` / `exif_findings`; a VLM model slot + sub-processor; `image-inference` + `image-remediation`; image is **supplementary rigor** (don't overclaim accuracy).
