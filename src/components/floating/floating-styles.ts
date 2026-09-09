export const FLOATING_STYLES = `
.jobflow-assistant {
  --jobflow-bg: #f7f8fa;
  --jobflow-surface: #ffffff;
  --jobflow-surface-subtle: #e8eef6;
  --jobflow-surface-muted: #f1f2f6;
  --jobflow-text: #252630;
  --jobflow-muted: #787b8a;
  --jobflow-subtle: #9295a2;
  --jobflow-border: #e4e5ec;
  --jobflow-border-strong: #c9cbd6;
  --jobflow-accent: #4f7396;
  --jobflow-accent-strong: #3f607f;
  --jobflow-accent-soft: #e8eef6;
  --jobflow-button: #26262f;
  --jobflow-button-text: #ffffff;
  --jobflow-danger: #b13e4b;
  --jobflow-danger-bg: #f8eaec;
  --jobflow-shadow-overlay: 0 12px 32px rgba(0, 0, 0, .13);
  color: var(--jobflow-text);
  font-family: "Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 11px;
  line-height: 1.45;
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
  border: 1px solid var(--jobflow-accent);
  border-radius: 999px;
  background: var(--jobflow-accent);
  color: #fff;
  box-shadow: 0 8px 22px rgba(37, 38, 48, .14);
  cursor: pointer;
  transition: background 100ms ease-out, border-color 100ms ease-out, opacity 100ms ease-out, transform 100ms ease-out;
}

.jobflow-launcher:hover {
  opacity: .9;
}

.jobflow-launcher:active,
.jobflow-panel button:active {
  transform: scale(.97);
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
  font-size: 12px;
  font-weight: 700;
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
  border: 1px solid var(--jobflow-border);
  border-radius: 8px;
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
  font-size: 9px;
  font-weight: 600;
  letter-spacing: .07em;
  text-transform: uppercase;
}

.jobflow-panel__header strong {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -.015em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.jobflow-panel__host {
  overflow: hidden;
  color: var(--jobflow-muted);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.jobflow-panel__icon-button {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--jobflow-muted);
  cursor: pointer;
  transition: background 100ms ease-out, color 100ms ease-out, transform 100ms ease-out;
}

.jobflow-panel__icon-button:hover {
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
  min-height: 32px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 7px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--jobflow-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: background 100ms ease-out, color 100ms ease-out, border-color 100ms ease-out, transform 100ms ease-out;
}

.jobflow-panel__tabs button:hover {
  background: var(--jobflow-surface-subtle);
  color: var(--jobflow-text);
}

.jobflow-panel__tabs button.is-active {
  border-color: color-mix(in srgb, var(--jobflow-accent) 22%, transparent);
  background: var(--jobflow-accent-soft);
  color: var(--jobflow-accent);
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
  font-size: 9px;
  font-weight: 600;
}

.jobflow-panel__tabs button.is-active > span {
  background: var(--jobflow-surface);
  color: var(--jobflow-accent);
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
  font-weight: 600;
  letter-spacing: -.025em;
}

.jobflow-panel__summary span,
.jobflow-panel__summary small {
  color: var(--jobflow-muted);
  font-size: 10px;
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
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--jobflow-button);
  color: var(--jobflow-button-text);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 100ms ease-out, transform 100ms ease-out;
}

.jobflow-panel__fill:hover:not(:disabled),
.jobflow-panel__action--primary:hover:not(:disabled) {
  opacity: .9;
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
  font-size: 10px;
  font-weight: 500;
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
  font-size: 11px;
  font-weight: 500;
}

.jobflow-panel__document-copy span,
.jobflow-panel__document-copy small {
  overflow: hidden;
  color: var(--jobflow-muted);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.jobflow-panel__menu > div,
.jobflow-panel__menu button {
  display: flex;
  min-height: 32px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 10px;
  border: 0;
  border-top: 1px solid var(--jobflow-border);
  background: transparent;
  color: var(--jobflow-text);
  font-size: 11px;
  text-align: left;
}

.jobflow-panel__menu button {
  cursor: pointer;
  transition: background 100ms ease-out, color 100ms ease-out, transform 100ms ease-out;
}

.jobflow-panel__menu button:hover,
.jobflow-panel__open-profile:hover,
.jobflow-panel__back:hover,
.jobflow-panel__action--secondary:hover {
  background: var(--jobflow-surface-subtle);
}

.jobflow-panel__menu strong {
  color: var(--jobflow-muted);
  font-size: 10px;
  font-weight: 500;
}

.jobflow-panel__open-profile {
  display: flex;
  min-height: 32px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 10px;
  border: 0;
  border-top: 1px solid var(--jobflow-border);
  background: transparent;
  color: var(--jobflow-text);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 100ms ease-out, transform 100ms ease-out;
}

.jobflow-panel__detail {
  display: grid;
  gap: 9px;
  padding: 10px;
}

.jobflow-panel__detail h2 {
  margin: 2px 0 0;
  font-size: 13px;
  font-weight: 600;
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
  font-size: 11px;
  cursor: pointer;
  transition: background 100ms ease-out, color 100ms ease-out, transform 100ms ease-out;
}

.jobflow-panel__section-label {
  margin: 0;
  color: var(--jobflow-subtle);
  font-size: 10px;
  font-weight: 500;
}

.jobflow-panel__helper {
  margin: 4px 0 0;
  color: var(--jobflow-muted);
  font-size: 10px;
  line-height: 1.4;
}

.jobflow-panel__review {
  display: grid;
  gap: 6px;
  padding: 8px 0;
  border-top: 1px solid var(--jobflow-border);
}

.jobflow-panel__review > strong {
  font-size: 11px;
  font-weight: 500;
}

.jobflow-panel__review > small {
  color: var(--jobflow-muted);
  font-size: 10px;
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
  font-size: 11px;
  cursor: pointer;
  transition: background 100ms ease-out, border-color 100ms ease-out, color 100ms ease-out, transform 100ms ease-out;
}

.jobflow-panel__action--secondary {
  padding: 5px 8px;
  border: 1px solid var(--jobflow-border);
  background: var(--jobflow-surface);
  color: var(--jobflow-text);
  font-weight: 500;
}

.jobflow-panel__action--secondary:hover {
  border-color: var(--jobflow-accent);
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
  font-size: 10px;
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
  font-size: 10px;
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
  font-size: 10px;
  font-weight: 500;
}

.jobflow-panel__form small {
  color: var(--jobflow-muted);
  font-size: 10px;
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
  font-size: 11px;
  outline: none;
}

.jobflow-panel__unlock input:focus,
.jobflow-panel__form input:focus,
.jobflow-panel__form select:focus,
.jobflow-panel__form textarea:focus {
  border-color: var(--jobflow-accent);
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
  font-size: 10px;
}

.jobflow-panel__detail > .jobflow-panel__status {
  margin: 0;
}

.jobflow-panel__action--primary {
  min-height: 32px;
  padding: 5px 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--jobflow-button);
  color: var(--jobflow-button-text);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 100ms ease-out, transform 100ms ease-out;
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
  font-size: 11px;
  font-weight: 500;
}

.jobflow-panel__empty span {
  font-size: 10px;
}

@media (prefers-color-scheme: dark) {
  .jobflow-assistant {
    --jobflow-bg: #18191d;
    --jobflow-surface: #202126;
    --jobflow-surface-subtle: #1b2636;
    --jobflow-surface-muted: #1c1d22;
    --jobflow-text: #e8e8ef;
    --jobflow-muted: #999ba9;
    --jobflow-subtle: #777985;
    --jobflow-border: #34353e;
    --jobflow-border-strong: #4a4b56;
    --jobflow-accent: #7fa6c9;
    --jobflow-accent-strong: #a0c1dd;
    --jobflow-accent-soft: #1b2636;
    --jobflow-button: #e6e6ed;
    --jobflow-button-text: #22232a;
    --jobflow-danger: #ff9aa5;
    --jobflow-danger-bg: #3a2227;
    --jobflow-shadow-overlay: 0 12px 32px rgba(0, 0, 0, .30);
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

  .jobflow-launcher:active,
  .jobflow-panel button:active {
    transform: none;
  }
}
`;
