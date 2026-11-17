import { useState, useMemo } from 'react';
import type { TopicRow } from '../../services/analytics/analytics';
import { pct } from '../../utils/format';

export function TopicBreakdown({ topics }: { topics: TopicRow[] }) {
  const [sortBy, setSortBy] = useState<'accuracy' | 'attempts' | 'name'>('accuracy');

  const sortedTopics = useMemo(() => {
    return [...topics].sort((a, b) => {
      if (a.attempts === 0 && b.attempts === 0) return a.topic.localeCompare(b.topic);
      if (a.attempts === 0) return 1;
      if (b.attempts === 0) return -1;

      if (sortBy === 'accuracy') {
        return (a.accuracy ?? 0) - (b.accuracy ?? 0);
      }
      if (sortBy === 'attempts') {
        return b.attempts - a.attempts;
      }
      return a.topic.localeCompare(b.topic);
    });
  }, [topics, sortBy]);

  return (
    <div className="ana-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-medium">Topic breakdown</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'accuracy' | 'attempts' | 'name')}
          className="text-xs bg-surface-2 border border-line rounded-md px-2 py-1.5 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Sort topics"
        >
          <option value="accuracy">Accuracy (weakest first)</option>
          <option value="attempts">Attempts (most first)</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>
      <ul className="space-y-3">
        {sortedTopics.map((t) => {
          const hasAttempts = t.attempts > 0;
          const acc = t.accuracy ?? 0;
          
          let badge = { text: 'No attempts', className: 'text-muted bg-surface-2 border border-line' };
          if (hasAttempts) {
            if (acc >= 0.7) badge = { text: 'Strong', className: 'text-good bg-good/10 border border-good/20' };
            else if (acc >= 0.4) badge = { text: 'Okay', className: 'text-warn bg-warn/10 border border-warn/20' };
            else badge = { text: 'Needs work', className: 'text-bad bg-bad/10 border border-bad/20' };
          }

          return (
            <li key={t.topic} className="flex items-center justify-between text-sm">
              <div className="flex flex-col min-w-0 pr-4">
                <span className={`truncate ${hasAttempts ? 'font-medium' : 'text-muted'}`}>{t.topic}</span>
                <span className="text-xs text-muted">
                  {t.solved} solved · {t.attempts} attempt{t.attempts === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${badge.className}`}>
                  {badge.text}
                </span>
                <span className="text-sm font-medium tabular-nums w-10 text-right">
                  {hasAttempts ? pct(t.accuracy) : '-'}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
