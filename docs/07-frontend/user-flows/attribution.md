# Flow — Attribution ("why")

> **Depends on:** `04-ai-engine/attack/evidence-attribution.md`, `06-api/endpoints/inferences.md` · **Version:** v2 (flow + all-8 attributes)

The signature "why" view. **Entry:** a dashboard card or its "Fix this" → `/attribute/[code]` (all 8 attributes). **Exit:** "Break this inference" → Defend.

- Open an attribute → the **ranked evidence**: highlighted **text spans**, **image-region** overlays, EXIF findings.
- The **collective framing** — "these six individually-boring posts *together* pin your home" — not misleading per-item zeros.
- **proxy = "likely"** (attack-side, cheap) vs **ablation = "proven"** (defend-side, causal) clearly distinguished.
- **Confirm/deny** — the user can verify each guess (builds trust + feeds drift monitoring).
