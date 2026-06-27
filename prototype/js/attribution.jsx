/* Attribution detail (screen 3) — "why this inference?" for LOCATION.
 * Two-pane: evidence (highlighted spans, photo bbox, EXIF) | inference summary + confirm/deny.
 * Reuses the shared shell + SeverityChip/ReliabilityBar. */
const DS = window.AdityaDesignSystem_25de17;
const { Button, Separator } = DS;
const Icon = window.Icon;
const { useTheme, useToast, Toast, Topbar } = window.AppShell;
const { SeverityChip, ReliabilityBar } = window;
const { EmptyState, ErrorState, PreviewSwitch, useViewState, Sk } = window.States;
const { LOCATION, LOCATION_WHY, EVIDENCE } = window.IEA_ATTR;
const { severityFor, ATTRS } = window.IEA;
const { useState, useEffect } = React;

const VIEWS = [
  { key: "loaded", label: "Loaded" },
  { key: "loading", label: "Loading" },
  { key: "empty", label: "Abstained" },
  { key: "error", label: "Error" },
];
// the abstained attribute the empty state illustrates (Income abstains in the dataset)
const ABSTAINED = ATTRS.find((a) => a.abstain) || { label: "Income" };

/* Wrap each quoted substring in a styled <mark>; non-overlapping, left-to-right. */
function highlight(text, quotes, klass) {
  const ranges = [];
  (quotes || []).forEach((q) => {
    let idx = text.indexOf(q);
    while (idx !== -1 && ranges.some((r) => idx < r.end && idx + q.length > r.start)) {
      idx = text.indexOf(q, idx + 1);
    }
    if (idx !== -1) ranges.push({ start: idx, end: idx + q.length });
  });
  ranges.sort((a, b) => a.start - b.start);
  const out = [];
  let pos = 0;
  ranges.forEach((r, i) => {
    if (r.start > pos) out.push(text.slice(pos, r.start));
    out.push(<mark key={i} className={klass}>{text.slice(r.start, r.end)}</mark>);
    pos = r.end;
  });
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}

function KindBadge({ kind }) {
  if (kind === "proven") {
    return <span className="ev-kind ev-kind--proven"><Icon name="check" size={12} stroke={2.5} /> Proven</span>;
  }
  return <span className="ev-kind ev-kind--likely"><Icon name="circle-alert" size={12} /> Likely</span>;
}

function EvidenceItem({ item }) {
  const spanClass = item.kind === "proven" ? "span-proven" : "span-likely";
  return (
    <article className="ev">
      <div className="ev-head">
        <span className="ev-src">
          <Icon name={item.type === "photo" ? "image" : "file-text"} size={14} />
          {item.source} <span className="ev-date">· {item.date}</span>
        </span>
        <KindBadge kind={item.kind} />
      </div>

      {item.type === "photo" ? (
        <div>
          <div className="ev-photo">
            <div className="ev-photo-roofline" />
            <div
              className="ev-bbox"
              style={{ left: `${item.region.x * 100}%`, top: `${item.region.y * 100}%`, width: `${item.region.w * 100}%`, height: `${item.region.h * 100}%` }}
            >
              <span className="ev-bbox-label">{item.caption}</span>
            </div>
            <span className="ev-photo-name"><Icon name="image" size={13} /> miradouro.jpg</span>
          </div>
          {item.exif && (
            <div className="exif">
              <div className="exif-title"><Icon name="map-pin" size={13} /> EXIF metadata found</div>
              <div className="exif-row"><span className="exif-k">GPS</span><span className="exif-v">{item.exif.gps} <span className="exif-place">{item.exif.place}</span></span></div>
              <div className="exif-row"><span className="exif-k">Device</span><span className="exif-v">{item.exif.device}</span></div>
              <div className="exif-row"><span className="exif-k">Taken</span><span className="exif-v">{item.exif.taken}</span></div>
            </div>
          )}
        </div>
      ) : (
        <p className="ev-text">{highlight(item.text, item.spans, spanClass)}</p>
      )}

      <div className="ev-foot">
        <span className="ev-rationale">{item.rationale}</span>
        <span className="ev-metric">
          {item.kind === "proven" ? (
            <>
              <span className="ev-effect"><Icon name="triangle-alert" size={12} /> {item.marginal}% if removed</span>
              <div className="ev-metric-cap">proven by ablation</div>
            </>
          ) : (
            <>
              <span className="ev-proxy">proxy {(item.proxy / 100).toFixed(2)} · cited {item.citation}%</span>
              <div className="ev-metric-cap">attack-side signal</div>
            </>
          )}
        </span>
      </div>
    </article>
  );
}

