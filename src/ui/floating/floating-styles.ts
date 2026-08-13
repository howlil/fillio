export const FLOATING_STYLES = `
.fillio-panel {
  box-sizing: border-box;
  width: 280px;
  border: 1px solid #d8dde7;
  border-radius: 14px;
  background: #ffffff;
  color: #172033;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
  padding: 14px;
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 13px;
  line-height: 1.4;
}

.fillio-panel *,
.fillio-panel *::before,
.fillio-panel *::after {
  box-sizing: border-box;
}

.fillio-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.fillio-panel__header strong {
  font-size: 15px;
  font-weight: 650;
}

.fillio-panel__header span {
  font-weight: 650;
}

.fillio-panel__counts {
  display: flex;
  gap: 12px;
  color: #667085;
  margin-bottom: 12px;
}

.fillio-panel__fill {
  width: 100%;
  min-height: 36px;
  border: 0;
  border-radius: 9px;
  background: #172033;
  color: #ffffff;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
  padding: 8px 12px;
}

.fillio-panel__fill:hover:not(:disabled) {
  background: #28344c;
}

.fillio-panel__fill:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.fillio-panel__fill:disabled {
  cursor: default;
  background: #e6e9ef;
  color: #8991a3;
}
`;
