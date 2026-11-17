import type { ConceptDetail } from '../../types';

export const fenwickTreeDetail: ConceptDetail = {
  id: 'fenwick-tree',
  overview: {
    essence:
      "Fenwick tree (Binary Indexed Tree) answers prefix-sum queries and point updates in O(log n) with 10 lines of code. Simpler than a segment tree — only for sum-like aggregates.",
    what:
      "An array of size n where each index stores the sum of a specific range determined by the lowest set bit. Prefix sum and point update both walk O(log n) indices using the low-bit trick.",
    problemSolved:
      "Prefix sums with updates. Plain array: O(1) prefix, O(n) update. Prefix sum array: O(n) build, O(1) prefix, O(n) update. Fenwick: O(log n) for both, with 10 lines of code.",
    whyImportant:
      "The simplest data structure that supports both prefix query and update in O(log n). When you only need sum, Fenwick beats segment tree on code size and constant factor.",
    usedIn: [
      "Prefix sums with updates",
      "Range sum with point updates",
      "Counting inversions (with coordinate compression)",
      "Range sum with range update (dual BIT)",
      "2D prefix sums (offline)",
    ],
  },
  intuition: {
    explanation:
      "Index i in a 1-indexed array stores the sum of a range ending at i whose length is the lowest set bit of i. E.g., i=6 (110) stores sum of [5, 6]. Prefix query on i: sum += tree[i]; i -= i & -i (clear low bit). Update at i: tree[i] += delta; i += i & -i (add low bit). Both loop O(log n) times.",
    analogy:
      "Layered sums. Position 8 holds the sum of 1..8; position 4 holds 1..4; position 2 holds 1..2; position 1 holds just 1. To query prefix 7, sum positions 7, 6, 4 (three lookups cover ranges [7,7], [5,6], [1,4]).",
  },
  internals: [
    { title: "1-indexed", body: "Fenwick tree uses 1-indexed arrays because i & -i is well-defined for positive integers. Most implementations convert 0-indexed input to 1-indexed." },
    { title: "Low-bit trick", body: "i & -i gives the lowest set bit of i. That determines the range size at index i." },
    { title: "Prefix query", body: "sum = 0; while i > 0: sum += tree[i]; i -= i & -i. O(log n)." },
    { title: "Point update", body: "while i <= n: tree[i] += delta; i += i & -i. O(log n)." },
    { title: "Build", body: "Either n updates (O(n log n)) or O(n) build by propagating each a[i] to the next low-bit index." },
    { title: "Range sum", body: "prefix(r) - prefix(l-1). Two prefix queries, both O(log n)." },
    { title: "Range update + range query", body: "Requires two Fenwick trees (dual BIT) or use segment tree with lazy propagation." },
  ],
  visual: {
    diagram:
      "1-indexed values: a = [_, 3, 1, 4, 1, 5, 9, 2, 6]\n" +
      "                           1  2  3  4  5  6  7  8\n\n" +
      "Fenwick tree (each index stores sum of a range):\n" +
      "  tree[1] = a[1]              = 3   [range 1..1]\n" +
      "  tree[2] = a[1] + a[2]       = 4   [range 1..2]\n" +
      "  tree[3] = a[3]              = 4   [range 3..3]\n" +
      "  tree[4] = a[1..4]           = 9   [range 1..4]\n" +
      "  tree[5] = a[5]              = 5   [range 5..5]\n" +
      "  tree[6] = a[5..6]           = 14  [range 5..6]\n" +
      "  tree[7] = a[7]              = 2   [range 7..7]\n" +
      "  tree[8] = a[1..8]           = 30  [range 1..8]\n\n" +
      "Prefix sum(7) = tree[7] + tree[6] + tree[4]\n" +
      "              = 2 + 14 + 9 = 25. (Three lookups.)",
    caption:
      "Each index covers a range determined by its lowest set bit. Query and update both walk O(log n) positions.",
  },
  approach: {
    summary:
      "Convert to 1-indexed. Query: subtract low bit. Update: add low bit. Range sum = prefix(r) - prefix(l-1). Compact, fast, no recursion.",
    steps: [
      "Fenwick tree array of size n+1 (1-indexed).",
      "Update(i, delta): while i <= n: tree[i] += delta; i += i & -i.",
      "Query(i): sum = 0; while i > 0: sum += tree[i]; i -= i & -i. Return sum.",
      "Range(l, r) = Query(r) - Query(l-1).",
    ],
    template: {
      code:
        "class Fenwick:\n" +
        "    def __init__(self, n):\n" +
        "        self.n = n\n" +
        "        self.tree = [0] * (n + 1)\n\n" +
        "    def update(self, i, delta):\n" +
        "        while i <= self.n:\n" +
        "            self.tree[i] += delta\n" +
        "            i += i & -i\n\n" +
        "    def query(self, i):\n" +
        "        s = 0\n" +
        "        while i > 0:\n" +
        "            s += self.tree[i]\n" +
        "            i -= i & -i\n" +
        "        return s\n\n" +
        "    def range_sum(self, l, r):\n" +
        "        return self.query(r) - self.query(l - 1)",
      notes: ["Ten lines, O(log n) per operation."],
    },
  },
  code: {
    python: {
      code:
        "class Fenwick:\n" +
        "    def __init__(self, n):\n" +
        "        self.n = n\n" +
        "        self.tree = [0] * (n + 1)\n\n" +
        "    def update(self, i, delta):\n" +
        "        while i <= self.n:\n" +
        "            self.tree[i] += delta\n" +
        "            i += i & -i\n\n" +
        "    def query(self, i):\n" +
        "        s = 0\n" +
        "        while i > 0:\n" +
        "            s += self.tree[i]\n" +
        "            i -= i & -i\n" +
        "        return s\n\n" +
        "    def range_sum(self, l, r):\n" +
        "        return self.query(r) - self.query(l - 1)\n\n" +
        "# Example\n" +
        "bit = Fenwick(8)\n" +
        "for i, v in enumerate([3, 1, 4, 1, 5, 9, 2, 6], start=1):\n" +
        "    bit.update(i, v)\n" +
        "# bit.range_sum(3, 6) == 4 + 1 + 5 + 9 = 19\n" +
        "# bit.query(8) == 31",
      notes: [
        "Coordinate compression allows Fenwick on problems with large values (e.g., counting inversions).",
        "For range update + point query, use two Fenwicks or use segment tree with lazy.",
      ],
    },
  },
  complexity: {
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(log n)",
    auxiliary: "O(n)",
    total: "O(n) build, O(log n) query/update",
    why: [
      { label: "O(log n) query", reason: "Each iteration removes the lowest set bit. At most log2(n) iterations." },
      { label: "O(log n) update", reason: "Each iteration adds the lowest set bit. At most log2(n) iterations." },
      { label: "O(n) space", reason: "One tree array of size n+1." },
      { label: "Why simpler than segment tree", reason: "No recursion, no 4n allocation, no separate combine function. Only works for sum-like aggregates." },
    ],
  },
  whenToUse: [
    "Prefix sums with point updates.",
    "Range sum queries with updates.",
    "Counting inversions (with compression).",
    "Counting elements in a range (with compression).",
    "Any sum-like aggregate where you do not need min/max.",
  ],
  whenNotToUse: [
    "Need min/max queries — Fenwick does not support arbitrary aggregates. Use segment tree.",
    "Static array, no updates — prefix sums are O(1) queries.",
    "Need range updates + range queries — dual BIT or segment tree.",
    "2D data — 2D Fenwick works but memory blows up fast.",
  ],
  mistakes: [
    { mistake: "Using 0-indexed array.", fix: "Fenwick is 1-indexed. Either shift the array or handle 0 as a no-op." },
    { mistake: "Writing i -= i & -i backwards (update vs query).", fix: "Query: i -= i & -i (walk down). Update: i += i & -i (walk up). Opposite directions." },
    { mistake: "Trying to use Fenwick for min/max.", fix: "Fenwick only works for invertible aggregates (sum, xor). For min/max, use segment tree." },
    { mistake: "Forgetting to subtract prefix(l-1) for range sum.", fix: "Range sum = prefix(r) - prefix(l-1), not just prefix(r)." },
  ],
  interview: {
    questions: [
      "Range Sum Query - Mutable (LeetCode 307) — Fenwick or segment tree.",
      "Count of Smaller Numbers After Self (LeetCode 315) — Fenwick or merge sort.",
      "Reverse Pairs (LeetCode 493) — Fenwick or merge sort.",
      "Count of Range Sum (LeetCode 327) — Fenwick with compression.",
      "Number of Longest Increasing Subsequence (LeetCode 673) — Fenwick or segment tree.",
    ],
    observations: [
      "Fenwick is 10 lines vs segment tree 40+.",
      "Only for invertible aggregates: sum, xor, but not min/max.",
      "Coordinate compression often required when values are large.",
    ],
    optimizations: [
      "Fenwick is faster than recursive segment tree due to constant factor.",
      "For counting pairs with constraints, combine Fenwick with sorting.",
      "For range-update + range-query, dual BIT (two Fenwick trees).",
    ],
    followUps: [
      "What about min/max? — segment tree instead.",
      "What about 2D? — 2D Fenwick exists, but for V x V queries memory is V^2.",
    ],
  },
  related: [
    { id: "segment-tree", relation: "Fenwick is a simpler special case of segment tree" },
    { id: "arrays", relation: "Fenwick handles prefix-sum queries on mutable arrays" },
  ],
  practice: [
    { title: "Range Sum Query - Mutable", difficulty: "Medium", why: "The canonical Fenwick problem." },
    { title: "Count of Smaller Numbers After Self", difficulty: "Hard", why: "Coordinate compression + Fenwick." },
    { title: "Reverse Pairs", difficulty: "Hard", why: "Fenwick + merge sort both work." },
    { title: "Count of Range Sum", difficulty: "Hard", why: "Prefix sums + Fenwick." },
  ],
  revision: {
    takeaways: [
      "Fenwick tree: prefix sum + point update in O(log n).",
      "10 lines of code — simpler than segment tree.",
      "1-indexed, low-bit trick.",
      "Query goes down (i -= i&-i), update goes up (i += i&-i).",
    ],
    formulas: [
      "query(i): while i > 0: sum += tree[i]; i -= i & -i",
      "update(i, d): while i <= n: tree[i] += d; i += i & -i",
      "range_sum(l, r) = query(r) - query(l-1)",
    ],
    complexitySummary: "O(n) build, O(log n) query/update, O(n) space.",
    patterns: ["Prefix sum with updates", "Inversion counting", "Coordinate compression"],
    memoryTrick: "Low bit tells range size. Query down, update up. Ten lines total.",
  },
};
