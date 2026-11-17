// Tiny hand-made traces used by the "How to read the visualizer" page.
// They are built with the same Step/VizData shapes the real stories use, so the guide shows the real UI.
import type { Kind, Snap, Step, VizData } from './types';

export interface GuideDemo {
  id: string;
  kind: Kind;
  title: string;
  intro: string;
  watch: string[];
  data: VizData;
}


function finish(steps: Step[]): Step[] {
  steps.forEach((s, i) => { s.i = i; });
  return steps;
}

function makeData(id: string, kind: Kind, structure: VizData['structure'], code: string, steps: Step[], result: Snap): VizData {
  const run = { outcome: 'ok' as const, result, steps: finish(steps) };
  return { version: 4, problemId: id, sourceHash: '', kind, structure, code: { correct: code, buggy: code }, buggyLines: [], correct: run, buggy: run, divergence: null };
}

// ---------------------------------------------------------------------------------- tree
const TREE_CODE = `def total(node):
    if node is None:
        return 0
    left = total(node.left)
    right = total(node.right)
    return node.val + left + right`;

function treeDemo(): GuideDemo {
  const nodes = [
    { id: 0, val: 2, left: 1, right: 2 },
    { id: 1, val: 3, left: null, right: null },
    { id: 2, val: 4, left: null, right: null },
  ];
  const steps: Step[] = [];
  let nextCall = 0;
  const nd = (id: number | null): Snap => (id === null ? null : { t: 'node', id, val: nodes[id].val });
  const base = (call: number, parent: number | null, depth: number) => ({ call, parent, depth, fn: 'total', ar: ['node'] });
  const run = (id: number | null, parent: number | null, depth: number, callerLine?: number): number => {
    const call = nextCall++;
    const b = base(call, parent, depth);
    const node = nd(id);
    steps.push({ ...b, i: 0, ev: 'call', line: 1, locals: { node }, cl: callerLine });
    steps.push({ ...b, i: 0, ev: 'line', line: 2, locals: { node }, x: { k: 'if', s: 'node is None', o: id === null ? 'T' : 'F' } });
    if (id === null) {
      steps.push({ ...b, i: 0, ev: 'return', line: 3, locals: { node }, ret: 0, x: { k: 'return', s: '0' } });
      return 0;
    }
    const n = nodes[id];
    steps.push({ ...b, i: 0, ev: 'line', line: 4, locals: { node }, x: { k: 'assign', s: 'left = total(node.left)' } });
    const l = run(n.left, call, depth + 1, 4);
    steps.push({ ...b, i: 0, ev: 'line', line: 5, locals: { node, left: l }, x: { k: 'assign', s: 'right = total(node.right)' } });
    const r = run(n.right, call, depth + 1, 5);
    const sum = n.val + l + r;
    steps.push({ ...b, i: 0, ev: 'return', line: 6, locals: { node, left: l, right: r }, ret: sum, x: { k: 'return', s: n.val + ' + ' + l + ' + ' + r } });
    return sum;
  };
  const total = run(0, null, 0);
  return {
    id: 'tree', kind: 'tree', title: 'Trees: every call looks at one node',
    intro: 'Here total(node) adds up a tree. Each call works on ONE node; it asks its left and right child for their totals, then adds its own value.',
    watch: [
      'The glowing blue circle is the node the current call is working on.',
      'When a call finishes, its node turns green with a tick and a small pill shows the value it handed back (for example "→ 3").',
      'A call on a missing child (None) returns 0 straight away. That is the base case that stops the recursion.',
      'Watch the Call stack box: it grows when a call starts and shrinks when it returns.',
    ],
    data: makeData('guide-tree', 'tree', { tree: { root: 0, nodes } }, TREE_CODE, steps, total),
  };
}

// ---------------------------------------------------------------------------------- graph
const GRAPH_CODE = `def dfs(u):
    visited[u] = True
    for v in g[u]:
        if not visited[v]:
            dfs(v)`;

