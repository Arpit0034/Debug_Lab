import type { ConceptDetail } from "../../types";

export const bellmanFordDetail: ConceptDetail = {
  id: "bellman-ford",
  overview: {
    essence:
      "Shortest path with negative weights. Relax all edges V-1 times. V-th pass detects negative cycles.",
    what: "Single-source shortest path algorithm that handles negative edge weights, unlike Dijkstra. Detects negative cycles as a bonus.",
    problemSolved:
      "Dijkstra fails silently with negative edges. Bellman-Ford works: it relaxes all E edges V-1 times, guaranteeing shortest paths since any shortest path uses at most V-1 edges.",
    whyImportant:
      "The fallback whenever negative weights appear. Also detects negative cycles, and its DP formulation (dp[k][v] = shortest path using at most k edges) is a classic teaching example.",
    usedIn: [
      "Currency arbitrage detection (negative cycles)",
      "Distance-vector routing protocols (RIP)",
      "Any shortest path with possible negative weights",
      "Constraint satisfaction / difference constraints",
    ],
  },
  intuition: {
    explanation:
      "Any simple path in a graph uses at most V-1 edges (more would revisit a vertex = cycle). Bellman-Ford relaxes all edges V-1 times. After pass k, dist[v] is the shortest path from source to v using at most k edges. After V-1 passes, every vertex has its true shortest distance (if no negative cycle). One more pass detects negative cycles: if any edge can still be relaxed, a negative cycle exists. Total: O(VE).",
    analogy:
      "Rippling news through a network. Each round, every edge passes its current best-info to its neighbours. After V-1 rounds, every vertex has heard the best possible news. One more round: if some vertex still gets new info, the network has a loop that keeps improving (a negative cycle).",
  },
  internals: [
    {
      title: "Relaxation",
      body: "relax(u, v, w): if dist[u] + w < dist[v], update dist[v] = dist[u] + w.",
    },
    {
      title: "V-1 passes",
      body: "Loop V-1 times. In each pass, relax every edge. After pass k, distances are exact for paths with ≤ k edges.",
    },
    {
      title: "Negative cycle detection",
      body: "Do one more pass. If any edge can still be relaxed, a negative cycle is reachable from the source.",
    },
    {
      title: "Why V-1",
      body: "Simple paths (no cycles) have at most V-1 edges. Negative cycles would keep improving forever; positive cycles never help.",
    },
    {
      title: "DP formulation",
      body: "dp[k][v] = min over all edges (u, v) of dp[k-1][u] + w(u, v). Standard recurrence; Bellman-Ford is the space-optimized version.",
    },
    {
      title: "Early termination",
      body: "If a pass makes no changes, no further passes will help — exit early. Common optimization.",
    },
  ],
  visual: {
    diagram:
      "Graph: 0→1 (6), 0→2 (7), 1→2 (8), 1→3 (5), 1→4 (-4), 2→3 (-3), 2→4 (9), 3→1 (-2), 4→0 (2), 4→3 (7)\n\n" +
      "dist init: [0, ∞, ∞, ∞, ∞]\n\n" +
      "Pass 1 (all edges once):\n" +
      "  0→1: 6, 0→2: 7, 2→3: 4 (7-3), 1→4: 2 (6-4)\n" +
      "  dist = [0, 6, 7, 4, 2]\n\n" +
      "Pass 2:\n" +
      "  3→1: 4 + (-2) = 2 < 6 → dist[1] = 2\n" +
      "  dist = [0, 2, 7, 4, 2]\n\n" +
      "Pass 3:\n" +
      "  1→4: 2 + (-4) = -2 < 2 → dist[4] = -2\n" +
      "  dist = [0, 2, 7, 4, -2]\n\n" +
      "Pass 4: no changes\n" +
      "Pass 5 (V-th, cycle check): no change → no negative cycle.\n\n" +
      "Final distances: [0, 2, 7, 4, -2]",
    caption:
      "V-1 passes for shortest paths, one more for negative-cycle detection.",
  },
  approach: {
    summary:
      "Initialize dist[src]=0, others=∞. Repeat V-1 times: relax every edge. After, do one more pass to detect negative cycles. O(VE).",
    steps: [
      "dist[src] = 0, all others = INF.",
      "For pass in 1..V-1: for each (u, v, w): if dist[u] + w < dist[v]: dist[v] = dist[u] + w.",
      "Optionally track if any update happened — exit if not.",
      "Final pass: if any update can still be made, return 'negative cycle'.",
      "Return dist.",
    ],
    template: {
      code:
        "def bellman_ford(n, edges, src):\n" +
        "    INF = float('inf')\n" +
        "    dist = [INF] * n\n" +
        "    dist[src] = 0\n" +
        "    for _ in range(n - 1):\n" +
        "        updated = False\n" +
        "        for u, v, w in edges:\n" +
        "            if dist[u] + w < dist[v]:\n" +
        "                dist[v] = dist[u] + w\n" +
        "                updated = True\n" +
        "        if not updated:\n" +
        "            break\n" +
        "    # Detect negative cycle\n" +
        "    for u, v, w in edges:\n" +
        "        if dist[u] + w < dist[v]:\n" +
        "            return None  # negative cycle reachable\n" +
        "    return dist",
      notes: ["Early exit when no update: common optimization."],
    },
  },
  code: {
    python: {
      code:
        "def bellman_ford(n, edges, src):\n" +
        "    INF = float('inf')\n" +
        "    dist = [INF] * n\n" +
        "    dist[src] = 0\n" +
        "    for _ in range(n - 1):\n" +
        "        updated = False\n" +
        "        for u, v, w in edges:\n" +
        "            if dist[u] != INF and dist[u] + w < dist[v]:\n" +
        "                dist[v] = dist[u] + w\n" +
        "                updated = True\n" +
        "        if not updated:\n" +
        "            break\n" +
        "    # One more pass for negative cycle detection\n" +
        "    for u, v, w in edges:\n" +
        "        if dist[u] != INF and dist[u] + w < dist[v]:\n" +
        "            return None  # negative cycle\n" +
        "    return dist\n\n" +
        "# Example: 5 nodes, edges as list of (u, v, w)\n" +
        "edges = [(0,1,6),(0,2,7),(1,3,5),(1,2,8),(1,4,-4),\n" +
        "         (2,3,-3),(2,4,9),(3,1,-2),(4,0,2),(4,3,7)]\n" +
        "# dist = bellman_ford(5, edges, 0)",
      notes: [
        "Guard dist[u] != INF to avoid INF + w producing non-INF.",
        "Return None (or raise) signals a negative cycle reachable from the source.",
      ],
    },
  },
  complexity: {
    best: "O(E)",
    average: "O(VE)",
    worst: "O(VE)",
    auxiliary: "O(V)",
    total: "O(VE) time, O(V) space",
    why: [
      {
        label: "O(VE) time",
        reason:
          "V-1 passes, each relaxing all E edges. V-th pass for negative cycle detection adds another O(E).",
      },
      {
        label: "O(E) best case",
        reason:
          "If early exit triggers after the first pass (distances stabilize immediately), only one pass runs.",
      },
      {
        label: "O(V) space",
        reason:
          "dist array of size V. No DP table unless doing the DP formulation.",
      },
      {
        label: "Why not faster",
        reason:
          "Bellman-Ford is fundamentally O(VE). Dijkstra O((V+E) log V) is faster but requires non-negative weights.",
      },
    ],
  },
  whenToUse: [
    "Shortest path with negative edge weights.",
    "Detecting negative cycles.",
    "Difference constraints (system of inequalities).",
    "Currency arbitrage detection (negative cycle of log-exchanged rates).",
    "Distance-vector routing.",
  ],
  whenNotToUse: [
    "All weights non-negative — Dijkstra is faster.",
    "Unweighted graph — BFS is O(V + E).",
    "DAG — topological sort + DP is O(V + E).",
    "You only need one target — bidirectional search may help.",
  ],
  mistakes: [
    {
      mistake: "Doing V passes instead of V-1.",
      fix: "V-1 passes are sufficient for simple paths. The V-th pass is ONLY for negative-cycle detection.",
    },
    {
      mistake: "Forgetting the INF guard.",
      fix: "relax requires dist[u] != INF. Otherwise INF + w yields a non-INF value in some languages.",
    },
    {
      mistake: "Missing negative-cycle detection.",
      fix: "If a negative cycle exists, one more pass after V-1 will still improve some edge. Return None (or throw).",
    },
    {
      mistake: "Assuming unreachable = negative cycle.",
      fix: "Unreachable vertices stay at INF. Only edges from a reachable vertex to a reachable vertex can reveal a reachable negative cycle.",
    },
  ],
  interview: {
    questions: [
      "Network Delay Time (with negative weights — rare).",
      "Find the City With the Smallest Number of Neighbors (with negative weights — theoretically).",
      "Detect negative cycle in a graph.",
      "Cheapest Flights Within K Stops — actually a variant of Bellman-Ford restricted to K edges.",
    ],
    observations: [
      "Bellman-Ford DP formulation: dp[k][v] = shortest path using at most k edges. That makes 'K stops' variants natural.",
      "Early exit is cheap and helps on graphs that converge quickly.",
      "Dijkstra is preferred when weights are non-negative, but Bellman-Ford is the safe fallback.",
    ],
    optimizations: [
      "Early exit on no-update.",
      "SPFA (Shortest Path Faster Algorithm) — queue-based variant, often faster in practice, worst case O(VE).",
      "For K-limited edges, break after K passes rather than V-1.",
    ],
    followUps: [
      "What if the graph has negative cycles but no negative cycles reachable from src? — only unreachable nodes are affected.",
      "What if you need shortest paths from all sources? — Floyd-Warshall (O(V^3)).",
    ],
  },
  related: [
    {
      id: "dijkstra",
      relation:
        "Bellman-Ford handles negative weights; Dijkstra is faster but requires non-negative",
    },
    {
      id: "floyd-warshall",
      relation: "All-pairs alternative with different trade-offs",
    },
  ],
  practice: [
    {
      title: "Network Delay Time",
      difficulty: "Medium",
      why: "Bellman-Ford works, but Dijkstra is faster. Good comparison exercise.",
    },
    {
      title: "Cheapest Flights Within K Stops",
      difficulty: "Medium",
      why: "Bellman-Ford variant limited to K+1 passes.",
    },
    {
      title: "Find the City With the Smallest Number of Neighbors",
      difficulty: "Medium",
      why: "Usually Floyd-Warshall, but Bellman-Ford from each source works.",
    },
  ],
  revision: {
    takeaways: [
      "V-1 passes of edge relaxation give shortest paths.",
      "V-th pass detects negative cycles.",
      "O(VE) time, O(V) space.",
      "Handles negative weights; Dijkstra does not.",
    ],
    formulas: [
      "relax(u, v, w): dist[v] = min(dist[v], dist[u] + w)",
      "If any edge relaxes after V-1 passes → negative cycle",
    ],
    complexitySummary: "O(VE) time, O(V) space.",
    patterns: [
      "Negative weights",
      "Negative cycle detection",
      "K-stops shortest path",
    ],
    memoryTrick:
      "V-1 passes to settle, one more to detect. Slower than Dijkstra but handles negatives.",
  },
};
