import type { ConceptDetail } from "../../types";

export const unboundedKnapsackDetail: ConceptDetail = {
  id: "unbounded-knapsack",
  overview: {
    essence:
      "Items unlimited. Same DP as 0/1 knapsack, but iterate capacity ASCENDING to allow reuse.",
    what: "Given item weights and values, maximize total value with capacity W, allowing any item to be used unlimited times. Variants: count ways (Coin Change II) or minimize count (Coin Change I).",
    problemSolved:
      "Making change with unlimited coins, cutting rods, choosing pieces to fill a capacity when stock is unlimited.",
    whyImportant:
      "The ascending-vs-descending iteration flip from 0/1 knapsack is the entire conceptual difference. Once seen, dozens of coin-change variants follow.",
    usedIn: [
      "Coin Change (minimum coins)",
      "Coin Change II (count ways)",
      "Rod cutting",
      "Integer break (maximize product)",
      "Perfect squares (min number summing to n)",
      "Word break (build string from dictionary pieces)",
    ],
  },
  intuition: {
    explanation:
      "In 0/1 knapsack you iterate capacity descending so that dp[w - weight] refers to the PREVIOUS row (item used at most once). For unbounded, you iterate ascending: dp[w - weight] refers to the CURRENT row — meaning the same item may already have been used in that cell. The direction of the inner loop is literally the entire difference.",
    analogy:
      "A vending machine that refills instantly. You can put any coin in any number of times. Your DP keeps updating the same row, so a coin already used can be used again.",
  },
  internals: [
    {
      title: "State",
      body: "dp[w] = optimal (max value, min coins, or count of ways) for capacity w using any item unlimited times.",
    },
    {
      title: "Base case",
      body: "dp[0] = 0 (max value / min coins) or dp[0] = 1 (count ways). Non-zero base cases must be handled explicitly.",
    },
    {
      title: "Recurrence (maximize value)",
      body: "For each item (weight wt, value val), for w from wt to W ASCENDING: dp[w] = max(dp[w], dp[w - wt] + val).",
    },
    {
      title: "Recurrence (minimize coins)",
      body: "dp[w] = min(dp[w], dp[w - coin] + 1) with dp[0] = 0, dp[w>0] = INF. Answer -1 if dp[W] = INF.",
    },
    {
      title: "Recurrence (count ways)",
      body: "dp[w] += dp[w - coin] with dp[0] = 1. Outer loop over coins, inner loop ascending over w.",
    },
    {
      title: "Why order matters for counting",
      body: "Outer loop over coins, inner ascending → combinations (Coin Change II). Outer loop over capacity, inner over coins → permutations (Combination Sum IV). Same code, different result.",
    },
    {
      title: "Ascending vs descending",
      body: "Ascending inner w-loop: same item reusable. Descending: at most once. Nothing else changes.",
    },
  ],
  visual: {
    diagram:
      "coins = [1, 2, 5], amount = 11, min coins\n\n" +
      "dp = [0, INF, INF, INF, INF, INF, INF, INF, INF, INF, INF, INF]\n\n" +
      "After processing coin 1 (ascending w):\n" +
      "  dp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]\n\n" +
      "After coin 2 (ascending w):\n" +
      "  dp[2]=min(2, dp[0]+1)=1, dp[3]=min(3, dp[1]+1)=2, dp[4]=min(4, dp[2]+1)=2, ...\n" +
      "  dp = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]\n\n" +
      "After coin 5 (ascending w):\n" +
      "  dp[5]=min(3, dp[0]+1)=1, dp[10]=min(5, dp[5]+1)=2, dp[11]=min(6, dp[6]+1)=3\n" +
      "  dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]\n\n" +
      "Answer = dp[11] = 3 (5+5+1)",
    caption:
      "Ascending w-loop reuses items. dp[w - coin] may already contain the current coin.",
  },
  approach: {
    summary:
      "Same as 0/1 knapsack, but iterate capacity ASCENDING. Pick the correct answer type (max value, min count, count ways) via the update operation inside the loop.",
    steps: [
      "Allocate dp[W+1] with appropriate base: 0 for max value, INF for min count, 1 for count ways.",
      "For each item: for w from weight to W ASCENDING: update dp[w].",
      "Answer = dp[W] after all items processed.",
      "For count ways (combinations), outer loop over items, inner ascending. For count ways (permutations), swap loops.",
    ],
    template: {
      code:
        "# Min coins\n" +
        "def coin_change(coins, amount):\n" +
        "    INF = float('inf')\n" +
        "    dp = [0] + [INF] * amount\n" +
        "    for w in range(1, amount + 1):\n" +
        "        for c in coins:\n" +
        "            if c <= w:\n" +
        "                dp[w] = min(dp[w], dp[w - c] + 1)\n" +
        "    return dp[amount] if dp[amount] < INF else -1",
      notes: [
        "For min coins, either loop order works; ascending amount ensures reusability.",
        "Two loops — order depends on whether you want combinations or permutations.",
      ],
    },
  },
  code: {
    python: {
      code:
        "def coin_change(coins, amount):\n" +
        "    INF = float('inf')\n" +
        "    dp = [0] + [INF] * amount\n" +
        "    for w in range(1, amount + 1):\n" +
        "        for c in coins:\n" +
        "            if c <= w:\n" +
        "                dp[w] = min(dp[w], dp[w - c] + 1)\n" +
        "    return dp[amount] if dp[amount] < INF else -1\n\n" +
        "def coin_change_2(coins, amount):\n" +
        "    # Count combinations (order does not matter)\n" +
        "    dp = [0] * (amount + 1)\n" +
        "    dp[0] = 1\n" +
        "    for c in coins:              # outer: coin\n" +
        "        for w in range(c, amount + 1):  # inner ascending\n" +
        "            dp[w] += dp[w - c]\n" +
        "    return dp[amount]",
      notes: [
        "Coin Change II (count combinations): outer loop over coins prevents counting permutations.",
        "Coin Change I (min coins): outer/inner order does not matter for min.",
      ],
    },
    java: {
      code:
        "int coinChange(int[] coins, int amount) {\n" +
        "    int INF = amount + 1;\n" +
        "    int[] dp = new int[amount + 1];\n" +
        "    java.util.Arrays.fill(dp, INF);\n" +
        "    dp[0] = 0;\n" +
        "    for (int w = 1; w <= amount; w++) {\n" +
        "        for (int c : coins) {\n" +
        "            if (c <= w) dp[w] = Math.min(dp[w], dp[w - c] + 1);\n" +
        "        }\n" +
        "    }\n" +
        "    return dp[amount] == INF ? -1 : dp[amount];\n" +
        "}\n\n" +
        "int coinChange2(int[] coins, int amount) {\n" +
        "    int[] dp = new int[amount + 1];\n" +
        "    dp[0] = 1;\n" +
        "    for (int c : coins)\n" +
        "        for (int w = c; w <= amount; w++)\n" +
        "            dp[w] += dp[w - c];\n" +
        "    return dp[amount];\n" +
        "}",
      notes: [
        "Use amount + 1 as INF to avoid overflow.",
        "Coin Change II requires outer-over-coins to count combinations only.",
      ],
    },
    cpp: {
      code:
        "#include <vector>\n" +
        "#include <algorithm>\n" +
        "\n" +
        "int coin_change(const std::vector<int>& coins, int amount) {\n" +
        "    const int INF = amount + 1;\n" +
        "    std::vector<int> dp(amount + 1, INF);\n" +
        "    dp[0] = 0;\n" +
        "    for (int w = 1; w <= amount; w++)\n" +
        "        for (int c : coins)\n" +
        "            if (c <= w) dp[w] = std::min(dp[w], dp[w - c] + 1);\n" +
        "    return dp[amount] == INF ? -1 : dp[amount];\n" +
        "}\n",
      notes: [
        "Use amount + 1 as INF to avoid overflow when adding 1.",
        "Reverse loop is for 0/1; ascending loop reuses items (unbounded).",
      ],
    },
  },
  complexity: {
    best: "O(n * W)",
    average: "O(n * W)",
    worst: "O(n * W)",
    auxiliary: "O(W)",
    total: "O(n * W) time, O(W) space",
    why: [
      {
        label: "O(n * W) time",
        reason:
          "n items × W capacities. Ascending iteration does not change the count.",
      },
      {
        label: "O(W) space",
        reason:
          "Single array of size W+1. Full table not needed since we are not reconstructing.",
      },
      {
        label: "Same asymptotic as 0/1",
        reason:
          "Direction of the inner loop does not affect the total cell count.",
      },
    ],
  },
  dryRun: {
    input: "coins = [1, 2, 5], amount = 11",
    initialState:
      "dp = [0, INF, INF, INF, INF, INF, INF, INF, INF, INF, INF, INF]",
    steps: [
      { step: "1", state: "w=1: dp[1] = min(INF, dp[0]+1) = 1", note: "" },
      {
        step: "2",
        state: "w=2: dp[2] = min(INF, dp[1]+1) = 2, then min(2, dp[0]+1) = 1",
        note: "",
      },
      {
        step: "3",
        state: "w=5: dp[5] = min from dp[4]+1=5, dp[3]+1=3, dp[0]+1=1 → 1",
        note: "",
      },
      {
        step: "4",
        state: "w=11: min of dp[10]+1, dp[9]+1, dp[6]+1 = 3",
        note: "",
      },
    ],
    output: "3 (5 + 5 + 1)",
  },
  whenToUse: [
    "Items are unlimited in quantity.",
    "Making change (any coin, any number of times).",
    "Counting combinations (outer over items) or permutations (inner over items).",
    "Minimizing count (coin change I).",
    "Maximizing value (rod cutting, integer break).",
  ],
  whenNotToUse: [
    "Each item once — 0/1 knapsack (descending w).",
    "Items are divisible — greedy on value/weight ratio.",
    "Huge amount (10^9) — pseudo-polynomial blows up. Use math or BFS depending on problem.",
  ],
  mistakes: [
    {
      mistake: "Using descending w-loop — accidentally makes it 0/1 knapsack.",
      fix: "Ascending for unbounded, descending for 0/1. That single direction is the difference.",
    },
    {
      mistake: "Wrong loop order for counting combinations.",
      fix: "Coin Change II wants combinations → outer loop over coins. Inner ascending over amount. Swapping gives permutations.",
    },
    {
      mistake: "Forgetting dp[0] = 1 in count problems.",
      fix: "Empty subset is one way. Without dp[0] = 1, all counts remain 0.",
    },
    {
      mistake: "Using INF as Integer.MAX_VALUE and adding to it → overflow.",
      fix: "Use amount + 1 as a safe INF.",
    },
  ],
  interview: {
    questions: [
      "Coin Change (LeetCode 322) — min coins.",
      "Coin Change II (LeetCode 518) — count combinations.",
      "Combination Sum IV (LeetCode 377) — count permutations.",
      "Perfect Squares (LeetCode 279) — min count summing to n.",
      "Integer Break (LeetCode 343) — max product.",
      "Word Break (LeetCode 139) — check if buildable.",
    ],
    observations: [
      "Same DP shape, three questions: max value, min count, count ways.",
      "Loop order matters ONLY for counting (combinations vs permutations).",
      "For min, either order works.",
    ],
    optimizations: [
      "For Coin Change (min), either loop order works — pick the clearer one.",
      "For Coin Change II, outer over coins is mandatory.",
      "BFS can solve min-coins when amounts are large but coin values small.",
    ],
    followUps: [
      "What if you want combinations vs permutations? — swap loops.",
      "What if a coin can only be used twice? — bounded knapsack (harder, use monotone deque).",
    ],
  },
  related: [
    { id: "knapsack-01", relation: "Unbounded = same DP but ascending w" },
  ],
  practice: [
    {
      title: "Coin Change",
      difficulty: "Medium",
      why: "Min coins — the canonical unbounded knapsack.",
    },
    {
      title: "Coin Change II",
      difficulty: "Medium",
      why: "Count combinations — outer over coins matters.",
    },
    {
      title: "Perfect Squares",
      difficulty: "Medium",
      why: "Min count of square-number pieces.",
    },
    {
      title: "Combination Sum IV",
      difficulty: "Medium",
      why: "Count permutations — swap loop order from Coin Change II.",
    },
    {
      title: "Word Break",
      difficulty: "Medium",
      why: "Boolean unbounded knapsack with strings.",
    },
  ],
  revision: {
    takeaways: [
      "Unbounded knapsack: ascending w-loop.",
      "Same DP shape as 0/1, just direction flip.",
      "Loop order matters only for counting.",
      "O(n × W) time, O(W) space.",
    ],
    formulas: [
      "Ascending: dp[w] = f(dp[w], dp[w - weight] + value)",
      "Combinations: outer items, inner ascending w",
      "Permutations: outer w, inner items",
    ],
    complexitySummary: "O(n × W) time. O(W) space.",
    patterns: ["Coin change", "Count ways", "Unbounded selection"],
    memoryTrick:
      "Ascending w reuses items. Descending w forbids reuse. That is 0/1 vs unbounded.",
  },
};
