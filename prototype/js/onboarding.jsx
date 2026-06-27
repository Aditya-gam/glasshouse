/* Onboarding wizard — Inference Exposure Auditor
 * Screen 1: Welcome -> Consent -> Connect handoff. Consent-first, deny-by-default.
 * No persona-lens toggle here by design: there is no severity to reorder yet, and
 * forcing self-identification at onboarding would breach the ethics rule. */
const { useState, useEffect, useRef } = React;
const DS = window.AdityaDesignSystem_25de17;
const { Button, Checkbox, Alert, Card } = DS;
const Icon = window.Icon;

const STEPS = [
  { key: "welcome", label: "Welcome" },
  { key: "consent", label: "Consent" },
  { key: "connect", label: "Connect" },
];
const LS = "iea_onboarding_v1";

function fmt(ts) {
  if (!ts) return "Just now";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    }).format(new Date(ts));
  } catch (e) { return "Just now"; }
}

/* ---- Theme ---- */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("iea_theme")
        || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch (e) { return "light"; }
  });
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("iea_theme", theme); } catch (e) {}
  }, [theme]);
  return [theme, setTheme];
}

/* ---- Building blocks ---- */
function Pillar({ step, title, icon, children }) {
  return (
    <div className="pillar">
      <div className="pillar-ic"><Icon name={icon} size={18} /></div>
      <div>
        <div className="pillar-head">
          <span className="pillar-step">{step}</span>
          <span className="pillar-t">{title}</span>
        </div>
        <p className="pillar-d">{children}</p>
      </div>
    </div>
  );
}