function graphDemo(): GuideDemo {
  const g: number[][] = [[1, 2], [3], [3], []];
  const visited = [false, false, false, false];
  const vis = (): Snap => ({ t: 'list', v: visited.slice() });
  const steps: Step[] = [];
  let nextCall = 0;
  const run = (u: number, parent: number | null, depth: number, callerLine?: number): void => {
    const call = nextCall++;
    const b = { call, parent, depth, fn: 'dfs', ar: ['u'] };
    steps.push({ ...b, i: 0, ev: 'call', line: 1, locals: { u, visited: vis() }, cl: callerLine });
    steps.push({ ...b, i: 0, ev: 'line', line: 2, locals: { u, visited: vis() }, x: { k: 'assign', s: 'visited[' + u + '] = True' } });
    visited[u] = true;
    let lastV: number | null = null;
    for (const v of g[u]) {
      // like the real tracer: the loop variable only has its new value from the next step on
      const before: Record<string, Snap> = lastV === null ? { u, visited: vis() } : { u, v: lastV, visited: vis() };
      lastV = v;
      steps.push({ ...b, i: 0, ev: 'line', line: 3, locals: before, x: { k: 'for', s: 'g[' + u + ']', t: 'v', o: 'N', iv: { v } } });
      const seen = visited[v];
      steps.push({ ...b, i: 0, ev: 'line', line: 4, locals: { u, v, visited: vis() }, x: { k: 'if', s: 'not visited[' + v + ']', v: 'not ' + (seen ? 'True' : 'False'), o: seen ? 'F' : 'T' } });
      if (!seen) run(v, call, depth + 1, 5);
    }
    steps.push({ ...b, i: 0, ev: 'line', line: 3, locals: lastV === null ? { u, visited: vis() } : { u, v: lastV, visited: vis() }, x: { k: 'for', s: 'g[' + u + ']', t: 'v', o: 'D' } });
    steps.push({ ...b, i: 0, ev: 'return', line: 5, locals: { u, visited: vis() }, ret: null, x: { k: 'end' } });
  };
  run(0, null, 0);
  return {
    id: 'graph', kind: 'graph', title: 'Graphs: follow the arrows, remember who you saw',
    intro: 'Depth-first search from vertex 0 on a directed graph. The array visited remembers which vertices were already reached, so no vertex is processed twice.',
    watch: [
      'Arrowheads show direction: an edge 0 → 1 can be used from 0 to 1, not backwards. Plain lines (no arrowhead) mean the graph is undirected.',
      'The blue vertex is the one the current call is processing. The animated edge is the one being looked at.',
      'The small label under each vertex (visited=...) is the array value for that vertex. Green with a tick means "reached already".',
      'Vertex 3 is reachable from 1 and from 2. The second time, the check "not visited[3]" is False, so the code does not go there again.',
    ],
    data: makeData('guide-graph', 'graph', { graph: { directed: true, n: 4, edges: [[0, 1], [0, 2], [1, 3], [2, 3]] } }, GRAPH_CODE, steps, null),
  };
}

// ---------------------------------------------------------------------------------- calls
const CALLS_CODE = `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`;

function callsDemo(): GuideDemo {
  const steps: Step[] = [];
  let nextCall = 0;
  const run = (n: number, parent: number | null, depth: number, callerLine?: number): number => {
    const call = nextCall++;
    const b = { call, parent, depth, fn: 'fib', ar: ['n'] };
    steps.push({ ...b, i: 0, ev: 'call', line: 1, locals: { n }, cl: callerLine });
    steps.push({ ...b, i: 0, ev: 'line', line: 2, locals: { n }, x: { k: 'if', s: 'n <= 1', v: n + ' <= 1', o: n <= 1 ? 'T' : 'F' } });
    if (n <= 1) {
      steps.push({ ...b, i: 0, ev: 'return', line: 3, locals: { n }, ret: n, x: { k: 'return', s: String(n) } });
      return n;
    }
    steps.push({ ...b, i: 0, ev: 'line', line: 4, locals: { n }, x: { k: 'return', s: 'fib(' + (n - 1) + ') + fib(' + (n - 2) + ')' } });
    const a = run(n - 1, call, depth + 1, 4);
    const c = run(n - 2, call, depth + 1, 4);
    steps.push({ ...b, i: 0, ev: 'return', line: 4, locals: { n }, ret: a + c, x: { k: 'return', s: 'fib(' + (n - 1) + ') + fib(' + (n - 2) + ')' } });
    return a + c;
  };
  const res = run(3, null, 0);
  return {
    id: 'calls', kind: 'calls', title: 'Call trees: when there is no tree or graph to draw',
    intro: 'Some problems (recursion, backtracking) have no tree or graph in the input. Then the picture is the tree of function calls itself: each box is one call, with its arguments.',
    watch: [
      'A new box appears below its caller each time a function calls itself.',
      'A box turns green and shows "→ value" when that call returns. Read the boxes from the bottom up to see how the answer is built.',
      'The blue box is the call that is running right now.',
      'Boxes for fib(1) and fib(0) are the base cases: they return without calling anything else.',
    ],
    data: makeData('guide-calls', 'calls', {}, CALLS_CODE, steps, res),
  };
}

export function buildGuideDemos(): GuideDemo[] {
  return [treeDemo(), graphDemo(), callsDemo()];
}

