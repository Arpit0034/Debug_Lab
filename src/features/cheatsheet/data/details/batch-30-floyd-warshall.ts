import type { ConceptDetail } from "../../types";

export const floydWarshallDetail: ConceptDetail = {
  id: "floyd-warshall",
  overview: {
    essence:
      "All-pairs shortest path in O(V³). Relax dist[i][j] via each k. Handles negative edges, detects cycles.",
    what: "Dynamic programming for all-pairs shortest paths. dp[i][j] = shortest distance from i to j. Add intermediate vertex k one at a time: dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]).",
    problemSolved:
      "Single-source algorithms (Dijkstra, Bellman-Ford) need to be run V times for all pairs. Floyd-Warshall does it in one O(V^3) pass — often simpler and fast for V <= 500.",
    whyImportant:
      "The all-pairs shortest path. Used in dense graph problems, transitive closure, and network analysis. Elegant 3-line core.",
    usedIn: [
      "All-pairs shortest path",
      "Transitive closure (reachability)",
      "Find the City With the Smallest Number of Neighbors",
      "Detect negative cycles (any dp[i][i] < 0)",
      "Evaluate Division (all-pairs path products)",
    ],
  },
  intuition: {
    explanation:
      "Consider shortest path from i to j. Any such path either uses vertex k as an intermediate or does not. If we process every vertex as a potential intermediate one at a time, then after processing all V vertices, dp[i][j] is optimal. The recurrence is beautiful: dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]). Just V^3 tiny operations.",
    analogy:
      "Flight connections. Initially dp[i][j] = direct flight cost (or INF). Add each city k as a potential layover: is i→k→j cheaper than i→j? After considering every city as a hub, all shortest paths are known.",
  },
  internals: [
    {
      title: "dp[i][j]",
      body: "Current best known distance from i to j. Initialize from adjacency matrix: 0 for i==j, weight for edges, INF for no edge.",
    },
    {
      title: "Outer loop over k",
      body: "For each intermediate vertex k in 0..V-1: for each pair (i, j): dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]).",
    },
    {
      title: "Order is critical",
      body: "k MUST be the outer loop. If you iterate k inside, dp[i][k] and dp[k][j] may not be optimal yet.",
    },
    {
      title: "Negative cycles",
      body: "After running, if any dp[i][i] < 0, a negative cycle exists (path from i back to i with negative cost).",
    },
    {
      title: "Transitive closure",
      body: "Replace min-plus with boolean OR-AND: reachable[i][j] = reachable[i][j] || (reachable[i][k] && reachable[k][j]).",
    },
    {
      title: "Space optimization",
      body: "Already O(V^2) — no reduction possible for all-pairs.",
    },
  ],
  visual: {
    diagram:
      "Initial dp = adjacency matrix:\n" +
      "       0    1    2    3\n" +
      "  0    0    3   INF    7\n" +
      "  1    8    0    2   INF\n" +
      "  2    5   INF   0    1\n" +
      "  3    2   INF  INF   0\n\n" +
      "After k=0 (relax through vertex 0):\n" +
      "  dp[3][1] = min(INF, dp[3][0] + dp[0][1]) = 2 + 3 = 5\n" +
      "  dp[2][1] = min(INF, dp[2][0] + dp[0][1]) = 5 + 3 = 8\n" +
      "...\n\n" +
      "After all k=0,1,2,3:\n" +
      "  dp[i][j] = shortest distance, all pairs.",
    caption:
      "k is the outermost loop. Each k lets paths route through that intermediate vertex.",
  },
  approach: {
    summary:
      "Initialize dp from adjacency matrix (0 diagonal, INF missing). Loop k=0..V-1 outer, i and j inner. dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]). O(V^3).",
    steps: [
      "dp[i][i] = 0 for all i, dp[i][j] = w if edge, INF otherwise.",
      "For k in range(V): for i in range(V): for j in range(V):",
      "  if dp[i][k] + dp[k][j] < dp[i][j]: dp[i][j] = dp[i][k] + dp[k][j]",
      "After loop, dp is all-pairs shortest distances.",
      "Check dp[i][i] < 0 for negative cycles.",
    ],
    template: {
      code:
        "def floyd_warshall(n, edges):\n" +
        "    INF = float('inf')\n" +
        "    dp = [[INF] * n for _ in range(n)]\n" +
        "    for i in range(n):\n" +
        "        dp[i][i] = 0\n" +
        "    for u, v, w in edges:\n" +
        "        dp[u][v] = min(dp[u][v], w)\n" +
        "    for k in range(n):          # k OUTER\n" +
        "        for i in range(n):\n" +
        "            for j in range(n):\n" +
        "                if dp[i][k] + dp[k][j] < dp[i][j]:\n" +
        "                    dp[i][j] = dp[i][k] + dp[k][j]\n" +
        "    return dp",
      notes: [
        "k MUST be the outer loop. This is the single most common bug.",
        "INF + something stays INF in Python — no overflow issue.",
      ],
    },
  },
  code: {
    python: {
      code:
        "def floyd_warshall(n, edges):\n" +
        "    INF = float('inf')\n" +
        "    dp = [[INF] * n for _ in range(n)]\n" +
        "    for i in range(n): dp[i][i] = 0\n" +
        "    for u, v, w in edges:\n" +
        "        dp[u][v] = min(dp[u][v], w)\n" +
        "    for k in range(n):\n" +
        "        for i in range(n):\n" +
        "            if dp[i][k] == INF: continue\n" +
        "            for j in range(n):\n" +
        "                if dp[i][k] + dp[k][j] < dp[i][j]:\n" +
        "                    dp[i][j] = dp[i][k] + dp[k][j]\n" +
        "    # Negative cycle check\n" +
        "    for i in range(n):\n" +
        "        if dp[i][i] < 0:\n" +
        "            return None  # negative cycle\n" +
        "    return dp",
      notes: [
        "The `if dp[i][k] == INF: continue` optimization skips rows with no path through k.",
        "O(V^3) is fine for V <= 500; for larger V use repeated Dijkstra or BFS.",
      ],
    },
  },
  complexity: {
    best: "O(V^3)",
    average: "O(V^3)",
    worst: "O(V^3)",
    auxiliary: "O(V^2)",
    total: "O(V^3) time, O(V^2) space",
    why: [
      {
        label: "O(V^3) time",
        reason:
          "Triple nested loop: k, i, j each over V. Total V^3 iterations.",
      },
      { label: "O(V^2) space", reason: "The dp table is V × V." },
      {
        label: "When V^3 beats V Dijkstras",
        reason:
          "V × Dijkstra = O(V*(V+E) log V). For dense graphs (E ~ V^2), that is O(V^3 log V) — worse than FW. For sparse graphs, repeated Dijkstra wins.",
      },
    ],
  },
  whenToUse: [
    "All-pairs shortest path with V <= 500.",
    "Dense graphs where V × Dijkstra is slower.",
    "Transitive closure / reachability.",
    "Negative edge weights (but no negative cycles).",
    "Detecting negative cycles in all-pairs context.",
  ],
  whenNotToUse: [
    "Sparse graphs — repeated Dijkstra is faster.",
    "V > 500 or 1000 — O(V^3) too slow.",
    "Single-source — Dijkstra or Bellman-Ford.",
    "DAG — topological sort + DP handles shortest path in O(V + E).",
  ],
  mistakes: [
    {
      mistake: "Putting k as inner loop.",
      fix: "k MUST be outermost. If k is inside, dp[i][k] and dp[k][j] may not be optimal when used. The recurrence assumes k is processed once for all (i, j).",
    },
    {
      mistake: "Initializing dp[i][i] = INF instead of 0.",
      fix: "Distance to self is 0. Otherwise the algorithm gives weird results.",
    },
    {
      mistake: "Not checking for negative cycles.",
      fix: "After running, check dp[i][i] < 0. If yes, distances are undefined (infinitely reducible).",
    },
    {
      mistake: "Using Floyd-Warshall for V = 10^5.",
      fix: "O(V^3) = 10^15 operations. Use repeated Dijkstra or BFS instead.",
    },
  ],
  interview: {
    questions: [
      "Find the City With the Smallest Number of Neighbors (LeetCode 1334).",
      "Evaluate Division (LeetCode 399) — all-pairs products.",
      "Transitive closure of a graph.",
      "Detect negative cycles (all-pairs).",
    ],
    observations: [
      "The 3-loop structure is the entire algorithm. Once memorized, it is 5 lines.",
      "Transitive closure is FW with boolean OR-AND instead of min-plus.",
      "Negative cycle detection is free — check the diagonal.",
    ],
    optimizations: [
      "Skip rows where dp[i][k] = INF (no path from i through k).",
      "Use bit-parallel for boolean transitive closure (pack bits into integers).",
      "For sparse graphs, run Dijkstra V times instead.",
    ],
    followUps: [
      "What about reconstructing paths? — store next[i][j] = k whenever you update.",
      "What about negative cycles? — dp[i][i] < 0 means one exists through i.",
    ],
  },
  related: [
    {
      id: "dijkstra",
      relation: "Single-source alternative; faster for sparse graphs",
    },
    { id: "bellman-ford", relation: "Single-source with negative weights" },
  ],
  practice: [
    {
      title: "Find the City With the Smallest Number of Neighbors",
      difficulty: "Medium",
      why: "All-pairs shortest path, V <= 100. FW fits perfectly.",
    },
    {
      title: "Evaluate Division",
      difficulty: "Medium",
      why: "All-pairs path products — FW variant with multiplication.",
    },
    {
      title: "Count Pairs of Nodes",
      difficulty: "Hard",
      why: "All-pairs reachability via transitive closure.",
    },
    {
      title: "Reachable Nodes In Subdivided Graph",
      difficulty: "Hard",
      why: "Shortest path + counting.",
    },
  ],
  revision: {
    takeaways: [
      "Floyd-Warshall: all-pairs shortest path in O(V^3).",
      "k must be the OUTERMOST loop.",
      "Handles negative edges, detects negative cycles via dp[i][i] < 0.",
      "Transitive closure = same pattern with boolean OR-AND.",
    ],
    formulas: [
      "dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])",
      "Loop order: k outer, then i, then j",
    ],
    complexitySummary: "O(V^3) time, O(V^2) space. Fast for V <= 500.",
    patterns: [
      "All-pairs shortest",
      "Transitive closure",
      "Negative cycle detection",
    ],
    memoryTrick:
      "Three nested loops, k outermost. Relax through intermediate vertex.",
  },
};
