/* @ds-bundle: {"format":3,"namespace":"AdityaDesignSystem_25de17","components":[{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"CardHeader","sourcePath":"components/data-display/Card.jsx"},{"name":"CardTitle","sourcePath":"components/data-display/Card.jsx"},{"name":"CardDescription","sourcePath":"components/data-display/Card.jsx"},{"name":"CardContent","sourcePath":"components/data-display/Card.jsx"},{"name":"CardFooter","sourcePath":"components/data-display/Card.jsx"},{"name":"Progress","sourcePath":"components/data-display/Progress.jsx"},{"name":"Separator","sourcePath":"components/data-display/Separator.jsx"},{"name":"Skeleton","sourcePath":"components/data-display/Skeleton.jsx"},{"name":"Tag","sourcePath":"components/data-display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/data-display/Avatar.jsx":"cf7d21e68fd6","components/data-display/Badge.jsx":"cfea8089c601","components/data-display/Card.jsx":"32def4ae20c7","components/data-display/Progress.jsx":"7888c2d46520","components/data-display/Separator.jsx":"ae4340b7f807","components/data-display/Skeleton.jsx":"aa41c822f375","components/data-display/Tag.jsx":"788eda4778c7","components/feedback/Alert.jsx":"fddd79c011cb","components/feedback/Dialog.jsx":"9151c7e78964","components/feedback/Toast.jsx":"a3e91a364bef","components/feedback/Tooltip.jsx":"890abe6737f5","components/forms/Button.jsx":"5cbd1a4fab9b","components/forms/Checkbox.jsx":"1f419573b75b","components/forms/Field.jsx":"bc154df4ee61","components/forms/IconButton.jsx":"8dd894a45d6f","components/forms/Input.jsx":"1e1297f5fdb6","components/forms/Radio.jsx":"c0b9a8a80a90","components/forms/Select.jsx":"179ec4b4f728","components/forms/Slider.jsx":"19596138ea7a","components/forms/Switch.jsx":"90ede96d73bb","components/forms/Textarea.jsx":"9ad7b0b338cd","components/navigation/Breadcrumb.jsx":"d33824e864aa","components/navigation/Tabs.jsx":"805b4eb3ebf3","components/util.js":"900f26491162","ui_kits/console/AppShell.jsx":"5f03f320b413","ui_kits/console/Assistant.jsx":"5a9921884fcc","ui_kits/console/Dashboard.jsx":"2a0f7dd523c4","ui_kits/console/Login.jsx":"f84e1a268f6d","ui_kits/console/Settings.jsx":"a19ae2501654","ui_kits/console/icons.jsx":"33cf3eee2eb6","ui_kits/marketing/Footer.jsx":"185804e7902f","ui_kits/marketing/Landing.jsx":"5068e61cd23d","ui_kits/marketing/Nav.jsx":"7c49872a4bf4","ui_kits/marketing/Pricing.jsx":"23933a42c6c5","ui_kits/marketing/icons.jsx":"33cf3eee2eb6"},"inlinedExternals":[],"unexposedExports":[{"name":"cx","sourcePath":"components/util.js"},{"name":"injectOnce","sourcePath":"components/util.js"}]} */