function Kv({ k, children }) {
  return (
    <div className="kv-row">
      <dt>{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ConsentRow({ id, checked, onChange, title, children }) {
  return (
    <div className="consent-row">
      <Checkbox id={id} checked={checked} onChange={onChange} />
      <label className="consent-text" htmlFor={id}>
        <span className="consent-t">{title}</span>
        <span className="consent-d">{children}</span>
      </label>
    </div>
  );
}

function Path({ icon, title, children }) {
  return (
    <div className="path">
      <div className="path-ic"><Icon name={icon} size={18} /></div>
      <div className="path-t">{title}</div>
      <div className="path-d">{children}</div>
    </div>
  );
}

/* ---- Steps ---- */
function Welcome({ headingRef }) {
  return (
    <div className="step-anim" key="welcome">
      <p className="eyebrow">Privacy self-audit</p>
      <h1 className="step-title" ref={headingRef} tabIndex={-1}>A private audit of your own footprint</h1>
      <p className="lede">
        See what an AI can infer about you from data you already control — then reduce
        what’s exposed, and measure the drop. You’re auditing yourself. Nothing is shared,
        and nothing runs until you consent.
      </p>
      <div className="pillars">
        <Pillar step="01" title="Attack" icon="crosshair">
          We run the same inference an adversary could — only on your own posts, photos, and profiles.
        </Pillar>
        <Pillar step="02" title="Measure" icon="gauge">
          Each finding gets a calibrated reliability band — honest about what the model can’t tell.
        </Pillar>
        <Pillar step="03" title="Defend" icon="shield">
          We help you break the strongest inferences, then prove the exposure actually dropped.
        </Pillar>
      </div>
      <p className="reassure">Your data only&nbsp; · &nbsp;encrypted&nbsp; · &nbsp;advise-only&nbsp; · &nbsp;erase anytime</p>
    </div>
  );
}

function Consent({ headingRef, consents, toggle }) {
  return (
    <div className="step-anim" key="consent">
      <p className="eyebrow">Your consent</p>
      <h1 className="step-title" ref={headingRef} tabIndex={-1}>Nothing runs until you agree</h1>
      <p className="lede">
        We process your footprint only for this self-audit. Please confirm each point below.
      </p>
      <dl className="kv">
        <Kv k="Purpose">Self-audit — reveal what others can infer about you</Kv>
        <Kv k="Data">Your own footprint, encrypted; content is never logged</Kv>
        <Kv k="Withdraw">Anytime, from Account — we crypto-shred your data</Kv>
      </dl>
      <fieldset className="consents">
        <legend className="sr-only">Required consents</legend>
        <ConsentRow id="c-purpose" checked={consents.purpose} onChange={() => toggle("purpose")}
          title="I’m auditing my own footprint">
          I understand this processes data I control to show what others could infer about me.
        </ConsentRow>
        <ConsentRow id="c-art9" checked={consents.art9} onChange={() => toggle("art9")}
          title="I explicitly consent to special-category data">
          Some inferences — like birthplace, which can relate to ethnic origin — fall under GDPR
          Article 9. This consent is explicit and reversible.
        </ConsentRow>
        <ConsentRow id="c-nofalse" checked={consents.noFalse} onChange={() => toggle("noFalse")}
          title="I understand this can’t recall existing copies">
          Reducing exposure later can’t pull back screenshots, archives, or reposts others have
          already made.
        </ConsentRow>
      </fieldset>
      <div style={{ marginTop: "var(--space-4)" }}>
        <Alert variant="info" title="No false safety">
          Even after you act, we’ll only say a specific adversary can no longer recover an
          attribute — never that it’s “safe.”
        </Alert>
      </div>
    </div>
  );
}

function Connect({ headingRef, consentedAt }) {
  return (
    <div className="step-anim" key="connect">
      <p className="eyebrow">You’re set</p>
      <h1 className="step-title" ref={headingRef} tabIndex={-1}>Let’s bring in your footprint</h1>
      <p className="lede">
        Consent recorded. Next, connect a read-only account or upload an export. We keep only
        your own items and drop anything about other people.
      </p>
      <div className="recorded">
        <div className="recorded-head">
          <span className="recorded-ic"><Icon name="check" size={13} stroke={3} /></span>
          <span>Consent recorded</span>
          <span className="recorded-time">{fmt(consentedAt)}</span>
        </div>
        <ul className="recorded-list">
          <li><Icon name="check" size={14} stroke={2.5} /> Self-audit purpose</li>
          <li><Icon name="check" size={14} stroke={2.5} /> Article 9 — explicit consent</li>
          <li><Icon name="check" size={14} stroke={2.5} /> No false safety acknowledged</li>
        </ul>
      </div>
      <div className="paths">
        <Path icon="link" title="Connect read-only">
          Reddit or Mastodon — we never post or change anything.
        </Path>
        <Path icon="upload" title="Upload an export">
          X archive, Reddit export, Google Takeout, or photos.
        </Path>
      </div>
    </div>
  );
}

/* ---- App ---- */
function App() {
  const [theme, setTheme] = useTheme();
  const [state, setState] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(LS));
      if (s && typeof s.step === "number") return s;
    } catch (e) {}
    return { step: 0, consents: { purpose: false, art9: false, noFalse: false }, consentedAt: null };
  });
  const [toast, setToast] = useState(null);
  const headingRef = useRef(null);
  const mounted = useRef(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  // Move focus to the step heading on step change (not on first mount).
  useEffect(() => {
    if (mounted.current && headingRef.current) headingRef.current.focus();
    mounted.current = true;
  }, [state.step]);

  const { step, consents, consentedAt } = state;
  const toggle = (k) => setState((s) => ({ ...s, consents: { ...s.consents, [k]: !s.consents[k] } }));
  const setStep = (i) => setState((s) => ({ ...s, step: i }));
  const allConsented = consents.purpose && consents.art9 && consents.noFalse;
  const count = [consents.purpose, consents.art9, consents.noFalse].filter(Boolean).length;

  const confirmConsent = () => setState((s) => ({ ...s, step: 2, consentedAt: s.consentedAt || Date.now() }));
  const fireToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  let primary;
  if (step === 0) {
    primary = <Button onClick={() => setStep(1)}>Get started <Icon name="arrow-right" size={16} /></Button>;
  } else if (step === 1) {
    primary = (
      <Button onClick={confirmConsent} disabled={!allConsented} aria-describedby="consent-help">
        I consent &amp; continue <Icon name="arrow-right" size={16} />
      </Button>
    );
  } else {
    primary = <Button onClick={() => { window.location.href = "Connect.html"; }}>Connect or import <Icon name="arrow-right" size={16} /></Button>;
  }

  return (
    <div className="page">
      <main className="wrap">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark"><Icon name="scan" size={19} /></div>
            <div className="brand-text">
              <span className="brand-name">Inference Exposure Auditor</span>
              <span className="brand-sub">Privacy self-audit</span>
            </div>
          </div>
          <DS.IconButton
            variant="solid"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </DS.IconButton>
        </div>

        <nav className="stepper" aria-label="Onboarding progress">
          <ol>
            {STEPS.map((s, i) => {
              const status = i < step ? "done" : i === step ? "current" : "todo";
              return (
                <React.Fragment key={s.key}>
                  <li>
                    <button
                      className="step-node"
                      data-status={status}
                      disabled={i >= step}
                      aria-current={i === step ? "step" : undefined}
                      onClick={() => { if (i < step) setStep(i); }}
                    >
                      <span className="step-dot">{status === "done" ? <Icon name="check" size={14} stroke={2.5} /> : i + 1}</span>
                      <span className="step-label">{s.label}</span>
                    </button>
                  </li>
                  {i < STEPS.length - 1 && <li aria-hidden="true"><span className="step-connector" data-done={i < step} /></li>}
                </React.Fragment>
              );
            })}
          </ol>
        </nav>

        <Card className="panel">
          <div className="panel-inner">
            {step === 0 && <Welcome headingRef={headingRef} />}
            {step === 1 && <Consent headingRef={headingRef} consents={consents} toggle={toggle} />}
            {step === 2 && <Connect headingRef={headingRef} consentedAt={consentedAt} />}

            <div className="panel-foot">
              <div className="actions">
                {step > 0
                  ? <Button variant="secondary" onClick={() => setStep(step - 1)}><Icon name="arrow-left" size={16} /> Back</Button>
                  : <span className="hint">Takes about two minutes</span>}
                <div className="actions-right">
                  {step === 1 && <span className="count" aria-live="polite">{count} of 3 confirmed</span>}
                  {primary}
                </div>
              </div>
              {step === 1 && (
                <p className="foot-note" id="consent-help">
                  {allConsented
                    ? "You can withdraw consent anytime in Account."
                    : "Deny-by-default — leave any box unchecked and nothing runs. Confirm all three to continue."}
                </p>
              )}
            </div>
          </div>
        </Card>
      </main>

      {toast && (
        <div className="toast" role="status">
          <Icon name="arrow-right" size={15} /> {toast}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
