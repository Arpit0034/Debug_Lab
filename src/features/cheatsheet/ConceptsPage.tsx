import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  ConceptCategoryId,
  ConceptDetail,
  ConceptLevel,
  ConceptMeta,
  ConceptsState,
  LearningStatus,
} from './types';
import type { SearchFilters, SortMode } from './search';
import { searchConcepts } from './search';
import { loadConceptsState, setConceptStatus, setLastOpened } from './conceptStorage';
import { CONCEPT_METAS, loadConceptDetail } from './data';
import { HubHeader, type ViewMode } from './components/HubHeader';
import { CategoryCards } from './components/CategoryCards';
import { LibraryToolbar } from './components/LibraryToolbar';
import { ConceptCard } from './components/ConceptCard';
import { ConceptReader } from './components/ConceptReader';
import { ComplexityView } from './components/ComplexityView';
import { ComparisonView } from './components/ComparisonView';
import { PatternFinder } from './components/PatternFinder';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { CATEGORY_LABEL } from './data/categories';
import './concepts.css';

const VALID_VIEWS: ViewMode[] = ['library', 'complexity', 'compare', 'patterns'];
const VALID_CATS: (ConceptCategoryId | 'all')[] = [
  'all',
  'foundations',
  'data-structures',
  'algorithms',
  'techniques',
  'paradigms',
  'advanced',
];
const VALID_LEVELS: (ConceptLevel | 'all')[] = [
  'all',
  'beginner',
  'intermediate',
  'advanced',
];
const VALID_STATUSES: (LearningStatus | 'all')[] = [
  'all',
  'not-started',
  'learning',
  'completed',
];
const VALID_SORTS: SortMode[] = ['recommended', 'alphabetical', 'level'];

function parseEnum<T extends string>(
  raw: string | null,
  valid: T[],
  fallback: T,
): T {
  if (raw && (valid as string[]).includes(raw)) return raw as T;
  return fallback;
}

