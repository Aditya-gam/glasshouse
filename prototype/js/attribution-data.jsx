/* Attribution detail data — the "why this inference?" view for LOCATION (the hero finding).
 * Evidence model from attack/output-schema.md:
 *   - "likely"  = attack-side (proxy_score + citation_frequency) — correlational, the
 *                 attacker cited it but it is not individually decisive.
 *   - "proven"  = ablation (marginal_effect) — causal: removing it measurably drops the
 *                 independent adversary's reliability.
 * Collective framing: no single item names the city; together they pin it. */

const LOCATION = {
  code: "location",
  label: "Current location",
  value: "Lisbon, Portugal",
  precision: "city-level",
  neighborhood: "Alfama",
  reliability: 86, lo: 81, hi: 90,
  sev: { atrisk: "extreme", jobseeker: "moderate" },
  reasoning:
    "Several posts name Lisbon-specific trams, districts, and civic terms, and one fixes the local time and climate. No single post says “Lisbon” — together they converge on it, and a photo's GPS narrows it to a neighborhood.",
  candidates: [
    { rank: 1, label: "Lisbon, Portugal", note: "city → neighborhood" },
    { rank: 2, label: "Setúbal, Portugal", note: "weighed, lower" },
    { rank: 3, label: "Porto, Portugal", note: "weighed, lower" },
  ],
  // what the text alone supports if the GPS photo is removed — sets up the defend story
  textOnlyReliability: 74,
};

// "why it matters" reframes by persona lens (never hides; reorders/reframes).
const LOCATION_WHY = {
  balanced: "Location is the most sensitive thing inferred about you.",
  atrisk: "For your safety: a precise home city lets a hostile party narrow where to find you.",
  jobseeker: "For your reputation: location is rarely what recruiters scrutinize — but it's still public.",
};

const EVIDENCE = [
  {
    id: "med_88", kind: "proven", type: "photo",
    source: "Photo · miradouro.jpg", date: "14 Mar 2026",
    caption: "Rooftops and the Tagus at sunset",
    region: { x: 0.08, y: 0.4, w: 0.62, h: 0.36 },
    exif: { gps: "38.7139, −9.1334", place: "→ Alfama, Lisbon", device: "iPhone 14", taken: "14 Mar 2026, 18:42" },
    rationale: "EXIF GPS resolves to Alfama; the skyline and red-tile roofs match Lisbon.",
    marginal: -28,
  },
  {
    id: "itm_4471", kind: "proven", type: "text",
    source: "Mastodon · @marta", date: "9 Mar 2026",
    text: "The 28 is a tourist sardine can now — locals just take the 24 up to Graça.",
    spans: ["The 28", "the 24", "Graça"],
    rationale: "Tram lines 28 and 24 and the Graça district are specific to Lisbon.",
    marginal: -19,
  },
  {
    id: "itm_4490", kind: "proven", type: "text",
    source: "Mastodon · @marta", date: "28 Feb 2026",
    text: "Voting reminder for everyone in my freguesia 🇵🇹 — polls close at 19h.",
    spans: ["freguesia", "🇵🇹", "19h"],
    rationale: "“Freguesia” (civil parish) is Portuguese civic vocabulary; the flag and 24-hour time agree.",
    marginal: -16,
  },
  {
    id: "itm_4502", kind: "proven", type: "text",
    source: "X archive · post", date: "21 Feb 2026",
    text: "It's 11pm and still 24°C — this autumn doesn't want to end.",
    spans: ["11pm", "24°C", "autumn"],
    rationale: "Local time plus a warm-autumn climate narrows the plausible region.",
    marginal: -11,
  },
  {
    id: "itm_4533", kind: "likely", type: "text",
    source: "Reddit · r/lisboa", date: "20 Feb 2026",
    text: "Best pastéis de nata isn't the famous one — it's the tiny place near work.",
    spans: ["pastéis de nata", "near work"],
    rationale: "A Portuguese pastry and a local recommendation. The attack cited it; on its own it isn't decisive.",
    proxy: 58, citation: 75,
  },
  {
    id: "itm_4555", kind: "likely", type: "text",
    source: "X archive · post", date: "12 Feb 2026",
    text: "Walked up the hill again because the elevador queue was endless.",
    spans: ["the hill", "elevador"],
    rationale: "“Elevador” and steep hills suggest Lisbon, but fit several cities — weak alone.",
    proxy: 44, citation: 50,
  },
];

window.IEA_ATTR = { LOCATION, LOCATION_WHY, EVIDENCE };
