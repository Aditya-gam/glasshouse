/* Dashboard data — Inference Exposure Auditor
 * The 8 PAI attributes for one audited subject (a coherent at-risk profile so the
 * persona lens is meaningful). Severity per persona is authoritative from
 * 04-ai-engine/attributes-taxonomy.md. Reliability is CALIBRATED (point + interval),
 * never the model's raw confidence. Income abstains — a first-class "no signal" state. */

const SEV_RANK = { extreme: 4, high: 3, moderate: 2, low: 1, abstain: -1 };

const SEV_META = {
  low:      { label: "Low",       icon: "shield-check" },
  moderate: { label: "Moderate",  icon: "circle-alert" },
  high:     { label: "High",      icon: "triangle-alert" },
  extreme:  { label: "Extreme",   icon: "octagon-alert" },
  abstain:  { label: "No signal", icon: "circle-minus" },
};

// reliability = calibrated point estimate (%); lo/hi = calibrated interval.
const ATTRS = [
  {
    code: "location", label: "Current location", value: "Lisbon, Portugal",
    detail: "city-level", reliability: 86, lo: 81, hi: 90,
    evidence: "6 posts pin this", evidenceCount: 6,
    sev: { atrisk: "extreme", jobseeker: "moderate" },
  },
  {
    code: "occupation", label: "Occupation", value: "Investigative journalist",
    detail: null, reliability: 91, lo: 87, hi: 94,
    evidence: "9 posts point here", evidenceCount: 9,
    sev: { atrisk: "moderate", jobseeker: "high" },
  },
  {
    code: "sex", label: "Sex", value: "Female",
    detail: null, reliability: 82, lo: 75, hi: 88,
    evidence: "across 12 posts", evidenceCount: 12, sensitive: true,
    sev: { atrisk: "low", jobseeker: "low" },
  },
  {
    code: "age", label: "Age", value: "35–39",
    detail: "estimated range", reliability: 78, lo: 71, hi: 84,
    evidence: "7 posts narrow this", evidenceCount: 7,
    sev: { atrisk: "low", jobseeker: "low" },
  },
  {
    code: "relationship", label: "Relationship status", value: "Married",
    detail: null, reliability: 73, lo: 66, hi: 79,
    evidence: "4 posts suggest this", evidenceCount: 4, sensitive: true,
    sev: { atrisk: "moderate", jobseeker: "low" },
  },
  {
    code: "education", label: "Education", value: "Master's degree",
    detail: null, reliability: 70, lo: 62, hi: 77,
    evidence: "5 posts imply this", evidenceCount: 5,
    sev: { atrisk: "low", jobseeker: "moderate" },
  },
  {
    code: "birthplace", label: "Place of birth", value: "Porto, Portugal",
    detail: "city-level", reliability: 64, lo: 55, hi: 72,
    evidence: "3 posts hint at this", evidenceCount: 3, art9: true, sensitive: true,
    sev: { atrisk: "moderate", jobseeker: "low" },
  },
  {
    code: "income", label: "Income", value: null,
    detail: null, abstain: true, sensitive: true,
    evidence: "no posts gave a usable signal",
    sev: { atrisk: "low", jobseeker: "low" },
  },
];

const LENSES = [
  { key: "balanced",  label: "Balanced" },
  { key: "jobseeker", label: "Job-seeker" },
  { key: "atrisk",    label: "At-risk" },
];

// Reframing copy per lens — reorders/reframes, never hides (persona-lens.md).
const LENS_COPY = {
  balanced:  "Ordered by overall sensitivity — a safety-aware default. Switch lens anytime; nothing is hidden.",
  jobseeker: "Ordered for cleaning up before recruiters and colleagues look.",
  atrisk:    "Ordered by what a hostile party could deduce about your safety.",
};

function maxLevel(a, b) {
  return SEV_RANK[a] >= SEV_RANK[b] ? a : b;
}

// Lens-relative severity. Balanced = safety-aware max across personas.
function severityFor(attr, lens) {
  if (attr.abstain) return "abstain";
  if (lens === "balanced") return maxLevel(attr.sev.atrisk, attr.sev.jobseeker);
  if (lens === "atrisk") return attr.sev.atrisk;
  return attr.sev.jobseeker;
}

// Order by lens severity desc, then calibrated reliability desc; abstain sinks last.
function orderFor(lens) {
  return ATTRS.slice().sort((a, b) => {
    const ra = SEV_RANK[severityFor(a, lens)];
    const rb = SEV_RANK[severityFor(b, lens)];
    if (rb !== ra) return rb - ra;
    return (b.reliability || 0) - (a.reliability || 0);
  });
}

const INFERRED_COUNT = ATTRS.filter((a) => !a.abstain).length;

window.IEA = { ATTRS, LENSES, LENS_COPY, SEV_META, SEV_RANK, severityFor, orderFor, INFERRED_COUNT };
