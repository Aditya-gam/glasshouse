/* Accuracy / trust (screen 7) — public credibility page.
 * SynthPAI top-1/top-3 per attribute, the calibration reliability diagram, the
 * medical-test analogy, and a humble (interval-reported) image-accuracy framing. */
const DS = window.AdityaDesignSystem_25de17;
const { Button, IconButton } = DS;
const Icon = window.Icon;
const { useState, useEffect } = React;
const { EmptyState, ErrorState, PreviewSwitch, useViewState, Sk } = window.States;

const VIEWS = [
  { key: "loaded", label: "Loaded" },
  { key: "loading", label: "Loading" },
  { key: "empty", label: "No benchmark" },
  { key: "error", label: "Error" },
];

// SynthPAI measured accuracy (text). Synthetic, human-verified labels.
const BENCH = [
  { label: "Sex", top1: 88, top3: 96 },
  { label: "Location", top1: 84, top3: 94 },
  { label: "Age", top1: 71, top3: 89 },
  { label: "Occupation", top1: 78, top3: 91 },
  { label: "Relationship", top1: 74, top3: 88 },
  { label: "Education", top1: 69, top3: 86 },
  { label: "Birthplace", top1: 61, top3: 79 },
  { label: "Income", top1: 52, top3: 74 },
];

// calibration curve for location (text): predicted vs empirical
const CALIB = [
  [0.1, 0.09], [0.2, 0.18], [0.3, 0.27], [0.4, 0.37], [0.5, 0.47],
  [0.6, 0.55], [0.7, 0.66], [0.8, 0.76], [0.9, 0.85],
];

function useTheme() {
  const [t, setT] = useState(() => { try { return localStorage.getItem("iea_theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch (e) { return "light"; } });
  useEffect(() => { document.documentElement.classList.toggle("dark", t === "dark"); try { localStorage.setItem("iea_theme", t); } catch (e) {} }, [t]);
  return [t, setT];
}

function CalibrationChart() {
  // viewBox 200x200; plot area x:[30,190], y:[10,170] (y inverted)
  const X0 = 30, X1 = 190, Y0 = 170, Y1 = 10;
  const px = (p) => X0 + p * (X1 - X0);
  const py = (e) => Y0 - e * (Y0 - Y1);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const pts = CALIB.map(([p, e]) => `${px(p).toFixed(1)},${py(e).toFixed(1)}`).join(" ");
  const hi = CALIB.find(([p]) => p === 0.8);
  return (
    <svg className="calib-svg" viewBox="0 0 200 200" role="img" aria-label="Calibration reliability diagram: predicted reliability versus measured accuracy for location. A 0.80 prediction is right about 0.76 of the time.">
      {/* gridlines + ticks */}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={px(t)} y1={Y1} x2={px(t)} y2={Y0} stroke="var(--border)" strokeWidth="0.5" />
          <line x1={X0} y1={py(t)} x2={X1} y2={py(t)} stroke="var(--border)" strokeWidth="0.5" />
          <text className="calib-tick" x={px(t)} y={Y0 + 9} textAnchor="middle">{t.toFixed(2)}</text>
          <text className="calib-tick" x={X0 - 5} y={py(t) + 3} textAnchor="end">{t.toFixed(2)}</text>
        </g>
      ))}
      {/* perfect-calibration diagonal */}
      <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} stroke="var(--subtle-foreground)" strokeWidth="1" strokeDasharray="3 3" />
      {/* engine curve */}
      <polyline points={pts} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {CALIB.map(([p, e]) => <circle key={p} cx={px(p)} cy={py(e)} r="2.4" fill="var(--primary)" />)}
      {/* highlight 0.8 → 0.76 */}
      {hi && <>
        <circle cx={px(0.8)} cy={py(hi[1])} r="4" fill="none" stroke="var(--accent-text)" strokeWidth="1.5" />
        <line x1={px(0.8)} y1={py(hi[1])} x2={px(0.8)} y2={Y0} stroke="var(--accent-text)" strokeWidth="0.5" strokeDasharray="2 2" />
      </>}
      {/* axis labels */}
      <text className="calib-axis-label" x={(X0 + X1) / 2} y="194" textAnchor="middle">Predicted reliability</text>
      <text className="calib-axis-label" x="10" y={(Y0 + Y1) / 2} textAnchor="middle" transform={`rotate(-90 10 ${(Y0 + Y1) / 2})`}>Measured accuracy</text>
    </svg>
  );
}

function BenchSkeleton() {
  return (
    <div className="bench" aria-hidden="true">
      <div className="bench-legend"><Sk className="skb-legend" /><Sk className="skb-legend" /></div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="bench-row" key={i}>
          <Sk className="skb-label" />
          <Sk className="skb-track" />
          <Sk className="skb-vals" />
        </div>
      ))}
    </div>
  );
}

