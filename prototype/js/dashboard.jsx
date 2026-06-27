/* Dashboard app — Inference Exposure Auditor (screen 2) + its honest states.
 * Default view is the completed reveal. The shared state primitives drive:
 *   loading   — RunProgress (retrieve → infer → calibrate) with cards streaming in
 *   empty     — nothing imported yet
 *   abstained — ran, but no reliable signal anywhere (framed as good news)
 *   error     — the run failed; re-run
 * A bottom "preview state" switcher (a design-review affordance, hidden in print)
 * lets you flip between them in real context; ?state= also selects one on load. */
const DS = window.AdityaDesignSystem_25de17;
const { Tooltip } = DS;
const Icon = window.Icon;
const { LENSES, LENS_COPY, INFERRED_COUNT, ATTRS, severityFor, orderFor } = window.IEA;
const { AttributeCard } = window;
const { useTheme, useToast, Toast, Topbar } = window.AppShell;
const { RunProgress, EmptyState, ErrorState, SkelCard, useViewState } = window.States;
const { useState, useEffect, useRef } = React;

const VIEWS = [
  { key: "loaded", label: "Loaded" },
  { key: "loading", label: "Loading" },
  { key: "empty", label: "Empty" },
  { key: "abstained", label: "All-abstained" },
  { key: "error", label: "Error" },
];
const STAGES = ["Retrieve", "Infer", "Calibrate"];


/* Drives the attack-run simulation off wall-clock time via setInterval (robust to
 * background-tab throttling — requestAnimationFrame pauses entirely when backgrounded,
 * so the run could freeze; an elapsed-time interval always advances and completes).
 * Returns { stage, revealed, status }; calls onDone when calibrate finishes. */
function useAuditRun(active, onDone) {
  const [run, setRun] = useState({ stage: 0, revealed: 0, status: "running" });
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    if (!active) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const T_RETRIEVE = reduce ? 500 : 1200;
    const T_INFER = reduce ? 1100 : 3500;
    const T_CALIB = reduce ? 1500 : 5300;
    setRun({ stage: 0, revealed: 0, status: "running" });
    const start = Date.now();
    const id = setInterval(() => {
      const t = Date.now() - start;
      let stage = 0, revealed = 0;
      if (t < T_RETRIEVE) { stage = 0; revealed = 0; }
      else if (t < T_INFER) { stage = 1; revealed = Math.floor(((t - T_RETRIEVE) / (T_INFER - T_RETRIEVE)) * 8); }
      else if (t < T_CALIB) { stage = 2; revealed = Math.min(8, 5 + Math.floor(((t - T_INFER) / (T_CALIB - T_INFER)) * 3)); }
      else { clearInterval(id); setRun({ stage: 2, revealed: 8, status: "done" }); doneRef.current && doneRef.current(); return; }
      setRun({ stage, revealed, status: "running" });
    }, 70);
    return () => clearInterval(id);
  }, [active]);
  return run;
}

function PageHead({ sub, showCalib }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Your footprint</h1>
        <p className="page-sub">{sub}</p>
      </div>
      {showCalib && (
        <span className="calib">
          <span className="calib-dot" />
          Calibrated reliability
          <Tooltip
            className="tip-wide"
            side="bottom"
            label="Calibrated reliability is how often a guess like this is actually right in testing — not the model's raw confidence. The bar shows the calibrated interval."
          >
            <span className="info-btn" tabIndex={0} aria-label="What is calibrated reliability?"><Icon name="info" size={15} /></span>
          </Tooltip>
        </span>
      )}
    </div>
  );
}

