import type { Frame, Highlight } from '../types';

function colorFor(c: Highlight['color']): string {
  if (c === 'ok') return 'var(--good)';
  if (c === 'warn') return 'var(--warn)';
  if (c === 'bad') return 'var(--bad)';
  return 'var(--accent)';
}

const NODE_R = 18;
const W = 500;
const H = 300;

interface Pos { x: number; y: number }

function layout(frame: Frame): Map<number, Pos> {
  if (frame.data.kind !== 'tree') return new Map();
  const { nodes, root } = frame.data;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const pos = new Map<number, Pos>();

  // depth + in-order index
  let idx = 0;
  const depths = new Map<number, number>();
  const order: number[] = [];

  function walk(id: number, d: number): void {
    const n = byId.get(id);
    if (!n) return;
    depths.set(id, d);
    if (n.left !== undefined) walk(n.left, d + 1);
    order.push(id);
    if (n.right !== undefined) walk(n.right, d + 1);
  }
  walk(root, 0);

  const total = order.length;
  const maxDepth = Math.max(0, ...[...depths.values()]);
  order.forEach((id, i) => {
    const x = total === 1 ? W / 2 : 40 + (i / (total - 1)) * (W - 80);
    const y = 40 + (maxDepth === 0 ? 0 : (depths.get(id) ?? 0) / maxDepth) * (H - 100);
    pos.set(id, { x, y });
    idx += 0;
  });
  void idx;
  return pos;
}

export function TreeRenderer({ frame }: { frame: Frame }): React.ReactElement | null {
  if (frame.data.kind !== 'tree') return null;
  const pos = layout(frame);
  const hByIndex = new Map<number, Highlight['color']>();
  for (const h of frame.highlights ?? []) hByIndex.set(h.index, h.color);

  const byId = new Map(frame.data.nodes.map((n) => [n.id, n]));

  const lines: React.ReactElement[] = [];
  for (const n of frame.data.nodes) {
    const p = pos.get(n.id);
    if (!p) continue;
    if (n.left !== undefined) {
      const a = pos.get(n.left);
      if (a) lines.push(<line key={`l${n.id}`} x1={p.x} y1={p.y} x2={a.x} y2={a.y} stroke="var(--cx-border)" strokeWidth={2} />);
    }
    if (n.right !== undefined) {
      const a = pos.get(n.right);
      if (a) lines.push(<line key={`r${n.id}`} x1={p.x} y1={p.y} x2={a.x} y2={a.y} stroke="var(--cx-border)" strokeWidth={2} />);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} role="img" aria-label={frame.description}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%', height: 'auto' }} width={W} height={H}>
        {lines}
        {frame.data.nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          const color = hByIndex.get(n.id);
          const stroke = color ? colorFor(color) : 'var(--cx-border)';
          return (
            <g key={n.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={NODE_R}
                fill={color ? `color-mix(in srgb, ${stroke} 18%, var(--cx-bg-card))` : 'var(--cx-bg-card)'}
                stroke={stroke}
                strokeWidth={2.5}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize={11}
                fontFamily="var(--font-mono)"
                fill="var(--cx-fg)"
                fontWeight={600}
              >
                {byId.get(n.id)?.label ?? n.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