function Verify({ fireToast }) {
  const [state, setState] = useState(null); // null | 'confirmed' | 'denied'
  const [reason, setReason] = useState(null);
  const reasons = ["Wrong city", "Outdated", "Never lived here", "Too precise"];

  if (state === "confirmed") {
    return (
      <div>
        <div className="verify-result verify-result--ok">
          <Icon name="check" size={16} stroke={2.5} />
          <span>You confirmed this is right. Thanks — verification improves our calibration; it doesn't change what others can infer.</span>
        </div>
        <button className="verify-undo" onClick={() => setState(null)}>Undo</button>
      </div>
    );
  }
  if (state === "denied") {
    return (
      <div>
        <div className="verify-result verify-result--no">
          <Icon name="circle-minus" size={16} />
          <span>Recorded as not right{reason ? ` — ${reason.toLowerCase()}` : ""}. This feeds our drift monitoring. To reduce real exposure, break the inference.</span>
        </div>
        <div className="verify-reasons" role="group" aria-label="What's wrong?">
          {reasons.map((r) => (
            <button key={r} className="reason-chip" aria-pressed={reason === r} onClick={() => setReason(r)}>{r}</button>
          ))}
        </div>
        <button className="verify-undo" onClick={() => { setState(null); setReason(null); }}>Undo</button>
      </div>
    );
  }
  return (
    <div>
      <div className="verify-q">Is this right?</div>
      <p className="verify-note">Verifying helps us calibrate and catch drift. It won't change what others can infer.</p>
      <div className="verify-actions">
        <Button variant="secondary" onClick={() => setState("confirmed")}><Icon name="check" size={15} /> Confirm</Button>
        <Button variant="outline" onClick={() => setState("denied")}><Icon name="x" size={15} /> Not right</Button>
      </div>
    </div>
  );
}

