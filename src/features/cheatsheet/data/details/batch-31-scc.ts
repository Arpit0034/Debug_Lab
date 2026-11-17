import type { ConceptDetail } from '../../types';

export const sccDetail: ConceptDetail = {
  id: 'strongly-connected-components',
  overview: {
    essence:
      "SCCs of a directed graph: maximal sets of vertices mutually reachable. Two algorithms: Kosaraju (two DFS passes) and Tarjan (one DFS pass with low-link values). Both O(V + E).",
    what:
      "A strongly connected component (SCC) of a directed graph is a maximal set of vertices such that every vertex can reach every other vertex in the set.",
    problemSolved:
      "Condensing a graph into a DAG of SCCs enables cycle detection, dependency analysis, and simplification of complex reachability problems.",
    whyImportant:
      "SCC underlies page-ranking-like analyses, cycle detection in directed graphs (not just any cycle — SCCs of size > 1), and 2-SAT.",
    usedIn: [
      "Detecting cycles in directed graphs",
      "Condensing a graph into a DAG",
      "2-SAT satisfiability",
      "Critical connections in a network (bridges — related)",
      "Course dependency analysis",
    ],
  },
  intuition: {
    explanation:
      "Kosaraju: run DFS on the original graph, record finish order. Reverse the graph. Run DFS on the reversed graph in decreasing finish order — each DFS tree is one SCC. Tarjan: single DFS. Track discovery index and low-link (the lowest-index reachable vertex via back edges). When a vertex's low-link equals its own index, it is the root of an SCC — pop the stack down to it.",
    analogy:
      "One-way streets in a city. An SCC is a set of blocks where you can drive from any block to any other using only one-way streets. Condensing the city into a DAG of SCCs reveals the true flow: you can never return to an earlier block once you leave.",
  },
  internals: [
    { title: "SCC property", body: "If u and v are in the same SCC, there is a directed cycle containing both. SCCs partition the vertices — every vertex is in exactly one SCC." },
    { title: "Kosaraju step 1", body: "DFS on the original graph. Push each vertex to a stack on exit (post-order)." },
    { title: "Kosaraju step 2", body: "Reverse all edges. Pop vertices from the stack; DFS on the reversed graph from each unvisited popped vertex. Each DFS tree = one SCC." },
    { title: "Tarjan discovery time", body: "disc[v] = order in which v is discovered. low[v] = smallest discovery time reachable from v (via back edges and tree edges)." },
    { title: "Tarjan SCC detection", body: "When low[v] == disc[v], v is the root of an SCC. Pop vertices from the stack down to v — those form the SCC." },
    { title: "Condensation DAG", body: "Contract each SCC to a single node. The result is a DAG. Topological order of the condensation is useful for many follow-up problems." },
  ],
  visual: {
    diagram:
      "Graph: 0→1, 1→2, 2→0, 3→4, 4→5, 5→3, 2→3\n\n" +
      "SCCs:\n" +
      "  SCC A: {0, 1, 2}  (0→1→2→0 cycle)\n" +
      "  SCC B: {3, 4, 5}  (3→4→5→3 cycle)\n\n" +
      "Condensed DAG:\n" +
      "  A → B  (edge 2→3 becomes edge A→B)\n\n" +
      "Kosaraju trace:\n" +
      "  DFS from 0: visit 1, 2, then back. Finish order: [2, 1, 0]\n" +
      "  DFS from 3: visit 4, 5, back. Finish order: [5, 4, 3]\n" +
      "  Stack (post-order): [5, 4, 3, 2, 1, 0]\n" +
      "  Reverse graph.\n" +
      "  Pop 0, DFS on reversed: reach {0, 2, 1} → SCC A\n" +
      "  Pop 3, DFS on reversed: reach {3, 5, 4} → SCC B",
    caption:
      "Kosaraju: two DFS passes. Tarjan: one DFS with low-link values.",
  },
  approach: {
    summary:
      "Kosaraju: DFS for finish order, reverse graph, DFS in reverse finish order. Tarjan: single DFS tracking disc[] and low[], pop stack when low[v] == disc[v]. Both O(V + E).",
    steps: [
      "Kosaraju: DFS1 builds finish-order stack. Reverse all edges. DFS2 in reverse stack order → each DFS tree is one SCC.",
      "Tarjan: single DFS. Track disc and low. When low[v] == disc[v], pop stack down to v as an SCC.",
      "After finding SCCs, build the condensation DAG.",
    ],
    template: {
      code:
        "def kosaraju(n, adj):\n" +
        "    visited = [False] * n\n" +
        "    order = []\n" +
        "    def dfs1(u):\n" +
        "        visited[u] = True\n" +
        "        for v in adj[u]:\n" +
        "            if not visited[v]: dfs1(v)\n" +
        "        order.append(u)\n" +
        "    for i in range(n):\n" +
        "        if not visited[i]: dfs1(i)\n" +
        "    radj = [[] for _ in range(n)]\n" +
        "    for u in range(n):\n" +
        "        for v in adj[u]: radj[v].append(u)\n" +
        "    visited = [False] * n\n" +
        "    sccs = []\n" +
        "    def dfs2(u, comp):\n" +
        "        visited[u] = True\n" +
        "        comp.append(u)\n" +
        "        for v in radj[u]:\n" +
        "            if not visited[v]: dfs2(v, comp)\n" +
        "    for u in reversed(order):\n" +
        "        if not visited[u]:\n" +
        "            comp = []\n" +
        "            dfs2(u, comp)\n" +
        "            sccs.append(comp)\n" +
        "    return sccs",
      notes: ["Two DFS passes: original then reversed."],
    },
  },
  code: {
    python: {
      code:
        "# Kosaraju\n" +
        "def kosaraju(n, adj):\n" +
        "    visited = [False] * n\n" +
        "    order = []\n" +
        "    def dfs1(u):\n" +
        "        visited[u] = True\n" +
        "        for v in adj[u]:\n" +
        "            if not visited[v]: dfs1(v)\n" +
        "        order.append(u)\n" +
        "    for i in range(n):\n" +
        "        if not visited[i]: dfs1(i)\n" +
        "    radj = [[] for _ in range(n)]\n" +
        "    for u in range(n):\n" +
        "        for v in adj[u]: radj[v].append(u)\n" +
        "    visited = [False] * n\n" +
        "    sccs = []\n" +
        "    def dfs2(u, comp):\n" +
        "        visited[u] = True\n" +
        "        comp.append(u)\n" +
        "        for v in radj[u]:\n" +
        "            if not visited[v]: dfs2(v, comp)\n" +
        "    for u in reversed(order):\n" +
        "        if not visited[u]:\n" +
        "            comp = []\n" +
        "            dfs2(u, comp)\n" +
        "            sccs.append(comp)\n" +
        "    return sccs\n\n" +
        "# Tarjan (single pass)\n" +
        "def tarjan(n, adj):\n" +
        "    disc = [-1] * n\n" +
        "    low = [0] * n\n" +
        "    on_stack = [False] * n\n" +
        "    stack = []\n" +
        "    time = [0]\n" +
        "    sccs = []\n" +
        "    def dfs(u):\n" +
        "        disc[u] = low[u] = time[0]\n" +
        "        time[0] += 1\n" +
        "        stack.append(u)\n" +
        "        on_stack[u] = True\n" +
        "        for v in adj[u]:\n" +
        "            if disc[v] == -1:\n" +
        "                dfs(v)\n" +
        "                low[u] = min(low[u], low[v])\n" +
        "            elif on_stack[v]:\n" +
        "                low[u] = min(low[u], disc[v])\n" +
        "        if low[u] == disc[u]:\n" +
        "            comp = []\n" +
        "            while True:\n" +
        "                w = stack.pop()\n" +
        "                on_stack[w] = False\n" +
        "                comp.append(w)\n" +
        "                if w == u: break\n" +
        "            sccs.append(comp)\n" +
        "    for i in range(n):\n" +
        "        if disc[i] == -1: dfs(i)\n" +
        "    return sccs",
      notes: [
        "Kosaraju: simpler to reason about. Two passes.",
        "Tarjan: single pass, more elegant, tracks low-link values.",
        "Both are O(V + E) with O(V) extra space for recursion.",
      ],
    },
  },
  complexity: {
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    auxiliary: "O(V)",
    total: "O(V + E) time, O(V) space",
    why: [
      { label: "O(V + E) time", reason: "Every vertex visited once, every edge examined once. Kosaraju does it twice — still O(V + E)." },
      { label: "O(V) space", reason: "Visited array, stack, and disc/low arrays all size V." },
      { label: "Recursion depth", reason: "Recursive DFS may hit V depth. Use iterative or increase recursion limit for large graphs." },
    ],
  },
  whenToUse: [
    "Finding SCCs of a directed graph.",
    "Condensing a graph into a DAG.",
    "Detecting directed cycles that are not trivial (SCC size > 1).",
    "2-SAT problem reduction.",
    "PageRank-like analyses on directed graphs.",
  ],
  whenNotToUse: [
    "Undirected graph — use bridges / articulation points instead.",
    "You only need a single reachability query — one BFS suffices.",
    "You need the transitive closure — Floyd-Warshall or bitset reachability.",
  ],
  mistakes: [
    { mistake: "Running SCC algorithm on an undirected graph.", fix: "SCC is defined for directed graphs. Undirected cycles need bridges/articulation points." },
    { mistake: "Kosaraju: using the same visited array between passes.", fix: "Reset visited[] before the second pass." },
    { mistake: "Tarjan: not using on_stack correctly.", fix: "low-link propagation only applies to vertices currently on the stack. Off-stack vertices belong to already-extracted SCCs." },
    { mistake: "Recursion stack overflow on V = 10^5.", fix: "Use iterative DFS or sys.setrecursionlimit(100000)." },
  ],
  interview: {
    questions: [
      "Critical Connections in a Network (bridges, related to SCC).",
      "Number of Operations to Make Network Connected (uses union-find, but SCC adjacent).",
      "Find Eventual Safe States.",
      "Detect a cycle in a directed graph (SCC size > 1 or self-loop).",
    ],
    observations: [
      "SCC condensation creates a DAG — enables topological sort on top.",
      "Any cycle in a directed graph is fully contained within one SCC.",
      "2-SAT reduction uses SCC on the implication graph.",
    ],
    optimizations: [
      "Tarjan is one-pass and preferred in competitive programming.",
      "Iterative DFS avoids recursion-limit issues in Python.",
      "Kosaraju is simpler to prove correct; use when correctness matters more than speed.",
    ],
    followUps: [
      "What about bridges? — similar idea with low-link but different condition (low[child] > disc[parent]).",
      "What about biconnected components? — related decomposition by articulation points.",
    ],
  },
  related: [
    { id: "topological-sort", relation: "Condensation of SCCs forms a DAG that can be topologically sorted" },
    { id: "union-find", relation: "Union-find is for undirected connectivity; SCC is directed" },
  ],
  practice: [
    { title: "Critical Connections in a Network", difficulty: "Hard", why: "Bridges (related). Same low-link idea as Tarjan." },
    { title: "Number of Operations to Make Network Connected", difficulty: "Medium", why: "Union-find on undirected. Good comparison to SCC thinking." },
    { title: "Find Eventual Safe States", difficulty: "Medium", why: "Reverse graph + cycle detection. Related to SCC." },
  ],
  revision: {
    takeaways: [
      "SCC: maximal set of mutually reachable vertices in a directed graph.",
      "Kosaraju: two DFS passes with graph reversal.",
      "Tarjan: one DFS pass with disc and low-link.",
      "Both O(V + E). Condensation is a DAG.",
    ],
    formulas: [
      "Kosaraju: DFS → reverse graph → DFS in finish order",
      "Tarjan: when low[v] == disc[v], pop SCC",
    ],
    complexitySummary: "O(V + E) time, O(V) space.",
    patterns: ["Directed cycles", "Graph condensation", "2-SAT"],
    memoryTrick: "Kosaraju: forward, reverse, forward. Tarjan: one pass, low-link, pop when low==disc.",
  },
};
