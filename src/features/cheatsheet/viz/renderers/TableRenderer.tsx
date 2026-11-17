import type { Frame, Highlight } from '../types';

function colorFor(c: Highlight['color']): string {
  if (c === 'ok') return 'var(--good)';
  if (c === 'warn') return 'var(--warn)';
  if (c === 'bad') return 'var(--bad)';
  return 'var(--accent)';
}

export function TableRenderer({ frame }: { frame: Frame }): React.ReactElement | null {
  if (frame.data.kind !== 'table') return null;
  const { rows, rowLabels, colLabels } = frame.data;
  const hSet = new Set((frame.highlights ?? []).map((h) => h.index));
  // Highlights are row-major: index = r * cols + c
  const cols = rows[0]?.length ?? 0;

  const cellColor = (r: number, c: number): Highlight['color'] | undefined => {
    const idx = r * cols + c;
    if (!hSet.has(idx)) return undefined;
    const h = (frame.highlights ?? []).find((x) => x.index === idx);
    return h?.color;
  };

  return (
    <div style={{ overflowX: 'auto' }} role="img" aria-label={frame.description}>
      <table
        style={{
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          margin: '0 auto',
        }}
      >
        <thead>
          {colLabels && (
            <tr>
              {rowLabels && <th style={{ padding: '0.25rem 0.5rem' }} />}
              {colLabels.map((c, i) => (
                <th key={i} style={{ padding: '0.25rem 0.5rem', fontWeight: 600, color: 'var(--cx-fg-muted)' }}>
                  {c}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {rowLabels && (
                <th
                  scope="row"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontWeight: 600,
                    color: 'var(--cx-fg-muted)',
                    textAlign: 'right',
                  }}
                >
                  {rowLabels[r]}
                </th>
              )}
              {row.map((cell, c) => {
                const color = cellColor(r, c);
                return (
                  <td
                    key={c}
                    style={{
                      padding: '0.35rem 0.6rem',
                      textAlign: 'center',
                      border: `2px solid ${color ? colorFor(color) : 'var(--cx-border)'}`,
                      background: color ? `color-mix(in srgb, ${colorFor(color)} 12%, transparent)` : 'var(--cx-bg-card)',
                      color: 'var(--cx-fg)',
                      minWidth: '2rem',
                    }}
                  >
                    {String(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
