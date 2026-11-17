import type { ConceptDetail } from '../../types';

export const intervalDpDetail: ConceptDetail = {
  id: 'interval-dp',
  overview: {
    essence:
      "dp[i][j] = optimal solution for the subarray/interval from i to j. Fill by increasing length. Try each split point k inside (i, j) and combine dp[i][k] and dp[k][j].",
    what:
      "A DP family where the state is an interval [i, j]. Answer for interval [i, j] depends on answers for shorter sub-intervals. Generalizes matrix chain multiplication.",
    problemSolved:
      "Problems where the final answer decomposes by choosing one 'pivot' inside the interval and combining left and right answers.",
    whyImportant:
      "Generalizes MCM. Covers burst balloons, palindrome partitioning, stone game, remove boxes, strange printer. Recognizing interval DP is the key — then the template is mechanical.",
    usedIn: [
      "Matrix chain multiplication",
      "Burst Balloons (LeetCode 312)",
      "Palindrome Partitioning II",
      "Stone Game variants",
      "Boomerang / triangulation problems",
      "Remove Boxes / Strange Printer",
      "Predict the Winner",
    ],
  },
  intuition: {
    explanation:
      "dp[i][j] = best value using exactly the interval [i, j]. Base: dp[i][i] = trivial (usually 0, or the element itself). Transition: pick a split k in (i, j). Combine dp[i][k] + dp[k][j] + cost of the merge. Iterate over all k, take the min (or max). The fill order is critical: shorter intervals first, so that dp[i][k] and dp[k][j] are computed before dp[i][j]. Iterate length L from 2 to n, then i from 0 to n-L, j = i + L - 1. O(n^3) time.",
    analogy:
      "Building a pyramid of trust. Each layer (length) trusts the layer below (shorter intervals). You solve small intervals first, then combine them to solve bigger ones.",
  },
  internals: [
    { title: "State", body: "dp[i][j] = answer for subarray i..j inclusive. Sometimes dp[i][j][k] if an extra dimension (e.g., number of remaining items) matters." },
    { title: "Fill order", body: "Length L from 2 to n. For each start i, j = i + L - 1. All shorter intervals are already filled." },
    { title: "Split point k", body: "For each k in (i, j), combine dp[i][k], dp[k][j], and a merge cost depending on problem (e.g., nums[i-1]*nums[k]*nums[j+1] for MCM / burst balloons with padding)." },
    { title: "Padding trick", body: "Burst Balloons and MCM pad the array with sentinel values (1s) at both ends so i-1 and j+1 are always valid indices." },
    { title: "Return", body: "Answer is dp[0][n-1] (or dp[1][n] if 1-indexed padded)." },
    { title: "Extra dimension", body: "Some problems need dp[i][j][k] where k = remaining count. E.g., Remove Boxes uses (i, j, k) = three dimensions." },
  ],
  visual: {
    diagram:
      "Burst Balloons (padded): nums = [3, 1, 5, 8], padded = [1, 3, 1, 5, 8, 1], n = 4\n\n" +
      "dp[i][j] = max coins from bursting balloons in (i, j), 1-indexed padded\n\n" +
      "Fill by length:\n" +
      "  L=1: dp[i][i+1] = burst one balloon = nums[i-1]*nums[i]*nums[i+1]\n" +
      "  L=2: dp[i][i+2] = max over k of dp[i][k] + dp[k][i+2] + nums[i-1]*nums[k]*nums[i+2]\n" +
      "  ...\n" +
      "  Answer = dp[0][n+1]  (with 0-indexed padded array of size n+2)\n\n" +
      "For [3,1,5,8]: answer = 167\n" +
      "  (burst order: 1, 5, 3, 8 gives 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15+120+24+8 = 167)",
    caption:
      "Fill by increasing length. Each cell tries all split points in the interval.",
  },
  approach: {
    summary:
      "dp[i][j] = best for interval [i, j]. Iterate length from 2 to n. For each interval, try each split k. Answer at dp[0][n-1].",
    steps: [
      "Allocate dp[n][n] (or padded [n+2][n+2]).",
      "Base: length 0 or 1 — trivial values.",
      "For L in range(2, n+1): for i in range(n - L + 1): j = i + L - 1.",
      "  For k in range(i, j): dp[i][j] = opt(dp[i][j], dp[i][k] + dp[k+1][j] + merge_cost).",
      "Return dp[0][n-1].",
    ],
    template: {
      code:
        "def interval_dp(arr):\n" +
        "    n = len(arr)\n" +
        "    dp = [[0] * n for _ in range(n)]\n" +
        "    for L in range(2, n + 1):\n" +
        "        for i in range(n - L + 1):\n" +
        "            j = i + L - 1\n" +
        "            dp[i][j] = float('inf')\n" +
        "            for k in range(i, j):\n" +
        "                cost = dp[i][k] + dp[k+1][j] + merge_cost(arr, i, k, j)\n" +
        "                dp[i][j] = min(dp[i][j], cost)\n" +
        "    return dp[0][n-1]",
      notes: ["Fill by length — shorter intervals first.", "merge_cost is the problem-specific combination term."],
    },
  },
  code: {
    python: {
      code:
        "def burst_balloons(nums):\n" +
        "    n = len(nums)\n" +
        "    # Pad with 1s at both ends\n" +
        "    a = [1] + nums + [1]\n" +
        "    m = len(a)\n" +
        "    dp = [[0] * m for _ in range(m)]\n" +
        "    # dp[i][j] = max coins from bursting all balloons strictly between i and j\n" +
        "    for L in range(2, m):\n" +
        "        for i in range(m - L):\n" +
        "            j = i + L\n" +
        "            for k in range(i + 1, j):\n" +
        "                dp[i][j] = max(\n" +
        "                    dp[i][j],\n" +
        "                    dp[i][k] + dp[k][j] + a[i] * a[k] * a[j]\n" +
        "                )\n" +
        "    return dp[0][m - 1]\n\n" +
        "def stone_game(piles):\n" +
        "    # dp[i][j] = max score diff (current - opponent) for interval [i, j]\n" +
        "    n = len(piles)\n" +
        "    dp = [[0] * n for _ in range(n)]\n" +
        "    for i in range(n):\n" +
        "        dp[i][i] = piles[i]\n" +
        "    for L in range(2, n + 1):\n" +
        "        for i in range(n - L + 1):\n" +
        "            j = i + L - 1\n" +
        "            dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])\n" +
        "    return dp[0][n-1] >= 0\n\n" +
        "def palindrome_partition_ii(s):\n" +
        "    n = len(s)\n" +
        "    # is_pal[i][j] = is s[i..j] a palindrome\n" +
        "    is_pal = [[False] * n for _ in range(n)]\n" +
        "    for i in range(n):\n" +
        "        is_pal[i][i] = True\n" +
        "    for L in range(2, n + 1):\n" +
        "        for i in range(n - L + 1):\n" +
        "            j = i + L - 1\n" +
        "            is_pal[i][j] = s[i] == s[j] and (L == 2 or is_pal[i+1][j-1])\n" +
        "    # dp[i] = min cuts for s[0..i]\n" +
        "    dp = [0] * n\n" +
        "    for j in range(n):\n" +
        "        if is_pal[0][j]:\n" +
        "            dp[j] = 0\n" +
        "        else:\n" +
        "            dp[j] = j  # worst case: cut every position\n" +
        "            for i in range(j):\n" +
        "                if is_pal[i+1][j]:\n" +
        "                    dp[j] = min(dp[j], dp[i] + 1)\n" +
        "    return dp[n-1]",
      notes: [
        "Burst Balloons pads with 1s on both ends to simplify boundary conditions.",
        "Stone Game uses difference-instead-of-sum formulation: pick left or right, subtract opponent answer.",
        "Palindrome Partitioning II combines O(n^2) palindrome precompute + O(n^2) cut DP.",
      ],
    },
    java: {
      code:
        "int maxCoins(int[] nums) {\n" +
        "    int n = nums.length;\n" +
        "    int[] a = new int[n + 2];\n" +
        "    a[0] = 1; a[n + 1] = 1;\n" +
        "    for (int i = 0; i < n; i++) a[i + 1] = nums[i];\n" +
        "    int m = n + 2;\n" +
        "    int[][] dp = new int[m][m];\n" +
        "    for (int L = 2; L < m; L++) {\n" +
        "        for (int i = 0; i < m - L; i++) {\n" +
        "            int j = i + L;\n" +
        "            for (int k = i + 1; k < j; k++) {\n" +
        "                dp[i][j] = Math.max(dp[i][j],\n" +
        "                    dp[i][k] + dp[k][j] + a[i] * a[k] * a[j]);\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "    return dp[0][m - 1];\n" +
        "}\n\n" +
        "boolean stoneGame(int[] piles) {\n" +
        "    int n = piles.length;\n" +
        "    int[][] dp = new int[n][n];\n" +
        "    for (int i = 0; i < n; i++) dp[i][i] = piles[i];\n" +
        "    for (int L = 2; L <= n; L++) {\n" +
        "        for (int i = 0; i <= n - L; i++) {\n" +
        "            int j = i + L - 1;\n" +
        "            dp[i][j] = Math.max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1]);\n" +
        "        }\n" +
        "    }\n" +
        "    return dp[0][n-1] >= 0;\n" +
        "}",
      notes: [
        "Padding trick makes i-1 and j+1 always valid indices (no boundary checks).",
        "Stone Game: dp[i][j] is score difference, not total score.",
      ],
    },
  },
  complexity: {
    best: "O(n^3)",
    average: "O(n^3)",
    worst: "O(n^3)",
    auxiliary: "O(n^2)",
    total: "O(n^3) time, O(n^2) space",
    why: [
      { label: "O(n^2) intervals", reason: "All pairs (i, j) with i <= j — n^2 / 2 intervals." },
      { label: "O(n) split points", reason: "For each interval, iterate all possible split positions between i and j." },
      { label: "Total O(n^3)", reason: "n^2 intervals × n split points = O(n^3)." },
      { label: "O(n^2) space", reason: "2D DP table of size n × n." },
    ],
  },
  dryRun: {
    input: "nums = [3, 1, 5, 8] (burst balloons)",
    initialState: "padded = [1, 3, 1, 5, 8, 1], dp all zeros",
    steps: [
      { step: "1", state: "L=2 intervals (burst 1 balloon): dp[1][3]=1*3*1=3, dp[3][5]=5*8*1=40", note: "" },
      { step: "2", state: "L=3 intervals (burst 2 balloons)", note: "" },
      { step: "3", state: "dp[1][4]: split k=2 or k=3", note: "k=2: dp[1][2]+dp[2][4]+3*1*5 = 0 + 15 + 15 = 30; k=3: dp[1][3]+dp[3][4]+3*5*5 = 3 + 0 + 75 = 78" },
      { step: "4", state: "... continue filling by length", note: "" },
      { step: "5", state: "Final dp[0][5] = 167", note: "burst order 1, 5, 3, 8" },
    ],
    output: "167",
  },
  whenToUse: [
    "Matrix chain multiplication variants.",
    "Burst balloons, strange printer, remove boxes.",
    "Palindrome partitioning.",
    "Stone game and card game problems.",
    "Optimal triangulation.",
    "Any problem where the answer splits by a pivot inside the interval.",
  ],
  whenNotToUse: [
    "Subsequence problems (LCS, LIS) — those are different DPs.",
    "Order-independent subset selection — bitmask DP.",
    "n > 500 for O(n^3) — too slow, need different approach.",
    "The problem does not split on a pivot.",
  ],
  mistakes: [
    { mistake: "Filling dp in row-major order (i outer, j inner).", fix: "Fill by LENGTH. dp[i][j] depends on shorter intervals — always compute shorter lengths first." },
    { mistake: "Forgetting the padding for MCM / burst balloons.", fix: "Pad with 1s (or the problem-specific sentinel) so i-1 and j+1 are always valid." },
    { mistake: "Confusing min vs max in the aggregate.", fix: "MCM minimizes cost. Burst balloons maximizes coins. Stone game maximizes score difference. The shape is identical, the aggregate differs." },
    { mistake: "Using dp[i][j] = dp[i][k] + dp[k][j] without merge cost.", fix: "The merge cost is the whole point. Without it, dp[i][j] = 0." },
  ],
  interview: {
    questions: [
      "Burst Balloons (LeetCode 312).",
      "Palindrome Partitioning II (LeetCode 132).",
      "Stone Game (LeetCode 877) and Stone Game VII (LeetCode 1690).",
      "Strange Printer (LeetCode 664).",
      "Remove Boxes (LeetCode 546).",
      "Minimum Score Triangulation of Polygon (LeetCode 1039).",
      "Predict the Winner (LeetCode 486).",
    ],
    observations: [
      "Fill by length — the most common bug is fill order.",
      "Padding trick simplifies boundary conditions.",
      "Some problems need a third dimension (dp[i][j][k]) — e.g., remove boxes with remaining count.",
    ],
    optimizations: [
      "For palindrome partitioning, precompute palindrome table O(n^2) first.",
      "For burst balloons, use the 'reverse' formulation — consider which balloon is burst LAST in each interval.",
      "Some problems allow Knuth optimization — reduces O(n^3) to O(n^2) when the split point is monotone. Rare in interviews.",
    ],
    followUps: [
      "What if n > 500? — O(n^3) too slow. Look for Knuth optimization or a different formulation.",
      "What if the answer needs a specific interval, not the whole range? — track max dp[i][j] across all intervals.",
    ],
  },
  related: [
    { id: "matrix-chain-multiplication", relation: "MCM is the canonical interval DP template" },
    { id: "recursion", relation: "Interval DP is memoized divide-and-conquer on intervals" },
  ],
  practice: [
    { title: "Burst Balloons", difficulty: "Hard", why: "The classic interval DP with padding." },
    { title: "Palindrome Partitioning II", difficulty: "Hard", why: "Palindrome precompute + interval DP for min cuts." },
    { title: "Stone Game", difficulty: "Medium", why: "Interval DP with score difference." },
    { title: "Strange Printer", difficulty: "Hard", why: "Interval DP with cancellation semantics." },
    { title: "Remove Boxes", difficulty: "Hard", why: "3D interval DP — a rare but instructive extension." },
  ],
  revision: {
    takeaways: [
      "dp[i][j] for interval [i, j]. Fill by increasing length.",
      "Try each split k inside (i, j). Combine left and right + merge cost.",
      "O(n^3) time, O(n^2) space.",
      "Padding trick simplifies boundary conditions.",
    ],
    formulas: [
      "dp[i][j] = opt over k of dp[i][k] + dp[k+1][j] + merge_cost(i, k, j)",
      "Fill order: L = 2..n, i = 0..n-L, j = i + L - 1",
    ],
    complexitySummary: "O(n^3) time, O(n^2) space. Optimal for n <= 500.",
    patterns: ["Burst balloons", "Palindrome partition", "Stone game", "Matrix chain", "Polygon triangulation"],
    memoryTrick: "Short intervals first. Split at k. Combine left + right + merge.",
  },
};
