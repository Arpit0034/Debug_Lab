import { useEffect, useRef } from 'react';
import { PracticeCta } from './PracticeCta';

export type ViewMode = 'library' | 'complexity' | 'compare' | 'patterns';

export interface HubStats {
  total: number;
  completed: number;
  learning: number;
  notStarted: number;
  overallPercent: number;
}

export interface HubHeaderProps {
  stats: HubStats;
  search: string;
  onSearchChange: (v: string) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}

const VIEW_LABEL: Record<ViewMode, string> = {
  library: 'Library',
  complexity: 'Complexity',
  compare: 'Compare',
  patterns: 'Pattern Finder',
};

export function HubHeader({
  stats,
  search,
  onSearchChange,
  view,
  onViewChange,
}: HubHeaderProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? '').toUpperCase();
      const inField = tag === 'INPUT' || tag === 'TEXTAREA';
      if (e.key === '/' && !inField) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && inField) {
        onSearchChange('');
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onSearchChange]);

  const isEmpty = stats.completed === 0 && stats.learning === 0;

  return (
    <header className="cx-stack" style={{ gap: '1.25rem', marginBottom: '1.5rem' }}>
      <div>
        <h1 className="cx-h1" style={{ margin: 0 }}>
          DSA Knowledge Hub
        </h1>
        <p className="cx-lead" style={{ margin: '0.35rem 0 0' }}>
          I'm staring at a problem — which concept applies?
        </p>
      </div>

      <PracticeCta />

      <div
        className="cx-card"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}
      >
        {isEmpty ? (
          <div style={{ flex: '1 1 20rem' }}>
            <p className="cx-small cx-muted" style={{ margin: 0 }}>
              Nothing started yet — pick a concept from the library below to begin tracking progress.
            </p>
          </div>
        ) : (
          <>
            <div style={{ flex: '1 1 20rem' }}>
              <div
                className="cx-row"
                style={{ justifyContent: 'space-between', marginBottom: '0.35rem' }}
              >
                <span className="cx-small cx-muted">Overall progress</span>
                <span className="cx-small cx-mono" style={{ fontWeight: 600 }}>
                  {stats.completed} / {stats.total} · {stats.overallPercent}%
                </span>
              </div>
              <div
                style={{
                  height: '0.5rem',
                  borderRadius: '0.25rem',
                  background: 'var(--cx-bg-muted)',
                  overflow: 'hidden',
                }}
                role="progressbar"
                aria-valuenow={stats.overallPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${stats.overallPercent}%`,
                    background: 'var(--cx-accent)',
                    transition: 'width 300ms ease',
                  }}
                />
              </div>
            </div>
            <div className="cx-row" style={{ gap: '1.25rem' }}>
              <div>
                <div className="cx-small cx-muted">Completed</div>
                <div className="cx-mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {stats.completed}
                </div>
              </div>
              <div>
                <div className="cx-small cx-muted">Learning</div>
                <div className="cx-mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {stats.learning}
                </div>
              </div>
              <div>
                <div className="cx-small cx-muted">Total</div>
                <div className="cx-mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {stats.total}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        className="cx-row"
        style={{ justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}
      >
        <div style={{ flex: '1 1 18rem', position: 'relative' }}>
          <input
            ref={inputRef}
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search concepts, patterns, keywords…  (press /)"
            aria-label="Search concepts"
            style={{
              width: '100%',
              padding: '0.55rem 0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--cx-border)',
              background: 'var(--cx-bg-card)',
              color: 'var(--cx-fg)',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <div className="cx-row" role="tablist" aria-label="View">
          {(Object.keys(VIEW_LABEL) as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => onViewChange(v)}
              className={'cx-btn cx-btn--sm ' + (view === v ? 'cx-btn--primary' : 'cx-btn--ghost')}
            >
              {VIEW_LABEL[v]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
