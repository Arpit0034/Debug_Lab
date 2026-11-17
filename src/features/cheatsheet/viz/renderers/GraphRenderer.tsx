import type { Frame, Highlight } from '../types';

function colorFor(c: Highlight['color']): string {
  if (c === 'ok') return 'var(--good)';
  if (c === 'warn') return 'var(--warn)';
  if (c === 'bad') return 'var(--bad)';
  return 'var(--accent)';
}

const NODE_R = 20;
const W = 500;
const H = 320;

export function GraphRenderer({ frame }: { frame: Frame }): React.ReactElement | null {
  if (frame.data.kind !== 'graph') return null;
  const { nodes, edges } = frame.data;
  const hByIndex = new Map<number, Highlight['color']>();
  for (const h of frame.highlights ?? []) hByIndex.set(h.index, h.color);

  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} role="img" aria-label={frame.description}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%', height: 'auto' }} width={W} height={H}>
        {edges.map((e, i) => {
          const a = nodeById.get(e.from);
          const b = nodeById.get(e.to);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--cx-border)"
              strokeWidth={2}
            />
          );
        })}
        {nodes.map((n) => {
          const color = hByIndex.get(n.id);
          const stroke = color ? colorFor(color) : 'var(--cx-border)';
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={NODE_R}
                fill={color ? `color-mix(in srgb, ${stroke} 18%, var(--cx-bg-card))` : 'var(--cx-bg-card)'}
                stroke={stroke}
                strokeWidth={2.5}
              />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                fontSize={12}
                fontFamily="var(--font-mono)"
                fill="var(--cx-fg)"
                fontWeight={600}
              >
                {n.label ?? n.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
