/* Account & data rights (screen 6) — consents, retention, connected accounts,
 * export, crisis/safety resources, and a calm crypto-shred delete. Control + transparency. */
const DS = window.AdityaDesignSystem_25de17;
const { Button, Switch, Dialog } = DS;
const Icon = window.Icon;
const { useTheme, useToast, Toast, Topbar } = window.AppShell;
const { useState } = React;

const RETENTION = [
  { key: "retain", label: "Retain, encrypted" },
  { key: "discard", label: "Process, then discard" },
];
const RET_DESC = {
  retain: <>Your imported data is kept <b>encrypted</b> so you can re-run the audit and prove your before → after over time. Crypto-shred it anytime.</>,
  discard: <>We analyze, then <b>delete the raw data immediately</b> — keeping only the findings, not your content. Re-running later means importing again.</>,
};

const RESOURCES = [
  { icon: "shield", name: "Digital-safety guide", desc: "Harden your accounts, devices, and footprint — step by step." },
  { icon: "life-buoy", name: "Doxxing response checklist", desc: "What to do right now if your address or identity is exposed." },
  { icon: "message-square", name: "Crisis & DV support line", desc: "Confidential help, 24/7. Region-aware where possible." },
];

function App() {
  const [theme, setTheme] = useTheme();
  const [lens, setLens] = useState(() => { try { return localStorage.getItem("iea_lens") || "balanced"; } catch (e) { return "balanced"; } });
  const [toast, fireToast] = useToast();

  const [consents, setConsents] = useState({ purpose: true, art9: true, decoy: false });
  const [retention, setRetention] = useState(() => { try { return localStorage.getItem("iea_retention") || "retain"; } catch (e) { return "retain"; } });
  const [accounts, setAccounts] = useState([
    { id: "reddit", icon: "message-square", name: "Reddit", handle: "u/marta", date: "Connected 26 Jun 2026" },
    { id: "mastodon", icon: "at-sign", name: "Mastodon", handle: "@marta@mas.to", date: "Connected 26 Jun 2026" },
  ]);
  const [dialog, setDialog] = useState(null); // null | 'revoke-purpose' | 'revoke-art9' | 'decoy' | 'delete'
  const [delAck, setDelAck] = useState(false);

  const setRet = (k) => { setRetention(k); try { localStorage.setItem("iea_retention", k); } catch (e) {} fireToast(k === "retain" ? "Retention: keep encrypted" : "Retention: process, then discard"); };

  // consent toggles: revoking purpose/art9 or enabling decoy needs confirmation
  const toggleConsent = (key) => {
    if (key === "decoy") {
      if (!consents.decoy) { setDialog("decoy"); return; }
      setConsents((c) => ({ ...c, decoy: false })); fireToast("Decoy mode turned off");
      return;
    }
    if (consents[key]) { setDialog("revoke-" + key); return; } // currently granted → confirm revoke
    setConsents((c) => ({ ...c, [key]: true })); fireToast("Consent granted");
  };
  const confirmRevoke = (key) => { setConsents((c) => ({ ...c, [key]: false })); setDialog(null); fireToast(`${key === "purpose" ? "Purpose" : "Article 9"} consent revoked`); };

  const revokeAccount = (id) => { setAccounts((a) => a.filter((x) => x.id !== id)); fireToast("Disconnected — encrypted token cleared"); };

  const crumbs = (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href="Dashboard.html">Dashboard</a>
      <Icon name="chevron-right" size={14} />
      <span className="crumb-here">Account</span>
    </nav>
  );

  return (
    <div className="app-root">
      <Topbar
        lens={lens} setLens={setLens} theme={theme} setTheme={setTheme}
        center={crumbs}
        onAccount={(label) => fireToast(label === "Signed out" ? "Signed out" : `Opening: ${label}`)}
      />

      <main className="account-wrap">
        <a className="acct-back" href="Dashboard.html"><Icon name="arrow-left" size={15} /> Back to dashboard</a>
        <h1 className="account-title">Account &amp; data rights</h1>
        <p className="account-sub">Everything we hold is yours to see, change, export, or erase. Nothing here is hidden.</p>

        {lens === "atrisk" && (
          <div className="sec safety-sec" id="safety" style={{ marginTop: "var(--space-6)" }}>
            <SafetySection emphasized />
          </div>
        )}

        {/* Consents */}
        <section className="sec" id="consents">
          <div className="sec-head"><span className="sec-head-ic"><Icon name="check" size={17} /></span><h2>Consents</h2></div>
          <p className="sec-desc">What you've agreed to. Revoke anytime — revoking the purpose consent stops all processing.</p>
          <div className="sec-card">
            <div className="row">
              <span className="row-ic"><Icon name="scan" size={18} /></span>
              <div className="row-body">
                <div className="row-name">Self-audit purpose {consents.purpose ? <span className="status-pill status-on">Granted</span> : <span className="status-pill status-off">Revoked</span>}</div>
                <div className="row-desc">Process your footprint to reveal what others can infer about you.</div>
                {consents.purpose && <div className="row-meta">Granted 25 Jun 2026</div>}
              </div>
              <div className="row-action"><Switch id="c-purpose" checked={consents.purpose} onChange={() => toggleConsent("purpose")} aria-label="Self-audit purpose consent" /></div>
            </div>
            <div className="row">
              <span className="row-ic"><Icon name="lock" size={18} /></span>
              <div className="row-body">
                <div className="row-name">Special-category data <span className="status-pill status-art9">Art. 9</span></div>
                <div className="row-desc">Explicit consent to process data that may reveal special categories — e.g. birthplace.</div>
                {consents.art9 && <div className="row-meta">Granted 25 Jun 2026</div>}
              </div>
              <div className="row-action"><Switch id="c-art9" checked={consents.art9} onChange={() => toggleConsent("art9")} aria-label="Special-category data consent" /></div>
            </div>
            <div className="row">
              <span className="row-ic"><Icon name="triangle-alert" size={18} /></span>
              <div className="row-body">
                <div className="row-name">Decoy mode {consents.decoy ? <span className="status-pill status-on">On</span> : <span className="status-pill status-off">Off</span>}</div>
                <div className="row-desc">Allow suggestions that publish a falsehood to mislead an adversary. Off by default; you confirm again each use.</div>
              </div>
              <div className="row-action"><Switch id="c-decoy" checked={consents.decoy} onChange={() => toggleConsent("decoy")} aria-label="Decoy mode" /></div>
            </div>
          </div>
        </section>

        {/* Retention */}
        <section className="sec" id="retention">
          <div className="sec-head"><span className="sec-head-ic"><Icon name="archive" size={17} /></span><h2>Data retention</h2></div>
          <p className="sec-desc">How long we hold your imported content.</p>
          <div className="sec-card">
            <div className="ret-seg-wrap">
              <div className="seg" role="radiogroup" aria-label="Data retention">
                {RETENTION.map((r) => (
                  <button key={r.key} className={"seg-btn" + (retention === r.key ? " seg-btn--active" : "")} role="radio" aria-checked={retention === r.key} onClick={() => setRet(r.key)}>{r.label}</button>
                ))}
              </div>
              <p className="ret-current">{RET_DESC[retention]}</p>
            </div>
          </div>
        </section>

        {/* Connected accounts */}
        <section className="sec" id="connected">
          <div className="sec-head"><span className="sec-head-ic"><Icon name="link" size={17} /></span><h2>Connected accounts</h2></div>
          <p className="sec-desc">Read-only connections. Revoking clears the encrypted token immediately.</p>
          <div className="sec-card">
            {accounts.length === 0 && <div className="sec-card-pad" style={{ color: "var(--muted-foreground)", fontSize: "13.5px" }}>No connected accounts. <a className="link-btn" href="Connect.html">Connect one →</a></div>}
            {accounts.map((a) => (
              <div className="row" key={a.id}>
                <span className="row-ic"><Icon name={a.icon} size={18} /></span>
                <div className="row-body">
                  <div className="row-name">{a.name} <span className="status-pill status-on">Read-only</span></div>
                  <div className="row-desc">{a.handle}</div>
                  <div className="row-meta">{a.date}</div>
                </div>
                <div className="row-action"><button className="link-btn link-btn--danger" onClick={() => revokeAccount(a.id)}>Revoke access</button></div>
              </div>
            ))}
            {accounts.length > 0 && <div className="sec-card-pad" style={{ borderTop: "1px solid var(--border)" }}><a className="link-btn" href="Connect.html">+ Connect another source</a></div>}
          </div>
        </section>

        {/* Export */}
        <section className="sec" id="export">
          <div className="sec-head"><span className="sec-head-ic"><Icon name="download" size={17} /></span><h2>Export your data</h2></div>
          <p className="sec-desc">A complete copy of everything we hold about you (DSAR).</p>
          <div className="sec-card">
            <div className="export-row">
              <div className="row-body">
                <div className="row-name">Download my data bundle</div>
                <ul className="export-list">
                  <li>Your imported items and photos</li>
                  <li>Every inference, with evidence and calibrated reliability</li>
                  <li>Your consents and the audit log</li>
                </ul>
              </div>
              <Button variant="secondary" onClick={() => fireToast("Preparing your data bundle — we'll email a secure link")}><Icon name="download" size={15} /> Download bundle</Button>
            </div>
          </div>
        </section>

        {/* Safety resources (always present; emphasized at top for at-risk) */}
        {lens !== "atrisk" && (
          <section className="sec safety-sec" id="safety"><SafetySection /></section>
        )}

        {/* Delete account */}
        <section className="sec danger-sec" id="delete">
          <div className="sec-head"><span className="sec-head-ic"><Icon name="trash-2" size={17} /></span><h2>Delete account</h2></div>
          <p className="sec-desc">Remove your account and everything tied to it.</p>
          <div className="sec-card">
            <div className="danger-pad">
              <ul className="danger-list">
                <li><Icon name="key" size={16} /><span><b>Crypto-shred.</b> We destroy your encryption key, so your encrypted data becomes permanently unreadable — even to us.</span></li>
                <li><Icon name="trash-2" size={16} /><span><b>Cascade delete.</b> Your imported items, inferences, consents, and connected-account tokens are all removed.</span></li>
                <li><Icon name="shield-alert" size={16} /><span><b>Irreversible.</b> This can't be undone, and there's no recovery.</span></li>
              </ul>
              <div className="danger-caveat">
                <Icon name="shield-alert" size={16} />
                <span><b>Honest caveat:</b> deleting your account here can't recall copies others already made — screenshots, archives, or reposts. It removes what <i>we</i> hold, not what's already out in the world.</span>
              </div>
              <Button className="btn-danger" onClick={() => { setDelAck(false); setDialog("delete"); }}><Icon name="trash-2" size={15} /> Delete account</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Revoke purpose / art9 dialogs */}
      <Dialog
        open={dialog === "revoke-purpose" || dialog === "revoke-art9"}
        onClose={() => setDialog(null)}
        title={dialog === "revoke-art9" ? "Revoke special-category consent?" : "Revoke the self-audit consent?"}
        description="You can grant it again anytime."
        footer={<>
          <Button variant="secondary" onClick={() => setDialog(null)}>Keep it</Button>
          <Button className="btn-warn" onClick={() => confirmRevoke(dialog === "revoke-art9" ? "art9" : "purpose")}>Revoke</Button>
        </>}
      >
        <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.55, color: "var(--muted-foreground)" }}>
          {dialog === "revoke-art9"
            ? "We'll stop processing data that may reveal special categories (like birthplace). Existing findings for those attributes are removed."
            : "This stops all processing immediately. Your audit pauses and we won't run further inference until you grant it again."}
        </p>
      </Dialog>

      {/* Decoy enable warning */}
      <Dialog
        open={dialog === "decoy"}
        onClose={() => setDialog(null)}
        title="Turn on decoy mode?"
        description="Off by default. Read this first."
        footer={<>
          <Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button>
          <Button className="btn-warn" onClick={() => { setConsents((c) => ({ ...c, decoy: true })); setDialog(null); fireToast("Decoy mode on — you'll confirm again each use"); }}>Turn on decoy mode</Button>
        </>}
      >
        <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.55, color: "var(--muted-foreground)" }}>
          Decoy mode lets the tool <b style={{ color: "var(--foreground)" }}>suggest publishing a falsehood</b> about yourself to mislead an adversary. Truthful options are always shown alongside, it's never auto-selected, and you'll confirm again every time before any decoy text appears.
        </p>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={dialog === "delete"}
        onClose={() => setDialog(null)}
        title="Delete your account?"
        description="This is permanent. There is no undo."
        footer={<>
          <Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button>
          <Button className="btn-danger" disabled={!delAck} onClick={() => { setDialog(null); fireToast("Account scheduled for deletion — your key is being shredded"); }}>Permanently delete</Button>
        </>}
      >
        <p style={{ margin: "0 0 var(--space-1)", fontSize: "13.5px", lineHeight: 1.55, color: "var(--muted-foreground)" }}>
          We'll crypto-shred your key and cascade-delete everything we hold. We can't recall copies others already made.
        </p>
        <div className="del-confirm">
          <Switch id="del-ack" checked={delAck} onChange={() => setDelAck((v) => !v)} aria-label="Acknowledge permanent deletion" />
          <span className="del-confirm-t">I understand this is permanent and can't recall copies others have already made.</span>
        </div>
      </Dialog>

      <Toast msg={toast} />
    </div>
  );
}

function SafetySection({ emphasized }) {
  const Icon = window.Icon;
  return (
    <>
      <div className="sec-head"><span className="sec-head-ic"><Icon name="life-buoy" size={17} /></span><h2>Safety resources</h2></div>
      <p className="sec-desc">Curated digital-safety and crisis support. These are pointers, not advice — and never replace professional help.</p>
      <div className="sec-card">
        {emphasized && (
          <div className="safety-intro"><Icon name="shield" size={16} /><span>Surfaced for you because safety matters most in your situation. Take what's useful; ignore the rest.</span></div>
        )}
        {RESOURCES.map((r) => (
          <a className="res-row" key={r.name} href="#" onClick={(e) => e.preventDefault()}>
            <span className="res-ic"><Icon name={r.icon} size={17} /></span>
            <div className="res-body">
              <div className="res-name">{r.name}</div>
              <div className="res-desc">{r.desc}</div>
            </div>
            <Icon name="external-link" size={16} />
          </a>
        ))}
        <div className="safety-foot">Region-aware where possible. If you're in immediate danger, contact your local emergency number.</div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
