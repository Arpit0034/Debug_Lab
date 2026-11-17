import type { Frame, VizDefinition } from '../types';

export interface DijkstraInput { source: number }

const NODES = [
  { id: 0, label: '0', x: 250, y: 50 },
  { id: 1, label: '1', x: 100, y: 160 },
  { id: 2, label: '2', x: 400, y: 160 },
  { id: 3, label: '3', x: 400, y: 270 },
];

const EDGES = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 1 },
  { from: 1, to: 2, weight: 1 },
  { from: 2, to: 3, weight: 1 },
];

const ADJ: Record<number, { v: number; w: number }[]> = {
  0: [{ v: 1, w: 4 }, { v: 2, w: 1 }],
  1: [{ v: 0, w: 4 }, { v: 2, w: 1 }],
  2: [{ v: 0, w: 1 }, { v: 1, w: 1 }, { v: 3, w: 1 }],
  3: [{ v: 2, w: 1 }],
};

const INF = Number.POSITIVE_INFINITY;

export const graphDijkstraViz: VizDefinition<DijkstraInput> = {
  id: 'graph-dijkstra',
  title: "Dijkstra's Algorithm",
  description:
    'Shortest paths from a source on a weighted graph. Repeatedly pop the smallest tentative distance and relax its edges.',
  defaultInput: { source: 0 },
  describeInput: (i) => `source = ${i.source}`,
  reference: (i) => {
    const dist: Record<number, number> = { 0: INF, 1: INF, 2: INF, 3: INF };
    dist[i.source] = 0;
    const pq: { u: number; d: number }[] = [{ u: i.source, d: 0 }];
    while (pq.length) {
      pq.sort((a, b) => a.d - b.d);
      const { u, d } = pq.shift() as { u: number; d: number };
      if (d > dist[u]) continue;
      for (const { v, w } of ADJ[u] ?? []) {
        if (d + w < dist[v]) {
          dist[v] = d + w;
          pq.push({ u: v, d: dist[v] });
        }
      }
    }
    return [0, 1, 2, 3].map((n) => dist[n]).join(',');
  },
  generator: (input) => {
    const frames: Frame[] = [];
    const dist: Record<number, number> = { 0: INF, 1: INF, 2: INF, 3: INF };
    dist[input.source] = 0;
    const pq: { u: number; d: number }[] = [{ u: input.source, d: 0 }];
    const settled = new Set<number>();
    let step = 0;

    const push = (desc: string, active: number | null, done = false): void => {
      const formatted = [0, 1, 2, 3]
        .map((n) => `${n}:${dist[n] === INF ? '∞' : dist[n]}`)
        .join(' ');
      frames.push({
        step: step++,
        description: desc,
        data: { kind: 'graph', nodes: NODES, edges: EDGES },
        highlights: [
          ...[...settled].map((id) => ({ index: id, color: 'ok' as const })),
          ...(active !== null ? [{ index: active, color: 'active' as const }] : []),
        ],
        vars: {
          dist: formatted,
          pq: pq.map((e) => `${e.u}(${e.d})`).join(' '),
        },
        done,
      });
    };

    push(`Start: dist[${input.source}] = 0, all others ∞.`, input.source);

    while (pq.length) {
      pq.sort((a, b) => a.d - b.d);
      const { u, d } = pq.shift() as { u: number; d: number };
      if (d > dist[u]) {
        push(`Pop stale entry (${u}, ${d}). Skip.`, null);
        continue;
      }
      settled.add(u);
      push(`Pop (${u}, ${d}) — settled. Relax its edges.`, u);
      for (const { v, w } of ADJ[u] ?? []) {
        if (d + w < dist[v]) {
          dist[v] = d + w;
          pq.push({ u: v, d: dist[v] });
          push(`Relax ${u}→${v}: new dist[${v}] = ${dist[v]}.`, v);
        }
      }
    }

    push(
      `Done. Distances: 0=${dist[0]}, 1=${dist[1]}, 2=${dist[2]}, 3=${dist[3]}.`,
      null,
      true,
    );
    frames[frames.length - 1].vars = {
      ...frames[frames.length - 1].vars,
      result: [0, 1, 2, 3].map((n) => dist[n]).join(','),
    };
    return frames;
  },
};
