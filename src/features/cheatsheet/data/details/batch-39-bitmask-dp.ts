import type { ConceptDetail } from '../../types';

export const bitmaskDpDetail: ConceptDetail = {
  id: 'bitmask-dp',
  overview: {
    essence:
      "Use an integer as the DP state — each bit marks whether an element is included. Enumerate all 2^n subsets (n <= 20) via bitmask transitions.",
    what:
      "DP where the state includes a bitmask representing a subset of n items. dp[mask] = optimal solution considering exactly the elements in mask.",
    problemSolved:
      "Subset-selection problems with n <= 20 where brute force (all permutations) is too slow, but 2^n * n is fine (about 20 million operations for n=20).",
    whyImportant:
      "The only tractable way to solve many n <= 20 combinatorial problems: TSP exact, minimum assignment, subset sum with counting, matching, cover problems.",
    usedIn: [
      "Travelling Salesman (exact, n <= 20)",
      "Partition into k subsets",
      "Minimum cost to cover all tasks",
      "Maximum independent set on small graphs",
      "Counting Hamiltonian paths",
      "Assignment problem (small n)",
    ],
  },
  intuition: {
    explanation:
      "For n items, there are 2^n possible subsets — each is a bitmask. Iterate masks from 0 to 2^n - 1. For each mask, either expand it (add an unused element) or query it as a subproblem. The transition costs O(n) per mask, giving O(2^n * n). For TSP: dp[mask][i] = min cost to visit mask ending at i. Transition: for each j not in mask, dp[mask | (1<<j)][j] = min(..., dp[mask][i] + w[i][j]).",
    analogy:
      "A team-selection spreadsheet. Each row is a combination of members (bit set = member selected). The cell value is the best score for that combination. You fill row by row, extending one member at a time.",
  },
  internals: [
    { title: "Mask representation", body: "Integer from 0 to 2^n - 1. Bit i set means element i is included. mask & (1 << i) tests inclusion; mask | (1 << i) adds; mask ^ (1 << i) removes." },
    { title: "Enumerating subsets", body: "For each mask: sub = mask; while sub: sub = (sub - 1) & mask — enumerates all subsets of mask in O(2^popcount(mask))." },
    { title: "dp[mask]", body: "Optimal value considering exactly the elements in mask. Fill order: by increasing popcount, or by increasing mask." },
    { title: "Transition", body: "For each unused element j: dp[mask | (1<<j)] = min(dp[mask | (1<<j)], dp[mask] + cost(mask, j))." },
    { title: "Memory", body: "O(2^n * k) where k is extra state dimension. For n=20, 2^20 ~ 1M, times k dimensions." },
    { title: "Bit tricks", body: "mask & -mask isolates the lowest set bit. __builtin_popcount / int.bit_count / Integer.bitCount counts set bits." },
  ],
  visual: {
    diagram:
      "TSP with 4 cities (n = 4, 16 masks total):\n\n" +
      "dp[mask][i] = min cost to visit cities in mask, ending at city i\n\n" +
      "  mask=0001 (city 0): dp[0001][0] = 0\n" +
      "  mask=0011 (0,1): dp[0011][1] = dp[0001][0] + w(0,1)\n" +
      "                    dp[0011][0] = dp[0010][1] + w(1,0)\n" +
      "  mask=0111 (0,1,2): dp[0111][2] = min(dp[0011][0]+w(0,2), dp[0011][1]+w(1,2))\n" +
      "  ...\n" +
      "  Answer = min_i dp[1111][i] + w(i, start)\n\n" +
      "Bits of mask indicate visited cities:\n" +
      "  mask = 0b1010 → cities 1 and 3 visited.",
    caption:
      "Each mask is a subset. Each dp[mask][i] considers adding an unused city.",
  },
  approach: {
    summary:
      "Define state as (mask, extra). Enumerate masks 0..2^n-1. For each mask, iterate unused elements and transition. Answer is in the full mask state.",
    steps: [
      "Identify n (must be <= 20 for 2^n * n to be feasible).",
      "Define dp[mask] or dp[mask][extra] with mask over subsets.",
      "Base: dp[0] = initial value.",
      "Transition: for each mask, for each unused element j: relax new state mask | (1<<j).",
      "Answer: extract from dp[(1<<n)-1] or a max/min over states.",
    ],
    template: {
      code:
        "n = len(items)\n" +
        "full = (1 << n) - 1\n" +
        "INF = float('inf')\n" +
        "dp = [[INF] * n for _ in range(1 << n)]\n" +
        "for i in range(n):\n" +
        "    dp[1 << i][i] = start_cost[i]\n" +
        "for mask in range(1 << n):\n" +
        "    for i in range(n):\n" +
        "        if dp[mask][i] == INF: continue\n" +
        "        for j in range(n):\n" +
        "            if mask & (1 << j): continue\n" +
        "            new_mask = mask | (1 << j)\n" +
        "            dp[new_mask][j] = min(dp[new_mask][j], dp[mask][i] + cost[i][j])\n" +
        "answer = min(dp[full][i] + back_cost[i] for i in range(n))",
      notes: ["The end-at-i variant is common for TSP / shortest path visiting all nodes."],
    },
  },
  code: {
    python: {
      code:
        "def tsp(cost):\n" +
        "    n = len(cost)\n" +
        "    full = (1 << n) - 1\n" +
        "    INF = float('inf')\n" +
        "    dp = [[INF] * n for _ in range(1 << n)]\n" +
        "    dp[1][0] = 0\n" +
        "    for mask in range(1 << n):\n" +
        "        for i in range(n):\n" +
        "            if dp[mask][i] == INF: continue\n" +
        "            for j in range(n):\n" +
        "                if mask & (1 << j): continue\n" +
        "                new_mask = mask | (1 << j)\n" +
        "                dp[new_mask][j] = min(dp[new_mask][j], dp[mask][i] + cost[i][j])\n" +
        "    return min(dp[full][i] + cost[i][0] for i in range(n))\n\n" +
        "def shortest_path_visiting_all(graph):\n" +
        "    # graph as adjacency list, n small\n" +
        "    n = len(graph)\n" +
        "    full = (1 << n) - 1\n" +
        "    from collections import deque\n" +
        "    dist = [[[float('inf')] * n for _ in range(1 << n)] for _ in range(n)]\n" +
        "    # BFS from each node: (node, mask, cost)\n" +
        "    q = deque()\n" +
        "    for i in range(n):\n" +
        "        q.append((i, 1 << i, 0))\n" +
        "        dist[i][1 << i][i] = 0\n" +
        "    while q:\n" +
        "        node, mask, d = q.popleft()\n" +
        "        if d > dist[node][mask][node]: continue\n" +
        "        for nxt in graph[node]:\n" +
        "            new_mask = mask | (1 << nxt)\n" +
        "            if d + 1 < dist[nxt][new_mask][nxt]:\n" +
        "                dist[nxt][new_mask][nxt] = d + 1\n" +
        "                q.append((nxt, new_mask, d + 1))\n" +
        "    best = float('inf')\n" +
        "    for i in range(n):\n" +
        "        best = min(best, dist[i][full][i])\n" +
        "    return best",
      notes: [
        "LeetCode 847 — Shortest Path Visiting All Nodes uses BFS with bitmask state.",
        "For TSP with n > 20, use approximation (2-approx via MST).",
      ],
    },
    java: {
      code:
        "int tsp(int[][] cost) {\n" +
        "    int n = cost.length;\n" +
        "    int full = (1 << n) - 1;\n" +
        "    int INF = Integer.MAX_VALUE / 2;\n" +
        "    int[][] dp = new int[1 << n][n];\n" +
        "    for (int[] row : dp) java.util.Arrays.fill(row, INF);\n" +
        "    dp[1][0] = 0;\n" +
        "    for (int mask = 0; mask < (1 << n); mask++) {\n" +
        "        for (int i = 0; i < n; i++) {\n" +
        "            if (dp[mask][i] == INF) continue;\n" +
        "            for (int j = 0; j < n; j++) {\n" +
        "                if ((mask & (1 << j)) != 0) continue;\n" +
        "                int newMask = mask | (1 << j);\n" +
        "                dp[newMask][j] = Math.min(dp[newMask][j], dp[mask][i] + cost[i][j]);\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "    int best = INF;\n" +
        "    for (int i = 0; i < n; i++) best = Math.min(best, dp[full][i] + cost[i][0]);\n" +
        "    return best;\n" +
        "}",
      notes: [
        "Use INF = Integer.MAX_VALUE / 2 to avoid overflow when adding cost.",
        "For n = 20, this uses 2^20 * 20 * 4 bytes ~ 80 MB. Watch memory limits.",
      ],
    },
  },
  complexity: {
    best: "O(2^n * n * k)",
    average: "O(2^n * n * k)",
    worst: "O(2^n * n * k)",
    auxiliary: "O(2^n * n * k)",
    total: "O(2^n * n * k) time, O(2^n * k) space",
    why: [
      { label: "2^n subsets", reason: "Every subset of n elements is a mask. All 2^n must be considered." },
      { label: "* n transitions", reason: "Each mask considers at most n unused elements for the next step." },
      { label: "* k extra dimensions", reason: "If dp[mask][i] tracks an extra state (e.g., which node you end at), multiply by k." },
      { label: "n <= 20 for feasibility", reason: "2^20 * 20 = ~20M operations — feasible. n = 25 → 33M * 25 = 800M — borderline. n = 30 → 32 billion — infeasible." },
    ],
  },
  dryRun: {
    input: "TSP with 3 cities, cost matrix [[0,10,15],[10,0,20],[15,20,0]]",
    initialState: "dp[001][0] = 0, all others INF",
    steps: [
      { step: "1", state: "mask=001, i=0: unused j=1,2", note: "Expand to 011 and 101." },
      { step: "2", state: "dp[011][1] = 10 (0→1)", note: "" },
      { step: "3", state: "dp[101][2] = 15 (0→2)", note: "" },
      { step: "4", state: "mask=011, i=1: unused j=2", note: "Expand to 111." },
      { step: "5", state: "dp[111][2] = min(INF, 10 + 20) = 30", note: "0→1→2." },
      { step: "6", state: "mask=101, i=2: unused j=1", note: "" },
      { step: "7", state: "dp[111][1] = min(30, 15 + 20) = 30", note: "0→2→1 = 35 > 30, skip." },
      { step: "8", state: "answer = min(dp[111][1]+cost[1][0], dp[111][2]+cost[2][0])", note: "" },
      { step: "9", state: "= min(30 + 10, 30 + 15) = min(40, 45) = 40", note: "" },
    ],
    output: "40 (path 0→1→2→0)",
  },
  whenToUse: [
    "n <= 20 subset problems.",
    "Travelling salesman (exact).",
    "Counting Hamiltonian paths.",
    "Assignment/matching with small n.",
    "Any problem where DP state is 'which subset have I used'.",
  ],
  whenNotToUse: [
    "n > 20 — 2^n explodes.",
    "Subset structure is not needed (e.g., order-independent) — use simpler DP.",
    "Continuous state — bitmask only works for discrete finite states.",
    "Large n but small 'active window' — use rolling window / sliding DP.",
  ],
  mistakes: [
    { mistake: "Using bitmask DP for n = 30+.", fix: "2^30 = 1 billion — too slow. Approximate or find structure." },
    { mistake: "Not initializing INF properly.", fix: "Use INF = Integer.MAX_VALUE / 2 or similar; adding to MAX_VALUE overflows." },
    { mistake: "Iterating masks in the wrong order.", fix: "Process smaller masks first. Since new_mask > mask, iterating masks 0..2^n-1 guarantees correct ordering." },
    { mistake: "Forgetting the return trip in TSP.", fix: "After visiting all nodes, add cost back to start for the final answer." },
  ],
  interview: {
    questions: [
      "Shortest Path Visiting All Nodes (LeetCode 847).",
      "Partition to K Equal Sum Subsets (LeetCode 698) — bitmask + memo.",
      "Stickers to Spell Word (LeetCode 691).",
      "Maximum Students Taking Exam (LeetCode 1349) — bitmask row DP.",
      "Optimal Account Balancing (LeetCode 465).",
    ],
    observations: [
      "Bitmask DP is the exact solution when n is small (<= 20).",
      "State space: 2^n. Transition space: n. Total: O(2^n * n).",
      "For permutations (TSP), add an 'ending node' dimension: dp[mask][i].",
    ],
    optimizations: [
      "Only iterate reachable masks (dp[mask][i] < INF).",
      "Use Gray code enumeration when consecutive masks differ by one bit.",
      "For partition problems, prune branches early with subset-sum pre-check.",
    ],
    followUps: [
      "What if n > 20? — approximation (MST-based for TSP) or branch and bound.",
      "What about negative weights? — bitmask DP handles them fine; no BFS shortcut needed.",
    ],
  },
  related: [
    { id: "bit-manipulation", relation: "Bitmask DP uses bit operations to enumerate subsets" },
  ],
  practice: [
    { title: "Shortest Path Visiting All Nodes", difficulty: "Hard", why: "BFS with bitmask state — canonical bitmask-DP-flavored problem." },
    { title: "Partition to K Equal Sum Subsets", difficulty: "Medium", why: "DP over subsets with memoization." },
    { title: "Stickers to Spell Word", difficulty: "Hard", why: "Bitmask representing which letters covered." },
    { title: "Maximum Students Taking Exam", difficulty: "Hard", why: "Bitmask per row + row-to-row DP." },
  ],
  revision: {
    takeaways: [
      "Bitmask DP: state = integer representing subset of elements.",
      "O(2^n * n) time — only feasible for n <= 20.",
      "Common patterns: TSP (dp[mask][last]), subset sum, partition.",
      "Bit ops: mask | (1<<i) add, mask & ~(1<<i) remove, mask & (1<<i) test.",
    ],
    formulas: [
      "Full mask = (1 << n) - 1",
      "dp[mask | (1 << i)][i] = min(dp[mask | (1 << i)][i], dp[mask][j] + cost[j][i])",
      "Enumerate subsets of mask: sub = mask; while sub: ...; sub = (sub - 1) & mask",
    ],
    complexitySummary: "O(2^n * n) time, O(2^n * k) space. n <= 20.",
    patterns: ["TSP", "Subset selection", "Set cover", "Partition into groups"],
    memoryTrick: "Bit i set = element i used. Enumerate masks 0..2^n-1, transition on unused bits.",
  },
};