export function ConceptsPage(): React.ReactElement {
  const [params, setParams] = useSearchParams();
  const [state, setState] = useState<ConceptsState>(() => loadConceptsState());
  const [detail, setDetail] = useState<ConceptDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const view = parseEnum(params.get('view'), VALID_VIEWS, 'library');
  const q = params.get('q') ?? '';
  const cat = parseEnum(params.get('cat'), VALID_CATS, 'all');
  const lvl = parseEnum(params.get('lvl'), VALID_LEVELS, 'all');
  const status = parseEnum(params.get('status'), VALID_STATUSES, 'all');
  const sort = parseEnum(params.get('sort'), VALID_SORTS, 'recommended');
  const conceptId = params.get('c');

  const updateParams = useCallback(
    (patch: Record<string, string | null>, replace = false) => {
      const next = new URLSearchParams(params);
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === '') next.delete(k);
        else next.set(k, v);
      }
      setParams(next, { replace });
    },
    [params, setParams],
  );

  // Load concept detail when conceptId changes
  useEffect(() => {
    if (!conceptId) {
      setDetail(null);
      setDetailLoading(false);
      setDetailError(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    setDetail(null);
    loadConceptDetail(conceptId)
      .then((d) => {
        if (cancelled) return;
        if (!d) {
          setDetailError(`Concept "${conceptId}" not found.`);
          setDetailLoading(false);
          return;
        }
        setDetail(d);
        setDetailLoading(false);
        setLastOpened(conceptId);
        setState(loadConceptsState());
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setDetailError(e instanceof Error ? e.message : String(e));
        setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [conceptId]);

  const filters: SearchFilters = { q, category: cat, level: lvl, status };
  const filtered = useMemo(
    () => searchConcepts(CONCEPT_METAS, filters, sort, state.status),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, cat, lvl, status, sort, state.status],
  );

  const stats = useMemo(() => {
    const total = CONCEPT_METAS.length;
    let completed = 0;
    let learning = 0;
    for (const m of CONCEPT_METAS) {
      const s = state.status[m.id];
      if (s === 'completed') completed++;
      else if (s === 'learning') learning++;
    }
    return {
      total,
      completed,
      learning,
      notStarted: total - completed - learning,
      overallPercent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [state]);

  const continueInfo = useMemo(() => {
    if (!state.lastOpened) return null;
    const lastMeta = CONCEPT_METAS.find((m) => m.id === state.lastOpened);
    if (!lastMeta) return null;
    if (state.status[lastMeta.id] !== 'completed') {
      return { label: 'Continue', meta: lastMeta };
    }
    const sameCat = CONCEPT_METAS.filter(
      (m) => m.category === lastMeta.category && state.status[m.id] !== 'completed',
    );
    if (sameCat.length > 0) {
      return { label: `Next in ${CATEGORY_LABEL[lastMeta.category]}`, meta: sameCat[0] };
    }
    return null;
  }, [state]);

  const handleStatusChange = useCallback((id: string, next: ConceptStatusArg) => {
    const updated = setConceptStatus(id, next);
    setState(updated);
  }, []);

  const handleOpen = useCallback(
    (id: string) => {
      updateParams({ c: id, view: 'library' });
    },
    [updateParams],
  );

  const handleBack = useCallback(() => {
    updateParams({ c: null });
  }, [updateParams]);

  const handleSearchChange = useCallback(
    (v: string) => {
      updateParams({ q: v, view: v ? 'library' : view, c: null }, true);
    },
    [updateParams, view],
  );

  const handleViewChange = useCallback(
    (v: ViewMode) => {
      updateParams({ view: v, c: null });
    },
    [updateParams],
  );

  const hasConcept = useCallback(
    (id: string) => CONCEPT_METAS.some((m) => m.id === id),
    [],
  );

  // ---- Render ----

  const header = (
    <HubHeader
      stats={stats}
      search={q}
      onSearchChange={handleSearchChange}
      view={view}
      onViewChange={handleViewChange}
    />
  );

  if (conceptId) {
    // ---- Concept reader view ----
    const meta = CONCEPT_METAS.find((m) => m.id === conceptId);
    if (!meta) {
      return (
        <div className="cx-root cx-container">
          {header}
          <ErrorState
            message={`Concept "${conceptId}" not found in the library.`}
            onRetry={handleBack}
          />
        </div>
      );
    }
    if (detailLoading || (!detail && !detailError)) {
      return (
        <div className="cx-root cx-container">
          {header}
          <LoadingState message={`Loading ${meta.title}…`} />
        </div>
      );
    }
    if (detailError || !detail) {
      return (
        <div className="cx-root cx-container">
          {header}
          <ErrorState
            message={detailError ?? 'Could not load concept.'}
            onRetry={handleBack}
          />
        </div>
      );
    }
    const sameCat = CONCEPT_METAS.filter((m) => m.category === meta.category);
    const inCat = sameCat.findIndex((m) => m.id === meta.id);
    const prevMeta = inCat > 0 ? sameCat[inCat - 1] : null;
    const nextMeta = inCat >= 0 && inCat < sameCat.length - 1 ? sameCat[inCat + 1] : null;
    const currentStatus: LearningStatus = state.status[meta.id] ?? 'not-started';
    return (
      <div className="cx-root">
        <ConceptReader
          meta={meta}
          detail={detail}
          status={currentStatus}
          onStatusChange={(next) => handleStatusChange(meta.id, next)}
          onBack={handleBack}
          onNavigate={handleOpen}
          prev={prevMeta ? { id: prevMeta.id, title: prevMeta.title } : null}
          next={nextMeta ? { id: nextMeta.id, title: nextMeta.title } : null}
        />
      </div>
    );
  }

  if (view === 'complexity') {
    return (
      <div className="cx-root cx-container">
        {header}
        <ComplexityView />
      </div>
    );
  }

  if (view === 'compare') {
    return (
      <div className="cx-root cx-container">
        {header}
        <ComparisonView hasConcept={hasConcept} onOpenConcept={handleOpen} />
      </div>
    );
  }

  if (view === 'patterns') {
    return (
      <div className="cx-root cx-container">
        {header}
        <PatternFinder hasConcept={hasConcept} onOpenConcept={handleOpen} />
      </div>
    );
  }

  // ---- Library view ----
  return (
    <div className="cx-root cx-container">
      {header}

      {continueInfo && (
        <div
          className="cx-card"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
            borderLeft: '3px solid var(--cx-accent)',
          }}
        >
          <div>
            <div className="cx-small cx-muted">{continueInfo.label}</div>
            <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>
              {continueInfo.meta.title}
            </div>
            <div className="cx-small cx-muted">{continueInfo.meta.tagline}</div>
          </div>
          <button
            type="button"
            className="cx-btn cx-btn--primary"
            onClick={() => handleOpen(continueInfo.meta.id)}
          >
            Open →
          </button>
        </div>
      )}

      <CategoryCards
        metas={CONCEPT_METAS}
        statuses={state.status}
        onSelectCategory={(id) => updateParams({ cat: id })}
      />

      <div style={{ marginTop: '2rem' }}>
        <LibraryToolbar
          metas={CONCEPT_METAS}
          statuses={state.status}
          filters={filters}
          onFiltersChange={(next) =>
            updateParams({
              q: next.q ?? null,
              cat: next.category && next.category !== 'all' ? next.category : null,
              lvl: next.level && next.level !== 'all' ? next.level : null,
              status: next.status && next.status !== 'all' ? next.status : null,
            })
          }
          sort={sort}
          onSortChange={(s) => updateParams({ sort: s !== 'recommended' ? s : null })}
          resultCount={filtered.length}
        />

        {filtered.length === 0 ? (
          <EmptyState
            title="No concepts match your filters"
            description="Try clearing filters or searching for a different term."
            action={{
              label: 'Clear filters',
              onClick: () =>
                updateParams({ q: null, cat: null, lvl: null, status: null }),
            }}
          />
        ) : (
          <div className="cx-grid" role="list">
            {filtered.map((meta) => (
              <ConceptCard
                key={meta.id}
                meta={meta}
                status={state.status[meta.id] ?? 'not-started'}
                onOpen={handleOpen}
                onStatusChange={(id, next) => handleStatusChange(id, next)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Local alias to avoid importing LearningStatus in the callback signature above
type ConceptStatusArg = LearningStatus;
void (undefined as unknown as ConceptMeta);
