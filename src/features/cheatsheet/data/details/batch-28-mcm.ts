import type { ConceptDetail } from "../../types";

export const matrixChainMultiplicationDetail: ConceptDetail = {
  id: "matrix-chain-multiplication",
  overview: {
    essence:
      "Optimal parenthesization of matrix chain via interval DP. dp[i][j] = min split cost. O(n³).",
    what: "Given a sequence of matrices A1 × A2 × ... × An with dimensions p[0]..p[n], find the parenthesization minimizing scalar multiplications. Standard interval DP.",
    problemSolved:
      "Matrix multiplication is associative — (AB)C = A(BC) — but costs differ dramatically. A(1x100 × 100x1) × (1x100) costs 200 vs much more for other orders. Finding the optimal order is MCM.",
    whyImportant:
      "The template for interval DP: dp[i][j] = min over splits k of (dp[i][k] + dp[k+1][j] + merge cost). Once known, burst balloons, palindrome partitioning, and strange printer all follow.",
    usedIn: [
      "Optimal matrix multiplication order",
      "Burst Balloons (LeetCode 312) — interval DP variant",
      "Palindrome Partitioning II (minimum cuts)",
      "Strange Printer",
      "Minimum Score Triangulation of Polygon",
    ],
  },
  intuition: {
    explanation:
      "The final multiplication merges two sub-chains: (A1..Ak) × (A(k+1)..An). So the total cost is (cost of left) + (cost of right) + (cost of merging the two results). Try every split k. Recurse. Memoize. Result is a 2D interval table: dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]. Fill by increasing interval length.",
    analogy:
      "Parenthesizing an expression. For a+b+c+d, you could group ((a+b)+c)+d or (a+b)+(c+d). Same value, different structure. For matrices, different costs. Interval DP finds the cheapest grouping.",
  },
  internals: [
    {
      title: "State",
      body: "dp[i][j] = minimum cost to multiply matrices i through j (1-indexed). dp[i][i] = 0 (single matrix, no multiplication).",
    },
    {
      title: "Recurrence",
      body: "dp[i][j] = min over k in [i, j-1] of dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j].",
    },
    {
      title: "Fill order",
      body: "By increasing interval length. For each length L = 2..n, for each start i, j = i + L - 1. Fill all cells of that length before longer ones.",
    },
    {
      title: "The base case",
      body: "dp[i][i] = 0 — one matrix needs no multiplication cost.",
    },
    {
      title: "Why min, not max",
      body: "MCM minimizes. Other interval DPs (e.g., strange printer) may maximize or count; the shape is identical, the aggregate differs.",
    },
    {
      title: "Matrix dimensions",
      body: "n matrices need n+1 dimensions p[0]..p[n]. Matrix i has dimensions p[i-1] × p[i].",
    },
  ],
  visual: {
    diagram:
      "Matrices A1 (10x30), A2 (30x5), A3 (5x60)\n" +
      "Dimensions array: p = [10, 30, 5, 60], n = 3\n\n" +
      "dp[i][i] = 0 (base)\n\n" +
      "Length 2:\n" +
      "  dp[1][2] = p[0]*p[1]*p[2] = 10*30*5 = 1500\n" +
      "  dp[2][3] = p[1]*p[2]*p[3] = 30*5*60 = 9000\n\n" +
      "Length 3:\n" +
      "  dp[1][3] via k=1: dp[1][1] + dp[2][3] + p[0]*p[1]*p[3]\n" +
      "         = 0 + 9000 + 10*30*60 = 27000\n" +
      "  dp[1][3] via k=2: dp[1][2] + dp[3][3] + p[0]*p[2]*p[3]\n" +
      "         = 1500 + 0 + 10*5*60 = 4500\n" +
      "  Answer = 4500 (order: A1 × (A2 × A3))",
    caption:
      "Fill dp by increasing interval length. dp[1][n] is the final answer.",
  },
  approach: {
    summary:
      "dp[i][j] = min over split k of dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]. Fill by increasing length. Answer = dp[1][n].",
    steps: [
      "p array has n+1 values for n matrices.",
      "dp = [[0] * (n+1) for _ in range(n+1)] (1-indexed).",
      "For length L in 2..n: for i in 1..n-L+1: j = i+L-1.",
      "  dp[i][j] = min over k in i..j-1 of dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]",
      "Answer = dp[1][n].",
    ],
    template: {
      code:
        "def matrix_chain_order(p):\n" +
        "    n = len(p) - 1\n" +
        "    dp = [[0] * (n + 1) for _ in range(n + 1)]\n" +
        "    for L in range(2, n + 1):\n" +
        "        for i in range(1, n - L + 2):\n" +
        "            j = i + L - 1\n" +
        "            dp[i][j] = float('inf')\n" +
        "            for k in range(i, j):\n" +
        "                cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]\n" +
        "                dp[i][j] = min(dp[i][j], cost)\n" +
        "    return dp[1][n]",
      notes: [
        "Length loop ensures shorter intervals are filled before longer ones.",
        "O(n^3) time, O(n^2) space.",
      ],
    },
  },
  code: {
    python: {
      code:
        "def matrix_chain_order(p):\n" +
        "    n = len(p) - 1\n" +
        "    dp = [[0] * (n + 1) for _ in range(n + 1)]\n" +
        "    for L in range(2, n + 1):\n" +
        "        for i in range(1, n - L + 2):\n" +
        "            j = i + L - 1\n" +
        "            dp[i][j] = float('inf')\n" +
        "            for k in range(i, j):\n" +
        "                dp[i][j] = min(\n" +
        "                    dp[i][j],\n" +
        "                    dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]\n" +
        "                )\n" +
        "    return dp[1][n]\n\n" +
        "# Example: matrices with dims [10,30,5,60]\n" +
        "# matrix_chain_order([10,30,5,60]) == 4500",
      notes: [
        "To reconstruct the parenthesization, also store the split point k that achieves the minimum.",
        "Extension: MCM applies to any 'merge two intervals' problem — burst balloons, strange printer, polygon triangulation.",
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
      {
        label: "O(n^3) time",
        reason: "n^2 cells × O(n) split points each = O(n^3).",
      },
      { label: "O(n^2) space", reason: "2D DP table of size n × n." },
      {
        label: "MCM is polynomial",
        reason:
          "Unlike many combinatorial problems, matrix chain order is polynomial because the DP has optimal substructure and no cycles.",
      },
    ],
  },
  dryRun: {
    input: "p = [10, 30, 5, 60] (3 matrices: 10x30, 30x5, 5x60)",
    initialState: "dp all zeros, n = 3",
    steps: [
      { step: "1", state: "L=2: dp[1][2] = 10*30*5 = 1500", note: "A1×A2" },
      { step: "2", state: "L=2: dp[2][3] = 30*5*60 = 9000", note: "A2×A3" },
      {
        step: "3",
        state: "L=3, k=1: 0 + 9000 + 10*30*60 = 27000",
        note: "(A1×A2)×A3",
      },
      {
        step: "4",
        state: "L=3, k=2: 1500 + 0 + 10*5*60 = 4500",
        note: "A1×(A2×A3)",
      },
    ],
    output: "dp[1][3] = 4500 (best: A1 × (A2 × A3))",
  },
  whenToUse: [
    "Optimal parenthesization of a sequence of operations.",
    "Interval DP where the merge cost depends on the split point.",
    "Burst balloons, strange printer, polygon triangulation, palindrome partitioning.",
  ],
  whenNotToUse: [
    "Matrices can be reordered (permutation allowed) — need different algorithm.",
    "Non-associative operation — MCM does not apply.",
    "Small n — brute force enumeration of parenthesizations (Catalan number, but small) works.",
  ],
  mistakes: [
    {
      mistake: "Filling dp left-to-right instead of by length.",
      fix: "dp[i][j] depends on shorter intervals. Fill by increasing length.",
    },
    {
      mistake: "Off-by-one on the dimension array.",
      fix: "n matrices need n+1 dimensions. Matrix i (1-indexed) has dims p[i-1] × p[i].",
    },
    {
      mistake: "Confusing cost formula.",
      fix: "Merge cost for A(i..k) × A(k+1..j) is p[i-1] * p[k] * p[j], not p[i] * p[k] * p[j].",
    },
  ],
  interview: {
    questions: [
      "Matrix Chain Multiplication (classic interview).",
      "Burst Balloons (LeetCode 312) — interval DP variant.",
      "Palindrome Partitioning II (LeetCode 132) — min cuts.",
      "Strange Printer (LeetCode 664).",
      "Minimum Score Triangulation of Polygon (LeetCode 1039).",
      "Remove Boxes (LeetCode 546).",
    ],
    observations: [
      "The pattern is: dp[i][j] = min/max over split k of (dp[i][k] + dp[k+1][j] + cost).",
      "Burst balloons adds a padding of 1 at both ends (or treats out-of-bounds as 1).",
      "Palindrome partitioning uses interval DP but with a boolean palindrome check.",
    ],
    optimizations: [
      "For true matrix chain, consider Strassen or other matrix multiplication algorithms — MCM only optimizes ordering.",
      "For palindrome partitioning, precompute palindrome table in O(n^2) then DP.",
    ],
    followUps: [
      "What if matrices can be permuted? — different problem (matrix chain with reordering).",
      "What about unbounded chain length? — always O(n^3) for standard MCM.",
    ],
  },
  related: [
    { id: "lcs", relation: "Both are 2D DP but MCM uses interval ordering" },
  ],
  practice: [
    {
      title: "Burst Balloons",
      difficulty: "Hard",
      why: "The most-asked MCM-shaped problem.",
    },
    {
      title: "Palindrome Partitioning II",
      difficulty: "Hard",
      why: "Interval DP with palindrome precomputation.",
    },
    {
      title: "Strange Printer",
      difficulty: "Hard",
      why: "MCM structure with print-cancellation semantics.",
    },
    {
      title: "Minimum Score Triangulation of Polygon",
      difficulty: "Medium",
      why: "MCM pattern with polygon vertices.",
    },
  ],
  revision: {
    takeaways: [
      "Interval DP: dp[i][j] = min over split k of (dp[i][k] + dp[k+1][j] + merge cost).",
      "Fill by increasing interval length.",
      "O(n^3) time, O(n^2) space.",
      "Base of burst balloons, strange printer, polygon triangulation.",
    ],
    formulas: [
      "dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]",
      "Length loop outer, start loop middle, split loop inner",
    ],
    complexitySummary: "O(n^3) time, O(n^2) space.",
    patterns: ["Interval DP", "Optimal parenthesization", "Burst balloons"],
    memoryTrick:
      "Interval DP: shorter intervals first, split point in the middle.",
  },
};
