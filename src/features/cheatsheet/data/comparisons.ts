export interface ComparisonDimension {
  label: string;
  left: string;
  right: string;
}

export interface ComparisonPair {
  id: string;
  title: string;
  leftId: string;
  rightId: string;
  leftTitle: string;
  rightTitle: string;
  dimensions: ComparisonDimension[];
  verdict: string;
}

export const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    id: 'bfs-vs-dfs',
    title: 'BFS vs DFS',
    leftId: 'graph-bfs',
    rightId: 'graph-dfs',
    leftTitle: 'BFS',
    rightTitle: 'DFS',
    dimensions: [
      { label: 'Core idea', left: 'Queue, explore level by level', right: 'Stack/recursion, dive deep' },
      { label: 'Time', left: 'O(V + E)', right: 'O(V + E)' },
      { label: 'Space', left: 'O(V) — queue width', right: 'O(V) — depth' },
      { label: 'Shortest unweighted path', left: '✓ Yes', right: '✗ No' },
      { label: 'Cycle detection', left: '✓ Yes', right: '✓ Yes' },
      { label: 'Topological sort', left: "Kahn's (queue-based)", right: 'DFS post-order' },
      { label: 'Choose it when', left: 'Shortest path, level-order', right: 'Connectivity, cycles, topo' },
    ],
    verdict: 'BFS for shortest unweighted paths and levels. DFS for connectivity, cycles, and topological order.',
  },
  {
    id: 'array-vs-linked-list',
    title: 'Array vs Linked List',
    leftId: 'arrays',
    rightId: 'linked-lists',
    leftTitle: 'Array',
    rightTitle: 'Linked List',
    dimensions: [
      { label: 'Access by index', left: 'O(1)', right: 'O(n)' },
      { label: 'Search', left: 'O(n)', right: 'O(n)' },
      { label: 'Insert at head', left: 'O(n) (shift)', right: 'O(1)' },
      { label: 'Insert given node', left: 'O(n) (shift)', right: 'O(1)' },
      { label: 'Memory', left: 'Contiguous, cache-friendly', right: 'Scattered, pointer overhead' },
      { label: 'Choose it when', left: 'Random access dominates', right: 'Insert/delete dominates' },
    ],
    verdict: 'Arrays for indexing and cache locality. Linked lists for pointer surgery and insert-heavy workloads.',
  },
  {
    id: 'stack-vs-queue',
    title: 'Stack vs Queue',
    leftId: 'stacks-queues',
    rightId: 'stacks-queues',
    leftTitle: 'Stack',
    rightTitle: 'Queue',
    dimensions: [
      { label: 'Order', left: 'LIFO — last in, first out', right: 'FIFO — first in, first out' },
      { label: 'Push/pop', left: 'O(1) at top', right: 'O(1) at head + tail' },
      { label: 'Use for', left: 'Nesting, undo, DFS', right: 'BFS, level-order, scheduling' },
      { label: 'Python', left: 'list (append/pop)', right: 'collections.deque' },
      { label: 'Java', left: 'ArrayDeque (or Stack)', right: 'ArrayDeque' },
      { label: 'Choose it when', left: 'You need most-recent first', right: 'You need oldest first' },
    ],
    verdict: 'LIFO for nesting. FIFO for breadth. Both O(1) per operation at the right end.',
  },
  {
    id: 'merge-vs-quick',
    title: 'Merge Sort vs Quick Sort',
    leftId: 'sorting',
    rightId: 'sorting',
    leftTitle: 'Merge Sort',
    rightTitle: 'Quick Sort',
    dimensions: [
      { label: 'Time (avg)', left: 'O(n log n)', right: 'O(n log n)' },
      { label: 'Time (worst)', left: 'O(n log n)', right: 'O(n²)' },
      { label: 'Space', left: 'O(n) — extra arrays', right: 'O(log n) — recursion only' },
      { label: 'Stable', left: '✓ Yes', right: '✗ No' },
      { label: 'In-place', left: '✗ No', right: '✓ Yes' },
      { label: 'Predictable', left: '✓ Always n log n', right: '✗ Worst case on sorted input' },
      { label: 'Choose it when', left: 'Stability or worst-case bound matters', right: 'In-place + fast average' },
    ],
    verdict: 'Merge for stability and predictable O(n log n). Quick for in-place average speed. Use built-in sort.',
  },
  {
    id: 'recursion-vs-iteration',
    title: 'Recursion vs Iteration',
    leftId: 'recursion',
    rightId: 'arrays',
    leftTitle: 'Recursion',
    rightTitle: 'Iteration',
    dimensions: [
      { label: 'Shape', left: 'Calls itself on smaller input', right: 'Loop with state' },
      { label: 'Space', left: 'O(depth) — call stack', right: 'O(1) or O(k) — explicit' },
      { label: 'Readability', left: 'Matches tree/graph structure', right: 'Matches linear structure' },
      { label: 'Stack overflow', left: '⚠ Risk on deep inputs', right: '✗ None' },
      { label: 'Memoization', left: 'Natural fit — add cache', right: 'Requires manual cache' },
      { label: 'Choose it when', left: 'The problem *is* recursive', right: 'The problem is linear' },
    ],
    verdict: 'Recursion matches tree/graph structure. Iteration is safer for linear problems and deep inputs.',
  },
  {
    id: 'greedy-vs-dp',
    title: 'Greedy vs Dynamic Programming',
    leftId: 'dynamic-programming',
    rightId: 'dynamic-programming',
    leftTitle: 'Greedy',
    rightTitle: 'DP',
    dimensions: [
      { label: 'Idea', left: 'Pick the locally best choice now', right: 'Solve all subproblems, combine' },
      { label: 'Correctness', left: 'Needs proof of local optimality', right: 'Proven by optimal substructure' },
      { label: 'Time', left: 'Often O(n log n) or O(n)', right: 'O(n × states)' },
      { label: 'Space', left: 'Usually O(1) or O(n)', right: 'O(states)' },
      { label: 'Fails when', left: 'Local choice blocks a better global path', right: "Subproblems don't overlap" },
      { label: 'Choose it when', left: 'Exchange argument works', right: 'Overlapping subproblems + optimal substructure' },
    ],
    verdict: 'Greedy when the local choice provably leads to a global optimum. DP when subproblems overlap.',
  },
  {
    id: 'memo-vs-tab',
    title: 'Memoization vs Tabulation',
    leftId: 'dynamic-programming',
    rightId: 'dynamic-programming',
    leftTitle: 'Memoization (top-down)',
    rightTitle: 'Tabulation (bottom-up)',
    dimensions: [
      { label: 'Form', left: 'Recursion + hash map', right: 'Array/table filled bottom-up' },
      { label: 'Space', left: 'O(states) + call stack', right: 'O(states)' },
      { label: 'Order', left: 'Demand-driven', right: 'Explicit' },
      { label: 'Partial states', left: 'Only computes what\'s asked', right: 'Computes everything' },
      { label: 'Stack overflow', left: '⚠ Risk on deep recursion', right: '✗ None' },
      { label: 'Choose it when', left: 'Natural recurrence, partial exploration', right: 'Iterative order, no recursion' },
    ],
    verdict: 'Memoization for natural recurrences with sparse states. Tabulation for tight loops and deep states.',
  },
  {
    id: 'hash-vs-bst',
    title: 'Hash Map vs BST',
    leftId: 'hash-maps',
    rightId: 'trees',
    leftTitle: 'Hash Map',
    rightTitle: 'BST',
    dimensions: [
      { label: 'Average lookup', left: 'O(1)', right: 'O(log n) — balanced' },
      { label: 'Worst lookup', left: 'O(n) — collisions', right: 'O(n) — skewed' },
      { label: 'Ordered iteration', left: '✗ No (unordered)', right: '✓ Yes — in-order = sorted' },
      { label: 'Range query', left: '✗ No', right: '✓ Yes' },
      { label: 'Min / max', left: '✗ O(n)', right: '✓ O(log n)' },
      { label: 'Choose it when', left: 'Lookup dominates, no ordering needed', right: 'Range queries, ordered iteration' },
    ],
    verdict: 'Hash map for constant-time lookup with no ordering. BST when you need ordered iteration or range queries.',
  },
  {
    id: 'dijkstra-vs-bellman',
    title: 'Dijkstra vs Bellman-Ford',
    leftId: 'graphs',
    rightId: 'graphs',
    leftTitle: 'Dijkstra',
    rightTitle: 'Bellman-Ford',
    dimensions: [
      { label: 'Time', left: 'O((V+E) log V)', right: 'O(VE)' },
      { label: 'Negative edges', left: '✗ Fails silently', right: '✓ Handles them' },
      { label: 'Negative cycles', left: '✗ No detection', right: '✓ Detects them' },
      { label: 'Data structure', left: 'Min-heap', right: 'Simple array' },
      { label: 'Choose it when', left: 'All weights ≥ 0, faster needed', right: 'Negative edges or negative-cycle detection' },
    ],
    verdict: 'Dijkstra for non-negative weights and speed. Bellman-Ford for negative edges or cycle detection.',
  },
  {
    id: 'kruskal-vs-prim',
    title: 'Kruskal vs Prim',
    leftId: 'graphs',
    rightId: 'graphs',
    leftTitle: 'Kruskal',
    rightTitle: 'Prim',
    dimensions: [
      { label: 'Approach', left: 'Sort edges, union-find to skip cycles', right: 'Grow a tree from a start node' },
      { label: 'Time', left: 'O(E log E)', right: 'O((V+E) log V) — heap' },
      { label: 'Data structure', left: 'DSU + sorted edges', right: 'Priority queue' },
      { label: 'Best for', left: 'Sparse graphs, edge lists', right: 'Dense graphs, adjacency' },
      { label: 'Parallelizable', left: 'Easier', right: 'Harder' },
      { label: 'Choose it when', left: 'Sparse graph, need to filter edges', right: 'Dense graph, adjacency list' },
    ],
    verdict: 'Kruskal for sparse graphs with edge lists. Prim for dense graphs with adjacency.',
  },
];
