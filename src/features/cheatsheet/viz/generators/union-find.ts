import type { Frame, VizDefinition } from '../types';

export interface UnionFindInput {
  n: number;
  ops: [number, number][];
}

export const unionFindViz: VizDefinition<UnionFindInput> = {
  id: 'union-find',
  title: 'Union-Find (Disjoint Set Union)',
  description:
    'Each set has a representative (root). Union merges two sets by making one root point at the other.',
  defaultInput: { n: 5, ops: [[0, 1], [2, 3], [1, 3]] },
  describeInput: (i) =>
    `n = ${i.n}, ops = [${i.ops.map(([a, b]) => `union(${a},${b})`).join(', ')}]`,
  reference: (i) => {
    const parent = Array.from({ length: i.n }, (_, k) => k);
    const find = (x: number): number => {
      while (parent[x] !== x) x = parent[x];
      return x;
    };
    for (const [a, b] of i.ops) {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) parent[rb] = ra;
    }
    const roots = new Set<number>();
    for (let k = 0; k < i.n; k++) roots.add(find(k));
    return String(roots.size);
  },
  generator: (input) => {
    const parent = Array.from({ length: input.n }, (_, k) => k);
    const frames: Frame[] = [];
    let step = 0;

    const find = (x: number): number => {
      while (parent[x] !== x) x = parent[x];
      return x;
    };

    const push = (
      desc: string,
      highlights: number[],
      done = false,
    ): void => {
      frames.push({
        step: step++,
        description: desc,
        data: {
          kind: 'table',
          rows: [parent.slice()],
          rowLabels: ['parent'],
          colLabels: parent.map((_, idx) => String(idx)),
        },
        highlights: highlights.map((idx) => ({ index: idx, color: 'active' as const })),
        vars: {
          components: String(new Set(parent.map((_, k) => find(k))).size),
        },
        done,
      });
    };

    push(
      `Init: each element is its own root. parent[i] = i for all i. Components = ${input.n}.`,
      parent.map((_, i) => i),
    );

    for (const [a, b] of input.ops) {
      const ra = find(a);
      const rb = find(b);
      if (ra === rb) {
        push(`union(${a},${b}): already same root (${ra}). No change.`, [a, b]);
        continue;
      }
      parent[rb] = ra;
      push(
        `union(${a},${b}): root of ${a} is ${ra}, root of ${b} is ${rb}. Set parent[${rb}] = ${ra}.`,
        [ra, rb],
      );
    }

    const components = String(new Set(parent.map((_, k) => find(k))).size);
    push(`Done. Components = ${components}.`, [], true);
    frames[frames.length - 1].vars = {
      ...frames[frames.length - 1].vars,
      result: components,
    };
    return frames;
  },
};
