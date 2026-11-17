import type { Frame, Highlight } from '../types';

function colorFor(c: Highlight['color']): string {
  if (c === 'ok') return 'var(--good)';
  if (c === 'warn') return 'var(--warn)';
  if (c === 'bad') return 'var(--bad)';
  return 'var(--accent)';
}

export function ArrayRenderer({ frame }: { frame: Frame }): React.ReactElement | null {
  if (frame.data.kind !== 'array') return null;
  const values = frame.data.values;
  const labels = frame.data.labels;
  const hByIndex = new Map<number, Highlight['color']>();
  for (const h of frame.highlights ?? []) hByIndex.set(h.index, h.color);

  return (
    <div className="cx-row" role="img" aria-label={frame.description}>
      <div
        style={{
          display: 'flex',
          gap: '0.35rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {values.map((v, i) => {
          const color = hByIndex.get(i);
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {labels && labels[i] !== undefined && (
                <div className="cx-small cx-muted" style={{ marginBottom: '0.15rem' }}>
                  {labels[i]}
                </div>
              )}
              <div
                style={{
                  minWidth: '2.5rem',
                  padding: '0.5rem 0.6rem',
                  textAlign: 'center',
                  borderRadius: '0.375rem',
                  border: `2px solid ${color ? colorFor(color) : 'var(--cx-border)'}`,
                  background: color ? `color-mix(in srgb, ${colorFor(color)} 12%, transparent)` : 'var(--cx-bg-muted)',
                  color: 'var(--cx-fg)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                }}
              >
                {String(v)}
              </div>
              <div className="cx-small cx-muted" style={{ marginTop: '0.15rem', fontSize: '0.6875rem' }}>
                {i}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