function PreviewSwitch({ view, onChange }) {
  return (
    <div className="preview-switch" role="group" aria-label="Preview dashboard state">
      <span className="preview-switch-label"><Icon name="bar-chart-3" size={12} /> Preview state</span>
      <div className="preview-seg">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            className={view === v.key ? "is-active" : ""}
            aria-pressed={view === v.key}
            onClick={() => onChange(v.key)}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useTheme();
  const [lens, setLens] = useState(() => { try { return localStorage.getItem("iea_lens") || "balanced"; } catch (e) { return "balanced"; } });
  const [view, setView] = useViewState(VIEWS);
  const [safetyDismissed, setSafetyDismissed] = useState(() => { try { return localStorage.getItem("iea_safety_dismissed") === "1"; } catch (e) { return false; } });
  const [toast, fireToast] = useToast();

  useEffect(() => { try { localStorage.setItem("iea_lens", lens); } catch (e) {} }, [lens]);

  const run = useAuditRun(view === "loading", () => setView("loaded"));

  const ordered = orderFor(lens);
  const hasExtreme = ordered.some((a) => severityFor(a, lens) === "extreme");
  const showSafety = view === "loaded" && hasExtreme && !safetyDismissed;
  const dismissSafety = () => { setSafetyDismissed(true); try { localStorage.setItem("iea_safety_dismissed", "1"); } catch (e) {} };

  // run-status pill in the top bar reflects the view
  const runStatusByView = {
    loaded: <span className="run-status"><span className="run-dot" /> Audit complete <span className="run-time">· 2m ago</span></span>,
    loading: <span className="run-status"><span className="run-dot run-dot--run" /> Auditing your footprint…</span>,
    abstained: <span className="run-status"><span className="run-dot" /> Audit complete <span className="run-time">· 1m ago</span></span>,
    empty: <span className="run-status"><span className="run-dot run-dot--idle" /> No audit yet</span>,
    error: <span className="run-status"><span className="run-dot run-dot--fail" /> Audit didn’t finish</span>,
  };

  const onFix = (attr) => attr.code === "location"
    ? () => { window.location.href = "Attribution.html"; }
    : () => fireToast(`${attr.label}: in this prototype, the location finding is the fully wired walkthrough`);
  const onEvidence = (attr) => attr.code === "location" ? () => { window.location.href = "Attribution.html"; } : null;
  const onOpen = (attr) => attr.code === "location" ? () => { window.location.href = "Attribution.html"; } : null;

  return (
    <div className="app-root">
      <Topbar
        lens={lens} setLens={setLens} theme={theme} setTheme={setTheme}
        center={runStatusByView[view]}
        onAccount={(label) => fireToast(label === "Signed out" ? "Signed out" : `Opening: ${label}`)}
      />

      <main className="content">
        {view === "empty" && (
          <EmptyState
            icon="inbox"
            title="Nothing to analyze yet"
            message="Connect a read-only account or upload an export, and we’ll show you what an AI can infer about you."
            message2="Consent-first and advise-only — nothing runs until you say so."
            action="Connect or import"
            actionHref="Connect.html"
          />
        )}

        {view === "error" && (
          <ErrorState
            title="We couldn’t finish your audit"
            message="The run stopped before it completed — this is almost always a temporary connection issue, not a problem with your data."
            onRetry={() => setView("loading")}
            retryLabel="Re-run audit"
            details={"request_id: run_3b2c9f\nstage: infer\nreason: upstream timeout (504) after 30s\nyour data was not affected"}
          />
        )}

        {(view === "loaded" || view === "loading" || view === "abstained") && (
          <React.Fragment>
            <PageHead
              showCalib={view === "loaded"}
              sub={
                view === "loading"
                  ? "Running the attack on your own footprint — each card appears as it’s retrieved, inferred, and calibrated."
                  : view === "abstained"
                    ? "We ran the full attack on your footprint and couldn’t reliably infer anything. That’s a good result — here’s the honest breakdown."
                    : <React.Fragment>An AI read your public footprint and inferred {INFERRED_COUNT} of these 8 attributes about you. {LENS_COPY[lens]}</React.Fragment>
              }
            />

            {view === "loaded" && (
              <div className="page-meta">
                <b>{INFERRED_COUNT} of 8</b> inferred
                <span className="meta-mid" />
                <b>1</b> abstained
                <span className="meta-mid" />
                severity shown for the <b>{LENSES.find((l) => l.key === lens).label}</b> lens
              </div>
            )}
            {view === "abstained" && (
              <div className="page-meta">
                <b>0 of 8</b> inferred
                <span className="meta-mid" />
                <b>8</b> abstained — no signal
              </div>
            )}

            {view === "loading" && (
              <div className="run-progress-wrap">
                <RunProgress
                  title="Running your audit"
                  stages={STAGES}
                  current={run.stage}
                  status={run.status}
                  hint="This can take a moment. Results stream in as each attribute is calibrated — you don’t need to wait here."
                  onCancel={() => setView("empty")}
                />
              </div>
            )}

            {showSafety && (
              <div className="safety" role="note">
                <span className="safety-ic"><Icon name="shield" size={18} /></span>
                <span className="safety-txt">
                  <b>Concerned about your safety?</b> A precise location was inferred. Digital-safety and crisis resources are available — these are pointers, not advice.{" "}
                  <a tabIndex={0} role="button" onClick={() => fireToast("Opening safety resources")} onKeyDown={(e) => { if (e.key === "Enter") fireToast("Opening safety resources"); }}>View resources</a>
                </span>
                <button className="safety-x" aria-label="Dismiss" onClick={dismissSafety}><Icon name="x" size={16} /></button>
              </div>
            )}

            {view === "abstained" && (
              <div className="all-abstain-note" role="note">
                <span className="aan-ic"><Icon name="shield-check" size={18} /></span>
                <span className="aan-body">
                  <b>We couldn’t infer anything from your current footprint.</b> Every attribute came back “abstained — no signal.” We won’t manufacture a guess to fill the gap. This can change as you post more, so it’s worth re-running now and then — but for now, there’s little here to work with.
                </span>
              </div>
            )}

            <div className="grid" key={view + lens}>
              {view === "abstained"
                ? ATTRS.map((attr) => <AttributeCard key={attr.code} attr={{ ...attr, abstain: true }} level="abstain" />)
                : ordered.map((attr, i) => {
                    if (view === "loading" && i >= run.revealed) return <SkelCard key={attr.code} />;
                    return (
                      <AttributeCard
                        key={attr.code}
                        attr={attr}
                        level={severityFor(attr, lens)}
                        onFix={onFix(attr)}
                        onEvidence={onEvidence(attr)}
                        onOpen={onOpen(attr)}
                      />
                    );
                  })}
            </div>
          </React.Fragment>
        )}
      </main>

      <PreviewSwitch view={view} onChange={setView} />
      <Toast msg={toast} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
