import { useMemo, useState } from 'react';
import { COMPARISON_PAIRS } from '../data/comparisons';

export interface ComparisonViewProps {
  hasConcept: (id: string) => boolean;
  onOpenConcept: (id: string) => void;
}

export function ComparisonView({
  hasConcept,
  onOpenConcept,
}: ComparisonViewProps): React.ReactElement {
  const [activeId, setActiveId] = useState<string>(COMPARISON_PAIRS[0]?.id ?? '');
  const pair = useMemo(
    () => COMPARISON_PAIRS.find((p) => p.id === activeId) ?? COMPARISON_PAIRS[0],
    [activeId],
  );

  if (!pair) {
    return <p className="cx-small cx-muted">No comparisons available.</p>;
  }

  const leftExists = hasConcept(pair.leftId);
  const rightExists = hasConcept(pair.rightId);
  const sameConcept = pair.leftId === pair.rightId;

  return (
    <div className="cx-stack" style={{ gap: '1.5rem' }}>
      <div>
        <h2 className="cx-h2" style={{ marginTop: 0 }}>
          Compare Concepts
        </h2>
        <p className="cx-lead">
          Side-by-side breakdowns of similar-looking choices. Pick the one that matches your constraint.
        </p>
      </div>

      <div className="cx-row" style={{ gap: '0.35rem', flexWrap: 'wrap' }}>
        {COMPARISON_PAIRS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            aria-pressed={p.id === activeId}
            className={
              'cx-btn cx-btn--sm ' +
              (p.id === activeId ? 'cx-btn--primary' : 'cx-btn--ghost')
            }
          >
            {p.title}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="cx-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Dimension</th>
              <th style={{ width: '39%' }}>{pair.leftTitle}</th>
              <th style={{ width: '39%' }}>{pair.rightTitle}</th>
            </tr>
          </thead>
          <tbody>
            {pair.dimensions.map((d, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{d.label}</td>
                <td>{d.left}</td>
                <td>{d.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cx-callout cx-callout--good">
        <strong>Verdict:</strong> {pair.verdict}
      </div>

      {!sameConcept && (leftExists || rightExists) && (
        <div className="cx-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          {leftExists && (
            <button
              type="button"
              className="cx-btn cx-btn--sm"
              onClick={() => onOpenConcept(pair.leftId)}
            >
              Read full concept: {pair.leftTitle}
            </button>
          )}
          {rightExists && (
            <button
              type="button"
              className="cx-btn cx-btn--sm"
              onClick={() => onOpenConcept(pair.rightId)}
            >
              Read full concept: {pair.rightTitle}
            </button>
          )}
        </div>
      )}

      {!leftExists && !rightExists && (
        <p className="cx-small cx-muted" style={{ margin: 0 }}>
          Detailed pages for these concepts are not yet written. The comparison table above is
          still authoritative for choosing between them.
        </p>
      )}
    </div>
  );
}
