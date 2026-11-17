import type { ConceptDetail } from '../../types';

export const prefixSumDetail: ConceptDetail = {
  id: 'prefix-sum',
  overview: {
    essence:
      "Precompute cumulative sums once. Then any range sum [l, r] is prefix[r+1] - prefix[l] in O(1). Trades O(n) space and O(n) precompute for O(1) range queries.",
    what:
      "An array prefix[] where prefix[i] = sum of a[0..i-1]. Range sum from index l to r inclusive = prefix[r+1] - prefix[l].",
    problemSolved:
      "Naive range sum is O(n) per query. Prefix sum makes it O(1) after O(n) precompute — huge when queries dominate and updates are absent.",
    whyImportant:
      "The go-to for 'count subarrays with sum X', 'range sum queries', and any problem where you do many range-sum computations on a static array.",
    usedIn: [
      "Range sum queries on static arrays",
      "Count subarrays with sum equal to K",
      "2D prefix sums for matrix range sum",
      "Equilibrium index / pivot index",
      "Subarray product / xor variants",
    ],
  },
  intuition: {
    explanation:
      "The cumulative sum of the first i elements is stored at prefix[i]. Any range [l, r] is the total up to r minus the total up to l-1 — the difference cancels the prefix before l. For subarray-sum problems, rewrite the constraint: 'a[j]+...+a[i] = K' becomes 'prefix[i+1] - prefix[j] = K', i.e., 'find an earlier prefix equal to prefix[i+1] - K'. That turns nested loops into a single pass with a hash map.",
    analogy:
      "A running odometer. To know how far you travelled between two timestamps, subtract the odometer reading at the earlier time from the later one — no need to re-add the segments.",
  },
  internals: [
    { title: "Build", body: "prefix[0] = 0, prefix[i+1] = prefix[i] + a[i]. O(n) time, O(n) space." },
    { title: "Range sum", body: "sum(l, r) = prefix[r+1] - prefix[l]. O(1)." },
    { title: "Counting subarrays with sum K", body: "Single pass over a, maintain freq of prefix sums seen. Add freq[prefix - K] to answer before recording current prefix." },
    { title: "2D prefix sum", body: "prefix[i+1][j+1] = grid[i][j] + prefix[i][j+1] + prefix[i+1][j] - prefix[i][j]. Range sum via inclusion-exclusion." },
    { title: "Updates break it", body: "If a value changes, every later prefix changes. Need Fenwick tree or segment tree for range queries with updates." },
    { title: "Difference array", body: "Dual of prefix sum: range ADD in O(1) via difference array, then one prefix pass to reconstruct the final array." },
  ],
  visual: {
    diagram:
      "a = [2, 4, 1, 7, 3]\n\n" +
      "prefix = [0, 2, 6, 7, 14, 17]\n" +
      "  indices: 0  1  2  3  4   5\n\n" +
      "range_sum(1, 3) = prefix[4] - prefix[1] = 14 - 2 = 12  (4+1+7)\n" +
      "range_sum(2, 4) = prefix[5] - prefix[2] = 17 - 6 = 11  (1+7+3)\n\n" +
      "Subarray sum K: count subarrays summing to 5\n" +
      "  iterate, keep freq of prefix sums\n" +
      "  for each prefix p: ans += freq[p - 5]; then freq[p] += 1\n" +
      "  O(n) with a hash map.",
    caption:
      "Prefix[i] = sum of first i elements. Range sum = prefix[r+1] - prefix[l].",
  },
  approach: {
    summary:
      "Build prefix once. Range sum = prefix[r+1] - prefix[l]. For subarray-sum constraints, use a hash map of prefix frequencies in a single pass.",
    steps: [
      "prefix[0] = 0; prefix[i+1] = prefix[i] + a[i].",
      "range_sum(l, r) = prefix[r+1] - prefix[l].",
      "For 'count subarrays with sum K': iterate, maintaining a hash map of prefix counts seen so far.",
      "2D case: inclusion-exclusion on the 2D prefix grid.",
    ],
    template: {
      code:
        "prefix = [0] * (n + 1)\n" +
        "for i in range(n):\n" +
        "    prefix[i+1] = prefix[i] + a[i]\n\n" +
        "def range_sum(l, r):\n" +
        "    return prefix[r+1] - prefix[l]",
      notes: ["prefix[0] = 0 makes the formula uniform — no special case for l = 0."],
    },
  },
  code: {
    python: {
      code:
        "def build_prefix(a):\n" +
        "    prefix = [0] * (len(a) + 1)\n" +
        "    for i, x in enumerate(a):\n" +
        "        prefix[i+1] = prefix[i] + x\n" +
        "    return prefix\n\n" +
        "def range_sum(prefix, l, r):\n" +
        "    return prefix[r+1] - prefix[l]\n\n" +
        "def subarray_sum_k(a, k):\n" +
        "    freq = {0: 1}\n" +
        "    ans, prefix = 0, 0\n" +
        "    for x in a:\n" +
        "        prefix += x\n" +
        "        ans += freq.get(prefix - k, 0)\n" +
        "        freq[prefix] = freq.get(prefix, 0) + 1\n" +
        "    return ans\n\n" +
        "def num_matrix_sum(grid, r1, c1, r2, c2):\n" +
        "    m, n = len(grid), len(grid[0])\n" +
        "    pre = [[0]*(n+1) for _ in range(m+1)]\n" +
        "    for i in range(m):\n" +
        "        for j in range(n):\n" +
        "            pre[i+1][j+1] = grid[i][j] + pre[i][j+1] + pre[i+1][j] - pre[i][j]\n" +
        "    return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]",
      notes: [
        "LeetCode 560 — Subarray Sum Equals K is the canonical hash-map + prefix pattern.",
        "2D inclusion-exclusion: add the rectangle, subtract the two overhangs, add back the double-subtracted corner.",
      ],
    },
    java: {
      code:
        "int[] buildPrefix(int[] a) {\n" +
        "    int[] prefix = new int[a.length + 1];\n" +
        "    for (int i = 0; i < a.length; i++) prefix[i+1] = prefix[i] + a[i];\n" +
        "    return prefix;\n" +
        "}\n\n" +
        "int rangeSum(int[] prefix, int l, int r) {\n" +
        "    return prefix[r+1] - prefix[l];\n" +
        "}\n\n" +
        "int subarraySum(int[] a, int k) {\n" +
        "    java.util.Map<Integer, Integer> freq = new java.util.HashMap<>();\n" +
        "    freq.put(0, 1);\n" +
        "    int ans = 0, prefix = 0;\n" +
        "    for (int x : a) {\n" +
        "        prefix += x;\n" +
        "        ans += freq.getOrDefault(prefix - k, 0);\n" +
        "        freq.merge(prefix, 1, Integer::sum);\n" +
        "    }\n" +
        "    return ans;\n" +
        "}",
      notes: [
        "Use Map<Integer, Integer> when sums can be negative; otherwise int[] with offset works too.",
        "Hash map pattern: record prefix BEFORE searching — that ensures 0-indexed subarrays starting at 0 are counted.",
      ],
    },
  },
  complexity: {
    best: "O(n) precompute, O(1) query",
    average: "O(n) precompute, O(1) query",
    worst: "O(n) precompute, O(1) query",
    auxiliary: "O(n)",
    total: "O(n) to build, O(1) per range query",
    why: [
      { label: "O(n) build", reason: "Single pass computing cumulative sums." },
      { label: "O(1) range query", reason: "Two array lookups and one subtraction — no scanning." },
      { label: "O(n) extra space", reason: "The prefix array itself is n+1 elements." },
      { label: "Updates are expensive", reason: "Changing a[i] requires re-computing all prefix values after i — O(n) per update." },
    ],
  },
  dryRun: {
    input: "a = [2, 4, 1, 7, 3], query range_sum(1, 3)",
    initialState: "prefix = [0, 2, 6, 7, 14, 17]",
    steps: [
      { step: "1", state: "prefix[4] - prefix[1] = 14 - 2", note: "Range [1, 3] inclusive." },
      { step: "2", state: "= 12", note: "Actual: 4 + 1 + 7 = 12." },
    ],
    output: "12",
  },
  whenToUse: [
    "Range sum queries on a static array.",
    "Counting subarrays with a sum constraint.",
    "Equilibrium / pivot index problems.",
    "2D matrix range sum.",
    "Repeated prefix-of-prefix problems (cumulative stats).",
  ],
  whenNotToUse: [
    "Frequent updates — use Fenwick tree or segment tree.",
    "Non-invertible aggregates (min, max, mode) — prefix sums do not work; use sparse table or segment tree.",
    "Subarray sum with negatives and no target K — no reduction.",
  ],
  mistakes: [
    { mistake: "Using prefix[r] - prefix[l] instead of prefix[r+1] - prefix[l].", fix: "prefix[i] = sum of first i elements. Range [l, r] needs prefix[r+1]." },
    { mistake: "Forgetting to seed freq = {0: 1} in subarray-sum-K.", fix: "The empty prefix (sum 0 before the array starts) contributes 1. Without it, subarrays starting at index 0 are missed." },
    { mistake: "Trying to update a value in a prefix-sum array in O(1).", fix: "That's not possible — updates cascade. Use Fenwick tree." },
  ],
  interview: {
    questions: [
      "Range Sum Query - Immutable (LeetCode 303).",
      "Subarray Sum Equals K (LeetCode 560).",
      "Range Sum Query 2D - Immutable (LeetCode 304).",
      "Find Pivot Index (LeetCode 724).",
      "Maximum Size Subarray Sum Equals K (LeetCode 325).",
    ],
    observations: [
      "The (prefix, hash map) pair is one of the most reusable patterns.",
      "2D inclusion-exclusion extends the same idea to matrices.",
      "If updates appear, switch to Fenwick tree — 10 extra lines, still O(log n).",
    ],
    optimizations: [
      "One pass for subarray-sum-K — do not build prefix array explicitly.",
      "2D prefix sum in-place saves memory.",
      "For range-add + range-sum, use difference array or segment tree with lazy.",
    ],
    followUps: [
      "What if there are updates? — Fenwick tree.",
      "What if the aggregate is min/max? — sparse table for static, segment tree for dynamic.",
    ],
  },
  related: [
    { id: "sliding-window", relation: "Sliding window is often prefix sum with a moving constraint" },
    { id: "fenwick-tree", relation: "Fenwick is prefix sum with O(log n) updates" },
    { id: "arrays", relation: "Prefix sum operates on arrays" },
  ],
  practice: [
    { title: "Subarray Sum Equals K", difficulty: "Medium", why: "The canonical prefix-sum + hash map problem." },
    { title: "Range Sum Query - Immutable", difficulty: "Easy", why: "The basic prefix array template." },
    { title: "Range Sum Query 2D - Immutable", difficulty: "Medium", why: "2D prefix sum with inclusion-exclusion." },
    { title: "Find Pivot Index", difficulty: "Easy", why: "Single prefix computation, compare left and right." },
  ],
  revision: {
    takeaways: [
      "prefix[i] = sum of a[0..i-1]. Range sum = prefix[r+1] - prefix[l].",
      "Subarray sum with a target: single pass with hash map of prefix frequencies.",
      "O(n) precompute, O(1) query.",
      "Updates break prefix sum — use Fenwick tree.",
    ],
    formulas: [
      "prefix[i+1] = prefix[i] + a[i]",
      "range_sum(l, r) = prefix[r+1] - prefix[l]",
      "subarray_sum_K: freq[prefix - K] counts earlier prefixes ending K before current",
    ],
    complexitySummary: "O(n) precompute, O(1) range query. O(n) space.",
    patterns: ["Range sum", "Subarray sum equals K", "2D prefix", "Difference array"],
    memoryTrick: "Precompute once, query forever. Sum(l..r) = prefix[r+1] - prefix[l].",
  },
};
