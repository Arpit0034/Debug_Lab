import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { problems } from '../../data/problemRegistry';
import { DIFFICULTIES, LANGUAGES, LANGUAGE_LABELS, TOPICS } from '../../types/problem';
import { useApp } from '../../app/providers/context';
import { PageHeader } from '../../components/common/PageHeader';
import { isRevealed, statusOf } from '../../utils/status';
import { ProblemList } from './ProblemList';
import { X } from 'lucide-react';

const selectClass = 'ui-input min-w-[140px] flex-1 sm:flex-none';

export function ProblemsPage() {
  const { progress } = useApp();
  const [params, setParams] = useSearchParams();
  
  const topic = params.get('topic') ?? '';
  const difficulty = params.get('difficulty') ?? '';
  const language = params.get('language') ?? '';
  const status = params.get('status') ?? '';
  const subtopic = params.get('subtopic') ?? '';
  const category = params.get('category') ?? '';
  const q = (params.get('q') ?? '').trim().toLowerCase();

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  const hasFilters = Boolean(q || topic || difficulty || language || status || subtopic || category);

  const filtered = useMemo(
    () =>
      problems.filter((p) => {
        const revealed = isRevealed(p.id, progress.attempts);
        const text = revealed
          ? [p.title, p.topic, p.subtopic, p.bugCategory, ...p.tags].join(' ').toLowerCase()
          : `find the bug ${p.id.slice(1)} ${p.id}`;
        return (
          (!q || text.includes(q)) &&
          (!subtopic || p.subtopic === subtopic) &&
          (!category || p.bugCategory === category) &&
          (!topic || p.topic === topic) &&
          (!difficulty || p.difficulty === difficulty) &&
          (!language || (p.languages as string[]).includes(language)) &&
          (!status || statusOf(p.id, progress.attempts) === status)
        );
      }),
    [topic, subtopic, category, q, difficulty, language, status, progress.attempts],
  );
  
  const subtopics = useMemo(
    () => Array.from(new Set(problems.filter((p) => !topic || p.topic === topic).map((p) => p.subtopic))).sort(),
    [topic],
  );
  const categories = useMemo(() => Array.from(new Set(problems.map((p) => p.bugCategory))).sort(), []);

  return (
    <div className="space-y-6">
      <PageHeader title="All Problems" subtitle={`${filtered.length} of ${problems.length} problems`} />
      
      <div className="sticky top-0 z-10 -mx-4 bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 border-b border-line/50">
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full sm:w-64">
            <input
              type="search"
              value={params.get('q') ?? ''}
              onChange={(e) => set('q', e.target.value)}
              placeholder="Search problems..."
              aria-label="Search"
              className="ui-input w-full pl-9"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select className={selectClass} value={difficulty} onChange={(e) => set('difficulty', e.target.value)} aria-label="Difficulty">
            <option value="">Difficulty</option>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
          
          <select className={selectClass} value={language} onChange={(e) => set('language', e.target.value)} aria-label="Language">
            <option value="">Language</option>
            {LANGUAGES.map((l) => <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>)}
          </select>
          
          <select className={selectClass} value={status} onChange={(e) => set('status', e.target.value)} aria-label="Status">
            <option value="">Status</option>
            <option value="unattempted">Not attempted</option>
            <option value="attempted">Attempted</option>
            <option value="solved">Solved</option>
          </select>
          
          <select className={selectClass} value={subtopic} onChange={(e) => set('subtopic', e.target.value)} aria-label="Subtopic">
            <option value="">Subtopic</option>
            {subtopics.map((t) => <option key={t}>{t}</option>)}
          </select>
          
          <select className={selectClass} value={category} onChange={(e) => set('category', e.target.value)} aria-label="Bug category">
            <option value="">Bug Category</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {hasFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted font-medium mr-1">Active filters:</span>
            {topic && (
              <span className="ui-chip flex items-center gap-1">
                Topic: {TOPICS.includes(topic as (typeof TOPICS)[number]) ? topic : 'unknown'}
                <button onClick={() => set('topic', '')} aria-label="Clear topic filter"><X size={12} /></button>
              </span>
            )}
            {q && (
              <span className="ui-chip flex items-center gap-1">
                "{q}"
                <button onClick={() => set('q', '')} aria-label="Clear search"><X size={12} /></button>
              </span>
            )}
            {(difficulty || language || status || subtopic || category) && (
              <span className="ui-chip flex items-center gap-1">
                Filters applied
              </span>
            )}
            <button onClick={clearAll} className="text-xs font-medium text-accent hover:underline ml-2">
              Clear all
            </button>
          </div>
        )}
      </div>
      
      <ProblemList items={filtered} empty="No problems match these filters. Try adjusting your search or clearing filters." />
    </div>
  );
}
