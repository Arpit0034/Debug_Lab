import { useMemo } from 'react';
import type {
  ConceptCategoryId,
  ConceptLevel,
  ConceptMeta,
  LearningStatus,
} from '../types';
import type { SearchFilters, SortMode } from '../search';

const CATEGORY_LABEL: Record<ConceptCategoryId, string> = {
  foundations: 'Foundations',
  'data-structures': 'Data Structures',
  algorithms: 'Algorithms',
  techniques: 'Techniques',
  paradigms: 'Paradigms',
  advanced: 'Advanced',
};

const LEVEL_LABEL: Record<ConceptLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const STATUS_LABEL: Record<LearningStatus, string> = {
  'not-started': 'Not started',
  learning: 'Learning',
  completed: 'Completed',
};

const SORT_LABEL: Record<SortMode, string> = {
  recommended: 'Recommended',
  alphabetical: 'A–Z',
  level: 'Level',
};

export interface LibraryToolbarProps {
  metas: ConceptMeta[];
  statuses: Record<string, LearningStatus>;
  filters: SearchFilters;
  onFiltersChange: (next: SearchFilters) => void;
  sort: SortMode;
  onSortChange: (next: SortMode) => void;
  resultCount: number;
}

export function LibraryToolbar({
  metas,
  statuses,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  resultCount,
}: LibraryToolbarProps): React.ReactElement {
  const counts = useMemo(() => {
    const cat: Record<string, number> = { all: metas.length };
    const lvl: Record<string, number> = { all: metas.length };
    const st: Record<string, number> = { all: metas.length };
    for (const m of metas) {
      cat[m.category] = (cat[m.category] ?? 0) + 1;
      lvl[m.level] = (lvl[m.level] ?? 0) + 1;
      const cur = statuses[m.id] ?? 'not-started';
      st[cur] = (st[cur] ?? 0) + 1;
    }
    return { cat, lvl, st };
  }, [metas, statuses]);

  const hasActiveFilter =
    (filters.category && filters.category !== 'all') ||
    (filters.level && filters.level !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    (filters.q && filters.q.length > 0);

  const chip = (
    label: string,
    active: boolean,
    count: number | undefined,
    onClick: () => void,
    key: string,
  ) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={'cx-btn cx-btn--sm ' + (active ? 'cx-btn--primary' : 'cx-btn--ghost')}
    >
      {label}
      {count !== undefined && (
        <span style={{ opacity: 0.7, marginLeft: '0.3rem', fontWeight: 400 }}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div
      className="cx-stack"
      style={{ gap: '0.75rem', marginBottom: '1.25rem' }}
      role="region"
      aria-label="Filters"
    >
      <div
        className="cx-row"
        style={{ gap: '0.4rem', flexWrap: 'wrap' }}
        role="group"
        aria-label="Category filter"
      >
        {chip('All', (filters.category ?? 'all') === 'all', counts.cat.all, () =>
          onFiltersChange({ ...filters, category: 'all' }),
          'cat-all',
        )}
        {(Object.keys(CATEGORY_LABEL) as ConceptCategoryId[]).map((c) =>
          counts.cat[c]
            ? chip(
                CATEGORY_LABEL[c],
                filters.category === c,
                counts.cat[c],
                () => onFiltersChange({ ...filters, category: c }),
                'cat-' + c,
              )
            : null,
        )}
      </div>

      <div
        className="cx-row"
        style={{ gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <span className="cx-small cx-muted" style={{ marginRight: '0.25rem' }}>
          Level:
        </span>
        {chip('Any', (filters.level ?? 'all') === 'all', undefined, () =>
          onFiltersChange({ ...filters, level: 'all' }),
          'lvl-all',
        )}
        {(Object.keys(LEVEL_LABEL) as ConceptLevel[]).map((l) =>
          counts.lvl[l]
            ? chip(
                LEVEL_LABEL[l],
                filters.level === l,
                counts.lvl[l],
                () => onFiltersChange({ ...filters, level: l }),
                'lvl-' + l,
              )
            : null,
        )}

        <span className="cx-small cx-muted" style={{ marginLeft: '1rem', marginRight: '0.25rem' }}>
          Status:
        </span>
        {chip('Any', (filters.status ?? 'all') === 'all', undefined, () =>
          onFiltersChange({ ...filters, status: 'all' }),
          'st-all',
        )}
        {(Object.keys(STATUS_LABEL) as LearningStatus[]).map((s) =>
          chip(
            STATUS_LABEL[s],
            filters.status === s,
            counts.st[s] ?? 0,
            () => onFiltersChange({ ...filters, status: s }),
            'st-' + s,
          ),
        )}
      </div>

      <div
        className="cx-row"
        style={{ gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <label className="cx-small cx-muted">
          Sort:{' '}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortMode)}
            style={{
              marginLeft: '0.25rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--cx-border)',
              background: 'var(--cx-bg-card)',
              color: 'var(--cx-fg)',
              fontSize: '0.8125rem',
            }}
          >
            {(Object.keys(SORT_LABEL) as SortMode[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABEL[k]}
              </option>
            ))}
          </select>
        </label>

        <span className="cx-small cx-muted" style={{ marginLeft: 'auto' }}>
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </span>

        {hasActiveFilter && (
          <button
            type="button"
            className="cx-btn cx-btn--sm cx-btn--ghost"
            onClick={() => onFiltersChange({})}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