(() => {

const __ds_ns = (window.AdityaDesignSystem_25de17 = window.AdityaDesignSystem_25de17 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/util.js
try { (() => {
// Aditya DS — shared component utilities.
// injectOnce(id, css): adds a <style> tag a single time per id so components
// can use real :hover / :focus-visible / :active pseudo-classes with scoped
// class names, while still being driven entirely by the design-system tokens.
let injected = typeof window !== 'undefined' ? window.__adInjected || (window.__adInjected = {}) : {};
function injectOnce(id, css) {
  if (typeof document === 'undefined' || injected[id]) return;
  injected[id] = true;
  const el = document.createElement('style');
  el.setAttribute('data-ad', id);
  el.textContent = css;
  document.head.appendChild(el);
}
function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
Object.assign(__ds_scope, { injectOnce, cx });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/util.js", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-avatar", `
.ad-avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; background: var(--accent); color: var(--accent-foreground); font-family: var(--font-sans); font-weight: var(--weight-medium); flex: none; user-select: none; }
.ad-avatar img { width: 100%; height: 100%; object-fit: cover; }
.ad-avatar--sm { width: 28px; height: 28px; font-size: 11px; }
.ad-avatar--md { width: 38px; height: 38px; font-size: 14px; }
.ad-avatar--lg { width: 48px; height: 48px; font-size: 17px; }
.ad-avatar-ring { box-shadow: 0 0 0 2px var(--surface), 0 0 0 3px var(--border); }
`);

/** Avatar — a circular user/entity image with initial fallback. */
function Avatar({
  src,
  alt = "",
  name = "",
  size = "md",
  ring = false,
  className = "",
  ...props
}) {
  const initials = name ? name.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join("").toUpperCase() : "";
  return /*#__PURE__*/React.createElement("span", _extends({
    className: __ds_scope.cx("ad-avatar", `ad-avatar--${size}`, ring && "ad-avatar-ring", className)
  }, props), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-badge", `
.ad-badge { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-sans); font-size: var(--text-xs); font-weight: var(--weight-medium); line-height: 1; padding: 4px 9px; border-radius: var(--radius-full); border: 1px solid transparent; white-space: nowrap; }
.ad-badge--neutral { background: var(--secondary); color: var(--muted-foreground); }
.ad-badge--accent { background: var(--accent); color: var(--accent-foreground); }
.ad-badge--success { background: var(--success-soft); color: var(--success-foreground); }
.ad-badge--warning { background: var(--warning-soft); color: var(--warning-foreground); }
.ad-badge--danger { background: var(--destructive-soft); color: var(--destructive-text); }
.ad-badge--info { background: var(--info-soft); color: var(--info-foreground); }
.ad-badge--outline { background: transparent; color: var(--muted-foreground); border-color: var(--border-strong); }
.ad-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
`);

/** Badge — a small status or category label. */
function Badge({
  variant = "neutral",
  dot = false,
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: __ds_scope.cx("ad-badge", `ad-badge--${variant}`, className)
  }, props), dot && /*#__PURE__*/React.createElement("span", {
    className: "ad-badge-dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-card", `
.ad-card { background: var(--card); color: var(--card-foreground); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-xs); }
.ad-card--hover { transition: box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard); }
.ad-card--hover:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
.ad-card-header { padding: var(--space-5) var(--space-5) 0; display: flex; flex-direction: column; gap: 3px; }
.ad-card-title { font: var(--weight-medium) var(--text-h3)/var(--leading-snug) var(--font-sans); color: var(--foreground); margin: 0; }
.ad-card-desc { font: var(--weight-regular) var(--text-sm)/var(--leading-normal) var(--font-sans); color: var(--muted-foreground); margin: 0; }
.ad-card-body { padding: var(--space-5); }
.ad-card-footer { padding: 0 var(--space-5) var(--space-5); display: flex; gap: var(--space-2); align-items: center; }
`);

/** Card — a soft, rounded surface that groups related content. */
function Card({
  hover = false,
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: __ds_scope.cx("ad-card", hover && "ad-card--hover", className)
  }, props));
}
function CardHeader({
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: __ds_scope.cx("ad-card-header", className)
  }, props));
}
function CardTitle({
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("h3", _extends({
    className: __ds_scope.cx("ad-card-title", className)
  }, props));
}
function CardDescription({
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("p", _extends({
    className: __ds_scope.cx("ad-card-desc", className)
  }, props));
}
function CardContent({
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: __ds_scope.cx("ad-card-body", className)
  }, props));
}
function CardFooter({
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: __ds_scope.cx("ad-card-footer", className)
  }, props));
}
Object.assign(__ds_scope, { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Progress.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-progress", `
.ad-progress { width: 100%; height: 8px; border-radius: var(--radius-full); background: var(--sand-4); overflow: hidden; }
.ad-progress-bar { height: 100%; border-radius: var(--radius-full); background: var(--primary); transition: width var(--duration-slow) var(--ease-out); }
.ad-progress--success .ad-progress-bar { background: var(--success); }
.ad-progress--warning .ad-progress-bar { background: var(--warning); }
.ad-progress--danger .ad-progress-bar { background: var(--destructive); }
`);

/** Progress — a horizontal completion bar. */
function Progress({
  value = 0,
  max = 100,
  tone = "primary",
  className = "",
  ...props
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    className: __ds_scope.cx("ad-progress", tone !== "primary" && `ad-progress--${tone}`, className),
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemin": 0,
    "aria-valuemax": max
  }, props), /*#__PURE__*/React.createElement("div", {
    className: "ad-progress-bar",
    style: {
      width: `${pct}%`
    }
  }));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Progress.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Separator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-separator", `
.ad-separator { border: none; background: var(--border); flex: none; }
.ad-separator--h { width: 100%; height: 1px; margin: 0; }
.ad-separator--v { width: 1px; align-self: stretch; min-height: 1em; }
`);

/** Separator — a thin divider line, horizontal or vertical. */
function Separator({
  orientation = "horizontal",
  className = "",
  ...props
}) {
  const o = orientation === "vertical" ? "v" : "h";
  return /*#__PURE__*/React.createElement("hr", _extends({
    className: __ds_scope.cx("ad-separator", `ad-separator--${o}`, className),
    role: "separator",
    "aria-orientation": orientation
  }, props));
}
Object.assign(__ds_scope, { Separator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Separator.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Skeleton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-skeleton", `
@keyframes ad-skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
.ad-skeleton { display: block; background: var(--secondary); border-radius: var(--radius-sm); animation: ad-skeleton-pulse 1.6s var(--ease-standard) infinite; }
@media (prefers-reduced-motion: reduce) { .ad-skeleton { animation: none; } }
.ad-skeleton--text { border-radius: 6px; height: 0.7em; }
.ad-skeleton--circle { border-radius: 50%; }
`);

/** Skeleton — a placeholder block shown while content loads. */
function Skeleton({
  variant = "block",
  width,
  height,
  className = "",
  style,
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: __ds_scope.cx("ad-skeleton", variant !== "block" && `ad-skeleton--${variant}`, className),
    style: {
      width,
      height,
      ...style
    },
    "aria-hidden": "true"
  }, props));
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-tag", `
.ad-tag { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-sans); font-size: var(--text-sm); color: var(--foreground); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-full); padding: 4px 10px; white-space: nowrap; }
.ad-tag-remove { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; cursor: pointer; color: var(--muted-foreground); background: transparent; border: none; padding: 0; transition: background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard); }
.ad-tag-remove:hover { background: var(--secondary); color: var(--foreground); }
`);

/** Tag — a removable token, e.g. for filters or multi-select input. */
function Tag({
  onRemove,
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: __ds_scope.cx("ad-tag", className)
  }, props), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ad-tag-remove",
    "aria-label": "Remove",
    onClick: onRemove
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-alert", `
.ad-alert { display: flex; gap: 12px; padding: 14px 16px; border-radius: var(--radius-md); border: 1px solid; }
.ad-alert-icon { flex: none; margin-top: 1px; }
.ad-alert-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ad-alert-title { font: var(--weight-medium) var(--text-body)/1.4 var(--font-sans); }
.ad-alert-desc { font: var(--weight-regular) var(--text-sm)/var(--leading-normal) var(--font-sans); opacity: 0.92; }
.ad-alert--info { background: var(--info-soft); border-color: color-mix(in srgb, var(--info) 28%, transparent); color: var(--info-foreground); }
.ad-alert--success { background: var(--success-soft); border-color: color-mix(in srgb, var(--success) 28%, transparent); color: var(--success-foreground); }
.ad-alert--warning { background: var(--warning-soft); border-color: color-mix(in srgb, var(--warning) 32%, transparent); color: var(--warning-foreground); }
.ad-alert--danger { background: var(--destructive-soft); border-color: color-mix(in srgb, var(--destructive) 28%, transparent); color: var(--destructive-text); }
.ad-alert--neutral { background: var(--secondary); border-color: var(--border); color: var(--foreground); }
.ad-alert-title + .ad-alert-desc { color: var(--foreground); opacity: 0.78; }
`);
const ICONS = {
  info: "M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  success: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  warning: "m10.29 3.86-8.47 14.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01",
  danger: "M12 8v4M12 16h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  neutral: "M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
};

/** Alert — an inline status message. */
function Alert({
  variant = "info",
  title,
  children,
  icon = true,
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "alert",
    className: __ds_scope.cx("ad-alert", `ad-alert--${variant}`, className)
  }, props), icon && /*#__PURE__*/React.createElement("svg", {
    className: "ad-alert-icon",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: ICONS[variant]
  })), /*#__PURE__*/React.createElement("div", {
    className: "ad-alert-body"
  }, title != null && /*#__PURE__*/React.createElement("div", {
    className: "ad-alert-title"
  }, title), children != null && /*#__PURE__*/React.createElement("div", {
    className: "ad-alert-desc"
  }, children)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
__ds_scope.injectOnce("ad-dialog", `
@keyframes ad-dialog-in { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes ad-overlay-in { from { opacity: 0; } to { opacity: 1; } }
.ad-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; background: color-mix(in srgb, var(--sand-12) 38%, transparent); backdrop-filter: blur(2px); animation: ad-overlay-in var(--duration-base) var(--ease-standard); }
.ad-dialog { background: var(--popover); color: var(--popover-foreground); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); width: 100%; max-width: 440px; animation: ad-dialog-in var(--duration-slow) var(--ease-out); }
.ad-dialog-header { padding: var(--space-5) var(--space-5) 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.ad-dialog-title { font: var(--weight-medium) var(--text-h3)/var(--leading-snug) var(--font-sans); margin: 0; }
.ad-dialog-desc { font: var(--weight-regular) var(--text-sm)/var(--leading-normal) var(--font-sans); color: var(--muted-foreground); margin: 6px 0 0; }
.ad-dialog-body { padding: var(--space-4) var(--space-5); }
.ad-dialog-footer { padding: 0 var(--space-5) var(--space-5); display: flex; justify-content: flex-end; gap: var(--space-2); }
.ad-dialog-close { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: none; background: transparent; color: var(--muted-foreground); border-radius: var(--radius-sm); cursor: pointer; flex: none; transition: background var(--duration-fast) var(--ease-standard); }
.ad-dialog-close:hover { background: var(--secondary); color: var(--foreground); }
`);

/** Dialog — a modal overlay for focused tasks and confirmations. */
function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className = ""
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ad-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: __ds_scope.cx("ad-dialog", className),
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "ad-dialog-header"
  }, /*#__PURE__*/React.createElement("div", null, title != null && /*#__PURE__*/React.createElement("h3", {
    className: "ad-dialog-title"
  }, title), description != null && /*#__PURE__*/React.createElement("p", {
    className: "ad-dialog-desc"
  }, description)), onClose && /*#__PURE__*/React.createElement("button", {
    className: "ad-dialog-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  })))), children != null && /*#__PURE__*/React.createElement("div", {
    className: "ad-dialog-body"
  }, children), footer != null && /*#__PURE__*/React.createElement("div", {
    className: "ad-dialog-footer"
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-toast", `
.ad-toast { display: flex; align-items: flex-start; gap: 11px; background: var(--popover); color: var(--popover-foreground); border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); padding: 12px 14px; min-width: 260px; max-width: 380px; }
.ad-toast-accent { width: 3px; align-self: stretch; border-radius: var(--radius-full); background: var(--primary); flex: none; }
.ad-toast--success .ad-toast-accent { background: var(--success); }
.ad-toast--danger .ad-toast-accent { background: var(--destructive); }
.ad-toast--warning .ad-toast-accent { background: var(--warning); }
.ad-toast-body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.ad-toast-title { font: var(--weight-medium) var(--text-body)/1.4 var(--font-sans); }
.ad-toast-desc { font: var(--weight-regular) var(--text-sm)/var(--leading-normal) var(--font-sans); color: var(--muted-foreground); }
.ad-toast-close { display: inline-flex; width: 22px; height: 22px; align-items: center; justify-content: center; border: none; background: transparent; color: var(--subtle-foreground); border-radius: var(--radius-sm); cursor: pointer; flex: none; transition: background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard); }
.ad-toast-close:hover { background: var(--secondary); color: var(--foreground); }
`);

/** Toast — a transient notification, usually stacked bottom-right. */
function Toast({
  tone = "primary",
  title,
  children,
  onClose,
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: __ds_scope.cx("ad-toast", tone !== "primary" && `ad-toast--${tone}`, className),
    role: "status"
  }, props), /*#__PURE__*/React.createElement("span", {
    className: "ad-toast-accent"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ad-toast-body"
  }, title != null && /*#__PURE__*/React.createElement("div", {
    className: "ad-toast-title"
  }, title), children != null && /*#__PURE__*/React.createElement("div", {
    className: "ad-toast-desc"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    className: "ad-toast-close",
    "aria-label": "Dismiss",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-tooltip", `
