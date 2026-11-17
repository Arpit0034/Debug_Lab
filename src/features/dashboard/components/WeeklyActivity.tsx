import type { DayCount } from '../../../services/analytics/analytics';

const CHART_H = 96;

interface WeeklyActivityProps {
  data: DayCount[];
  total: number;
}

export function WeeklyActivity({ data, total }: WeeklyActivityProps) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const lastIndex = data.length - 1;

  return (
    <section className="dash-card p-5 lg:col-span-8">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="dash-label">Weekly activity</h2>
          <p className="mt-1 text-sm text-muted">Attempts per day over the last 7 days.</p>
        </div>
        <span className="shrink-0 rounded-md border border-line px-2 py-1 text-xs text-muted tabular-nums">
          {total} total
        </span>
      </header>

      <div className="mt-4 flex items-end gap-1.5 sm:gap-2">
        {data.map((d, i) => {
          const isToday = i === lastIndex;
          const h = Math.max(4, Math.round((d.count / max) * CHART_H));
          const label = `${d.label}: ${d.count} attempt${d.count === 1 ? '' : 's'}`;
          return (
            <div key={`${d.label}-${i}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-end justify-center" style={{ height: CHART_H }}>
                <div
                  className={`dash-week-bar w-full rounded-md ${
                    isToday ? 'bg-accent' : 'bg-surface-2'
                  }`}
                  style={{ height: `${h}px` }}
                  role="img"
                  aria-label={label}
                  title={label}
                />
              </div>
              <span
                className={`text-[11px] ${
                  isToday ? 'font-semibold text-fg' : 'text-muted'
                }`}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
