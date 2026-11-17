import type { Frame, VizDefinition } from '../types';

export interface BfsInput { source: number }

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

export const graphBfsViz: VizDefinition<BfsInput> = {
  id: 'graph-bfs',
  title: 'BFS — Breadth-First Search',
  description:
    'Explore the graph level by level from a source using a FIFO queue. First time you see a node is the shortest hop count.',
  defaultInput: { source: 0 },
  describeInput: (i) => `source = ${i.source}`,
  reference: (i) => {
    const dist: Record<number, number> = { [i.source]: 0 };
    const q = [i.source];
    while (q.length) {
      const u = q.shift() as number;
      for (const v of ADJ[u] ?? []) {
        if (dist[v] === undefined) {
          dist[v] = dist[u] + 1;
          q.push(v);
        }
      }
    }
    return [0, 1, 2, 3, 4, 5].map((n) => (dist[n] ?? -1)).join(',');
  },
  generator: (input) => {
    const frames: Frame[] = [];
    const visited = new Set<number>([input.source]);
    const dist: Record<number, number> = { [input.source]: 0 };
    const queue: number[] = [input.source];
    let step = 0;

    const push = (
      desc: string,
      active: number | null,
      visitedIds: number[],
      done = false,
    ): void => {
      frames.push({
        step: step++,
        description: desc,
        data: { kind: 'graph', nodes: NODES, edges: EDGES },
        highlights: [
          ...visitedIds.map((id) => ({ index: id, color: 'ok' as const })),
          ...(active !== null ? [{ index: active, color: 'active' as const }] : []),
        ],
        vars: { queue: queue.join(','), visited: [...visited].join(',') },
        done,
      });
    };

    push(`Start: enqueue source ${input.source}, visited = {${input.source}}.`, input.source, [...visited]);

    while (queue.length > 0) {
      const u = queue.shift() as number;
      push(`Dequeue ${u}. Neighbors of ${u}: [${(ADJ[u] ?? []).join(', ')}].`, u, [...visited]);
      for (const v of ADJ[u] ?? []) {
        if (!visited.has(v)) {
          visited.add(v);
          dist[v] = dist[u] + 1;
          queue.push(v);
          push(`Node ${v} not yet visited → dist[${v}] = ${dist[v]}, enqueue.`, v, [...visited]);
        }
      }
    }

    push(
      `BFS complete. Distances: 0=${dist[0] ?? -1}, 1=${dist[1] ?? -1}, 2=${dist[2] ?? -1}, 3=${dist[3] ?? -1}, 4=${dist[4] ?? -1}, 5=${dist[5] ?? -1}.`,
      null,
      [...visited],
      true,
    );

    frames[frames.length - 1].vars = {
      ...frames[frames.length - 1].vars,
      result: [0, 1, 2, 3, 4, 5].map((n) => (dist[n] ?? -1)).join(','),
    };
    return frames;
  },
};
