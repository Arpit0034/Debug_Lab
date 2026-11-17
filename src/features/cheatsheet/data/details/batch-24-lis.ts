import type { ConceptDetail } from "../../types";

export const lisDetail: ConceptDetail = {
  id: "lis",
  overview: {
    essence:
      "Longest strictly increasing subsequence. O(n²) DP or O(n log n) patience sorting with binary search.",
    what: "Longest Increasing Subsequence: the longest subsequence where each element is strictly greater than the previous, preserving input order.",
    problemSolved:
      "Measures the amount of structure in a sequence, and is the base for problems like maximum non-overlapping intervals, minimum insertions to sort, and box stacking.",
    whyImportant:
      "The O(n log n) patience sorting algorithm is a beautiful application of binary search. And the O(n^2) DP is one of the most-tested recurrence shapes in interviews.",
    usedIn: [
      "Longest increasing subsequence problems",
      "Russian doll envelopes (2D LIS)",
      "Minimum insertions to make a sequence sorted",
      "Building bridges without crossings",
      "Longest increasing path in a matrix",
    ],
  },
  intuition: {
    explanation:
      "For O(n^2): consider each element as the potential end of an increasing subsequence. dp[i] = 1 + max(dp[j] for j < i and a[j] < a[i]). If no such j, dp[i] = 1. Answer = max over all i. For O(n log n): maintain a sorted array of the smallest possible tail of an increasing subsequence of each length. For each element, binary-search for its position and replace, or append if larger. The array length is the LIS length, though the array itself is not the LIS.",
    analogy:
      "Patience sorting. Deal cards one at a time, each on the leftmost pile whose top is greater than the card. If no such pile, start a new one. The number of piles is the LIS length.",
  },
  internals: [
    {
      title: "O(n^2) DP",
      body: "dp[i] = LIS ending at index i. For each i, scan j < i with a[j] < a[i], take max(dp[j]) + 1. Answer = max(dp).",
    },
    {
      title: "O(n log n) tails array",
      body: "Maintain tails[], where tails[k] = smallest possible tail of an increasing subsequence of length k+1. Tails is always sorted.",
    },
    {
      title: "Binary search per element",
      body: "For each x in a: find first position where tails[pos] >= x (lower_bound). Replace tails[pos] = x. If no such pos, append. Length of tails = LIS length.",
    },
    {
      title: "The tails array is not the LIS",
      body: "Tails holds minimal tails of subsequences at each length, not the actual LIS. To reconstruct, need parent pointers.",
    },
    {
      title: "Strict vs non-strict",
      body: "For strictly increasing, use lower_bound (first >= x). For non-decreasing (allow equals), use upper_bound (first > x).",
    },
    {
      title: "2D LIS (Russian doll envelopes)",
      body: "Sort by width ascending, and for equal widths sort by height DESCENDING. Then run LIS on heights. The descending tiebreak prevents two envelopes with the same width from being chained.",
    },
  ],
  visual: {
    diagram:
      "a = [10, 9, 2, 5, 3, 7, 101, 18]\n\n" +
      "O(n^2) DP:\n" +
      "  dp[0]=1 (10)\n" +
      "  dp[1]=1 (9)    — 9 < 10, cannot extend\n" +
      "  dp[2]=1 (2)    — 2 < all previous\n" +
      "  dp[3]=2 (5)    — extend dp[2]\n" +
      "  dp[4]=2 (3)    — extend dp[2]\n" +
      "  dp[5]=3 (7)    — extend dp[4] (3) or dp[3] (5)\n" +
      "  dp[6]=4 (101)  — extend dp[5]\n" +
      "  dp[7]=4 (18)   — extend dp[5]\n" +
      "  Answer = 4 (e.g., 2, 3, 7, 101)\n\n" +
      "O(n log n) patience sorting:\n" +
      "  x=10 → tails=[10]\n" +
      "  x=9  → replace 10 with 9 → [9]\n" +
      "  x=2  → replace 9 with 2 → [2]\n" +
      "  x=5  → append → [2, 5]\n" +
      "  x=3  → replace 5 with 3 → [2, 3]\n" +
      "  x=7  → append → [2, 3, 7]\n" +
      "  x=101→ append → [2, 3, 7, 101]\n" +
      "  x=18 → replace 101 with 18 → [2, 3, 7, 18]\n" +
      "  len(tails) = 4",
    caption:
      "The tails array length is the LIS length. The array itself is not the LIS.",
  },
  approach: {
    summary:
      "O(n^2): dp[i] = 1 + max(dp[j] for j < i with a[j] < a[i]), answer max(dp). O(n log n): maintain sorted tails, binary-search each x, replace or append.",
    steps: [
      "O(n^2): allocate dp = [1] * n. For i in range(n): for j in range(i): if a[j] < a[i]: dp[i] = max(dp[i], dp[j] + 1). Return max(dp).",
      "O(n log n): tails = []. For each x: pos = lower_bound(tails, x). If pos == len(tails): tails.append(x) else tails[pos] = x.",
      "Return len(tails).",
    ],
    template: {
      code:
        "from bisect import bisect_left\n\n" +
        "def lis_length(a):\n" +
        "    tails = []\n" +
        "    for x in a:\n" +
        "        pos = bisect_left(tails, x)\n" +
        "        if pos == len(tails):\n" +
        "            tails.append(x)\n" +
        "        else:\n" +
        "            tails[pos] = x\n" +
        "    return len(tails)",
      notes: [
        "bisect_left for strictly increasing. Use bisect_right (upper_bound) for non-decreasing.",
        "tails[] is not the LIS — it holds minimal tails per length.",
      ],
    },
  },
  code: {
    python: {
      code:
        "from bisect import bisect_left\n\n" +
        "def lis_n2(a):\n" +
        "    n = len(a)\n" +
        "    if n == 0: return 0\n" +
        "    dp = [1] * n\n" +
        "    for i in range(1, n):\n" +
        "        for j in range(i):\n" +
        "            if a[j] < a[i]:\n" +
        "                dp[i] = max(dp[i], dp[j] + 1)\n" +
        "    return max(dp)\n\n" +
        "def lis_nlogn(a):\n" +
        "    tails = []\n" +
        "    for x in a:\n" +
        "        pos = bisect_left(tails, x)\n" +
        "        if pos == len(tails):\n" +
        "            tails.append(x)\n" +
        "        else:\n" +
        "            tails[pos] = x\n" +
        "    return len(tails)\n\n" +
        "def lis_reconstruct(a):\n" +
        "    n = len(a)\n" +
        "    if n == 0: return []\n" +
        "    dp = [1] * n\n" +
        "    parent = [-1] * n\n" +
        "    best = 0\n" +
        "    for i in range(n):\n" +
        "        for j in range(i):\n" +
        "            if a[j] < a[i] and dp[j] + 1 > dp[i]:\n" +
        "                dp[i] = dp[j] + 1\n" +
        "                parent[i] = j\n" +
        "        if dp[i] > dp[best]:\n" +
        "            best = i\n" +
        "    out = []\n" +
        "    i = best\n" +
        "    while i != -1:\n" +
        "        out.append(a[i])\n" +
        "        i = parent[i]\n" +
        "    return list(reversed(out))",
      notes: [
        "O(n^2) DP for reconstruction. O(n log n) is length-only by default.",
        "For O(n log n) with reconstruction, store parent pointers per tail position.",
      ],
    },
    java: {
      code:
        "int lisN2(int[] a) {\n" +
        "    int n = a.length;\n" +
        "    if (n == 0) return 0;\n" +
        "    int[] dp = new int[n];\n" +
        "    java.util.Arrays.fill(dp, 1);\n" +
        "    int ans = 1;\n" +
        "    for (int i = 1; i < n; i++) {\n" +
        "        for (int j = 0; j < i; j++) {\n" +
        "            if (a[j] < a[i] && dp[j] + 1 > dp[i]) {\n" +
        "                dp[i] = dp[j] + 1;\n" +
        "            }\n" +
        "        }\n" +
        "        ans = Math.max(ans, dp[i]);\n" +
        "    }\n" +
        "    return ans;\n" +
        "}\n\n" +
        "int lisNLogN(int[] a) {\n" +
        "    int[] tails = new int[a.length];\n" +
        "    int len = 0;\n" +
        "    for (int x : a) {\n" +
        "        int lo = 0, hi = len;\n" +
        "        while (lo < hi) {\n" +
        "            int mid = (lo + hi) / 2;\n" +
        "            if (tails[mid] < x) lo = mid + 1;\n" +
        "            else hi = mid;\n" +
        "        }\n" +
        "        tails[lo] = x;\n" +
        "        if (lo == len) len++;\n" +
        "    }\n" +
        "    return len;\n" +
        "}",
      notes: [
        "Manual binary search on tails[] replaces Java Collections.binarySearch for clarity.",
        "For non-decreasing (allow equals), change < to <= in the binary search condition.",
      ],
    },
    cpp: {
      code:
        "#include <vector>\n" +
        "#include <algorithm>\n\n" +
        "int lis_n2(const std::vector<int>& a) {\n" +
        "    int n = a.size();\n" +
        "    if (n == 0) return 0;\n" +
        "    std::vector<int> dp(n, 1);\n" +
        "    int ans = 1;\n" +
        "    for (int i = 1; i < n; i++) {\n" +
        "        for (int j = 0; j < i; j++) {\n" +
        "            if (a[j] < a[i]) dp[i] = std::max(dp[i], dp[j] + 1);\n" +
        "        }\n" +
        "        ans = std::max(ans, dp[i]);\n" +
        "    }\n" +
        "    return ans;\n" +
        "}\n\n" +
        "int lis_nlogn(const std::vector<int>& a) {\n" +
        "    std::vector<int> tails;\n" +
        "    for (int x : a) {\n" +
        "        auto it = std::lower_bound(tails.begin(), tails.end(), x);\n" +
        "        if (it == tails.end()) tails.push_back(x);\n" +
        "        else *it = x;\n" +
        "    }\n" +
        "    return tails.size();\n" +
        "}",
      notes: [
        "std::lower_bound for strictly increasing. Use upper_bound for non-decreasing.",
        "std::lower_bound is O(log n) on sorted containers.",
      ],
    },
  },
  languageNotes: [
    "Python: bisect_left / bisect_right are C-implemented — nearly free.",
    "Java: Arrays.binarySearch returns negative on miss; manual binary search on tails[] is clearer.",
    "C++: std::lower_bound is the idiom. tails is always sorted, so O(log n) per element.",
  ],
  complexity: {
    best: "O(n²) for DP; O(n log n) for patience sort",
    average: "O(n²) for DP; O(n log n) for patience sort",
    worst: "O(n²) for DP; O(n log n) for patience sort",
    auxiliary: "O(n)",
    total:
      "O(n²) time / O(n) space for DP; O(n log n) time / O(n) space for patience sort",
    why: [
      {
        label: "O(n²) DP",
        reason:
          "n elements, each scans all previous j < i. Total = n × n/2 = O(n²).",
      },
      {
        label: "O(n log n) patience sort",
        reason:
          "n elements, each does a binary search on tails[] of size ≤ n. Total = n × log n.",
      },
      {
        label: "O(n) space",
        reason: "dp of size n or tails of size ≤ n. No table beyond that.",
      },
    ],
  },
  dryRun: {
    input: "a = [10, 9, 2, 5, 3, 7, 101, 18]",
    initialState: "tails = [] (patience sorting)",
    steps: [
      { step: "1", state: "x=10: tails=[10]", note: "First element, append." },
      {
        step: "2",
        state: "x=9: pos=0 (10>=9), replace → [9]",
        note: "9 can start a smaller-length-1 chain.",
      },
      { step: "3", state: "x=2: pos=0, replace → [2]", note: "" },
      {
        step: "4",
        state: "x=5: pos=1 (no tail >= 5), append → [2, 5]",
        note: "",
      },
      { step: "5", state: "x=3: pos=1 (5>=3), replace → [2, 3]", note: "" },
      { step: "6", state: "x=7: pos=2, append → [2, 3, 7]", note: "" },
      { step: "7", state: "x=101: pos=3, append → [2, 3, 7, 101]", note: "" },
      {
        step: "8",
        state: "x=18: pos=3 (101>=18), replace → [2, 3, 7, 18]",
        note: "",
      },
    ],
    output: "len(tails) = 4. LIS = 4 (e.g., [2, 3, 7, 101] or [2, 3, 7, 18])",
  },
  whenToUse: [
    "Longest increasing subsequence (strictly increasing by default).",
    "Russian doll envelopes (sort + 2D LIS).",
    "Minimum insertions/deletions to sort.",
    "Building bridges without crossings.",
    "Maximum length of pairwise non-overlapping pairs.",
  ],
  whenNotToUse: [
    "Non-decreasing LIS — use bisect_right instead of bisect_left.",
    "Longest increasing SUBSTRING (contiguous) — simple O(n) scan.",
    "You need the actual LIS — O(n^2) DP or O(n log n) with parent pointers (more complex).",
    "K increasing subsequences (dilworth-like) — different algorithm.",
  ],
  mistakes: [
    {
      mistake: "Thinking tails is the LIS.",
      fix: "Tails holds minimal tail per length, not an actual subsequence. E.g., for [10, 9, 2, 5], tails=[2, 5] which is a valid LIS, but for [3, 1, 2] tails=[1, 2] which is not a subsequence of the array.",
    },
    {
      mistake: "Using strict comparison when non-decreasing is required.",
      fix: "Strictly increasing → lower_bound (first >= x). Non-decreasing → upper_bound (first > x).",
    },
    {
      mistake: "Forgetting the second sort key in 2D LIS.",
      fix: "Sort by width ascending; for equal widths, sort by height DESCENDING. Otherwise two envelopes of the same width can chain.",
    },
    {
      mistake: "Using the O(n log n) algorithm for reconstruction.",
      fix: "Tails alone cannot reconstruct. Use O(n^2) DP with parent pointers, or augment patience sort with position tracking.",
    },
  ],
  interview: {
    questions: [
      "Longest Increasing Subsequence (LeetCode 300) — both O(n^2) and O(n log n).",
      "Russian Doll Envelopes (LeetCode 354) — 2D LIS with a sorting trick.",
      "Number of Longest Increasing Subsequences (LeetCode 673).",
      "Longest Bitonic Subsequence — LIS from both ends.",
      "Minimum Number of Removals to Make Mountain Array (LeetCode 1671).",
      "Maximum Length of Pair Chain (LeetCode 646) — LIS variant.",
    ],
    observations: [
      "O(n log n) patience sort is a classic test of patience sorting + binary search knowledge.",
      "For 2D LIS, sorting trick is what makes it reducible to 1D LIS.",
      "For length only, patience sort. For path, O(n^2) DP.",
    ],
    optimizations: [
      "O(n log n) patience sort when length is enough.",
      "Segment tree or Fenwick tree variant for offline dynamic LIS.",
      "For reconstruction with O(n log n), store parent pointers alongside tails.",
    ],
    followUps: [
      "What about non-decreasing LIS? — use upper_bound instead of lower_bound.",
      "What about longest decreasing? — negate the array or reverse.",
      "What about the longest bitonic? — LIS from left and right, combine.",
    ],
  },
  related: [
    {
      id: "binary-search",
      relation: "The O(n log n) variant uses binary search on tails",
    },
    {
      id: "sorting",
      relation: "Russian Doll Envelopes needs a 2-key sort before LIS",
    },
  ],
  practice: [
    {
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      why: "Both O(n^2) and O(n log n) are expected.",
    },
    {
      title: "Russian Doll Envelopes",
      difficulty: "Hard",
      why: "2D LIS with a sorting trick.",
    },
    {
      title: "Number of Longest Increasing Subsequence",
      difficulty: "Medium",
      why: "Counts multiple LIS of the same length.",
    },
    {
      title: "Longest Bitonic Subsequence",
      difficulty: "Medium",
      why: "LIS from both ends.",
    },
  ],
  revision: {
    takeaways: [
      "O(n^2) DP: dp[i] = 1 + max(dp[j]) for j < i with a[j] < a[i].",
      "O(n log n): patience sorting with lower_bound on tails.",
      "tails length = LIS length. tails itself is not the LIS.",
      "Strictly increasing uses lower_bound. Non-decreasing uses upper_bound.",
    ],
    formulas: [
      "dp[i] = 1 + max(dp[j] for j < i if a[j] < a[i])",
      "tails[pos] = x where pos = lower_bound(tails, x)",
      "Russian Doll: sort by width ASC, height DESC, then LIS on height",
    ],
    complexitySummary:
      "O(n^2) time / O(n) space (DP), or O(n log n) time / O(n) space (patience sort).",
    patterns: [
      "Increasing subsequence",
      "2D LIS with sort trick",
      "Patience sorting",
    ],
    memoryTrick:
      "Patience sorting: new pile when card is bigger than all tops. Pile count = LIS length.",
  },
};
