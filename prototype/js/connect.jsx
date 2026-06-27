/* Connect / import (screen 5) — step 2: bring in the footprint.
 * Read-only OAuth + upload; live ingestion (parse → drop third-party → encrypt + embed);
 * a kept-vs-dropped transparency summary (we keep only your own data); retention choice. */
const DS = window.AdityaDesignSystem_25de17;
const { Button } = DS;
const Icon = window.Icon;
const { useTheme, useToast, Toast, Topbar, SetupSteps } = window.AppShell;
const { RunProgress, ErrorState, PreviewSwitch, useViewState } = window.States;
const { useState, useEffect, useRef } = React;

const OAUTH = [
  { id: "reddit", name: "Reddit", icon: "message-square", kind: "oauth", kept: 84, dropped: 22, desc: "Import your posts and comments. Read-only — we can never post, vote, or delete." },
  { id: "mastodon", name: "Mastodon", icon: "at-sign", kind: "oauth", kept: 61, dropped: 18, desc: "Connect your instance, read-only. Your toots and replies only." },
];
const UPLOADS = [
  { id: "x", name: "X archive", icon: "archive", kind: "upload", kept: 203, dropped: 57, desc: "X (Twitter) export" },
  { id: "reddit-export", name: "Reddit export", icon: "archive", kind: "upload", kept: 84, dropped: 22, desc: "Reddit GDPR export" },
  { id: "takeout", name: "Google Takeout", icon: "package", kind: "upload", kept: 140, dropped: 30, desc: "Photos, places & more" },
  { id: "photos", name: "Photos", icon: "image", kind: "upload", kept: 48, dropped: 6, desc: "Images with EXIF" },
];
const ALL = [...OAUTH, ...UPLOADS];

// import stages, fed to the shared RunProgress primitive
const STAGE_LABELS = ["Parsing items", "Dropping third-party", "Encrypting + embedding"];
const stageIndex = (p) => (p < 42 ? 0 : p < 76 ? 1 : 2);

const VIEWS = [
  { key: "connect", label: "Connect" },
  { key: "importing", label: "Importing" },
  { key: "error", label: "Error" },
];
// representative job for previewing the importing state (timer-independent)
const PREVIEW_JOB = { name: "Reddit", icon: "message-square", progress: 58, count: 61, total: 106 };

// per-source guidance shown when an upload can't be parsed / OAuth fails
const SOURCE_HINTS = [
  { name: "X archive", tip: "Upload the original tweets.zip from Settings → Your account → Download an archive — not a screenshot or partial export." },
  { name: "Reddit export", tip: "Use the .zip from reddit.com/settings/data-request once it's ready." },
  { name: "Google Takeout", tip: "Export “Location History” and “Photos” and upload the .zip (not individual files)." },
  { name: "Connecting an account", tip: "If you were linking Reddit or Mastodon, the authorization didn't finish — try again and approve read-only access." },
];

function SourceCard({ src, imported, busy, onConnect }) {
  return (
    <div className="src">
      <div className="src-ic"><Icon name={src.icon} size={20} /></div>
      <div className="src-body">
        <div className="src-name-row">
          <span className="src-name">{src.name}</span>
          <span className="src-tag">Read-only</span>
        </div>
        <p className="src-desc">{src.desc}</p>
        {imported
          ? <span className="src-done"><Icon name="check" size={15} stroke={2.5} /> Connected</span>
          : <Button size="sm" disabled={busy} onClick={() => onConnect(src)}><Icon name="link" size={14} /> Connect</Button>}
      </div>
    </div>
  );
}

function ImportRun({ job, onCancel }) {
  return (
    <RunProgress
      title={`Importing ${job.name} — ${job.count} of ${job.total} items`}
      stages={STAGE_LABELS}
      current={stageIndex(job.progress)}
      status="running"
      hint="We parse your items, drop anything that isn’t yours, then encrypt what’s left. You don’t need to wait here."
      onCancel={onCancel}
    />
  );
}