.ad-tooltip-wrap { position: relative; display: inline-flex; }
.ad-tooltip-bubble {
  position: absolute; z-index: 50; pointer-events: none;
  background: var(--sand-12); color: var(--sand-1);
  font-family: var(--font-sans); font-size: var(--text-sm); line-height: 1.35;
  padding: 6px 10px; border-radius: var(--radius-sm); box-shadow: var(--shadow-md);
  white-space: nowrap; opacity: 0; transform: translateY(2px) scale(0.97);
  transition: opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-out);
}
.ad-tooltip-wrap:hover .ad-tooltip-bubble,
.ad-tooltip-wrap:focus-within .ad-tooltip-bubble { opacity: 1; transform: translateY(0) scale(1); }
.ad-tooltip--top { bottom: 100%; left: 50%; transform-origin: bottom center; margin-bottom: 8px; translate: -50% 0; }
.ad-tooltip--bottom { top: 100%; left: 50%; margin-top: 8px; translate: -50% 0; }
.ad-tooltip--left { right: 100%; top: 50%; margin-right: 8px; translate: 0 -50%; }
.ad-tooltip--right { left: 100%; top: 50%; margin-left: 8px; translate: 0 -50%; }
`);

/** Tooltip — a small label revealed on hover/focus of its child. */
function Tooltip({
  label,
  side = "top",
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: __ds_scope.cx("ad-tooltip-wrap", className)
  }, props), children, /*#__PURE__*/React.createElement("span", {
    className: __ds_scope.cx("ad-tooltip-bubble", `ad-tooltip--${side}`),
    role: "tooltip"
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-button", `
.ad-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-sans); font-weight: var(--weight-medium);
  border: 1px solid transparent; border-radius: var(--radius-md);
  cursor: pointer; white-space: nowrap; user-select: none;
  transition: background var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard),
              opacity var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-standard);
}
.ad-btn:active { transform: translateY(0.5px); }
.ad-btn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
.ad-btn:disabled { opacity: 0.5; pointer-events: none; }
.ad-btn--sm { height: 32px; padding: 0 12px; font-size: var(--text-sm); }
.ad-btn--md { height: 38px; padding: 0 16px; font-size: var(--text-body); }
.ad-btn--lg { height: 44px; padding: 0 20px; font-size: var(--text-body-lg); }
.ad-btn--primary { background: var(--primary); color: var(--primary-foreground); }
.ad-btn--primary:hover { background: var(--primary-hover); }
.ad-btn--secondary { background: var(--secondary); color: var(--secondary-foreground); border-color: var(--border); }
.ad-btn--secondary:hover { background: var(--secondary-hover); }
.ad-btn--ghost { background: transparent; color: var(--foreground); }
.ad-btn--ghost:hover { background: var(--secondary); }
.ad-btn--outline { background: transparent; color: var(--foreground); border-color: var(--border-strong); }
.ad-btn--outline:hover { background: var(--secondary); }
.ad-btn--destructive { background: var(--destructive); color: var(--destructive-foreground); }
.ad-btn--destructive:hover { background: var(--destructive-hover); }
.ad-btn--block { width: 100%; }
`);

/**
 * Button — the primary action control.
 */
function Button({
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: __ds_scope.cx("ad-btn", `ad-btn--${variant}`, `ad-btn--${size}`, block && "ad-btn--block", className)
  }, props), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-checkbox", `
.ad-check { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; font-family: var(--font-sans); font-size: var(--text-body); color: var(--foreground); user-select: none; }
.ad-check input { position: absolute; opacity: 0; width: 0; height: 0; }
.ad-check-box {
  width: 18px; height: 18px; border-radius: 6px; border: 1px solid var(--border-strong);
  background: var(--surface); display: inline-flex; align-items: center; justify-content: center;
  color: var(--primary-foreground); flex: none;
  transition: background var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}
.ad-check-box svg { width: 13px; height: 13px; opacity: 0; transform: scale(0.6); transition: opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-out); }
.ad-check input:checked + .ad-check-box { background: var(--primary); border-color: var(--primary); }
.ad-check input:checked + .ad-check-box svg { opacity: 1; transform: scale(1); }
.ad-check input:focus-visible + .ad-check-box { box-shadow: var(--shadow-focus); }
.ad-check input:disabled ~ * { opacity: 0.5; }
.ad-check:has(input:disabled) { cursor: not-allowed; }
`);

/**
 * Checkbox — boolean toggle with an optional label.
 */
function Checkbox({
  label,
  className = "",
  id,
  ...props
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: __ds_scope.cx("ad-check", className),
    htmlFor: id
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    id: id
  }, props)), /*#__PURE__*/React.createElement("span", {
    className: "ad-check-box"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), label != null && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
__ds_scope.injectOnce("ad-field", `
.ad-field { display: flex; flex-direction: column; gap: 6px; }
.ad-field-label { font-family: var(--font-sans); font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--foreground); display: inline-flex; gap: 4px; align-items: center; }
.ad-field-req { color: var(--destructive); }
.ad-field-hint { font-family: var(--font-sans); font-size: var(--text-sm); color: var(--muted-foreground); }
.ad-field-error { font-family: var(--font-sans); font-size: var(--text-sm); color: var(--destructive-text); }
`);

/**
 * Field — labelled wrapper for a form control with hint / error text.
 */
function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  className = "",
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: __ds_scope.cx("ad-field", className)
  }, label != null && /*#__PURE__*/React.createElement("label", {
    className: "ad-field-label",
    htmlFor: htmlFor
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "ad-field-req",
    "aria-hidden": "true"
  }, "*")), children, error != null ? /*#__PURE__*/React.createElement("span", {
    className: "ad-field-error"
  }, error) : hint != null ? /*#__PURE__*/React.createElement("span", {
    className: "ad-field-hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-iconbutton", `
.ad-iconbtn {
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid transparent; border-radius: var(--radius-md);
  cursor: pointer; color: var(--muted-foreground); background: transparent;
  transition: background var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard);
}
.ad-iconbtn:hover { background: var(--secondary); color: var(--foreground); }
.ad-iconbtn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
.ad-iconbtn:disabled { opacity: 0.5; pointer-events: none; }
.ad-iconbtn--sm { width: 32px; height: 32px; }
.ad-iconbtn--md { width: 38px; height: 38px; }
.ad-iconbtn--lg { width: 44px; height: 44px; }
.ad-iconbtn--solid { background: var(--secondary); border-color: var(--border); }
.ad-iconbtn--solid:hover { background: var(--secondary-hover); }
`);

/**
 * IconButton — a square, icon-only button. Always pass an aria-label.
 */
function IconButton({
  size = "md",
  variant = "ghost",
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: __ds_scope.cx("ad-iconbtn", `ad-iconbtn--${size}`, variant === "solid" && "ad-iconbtn--solid", className)
  }, props), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-input", `
.ad-input {
  width: 100%; font-family: var(--font-sans); font-size: var(--text-body);
  color: var(--foreground); background: var(--surface);
  border: 1px solid var(--input); border-radius: var(--radius-md);
  height: 38px; padding: 0 12px;
  transition: border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard);
}
.ad-input::placeholder { color: var(--subtle-foreground); }
.ad-input:hover { border-color: var(--border-strong); }
.ad-input:focus { outline: none; border-color: var(--ring); box-shadow: var(--shadow-focus); }
.ad-input:disabled { opacity: 0.55; cursor: not-allowed; background: var(--secondary); }
.ad-input[aria-invalid="true"] { border-color: var(--destructive); }
.ad-input[aria-invalid="true"]:focus { box-shadow: 0 0 0 3px var(--destructive-soft); }
.ad-input--sm { height: 32px; font-size: var(--text-sm); }
.ad-input--lg { height: 44px; font-size: var(--text-body-lg); }
`);

/**
 * Input — single-line text field.
 */
function Input({
  size = "md",
  invalid = false,
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    "aria-invalid": invalid || undefined,
    className: __ds_scope.cx("ad-input", size !== "md" && `ad-input--${size}`, className)
  }, props));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-radio", `
.ad-radio { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; font-family: var(--font-sans); font-size: var(--text-body); color: var(--foreground); user-select: none; }
.ad-radio input { position: absolute; opacity: 0; width: 0; height: 0; }
.ad-radio-dot {
  width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--border-strong);
  background: var(--surface); display: inline-flex; align-items: center; justify-content: center; flex: none;
  transition: border-color var(--duration-fast) var(--ease-standard);
}
.ad-radio-dot::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--primary); transform: scale(0); transition: transform var(--duration-fast) var(--ease-out); }
.ad-radio input:checked + .ad-radio-dot { border-color: var(--primary); }
.ad-radio input:checked + .ad-radio-dot::after { transform: scale(1); }
.ad-radio input:focus-visible + .ad-radio-dot { box-shadow: var(--shadow-focus); }
.ad-radio input:disabled ~ * { opacity: 0.5; }
`);

/**
 * Radio — single choice within a group (share the same name).
 */
function Radio({
  label,
  className = "",
  id,
  ...props
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: __ds_scope.cx("ad-radio", className),
    htmlFor: id
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    id: id
  }, props)), /*#__PURE__*/React.createElement("span", {
    className: "ad-radio-dot"
  }), label != null && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-select", `
.ad-select-wrap { position: relative; display: inline-flex; width: 100%; }
.ad-select {
  width: 100%; appearance: none; font-family: var(--font-sans); font-size: var(--text-body);
  color: var(--foreground); background: var(--surface);
  border: 1px solid var(--input); border-radius: var(--radius-md);
  height: 38px; padding: 0 36px 0 12px; cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard);
}
.ad-select:hover { border-color: var(--border-strong); }
.ad-select:focus { outline: none; border-color: var(--ring); box-shadow: var(--shadow-focus); }
.ad-select:disabled { opacity: 0.55; cursor: not-allowed; background: var(--secondary); }
.ad-select-caret {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  pointer-events: none; color: var(--muted-foreground); width: 16px; height: 16px;
}
`);

/**
 * Select — native dropdown styled to the system.
 */
function Select({
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "ad-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: __ds_scope.cx("ad-select", className)
  }, props), children), /*#__PURE__*/React.createElement("svg", {
    className: "ad-select-caret",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Slider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-slider", `
