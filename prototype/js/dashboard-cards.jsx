/* Dashboard presentational components — severity chip, calibrated reliability bar,
 * attribute card. Severity = heatmap accent (chip + icon + text label, colorblind-safe).
 * Reliability = teal, shown as a calibrated point + interval band (never raw confidence). */
const Icon = window.Icon;

function SeverityChip({ level }) {
  const meta = window.IEA.SEV_META[level];
  return (
    <span className={`sev sev--${level}`}>
      <Icon name={meta.icon} size={13} stroke={2.25} />
      {meta.label}
    </span>
  );
}

function ReliabilityBar({ point, lo, hi }) {
  const bandLeft = Math.max(0, Math.min(100, lo));
  const bandWidth = Math.max(0, Math.min(100, hi) - bandLeft);
  return (
    <div
      className="relbar"
      role="img"
      aria-label={`Calibrated reliability ${point} percent, interval ${lo} to ${hi} percent`}
    >
      <div className="relbar-band" style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }} />
      <div className="relbar-fill" style={{ width: `${point}%` }} />
    </div>
  );
}

function AttributeCard({ attr, level, onFix, onEvidence, onOpen }) {
  const { Card, Button } = window.AdityaDesignSystem_25de17;

  if (attr.abstain) {
    return (
      <Card className="attr-card attr-card--abstain">
        <div className="attr-head">
          <span className="attr-label">{attr.label}</span>
          <SeverityChip level="abstain" />
        </div>
        <div className="attr-value">Abstained</div>
        <p className="abstain-note">
          The engine looked and found nothing reliable to infer. This is a deliberate “no
          signal” — not a guess, and not an error.
        </p>
        <div className="abstain-foot">
          <span className="abstain-tag">
            <Icon name="circle-minus" size={14} /> We don’t fabricate a value
          </span>
        </div>
      </Card>
    );
  }

  const clickProps = onOpen ? {
    role: "button", tabIndex: 0, "aria-label": `Open ${attr.label} detail`,
    onClick: onOpen,
    onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } },
  } : {};
  return (
    <Card className={"attr-card" + (onOpen ? " attr-card--clickable" : "")} hover {...clickProps}>
      <div className="attr-head">
        <span className="attr-label">{attr.label}</span>
        <SeverityChip level={level} />
      </div>
      <div className="attr-value">
        {attr.value}
        {attr.detail && <span className="attr-detail">· {attr.detail}</span>}
        {attr.art9 && <span className="tag-art9" title="GDPR Article 9 — special category">Art. 9</span>}
      </div>

      <div className="rel">
        <div className="rel-top">
          <span className="rel-label">Calibrated reliability</span>
          <span className="rel-pct">{attr.reliability}%</span>
        </div>
        <ReliabilityBar point={attr.reliability} lo={attr.lo} hi={attr.hi} />
        <div className="rel-range">calibrated range {attr.lo}–{attr.hi}%</div>
      </div>

      <div className="attr-foot">
        {onEvidence ? (
          <button className="attr-evidence attr-evidence--link" onClick={(e) => { e.stopPropagation(); onEvidence(); }} aria-label={`See why: ${attr.evidence}`}>
            <Icon name="file-text" size={14} />
            <span>{attr.evidence}</span>
            <Icon name="chevron-right" size={13} />
          </button>
        ) : (
          <span className="attr-evidence">
            <Icon name="file-text" size={14} />
            <span>{attr.evidence}</span>
          </span>
        )}
        <Button className="fix-btn" variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onFix(); }}>
          Fix this <Icon name="arrow-right" size={14} />
        </Button>
      </div>
    </Card>
  );
}

window.SeverityChip = SeverityChip;
window.ReliabilityBar = ReliabilityBar;
window.AttributeCard = AttributeCard;
