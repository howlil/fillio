import type { PageAnalysisSummary } from '../../application/forms/analyze-field-contexts';

type FloatingPanelProps = {
  summary: PageAnalysisSummary;
  onFill: () => void;
};

export function FloatingPanel({ summary, onFill }: FloatingPanelProps) {
  const fillLabel =
    summary.ready === 0
      ? 'No ready fields'
      : `Fill ${summary.ready} ready ${summary.ready === 1 ? 'field' : 'fields'}`;

  return (
    <aside className="fillio-panel" aria-label="Fillio form assistant">
      <div className="fillio-panel__header">
        <strong>Fillio</strong>
        <span>{summary.ready} ready</span>
      </div>
      <div className="fillio-panel__counts" aria-label="Form analysis summary">
        <span>{summary.needsReview} needs review</span>
        <span>{summary.unknown} unknown</span>
      </div>
      <button
        className="fillio-panel__fill"
        type="button"
        disabled={summary.ready === 0}
        onClick={onFill}
      >
        {fillLabel}
      </button>
    </aside>
  );
}
