/* Shared app shell — Inference Exposure Auditor
 * The top bar, persona lens, account menu, and theme/toast hooks, reused across
 * every authenticated screen so the shell stays identical. Exported on window.AppShell. */
const { useState: useStateAS, useEffect: useEffectAS, useRef: useRefAS } = React;
const ASIcon = window.Icon;
const ASDS = window.AdityaDesignSystem_25de17;
const { LENSES: AS_LENSES } = window.IEA;

function useTheme() {
  const [theme, setTheme] = useStateAS(() => {
    try { return localStorage.getItem("iea_theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }
    catch (e) { return "light"; }
  });
  useEffectAS(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("iea_theme", theme); } catch (e) {}
  }, [theme]);
  return [theme, setTheme];
}

function useToast() {
  const [toast, setToast] = useStateAS(null);
  const timer = useRefAS(null);
  const fire = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  };
  return [toast, fire];
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="toast" role="status">
      <ASIcon name="arrow-right" size={15} /> {msg}
    </div>
  );
}

/* Persona lens — accessible radiogroup with arrow-key navigation. */
function PersonaLens({ value, onChange }) {
  const ref = useRefAS(null);
  const onKey = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = AS_LENSES.findIndex((l) => l.key === value);
    const next = e.key === "ArrowRight" ? (i + 1) % AS_LENSES.length : (i - 1 + AS_LENSES.length) % AS_LENSES.length;
    onChange(AS_LENSES[next].key);
    const btns = ref.current.querySelectorAll(".seg-btn");
    if (btns[next]) btns[next].focus();
  };
  return (
    <div className="seg" role="radiogroup" aria-label="Persona lens" ref={ref} onKeyDown={onKey}>
      {AS_LENSES.map((l) => {
        const active = value === l.key;
        return (
          <button
            key={l.key}
            className={"seg-btn" + (active ? " seg-btn--active" : "")}
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(l.key)}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

function AccountMenu({ onAction }) {
  const [open, setOpen] = useStateAS(false);
  const ref = useRefAS(null);
  useEffectAS(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onEsc); };
  }, [open]);

  const items = [
    { k: "account", icon: "user", label: "Account & data rights", href: "Account.html" },
    { k: "connected", icon: "link", label: "Connected accounts", href: "Account.html#connected" },
    { k: "export", icon: "download", label: "Export my data", href: "Account.html#export" },
  ];
  return (
    <div className="acct" ref={ref}>
      <button className="acct-btn" aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" onClick={() => setOpen((o) => !o)}>
        <ASDS.Avatar name="Marta Rocha" size="md" />
      </button>
      {open && (
        <div className="acct-menu" role="menu">
          <div className="acct-head">
            <div className="acct-name">Marta Rocha</div>
            <div className="acct-mail">marta@example.com</div>
          </div>
          <hr className="acct-sep" />
          {items.map((it) => (
            <a key={it.k} className="acct-item" role="menuitem" href={it.href}>
              <ASIcon name={it.icon} size={16} /> {it.label}
            </a>
          ))}
          <hr className="acct-sep" />
          <button className="acct-item" role="menuitem" onClick={() => { setOpen(false); onAction("Signed out"); }}>
            <ASIcon name="log-out" size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/* Top bar. `center` is the slot between brand and the right cluster
 * (dashboard passes a run-status pill; detail screens pass a breadcrumb). */
const SETUP_STEPS = [
  { key: "setup", label: "Set up" },
  { key: "connect", label: "Connect" },
  { key: "audit", label: "Audit" },
];

/* Unified step indicator for the onboarding → connect → dashboard setup path. */
function SetupSteps({ active }) {
  const idx = SETUP_STEPS.findIndex((s) => s.key === active);
  return (
    <nav className="setup-steps" aria-label="Setup progress">
      {SETUP_STEPS.map((s, i) => {
        const state = i < idx ? "done" : i === idx ? "current" : "todo";
        return (
          <React.Fragment key={s.key}>
            <span className="setup-step" data-state={state} aria-current={state === "current" ? "step" : undefined}>
              <span className="setup-step-dot">{state === "done" ? <ASIcon name="check" size={11} stroke={3} /> : i + 1}</span>
              <span className="setup-step-label">{s.label}</span>
            </span>
            {i < SETUP_STEPS.length - 1 && <span className="setup-step-conn" data-done={i < idx} aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function Topbar({ lens, setLens, theme, setTheme, onAccount, center = null, showLens = true, showBack = true }) {
  return (
    <header className="topbar">
      {showBack && (
        <button className="topbar-back" onClick={() => window.history.back()} aria-label="Go back">
          <ASIcon name="arrow-left" size={16} /> <span className="topbar-back-label">Back</span>
        </button>
      )}
      <a className="brand brand-link" href="Dashboard.html" aria-label="Inference Exposure Auditor — dashboard">
        <span className="brand-mark"><ASIcon name="scan" size={18} /></span>
        <span className="brand-text"><span className="brand-name">Inference Exposure Auditor</span></span>
      </a>
      {center}
      <div className="topbar-right">
        {showLens && <PersonaLens value={lens} onChange={setLens} />}
        <ASDS.IconButton
          variant="solid"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <ASIcon name={theme === "dark" ? "sun" : "moon"} size={18} />
        </ASDS.IconButton>
        <AccountMenu onAction={onAccount} />
      </div>
    </header>
  );
}

window.AppShell = { useTheme, useToast, Toast, PersonaLens, AccountMenu, Topbar, SetupSteps };
