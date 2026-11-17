import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

export function DonutCard({ title, data }: { title: string; data: DonutDatum[] }) {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="ana-card p-5 text-center text-sm text-muted">
        {title}: No attempts yet.
      </div>
    );
  }

  return (
    <div className="ana-card p-5 flex flex-col items-center">
      <h3 className="text-sm font-medium self-start mb-2">{title}</h3>
      <div style={{ width: '100%', height: 180 }} className="relative" role="img" aria-label={`${title} donut chart`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              stroke="none"
              paddingAngle={2}
              isAnimationActive={!prefersReducedMotion}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12 }}
              itemStyle={{ color: 'var(--fg)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-semibold tabular-nums">{total}</span>
          <span className="text-xs text-muted">Attempts</span>
        </div>
      </div>
      <ul className="mt-4 w-full space-y-2">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span>{d.name}</span>
            </div>
            <span className="tabular-nums text-muted">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
