import { describe, it, expect } from 'vitest';
import { CONCEPT_METAS, loadConceptDetail } from './index';

const CATEGORIES = [
  'foundations',
  'data-structures',
  'algorithms',
  'techniques',
  'paradigms',
  'advanced',
];
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const TIERS = ['flagship', 'core', 'overview'];

describe('data integrity', () => {
  it('has unique concept ids', () => {
    const ids = CONCEPT_METAS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every meta has valid enum values', () => {
    for (const m of CONCEPT_METAS) {
      expect(CATEGORIES, `category of ${m.id}`).toContain(m.category);
      expect(LEVELS, `level of ${m.id}`).toContain(m.level);
      expect(TIERS, `tier of ${m.id}`).toContain(m.tier);
      expect(m.title.length, `title of ${m.id}`).toBeGreaterThan(0);
      expect(m.tagline.length, `tagline of ${m.id}`).toBeGreaterThan(0);
      expect(m.estMinutes, `estMinutes of ${m.id}`).toBeGreaterThan(0);
    }
  });

  it('every detail is loadable and id matches meta', async () => {
    for (const meta of CONCEPT_METAS) {
      const detail = await loadConceptDetail(meta.id);
      expect(detail, `detail for ${meta.id}`).not.toBeNull();
      expect(detail!.id).toBe(meta.id);
    }
  });

  it('every flagship has all 3 languages and a dry run', async () => {
    const flagships = CONCEPT_METAS.filter((m) => m.tier === 'flagship');
    expect(flagships.length).toBeGreaterThan(0);
    for (const meta of flagships) {
      const d = await loadConceptDetail(meta.id);
      expect(d!.code.python, `python of ${meta.id}`).toBeDefined();
      expect(d!.code.java, `java of ${meta.id}`).toBeDefined();
      expect(d!.code.cpp, `cpp of ${meta.id}`).toBeDefined();
      expect(d!.dryRun?.steps.length ?? 0, `dry run of ${meta.id}`).toBeGreaterThan(0);
    }
  });

  it('every related id exists in the registry', async () => {
    const ids = new Set(CONCEPT_METAS.map((m) => m.id));
    for (const meta of CONCEPT_METAS) {
      const d = await loadConceptDetail(meta.id);
      for (const rel of d!.related) {
        expect(ids.has(rel.id), `${meta.id} → related "${rel.id}"`).toBe(true);
      }
    }
  });

  it('every code sample is non-empty and has valid language keys', async () => {
    const validLangs = new Set(['python', 'java', 'cpp']);
    for (const meta of CONCEPT_METAS) {
      const d = await loadConceptDetail(meta.id);
      for (const [lang, sample] of Object.entries(d!.code)) {
        expect(validLangs.has(lang), `bad lang ${lang} in ${meta.id}`).toBe(true);
        expect(sample!.code.trim().length, `${meta.id} ${lang} code`).toBeGreaterThan(0);
      }
    }
  });

  it('contains no placeholder text', async () => {
    const forbidden = ['TODO', 'TBD', 'lorem ipsum', 'Coming soon', 'coming soon'];
    for (const meta of CONCEPT_METAS) {
      const d = await loadConceptDetail(meta.id);
      const json = JSON.stringify(d);
      for (const f of forbidden) {
        expect(json.includes(f), `${meta.id} contains "${f}"`).toBe(false);
      }
    }
  });
});
