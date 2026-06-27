/* Defend simulation (screen 4) — the signature before→after.
 * Headline = the value-recovery flip (proven by a held-out independent adversary);
 * the calibrated drop with intervals is the magnitude. Frontier: generalize → stronger
 * → remove → [opt-in] decoy (off by default, global opt-in + per-use confirm).
 * Advise-only: CTAs copy/download; the tool never posts, edits, or deletes. */
const DS = window.AdityaDesignSystem_25de17;
const { Button, Dialog } = DS;
const Icon = window.Icon;
const { useTheme, useToast, Toast, Topbar } = window.AppShell;
const { RunProgress, ErrorState, PreviewSwitch, useViewState } = window.States;
const { TARGET, OPTIONS, DECOY_BACKFIRE } = window.IEA_DEFEND;
const { useState, useEffect, useRef } = React;

const VIEWS = [
  { key: "loaded", label: "Proven" },
  { key: "loading", label: "Loading" },
  { key: "unproven", label: "Within noise" },
  { key: "nomeaning", label: "Can’t break" },
  { key: "error", label: "Error" },
];
const DEFEND_STAGES = ["Find the minimal set", "Draft edits", "Re-attack & prove"];

// Honest "within noise" outcome — the edit nudged the number, but the before/after
// calibrated intervals overlap, so we can't claim a real drop.
const NOISE = { before: 0.86, beforeLo: 0.81, beforeHi: 0.90, after: 0.79, afterLo: 0.73, afterHi: 0.86 };
// the post whose identifying detail is load-bearing (can't-break)
const LOADBEARING = {
  src: "Mastodon · @marta", date: "9 Mar",
  before: "the 24", after: 0.71, afterLo: 0.64, afterHi: 0.78,
};

/* Defend run sim — setInterval on elapsed wall-clock (robust to tab throttling). */
function useDefendRun(active, onDone) {
  const [run, setRun] = useState({ stage: 0, status: "running" });
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    if (!active) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ends = reduce ? [600, 1200, 1800] : [2200, 4600, 7200]; // longer run
    setRun({ stage: 0, status: "running" });
    const start = Date.now();
    const id = setInterval(() => {
      const t = Date.now() - start;
      if (t >= ends[2]) { clearInterval(id); setRun({ stage: 2, status: "done" }); doneRef.current && doneRef.current(); return; }
      const stage = t < ends[0] ? 0 : t < ends[1] ? 1 : 2;
      setRun({ stage, status: "running" });
    }, 80);
    return () => clearInterval(id);
  }, [active]);
  return run;
}

function IntervalCompare() {
  // zoomed domain [0.6, 1.0] so the overlap is legible
  const D0 = 0.6, D1 = 1.0;
  const x = (v) => ((v - D0) / (D1 - D0)) * 100;
  const oLo = Math.max(NOISE.afterLo, NOISE.beforeLo), oHi = Math.min(NOISE.afterHi, NOISE.beforeHi);
  return (
    <div className="ivl">
      <div className="ivl-row">
        <span className="ivl-label">Before</span>
        <span className="ivl-track">
          <span className="ivl-axis" />
          <span className="ivl-overlap" style={{ left: `${x(oLo)}%`, width: `${x(oHi) - x(oLo)}%` }} />
          <span className="ivl-band ivl-band--before" style={{ left: `${x(NOISE.beforeLo)}%`, width: `${x(NOISE.beforeHi) - x(NOISE.beforeLo)}%` }} />
          <span className="ivl-point ivl-point--before" style={{ left: `${x(NOISE.before)}%` }} />
        </span>
        <span className="ivl-vals">{NOISE.before.toFixed(2)} <span className="ivl-pt">[{NOISE.beforeLo.toFixed(2)}–{NOISE.beforeHi.toFixed(2)}]</span></span>
      </div>
      <div className="ivl-row">
        <span className="ivl-label">After</span>
        <span className="ivl-track">
          <span className="ivl-axis" />
          <span className="ivl-overlap" style={{ left: `${x(oLo)}%`, width: `${x(oHi) - x(oLo)}%` }} />
          <span className="ivl-band ivl-band--after" style={{ left: `${x(NOISE.afterLo)}%`, width: `${x(NOISE.afterHi) - x(NOISE.afterLo)}%` }} />
          <span className="ivl-point ivl-point--after" style={{ left: `${x(NOISE.after)}%` }} />
        </span>
        <span className="ivl-vals">{NOISE.after.toFixed(2)} <span className="ivl-pt">[{NOISE.afterLo.toFixed(2)}–{NOISE.afterHi.toFixed(2)}]</span></span>
      </div>
      <div className="ivl-scale"><span>0.60</span><span>1.00</span></div>
      <div className="ivl-foot"><Icon name="circle-alert" size={14} /> The intervals overlap — the “drop” sits inside run-to-run noise.</div>
    </div>
  );
}

