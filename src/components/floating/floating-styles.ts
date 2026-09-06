export const FLOATING_STYLES = `
.jobflow-assistant {
  --jobflow-bg: #f7f8f9;
  --jobflow-surface: #ffffff;
  --jobflow-surface-subtle: #f3f5f7;
  --jobflow-surface-muted: #edf1f4;
  --jobflow-text: #1f242b;
  --jobflow-muted: #59616b;
  --jobflow-subtle: #808893;
  --jobflow-border: #e2e5e9;
  --jobflow-border-strong: #c7ccd3;
  --jobflow-accent: #3d7ec1;
  --jobflow-accent-strong: #27629e;
  --jobflow-accent-soft: #e6eff8;
  --jobflow-danger: #c94343;
  --jobflow-danger-bg: #fff1f1;
  --jobflow-shadow-overlay: 0 14px 36px rgba(31, 36, 43, .16);
  color: var(--jobflow-text);
  font-family: "Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 13px;
  line-height: 1.4;
  pointer-events: none;
}

.jobflow-assistant *,
.jobflow-assistant *::before,
.jobflow-assistant *::after {
  box-sizing: border-box;
}

.jobflow-launcher,
.jobflow-panel {
  pointer-events: auto;
}

.jobflow-launcher {
  position: fixed;
  z-index: 2147483647;
  right: 16px;
  bottom: 16px;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  padding: 0;
  border: 1px solid var(--jobflow-accent-strong);
  border-radius: 999px;
  background: var(--jobflow-accent);
  color: #fff;
  box-shadow: 0 8px 22px rgba(31, 36, 43, .16);
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}

.jobflow-launcher:hover {
  border-color: var(--jobflow-accent-strong);
  background: var(--jobflow-accent-strong);
}

.jobflow-launcher:focus-visible,
.jobflow-panel button:focus-visible,
.jobflow-panel input:focus-visible,
.jobflow-panel textarea:focus-visible,
.jobflow-panel select:focus-visible {
  outline: 2px solid var(--jobflow-accent);
  outline-offset: 2px;
}

.jobflow-launcher__mark {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -.04em;
}

.jobflow-launcher__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  display: grid;
  min-width: 18px;
  height: 18px;
  place-items: center;
  padding: 0 4px;
  border: 2px solid var(--jobflow-surface);
  border-radius: 999px;
  background: var(--jobflow-accent);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

.jobflow-panel {
  position: fixed;
  z-index: 2147483647;
  right: 16px;
  bottom: 64px;
  display: flex;
  flex-direction: column;
  width: min(352px, calc(100vw - 24px));
  max-height: min(560px, calc(100vh - 84px));
  overflow: hidden;
  border: 1px solid var(--jobflow-border-strong);
  border-radius: 10px;
  background: var(--jobflow-surface);
  box-shadow: var(--jobflow-shadow-overlay);
}

.jobflow-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid var(--jobflow-border);
}

.jobflow-panel__header > div {
  display: grid;
  min-width: 0;
  gap: 1px;
}

.jobflow-panel__eyebrow {
  color: var(--jobflow-subtle);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .07em;
  text-transform: uppercase;
}

.jobflow-panel__header strong {
  overflow: hidden;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: -.015em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.jobflow-panel__host {
  overflow: hidden;
  color: var(--jobflow-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.jobflow-panel__icon-button {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--jobflow-muted);
  cursor: pointer;
  transition: border-color 120ms ease, background 120ms ease, color 120ms ease;
}

.jobflow-panel__icon-button:hover {
  border-color: var(--jobflow-border);
  background: var(--jobflow-surface-subtle);
  color: var(--jobflow-text);
}

.jobflow-panel__tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px;
  padding: 4px;
  border-bottom: 1px solid var(--jobflow-border);
  background: var(--jobflow-surface);
}

.jobflow-panel__tabs button {
  display: inline-flex;
  min-width: 0;
  min-height: 30px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 7px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--jobflow-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}

.jobflow-panel__tabs button:hover {
  background: var(--jobflow-surface-subtle);
  color: var(--jobflow-text);
}

.jobflow-panel__tabs button.is-active {
  border-color: color-mix(in srgb, var(--jobflow-accent) 22%, transparent);
  background: var(--jobflow-accent-soft);
  color: var(--jobflow-accent-strong);
}

.jobflow-panel__tabs button > span {
  display: grid;
  min-width: 16px;
  height: 16px;
  place-items: center;
  padding: 0 3px;
  border-radius: 999px;
  background: var(--jobflow-surface-muted);
  color: var(--jobflow-muted);
  font-size: 10px;
  font-weight: 700;
}

.jobflow-panel__tabs button.is-active > span {
  background: var(--jobflow-surface);
  color: var(--jobflow-accent-strong);
}

.jobflow-panel__content {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--jobflow-border-strong) transparent;
}

.jobflow-panel svg {
  flex: 0 0 auto;
}

.jobflow-panel__view,
.jobflow-panel__body,
.jobflow-panel__menu {
  display: grid;
  min-height: 0;
}

.jobflow-panel__summary {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 10px 7px;
}

.jobflow-panel__summary > div {
  display: grid;
  gap: 1px;
}

.jobflow-panel__summary strong {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -.025em;
}

.jobflow-panel__summary span,
.jobflow-panel__summary small {
  color: var(--jobflow-muted);
  font-size: 12px;
}

.jobflow-panel__summary small {
  padding-bottom: 2px;
  text-align: right;
}

.jobflow-panel__fill {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0 10px 9px;
  padding: 6px 9px;
  border: 1px solid var(--jobflow-accent);
  border-radius: 6px;
  background: var(--jobflow-accent);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.jobflow-panel__fill:hover:not(:disabled),
.jobflow-panel__action--primary:hover:not(:disabled) {
  border-color: var(--jobflow-accent-strong);
  background: var(--jobflow-accent-strong);
}

.jobflow-panel__fill:disabled {
  border-color: var(--jobflow-border);
  background: var(--jobflow-surface-subtle);
  color: var(--jobflow-subtle);
  cursor: not-allowed;
}

.jobflow-panel__section {
  display: grid;
  border-top: 1px solid var(--jobflow-border);
}

.jobflow-panel__section:first-child {
  border-top: 0;
}

.jobflow-panel__section-heading {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px 4px;
  color: var(--jobflow-subtle);
  font-size: 11px;
  font-weight: 650;
}

.jobflow-panel__document {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
}

.jobflow-panel__document + .jobflow-panel__document {
  border-top: 1px solid var(--jobflow-border);
}

.jobflow-panel__document-copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.jobflow-panel__document-copy strong {
  font-size: 13px;
}

.jobflow-panel__document-copy span,
.jobflow-panel__document-copy small {
  overflow: hidden;
  color: var(--jobflow-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.jobflow-panel__menu > div,
.jobflow-panel__menu button {
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 10px;
  border: 0;
  border-top: 1px solid var(--jobflow-border);
  background: transparent;
  color: var(--jobflow-text);
  font-size: 13px;
  text-align: left;
}

.jobflow-panel__menu button {
  cursor: pointer;
}

.jobflow-panel__menu button:hover,
.jobflow-panel__open-profile:hover,
.jobflow-panel__back:hover,
.jobflow-panel__action--secondary:hover {
  background: var(--jobflow-surface-subtle);
}

.jobflow-panel__menu button > span {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
}

.jobflow-panel__menu strong {
  color: var(--jobflow-muted);
  font-size: 12px;
  font-weight: 600;
}

.jobflow-panel__open-profile {
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 10px;
  border: 0;
  border-top: 1px solid var(--jobflow-border);
  background: transparent;
  color: var(--jobflow-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.jobflow-panel__detail {
  display: grid;
  gap: 9px;
  padding: 10px;
}

.jobflow-panel__detail h2 {
  margin: 2px 0 0;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: -.015em;
}

.jobflow-panel__back {
  display: inline-flex;
  width: max-content;
  min-height: 30px;
  align-items: center;
  gap: 5px;
  margin-left: -6px;
  padding: 5px 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--jobflow-muted);
  font-size: 12px;
  cursor: pointer;
}

.jobflow-panel__section-label {
  margin: 0;
  color: var(--jobflow-subtle);
  font-size: 11px;
  font-weight: 650;
}

.jobflow-panel__helper {
  margin: 4px 0 0;
  color: var(--jobflow-muted);
  font-size: 12px;
  line-height: 1.4;
}

.jobflow-panel__review {
  display: grid;
  gap: 6px;
  padding: 8px 0;
  border-top: 1px solid var(--jobflow-border);
}

.jobflow-panel__review > strong {
  font-size: 13px;
}

.jobflow-panel__review > small {
  color: var(--jobflow-muted);
  font-size: 12px;
}

.jobflow-panel__review-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.jobflow-panel__action,
.jobflow-panel__action--secondary {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.jobflow-panel__action--secondary {
  padding: 5px 8px;
  border: 1px solid var(--jobflow-border);
  background: var(--jobflow-surface);
  color: var(--jobflow-text);
  font-weight: 600;
}

.jobflow-panel__sensitive-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--jobflow-border);
  list-style: none;
}

.jobflow-panel__sensitive-list li {
  padding: 7px 0;
  border-bottom: 1px solid var(--jobflow-border);
  color: var(--jobflow-muted);
  font-size: 12px;
}

.jobflow-panel__sensitive-error {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  padding: 8px;
  border: 1px solid color-mix(in srgb, var(--jobflow-danger) 28%, transparent);
  border-radius: 6px;
  background: var(--jobflow-danger-bg);
  color: var(--jobflow-danger);
  font-size: 12px;
}

.jobflow-panel__unlock,
.jobflow-panel__form {
  display: grid;
  gap: 6px;
}

.jobflow-panel__section > .jobflow-panel__form {
  padding: 0 10px 9px;
}

.jobflow-panel__unlock label,
.jobflow-panel__form label {
  display: grid;
  gap: 3px;
  color: var(--jobflow-muted);
  font-size: 12px;
  font-weight: 600;
}

.jobflow-panel__form small {
  color: var(--jobflow-muted);
  font-size: 12px;
}

.jobflow-panel__unlock input,
.jobflow-panel__form input,
.jobflow-panel__form select,
.jobflow-panel__form textarea {
  width: 100%;
  min-height: 32px;
  padding: 5px 8px;
  border: 1px solid var(--jobflow-border);
  border-radius: 6px;
  background: var(--jobflow-surface);
  color: var(--jobflow-text);
  font-size: 13px;
}

.jobflow-panel__unlock input:hover,
.jobflow-panel__form input:hover,
.jobflow-panel__form select:hover,
.jobflow-panel__form textarea:hover {
  border-color: var(--jobflow-border-strong);
}

.jobflow-panel__form textarea {
  min-height: 64px;
  resize: vertical;
}

.jobflow-panel__status {
  margin: 0 10px 8px;
  padding: 6px 8px;
  border: 1px solid var(--jobflow-border);
  border-radius: 6px;
  background: var(--jobflow-surface-subtle);
  color: var(--jobflow-muted);
  font-size: 12px;
}

.jobflow-panel__detail > .jobflow-panel__status {
  margin: 0;
}

.jobflow-panel__action--primary {
  min-height: 32px;
  padding: 5px 8px;
  border: 1px solid var(--jobflow-accent);
  border-radius: 6px;
  background: var(--jobflow-accent);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.jobflow-panel__empty {
  display: grid;
  gap: 3px;
  padding: 16px 12px;
  color: var(--jobflow-muted);
  text-align: center;
}

.jobflow-panel__empty strong {
  color: var(--jobflow-text);
  font-size: 13px;
}

.jobflow-panel__empty span {
  font-size: 12px;
}

@media (prefers-color-scheme: dark) {
  .jobflow-assistant {
    --jobflow-bg: #141619;
    --jobflow-surface: #1b1e22;
    --jobflow-surface-subtle: #22262b;
    --jobflow-surface-muted: #282d33;
    --jobflow-text: #f2f4f6;
    --jobflow-muted: #bcc2c9;
    --jobflow-subtle: #89919a;
    --jobflow-border: #30353b;
    --jobflow-border-strong: #484f57;
    --jobflow-accent: #68a5dd;
    --jobflow-accent-strong: #8bbbe7;
    --jobflow-accent-soft: #233444;
    --jobflow-danger: #eb7070;
    --jobflow-danger-bg: #462525;
    --jobflow-shadow-overlay: 0 14px 36px rgba(0, 0, 0, .34);
  }
}

@media (max-width: 520px) {
  .jobflow-launcher {
    right: 12px;
    bottom: 12px;
  }

  .jobflow-panel {
    right: 8px;
    bottom: 60px;
    width: calc(100vw - 16px);
    max-height: calc(100vh - 72px);
    border-radius: 8px;
  }
}

@media (any-pointer: coarse) {
  .jobflow-panel__icon-button,
  .jobflow-panel__fill,
  .jobflow-panel__menu button,
  .jobflow-panel__open-profile,
  .jobflow-panel__tabs button,
  .jobflow-panel__action,
  .jobflow-panel__action--secondary,
  .jobflow-panel__action--primary,
  .jobflow-panel__back,
  .jobflow-panel__unlock input,
  .jobflow-panel__form input,
  .jobflow-panel__form select {
    min-height: 44px;
  }

  .jobflow-panel__icon-button {
    min-width: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .jobflow-launcher,
  .jobflow-panel button,
  .jobflow-panel input,
  .jobflow-panel textarea,
  .jobflow-panel select {
    transition: none;
  }
}
`;
