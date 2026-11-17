import type { Frame, VizDefinition } from '../types';

export interface DfsInput { source: number }

const NODES = [
  { id: 0, label: '0', x: 250, y: 50 },
  { id: 1, label: '1', x: 100, y: 130 },
  { id: 2, label: '2', x: 250, y: 130 },
  { id: 3, label: '3', x: 400, y: 130 },
  { id: 4, label: '4', x: 250, y: 210 },
  { id: 5, label: '5', x: 250, y: 280 },
];

const EDGES = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
];

const ADJ: Record<number, number[]> = {
  0: [1, 2, 3],
  1: [0, 4],
  2: [0, 4],
  3: [0, 4],
  4: [1, 2, 3, 5],
  5: [4],
};

export const graphDfsViz: VizDefinition<DfsInput> = {
  id: 'graph-dfs',
  title: 'DFS — Depth-First Search',
  description:
    'Dive deep from the source; backtrack only when stuck. Records pre-order visitation (not shortest paths).',
  defaultInput: { source: 0 },
  describeInput: (i) => `source = ${i.source}`,
  reference: (i) => {
    const visited = new Set<number>();
    const order: number[] = [];
    const go = (u: number): void => {
      visited.add(u);
      order.push(u);
      for (const v of ADJ[u] ?? []) if (!visited.has(v)) go(v);
    };
    go(i.source);
    return order.join(',');
  },
  generator: (input) => {
    const frames: Frame[] = [];
    const visited = new Set<number>();
    const order: number[] = [];
    let step = 0;

    const push = (desc: string, active: number | null, done = false): void => {
      frames.push({
        step: step++,
        description: desc,
        data: { kind: 'graph', nodes: NODES, edges: EDGES },
        highlights: [
          ...order.map((id) => ({ index: id, color: 'ok' as const })),
          ...(active !== null && !order.includes(active)
            ? [{ index: active, color: 'active' as const }]
            : []),
        ],
        vars: { order: order.join(','), visited: [...visited].join(',') },
        done,
      });
    };

    const go = (u: number): void => {
      visited.add(u);
      order.push(u);
      push(`Visit ${u}. Order: [${order.join(', ')}].`, u);
      for (const v of ADJ[u] ?? []) {
        if (!visited.has(v)) {
          push(`From ${u}, recurse into ${v}.`, u);
          go(v);
          push(`Return to ${u}. Continue its neighbors.`, u);
        }
      }
    };

    go(input.source);
    push(`DFS complete. Order: [${order.join(', ')}].`, null, true);
    frames[frames.length - 1].vars = {
      ...frames[frames.length - 1].vars,
      result: order.join(','),
    };
    return frames;
  },
};
