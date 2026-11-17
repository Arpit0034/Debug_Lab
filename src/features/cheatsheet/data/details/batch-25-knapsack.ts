import type { ConceptDetail } from "../../types";

export const knapsackDetail: ConceptDetail = {
  id: "knapsack-01",
  overview: {
    essence:
      "Each item at most once. Maximize value within weight capacity. 2D DP with 1D rolling array.",
    what: "0/1 Knapsack: given n items with weight[i] and value[i], and a knapsack of capacity W, choose a subset maximizing total value while total weight ≤ W. Each item is either taken or not.",
    problemSolved:
      "Resource allocation with indivisible items. The base pattern for subset-sum, target-sum, partition, and any binary-choice DP with a capacity constraint.",
    whyImportant:
      "The most-asked DP pattern after LCS. Once the 2D table and the 1D rolling-array optimization are internalized, dozens of variants follow: partition equal subset sum, target sum, last stone weight II, ones and zeroes, profitable schemes.",
    usedIn: [
      "Subset sum / partition equal subset sum",
      "Target sum (+/- signs)",
      "Last stone weight II (minimize difference)",
      "Ones and zeroes (2D capacity)",
      "Profitable schemes (2D capacity)",
      "Assign cookies / maximum units on a truck (greedy variants)",
    ],
  },
  intuition: {
    explanation:
      "Consider items in order. For each item i and capacity w: either skip it (value = dp[i-1][w]) or take it if it fits (value = dp[i-1][w - weight[i]] + value[i]). Take the max. The 'w - weight[i]' lookup asks 'what is the best I could do with the remaining capacity, using only earlier items?' — this is the subproblem separation that makes 0/1 knapsack work.",
    analogy:
      "A thief with a bag of fixed capacity. For each item, decide: put it in or leave it. If you put it in, you have less room for future items — the DP table remembers the best trade-off for every possible remaining capacity.",
  },
  internals: [
    {
      title: "State",
      body: "dp[i][w] = maximum value achievable using items 0..i-1 with total weight ≤ w.",
    },
    {
      title: "Base cases",
      body: "dp[0][w] = 0 for all w (no items). dp[i][0] = 0 for all i (no capacity).",
    },
    {
      title: "Recurrence",
      body: "dp[i][w] = dp[i-1][w] (skip item) — then if weight[i-1] ≤ w, dp[i][w] = max(dp[i][w], dp[i-1][w - weight[i-1]] + value[i-1]) (take item).",
    },
    {
      title: "Answer",
      body: "dp[n][W] — bottom-right cell — is the maximum value.",
    },
    {
      title: "1D rolling array optimization",
      body: "Process items one at a time. Keep a single array dp[w] of size W+1. Iterate w from W DOWN to weight[i]. Descending order prevents reusing the same item (which would be unbounded knapsack, a different problem).",
    },
    {
      title: "Descending vs ascending w",
      body: "0/1 knapsack iterates w DESCENDING. Unbounded knapsack iterates w ASCENDING. This single direction flip distinguishes the two problems.",
    },
    {
      title: "Reconstruction",
      body: "Needs the full 2D table. Walk back from (n, W): if dp[i][w] != dp[i-1][w], item i was taken; subtract its weight and continue.",
    },
  ],
  visual: {
    diagram:
      "items: [(w=1,v=1), (w=3,v=4), (w=4,v=5), (w=5,v=7)], W=7\n\n" +
      "       w=0  1  2  3  4  5  6  7\n" +
      "  i=0   0  0  0  0  0  0  0  0   (no items)\n" +
      "  i=1   0  1  1  1  1  1  1  1   (item 0: w=1,v=1)\n" +
      "  i=2   0  1  1  4  5  5  5  5   (item 1: w=3,v=4)\n" +
      "  i=3   0  1  1  4  5  6  6  9   (item 2: w=4,v=5)\n" +
      "  i=4   0  1  1  4  5  7  8  9   (item 3: w=5,v=7)\n\n" +
      "dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i-1]] + value[i-1])\n" +
      "Answer = dp[4][7] = 9\n\n" +
      "1D version: iterate w DESCENDING to avoid reusing item\n" +
      "  dp[w] = max(dp[w], dp[w - weight[i]] + value[i])   for w = W down to weight[i]",
    caption:
      "Fill row by row. Each cell depends on the row above (skip) and the row above at w - weight (take).",
  },
  approach: {
    summary:
      "2D DP: dp[i][w] = max(skip, take if fits). 1D version: iterate w descending. Answer = dp[W] after processing all items.",
    steps: [
      "Allocate dp[n+1][W+1] initialized to 0 (or dp[W+1] for 1D).",
      "For i in 1..n: for w in 0..W:",
      "  1D version: iterate w from W down to weight[i-1] (DESCENDING is critical).",
      "  dp[w] = max(dp[w], dp[w - weight[i-1]] + value[i-1]) if weight[i-1] <= w",
      "Answer = dp[W] (or dp[n][W] for 2D).",
    ],
    template: {
      code:
        "def knapsack_2d(weights, values, W):\n" +
        "    n = len(weights)\n" +
        "    dp = [[0] * (W + 1) for _ in range(n + 1)]\n" +
        "    for i in range(1, n + 1):\n" +
        "        for w in range(W + 1):\n" +
        "            dp[i][w] = dp[i-1][w]  # skip\n" +
        "            if weights[i-1] <= w:\n" +
        "                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])\n" +
        "    return dp[n][W]\n\n" +
        "def knapsack_1d(weights, values, W):\n" +
        "    dp = [0] * (W + 1)\n" +
        "    for i in range(len(weights)):\n" +
        "        for w in range(W, weights[i] - 1, -1):  # DESCENDING\n" +
        "            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])\n" +
        "    return dp[W]",
      notes: [
        "1D is standard. 2D needed for reconstruction.",
        "Descending w iteration prevents reusing the same item.",
      ],
    },
  },
  code: {
    python: {
      code:
        "def knapsack_01(weights, values, W):\n" +
        "    n = len(weights)\n" +
        "    dp = [0] * (W + 1)\n" +
        "    for i in range(n):\n" +
        "        w_i, v_i = weights[i], values[i]\n" +
        "        for w in range(W, w_i - 1, -1):\n" +
        "            dp[w] = max(dp[w], dp[w - w_i] + v_i)\n" +
        "    return dp[W]\n\n" +
        "def can_partition(nums):\n" +
        "    total = sum(nums)\n" +
        "    if total % 2 != 0: return False\n" +
        "    target = total // 2\n" +
        "    dp = [False] * (target + 1)\n" +
        "    dp[0] = True\n" +
        "    for n in nums:\n" +
        "        for w in range(target, n - 1, -1):\n" +
        "            dp[w] = dp[w] or dp[w - n]\n" +
        "    return dp[target]",
      notes: [
        "LeetCode 416 — Partition Equal Subset Sum is 0/1 knapsack where value=weight and target = sum/2.",
        "Range direction matters: descending for 0/1, ascending for unbounded.",
      ],
    },
    java: {
      code:
        "int knapsack01(int[] weights, int[] values, int W) {\n" +
        "    int[] dp = new int[W + 1];\n" +
        "    for (int i = 0; i < weights.length; i++) {\n" +
        "        for (int w = W; w >= weights[i]; w--) {\n" +
        "            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n" +
        "        }\n" +
        "    }\n" +
        "    return dp[W];\n" +
        "}\n\n" +
        "boolean canPartition(int[] nums) {\n" +
        "    int total = 0;\n" +
        "    for (int n : nums) total += n;\n" +
        "    if (total % 2 != 0) return false;\n" +
        "    int target = total / 2;\n" +
        "    boolean[] dp = new boolean[target + 1];\n" +
        "    dp[0] = true;\n" +
        "    for (int n : nums) {\n" +
        "        for (int w = target; w >= n; w--) {\n" +
        "            dp[w] = dp[w] || dp[w - n];\n" +
        "        }\n" +
        "    }\n" +
        "    return dp[target];\n" +
        "}",
      notes: [
        "Reverse w-loop is critical. Ascending would allow taking the same item multiple times.",
      ],
    },
    cpp: {
      code:
        "#include <vector>\n" +
        "#include <algorithm>\n" +
        "#include <numeric>\n\n" +
        "int knapsack_01(const std::vector<int>& weights,\n" +
        "                const std::vector<int>& values, int W) {\n" +
        "    std::vector<int> dp(W + 1, 0);\n" +
        "    for (size_t i = 0; i < weights.size(); i++) {\n" +
        "        for (int w = W; w >= weights[i]; w--) {\n" +
        "            dp[w] = std::max(dp[w], dp[w - weights[i]] + values[i]);\n" +
        "        }\n" +
        "    }\n" +
        "    return dp[W];\n" +
        "}\n\n" +
        "bool can_partition(const std::vector<int>& nums) {\n" +
        "    int total = std::accumulate(nums.begin(), nums.end(), 0);\n" +
        "    if (total % 2 != 0) return false;\n" +
        "    int target = total / 2;\n" +
        "    std::vector<bool> dp(target + 1, false);\n" +
        "    dp[0] = true;\n" +
        "    for (int n : nums)\n" +
        "        for (int w = target; w >= n; w--)\n" +
        "            dp[w] = dp[w] || dp[w - n];\n" +
        "    return dp[target];\n" +
        "}",
      notes: [
        "std::vector<bool> is bit-packed; use uint8_t vector if you need reference semantics.",
        "Reverse w-loop for 0/1 knapsack.",
      ],
    },
  },
  languageNotes: [
    "Python: reversed range via range(W, weight - 1, -1). Note the -1 stop offset.",
    "Java: same — for (int w = W; w >= weight; w--).",
    "C++: same — for (int w = W; w >= weight; w--). All three languages use the same descending iteration for 0/1.",
  ],
  complexity: {
    best: "O(n × W)",
    average: "O(n × W)",
    worst: "O(n × W)",
    auxiliary: "O(n × W) full table · O(W) with 1D rolling array",
    total: "O(n × W) time, O(W) space (O(n × W) for reconstruction)",
    why: [
      {
        label: "O(n × W) time",
        reason: "n items × W capacities. Each cell is O(1) work.",
      },
      {
        label: "O(W) space for 1D",
        reason:
          "Each row only depends on the previous row. Overwrite in place.",
      },
      {
        label: "Why not better than O(n × W)",
        reason:
          "0/1 knapsack is NP-hard in general — O(n × W) is pseudo-polynomial, fast when W is small.",
      },
      {
        label: "Reconstruction needs O(n × W)",
        reason:
          "Backtracking requires the full table. 1D DP cannot reconstruct.",
      },
    ],
  },
  dryRun: {
    input: "weights = [1, 3, 4, 5], values = [1, 4, 5, 7], W = 7",
    initialState: "dp = [0, 0, 0, 0, 0, 0, 0, 0] (index 0..7)",
    steps: [
      {
        step: "1",
        state: "item 0 (w=1,v=1): w=7..1 → dp[w] = max(dp[w], dp[w-1]+1)",
        note: "dp = [0,1,1,1,1,1,1,1]",
      },
      {
        step: "2",
        state: "item 1 (w=3,v=4): w=7..3 → dp[w] = max(dp[w], dp[w-3]+4)",
        note: "dp = [0,1,1,4,5,5,5,5]",
      },
      {
        step: "3",
        state: "item 2 (w=4,v=5): w=7..4 → dp[w] = max(dp[w], dp[w-4]+5)",
        note: "dp = [0,1,1,4,5,6,6,9]",
      },
      {
        step: "4",
        state: "item 3 (w=5,v=7): w=7..5 → dp[w] = max(dp[w], dp[w-5]+7)",
        note: "dp = [0,1,1,4,5,7,8,9]",
      },
    ],
    output: "dp[7] = 9 (items with weights 3 and 4, values 4 and 5)",
  },
  whenToUse: [
    "Choose subset with weight constraint.",
    "Subset sum / partition equal subset sum.",
    "Target sum (assign + or - signs).",
    "Ones and zeroes (2D capacity).",
    "Profitable schemes (2D capacity).",
    "Any 'each item taken at most once' with a capacity.",
  ],
  whenNotToUse: [
    "Unbounded knapsack — items can be used multiple times. Iterate w ASCENDING.",
    "Fractional knapsack — items are divisible. Use greedy by value/weight ratio.",
    "No capacity constraint — just sum values.",
    "Huge W (> 10^6) with many items — pseudo-polynomial time blows up. Use branch and bound or approximation.",
  ],
  mistakes: [
    {
      mistake: "Iterating w ascending in 0/1 knapsack.",
      fix: "Ascending allows reusing the same item. Always iterate w DESCENDING for 0/1.",
    },
    {
      mistake: "Confusing 0/1 with unbounded knapsack.",
      fix: "0/1: each item once → descending w. Unbounded: item reusable → ascending w. The direction is the whole difference.",
    },
    {
      mistake: "Forgetting the base row/column in 2D.",
      fix: "dp[0][w] = 0 and dp[i][0] = 0. Otherwise cells are uninitialized.",
    },
    {
      mistake: "Off-by-one on the weight index.",
      fix: "weight[i-1] not weight[i] when iterating i from 1 to n. Same for value.",
    },
  ],
  interview: {
    questions: [
      "Partition Equal Subset Sum (LeetCode 416) — 0/1 knapsack in disguise.",
      "Target Sum (LeetCode 494) — reduce to subset sum.",
      "Last Stone Weight II (LeetCode 1049) — minimize subset sum difference.",
      "Ones and Zeroes (LeetCode 474) — 2D capacity version.",
      "Profitable Schemes (LeetCode 879) — 2D capacity with counting.",
      "Coin Change II (LeetCode 518) — unbounded, not 0/1.",
      "Combination Sum IV (LeetCode 377) — unbounded with ordering.",
    ],
    observations: [
      "Many problems reduce to 0/1 knapsack once you see the 'select subset with a constraint' shape.",
      "Ascending vs descending w-loop distinguishes 0/1 from unbounded.",
      "Pseudo-polynomial: O(n × W) is fast when W is small, exponential when W is huge.",
    ],
    optimizations: [
      "1D rolling array drops space to O(W).",
      "Bitset for boolean knapsack reduces constant factor.",
      "Bitset with __builtin_popcount / bit shifting for subset sums on 64-bit words.",
    ],
    followUps: [
      "What if items have two constraints (weight + volume)? — 2D capacity → dp[i][w1][w2].",
      "What if each item can be taken multiple times? — unbounded (ascending w).",
      "What if you also need the subset? — 2D table + backtrack.",
    ],
  },
  related: [
    {
      id: "lcs",
      relation: "Both are 2D DP with the same reconstruction trick",
    },
  ],
  practice: [
    {
      title: "Partition Equal Subset Sum",
      difficulty: "Medium",
      why: "The cleanest reduction to 0/1 knapsack.",
    },
    {
      title: "Target Sum",
      difficulty: "Medium",
      why: "Reduces to subset sum via algebra.",
    },
    {
      title: "Last Stone Weight II",
      difficulty: "Medium",
      why: "Minimize the difference — subset sum variant.",
    },
    {
      title: "Ones and Zeroes",
      difficulty: "Medium",
      why: "2D capacity version — dp[i][j] for zeros and ones.",
    },
    {
      title: "Profitable Schemes",
      difficulty: "Hard",
      why: "2D capacity plus counting — requires careful state design.",
    },
  ],
  revision: {
    takeaways: [
      "0/1 knapsack: each item at most once.",
      "1D rolling array with w DESCENDING — critical.",
      "O(n × W) time. Pseudo-polynomial.",
      "Many subset-sum variants reduce to it.",
    ],
    formulas: [
      "dp[w] = max(dp[w], dp[w - weight[i]] + value[i])",
      "Descending w-loop prevents item reuse",
      "Partition Equal Subset Sum: target = total / 2",
      "Target Sum: offset by sum(a), reduce to subset sum",
    ],
    complexitySummary:
      "O(n × W) time, O(W) space (1D). O(n × W) space for reconstruction.",
    patterns: [
      "Subset selection",
      "Subset sum",
      "Target sum",
      "Minimize difference",
    ],
    memoryTrick:
      "Take or skip. Descending w prevents reuse. 0/1 = descending, unbounded = ascending.",
  },
};
