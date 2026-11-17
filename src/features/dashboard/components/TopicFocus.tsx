import { Link } from 'react-router-dom';
import type { TopicRow } from '../../../services/analytics/analytics';
import { pct } from '../../../utils/format';

function TopicRowItem({ row, tone }: { row: TopicRow; tone: 'good' | 'warn' | 'bad' }) {
  const acc = row.accuracy ?? 0;
  const width = Math.round(Math.max(0, Math.min(1, acc)) * 100);
  const bg = tone === 'good' ? 'bg-good' : tone === 'warn' ? 'bg-warn' : 'bg-bad';

  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <Link
          to="/practice"
          className="min-w-0 truncate font-medium hover:text-accent"
          title={`Practice ${row.topic}`}
        >
          {row.topic}
        </Link>
        <span className="shrink-0 text-xs text-muted tabular-nums">{pct(row.accuracy)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div className={`dash-bar-fill h-full rounded-full ${bg}`} style={{ width: `${width}%` }} />
      </div>
      <div className="text-[11px] text-muted">
        {row.solved}/{row.total} solved
      </div>
    </li>
  );
}

export function TopicFocus({ topics }: { topics: TopicRow[] }) {
  const withAttempts = topics.filter((t) => t.attempts > 0 && t.accuracy !== null);
  const strongest = [...withAttempts]
    .sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0) || a.topic.localeCompare(b.topic))
    .slice(0, 3);
  const weakest = [...withAttempts]
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0) || a.topic.localeCompare(b.topic))
    .slice(0, 3);
  const hasAny = withAttempts.length > 0;

  return (
    <section className="dash-card p-5 lg:col-span-7">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="dash-label">Topic focus</h2>
          <p className="mt-1 text-sm text-muted">Where you are strong and what to practice next.</p>
        </div>
        <Link to="/practice" className="shrink-0 text-xs text-accent hover:underline">
          Practice
        </Link>
      </header>

      {hasAny ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-good">
              Strongest
            </h3>
            <ul className="space-y-3">
              {strongest.map((r) => (
                <TopicRowItem key={r.topic} row={r} tone="good" />
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-warn">
              Needs work
            </h3>
            <ul className="space-y-3">
              {weakest.map((r) => {
                const acc = r.accuracy ?? 0;
                return <TopicRowItem key={r.topic} row={r} tone={acc < 0.4 ? 'bad' : 'warn'} />;
              })}
            </ul>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Attempt a problem to see topic strengths here.</p>
      )}
    </section>
  );
}
