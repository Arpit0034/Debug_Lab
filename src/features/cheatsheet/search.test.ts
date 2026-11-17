import { describe, it, expect } from 'vitest';
import { searchConcepts } from './search';
import type { ConceptMeta } from './types';

const META: ConceptMeta[] = [
  {
    id: 'alpha',
    title: 'Alpha',
    tagline: 'first concept',
    category: 'foundations',
    level: 'beginner',
    tier: 'core',
    time: 'O(1)',
    space: 'O(1)',
    estMinutes: 5,
    keywords: ['alpha', 'primitive'],
    patterns: [],
    chunk: 'c1',
  },
  {
    id: 'beta',
    title: 'Beta',
    tagline: 'second concept',
    category: 'data-structures',
    level: 'intermediate',
    tier: 'flagship',
    time: 'O(n)',
    space: 'O(n)',
    estMinutes: 15,
    keywords: ['beta'],
    patterns: ['pair sum', 'sorted array'],
    chunk: 'c1',
  },
  {
    id: 'gamma',
    title: 'Gamma',
    tagline: 'third concept',
    category: 'techniques',
    level: 'advanced',
    tier: 'flagship',
    time: 'O(log n)',
    space: 'O(1)',
    estMinutes: 25,
    keywords: ['gamma'],
    patterns: [],
    chunk: 'c1',
  },
];

describe('searchConcepts', () => {
  it('returns all with no filters', () => {
    expect(searchConcepts(META, {})).toHaveLength(3);
  });

  it('filters by category', () => {
    const out = searchConcepts(META, { category: 'foundations' });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('alpha');
  });

  it('filters by level', () => {
    const out = searchConcepts(META, { level: 'advanced' });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('gamma');
  });

  it('filters by status via provided map', () => {
    const out = searchConcepts(META, { status: 'learning' }, 'recommended', {
      beta: 'learning',
    });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('beta');
  });

  it('matches text in title, tagline, keywords or patterns', () => {
    expect(searchConcepts(META, { q: 'alpha' })).toHaveLength(1);
    expect(searchConcepts(META, { q: 'second' })).toHaveLength(1);
    expect(searchConcepts(META, { q: 'primitive' })).toHaveLength(1);
    expect(searchConcepts(META, { q: 'pair sum' })).toHaveLength(1);
    expect(searchConcepts(META, { q: 'nothing' })).toHaveLength(0);
  });

  it('sorts alphabetically', () => {
    const out = searchConcepts(META, {}, 'alphabetical');
    expect(out.map((m) => m.id)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('sorts by level', () => {
    const out = searchConcepts(META, {}, 'level');
    expect(out.map((m) => m.id)).toEqual(['alpha', 'beta', 'gamma']);
  });
});
