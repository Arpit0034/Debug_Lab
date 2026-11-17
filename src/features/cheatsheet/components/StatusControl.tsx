import { useCallback } from 'react';
import type { LearningStatus } from '../types';
import { cycleStatus } from '../conceptStorage';

const ORDER: LearningStatus[] = ['not-started', 'learning', 'completed'];
const LABEL: Record<LearningStatus, string> = {
  'not-started': 'Not started',
  learning: 'Learning',
  completed: 'Completed',
};
const DOT_COLOR: Record<LearningStatus, string> = {
  'not-started': 'var(--muted)',
  learning: 'var(--warn)',
  completed: 'var(--good)',
};

export interface StatusControlProps {
  status: LearningStatus;
  onChange: (next: LearningStatus) => void;
  compact?: boolean;
  ariaLabel?: string;
}

export function StatusControl({
  status,
  onChange,
  compact = false,
  ariaLabel = 'Learning status',
}: StatusControlProps): React.ReactElement {
  const cycle = useCallback(() => {
    onChange(cycleStatus(status));
  }, [status, onChange]);

  if (compact) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          cycle();
        }}
        className="cx-btn cx-btn--ghost cx-btn--sm"
        aria-label={`${ariaLabel}: ${LABEL[status]}. Click to change.`}
        title={`${LABEL[status]} — click to cycle`}
      >
        <span
          className="cx-status-dot"
          style={{ background: DOT_COLOR[status] }}
          aria-hidden="true"
        />
        {LABEL[status]}
      </button>
    );
  }

  return (
    <div role="group" aria-label={ariaLabel} className="cx-row" style={{ gap: '0.25rem' }}>
      {ORDER.map((s) => (
        <button
          key={s}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(s);
          }}
          aria-pressed={status === s}
          className={
            'cx-btn cx-btn--sm ' + (status === s ? 'cx-btn--primary' : 'cx-btn--ghost')
          }
        >
          <span
            className="cx-status-dot"
            style={{ background: status === s ? 'currentColor' : DOT_COLOR[s] }}
            aria-hidden="true"
          />
          {LABEL[s]}
        </button>
      ))}
    </div>
  );
}
