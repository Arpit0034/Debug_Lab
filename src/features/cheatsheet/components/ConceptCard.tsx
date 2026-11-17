import type { ConceptMeta, LearningStatus } from '../types';
import { StatusControl } from './StatusControl';

const CATEGORY_LABEL: Record<ConceptMeta['category'], string> = {
  foundations: 'Foundations',
  'data-structures': 'Data Structures',
  algorithms: 'Algorithms',
  techniques: 'Techniques',
  paradigms: 'Paradigms',
  advanced: 'Advanced',
};

const LEVEL_LABEL: Record<ConceptMeta['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export interface ConceptCardProps {
  meta: ConceptMeta;
  status: LearningStatus;
  onOpen: (id: string) => void;
  onStatusChange: (id: string, status: LearningStatus) => void;
}

export function ConceptCard({
  meta,
  status,
  onOpen,
  onStatusChange,
}: ConceptCardProps): React.ReactElement {
  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(meta.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(meta.id)}
      onKeyDown={handleKey}
      aria-label={`Open ${meta.title}`}
      className={`cx-card cx-card--link cx-cat-${meta.category}`}
      style={{ gap: '0.65rem' }}
    >
      <div className="cx-row" style={{ justifyContent: 'space-between', gap: '0.5rem' }}>
        <span className="cx-chip cx-chip--cat">{CATEGORY_LABEL[meta.category]}</span>
        <span className="cx-chip">{LEVEL_LABEL[meta.level]}</span>
      </div>

      <div>
        <h3 className="cx-h3" style={{ margin: 0, fontSize: '1.0625rem', lineHeight: 1.3 }}>
          {meta.title}
        </h3>
        <p className="cx-small cx-muted" style={{ margin: '0.25rem 0 0', lineHeight: 1.5 }}>
          {meta.tagline}
        </p>
      </div>

      <div className="cx-row" style={{ gap: '0.35rem', flexWrap: 'wrap', marginTop: 'auto' }}>
        <span className="cx-chip" style={{ textTransform: 'none', letterSpacing: 0 }}>
          ⏱ {meta.time}
        </span>
        <span className="cx-chip" style={{ textTransform: 'none', letterSpacing: 0 }}>
          💾 {meta.space}
        </span>
      </div>

      <div className="cx-row" style={{ justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <span className="cx-small cx-muted">~{meta.estMinutes} min</span>
        <div className="cx-row" style={{ gap: '0.5rem' }}>
          <StatusControl
            status={status}
            onChange={(next) => onStatusChange(meta.id, next)}
            compact
            ariaLabel={`Learning status for ${meta.title}`}
          />
          <span className="cx-card__arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </div>
  );
}