function ConnectError({ onRetry }) {
  return (
    <div className="connect-error">
      <ErrorState
        title="Couldn’t read that export"
        message="We couldn’t parse the file — this is almost always the wrong file or a partial download, not a problem on your end. Nothing was imported."
        onRetry={onRetry}
        retryLabel="Choose another file"
        details={"file: twitter-archive.zip\nreason: missing data/tweets.js — not a complete X archive"}
      />
      <div className="src-hints">
        <div className="src-hints-label">What usually fixes it</div>
        {SOURCE_HINTS.map((h) => (
          <div className="src-hint" key={h.name}>
            <Icon name="info" size={14} />
            <span><b>{h.name}</b> — {h.tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useTheme();
  const [toast, fireToast] = useToast();
  const [sources, setSources] = useState([]);
  const [job, setJob] = useState(null); // { ...src, progress, count, total }
  const [retention, setRetention] = useState("retain");
  const [view, setView] = useViewState(VIEWS);
  const intervalRef = useRef(null);

  const importedIds = sources.map((s) => s.id);
  // live job, or a representative job when previewing the importing state; plus the error preview
  const displayJob = job || (view === "importing" ? PREVIEW_JOB : null);
  const showError = view === "error";

  const startImport = (src) => {
    if (job || importedIds.includes(src.id)) return;
    const total = src.kept + src.dropped;
    const DURATION = 2200;
    const start = Date.now();
    setJob({ id: src.id, name: src.name, icon: src.icon, kind: src.kind, kept: src.kept, dropped: src.dropped, progress: 0, count: 0, total });
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / DURATION) * 100);
      if (p >= 100) {
        clearInterval(intervalRef.current);
        setSources((s) => [...s, { id: src.id, name: src.name, icon: src.icon, kind: src.kind, kept: src.kept, dropped: src.dropped }]);
        setJob(null);
        fireToast(`${src.name} imported`);
      } else {
        setJob((j) => (j ? { ...j, progress: p, count: Math.floor((p / 100) * total) } : j));
      }
    }, 70);
  };
  const cancelImport = () => { clearInterval(intervalRef.current); setJob(null); };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const keptTotal = sources.reduce((a, s) => a + s.kept, 0);
  const droppedTotal = sources.reduce((a, s) => a + s.dropped, 0);
  const total = keptTotal + droppedTotal;
  const keptPct = total ? (keptTotal / total) * 100 : 0;

  const stepCenter = <SetupSteps active="connect" />;

  return (
    <div className="app-root">
      <Topbar
        theme={theme} setTheme={setTheme} showLens={false}
        center={stepCenter}
        onAccount={(label) => fireToast(label === "Signed out" ? "Signed out" : `Opening: ${label}`)}
      />

      <main className="connect-wrap">
        <div className="connect-head">
          <h1 className="connect-title">Bring in your footprint</h1>
          <p className="connect-sub">Connect a read-only account or upload an export. We import only the data you created — and you'll see exactly what we kept and dropped.</p>
          <div className="connect-trust">
            <span className="trust-item"><Icon name="shield-check" size={15} /> Read-only access</span>
            <span className="trust-item"><Icon name="lock" size={15} /> Encrypted at rest</span>
            <span className="trust-item"><Icon name="user" size={15} /> Your data only</span>
            <span className="trust-item"><Icon name="trash-2" size={15} /> Erase anytime</span>
          </div>
        </div>

        <p className="connect-section-label">Connect a read-only account</p>
        <div className="src-grid">
          {OAUTH.map((src) => (
            <SourceCard key={src.id} src={src} imported={importedIds.includes(src.id)} busy={!!displayJob || showError} onConnect={startImport} />
          ))}
        </div>
        <div className="x-note">
          <Icon name="info" size={16} />
          <span><b>X (Twitter)</b> doesn't offer read-only import. Download your X archive and upload it below instead.</span>
        </div>

        <p className="connect-section-label">Or upload an export</p>
        <div
          className="dropzone"
          role="button"
          tabIndex={0}
          onClick={() => startImport(UPLOADS[0])}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startImport(UPLOADS[0]); } }}
          aria-label="Upload an export file"
        >
          <div className="dropzone-ic"><Icon name="upload" size={20} /></div>
          <div className="dropzone-t">Drop an export here, or click to browse</div>
          <div className="dropzone-d">Nothing leaves your control — files are parsed, then encrypted on our side.</div>
        </div>
        <div className="upload-formats">
          {UPLOADS.map((src) => (
            <button key={src.id} className="fmt-chip" disabled={!!displayJob || showError || importedIds.includes(src.id)} onClick={() => startImport(src)}>
              <Icon name={importedIds.includes(src.id) ? "check" : src.icon} size={15} /> {src.name}
            </button>
          ))}
        </div>

        {displayJob && <div style={{ marginTop: "var(--space-6)" }}><ImportRun job={displayJob} onCancel={() => { cancelImport(); setView("connect"); }} /></div>}

        {showError && <div style={{ marginTop: "var(--space-6)" }}><ConnectError onRetry={() => setView("connect")} /></div>}

        {sources.length > 0 && !displayJob && !showError && (
          <div className="imported">
            <div className="src-chips">
              {sources.map((s) => (
                <span className="src-chip" key={s.id}>
                  <Icon name="check" size={14} stroke={2.5} /> <b>{s.name}</b>
                  <span className="chip-meta">· {s.kept} kept</span>
                </span>
              ))}
              <button className="fmt-chip" disabled={!!job || sources.length === ALL.length} onClick={() => { const next = ALL.find((s) => !importedIds.includes(s.id)); if (next) startImport(next); }}>
                <Icon name="plus" size={15} /> Add another
              </button>
            </div>

            <div className="kvd">
              <div className="kvd-title">What we imported</div>
              <div className="kvd-stats">
                <div className="kvd-stat kvd-kept">
                  <span className="kvd-stat-ic"><Icon name="check" size={16} stroke={2.5} /></span>
                  <div><span className="kvd-num">{keptTotal}</span> <span className="kvd-stat-label"><b>your own items</b> kept</span></div>
                </div>
                <div className="kvd-stat kvd-dropped">
                  <span className="kvd-stat-ic"><Icon name="x" size={16} /></span>
                  <div><span className="kvd-num">{droppedTotal}</span> <span className="kvd-stat-label"><b>third-party items</b> dropped</span></div>
                </div>
              </div>
              <div className="kvd-bar">
                <div className="kvd-bar-kept" style={{ width: `${keptPct}%` }} />
                <div className="kvd-bar-dropped" style={{ width: `${100 - keptPct}%` }} />
              </div>
              <div className="kvd-legend">
                <span><span className="kvd-dot kvd-dot--kept" /> Kept (yours)</span>
                <span><span className="kvd-dot kvd-dot--dropped" /> Dropped (others')</span>
              </div>
              <p className="kvd-note">We only keep data <b>you</b> created. Others' replies, quotes, reposts, and people in your photos were dropped at import — they're not yours to audit.</p>
            </div>

            <hr className="imported-sep" />

            <div className="ret-label">How should we hold your data?</div>
            <p className="ret-hint">You can change this or erase everything anytime in Account.</p>
            <div className="retention" role="radiogroup" aria-label="Data retention">
              <label className="ret-card">
                <input type="radio" name="retention" value="retain" checked={retention === "retain"} onChange={() => setRetention("retain")} />
                <div className="ret-head">
                  <Icon name="lock" size={17} />
                  <span className="ret-name">Retain, encrypted</span>
                  <span className="ret-check"><Icon name="check" size={11} stroke={3} /></span>
                </div>
                <p className="ret-desc">Keep your imported data encrypted so you can re-run the audit and prove your before → after over time. Crypto-shred it anytime.</p>
              </label>
              <label className="ret-card">
                <input type="radio" name="retention" value="discard" checked={retention === "discard"} onChange={() => setRetention("discard")} />
                <div className="ret-head">
                  <Icon name="trash-2" size={17} />
                  <span className="ret-name">Process, then discard</span>
                  <span className="ret-check"><Icon name="check" size={11} stroke={3} /></span>
                </div>
                <p className="ret-desc">Analyze now and delete the raw data immediately after. We keep only the findings — not your content. Re-running later means importing again.</p>
              </label>
            </div>

            <div className="run-row">
              <Button onClick={() => { window.location.href = "Dashboard.html?state=loading"; }}>
                Run my audit <Icon name="arrow-right" size={15} />
              </Button>
              <span className="run-note">This starts the attack run on your own footprint. You'll land on the reveal — what an AI can infer about you.</span>
            </div>
          </div>
        )}

        {sources.length === 0 && !displayJob && !showError && (
          <div className="imported-empty">Nothing imported yet — connect or upload above to begin. We'll show you exactly what we keep.</div>
        )}
      </main>

      <PreviewSwitch views={VIEWS} view={view} onChange={setView} />
      <Toast msg={toast} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
