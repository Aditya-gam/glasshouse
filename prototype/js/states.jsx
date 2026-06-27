/* Shared honest-state primitives — reused on every data screen.
 * Calm by construction: EmptyState/ErrorState are never alarmist; ErrorState is not a
 * red alert; RunProgress is SSE-with-polling-fallback aware; all reduced-motion safe.
 * Exposed on window.States. */
(function () {
  const Icon = window.Icon;
  const DS = window.AdityaDesignSystem_25de17;

  function EmptyState({ icon = "inbox", title, message, message2, action, onAction, actionHref }) {
    const { Button } = DS;
    const btn = action && (actionHref
      ? <Button onClick={() => { window.location.href = actionHref; }}>{action}</Button>
      : <Button onClick={onAction}>{action}</Button>);
    return (
      <div className="state state--empty" role="status">
        <div className="state-ic"><Icon name={icon} size={26} /></div>
        <h3 className="state-title">{title}</h3>
        {message && <p className="state-msg">{message}</p>}
        {message2 && <p className="state-msg2">{message2}</p>}
        {btn && <div className="state-actions">{btn}</div>}
      </div>
    );
  }

  function ErrorState({ title = "We couldn't complete that", message, onRetry, retryLabel = "Try again", details }) {
    const { Button } = DS;
    return (
      <div className="state state--error" role="alert">
        <div className="state-ic state-ic--error"><Icon name="wifi-off" size={26} /></div>
        <h3 className="state-title">{title}</h3>
        {message && <p className="state-msg">{message}</p>}
        <div className="state-actions">
          {onRetry && <Button onClick={onRetry}><Icon name="rotate-cw" size={15} /> {retryLabel}</Button>}
        </div>
        {details && (
          <details className="state-details">
            <summary><Icon name="chevron-right" size={13} className="chev" /> What happened</summary>
            <div className="state-detail-body">{details}</div>
          </details>
        )}
      </div>
    );
  }

  function RunProgress({ title = "Running…", stages, current = 0, status = "running", hint, onCancel }) {
    const pct = Math.max(0, Math.min(100, ((current + (status === "done" ? 1 : 0.5)) / stages.length) * 100));
    return (
      <div className="runprog" role="status" aria-live="polite">
        <div className="runprog-head">
          <span className="runprog-title">{title}</span>
          <span className="runprog-conn" data-status={status}>
            <span className="runprog-conn-dot" />
            {status === "polling" ? "Reconnecting — polling" : "Live"}
          </span>
          {onCancel && <button className="runprog-cancel" onClick={onCancel}>Cancel</button>}
        </div>
        <div className="runprog-stages">
          {stages.map((label, i) => {
            const state = i < current ? "done" : i === current ? "active" : "todo";
            return (
              <React.Fragment key={label}>
                <div className="rp-stage" data-state={state}>
                  <span className="rp-dot">
                    {state === "done" ? <Icon name="check" size={14} stroke={2.5} />
                      : state === "active" ? <span className="rp-spin" aria-hidden="true" />
                        : i + 1}
                  </span>
                  <span className="rp-label">{label}</span>
                </div>
                {i < stages.length - 1 && <span className="rp-conn" data-done={i < current} />}
              </React.Fragment>
            );
          })}
        </div>
        <div className="runprog-bar"><div className="runprog-fill" style={{ width: `${pct}%` }} /></div>
        <p className="runprog-hint">{hint || "This can take a moment. Keep this tab open, or come back later — we'll keep running."}</p>
      </div>
    );
  }

  // ---- Skeleton compositions (built on the DS Skeleton primitive) ----
  function Sk(props) { return <DS.Skeleton {...props} />; }

  function SkelCard() {
    return (
      <div className="skel-card">
        <div className="skel-head"><Sk className="skc-label" /><Sk className="skc-chip" /></div>
        <Sk className="skc-value" />
        <Sk className="skc-bar" />
        <Sk className="skc-range" />
        <div className="skel-foot"><Sk className="skc-foot-l" /><Sk className="skc-foot-btn" /></div>
      </div>
    );
  }

  function SkelRow() {
    return (
      <div className="skel-row">
        <Sk variant="circle" className="skr-av" />
        <div className="skel-row-body"><Sk className="skr-l1" /><Sk className="skr-l2" /></div>
        <Sk className="skr-tag" />
      </div>
    );
  }

  function SkelChart() {
    const heights = ["64%", "82%", "47%", "73%", "58%", "90%", "40%"];
    return (
      <div className="skel-chart">
        <Sk className="skch-title" />
        <div className="skel-bars">
          {heights.map((h, i) => <Sk key={i} className="skch-bar" style={{ height: h }} />)}
        </div>
      </div>
    );
  }

  function SkelGrid({ n = 6 }) {
    return (
      <div className="spec-grid">
        {Array.from({ length: n }).map((_, i) => <SkelCard key={i} />)}
      </div>
    );
  }

  window.States = { EmptyState, ErrorState, RunProgress, SkelCard, SkelRow, SkelChart, SkelGrid, Sk, PreviewSwitch, useViewState };

  /* Shared "preview state" switcher + URL-synced view state, reused on every screen
   * that ships honest states. The switcher is a design-review affordance (hidden in
   * print); ?state= makes any state linkable and survives refresh. */
  function useViewState(views, fallback) {
    const fb = fallback || views[0].key;
    const read = () => {
      try { const s = new URL(window.location.href).searchParams.get("state"); return views.some((v) => v.key === s) ? s : fb; }
      catch (e) { return fb; }
    };
    const [view, setView] = React.useState(read);
    React.useEffect(() => {
      try {
        const u = new URL(window.location.href);
        if (view === fb) u.searchParams.delete("state"); else u.searchParams.set("state", view);
        window.history.replaceState(null, "", u);
      } catch (e) {}
    }, [view]);
    return [view, setView];
  }

  function PreviewSwitch({ views, view, onChange, label = "Preview state" }) {
    return (
      <div className="preview-switch" role="group" aria-label="Preview screen state">
        <span className="preview-switch-label"><Icon name="bar-chart-3" size={12} /> {label}</span>
        <div className="preview-seg">
          {views.map((v) => (
            <button key={v.key} className={view === v.key ? "is-active" : ""} aria-pressed={view === v.key} onClick={() => onChange(v.key)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
})();
