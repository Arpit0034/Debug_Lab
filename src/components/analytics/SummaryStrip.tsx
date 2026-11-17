export interface MetricData {
  label: string;
  value: string;
  hint?: string;
  delta?: { value: string; tone: 'good' | 'bad' | 'neutral' } | null;
}

export function SummaryStrip({ metrics }: { metrics: MetricData[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((m, i) => (
        <div key={i} className="ana-card p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">{m.label}</div>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums leading-none">{m.value}</span>
            {m.delta && (
              <span
                className={`text-xs font-medium tabular-nums ${
                  m.delta.tone === 'good' ? 'text-good' : m.delta.tone === 'bad' ? 'text-bad' : 'text-muted'
                }`}
              >
                {m.delta.value}
              </span>
            )}
          </div>
          {m.hint && <div className="mt-1.5 text-xs text-muted">{m.hint}</div>}
        </div>
      ))}
    </div>
  );
}