function AttrSkeleton() {
  return (
    <div className="attr-layout">
      <section className="evidence" aria-hidden="true">
        <div className="ev-intro">
          <Sk className="sks-title" />
          <Sk className="sks-title--gap" />
          <Sk className="sks-line2" />
        </div>
        <div className="ev-list ev-list--skel">
          {[0, 1, 2, 3].map((i) => (
            <div className="ev-skel" key={i}>
              <div className="ev-skel-head"><Sk className="sks-src" /><Sk className="sks-badge" /></div>
              <Sk className="sks-line1" />
              <Sk className="sks-line2" />
              <Sk className="sks-foot" />
            </div>
          ))}
        </div>
      </section>
      <aside className="summary" aria-hidden="true">
        <div className="ad-card sum-skel">
          <Sk className="sks-attr" />
          <Sk className="sks-value" />
          <Sk className="sks-chip" />
          <Sk className="sks-bar" />
          <Sk className="sks-block" />
          <Sk className="sks-btn" />
        </div>
      </aside>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useTheme();
  const [lens, setLens] = useState(() => { try { return localStorage.getItem("iea_lens") || "balanced"; } catch (e) { return "balanced"; } });
  const [view, setView] = useViewState(VIEWS);
  const [toast, fireToast] = useToast();
  useEffect(() => { try { localStorage.setItem("iea_lens", lens); } catch (e) {} }, [lens]);

  const level = severityFor(LOCATION, lens);

  // breadcrumb tail reflects the state: location for loaded/loading/error, the
  // abstained attribute for the empty state.
  const crumbTail = view === "empty" ? ABSTAINED.label : LOCATION.label;
  const crumbs = (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href="Dashboard.html">Dashboard</a>
      <Icon name="chevron-right" size={14} />
      <span className="crumb-here">{crumbTail}</span>
    </nav>
  );

  return (
    <div className="app-root">
      <Topbar
        lens={lens} setLens={setLens} theme={theme} setTheme={setTheme}
        center={crumbs}
        onAccount={(label) => fireToast(label === "Signed out" ? "Signed out" : `Opening: ${label}`)}
      />

      {view === "loading" && <AttrSkeleton />}

      {view === "empty" && (
        <div className="attr-layout">
          <div className="attr-state-host">
            <EmptyState
              icon="circle-minus"
              title={`No signal found for ${ABSTAINED.label.toLowerCase()}`}
              message="The engine looked across your footprint and found nothing reliable to infer here. This is a deliberate abstention — not a guess, and not an error."
              message2="There’s no evidence to show because none was decisive."
            />
            <div className="state-back" style={{ textAlign: "center" }}>
              <a href="Dashboard.html"><Icon name="arrow-left" size={15} /> Back to your footprint</a>
            </div>
          </div>
        </div>
      )}

      {view === "error" && (
        <div className="attr-layout">
          <div className="attr-state-host">
            <ErrorState
              title="We couldn’t load this evidence"
              message="The attribution didn’t load — this is almost always a temporary connection issue, not a problem with your data."
              onRetry={() => setView("loaded")}
              retryLabel="Try again"
              details={"request_id: attr_7f1a23\nattribute: location\nreason: evidence service unavailable (503)"}
            />
            <div className="state-back" style={{ textAlign: "center" }}>
              <a href="Dashboard.html"><Icon name="arrow-left" size={15} /> Back to your footprint</a>
            </div>
          </div>
        </div>
      )}

      {view === "loaded" && (
      <div className="attr-layout">
        <section className="evidence" aria-label="Evidence">
          <div className="ev-intro">
            <h2>Why this inference?</h2>
            <p className="ev-collective">
              <b>Six individually-bland posts triangulate your city.</b> No single one names Lisbon — together they pin it. A photo's GPS narrows it to your neighborhood. Even without that photo, the text alone still points here (≈{LOCATION.textOnlyReliability}%).
            </p>
            <div className="ev-legend">
              <span className="ev-legend-item"><KindBadge kind="proven" /> <span><b>Proven</b> — removing it measurably drops the inference (ablation).</span></span>
              <span className="ev-legend-item"><KindBadge kind="likely" /> <span><b>Likely</b> — the attack cited it, but it isn't decisive alone.</span></span>
            </div>
          </div>
          <div className="ev-list">
            {EVIDENCE.map((item) => <EvidenceItem key={item.id} item={item} />)}
          </div>
        </section>

        <aside className="summary">
          <div className="ad-card summary-card">
            <div className="sum-attr">{LOCATION.label}</div>
            <div className="sum-value">{LOCATION.value} <span className="sum-detail">· {LOCATION.precision}</span></div>
            <div className="sum-sevrow">
              <SeverityChip level={level} />
              <span className="sum-pin">pinned to {LOCATION.neighborhood}</span>
            </div>
            <p className="sum-why">{LOCATION_WHY[lens]}</p>

            <div className="sum-rel">
              <div className="sum-rel-top">
                <span className="sum-rel-label">Calibrated reliability</span>
                <span className="sum-rel-pct">{LOCATION.reliability}%</span>
              </div>
              <ReliabilityBar point={LOCATION.reliability} lo={LOCATION.lo} hi={LOCATION.hi} />
              <div className="sum-range">calibrated range {LOCATION.lo}–{LOCATION.hi}% · not the model's raw confidence</div>
            </div>

            <div className="sum-reasoning">
              <span className="sum-reasoning-k">How it was inferred</span>
              {LOCATION.reasoning}
            </div>
            <div className="sum-cands">
              <b>Top guess</b> {LOCATION.candidates[0].label} · also weighed {LOCATION.candidates.slice(1).map((c) => c.label).join(" · ")}
            </div>

            <hr className="sum-sep" />
            <Verify fireToast={fireToast} />

            <hr className="sum-sep" />
            <div className="sum-cta">
              <Button onClick={() => { window.location.href = "Defend.html"; }}>
                Break this inference <Icon name="arrow-right" size={15} />
              </Button>
            </div>
            <p className="sum-nofalse">
              <Icon name="shield-alert" size={14} />
              No false safety: editing later can't recall copies others already made. Breaking the inference reduces what an adversary can recover — it can't erase the past.
            </p>
          </div>
        </aside>
      </div>
      )}

      <PreviewSwitch views={VIEWS} view={view} onChange={setView} />
      <Toast msg={toast} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