function CalibSkeleton() {
  return (
    <div className="calib-grid" aria-hidden="true">
      <div className="calib-card"><Sk className="skc-square" /></div>
      <div>
        <Sk className="skc-callout" />
        <Sk className="skc-ece" />
      </div>
    </div>
  );
}

function BenchmarkSection({ loading }) {
  return (
    <section className="trust-sec">
      <p className="sec-eyebrow"><Icon name="bar-chart-3" size={14} /> The benchmark</p>
      <h2 className="trust-h2">Measured accuracy, per attribute</h2>
      <p className="trust-p">We run the <b>exact same engine</b> used on your footprint over <b>SynthPAI</b> — synthetic, Reddit-style profiles with human-verified labels (no real people). For each attribute we report <b>top-1</b> (the single best guess) and <b>top-3</b> (correct within three).</p>
      {loading ? <BenchSkeleton /> : (
        <div className="bench">
          <div className="bench-legend">
            <span><span className="bench-key bench-key--top1" /> Top-1 accuracy</span>
            <span><span className="bench-key bench-key--top3" /> Top-3 accuracy</span>
          </div>
          {BENCH.map((b) => (
            <div className="bench-row" key={b.label}>
              <div className="bench-label">{b.label}</div>
              <div className="bench-track">
                <div className="bench-top3" style={{ width: `${b.top3}%` }} />
                <div className="bench-top1" style={{ width: `${b.top1}%` }} />
              </div>
              <div className="bench-vals"><b>{b.top1}</b> / {b.top3}%</div>
            </div>
          ))}
          <p className="bench-foot">Categorical attributes (sex, relationship) score exact-match; location and birthplace use graded geographic matching; age and income use tolerance bands. Harder attributes like income are honestly lower — we don't average them away.</p>
        </div>
      )}
    </section>
  );
}