function DiffText({ segs }) {
  return (
    <p className="diff-text">
      {segs.map((s, i) => {
        if (s.t === "del") return <del key={i}>{s.v}</del>;
        if (s.t === "ins") return <ins key={i}>{s.v}</ins>;
        if (s.t === "insf") return <ins key={i} className="ins-false">{s.v}</ins>;
        return <React.Fragment key={i}>{s.v}</React.Fragment>;
      })}
    </p>
  );
}

function DiffItem({ edit }) {
  let action, body;
  if (edit.remove) {
    action = ["remove", "Remove"];
    body = <p className="diff-removed">{edit.original}</p>;
  } else if (edit.exif) {
    action = ["strip", "Strip GPS"];
    body = <div className="diff-exif"><Icon name="map-pin" size={16} /> Remove GPS metadata{edit.crop ? " and crop the identifying skyline" : ""}</div>;
  } else if (edit.decoy) {
    action = ["decoy", "Decoy"];
    body = (
      <>
        <DiffText segs={edit.segs} />
        <div className="diff-falseflag"><Icon name="triangle-alert" size={14} /> This publishes a statement that isn't true.</div>
      </>
    );
  } else {
    action = ["edit", "Rewrite"];
    body = <DiffText segs={edit.segs} />;
  }
  return (
    <div className="diff-item">
      <div className="diff-src">
        <Icon name={edit.exif || /Photo/.test(edit.src) ? "image" : "file-text"} size={14} />
        {edit.src} <span className="diff-date">· {edit.date}</span>
        <span className={`diff-action diff-action--${action[0]}`}>{action[1]}</span>
      </div>
      {body}
      {edit.note && <p className="diff-note">{edit.note}</p>}
    </div>
  );
}

function Hero({ opt }) {
  const decoy = opt.key === "decoy";
  const drop = TARGET.before - opt.after;
  return (
    <div className="hero">
      <div className="recovery">
        <div className="recov-head">
          {decoy
            ? <>An independent adversary is now <b>misled to the wrong city</b> — not where you actually live.</>
            : <>An independent adversary can <b>no longer recover your city</b>.</>}
        </div>
        <div className="recov-flow">
          <span className="recov-pill recov-before">recovered <span className="recov-val">{TARGET.value}</span></span>
          <Icon name="arrow-right" className="recov-arrow" size={18} />
          {decoy
            ? <span className="recov-pill recov-decoy"><Icon name="triangle-alert" size={14} /> guesses {opt.misled} — false</span>
            : <span className="recov-pill recov-after"><Icon name="shield-check" size={14} /> not recovered</span>}
        </div>
      </div>

      <div className="magnitude">
        <div className="mag-num mag-before">
          <span className="mag-big">{TARGET.before.toFixed(2)}</span>
          <span className="mag-ci">[{TARGET.beforeLo.toFixed(2)}–{TARGET.beforeHi.toFixed(2)}]</span>
          <span className="mag-cap">calibrated reliability before</span>
        </div>
        <div className="mag-arrow"><Icon name="arrow-right" size={22} /><span className="mag-drop">−{drop.toFixed(2)}</span></div>
        <div className="mag-num mag-after">
          <span className="mag-big">{opt.after.toFixed(2)}</span>
          <span className="mag-ci">[{opt.lo.toFixed(2)}–{opt.hi.toFixed(2)}]</span>
          <span className="mag-cap">{decoy ? "reliability on your true city" : "after this fix"}</span>
        </div>
      </div>

      <div className="hero-proof">
        <span className="proof-badge"><Icon name="shield-check" size={13} /> Proven by an independent adversary</span>
        <span className="proof-badge proof-badge--muted"><Icon name="check" size={13} /> Beats run-to-run noise</span>
        <span className="proof-note">
          A <b>different</b> model re-attacked the edited content, blind to the change — not the rewriter scoring itself.
          The value-recovery flip is the safety signal; the calibrated drop, with intervals, is the magnitude.
        </span>
      </div>
    </div>
  );
}

