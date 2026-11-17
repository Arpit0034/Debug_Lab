import type { ConceptDetail } from '../../types';

export const topologicalSortDetail: ConceptDetail = {
  id: 'topological-sort',
  overview: {
    essence:
      'Order DAG nodes so every edge points forward. Cycles make this impossible.',
    what:
      'A linear ordering of a directed acyclic graph (DAG) where for every directed edge u → v, u appears before v. Two algorithms: DFS post-order reversed, or Kahn\'s (BFS with in-degree tracking).',
    problemSolved:
      'Dependency resolution: courses (prereqs), build systems, task scheduling, package managers. Any "A must happen before B" relation is a topological ordering.',
    whyImportant:
      'Detects cycles in directed graphs. Foundation for DAG shortest path, longest path in a DAG (which DP on DAG also solves), scheduling, and any dependency graph.',
    usedIn: [
      'Course schedule / prerequisites',
      'Build systems (make, cargo, gradle)',
      'Package managers (npm, pip)',
      'Task scheduling with dependencies',
      'DAG longest/shortest path',
      'Deadlock detection',
    ],
  },
  intuition: {
    explanation:
      'A non-empty DAG has at least one node with in-degree 0 (no prerequisites). Kahn\'s algorithm repeatedly pulls such nodes into the output, decrements their neighbours\' in-degree, and continues. If it cannot consume all nodes, the leftover is a cycle — no order exists. DFS post-order works because post-order records nodes after all their descendants, so reversing it gives the topological order.',
    analogy:
      'Getting dressed in the morning. You must wear socks before shoes, underwear before pants. Topological sort is any valid dressing order. A cycle would mean "socks require shoes and shoes require socks" — impossible.',
  },
  internals: [
    { title: "Kahn's BFS", body: 'Compute in-degree of every node. Queue all in-degree-0 nodes. Pop, append to result, decrement neighbours, queue any that hit 0. If result length < n, there is a cycle.' },
    { title: 'DFS post-order', body: 'DFS from every node. Append node to result after visiting all children. Reverse the result at the end. Cycle detection via "in-progress" marking.' },
    { title: 'Cycle detection', body: "Kahn's: leftover nodes form a cycle. DFS: any edge to an in-progress ancestor is a back edge (cycle)." },
    { title: 'Multiple valid orders', body: 'If more than one node has in-degree 0, there are multiple valid topological orders. Usually any is acceptable.' },
    { title: 'DAG shortest path', body: 'After topo sort, process nodes in that order and relax edges. O(V + E) — faster than Dijkstra when the graph is a DAG.' },
  ],
  visual: {
    diagram:
      'Graph: 0 → 1, 0 → 2, 1 → 3, 2 → 3\n' +
      '\n' +
      'In-degrees: 0:0, 1:1, 2:1, 3:2\n' +
      '\n' +
      "Kahn's trace:\n" +
      '  queue=[0]                     result=[]\n' +
      '  pop 0, append. Decrement 1,2   result=[0], indeg: 1:0, 2:0\n' +
      '  queue=[1,2]                   result=[0]\n' +
      '  pop 1, append. Decrement 3     result=[0,1], indeg 3:1\n' +
      '  pop 2, append. Decrement 3     result=[0,1,2], indeg 3:0\n' +
      '  queue=[3]\n' +
      '  pop 3, append                  result=[0,1,2,3]\n' +
      '\n' +
      'Valid orders: [0,1,2,3], [0,2,1,3].',
    caption: "Kahn's: repeatedly pull in-degree-0 nodes. If any remain, there's a cycle.",
  },
  approach: {
    summary:
      "Kahn's: BFS over in-degree-0 nodes. DFS: post-order then reverse. Both O(V + E). Use Kahn's for cycle detection — leftover nodes indicate a cycle.",
    steps: [
      'Build adjacency list + in-degree array.',
      "Kahn's: queue in-degree-0 nodes; pop, append to order, decrement neighbours, queue those reaching 0.",
      'If processed count < n, there is a cycle.',
      'DFS alternative: DFS each node; append to result on exit; reverse result at end.',
    ],
    template: {
      code:
        "from collections import deque\n\n" +
        'def topo_sort(n, edges):\n' +
        '    adj = [[] for _ in range(n)]\n' +
        '    indeg = [0] * n\n' +
        '    for u, v in edges:\n' +
        '        adj[u].append(v)\n' +
        '        indeg[v] += 1\n' +
        '    q = deque(i for i in range(n) if indeg[i] == 0)\n' +
        '    order = []\n' +
        '    while q:\n' +
        '        u = q.popleft()\n' +
        '        order.append(u)\n' +
        '        for v in adj[u]:\n' +
        '            indeg[v] -= 1\n' +
        '            if indeg[v] == 0: q.append(v)\n' +
        '    return order if len(order) == n else []  # empty = cycle',
      notes: ['The length check is the cycle detection.'],
    },
  },
  code: {
    python: {
      code:
        "from collections import deque\n\n" +
        "def can_finish(numCourses, prerequisites):\n" +
        "    adj = [[] for _ in range(numCourses)]\n" +
        "    indeg = [0] * numCourses\n" +
        "    for a, b in prerequisites:\n" +
        "        adj[b].append(a)  # b must come before a\n" +
        "        indeg[a] += 1\n" +
        "    q = deque(i for i in range(numCourses) if indeg[i] == 0)\n" +
        "    visited = 0\n" +
        "    while q:\n" +
        "        u = q.popleft()\n" +
        "        visited += 1\n" +
        "        for v in adj[u]:\n" +
        "            indeg[v] -= 1\n" +
        "            if indeg[v] == 0:\n" +
        "                q.append(v)\n" +
        "    return visited == numCourses\n\n" +
        "def find_order(numCourses, prerequisites):\n" +
        "    adj = [[] for _ in range(numCourses)]\n" +
        "    indeg = [0] * numCourses\n" +
        "    for a, b in prerequisites:\n" +
        "        adj[b].append(a)\n" +
        "        indeg[a] += 1\n" +
        "    q = deque(i for i in range(numCourses) if indeg[i] == 0)\n" +
        "    order = []\n" +
        "    while q:\n" +
        "        u = q.popleft()\n" +
        "        order.append(u)\n" +
        "        for v in adj[u]:\n" +
        "            indeg[v] -= 1\n" +
        "            if indeg[v] == 0:\n" +
        "                q.append(v)\n" +
        "    return order if len(order) == numCourses else []",
      notes: [
        'LeetCode 207 — Course Schedule. Leftover unprocessed nodes = cycle.',
        'LeetCode 210 — Course Schedule II. [a, b] means b → a, so the edge is added as adj[b].append(a).',
      ],
    },
    java: {
      code:
        "import java.util.*;\n\n" +
        "boolean canFinish(int n, int[][] pre) {\n" +
        "    List<List<Integer>> adj = new ArrayList<>();\n" +
        "    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n" +
        "    int[] indeg = new int[n];\n" +
        "    for (int[] p : pre) {\n" +
        "        adj.get(p[1]).add(p[0]);\n" +
        "        indeg[p[0]]++;\n" +
        "    }\n" +
        "    Deque<Integer> q = new ArrayDeque<>();\n" +
        "    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);\n" +
        "    int visited = 0;\n" +
        "    while (!q.isEmpty()) {\n" +
        "        int u = q.poll();\n" +
        "        visited++;\n" +
        "        for (int v : adj.get(u)) {\n" +
        "            if (--indeg[v] == 0) q.add(v);\n" +
        "        }\n" +
        "    }\n" +
        "    return visited == n;\n" +
        "}\n\n" +
        "int[] findOrder(int n, int[][] pre) {\n" +
        "    List<List<Integer>> adj = new ArrayList<>();\n" +
        "    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n" +
        "    int[] indeg = new int[n];\n" +
        "    for (int[] p : pre) {\n" +
        "        adj.get(p[1]).add(p[0]);\n" +
        "        indeg[p[0]]++;\n" +
        "    }\n" +
        "    Deque<Integer> q = new ArrayDeque<>();\n" +
        "    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);\n" +
        "    int[] order = new int[n];\n" +
        "    int idx = 0;\n" +
        "    while (!q.isEmpty()) {\n" +
        "        int u = q.poll();\n" +
        "        order[idx++] = u;\n" +
        "        for (int v : adj.get(u)) {\n" +
        "            if (--indeg[v] == 0) q.add(v);\n" +
        "        }\n" +
        "    }\n" +
        "    return idx == n ? order : new int[0]; // empty = cycle\n" +
        "}",
      notes: [
        "Kahn's with adjacency list and in-degree array.",
        'The idx == n check is the cycle detection.',
      ],
    },
  },
  complexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    auxiliary: 'O(V + E)',
    total: 'O(V + E) time and space',
    why: [
      { label: 'O(V + E) time', reason: 'Each vertex enters the queue once, each edge is processed once.' },
      { label: 'O(V + E) space', reason: 'Adjacency list is O(V + E). In-degree array is O(V). Queue at most V.' },
      { label: 'Cycle detection is free', reason: "The length check on Kahn's output costs O(1) — no extra pass needed." },
    ],
  },
  dryRun: {
    input: 'n=4, edges=[(0,1),(0,2),(1,3),(2,3)]',
    initialState: 'indeg=[0,1,1,2], queue=[0]',
    steps: [
      { step: '1', state: 'pop 0, output=[0], 1→0, 2→0, queue=[1,2]', note: '0 has no prereqs.' },
      { step: '2', state: 'pop 1, output=[0,1], 3→1, queue=[2]', note: '3 now has 1 remaining.' },
      { step: '3', state: 'pop 2, output=[0,1,2], 3→0, queue=[3]', note: '3 ready.' },
      { step: '4', state: 'pop 3, output=[0,1,2,3]', note: 'All consumed.' },
    ],
    output: '[0, 1, 2, 3] — valid topological order',
  },
  whenToUse: [
    '"A must precede B" relationships.',
    'Course schedule / build systems / package managers.',
    'Cycle detection in directed graphs.',
    'DAG shortest/longest path.',
    'Deadlock detection in resource allocation.',
  ],
  whenNotToUse: [
    'Undirected graph — no topological order concept.',
    'You need shortest path on a general (cyclic) graph — use Dijkstra / BFS.',
    'The problem says "any path" — just DFS.',
  ],
  mistakes: [
    { mistake: 'Forgetting to check "processed count == n" for cycle detection.', fix: "If Kahn's loop exits early, the remaining nodes are in a cycle. Return [] or throw." },
    { mistake: 'Using DFS post-order without reversing.', fix: 'DFS post-order is the reverse of topological order. Reverse before returning.' },
    { mistake: 'Confusing topological order with plain BFS order.', fix: "A plain BFS visiting order can place a node before one of its prerequisites (edges 0→1, 0→2, 1→2: BFS may give [0,2,1]). Only BFS gated by in-degree (Kahn's) guarantees a valid order." },
    { mistake: 'Reversing the edge direction for prerequisite pairs.', fix: 'For [a, b] meaning "b before a", add edge b → a and increment indeg[a], not indeg[b].' },
  ],
  interview: {
    questions: ['Course Schedule / Course Schedule II.', 'Alien Dictionary.', 'Longest Increasing Path in a Matrix.', 'Minimum Height Trees.'],
    observations: ['Kahn\'s BFS is the safest — cycle detection is free.', 'DAG shortest path is O(V + E) after topo sort.', 'Multiple valid orders means any is acceptable unless the problem asks for a specific one.'],
    optimizations: ['For "any valid order", both Kahn\'s and DFS work.', 'For lexicographically smallest order, use a min-heap instead of a queue.'],
    followUps: ['What if there are ties? — min-heap gives lexicographically smallest.', 'What if the graph has multiple components? — enqueue all initial in-degree-0 nodes.'],
  },
  related: [
    { id: 'graphs', relation: 'Topological sort operates on directed graphs' },
    { id: 'bfs', relation: "Kahn's algorithm is BFS gated by in-degree" },
    { id: 'dfs', relation: 'DFS post-order reversed gives the topological order' },
  ],
  practice: [
    { title: 'Course Schedule', difficulty: 'Medium', why: 'Cycle detection in a dependency graph.' },
    { title: 'Course Schedule II', difficulty: 'Medium', why: 'Kahn\'s produces the order directly.' },
    { title: 'Alien Dictionary', difficulty: 'Hard', why: 'Build the graph from adjacent word comparisons, then topo sort.' },
    { title: 'Longest Increasing Path in a Matrix', difficulty: 'Hard', why: 'Topological order on a DAG + DP.' },
  ],
  revision: {
    takeaways: ['Topological sort requires a DAG.', 'Kahn\'s = BFS + in-degree; cycle detection is free.', 'DFS post-order reversed also works.', 'O(V + E) time and space.'],
    formulas: ["Kahn's: queue indeg-0, decrement neighbours, append when indeg hits 0", 'DFS: post-order + reverse'],
    complexitySummary: 'O(V + E) time, O(V + E) space.',
    patterns: ['Dependencies', 'Cycle detection in directed graph', 'DAG shortest path'],
    memoryTrick: 'In-degree-0 first, then its neighbours. Leftover = cycle.',
  },
};