.ad-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 22px; background: transparent; cursor: pointer; }
.ad-slider::-webkit-slider-runnable-track { height: 6px; border-radius: var(--radius-full); background: var(--sand-5); }
.ad-slider::-moz-range-track { height: 6px; border-radius: var(--radius-full); background: var(--sand-5); }
.ad-slider::-moz-range-progress { height: 6px; border-radius: var(--radius-full); background: var(--primary); }
.ad-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; margin-top: -6px;
  width: 18px; height: 18px; border-radius: 50%; background: #fff;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast) var(--ease-out);
}
.ad-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
.ad-slider:active::-webkit-slider-thumb { transform: scale(1.1); }
.ad-slider:focus-visible::-webkit-slider-thumb { box-shadow: var(--shadow-focus); }
`);

/**
 * Slider — choose a value along a range.
 */
function Slider({
  className = "",
  style,
  value,
  defaultValue,
  min = 0,
  max = 100,
  ...props
}) {
  // Paint the filled portion for webkit via a gradient track.
  const v = (value != null ? value : defaultValue) ?? min;
  const pct = (Number(v) - min) / (max - min) * 100;
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "range",
    min: min,
    max: max,
    value: value,
    defaultValue: defaultValue,
    className: __ds_scope.cx("ad-slider", className),
    style: {
      background: `linear-gradient(var(--primary),var(--primary)) 0/${pct}% 6px no-repeat`,
      ...style
    }
  }, props));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-switch", `
.ad-switch { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; font-family: var(--font-sans); font-size: var(--text-body); color: var(--foreground); user-select: none; }
.ad-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
.ad-switch-track {
  width: 38px; height: 22px; border-radius: var(--radius-full); background: var(--sand-6);
  padding: 2px; flex: none; transition: background var(--duration-base) var(--ease-standard);
}
.ad-switch-thumb {
  width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: var(--shadow-sm);
  transition: transform var(--duration-base) var(--ease-out);
}
.ad-switch input:checked + .ad-switch-track { background: var(--primary); }
.ad-switch input:checked + .ad-switch-track .ad-switch-thumb { transform: translateX(16px); }
.ad-switch input:focus-visible + .ad-switch-track { box-shadow: var(--shadow-focus); }
.ad-switch input:disabled ~ * { opacity: 0.5; }
`);

/**
 * Switch — instant on/off toggle for settings.
 */
function Switch({
  label,
  className = "",
  id,
  ...props
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: __ds_scope.cx("ad-switch", className),
    htmlFor: id
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    id: id
  }, props)), /*#__PURE__*/React.createElement("span", {
    className: "ad-switch-track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ad-switch-thumb"
  })), label != null && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-textarea", `
.ad-textarea {
  width: 100%; font-family: var(--font-sans); font-size: var(--text-body);
  line-height: var(--leading-normal); color: var(--foreground);
  background: var(--surface); border: 1px solid var(--input);
  border-radius: var(--radius-md); padding: 9px 12px; min-height: 88px; resize: vertical;
  transition: border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard);
}
.ad-textarea::placeholder { color: var(--subtle-foreground); }
.ad-textarea:hover { border-color: var(--border-strong); }
.ad-textarea:focus { outline: none; border-color: var(--ring); box-shadow: var(--shadow-focus); }
.ad-textarea:disabled { opacity: 0.55; cursor: not-allowed; background: var(--secondary); }
`);

/**
 * Textarea — multi-line text field.
 */
function Textarea({
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: __ds_scope.cx("ad-textarea", className)
  }, props));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-breadcrumb", `
.ad-breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; font-family: var(--font-sans); font-size: var(--text-sm); }
.ad-breadcrumb a, .ad-breadcrumb-item { color: var(--muted-foreground); text-decoration: none; border-radius: 5px; transition: color var(--duration-fast) var(--ease-standard); }
.ad-breadcrumb a:hover { color: var(--foreground); }
.ad-breadcrumb-current { color: var(--foreground); font-weight: var(--weight-medium); }
.ad-breadcrumb-sep { color: var(--subtle-foreground); display: inline-flex; }
`);

/** Breadcrumb — shows the path to the current page. */
function Breadcrumb({
  items = [],
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": "Breadcrumb",
    className: __ds_scope.cx("ad-breadcrumb", className)
  }, props), items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, last || !it.href ? /*#__PURE__*/React.createElement("span", {
      className: __ds_scope.cx("ad-breadcrumb-item", last && "ad-breadcrumb-current"),
      "aria-current": last ? "page" : undefined
    }, it.label) : /*#__PURE__*/React.createElement("a", {
      href: it.href
    }, it.label), !last && /*#__PURE__*/React.createElement("span", {
      className: "ad-breadcrumb-sep",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "m9 18 6-6-6-6"
    }))));
  }));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectOnce("ad-tabs", `
.ad-tabs { display: inline-flex; gap: 2px; padding: 3px; background: var(--secondary); border-radius: var(--radius-md); }
.ad-tab { appearance: none; border: none; background: transparent; cursor: pointer; font-family: var(--font-sans); font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--muted-foreground); padding: 6px 14px; border-radius: var(--radius-sm); transition: color var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard); }
.ad-tab:hover { color: var(--foreground); }
.ad-tab[aria-selected="true"] { background: var(--surface); color: var(--foreground); box-shadow: var(--shadow-xs); }
.ad-tab:focus-visible { outline: none; box-shadow: var(--shadow-focus); }