function FrontierOption({ opt, selected, decoyEnabled, onSelect }) {
  const cls = ["opt", selected && "opt--selected", opt.key === "decoy" && "opt--decoy"].filter(Boolean).join(" ");
  return (
    <button className={cls} role="radio" aria-checked={selected} onClick={() => onSelect(opt)}>
      <div className="opt-head">
        <span className="opt-name">{opt.name}</span>
        {opt.recommended && <span className="opt-tag opt-tag--rec">Recommended</span>}
        {opt.optIn && !decoyEnabled && <span className="opt-tag opt-tag--lock"><Icon name="lock" size={11} /> Opt-in</span>}
      </div>
      <div className="opt-after">
        <span className="opt-after-num">{opt.after.toFixed(2)}</span>
        <span className="opt-after-ci">[{opt.lo.toFixed(2)}–{opt.hi.toFixed(2)}]</span>
      </div>
      <div className="opt-util">
        {opt.utility > 0 && (
          <>
            <div className="opt-util-bar"><div className="opt-util-fill" style={{ width: `${opt.utility}%` }} /></div>
            <div className="opt-util-label"><span>{opt.utilityLabel}</span><span className="opt-util-pct">{opt.utility}%</span></div>
          </>
        )}
        {opt.utility === 0 && <div className="opt-util-label"><span>{opt.utilityLabel}</span></div>}
        {opt.utility === null && <div className="opt-util-label"><span style={{ color: "var(--warning-foreground)" }}>{opt.utilityLabel}</span></div>}
      </div>
      <p className="opt-desc">{opt.desc}</p>
    </button>
  );
}

function NotProvenResult({ onStronger, onRemove }) {
  return (
    <div className="result result--inconclusive">
      <span className="result-flag result-flag--inconclusive"><Icon name="circle-alert" size={14} /> Not proven — within noise</span>
      <h2 className="result-head">We couldn’t prove a real drop</h2>
      <p className="result-body">
        This edit nudged the number down, but not beyond what we’d see just from re-running the same attack twice. We won’t call that a win. <b>Your city is still recoverable</b> — treat this as no change, not a safe result.
      </p>
      <IntervalCompare />
      <div className="result-next">
        <div className="result-next-label">Honest next steps</div>
        <div className="result-next-row">
          <Button onClick={onStronger}>Try a stronger edit <Icon name="arrow-right" size={15} /></Button>
          <Button variant="secondary" onClick={onRemove}><Icon name="trash-2" size={15} /> Remove the post instead</Button>
        </div>
      </div>
    </div>
  );
}

