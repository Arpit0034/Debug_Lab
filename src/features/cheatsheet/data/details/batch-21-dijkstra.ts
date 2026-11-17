import type { ConceptDetail } from "../../types";

export const dijkstraDetail: ConceptDetail = {
  id: "dijkstra",
  overview: {
    essence:
      "Shortest path on non-negative weighted graphs: pop smallest distance, relax edges. O((V+E) log V) with heap.",
    what: "Single-source shortest path for graphs with non-negative edge weights. Greedy: repeatedly settle the unsettled node with the smallest known distance.",
    problemSolved:
      "BFS handles unweighted graphs. For weighted graphs with non-negative weights, Dijkstra extends BFS by using a min-heap keyed on cumulative distance.",
    whyImportant:
      "The workhorse of weighted shortest path. Routing, GPS, network latency, flight pricing — everywhere edges have costs. Fails silently with negative weights (use Bellman-Ford).",
    usedIn: [
      "Shortest path in road networks",
      "Network routing / latency",
      "Flight pricing (cheapest path)",
      "Minimum effort path on grids",
      "A* search (Dijkstra + heuristic)",
      "Prim's MST (structurally similar)",
    ],
  },
  intuition: {
    explanation:
      'BFS assumes every edge costs the same and expands by hop count. Dijkstra relaxes this: use a priority queue ordered by cumulative distance. Pop the closest unsettled node — its distance is final. Relax all its outgoing edges; push improved distances back into the heap. Non-negative weights are essential: the greedy "smallest unsettled = final" only holds when no path through a larger distance can later beat it.',
    analogy:
      'You are at a source city, and every road has a toll. You keep an "I can reach X for cost D" ledger. Repeatedly, the cheapest unconfirmed destination becomes confirmed. Its neighbours update the ledger. Negative tolls would break this — a path through an expensive city could refund money.',
  },
  internals: [
    {
      title: "dist array",
      body: "dist[v] = best known distance from source. Initialize dist[src]=0, all others = ∞.",
    },
    {
      title: "Min-heap of (distance, node)",
      body: "Start with (0, source). Pop smallest; that node is now settled.",
    },
    {
      title: "Relaxation",
      body: "For each neighbour v of u: new_d = dist[u] + w(u,v). If new_d < dist[v], update dist[v] and push (new_d, v) to the heap.",
    },
    {
      title: "Stale entries",
      body: "The heap may contain multiple entries for the same node. Skip if the popped distance > dist[node] (already settled better).",
    },
    {
      title: "Why non-negative weights",
      body: 'Dijkstra\'s greedy "pop = settled" proof depends on no negative edge. A negative edge could later create a shorter path to an already-settled node.',
    },
    {
      title: "Negative weights → Bellman-Ford",
      body: "Bellman-Ford relaxes all edges V-1 times. Slower (O(VE)) but handles negative edges and detects negative cycles.",
    },
  ],
  visual: {
    vizId: "graph-dijkstra",
    caption: "Watch the min-heap settle nodes by increasing distance.",
  },
  approach: {
    summary:
      "Initialize dist. Min-heap with (0, src). Pop smallest, mark settled, relax neighbours. Skip stale pops. Return dist.",
    steps: [
      "dist[src] = 0, all others ∞. Heap = [(0, src)].",
      "While heap not empty: pop (d, u). If d > dist[u], skip (stale).",
      "For each (v, w) in adj[u]: if dist[u] + w < dist[v], update dist[v] and push (dist[v], v).",
      "Return dist.",
    ],
    template: {
      code:
        "import heapq\n\n" +
        "def dijkstra(n, adj, src):\n" +
        '    dist = [float("inf")] * n\n' +
        "    dist[src] = 0\n" +
        "    heap = [(0, src)]\n" +
        "    while heap:\n" +
        "        d, u = heapq.heappop(heap)\n" +
        "        if d > dist[u]: continue\n" +
        "        for v, w in adj[u]:\n" +
        "            if d + w < dist[v]:\n" +
        "                dist[v] = d + w\n" +
        "                heapq.heappush(heap, (dist[v], v))\n" +
        "    return dist",
      notes: ["Skip stale entries: d > dist[u]."],
    },
  },
  code: {
    python: {
      code:
        "import heapq\n" +
        "from collections import defaultdict\n\n" +
        "def network_delay_time(times, n, k):\n" +
        "    adj = defaultdict(list)\n" +
        "    for u, v, w in times:\n" +
        "        adj[u].append((v, w))\n" +
        '    dist = {i: float("inf") for i in range(1, n+1)}\n' +
        "    dist[k] = 0\n" +
        "    heap = [(0, k)]\n" +
        "    while heap:\n" +
        "        d, u = heapq.heappop(heap)\n" +
        "        if d > dist[u]: continue\n" +
        "        for v, w in adj[u]:\n" +
        "            if d + w < dist[v]:\n" +
        "                dist[v] = d + w\n" +
        "                heapq.heappush(heap, (dist[v], v))\n" +
        "    ans = max(dist.values())\n" +
        '    return ans if ans < float("inf") else -1',
      notes: ["LeetCode 743 — Network Delay Time."],
    },
    java: {
      code:
        "int networkDelayTime(int[][] times, int n, int k) {\n" +
        "    Map<Integer, List<int[]>> adj = new HashMap<>();\n" +
        "    for (int[] t : times) {\n" +
        "        adj.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{t[1], t[2]});\n" +
        "    }\n" +
        "    int[] dist = new int[n+1];\n" +
        "    java.util.Arrays.fill(dist, Integer.MAX_VALUE);\n" +
        "    dist[k] = 0;\n" +
        "    java.util.PriorityQueue<int[]> pq = new java.util.PriorityQueue<>((a, b) -> a[0] - b[0]);\n" +
        "    pq.add(new int[]{0, k});\n" +
        "    while (!pq.isEmpty()) {\n" +
        "        int[] cur = pq.poll();\n" +
        "        int d = cur[0], u = cur[1];\n" +
        "        if (d > dist[u]) continue;\n" +
        "        for (int[] e : adj.getOrDefault(u, List.of())) {\n" +
        "            if (d + e[1] < dist[e[0]]) {\n" +
        "                dist[e[0]] = d + e[1];\n" +
        "                pq.add(new int[]{dist[e[0]], e[0]});\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "    int ans = 0;\n" +
        "    for (int i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);\n" +
        "    return ans == Integer.MAX_VALUE ? -1 : ans;\n" +
        "}",
      notes: ["PriorityQueue of (distance, node) int[]."],
    },
  },
  complexity: {
    best: "O((V + E) log V)",
    average: "O((V + E) log V)",
    worst: "O((V + E) log V)",
    auxiliary: "O(V + E)",
    total: "O((V + E) log V) with binary heap; O(V² ) with array-only",
    why: [
      {
        label: "O(E) relaxations",
        reason:
          "Each edge is relaxed at most once (when its source is settled).",
      },
      {
        label: "O(log V) per heap op",
        reason:
          "Binary heap push and pop are O(log V). Total heap operations = O(E).",
      },
      {
        label: "Stale entries",
        reason:
          "Worst case, each edge improvement pushes a new entry. Heap size grows to O(E), not V.",
      },
      {
        label: "Why not O(V²)",
        reason:
          "Array implementation is O(V²) — worse than heap for sparse graphs. Heap wins for E << V².",
      },
    ],
  },
  dryRun: {
    input: "Graph: 0→1 (4), 0→2 (1), 1→2 (2), 1→3 (5), 2→3 (8); source = 0",
    initialState: "dist = [0, ∞, ∞, ∞], heap = [(0, 0)]",
    steps: [
      {
        step: "1",
        state: "pop (0, 0). Relax: 1→4, 2→1. heap=[(1,2),(4,1)]",
        note: "",
      },
      {
        step: "2",
        state: "pop (1, 2). Relax: 3→9. heap=[(4,1),(9,3)]",
        note: "",
      },
      {
        step: "3",
        state: "pop (4, 1). Relax: 2→6 (worse, skip), 3→9 (skip). heap=[(9,3)]",
        note: "",
      },
      { step: "4", state: "pop (9, 3). No outgoing.", note: "" },
    ],
    output: "dist = [0, 4, 1, 9]",
  },
  whenToUse: [
    "Weighted shortest path from a single source.",
    "All edge weights non-negative.",
    "You need distances to all reachable nodes, or just one target (early-exit).",
    "Grid problems with weighted cells (minimum effort path).",
  ],
  whenNotToUse: [
    "Negative edge weights — use Bellman-Ford.",
    "Unweighted graph — plain BFS is O(V + E).",
    "You need all-pairs — Floyd-Warshall (small V) or run Dijkstra from each source.",
    "DAG — topological sort + DP is O(V + E), faster than Dijkstra.",
  ],
  mistakes: [
    {
      mistake: "Using Dijkstra with negative weights.",
      fix: "It silently returns wrong answers. Detect with a pre-scan for negative weights; use Bellman-Ford.",
    },
    {
      mistake: "Forgetting to skip stale heap entries.",
      fix: "If popped distance > dist[node], continue. Otherwise you reprocess settled nodes, degrading performance significantly.",
    },
    {
      mistake: "Using Dijkstra on an unweighted graph.",
      fix: "BFS is O(V + E) — no heap overhead. Dijkstra still works but is slower.",
    },
    {
      mistake: "Returning max(dist) without the unreachable check.",
      fix: "dist may contain ∞. Check or the answer is wrong.",
    },
  ],
  interview: {
    questions: [
      "Network Delay Time.",
      "Path With Minimum Effort (grid).",
      "Swim in Rising Water.",
      "Cheapest Flights Within K Stops (variant: Dijkstra on state).",
      "Path with Maximum Probability.",
    ],
    observations: [
      "Dijkstra with a heap is O((V + E) log V).",
      'For "cheapest with K stops", include K in the state — Dijkstra on (node, stops).',
      "Grid Dijkstra: state = cell, edge = abs-difference in heights.",
    ],
    optimizations: [
      "Early exit when the target is popped — saves settling the whole graph.",
      "Bidirectional Dijkstra for one target.",
      "A* adds a heuristic to focus the search.",
    ],
    followUps: [
      "What if weights can be negative? — Bellman-Ford.",
      "What if you only need one target? — early exit; bidirectional helps further.",
    ],
  },
  related: [
    {
      id: "union-find",
      relation: "Prim's MST (similar structure) uses union-find or heap",
    },
  ],
  practice: [
    {
      title: "Network Delay Time",
      difficulty: "Medium",
      why: "Canonical single-source Dijkstra.",
    },
    {
      title: "Path With Minimum Effort",
      difficulty: "Medium",
      why: "Dijkstra on grid cells — edge weight = |height difference|.",
    },
    {
      title: "Cheapest Flights Within K Stops",
      difficulty: "Medium",
      why: "Dijkstra on (node, stops_remaining) — a variant.",
    },
    {
      title: "Swim in Rising Water",
      difficulty: "Hard",
      why: "Minimize the max-weight along path — Dijkstra with max-of-path tracking.",
    },
  ],
  revision: {
    takeaways: [
      "Dijkstra: greedy on cumulative distance with a min-heap.",
      "O((V + E) log V) with a binary heap.",
      "Non-negative weights required.",
      "Skip stale heap entries.",
    ],
    formulas: [
      "relax: dist[v] = min(dist[v], dist[u] + w)",
      "pop the smallest — it is settled.",
    ],
    complexitySummary: "O((V + E) log V) time, O(V) space.",
    patterns: [
      "Single-source weighted",
      "Grid path with cost",
      "K-stops variant",
      "State-space Dijkstra",
    ],
    memoryTrick:
      "BFS + heap. Smallest unsettled becomes settled. Negative weights break the proof.",
  },
};
