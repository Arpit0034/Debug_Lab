import type { ConceptDetail } from '../../types';

export const graphsDetail: ConceptDetail = {
  id: 'graphs',
  overview: {
    essence:
      'BFS explores breadth (shortest unweighted path). DFS explores depth (connectivity, cycles, topo). The traversal determines which answer you get.',
    what:
      'Vertices plus edges. Trees are graphs with no cycles and exactly one root. Every tree problem is a graph problem.',
    problemSolved:
      'Model any relationship: connectivity, shortest path, cycles, dependency order, matching.',
    whyImportant:
      'The widest interview category. BFS/DFS plus representation choice plus three extra algorithms (Dijkstra, topo sort, union-find) cover 95 percent of graph problems.',
    usedIn: [
      'Shortest path',
      'Connectivity / components',
      'Cycle detection',
      'Topological sort',
      'Bipartite check',
      'Network flow',
      'Social network analysis',
    ],
  },
  intuition: {
    explanation:
      'A tree has exactly one path between any two nodes. A graph can have many. BFS explores level by level, so the first time you touch a node is the shortest hop count. DFS dives deep until stuck, so it finds connectivity and structure without caring about distance.',
    analogy:
      'Cities and roads. BFS is a ripple in a pond (spreads evenly). DFS is one car driving until a dead end.',
  },
  internals: [
    { title: 'Adjacency list', body: 'Each node maps to a list of neighbors. O(V + E) space — best for sparse graphs.' },
    { title: 'Adjacency matrix', body: 'V times V matrix. O(1) edge lookup, O(V squared) space. Use for dense graphs or very small V.' },
    { title: 'Edge list', body: 'List of (u, v) pairs. O(E) space. Good for union-find / Kruskal.' },
    { title: 'Visited set', body: 'Essential — prevents infinite loops on any cycle.' },
    { title: 'Directed vs undirected', body: 'Undirected adds both (u,v) and (v,u). Directed adds only one.' },
  ],
  visual: {
    vizId: 'graph-bfs',
    caption: 'BFS from source. Watch the queue process level by level.',
  },
  approach: {
    summary:
      'Build adjacency list. Pick BFS (queue) or DFS (stack / recursion) based on the question. Track visited. Loop over all nodes for disconnected graphs.',
    steps: [
      'Build adj = node to list of neighbors.',
      'Pick BFS (shortest path) or DFS (connectivity).',
      'Use visited set. Queue for BFS, stack / recursion for DFS.',
      'Loop over all nodes for disconnected graphs.',
    ],
    template: {
      code:
        'def bfs(source):\n' +
        '    visited = {source}\n' +
        '    q = deque([source])\n' +
        '    while q:\n' +
        '        u = q.popleft()\n' +
        '        for v in adj[u]:\n' +
        '            if v not in visited:\n' +
        '                visited.add(v)\n' +
        '                q.append(v)',
    },
  },
  code: {
    python: {
      code:
        'from collections import deque\n\n' +
        'def bfs(adj, s):\n' +
        '    visited = {s}\n' +
        '    q = deque([s])\n' +
        '    dist = {s: 0}\n' +
        '    while q:\n' +
        '        u = q.popleft()\n' +
        '        for v in adj[u]:\n' +
        '            if v not in visited:\n' +
        '                visited.add(v)\n' +
        '                dist[v] = dist[u] + 1\n' +
        '                q.append(v)\n' +
        '    return dist\n\n' +
        'def dfs(adj, s, visited=None):\n' +
        '    if visited is None: visited = set()\n' +
        '    visited.add(s)\n' +
        '    for v in adj[s]:\n' +
        '        if v not in visited:\n' +
        '            dfs(adj, v, visited)\n' +
        '    return visited',
      notes: ['BFS: queue, shortest unweighted. DFS: recursion, connectivity.'],
    },
    java: {
      code:
        'Map<Integer, List<Integer>> adj = new HashMap<>();\n\n' +
        'Map<Integer, Integer> bfs(int s) {\n' +
        '    Map<Integer, Integer> dist = new HashMap<>();\n' +
        '    dist.put(s, 0);\n' +
        '    Deque<Integer> q = new ArrayDeque<>();\n' +
        '    q.add(s);\n' +
        '    while (!q.isEmpty()) {\n' +
        '        int u = q.poll();\n' +
        '        for (int v : adj.getOrDefault(u, List.of())) {\n' +
        '            if (!dist.containsKey(v)) {\n' +
        '                dist.put(v, dist.get(u) + 1);\n' +
        '                q.add(v);\n' +
        '            }\n' +
        '        }\n' +
        '    }\n' +
        '    return dist;\n' +
        '}',
      notes: ['ArrayDeque for queue. dist map doubles as visited.'],
    },
    cpp: {
      code:
        '#include <vector>\n' +
        '#include <queue>\n' +
        '#include <unordered_map>\n\n' +
        'std::unordered_map<int,int> bfs(std::unordered_map<int, std::vector<int>>& adj, int s) {\n' +
        '    std::unordered_map<int,int> dist;\n' +
        '    dist[s] = 0;\n' +
        '    std::queue<int> q;\n' +
        '    q.push(s);\n' +
        '    while (!q.empty()) {\n' +
        '        int u = q.front(); q.pop();\n' +
        '        for (int v : adj[u]) {\n' +
        '            if (!dist.count(v)) {\n' +
        '                dist[v] = dist[u] + 1;\n' +
        '                q.push(v);\n' +
        '            }\n' +
        '        }\n' +
        '    }\n' +
        '    return dist;\n' +
        '}',
      notes: ['std::queue for BFS, std::stack for iterative DFS.'],
    },
  },
  complexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    auxiliary: 'O(V) visited plus O(V) queue/stack',
    total: 'O(V + E) time, O(V) space',
    why: [
      { label: 'O(V + E) time', reason: 'Each vertex is enqueued / visited at most once. Each edge examined at most once per endpoint.' },
      { label: 'O(V) space', reason: 'Visited set holds one entry per vertex. Queue at most V elements.' },
      { label: 'Adjacency list vs matrix', reason: 'List: O(V + E) build. Matrix: O(V squared) build, but O(1) edge check.' },
    ],
  },
  dryRun: {
    input: 'Graph: 0-1, 0-2, 1-3, 2-3. BFS from 0.',
    initialState: 'visited = {0}, queue = [0], dist = {0: 0}',
    steps: [
      { step: '1', state: 'pop 0. Neighbors 1, 2 not visited. dist = {0:0, 1:1, 2:1}', note: 'Level 1 completed.' },
      { step: '2', state: 'pop 1. Neighbor 3 not visited. dist[3] = 2. queue = [2, 3]', note: 'Level 2 via 1.' },
      { step: '3', state: 'pop 2. Neighbor 3 already visited. queue = [3]', note: 'No new nodes.' },
      { step: '4', state: 'pop 3. No unvisited. queue = []', note: 'Done.' },
    ],
    output: 'dist = {0:0, 1:1, 2:1, 3:2}',
  },
  whenToUse: [
    'Shortest unweighted path — BFS.',
    'Connectivity, components — DFS or BFS.',
    'Cycle detection — DFS with back-edge.',
    'Topological sort — DFS post-order or Kahn.',
    'Bipartite — BFS / DFS with 2-coloring.',
  ],
  whenNotToUse: [
    'Shortest path with weights — Dijkstra, not BFS.',
    'Dense graph with V less than 1000 — matrix might be simpler.',
    'Negatively weighted — Bellman-Ford.',
  ],
  mistakes: [
    { mistake: 'Missing visited set — infinite loop on cycles.', fix: 'Every traversal needs visited. Add on enqueue, not dequeue, for BFS.' },
    { mistake: 'Using BFS for weighted shortest path.', fix: 'BFS finds shortest by hop count. Use Dijkstra for weights.' },
    { mistake: 'Only traversing from node 0 in a disconnected graph.', fix: 'Loop over all nodes: for v in range(n): if v not in visited: traverse(v).' },
    { mistake: 'Adding to visited on dequeue (BFS) — nodes can be queued twice.', fix: 'Mark on enqueue.' },
  ],
  interview: {
    questions: [
      'Number of islands.',
      'Course schedule (topological sort).',
      'Clone a graph.',
      'Word ladder (BFS shortest transformation).',
      'Is graph bipartite?',
      'Shortest path in an unweighted grid.',
    ],
    observations: [
      'Grid problems are graph problems — each cell is a vertex, neighbors are up/down/left/right.',
      'Topological sort handles dependency ordering.',
      'Dijkstra is BFS with a priority queue.',
    ],
    optimizations: [
      'Union-find for connected components without full traversal.',
      'Bidirectional BFS halves the search space for shortest path.',
      'A-star for weighted shortest path with heuristics.',
    ],
    followUps: [
      'What if weights can be negative? — Bellman-Ford.',
      'What if the graph is huge? — external or streaming algorithms.',
      'What if you need all shortest paths? — BFS plus backtracking.',
    ],
  },
  related: [
    { id: 'trees', relation: 'Trees are connected acyclic graphs' },
    { id: 'stacks-queues', relation: 'BFS uses queue, DFS uses stack' },
    { id: 'union-find', relation: 'Alternative to BFS/DFS for connectivity' },
    { id: 'topological-sort', relation: 'Topological sort is BFS or DFS on a DAG' },
    { id: 'dijkstra', relation: 'Dijkstra extends BFS with weighted edges' },
    { id: 'strongly-connected-components', relation: 'SCC is a structural decomposition of directed graphs' },
  ],
  practice: [
    { title: 'Number of Islands', difficulty: 'Medium', why: 'Grid graph plus DFS/BFS connected components.' },
    { title: 'Clone Graph', difficulty: 'Medium', why: 'DFS with hash map of clones.' },
    { title: 'Course Schedule', difficulty: 'Medium', why: 'Cycle detection via topological sort.' },
    { title: 'Word Ladder', difficulty: 'Hard', why: 'BFS on implicit graph (word to next word).' },
    { title: 'Rotting Oranges', difficulty: 'Medium', why: 'Multi-source BFS — a super-source joins all starting cells.' },
  ],
  revision: {
    takeaways: [
      'BFS equals shortest unweighted, queue. DFS equals connectivity, stack or recursion.',
      'Visited set is essential — mark on enqueue (BFS) or entry (DFS).',
      'Adjacency list is almost always right.',
      'O(V + E) time for both.',
    ],
    formulas: [
      'BFS: queue + dist[v] = dist[u] + 1',
      'DFS: recursion + visited on entry',
      'Components: outer loop over all nodes',
    ],
    complexitySummary: 'O(V + E) time, O(V) space for both BFS and DFS.',
    patterns: ['Shortest unweighted', 'Connected components', 'Cycle detection', 'Topological sort', 'Bipartite check'],
    memoryTrick: 'BFS equals ripple (shortest). DFS equals one car (deep). Both O(V+E).',
  },
};