.ad-tabs--underline { display: flex; gap: 22px; padding: 0; background: transparent; border-bottom: 1px solid var(--border); border-radius: 0; }
.ad-tabs--underline .ad-tab { padding: 9px 0; border-radius: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.ad-tabs--underline .ad-tab[aria-selected="true"] { background: transparent; box-shadow: none; color: var(--foreground); border-bottom-color: var(--primary); }
`);

/** Tabs — switch between sibling views. Controlled via value/onChange. */
function Tabs({
  items = [],
  value,
  onChange,
  variant = "segmented",
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    className: __ds_scope.cx("ad-tabs", variant === "underline" && "ad-tabs--underline", className)
  }, props), items.map(it => {
    const val = typeof it === "string" ? it : it.value;
    const label = typeof it === "string" ? it : it.label;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      type: "button",
      "aria-selected": val === value,
      className: "ad-tab",
      onClick: () => onChange && onChange(val)
    }, label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/AppShell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Console — app shell: left sidebar + top bar. Exposes window.AppShell */
(function () {
  const NS = window.AdityaDesignSystem_25de17;
  const {
    Avatar,
    Badge,
    IconButton,
    Separator
  } = NS;
  const Icon = window.KitIcon;
  function NavItem({
    icon,
    label,
    active,
    badge,
    onClick
  }) {
    return /*#__PURE__*/React.createElement("button", {
      className: "con-nav" + (active ? " is-active" : ""),
      onClick: onClick
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18
    }), /*#__PURE__*/React.createElement("span", null, label), badge != null && /*#__PURE__*/React.createElement("span", {
      className: "con-nav-badge"
    }, badge));
  }
  function AppShell({
    user,
    active,
    onNav,
    title,
    breadcrumb,
    actions,
    onLogout,
    children
  }) {
    const nav = [{
      id: "dashboard",
      icon: "layout-dashboard",
      label: "Dashboard"
    }, {
      id: "assistant",
      icon: "sparkles",
      label: "Assistant",
      badge: "AI"
    }, {
      id: "projects",
      icon: "folder",
      label: "Projects"
    }, {
      id: "deployments",
      icon: "rocket",
      label: "Deployments"
    }, {
      id: "settings",
      icon: "settings",
      label: "Settings"
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "con-shell"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "con-sidebar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "con-brand"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logomark.svg",
      width: "26",
      height: "26",
      alt: ""
    }), /*#__PURE__*/React.createElement("span", {
      className: "con-brand-name"
    }, "Aditya"), /*#__PURE__*/React.createElement(Badge, {
      variant: "outline",
      style: {
        marginLeft: "auto"
      }
    }, "console")), /*#__PURE__*/React.createElement("nav", {
      className: "con-navlist"
    }, nav.map(n => /*#__PURE__*/React.createElement(NavItem, _extends({
      key: n.id
    }, n, {
      active: active === n.id,
      onClick: () => onNav(n.id)
    })))), /*#__PURE__*/React.createElement("div", {
      className: "con-usage"
    }, /*#__PURE__*/React.createElement("div", {
      className: "con-usage-row"
    }, /*#__PURE__*/React.createElement("span", null, "Compute"), /*#__PURE__*/React.createElement("span", {
      className: "tnum"
    }, "68%")), /*#__PURE__*/React.createElement("div", {
      className: "con-usage-bar"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "68%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "con-usage-sub"
    }, "2.1M of 3M tokens")), /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement("button", {
      className: "con-user",
      onClick: onLogout,
      title: "Sign out"
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: user.name,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      className: "con-user-meta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "con-user-name"
    }, user.name), /*#__PURE__*/React.createElement("div", {
      className: "con-user-mail"
    }, user.email)), /*#__PURE__*/React.createElement(Icon, {
      name: "log-out",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "con-main"
    }, /*#__PURE__*/React.createElement("header", {
      className: "con-topbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "con-topbar-left"
    }, breadcrumb), /*#__PURE__*/React.createElement("div", {
      className: "con-topbar-right"
    }, /*#__PURE__*/React.createElement("button", {
      className: "con-search"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    }), /*#__PURE__*/React.createElement("span", null, "Search\u2026"), /*#__PURE__*/React.createElement("span", {
      className: "con-kbd"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "command",
      size: 11
    }), " K")), /*#__PURE__*/React.createElement(IconButton, {
      "aria-label": "Notifications"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 18
    })), actions)), /*#__PURE__*/React.createElement("div", {
      className: "con-content"
    }, children)));
  }
  window.AppShell = AppShell;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Assistant.jsx
try { (() => {
/* Console — AI assistant chat. Exposes window.Assistant */
(function () {
  const NS = window.AdityaDesignSystem_25de17;
  const {
    Button,
    Textarea,
    Badge,
    Avatar,
    IconButton
  } = NS;
  const Icon = window.KitIcon;
  const SUGGESTIONS = ["Why did acme-web's last deploy fail?", "Summarize this week's latency regressions", "Draft a rollback plan for atlas-api"];
  const SEED = [{
    role: "assistant",
    text: "Hi Aditya — I'm watching your 4 projects. acme-web is live, muse-ai is building. What would you like to dig into?"
  }];
  function Bubble({
    m
  }) {
    if (m.role === "user") {
      return /*#__PURE__*/React.createElement("div", {
        className: "con-msg is-user"
      }, /*#__PURE__*/React.createElement("div", {
        className: "con-bubble is-user"
      }, m.text), /*#__PURE__*/React.createElement(Avatar, {
        name: "Aditya Tomar",
        size: "sm"
      }));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "con-msg"
    }, /*#__PURE__*/React.createElement("span", {
      className: "con-ai-av"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "con-bubble"
    }, m.text));
  }
  function Assistant() {
    const [msgs, setMsgs] = React.useState(SEED);
    const [draft, setDraft] = React.useState("");
    const [thinking, setThinking] = React.useState(false);
    const scroller = React.useRef(null);
    React.useEffect(() => {
      if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
    }, [msgs, thinking]);
    function send(text) {
      const t = (text ?? draft).trim();
      if (!t) return;
      setMsgs(m => [...m, {
        role: "user",
        text: t
      }]);
      setDraft("");
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        setMsgs(m => [...m, {
          role: "assistant",
          text: reply(t)
        }]);
      }, 900);
    }
    function reply(t) {
      if (/fail|error/i.test(t)) return "acme-web's deploy failed at the build step: a missing GEIST_API_KEY env var. I can re-run with the key from your team vault, or open the full log. Want me to retry?";
      if (/latency|regress/i.test(t)) return "p95 latency rose 6ms on atlas-api Tuesday, traced to an un-indexed query on the orders table. A composite index on (team_id, created_at) brings it back under 80ms.";
      if (/rollback|roll back/i.test(t)) return "Rollback plan for atlas-api: 1) pin to deploy #87 (last green), 2) drain edge cache, 3) re-point the alias. Zero-downtime. Shall I stage it?";
      return "Got it. I'll pull the relevant logs and metrics and summarize what I find across your projects.";
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "con-chat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "con-chat-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "con-ai-av lg"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 18
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "con-chat-title"
    }, "Assistant"), /*#__PURE__*/React.createElement("div", {
      className: "con-chat-sub"
    }, "Grounded in your projects, deploys & logs")), /*#__PURE__*/React.createElement(Badge, {
      variant: "accent",
      style: {
        marginLeft: "auto"
      }
    }, "Connected")), /*#__PURE__*/React.createElement("div", {
      className: "con-chat-scroll",
      ref: scroller
    }, msgs.map((m, i) => /*#__PURE__*/React.createElement(Bubble, {
      key: i,
      m: m
    })), thinking && /*#__PURE__*/React.createElement("div", {
      className: "con-msg"
    }, /*#__PURE__*/React.createElement("span", {
      className: "con-ai-av"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "con-bubble con-typing"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), msgs.length <= 1 && !thinking && /*#__PURE__*/React.createElement("div", {
      className: "con-suggest"
    }, SUGGESTIONS.map(s => /*#__PURE__*/React.createElement("button", {
      key: s,
      className: "con-chip",
      onClick: () => send(s)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 14
    }), " ", s)))), /*#__PURE__*/React.createElement("div", {
      className: "con-composer"
    }, /*#__PURE__*/React.createElement(Textarea, {
      value: draft,
      onChange: e => setDraft(e.target.value),
      onKeyDown: e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      },
      placeholder: "Ask about a deploy, a metric, or a project\u2026",
      rows: 1,
      className: "con-composer-input"
    }), /*#__PURE__*/React.createElement("div", {
      className: "con-composer-actions"
    }, /*#__PURE__*/React.createElement("span", {
      className: "con-composer-hint"
    }, "Enter to send \xB7 Shift+Enter for newline"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => send(),
      disabled: !draft.trim()
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 16
    }), " Send"))));
  }
  window.Assistant = Assistant;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Assistant.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Dashboard.jsx
try { (() => {
/* Console — dashboard: metrics, projects, activity. Exposes window.Dashboard */
(function () {
  const NS = window.AdityaDesignSystem_25de17;
  const {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Badge,
    Button,
    Progress,
    Tabs,
    Avatar
  } = NS;
  const Icon = window.KitIcon;
  function Metric({
    icon,
    label,
    value,
    delta,
    tone
  }) {
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
      className: "con-metric-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "con-metric-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 16
    })), /*#__PURE__*/React.createElement("span", {
      className: "con-metric-label"
    }, label)), /*#__PURE__*/React.createElement("div", {
      className: "con-metric-value tnum"
    }, value), delta && /*#__PURE__*/React.createElement("div", {
      className: "con-metric-delta " + tone
    }, delta)));
  }
  const PROJECTS = [{
    name: "acme-web",
    desc: "Next.js · marketing site",
    status: "Live",
    tone: "success",
    deploys: 142,
    branch: "main"
  }, {
    name: "atlas-api",
    desc: "Edge functions · Postgres",
    status: "Live",
    tone: "success",
    deploys: 88,
    branch: "main"
  }, {
    name: "muse-ai",
    desc: "Assistant · RAG pipeline",
    status: "Building",
    tone: "warning",
    deploys: 51,
    branch: "feat/embed"
  }, {
    name: "ledger",
    desc: "Internal · billing",
    status: "Paused",
    tone: "neutral",
    deploys: 19,
    branch: "main"
  }];
  const ACTIVITY = [{
    who: "Mira Shah",
    what: "deployed acme-web to production",
    when: "2m",
    icon: "rocket"
  }, {
    who: "Aditya Tomar",
    what: "merged feat/embed into muse-ai",
    when: "1h",
    icon: "git-branch"
  }, {
    who: "Lee Park",
    what: "rotated the atlas-api database key",
    when: "3h",
    icon: "key"
  }, {
    who: "Mira Shah",
    what: "invited a teammate to ledger",
    when: "5h",
    icon: "user"
  }];
  function Dashboard({
    onOpenProject,
    tab,
    setTab
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "con-dash"
    }, /*#__PURE__*/React.createElement("div", {
      className: "con-metrics"
    }, /*#__PURE__*/React.createElement(Metric, {
      icon: "rocket",
      label: "Deployments",
      value: "300",
      delta: "+18 this week",
      tone: "up"
    }), /*#__PURE__*/React.createElement(Metric, {
      icon: "zap",
      label: "Requests / day",
      value: "1.24M",
      delta: "+12.4%",
      tone: "up"
    }), /*#__PURE__*/React.createElement(Metric, {
      icon: "clock",
      label: "p95 latency",
      value: "84ms",
      delta: "\u22126ms",
      tone: "up"
    }), /*#__PURE__*/React.createElement(Metric, {
      icon: "shield-check",
      label: "Uptime",
      value: "99.98%",
      delta: "30-day",
      tone: "flat"
    })), /*#__PURE__*/React.createElement("div", {
      className: "con-dash-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      className: "con-section-title"
    }, "Projects"), /*#__PURE__*/React.createElement("p", {
      className: "con-section-sub"
    }, "Four active workspaces in your team.")), /*#__PURE__*/React.createElement("div", {
      className: "con-dash-actions"
    }, /*#__PURE__*/React.createElement(Tabs, {
      items: [{
        value: "all",
        label: "All"
      }, {
        value: "live",
        label: "Live"
      }, {
        value: "building",
        label: "Building"
      }],
      value: tab,
      onChange: setTab
    }), /*#__PURE__*/React.createElement(Button, null, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 17
    }), " New project"))), /*#__PURE__*/React.createElement("div", {
      className: "con-projects"
    }, PROJECTS.map(p => /*#__PURE__*/React.createElement(Card, {
      key: p.name,
      hover: true,
      className: "con-proj",
      onClick: () => onOpenProject(p)
    }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
      className: "con-proj-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "con-proj-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "folder",
      size: 18
    })), /*#__PURE__*/React.createElement(CardTitle, null, p.name), /*#__PURE__*/React.createElement(Badge, {
      variant: p.tone,
      dot: p.tone === "success",
      style: {
        marginLeft: "auto"
      }
    }, p.status)), /*#__PURE__*/React.createElement(CardDescription, null, p.desc)), /*#__PURE__*/React.createElement(CardFooter, {
      className: "con-proj-foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "con-proj-meta"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "git-branch",
      size: 14
    }), " ", p.branch), /*#__PURE__*/React.createElement("span", {
      className: "con-proj-meta tnum"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rocket",
      size: 14
    }), " ", p.deploys), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      className: "con-proj-go"
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "con-dash-grid"
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Recent activity")), /*#__PURE__*/React.createElement(CardContent, {
      className: "con-activity"
    }, ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement("div", {
      className: "con-act",
      key: i
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: a.who,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      className: "con-act-body"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, a.who), " ", a.what)), /*#__PURE__*/React.createElement("span", {
      className: "con-act-when tnum"
    }, a.when))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Plan usage"), /*#__PURE__*/React.createElement(CardDescription, null, "Team \xB7 Scale plan")), /*#__PURE__*/React.createElement(CardContent, {
      className: "con-usage-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "con-usage-line"
    }, /*#__PURE__*/React.createElement("span", null, "Compute"), /*#__PURE__*/React.createElement("span", {
      className: "tnum"
    }, "2.1M / 3M tokens")), /*#__PURE__*/React.createElement(Progress, {
      value: 68,
      tone: "warning"
    }), /*#__PURE__*/React.createElement("div", {
      className: "con-usage-line"
    }, /*#__PURE__*/React.createElement("span", null, "Bandwidth"), /*#__PURE__*/React.createElement("span", {
      className: "tnum"
    }, "412 / 1000 GB")), /*#__PURE__*/React.createElement(Progress, {
      value: 41
    }), /*#__PURE__*/React.createElement("div", {
      className: "con-usage-line"
    }, /*#__PURE__*/React.createElement("span", null, "Seats"), /*#__PURE__*/React.createElement("span", {
      className: "tnum"
    }, "7 / 10")), /*#__PURE__*/React.createElement(Progress, {
      value: 70
    })), /*#__PURE__*/React.createElement(CardFooter, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Manage plan")))));
  }
  window.Dashboard = Dashboard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Login.jsx
try { (() => {
/* Console — sign-in screen. Exposes window.Login */
(function () {
  const NS = window.AdityaDesignSystem_25de17;
  const {
    Button,
    Input,
    Field,
    Separator,
    Checkbox
  } = NS;
  const Icon = window.KitIcon;
  function Login({
    onSignIn
  }) {
    const [email, setEmail] = React.useState("aditya@studio.dev");
    return /*#__PURE__*/React.createElement("div", {
      className: "con-auth"
    }, /*#__PURE__*/React.createElement("div", {
      className: "con-auth-card"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logomark.svg",
      width: "40",
      height: "40",
      alt: ""
    }), /*#__PURE__*/React.createElement("h1", {
      className: "con-auth-title"
    }, "Sign in to Aditya"), /*#__PURE__*/React.createElement("p", {
      className: "con-auth-sub"
    }, "Welcome back. Pick up where you left off."), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      block: true,
      onClick: onSignIn,
      className: "con-oauth"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "git-branch",
      size: 17
    }), " Continue with GitHub"), /*#__PURE__*/React.createElement("div", {
      className: "con-or"
    }, /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement("span", null, "or"), /*#__PURE__*/React.createElement(Separator, null)), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        onSignIn();
      },
      className: "con-auth-form"
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Email",
      htmlFor: "login-email"
    }, /*#__PURE__*/React.createElement(Input, {
      id: "login-email",
      type: "email",
      value: email,
      onChange: e => setEmail(e.target.value),
      placeholder: "you@example.com"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Password",
      htmlFor: "login-pw"
    }, /*#__PURE__*/React.createElement(Input, {
      id: "login-pw",
      type: "password",
      defaultValue: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    })), /*#__PURE__*/React.createElement("div", {
      className: "con-auth-row"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      label: "Remember me",
      defaultChecked: true
    }), /*#__PURE__*/React.createElement("a", {
      className: "con-link",
      href: "#",
      onClick: e => e.preventDefault()
    }, "Forgot password?")), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      block: true
    }, "Sign in")), /*#__PURE__*/React.createElement("p", {
      className: "con-auth-foot"
    }, "New here? ", /*#__PURE__*/React.createElement("a", {
      className: "con-link",
      href: "#",
      onClick: e => {
        e.preventDefault();
        onSignIn();
      }
    }, "Create an account"))), /*#__PURE__*/React.createElement("p", {
      className: "con-auth-legal"
    }, "Protected by WCAG-AA contrast and a calm sense of warmth."));
  }
  window.Login = Login;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Settings.jsx
try { (() => {
/* Console — settings, incl. the per-project accent picker + dark mode + danger zone.
 * Exposes window.Settings */
(function () {
  const NS = window.AdityaDesignSystem_25de17;
  const {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Button,
    Input,
    Field,
    Switch,
    Select,
    Dialog,
    Alert
  } = NS;
  const Icon = window.KitIcon;
  const ACCENTS = [{
    id: "teal",
    label: "Teal",
    hex: "#12A594"
  }, {
    id: "iris",
    label: "Iris",
    hex: "#5B5BD6"
  }, {
    id: "grass",
    label: "Grass",
    hex: "#46A758"
  }, {
    id: "amber",
    label: "Amber",
    hex: "#FFC53D"
  }, {
    id: "tomato",
    label: "Tomato",
    hex: "#E54D2E"
  }];
  function Settings({
    accent,
    setAccent,
    dark,
    setDark
  }) {
    const [open, setOpen] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      className: "con-settings"
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "General"), /*#__PURE__*/React.createElement(CardDescription, null, "Workspace details everyone on the team sees.")), /*#__PURE__*/React.createElement(CardContent, {
      className: "con-form-grid"
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Workspace name",
      htmlFor: "ws"
    }, /*#__PURE__*/React.createElement(Input, {
      id: "ws",
      defaultValue: "Aditya Studio"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Slug",
      htmlFor: "slug",
      hint: "Used in URLs and the CLI."
    }, /*#__PURE__*/React.createElement(Input, {
      id: "slug",
      defaultValue: "aditya-studio"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Region",
      htmlFor: "region"
    }, /*#__PURE__*/React.createElement(Select, {
      id: "region",
      defaultValue: "iad"
    }, /*#__PURE__*/React.createElement("option", {
      value: "iad"
    }, "US East (iad1)"), /*#__PURE__*/React.createElement("option", {
      value: "sfo"
    }, "US West (sfo1)"), /*#__PURE__*/React.createElement("option", {
      value: "fra"
    }, "Europe (fra1)"))), /*#__PURE__*/React.createElement(Field, {
      label: "Default framework",
      htmlFor: "fw"
    }, /*#__PURE__*/React.createElement(Select, {
      id: "fw",
      defaultValue: "next"
    }, /*#__PURE__*/React.createElement("option", {
      value: "next"
    }, "Next.js"), /*#__PURE__*/React.createElement("option", {
      value: "remix"
    }, "Remix"), /*#__PURE__*/React.createElement("option", {
      value: "astro"
    }, "Astro")))), /*#__PURE__*/React.createElement(CardFooter, null, /*#__PURE__*/React.createElement(Button, null, "Save changes"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost"
    }, "Cancel"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Appearance"), /*#__PURE__*/React.createElement(CardDescription, null, "One accent per product \u2014 the only color that changes between projects.")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
      className: "con-accent-row"
    }, ACCENTS.map(a => /*#__PURE__*/React.createElement("button", {
      key: a.id,
      className: "con-swatch" + (accent === a.id ? " is-active" : ""),
      onClick: () => setAccent(a.id),
      "aria-label": a.label,
      title: a.label
    }, /*#__PURE__*/React.createElement("span", {
      className: "con-swatch-dot",
      style: {
        background: a.hex
      }
    }, accent === a.id && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15
    })), /*#__PURE__*/React.createElement("span", {
      className: "con-swatch-label"
    }, a.label)))), /*#__PURE__*/React.createElement("div", {
      className: "con-appearance-row"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "con-row-title"
    }, "Dark mode"), /*#__PURE__*/React.createElement("div", {
      className: "con-row-sub"
    }, "Switch the warm sand neutral to its dark counterpart.")), /*#__PURE__*/React.createElement(Switch, {
      checked: dark,
      onChange: e => setDark(e.target.checked)
    })))), /*#__PURE__*/React.createElement(Card, {
      className: "con-danger"
    }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Danger zone"), /*#__PURE__*/React.createElement(CardDescription, null, "Irreversible actions. Proceed with care.")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Alert, {
      variant: "danger",
      title: "Delete this workspace"
    }, "Removes all projects, deployments, and members. This can't be undone.")), /*#__PURE__*/React.createElement(CardFooter, null, /*#__PURE__*/React.createElement(Button, {
      variant: "destructive",
      onClick: () => setOpen(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash-2",
      size: 16
    }), " Delete workspace"))), /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: () => setOpen(false),
      title: "Delete Aditya Studio?",
      description: "This permanently removes 4 projects and 300 deployments. Type the name to confirm.",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setOpen(false)
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        variant: "destructive",
        onClick: () => setOpen(false)
      }, "Delete workspace"))
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Aditya Studio"
    })));
  }
  window.Settings = Settings;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Settings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/icons.jsx
try { (() => {
/* Aditya UI kit — inline Lucide icons.
 * Real Lucide 2px-stroke path markup, rendered as SVG so it survives React
 * re-renders (the data-lucide + createIcons swap doesn't play well with React).
 * Exposed as window.KitIcon. */
(function () {
  const P = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'git-branch': '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    'trash-2': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'more-horizontal': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    command: '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
    'panel-left': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
    'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L21 4.5"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>'
  };
  function KitIcon({
    name,
    size = 18,
    strokeWidth = 2,
    className = "",
    style
  }) {
    const inner = P[name] || "";
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "kit-icon " + className,
      style: {
        flex: "none",
        ...style
      },
      "aria-hidden": "true",
      dangerouslySetInnerHTML: {
        __html: inner
      }
    });
  }
  window.KitIcon = KitIcon;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Footer.jsx
try { (() => {
/* Marketing — footer. Exposes window.Footer */
(function () {
  const Icon = window.KitIcon;
  const COLS = [{
    h: "Product",
    items: ["Overview", "Assistant", "Deployments", "Pricing", "Changelog"]
  }, {
    h: "Developers",
    items: ["Docs", "API reference", "CLI", "Templates", "Status"]
  }, {
    h: "Company",
    items: ["About", "Blog", "Careers", "Contact"]
  }];
  function Footer() {
    return /*#__PURE__*/React.createElement("footer", {
      className: "mk-footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-footer-inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-footer-brand"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/lockup.svg",
      height: "26",
      alt: "Aditya",
      className: "mk-lockup"
    }), /*#__PURE__*/React.createElement("p", null, "Warm, approachable, accessible \u2014 for AI & full-stack web apps."), /*#__PURE__*/React.createElement("div", {
      className: "mk-social"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault(),
      "aria-label": "GitHub"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "git-branch",
      size: 18
    })), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault(),
      "aria-label": "Globe"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "globe",
      size: 18
    })))), /*#__PURE__*/React.createElement("div", {
      className: "mk-footer-cols"
    }, COLS.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.h,
      className: "mk-footer-col"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-footer-h"
    }, c.h), c.items.map(it => /*#__PURE__*/React.createElement("a", {
      key: it,
      href: "#",
      onClick: e => e.preventDefault()
    }, it)))))), /*#__PURE__*/React.createElement("div", {
      className: "mk-footer-bar"
    }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Aditya, Inc."), /*#__PURE__*/React.createElement("div", {
      className: "mk-footer-legal"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault()
    }, "Privacy"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault()
    }, "Terms"), /*#__PURE__*/React.createElement("span", {
      className: "mk-footer-built"
    }, "Built with the Aditya Design System"))));
  }
  window.Footer = Footer;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Landing.jsx
try { (() => {
/* Marketing — landing sections: hero, logos, features, accent showcase, quote, CTA.
 * Exposes window.Landing */
(function () {
  const NS = window.AdityaDesignSystem_25de17;
  const {
    Button,
    Badge,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Avatar
  } = NS;
  const Icon = window.KitIcon;
  const FEATURES = [{
    icon: "sparkles",
    title: "AI, built in",
    desc: "An assistant grounded in your projects, deploys, and logs — not a generic chatbot."
  }, {
    icon: "rocket",
    title: "Ship on every push",
    desc: "Preview deployments for every branch, promoted to production in one click."
  }, {
    icon: "zap",
    title: "Fast by default",
    desc: "Edge runtime, smart caching, and tabular metrics so p95 stays honest."
  }, {
    icon: "shield-check",
    title: "Secure foundations",
    desc: "WCAG-AA accessible components and sensible defaults that pass review."
  }, {
    icon: "database",
    title: "Data that scales",
    desc: "Managed Postgres and object storage wired to your functions out of the box."
  }, {
    icon: "git-branch",
    title: "Built for teams",
    desc: "Roles, audit trails, and a calm console everyone actually likes using."
  }];
  const LOGOS = ["Northwind", "Lumen", "Atlas", "Foundry", "Cobalt", "Meridian"];
  function Hero({
    onCta
  }) {
    return /*#__PURE__*/React.createElement("section", {
      className: "mk-hero"
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "accent",
      className: "mk-eyebrow"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 13
    }), " Now with the Aditya Assistant"), /*#__PURE__*/React.createElement("h1", {
      className: "mk-h1"
    }, "The warm, fast way to ship", /*#__PURE__*/React.createElement("br", null), "AI & full-stack apps"), /*#__PURE__*/React.createElement("p", {
      className: "mk-lede"
    }, "Aditya is the developer platform with a calm console, a built-in assistant, and one beautiful accent per product. Approachable on the surface \u2014 engineered underneath."), /*#__PURE__*/React.createElement("div", {
      className: "mk-hero-cta"
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      onClick: onCta
    }, "Start building free"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "secondary"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "git-branch",
      size: 18
    }), " Continue with GitHub")), /*#__PURE__*/React.createElement("div", {
      className: "mk-hero-meta"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15
    }), " No credit card"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15
    }), " Deploy in minutes"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15
    }), " Free for hobby")), /*#__PURE__*/React.createElement("div", {
      className: "mk-hero-shot"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-bar"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-side"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-brand"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logomark.svg",
      width: "20",
      height: "20",
      alt: ""
    }), " Aditya"), ["Dashboard", "Assistant", "Projects", "Deployments"].map((x, i) => /*#__PURE__*/React.createElement("div", {
      key: x,
      className: "mk-shot-nav" + (i === 0 ? " on" : "")
    }, x))), /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-row"
    }, ["Deployments 300", "Requests 1.24M", "p95 84ms"].map(m => /*#__PURE__*/React.createElement("div", {
      key: m,
      className: "mk-shot-metric"
    }, /*#__PURE__*/React.createElement("span", null, m.split(" ").slice(0, -1).join(" ")), /*#__PURE__*/React.createElement("strong", {
      className: "tnum"
    }, m.split(" ").pop())))), /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-cards"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-card"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mk-dot ok"
    }), "acme-web"), /*#__PURE__*/React.createElement("div", {
      className: "mk-shot-card"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mk-dot warn"
    }), "muse-ai"))))));
  }
  function Logos() {
    return /*#__PURE__*/React.createElement("section", {
      className: "mk-logos"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mk-logos-label"
    }, "Trusted by teams shipping every day"), /*#__PURE__*/React.createElement("div", {
      className: "mk-logos-row"
    }, LOGOS.map(l => /*#__PURE__*/React.createElement("span", {
      key: l,
      className: "mk-logo"
    }, l))));
  }
  function Features() {
    return /*#__PURE__*/React.createElement("section", {
      className: "mk-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-section-head"
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "outline"
    }, "Platform"), /*#__PURE__*/React.createElement("h2", {
      className: "mk-h2"
    }, "Everything you need, nothing you don't"), /*#__PURE__*/React.createElement("p", {
      className: "mk-section-sub"
    }, "A focused set of primitives that compose into real products \u2014 with the warmth of a design system that sweats the details.")), /*#__PURE__*/React.createElement("div", {
      className: "mk-features"
    }, FEATURES.map(f => /*#__PURE__*/React.createElement(Card, {
      key: f.title,
      hover: true,
      className: "mk-feature"
    }, /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("span", {
      className: "mk-feature-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: f.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("h3", {
      className: "mk-feature-title"
    }, f.title), /*#__PURE__*/React.createElement("p", {
      className: "mk-feature-desc"
    }, f.desc))))));
  }
  function Showcase({
    accent,
    setAccent
  }) {
    const opts = [{
      id: "teal",
      hex: "#12A594"
    }, {
      id: "iris",
      hex: "#5B5BD6"
    }, {
      id: "grass",
      hex: "#46A758"
    }, {
      id: "amber",
      hex: "#FFC53D"
    }, {
      id: "tomato",
      hex: "#E54D2E"
    }];
    return /*#__PURE__*/React.createElement("section", {
      className: "mk-showcase"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-showcase-text"
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "accent"
    }, "One knob"), /*#__PURE__*/React.createElement("h2", {
      className: "mk-h2"
    }, "One accent per product.", /*#__PURE__*/React.createElement("br", null), "Everything else stays."), /*#__PURE__*/React.createElement("p", {
      className: "mk-section-sub"
    }, "Shared foundations \u2014 warm sand neutral, Geist type, generous spacing. Each product picks a single accent and the whole system re-themes. Try it:"), /*#__PURE__*/React.createElement("div", {
      className: "mk-accent-pick"
    }, opts.map(o => /*#__PURE__*/React.createElement("button", {
      key: o.id,
      className: "mk-swatch" + (accent === o.id ? " on" : ""),
      onClick: () => setAccent(o.id),
      "aria-label": o.id,
      title: o.id
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        background: o.hex
      }
    }, accent === o.id && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14
    })))))), /*#__PURE__*/React.createElement(Card, {
      className: "mk-showcase-card"
    }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
      className: "mk-sc-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mk-feature-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rocket",
      size: 18
    })), /*#__PURE__*/React.createElement(Badge, {
      variant: "success",
      dot: true
    }, "Live")), /*#__PURE__*/React.createElement(CardTitle, null, "Promote to production"), /*#__PURE__*/React.createElement(CardDescription, null, "Deploy #142 \xB7 main \xB7 84ms p95")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
      className: "mk-sc-bar"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "72%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "mk-sc-actions"
    }, /*#__PURE__*/React.createElement(Button, null, "Promote"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "View logs")))));
  }
  function Quote() {
    return /*#__PURE__*/React.createElement("section", {
      className: "mk-quote"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 22,
      className: "mk-quote-mark"
    }), /*#__PURE__*/React.createElement("blockquote", {
      className: "mk-quote-text"
    }, "\"We replaced three tools with Aditya and our team actually enjoys the console now. It feels warm and considered \u2014 and it's quietly the fastest stack we've shipped on.\""), /*#__PURE__*/React.createElement("div", {
      className: "mk-quote-by"
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Mira Shah"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mk-quote-name"
    }, "Mira Shah"), /*#__PURE__*/React.createElement("div", {
      className: "mk-quote-role"
    }, "Staff Engineer, Lumen"))));
  }
  function CTA({
    onCta
  }) {
    return /*#__PURE__*/React.createElement("section", {
      className: "mk-cta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-cta-inner"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "mk-h2"
    }, "Start building in minutes"), /*#__PURE__*/React.createElement("p", {
      className: "mk-section-sub"
    }, "Free for hobby projects. Scale when you're ready."), /*#__PURE__*/React.createElement("div", {
      className: "mk-hero-cta"
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      onClick: onCta
    }, "Start building free"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "ghost"
    }, "Talk to us ", /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 17
    })))));
  }
  function Landing({
    accent,
    setAccent,
    onCta
  }) {
    return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
      onCta: onCta
    }), /*#__PURE__*/React.createElement(Logos, null), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(Showcase, {
      accent: accent,
      setAccent: setAccent
    }), /*#__PURE__*/React.createElement(Quote, null), /*#__PURE__*/React.createElement(window.Pricing, {
      onCta: onCta
    }), /*#__PURE__*/React.createElement(CTA, {
      onCta: onCta
    }));
  }
  window.Landing = Landing;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Nav.jsx
try { (() => {
/* Marketing — top nav with dark-mode + mobile menu. Exposes window.Nav */
(function () {
  const NS = window.AdityaDesignSystem_25de17;
  const {
    Button,
    IconButton
  } = NS;
  const Icon = window.KitIcon;
  function Nav({
    dark,
    setDark,
    onCta
  }) {
    const [open, setOpen] = React.useState(false);
    const links = ["Product", "Solutions", "Docs", "Pricing", "Changelog"];
    return /*#__PURE__*/React.createElement("header", {
      className: "mk-nav"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-nav-inner"
    }, /*#__PURE__*/React.createElement("a", {
      className: "mk-brand",
      href: "#",
      onClick: e => e.preventDefault()
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/lockup.svg",
      height: "26",
      alt: "Aditya",
      className: "mk-lockup"
    })), /*#__PURE__*/React.createElement("nav", {
      className: "mk-links"
    }, links.map(l => /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      onClick: e => e.preventDefault()
    }, l))), /*#__PURE__*/React.createElement("div", {
      className: "mk-nav-actions"
    }, /*#__PURE__*/React.createElement(IconButton, {
      "aria-label": "Toggle theme",
      onClick: () => setDark(!dark)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: dark ? "globe" : "command",
      size: 18
    })), /*#__PURE__*/React.createElement("a", {
      className: "mk-signin",
      href: "#",
      onClick: e => e.preventDefault()
    }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
      onClick: onCta
    }, "Start building"), /*#__PURE__*/React.createElement("span", {
      className: "mk-burger"
    }, /*#__PURE__*/React.createElement(IconButton, {
      "aria-label": "Menu",
      onClick: () => setOpen(!open)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: open ? "x" : "menu",
      size: 20
    }))))), open && /*#__PURE__*/React.createElement("div", {
      className: "mk-mobile"
    }, links.map(l => /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      onClick: e => {
        e.preventDefault();
        setOpen(false);
      }
    }, l)), /*#__PURE__*/React.createElement(Button, {
      block: true,
      onClick: onCta
    }, "Start building")));
  }
  window.Nav = Nav;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Pricing.jsx
try { (() => {
/* Marketing — pricing with monthly/annual toggle. Exposes window.Pricing */
(function () {
  const NS = window.AdityaDesignSystem_25de17;
  const {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Button,
    Badge,
    Switch
  } = NS;
  const Icon = window.KitIcon;
  const PLANS = [{
    name: "Hobby",
    monthly: 0,
    desc: "For personal projects and learning.",
    cta: "Start free",
    variant: "secondary",
    features: ["1 project", "Preview deployments", "Community support", "Aditya Assistant (100 msgs/mo)"]
  }, {
    name: "Pro",
    monthly: 20,
    desc: "For professionals shipping real products.",
    cta: "Start Pro",
    variant: "primary",
    featured: true,
    features: ["Unlimited projects", "Custom domains", "Email support", "Assistant (unlimited)", "Analytics & metrics"]
  }, {
    name: "Team",
    monthly: 50,
    desc: "For teams that scale together.",
    cta: "Start Team",
    variant: "secondary",
    features: ["Everything in Pro", "Roles & audit logs", "SSO / SAML", "Priority support", "Usage-based compute"]
  }];
  function Pricing({
    onCta
  }) {
    const [annual, setAnnual] = React.useState(true);
    return /*#__PURE__*/React.createElement("section", {
      className: "mk-section mk-pricing",
      id: "pricing"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk-section-head"
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "outline"
    }, "Pricing"), /*#__PURE__*/React.createElement("h2", {
      className: "mk-h2"
    }, "Simple, honest pricing"), /*#__PURE__*/React.createElement("p", {
      className: "mk-section-sub"
    }, "Start free, upgrade when it matters. No surprises."), /*#__PURE__*/React.createElement("div", {
      className: "mk-billing"
    }, /*#__PURE__*/React.createElement("span", {
      className: !annual ? "on" : ""
    }, "Monthly"), /*#__PURE__*/React.createElement(Switch, {
      checked: annual,
      onChange: e => setAnnual(e.target.checked),
      "aria-label": "Annual billing"
    }), /*#__PURE__*/React.createElement("span", {
      className: annual ? "on" : ""
    }, "Annual"), /*#__PURE__*/React.createElement(Badge, {
      variant: "success"
    }, "Save 20%"))), /*#__PURE__*/React.createElement("div", {
      className: "mk-plans"
    }, PLANS.map(p => {
      const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
      return /*#__PURE__*/React.createElement(Card, {
        key: p.name,
        className: "mk-plan" + (p.featured ? " is-featured" : "")
      }, p.featured && /*#__PURE__*/React.createElement("div", {
        className: "mk-plan-flag"
      }, "Most popular"), /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, p.name), /*#__PURE__*/React.createElement(CardDescription, null, p.desc), /*#__PURE__*/React.createElement("div", {
        className: "mk-price"
      }, /*#__PURE__*/React.createElement("span", {
        className: "mk-price-amt tnum"
      }, "$", price), /*#__PURE__*/React.createElement("span", {
        className: "mk-price-per"
      }, "/mo"))), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("ul", {
        className: "mk-plan-feats"
      }, p.features.map(f => /*#__PURE__*/React.createElement("li", {
        key: f
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 16,
        className: "mk-feat-check"
      }), " ", f)))), /*#__PURE__*/React.createElement(CardFooter, null, /*#__PURE__*/React.createElement(Button, {
        variant: p.variant,
        block: true,
        onClick: onCta
      }, p.cta)));
    })));
  }
  window.Pricing = Pricing;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Pricing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/icons.jsx
try { (() => {
/* Aditya UI kit — inline Lucide icons.
 * Real Lucide 2px-stroke path markup, rendered as SVG so it survives React
 * re-renders (the data-lucide + createIcons swap doesn't play well with React).
 * Exposed as window.KitIcon. */
(function () {
  const P = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'git-branch': '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    'trash-2': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'more-horizontal': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    command: '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
    'panel-left': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
    'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L21 4.5"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>'
  };
  function KitIcon({
    name,
    size = 18,
    strokeWidth = 2,
    className = "",
    style
  }) {
    const inner = P[name] || "";
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "kit-icon " + className,
      style: {
        flex: "none",
        ...style
      },
      "aria-hidden": "true",
      dangerouslySetInnerHTML: {
        __html: inner
      }
    });
  }
  window.KitIcon = KitIcon;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.CardTitle = __ds_scope.CardTitle;

__ds_ns.CardDescription = __ds_scope.CardDescription;

__ds_ns.CardContent = __ds_scope.CardContent;

__ds_ns.CardFooter = __ds_scope.CardFooter;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Separator = __ds_scope.Separator;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