function CantBreakResult({ onRemove, onAccept }) {
  const lb = LOADBEARING;
  return (
    <div className="result">
      <span className="result-flag result-flag--blocked"><Icon name="circle-minus" size={14} /> No clean break found</span>
      <h2 className="result-head">No small edit breaks this without changing what you said</h2>
      <p className="result-body">
        The detail that pins your city is the same detail that makes the post worth posting. Generalizing it enough to fool an independent adversary would <b>change what you actually said</b> — so we won’t pretend a light edit works here.
      </p>
      <div className="lb">
        <div className="lb-src"><Icon name="file-text" size={14} /> {lb.src} <span className="ev-date">· {lb.date}</span></div>
        <p className="lb-text">The <mark>28</mark> is a tourist sardine can now — locals just take <mark>the 24</mark> up to <mark>Graça</mark>.</p>
        <p className="lb-note">The highlighted detail is load-bearing: it’s both what reveals your city and what gives the post its meaning.</p>
      </div>
      <div className="paths-2">
        <div className="path2 path2--remove">
          <div className="path2-head"><span className="path2-ic"><Icon name="trash-2" size={17} /></span><span className="path2-t">Remove the post</span></div>
          <p className="path2-d">The only way to actually break this inference. You lose the post, but the city signal goes with it.</p>
          <Button onClick={onRemove}><Icon name="copy" size={15} /> Copy removal list</Button>
        </div>
        <div className="path2 path2--accept">
          <div className="path2-head"><span className="path2-ic"><Icon name="shield-alert" size={17} /></span><span className="path2-t">Accept residual exposure</span></div>
          <div className="path2-residual"><span className="pr-num">{lb.after.toFixed(2)}</span><span className="pr-ci">[{lb.afterLo.toFixed(2)}–{lb.afterHi.toFixed(2)}]</span></div>
          <p className="path2-d">Keep the post as-is. Your city stays recoverable at this calibrated reliability — <b>an honest residual, not a safe state.</b></p>
          <Button variant="secondary" onClick={onAccept}>Keep it &amp; understand the risk</Button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useTheme();
  const [lens, setLens] = useState(() => { try { return localStorage.getItem("iea_lens") || "balanced"; } catch (e) { return "balanced"; } });
  const [toast, fireToast] = useToast();
  const [selectedKey, setSelectedKey] = useState("minimal");
  const [decoyEnabled, setDecoyEnabled] = useState(() => { try { return localStorage.getItem("iea_decoy") === "1"; } catch (e) { return false; } });
  const [dialog, setDialog] = useState(null); // null | 'optin' | 'confirm'
  const [view, setView] = useViewState(VIEWS);
  const run = useDefendRun(view === "loading", () => setView("loaded"));

  useEffect(() => { try { localStorage.setItem("iea_lens", lens); } catch (e) {} }, [lens]);
  useEffect(() => { try { localStorage.setItem("iea_decoy", decoyEnabled ? "1" : "0"); } catch (e) {} }, [decoyEnabled]);

  const opt = OPTIONS.find((o) => o.key === selectedKey);

  const selectOption = (o) => {
    if (o.key !== "decoy") { setSelectedKey(o.key); return; }
    // decoy: never selected directly — global opt-in, then per-use confirm
    if (!decoyEnabled) setDialog("optin");
    else setDialog("confirm");
  };
  const enableDecoy = () => { setDecoyEnabled(true); setDialog("confirm"); };
  const confirmDecoy = () => { setSelectedKey("decoy"); setDialog(null); };
  const disableDecoy = () => { setDecoyEnabled(false); if (selectedKey === "decoy") setSelectedKey("minimal"); };

  const crumbs = (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href="Dashboard.html">Dashboard</a>
      <Icon name="chevron-right" size={14} />
      <a href="Attribution.html">Current location</a>
      <Icon name="chevron-right" size={14} />
      <span className="crumb-here">Break this</span>
    </nav>
  );

  const diffMeta = opt.remove ? "removals" : opt.key === "decoy" ? "decoy suggestion" : "edits";

  return (
    <div className="app-root">
      <Topbar
        lens={lens} setLens={setLens} theme={theme} setTheme={setTheme}
        center={crumbs}
        onAccount={(label) => fireToast(label === "Signed out" ? "Signed out" : `Opening: ${label}`)}
      />

      <main className="defend-wrap">
        <div className="defend-head">
          <h1 className="defend-title">Break this inference</h1>
          <p className="defend-sub">
            Targeting your <b>{TARGET.attribute.toLowerCase()}</b> — Lisbon, Portugal.{" "}
            {view === "loading" ? "Running the rewrite-and-prove loop now."
              : view === "unproven" || view === "nomeaning" ? "Here’s the honest outcome."
                : view === "error" ? "Something interrupted the run."
                  : "Pick how far to go on the privacy ⁄ utility frontier; the proven result updates below."}
          </p>
        </div>

        {view === "loading" && (
          <div className="run-progress-wrap">
            <RunProgress
              title="Proving your rewrite"
              stages={DEFEND_STAGES}
              current={run.stage}
              status={run.status}
              hint="Longer than a scan — we draft edits, then re-attack to check they actually hold up."
              onCancel={() => setView("loaded")}
            />
            <div className="prove-line"><Icon name="shield-check" size={15} /> <span><b>Proving against an independent adversary</b> — a different model re-attacks your edited content, blind to the change.</span></div>
          </div>
        )}

        {view === "error" && (
          <ErrorState
            title="The simulation didn’t finish"
            message="The rewrite-and-prove run stopped before it completed — almost always a temporary issue, not a problem with your data."
            onRetry={() => setView("loading")}
            retryLabel="Re-run simulation"
            details={"request_id: def_9a17c4\nstage: re-attack\nreason: adversary worker timeout (504)"}
          />
        )}

        {view === "unproven" && (
          <NotProvenResult
            onStronger={() => { setSelectedKey("stronger"); setView("loaded"); }}
            onRemove={() => { setSelectedKey("remove"); setView("loaded"); }}
          />
        )}

        {view === "nomeaning" && (
          <CantBreakResult
            onRemove={() => { setSelectedKey("remove"); setView("loaded"); fireToast("Switched to remove — the only clean break"); }}
            onAccept={() => fireToast("Keeping the post — residual exposure acknowledged")}
          />
        )}

        {view === "loaded" && (
        <React.Fragment>
        <Hero opt={opt} />

        <p className="section-label">Privacy ⁄ utility frontier</p>
        <p className="section-hint">More privacy costs more of your voice. Truthful options first; the decoy is off by default.</p>
        <div className="frontier" role="radiogroup" aria-label="Remediation options">
          {OPTIONS.map((o) => (
            <FrontierOption key={o.key} opt={o} selected={selectedKey === o.key} decoyEnabled={decoyEnabled} onSelect={selectOption} />
          ))}
        </div>
        {decoyEnabled && (
          <div className="decoy-status decoy-status-on" style={{ marginTop: "var(--space-3)" }}>
            <Icon name="triangle-alert" size={14} /> Decoy mode is on.
            <button className="verify-undo" style={{ marginTop: 0 }} onClick={disableDecoy}>Turn off</button>
          </div>
        )}

        <p className="section-label">Suggested {diffMeta}</p>
        <div className="diff">
          <div className="diff-head">
            <span className="diff-head-t">{opt.name}</span>
            <span className="diff-head-meta">{opt.edits.length} {opt.edits.length === 1 ? "item" : "items"} · the minimal set ablation flagged</span>
          </div>
          {opt.edits.map((edit, i) => <DiffItem key={i} edit={edit} />)}
        </div>

        <div className="nofalse" role="note">
          <Icon name="shield-alert" className="nofalse-ic" size={20} />
          <div className="nofalse-body">
            <b className="nofalse-lead">No false safety.</b> This is evidence, not proof. One independent adversary could no longer recover your city — a stronger or future model still might, and copies others already saved (screenshots, archives, reposts) can't be recalled. Reducing exposure is not erasing it.
            {lens === "atrisk" && <> <b>Because safety matters most for you, treat this as lowered risk, never a guarantee.</b></>}
          </div>
        </div>

        <div className="defend-actions">
          {opt.remove ? (
            <Button onClick={() => fireToast("Copied the removal list")}><Icon name="copy" size={15} /> Copy removal list</Button>
          ) : opt.key === "decoy" ? (
            <Button className="btn-warn" onClick={() => fireToast("Copied the decoy text")}><Icon name="copy" size={15} /> Copy the decoy text</Button>
          ) : (
            <>
              <Button onClick={() => fireToast("Copied the rewrite to your clipboard")}><Icon name="copy" size={15} /> Copy the rewrite</Button>
              <Button variant="secondary" onClick={() => fireToast("Downloading photo with GPS removed")}><Icon name="download" size={15} /> Download photo (GPS stripped)</Button>
            </>
          )}
          <span className="advise-note"><b>Advise-only.</b> We never post, edit, or delete for you — you copy this and make the change yourself.</span>
        </div>
        </React.Fragment>
        )}
      </main>

      {/* Decoy global opt-in */}
      <Dialog
        open={dialog === "optin"}
        onClose={() => setDialog(null)}
        title="Turn on decoy mode?"
        description="It's off by default. Please read this first."
        footer={<>
          <Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button>
          <Button className="btn-warn" onClick={enableDecoy}>Turn on decoy mode</Button>
        </>}
      >
        <div className="decoy-warn">
          <Icon name="triangle-alert" size={18} />
          <div className="decoy-warn-t"><b>Decoy mode suggests publishing a falsehood about yourself</b> — a misleading clue so an adversary confidently guesses the wrong value.</div>
        </div>
        <ul className="decoy-list">
          <li><Icon name="shield-alert" size={15} /> {DECOY_BACKFIRE[lens]}</li>
          <li><Icon name="check" size={15} /> Truthful options stay available and are never replaced or auto-selected.</li>
          <li><Icon name="check" size={15} /> You'll confirm again each time before any decoy text is shown.</li>
        </ul>
      </Dialog>

      {/* Decoy per-use confirm */}
      <Dialog
        open={dialog === "confirm"}
        onClose={() => setDialog(null)}
        title="Show the decoy suggestion?"
        description="Decoy mode is on. This confirmation repeats every time."
        footer={<>
          <Button variant="secondary" onClick={() => setDialog(null)}>Use a truthful option</Button>
          <Button className="btn-warn" onClick={confirmDecoy}>Show decoy suggestion</Button>
        </>}
      >
        <div className="decoy-warn">
          <Icon name="triangle-alert" size={18} />
          <div className="decoy-warn-t"><b>This suggests publishing something untrue</b> about where you live. {DECOY_BACKFIRE[lens]}</div>
        </div>
      </Dialog>

      <Toast msg={toast} />
      <PreviewSwitch views={VIEWS} view={view} onChange={setView} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
