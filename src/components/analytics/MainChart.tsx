import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export interface ChartPoint {
  date: string;
  attempts: number;
  accuracy: number | null;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; value?: number | string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const attempts = payload.find((p) => p.dataKey === 'attempts')?.value ?? 0;
  const accuracy = payload.find((p) => p.dataKey === 'accuracy')?.value;

  return (
    <div className="rounded-lg border border-line bg-surface p-3 shadow-lg text-xs ana-card">
      <p className="font-medium text-fg mb-2">{label}</p>
      <div className="space-y-1 text-muted">
        <p>Attempts: <span className="text-fg tabular-nums">{attempts}</span></p>
        <p>Accuracy: <span className="text-fg tabular-nums">{accuracy !== null && accuracy !== undefined ? `${accuracy}%` : '-'}</span></p>
      </div>
    </div>
  );
}

export function MainChart({ data }: { data: ChartPoint[] }) {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (data.length === 0) {
    return (
      <div className="ana-card p-6 text-center text-sm text-muted">
        No activity for this period. Start practicing to see your progress chart.
      </div>
    );
  }

  return (
    <div className="ana-card p-5">
      <h2 className="text-sm font-medium mb-4">Activity & Accuracy Over Time</h2>
      <div style={{ height: 300 }} className="w-full" role="img" aria-label="Chart showing attempts and accuracy over time">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="anaArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} minTickGap={20} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--line)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area yAxisId="left" type="monotone" dataKey="attempts" fill="url(#anaArea)" stroke="var(--accent)" strokeWidth={2} isAnimationActive={!prefersReducedMotion} />
            <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="var(--good)" strokeWidth={2} dot={false} connectNulls isAnimationActive={!prefersReducedMotion} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
