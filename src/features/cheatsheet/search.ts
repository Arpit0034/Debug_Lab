import type {
  ConceptMeta,
  ConceptCategoryId,
  ConceptLevel,
  LearningStatus,
} from './types';

export interface SearchFilters {
  q?: string;
  category?: ConceptCategoryId | 'all';
  level?: ConceptLevel | 'all';
  status?: LearningStatus | 'all';
}

export type SortMode = 'recommended' | 'alphabetical' | 'level';

const LEVEL_ORDER: Record<ConceptLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export function searchConcepts(
  metas: ConceptMeta[],
  filters: SearchFilters,
  sort: SortMode = 'recommended',
  statuses: Record<string, LearningStatus> = {},
): ConceptMeta[] {
  const q = (filters.q ?? '').trim().toLowerCase();
  const cat = filters.category ?? 'all';
  const lvl = filters.level ?? 'all';
  const st = filters.status ?? 'all';

  const filtered = metas.filter((m) => {
    if (cat !== 'all' && m.category !== cat) return false;
    if (lvl !== 'all' && m.level !== lvl) return false;
    if (st !== 'all') {
      const cur = statuses[m.id] ?? 'not-started';
      if (cur !== st) return false;
    }
    if (q) {
      const hay = [m.title, m.tagline, ...m.keywords, ...m.patterns]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (sort === 'alphabetical') {
    return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sort === 'level') {
    return [...filtered].sort(
      (a, b) =>
        LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] ||
        a.title.localeCompare(b.title),
    );
  }
  return filtered;
}
