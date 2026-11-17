import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface Datum {
  name: string;
  value: number;
}

interface Props {
  title: string;
  data: Datum[];
  /** Shown instead of an empty plot, so a fresh profile is honest. */
  emptyText: string;
  hasData: boolean;
  unit?: string;
  max?: number;
  horizontal?: boolean;
}

const axis = { fontSize: 12, fill: 'var(--muted)' };

/** Single-series bar chart: one accent colour, quiet grid, thin rounded bars, hover tooltip. */
export function BarCard({ title, data, emptyText, hasData, unit = '', max, horizontal = false }: Props) {
  const height = horizontal ? Math.max(140, data.length * 46 + 28) : 200;
  return (
    <section className="rounded-lg border border-line bg-surface p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      {!hasData ? (
        <p className="mt-3 text-sm text-muted">{emptyText}</p>
      ) : (
        <>
          <div className="mt-3" style={{ height }} role="img" aria-label={`${title} bar chart`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" horizontal={!horizontal} vertical={horizontal} />
                {horizontal ? (
                  <>
                    <XAxis type="number" tick={axis} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, max ?? 'auto']} />
                    <YAxis type="category" dataKey="name" tick={axis} axisLine={false} tickLine={false} width={190} interval={0} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, max ?? 'auto']} width={32} />
                  </>
                )}
                <Tooltip
                  cursor={{ fill: 'var(--surface-2)' }}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 6, fontSize: 12 }}
                  labelStyle={{ color: 'var(--fg)' }}
                  itemStyle={{ color: 'var(--fg)' }}
                  formatter={(v) => [`${v}${unit}`, title]}
                />
                <Bar dataKey="value" fill="var(--accent)" maxBarSize={22} isAnimationActive={false} radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>{title}</caption>
            <tbody>
              {data.map((d) => (
                <tr key={d.name}>
                  <th scope="row">{d.name}</th>
                  <td>
                    {d.value}
                    {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