function CalibrationSection({ loading }) {
  return (
    <section className="trust-sec">
      <p className="sec-eyebrow"><Icon name="gauge" size={14} /> Calibration</p>
      <h2 className="trust-h2">A score that means what it says</h2>
      <p className="trust-p">A model saying "0.8" is meaningless until you check how often a 0.8 is actually right. We bucket every guess by confidence and measure the real hit-rate — per attribute — then show you <b>that</b> number, not the model's raw output.</p>
      {loading ? <CalibSkeleton /> : (
        <div className="calib-grid">
          <div className="calib-card">
            <CalibrationChart />
          </div>
          <div>
            <div className="calib-callout-box">
              <div className="calib-callout-eq">0.80 predicted → 0.76 actual</div>
              <div className="calib-callout-t">For location, a guess the model rates 0.80 turns out right about 76% of the time. The dashed line is perfect calibration; our curve sits just under it — slightly humble, never overconfident.</div>
            </div>
            <div className="calib-ece">
              <span className="calib-ece-v">0.04</span>
              <span className="calib-ece-l">Expected calibration error across attributes. The closer the curve hugs the diagonal, the lower this is.</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyData() {
  return (
    <section className="trust-sec">
      <EmptyState
        icon="bar-chart-3"
        title="No benchmark yet"
        message="Run the eval to populate this page. We score the engine on SynthPAI — a public set of synthetic profiles with known answers — then calibrate every reliability number against it."
        message2="Until then, the medical-test analogy below explains what these numbers will mean."
        action="Run the eval"
        onAction={() => {}}
      />
    </section>
  );
}

function ErrorData({ onRetry }) {
  return (
    <section className="trust-sec">
      <ErrorState
        title="Couldn’t load the benchmark"
        message="We couldn’t fetch the latest eval results — almost always a temporary connection issue. The numbers themselves are fine."
        onRetry={onRetry}
        retryLabel="Try again"
        details={"request_id: bench_5c2e10\nreason: results service unavailable (503)"}
      />
    </section>
  );
}

function App() {
  const [theme, setTheme] = useTheme();
  const [view, setView] = useViewState(VIEWS);
  return (
    <div className="trust-page">
      <header className="pub-bar">
        <a className="brand brand-link" href="Dashboard.html" aria-label="Inference Exposure Auditor">
          <span className="brand-mark"><Icon name="scan" size={18} /></span>
          <span className="brand-text"><span className="brand-name">Inference Exposure Auditor</span></span>
        </a>
        <div className="pub-right">
          <IconButton variant="solid" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </IconButton>
          <Button onClick={() => { window.location.href = "Onboarding.html"; }}>Start your audit</Button>
        </div>
      </header>

      <div className="trust-wrap">
        <section className="trust-hero">
          <p className="eyebrow-trust">Accuracy &amp; trust</p>
          <h1 className="trust-h1">How do we know these numbers?</h1>
          <p className="trust-lead">
            Every reliability figure in your audit is <b>measured, then calibrated</b> — validated on a public
            benchmark with known answers before it's ever applied to you. Here's exactly how, and how far we'll
            and won't go in claiming it.
          </p>
          <div className="trust-keystats">
            <div className="keystat keystat-accent"><div className="keystat-v">~85<span className="keystat-unit">% top-1</span></div><div className="keystat-l">Text accuracy on SynthPAI, the public benchmark</div></div>
            <div className="keystat"><div className="keystat-v">0.04 <span className="keystat-unit">ECE</span></div><div className="keystat-l">Expected calibration error — lower is better</div></div>
            <div className="keystat"><div className="keystat-v">Calibrated</div><div className="keystat-l">You never see a raw model confidence — only the calibrated number</div></div>
          </div>
        </section>

        {/* Benchmark + Calibration — the data sections (carry the honest states) */}
        {(view === "loaded" || view === "loading") && (
          <React.Fragment>
            <BenchmarkSection loading={view === "loading"} />
            <CalibrationSection loading={view === "loading"} />
          </React.Fragment>
        )}
        {view === "empty" && <EmptyData />}
        {view === "error" && <ErrorData onRetry={() => setView("loaded")} />}

        {/* Medical-test analogy */}
        <section className="trust-sec">
          <p className="sec-eyebrow"><Icon name="life-buoy" size={14} /> Why it holds for you</p>
          <h2 className="trust-h2">Like a validated medical test</h2>
          <p className="trust-p">A blood test isn't re-validated on every patient — it's validated once on a population with known outcomes, then trusted for the next person. Calibration works the same way.</p>
          <div className="analogy">
            <div className="ana-step">
              <div className="ana-ic"><Icon name="users" size={20} /></div>
              <div className="ana-num">01</div>
              <div className="ana-t">Validate on a population</div>
              <div className="ana-d">Run the engine over thousands of benchmark profiles whose answers are already known.</div>
            </div>
            <div className="ana-step">
              <div className="ana-ic"><Icon name="gauge" size={20} /></div>
              <div className="ana-num">02</div>
              <div className="ana-t">Calibrate once</div>
              <div className="ana-d">Learn how often each confidence level is truly correct, per attribute, and store it as a map.</div>
            </div>
            <div className="ana-step">
              <div className="ana-ic"><Icon name="user" size={20} /></div>
              <div className="ana-num">03</div>
              <div className="ana-t">Apply to you</div>
              <div className="ana-d">Your audit reuses that map. You're the new patient — scored against a validated test, not re-validated.</div>
            </div>
          </div>
          <p className="analogy-note"><Icon name="info" size={16} /><span><b>The honest boundary:</b> this assumes your footprint resembles the benchmark population. When it doesn't, reliability is reported as a wider band — or we abstain rather than guess.</span></p>
        </section>

        {/* Image humility */}
        <section className="trust-sec">
          <p className="sec-eyebrow"><Icon name="image" size={14} /> Images — handled humbly</p>
          <h2 className="trust-h2">Image accuracy is supplementary</h2>
          <div className="img-card">
            <div className="img-stat">
              <div className="img-stat-v">77.6%</div>
              <div className="img-stat-ci">95% CI [71.6 – 79.8]</div>
              <div className="img-stat-l">Reference image top-1 on the VIP benchmark</div>
            </div>
            <div className="img-body">
              <span className="img-tag"><Icon name="info" size={13} /> Supplementary</span>
              <p className="trust-p" style={{ marginTop: "var(--space-3)" }}>The public image benchmark (VIP) is access-gated and our own labeled photo set is small, so image inference is <b>harder to validate</b> than text. We treat it as supplementary: always reported <b>with intervals</b>, never headlined, and never used to overclaim. <b>Text remains our rigorous metric.</b></p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="trust-cta">
          <h2>See what an AI can infer about you</h2>
          <p>Run your own private audit — consent-first, advise-only, and measured the same way you just read about.</p>
          <div className="trust-cta-row">
            <Button onClick={() => { window.location.href = "Onboarding.html"; }}>Start your audit <Icon name="arrow-right" size={15} /></Button>
            <Button variant="secondary" onClick={() => { window.location.href = "Dashboard.html"; }}>View a sample dashboard</Button>
          </div>
          <p className="trust-foot-note">Benchmarks update with every eval · last run: SynthPAI, June 2026 · engine_version pinned per result.</p>
        </section>
      </div>
      <PreviewSwitch views={VIEWS} view={view} onChange={setView} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
