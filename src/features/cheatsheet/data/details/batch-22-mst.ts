import type { ConceptDetail } from "../../types";

export const mstDetail: ConceptDetail = {
  id: "minimum-spanning-tree",
  overview: {
    essence:
      "Connect all vertices with minimum total edge weight. Kruskal (sort + union-find) or Prim (heap frontier). O(E log V).",
    what: "A spanning tree of a connected graph touches every vertex with exactly V - 1 edges and no cycles. The minimum spanning tree (MST) is the one with the smallest total edge weight.",
    problemSolved:
      "Cheapest way to connect all points (cabling, road building, cluster design). Not shortest path — MST minimizes the sum of edges, not the path between two specific nodes.",
    whyImportant:
      "A classic greedy algorithm, and a beautiful union-find application. MST questions appear in every algorithms course and often in interview mocks.",
    usedIn: [
      "Network design (cable, pipes, roads)",
      "Clustering (cut largest MST edges)",
      "Approximation algorithms (TSP 2-approx)",
      "Image segmentation (MST on pixels)",
      "Circuit design",
    ],
  },
  intuition: {
    explanation:
      "Kruskal: sort all edges by weight. Add each edge if it does not create a cycle — union-find tells you instantly. Prim: grow a tree from any starting vertex, always adding the cheapest edge from the tree to a non-tree vertex (min-heap frontier). Both produce a spanning tree of minimum weight. Both are greedy; the exchange argument proves local optimality implies global optimality for MST.",
    analogy:
      "Connecting cities with the cheapest possible road network. Kruskal: repeatedly buy the cheapest road that connects two previously unconnected clusters. Prim: start in one city, always buy the cheapest road leading out of your territory.",
  },
  internals: [
    {
      title: "Kruskal: sort + union-find",
      body: "Sort all edges by weight ascending. For each edge, if the two endpoints are in different sets, add it and union them. Stop after V - 1 edges.",
    },
    {
      title: "Prim: min-heap frontier",
      body: "Start with any vertex. Use a min-heap of (weight, vertex) for edges leaving the current tree. Pop smallest; if the target is not in the tree, add it and push its edges.",
    },
    {
      title: "Connected check",
      body: "Both algorithms produce a valid tree only if the graph is connected. If fewer than V - 1 edges added, the graph is disconnected.",
    },
    {
      title: "Why greedy works",
      body: "Exchange argument: any optimal MST can be modified to include the cheapest crossing edge without increasing total weight. Hence greedily picking it is safe.",
    },
    {
      title: "MST uniqueness",
      body: "If all edge weights are distinct, the MST is unique. Ties allow multiple MSTs of equal total weight.",
    },
  ],
  visual: {
    diagram:
      "Graph:      A --1-- B\n" +
      "              |     |\n" +
      "              4     2\n" +
      "              |     |\n" +
      "              C --3-- D\n" +
      "\n" +
      "Kruskal's (sort edges):\n" +
      "  1 (A-B): different sets → add\n" +
      "  2 (B-D): different sets → add\n" +
      "  3 (C-D): different sets → add. Now V-1=3 edges, stop.\n" +
      "  Total weight = 1 + 2 + 3 = 6\n" +
      "\n" +
      "Prim's (from A):\n" +
      "  add A. Frontier: (1, B), (4, C)\n" +
      "  pop (1, B): add B. Frontier: (2, D), (4, C)\n" +
      "  pop (2, D): add D. Frontier: (3, C)\n" +
      "  pop (3, C): add C. Done. Total = 6.",
    caption:
      "Both produce the same MST. Kruskal is edge-driven, Prim is vertex-driven.",
  },
  approach: {
    summary:
      "Kruskal: sort edges by weight, add if union-find says no cycle. Prim: grow from a source, add the cheapest frontier edge. Both return total MST weight.",
    steps: [
      "Kruskal: sort edges ascending. Union-find. For each edge: if union succeeds, add weight, increment count. Stop at V - 1.",
      "Prim: heap frontier. Pop cheapest; if target not visited, mark visited, add weight, push its edges.",
      "Both check edge count = V - 1 at the end — fewer means disconnected.",
    ],
    template: {
      code:
        "# Kruskal\n" +
        "edges.sort(key=lambda e: e[2])\n" +
        "uf = UnionFind(n)\n" +
        "total, count = 0, 0\n" +
        "for u, v, w in edges:\n" +
        "    if uf.union(u, v):\n" +
        "        total += w\n" +
        "        count += 1\n" +
        "        if count == n - 1: break\n" +
        "return total if count == n - 1 else -1",
      notes: [
        "Union-find gives O(α(E)) per edge — total O(E log E) for the sort.",
      ],
    },
  },
  code: {
    python: {
      code:
        "class UnionFind:\n" +
        "    def __init__(self, n):\n" +
        "        self.p = list(range(n))\n" +
        "        self.r = [0]*n\n" +
        "    def find(self, x):\n" +
        "        while self.p[x] != x:\n" +
        "            self.p[x] = self.p[self.p[x]]\n" +
        "            x = self.p[x]\n" +
        "        return x\n" +
        "    def union(self, a, b):\n" +
        "        ra, rb = self.find(a), self.find(b)\n" +
        "        if ra == rb: return False\n" +
        "        if self.r[ra] < self.r[rb]: ra, rb = rb, ra\n" +
        "        self.p[rb] = ra\n" +
        "        if self.r[ra] == self.r[rb]: self.r[ra] += 1\n" +
        "        return True\n\n" +
        "def min_cost_connect_points(points):\n" +
        "    n = len(points)\n" +
        "    edges = []\n" +
        "    for i in range(n):\n" +
        "        for j in range(i+1, n):\n" +
        "            d = abs(points[i][0]-points[j][0]) + abs(points[i][1]-points[j][1])\n" +
        "            edges.append((d, i, j))\n" +
        "    edges.sort()\n" +
        "    uf = UnionFind(n)\n" +
        "    total, count = 0, 0\n" +
        "    for w, u, v in edges:\n" +
        "        if uf.union(u, v):\n" +
        "            total += w\n" +
        "            count += 1\n" +
        "            if count == n - 1: break\n" +
        "    return total if count == n - 1 else -1",
      notes: ["LeetCode 1584 — Min Cost to Connect All Points."],
    },
    java: {
      code:
        "int minCostConnectPoints(int[][] points) {\n" +
        "    int n = points.length;\n" +
        "    java.util.List<int[]> edges = new java.util.ArrayList<>();\n" +
        "    for (int i = 0; i < n; i++)\n" +
        "        for (int j = i+1; j < n; j++) {\n" +
        "            int d = Math.abs(points[i][0]-points[j][0]) + Math.abs(points[i][1]-points[j][1]);\n" +
        "            edges.add(new int[]{d, i, j});\n" +
        "        }\n" +
        "    edges.sort((a, b) -> a[0] - b[0]);\n" +
        "    int[] parent = new int[n];\n" +
        "    for (int i = 0; i < n; i++) parent[i] = i;\n" +
        "    int total = 0, count = 0;\n" +
        "    for (int[] e : edges) {\n" +
        "        int ra = find(parent, e[1]);\n" +
        "        int rb = find(parent, e[2]);\n" +
        "        if (ra != rb) {\n" +
        "            parent[ra] = rb;\n" +
        "            total += e[0];\n" +
        "            if (++count == n - 1) break;\n" +
        "        }\n" +
        "    }\n" +
        "    return count == n - 1 ? total : -1;\n" +
        "}\n\n" +
        "int find(int[] p, int x) {\n" +
        "    while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }\n" +
        "    return x;\n" +
        "}",
      notes: ["Kruskal with path halving. Add rank for full O(α)."],
    },
  },
  complexity: {
    best: "O(E log E)",
    average: "O(E log E)",
    worst: "O(E log E)",
    auxiliary: "O(V + E)",
    total: "Kruskal O(E log E); Prim O(E log V) with a heap",
    why: [
      {
        label: "O(E log E) Kruskal",
        reason:
          "Sort is O(E log E); union-find is O(E α(V)) — the sort dominates.",
      },
      {
        label: "O(E log V) Prim",
        reason: "Each edge is pushed at most once; each heap op is O(log V).",
      },
      {
        label: "Why α is negligible",
        reason: "Union-find with rank + path compression is effectively O(1).",
      },
      {
        label: "Dense graphs",
        reason:
          "For E ≈ V², Prim with adjacency matrix (no heap) is O(V²) — better than Kruskal's O(V² log V).",
      },
    ],
  },
  dryRun: {
    input: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]",
    initialState: "Compute Manhattan distances, sort edges",
    steps: [
      {
        step: "1",
        state:
          "Edges sorted by weight: (3, 1,3), (4, 0,1), (4, 3,4), (7, 0,3), (7, 0,4), (7, 1,4), (9, 1,2), ...",
        note: "",
      },
      {
        step: "2",
        state: "union(1,3): different sets, add 3. count=1",
        note: "",
      },
      {
        step: "3",
        state: "union(0,1): different sets, add 4. count=2",
        note: "",
      },
      {
        step: "4",
        state: "union(3,4): different sets, add 4. count=3",
        note: "",
      },
      {
        step: "5",
        state: "union(1,2): different sets, add 9. count=4 = n-1. Stop.",
        note: "",
      },
    ],
    output: "total MST weight = 3 + 4 + 4 + 9 = 20",
  },
  whenToUse: [
    '"Connect all points with minimum total cost."',
    "Network / cable / pipe layout.",
    "Clustering (cut largest MST edges).",
    "Approximation for TSP (2-approximation via MST + DFS).",
  ],
  whenNotToUse: [
    "Shortest path between two specific nodes — Dijkstra.",
    "Graph is disconnected and you need any connection — minimum spanning forest.",
    "You need a tree with other constraints (degree bounds) — MST does not apply.",
  ],
  mistakes: [
    {
      mistake: "Confusing MST with shortest path.",
      fix: "MST minimizes sum of edges. Shortest path minimizes distance between two specific nodes. They are different problems with different algorithms (Prim/Kruskal vs Dijkstra).",
    },
    {
      mistake: "Not checking that the graph is connected.",
      fix: "If fewer than V-1 edges were added, return -1 or signal disconnected.",
    },
    {
      mistake: "Assuming Kruskal is always optimal.",
      fix: "Kruskal is best for sparse graphs. For dense graphs, Prim with adjacency matrix is O(V²) — better than Kruskal's O(E log E) = O(V² log V).",
    },
  ],
  interview: {
    questions: [
      "Min Cost to Connect All Points.",
      "Connecting Cities With Minimum Cost.",
      "Optimize Water Distribution in a Village.",
      "Redundant Connection (cycle detection with union-find).",
    ],
    observations: [
      "MST ≠ shortest path. Two very different problems.",
      "Union-find is the heart of Kruskal's — a great place to also test DSU knowledge.",
      'Prim is structurally similar to Dijkstra — replace "cumulative distance" with "current edge weight".',
    ],
    optimizations: [
      "Use Prim for dense graphs, Kruskal for sparse.",
      "Skip sorting when edges are already sorted — Kruskal becomes O(E α(V)).",
    ],
    followUps: [
      "What if the graph has ties? — multiple MSTs of equal total weight.",
      "What about directed graphs? — MST is for undirected; directed version is arborescence (much harder).",
    ],
  },
  related: [
    { id: "union-find", relation: "Kruskal's uses union-find to skip cycles" },
  ],
  practice: [
    {
      title: "Min Cost to Connect All Points",
      difficulty: "Medium",
      why: "Kruskal on a complete graph built from Manhattan distances.",
    },
    {
      title: "Redundant Connection",
      difficulty: "Medium",
      why: "Union-find finds the cycle-closing edge — same DSU as Kruskal.",
    },
    {
      title: "Connecting Cities With Minimum Cost",
      difficulty: "Medium",
      why: "Kruskal on the given edge list.",
    },
    {
      title: "Optimize Water Distribution in a Village",
      difficulty: "Hard",
      why: "Add a virtual node with edge weight = well cost; then MST.",
    },
  ],
  revision: {
    takeaways: [
      "MST connects all vertices with minimum total edge weight.",
      "Kruskal: sort edges, union-find to skip cycles.",
      "Prim: grow from a source with a min-heap frontier.",
      "Both greedy; both O(E log V) or O(E log E).",
    ],
    formulas: [
      "Kruskal: sort + union-find, stop at V-1 edges",
      "Prim: min-heap frontier from source",
    ],
    complexitySummary:
      "Kruskal O(E log E). Prim O(E log V) with heap, O(V²) with array.",
    patterns: [
      "Cheapest connection",
      "Clustering",
      "Cycle detection with union-find",
    ],
    memoryTrick:
      "MST = cheapest connections, not shortest path. Kruskal sorts edges, Prim grows a tree.",
  },
};
