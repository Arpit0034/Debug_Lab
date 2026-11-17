import { useMemo } from 'react';
import {
  BookOpen,
  Boxes,
  Cpu,
  Layers,
  Lightbulb,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type {
  ConceptCategoryId,
  ConceptMeta,
  LearningStatus,
} from '../types';

interface CategoryDef {
  id: ConceptCategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description:
      'Complexity, arrays, strings, language gotchas — the bedrock every problem stands on.',
    icon: BookOpen,
  },
  {
    id: 'data-structures',
    label: 'Data Structures',
    description:
      'Arrays, hash maps, trees, graphs, heaps, tries — the containers that shape every solution.',
    icon: Boxes,
  },
  {
    id: 'algorithms',
    label: 'Algorithms',
    description:
      'Searching, sorting, graph & tree algorithms — the step-by-step recipes.',
    icon: Cpu,
  },
  {
    id: 'techniques',
    label: 'Problem-Solving Techniques',
    description:
      'Two pointers, sliding window, prefix sum — the patterns that turn O(n²) into O(n log n).',
    icon: Lightbulb,
  },
  {
    id: 'paradigms',
    label: 'Algorithmic Paradigms',
    description:
      'Recursion, backtracking, DP, greedy — the ways to structure an algorithm.',
    icon: Layers,
  },
  {
    id: 'advanced',
    label: 'Advanced Concepts',
    description:
      'Advanced DP, string matching, geometry, network flow — for when the basics are not enough.',
    icon: Sparkles,
  },
];

interface Distribution {
  beginner: number;
  intermediate: number;
  advanced: number;
  total: number;
}

export interface CategoryCardsProps {
  metas: ConceptMeta[];
  statuses: Record<string, LearningStatus>;
  onSelectCategory: (id: ConceptCategoryId) => void;
}

export function CategoryCards({
  metas,
  statuses,
  onSelectCategory,
}: CategoryCardsProps): React.ReactElement {
  const stats = useMemo(() => {
    const m = new Map<ConceptCategoryId, { count: number; completed: number; dist: Distribution }>();
    for (const c of CATEGORIES) {
      m.set(c.id, {
        count: 0,
        completed: 0,
        dist: { beginner: 0, intermediate: 0, advanced: 0, total: 0 },
      });
    }
    for (const meta of metas) {
      const entry = m.get(meta.category);
      if (!entry) continue;
      entry.count += 1;
      entry.dist[meta.level] += 1;
      entry.dist.total += 1;
      if (statuses[meta.id] === 'completed') entry.completed += 1;
    }
    return m;
  }, [metas, statuses]);

  return (
    <div className="cx-grid" role="list">
      {CATEGORIES.map((c) => {
        const entry = stats.get(c.id);
        const count = entry?.count ?? 0;
        const completed = entry?.completed ?? 0;
        const dist = entry?.dist ?? { beginner: 0, intermediate: 0, advanced: 0, total: 0 };
        const Icon = c.icon;
        const pct = (n: number) => (dist.total === 0 ? 0 : (n / dist.total) * 100);
        return (
          <button
            key={c.id}
            type="button"
            role="listitem"
            onClick={() => onSelectCategory(c.id)}
            disabled={count === 0}
            className={`cx-card cx-card--interactive cx-cat-${c.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'left',
              cursor: count === 0 ? 'not-allowed' : 'pointer',
              opacity: count === 0 ? 0.6 : 1,
            }}
          >
            <div className="cx-row" style={{ gap: '0.75rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    'color-mix(in srgb, var(--cx-cat, var(--cx-accent)) 18%, var(--cx-bg-muted))',
                  color: 'var(--cx-cat, var(--cx-accent))',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <Icon size={20} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{c.label}</div>
                <div className="cx-small cx-muted" style={{ marginTop: '0.1rem' }}>
                  {count} {count === 1 ? 'concept' : 'concepts'}
                  {completed > 0 && ` · ${completed} done`}
                </div>
              </div>
            </div>

            <p
              className="cx-small cx-muted"
              style={{ margin: 0, lineHeight: 1.5, minHeight: '2.75rem' }}
            >
              {c.description}
            </p>

            {dist.total > 0 && (
              <div
                style={{
                  display: 'flex',
                  height: '0.375rem',
                  borderRadius: '0.1875rem',
                  overflow: 'hidden',
                  background: 'var(--cx-bg-muted)',
                }}
                aria-label={`Difficulty distribution: ${dist.beginner} beginner, ${dist.intermediate} intermediate, ${dist.advanced} advanced`}
                role="img"
              >
                {dist.beginner > 0 && (
                  <div style={{ width: `${pct(dist.beginner)}%`, background: 'var(--good)' }} />
                )}
                {dist.intermediate > 0 && (
                  <div style={{ width: `${pct(dist.intermediate)}%`, background: 'var(--warn)' }} />
                )}
                {dist.advanced > 0 && (
                  <div style={{ width: `${pct(dist.advanced)}%`, background: 'var(--bad)' }} />
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
