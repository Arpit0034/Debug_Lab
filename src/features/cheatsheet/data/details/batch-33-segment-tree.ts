import type { ConceptDetail } from '../../types';

export const segmentTreeDetail: ConceptDetail = {
  id: 'segment-tree',
  overview: {
    essence:
      "Segment tree answers range queries (sum, min, max, gcd) and point updates in O(log n) each. Range queries on a mutable array — the answer when prefix sums and sparse tables do not fit.",
    what:
      "A binary tree where each node stores an aggregate (sum / min / max) of a range. Leaves are individual elements. Range query walks O(log n) nodes; point update modifies O(log n) nodes on the path to a leaf.",
    problemSolved:
      "A plain array gives range sum in O(n) or O(1) with prefix sums (but O(n) on update). Segment tree gives O(log n) for both query AND update — the right trade-off when both are frequent.",
    whyImportant:
      "The definitive data structure for range query + update problems. Also supports lazy propagation for range updates — which enables range-add-range-sum, range-assign-range-min, and many others.",
    usedIn: [
      "Range sum / min / max with updates",
      "Range add + range sum (lazy propagation)",
      "Count of elements in range (e.g., count less than x)",
      "Interval scheduling with queries",
      "Computational geometry (rectangle intersection area)",
    ],
  },
  intuition: {
    explanation:
      "Store the array as a balanced binary tree. Each node holds the aggregate of the range it covers. A query on [l, r] decomposes into O(log n) disjoint segments, one per node you visit. An update on index i modifies the leaf for i and every ancestor up to the root — O(log n) work. For range updates, lazy propagation: store a 'pending add' at a node, apply it to children only when they are needed. Both query and update remain O(log n).",
    analogy:
      "A tournament bracket. Each match combines two scores into a sum. To ask 'who is the strongest player between rank 10 and rank 50', traverse the tree, combining partial brackets that lie inside the range.",
  },
  internals: [
    { title: "Array representation", body: "Store the tree in an array of size 4n. Node i has children 2i and 2i+1. Leaves hold the raw array." },
    { title: "Build", body: "Recursively combine children into parent. O(n) total." },
    { title: "Point update", body: "Update the leaf, then recombine up to the root. O(log n)." },
    { title: "Range query", body: "Recursively descend; combine nodes fully inside the query range and recurse on those partially overlapping. O(log n)." },
    { title: "Lazy propagation", body: "For range updates, store pending operations at nodes. Push down to children only when needed. Both range update and range query stay O(log n)." },
    { title: "Node aggregate", body: "The combine function is problem-specific: sum, min, max, gcd, xor, count-greater-than. Segment tree is generic over this." },
  ],
  visual: {
    diagram:
      "Array: [1, 3, 5, 7, 9, 11] (indices 0..5)\n\n" +
      "Segment tree (each node = sum of its range):\n" +
      "                [0..5] = 36\n" +
      "              /             \\\n" +
      "       [0..2] = 9        [3..5] = 27\n" +
      "       /       \\           /       \\\n" +
      "   [0..1]=4  [2..2]=5   [3..4]=16  [5..5]=11\n" +
      "   /     \\              /       \\\n" +
      "[0]=1  [1]=3         [3]=7    [4]=9\n\n" +
      "Query sum [1, 4]:\n" +
      "  decompose into: [1..1]=3 + [2..2]=5 + [3..4]=16 → 24. O(log n).",
    caption:
      "Each node is the aggregate of a range. Query and update both walk O(log n) nodes.",
  },
  approach: {
    summary:
      "Array of size 4n. Build recursively. Update modifies leaf and recombines ancestors. Query decomposes range into O(log n) segments. Lazy propagation for range updates.",
    steps: [
      "Allocate tree[4 * n]. Build: tree[node] = combine(tree[2*node], tree[2*node+1]).",
      "Point update: descend to leaf, update, recombine on return.",
      "Range query: recurse; combine results that are fully inside [l, r].",
      "Range update: use lazy propagation — apply to a node only when needed.",
    ],
    template: {
      code:
        "def build(a, tree, node, l, r):\n" +
        "    if l == r:\n" +
        "        tree[node] = a[l]\n" +
        "        return\n" +
        "    mid = (l + r) // 2\n" +
        "    build(a, tree, 2*node, l, mid)\n" +
        "    build(a, tree, 2*node+1, mid+1, r)\n" +
        "    tree[node] = tree[2*node] + tree[2*node+1]\n\n" +
        "def query(tree, node, l, r, ql, qr):\n" +
        "    if qr < l or r < ql: return 0\n" +
        "    if ql <= l and r <= qr: return tree[node]\n" +
        "    mid = (l + r) // 2\n" +
        "    return query(tree, 2*node, l, mid, ql, qr) + query(tree, 2*node+1, mid+1, r, ql, qr)",
      notes: ["Combine function is +, but works for min, max, gcd equally."],
    },
  },
  code: {
    python: {
      code:
        "class SegmentTree:\n" +
        "    def __init__(self, a):\n" +
        "        self.n = len(a)\n" +
        "        self.tree = [0] * (4 * self.n)\n" +
        "        self._build(a, 1, 0, self.n - 1)\n\n" +
        "    def _build(self, a, node, l, r):\n" +
        "        if l == r:\n" +
        "            self.tree[node] = a[l]\n" +
        "            return\n" +
        "        mid = (l + r) // 2\n" +
        "        self._build(a, 2*node, l, mid)\n" +
        "        self._build(a, 2*node+1, mid+1, r)\n" +
        "        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\n" +
        "    def update(self, idx, val):\n" +
        "        self._update(1, 0, self.n - 1, idx, val)\n\n" +
        "    def _update(self, node, l, r, idx, val):\n" +
        "        if l == r:\n" +
        "            self.tree[node] = val\n" +
        "            return\n" +
        "        mid = (l + r) // 2\n" +
        "        if idx <= mid:\n" +
        "            self._update(2*node, l, mid, idx, val)\n" +
        "        else:\n" +
        "            self._update(2*node+1, mid+1, r, idx, val)\n" +
        "        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\n" +
        "    def query(self, ql, qr):\n" +
        "        return self._query(1, 0, self.n - 1, ql, qr)\n\n" +
        "    def _query(self, node, l, r, ql, qr):\n" +
        "        if qr < l or r < ql:\n" +
        "            return 0\n" +
        "        if ql <= l and r <= qr:\n" +
        "            return self.tree[node]\n" +
        "        mid = (l + r) // 2\n" +
        "        return (self._query(2*node, l, mid, ql, qr) +\n" +
        "                self._query(2*node+1, mid+1, r, ql, qr))",
      notes: [
        "For min/max, use INF/-INF as the identity element instead of 0.",
        "For lazy propagation, add a lazy[] array and _push_down before descending.",
      ],
    },
  },
  complexity: {
    best: "O(n) build, O(log n) query/update",
    average: "O(log n) query/update",
    worst: "O(log n) query/update",
    auxiliary: "O(n)",
    total: "O(n) build, O(log n) query/update",
    why: [
      { label: "O(n) build", reason: "Each node computed once, bottom-up. Total 2n nodes." },
      { label: "O(log n) query", reason: "At most 2 nodes per level are visited (one entering, one exiting). Depth = log n." },
      { label: "O(log n) update", reason: "Walk from leaf to root — one path of log n nodes." },
      { label: "O(n) space", reason: "4n array for 2n actual nodes (some unused for non-power-of-2 sizes)." },
    ],
  },
  whenToUse: [
    "Range query (sum, min, max, gcd) + point update — both frequent.",
    "Range update + range query — with lazy propagation.",
    "Counting queries (how many elements in range less than X) — with sorted segment trees or merge-sort tree.",
    "Any problem where prefix sums are not enough (updates).",
  ],
  whenNotToUse: [
    "Static array, no updates — prefix sums / sparse table faster.",
    "Only point updates, no range queries — Fenwick tree is simpler.",
    "Only point queries, no range updates — difference array.",
    "Small n (< 1000) — O(n) scan is often faster.",
  ],
  mistakes: [
    { mistake: "Using size n instead of 4n for the tree array.", fix: "Non-power-of-2 lengths cause overflow. Allocate 4n." },
    { mistake: "Forgetting lazy propagation for range updates.", fix: "Range-add + range-sum without lazy is O(n) per update. Add a lazy[] array and push down." },
    { mistake: "Query recursion missing the no-overlap case.", fix: "Every query needs three cases: fully inside → return; fully outside → identity (0 for sum, INF for min); partial → recurse." },
    { mistake: "Using 0 as identity for min/max.", fix: "0 is wrong for min/max. Use INF for min, -INF for max." },
  ],
  interview: {
    questions: [
      "Range Sum Query — Mutable (LeetCode 307).",
      "Count of Range Sum (LeetCode 327).",
      "Falling Squares (LeetCode 699).",
      "My Calendar I / II / III.",
      "Reverse Pairs (LeetCode 493) — segment tree or merge sort.",
    ],
    observations: [
      "Segment tree is a black box for 'range query + point update in O(log n)'.",
      "Lazy propagation extends to range updates — same skeleton, one extra array.",
      "Fenwick tree is simpler for range-sum only; segment tree generalizes to any aggregate.",
    ],
    optimizations: [
      "Iterative segment tree (bottom-up) is faster — 2n array, no recursion.",
      "Sparse table for O(1) static range queries.",
      "Fenwick tree for sum-only problems — 10x less code.",
    ],
    followUps: [
      "What about range assignment instead of add? — lazy assign with a sentinel 'no assignment'.",
      "What about merging two segment trees? — segment tree merge, used in offline query problems.",
    ],
  },
  related: [
    { id: "fenwick-tree", relation: "Fenwick is a lighter-weight segment tree for sums" },
    { id: "arrays", relation: "Segment tree is for array range queries" },
  ],
  practice: [
    { title: "Range Sum Query - Mutable", difficulty: "Medium", why: "The basic segment tree problem." },
    { title: "Count of Range Sum", difficulty: "Hard", why: "Segment tree or merge sort with counting." },
    { title: "Reverse Pairs", difficulty: "Hard", why: "Counting pairs with constraint — segment tree or merge sort." },
    { title: "Falling Squares", difficulty: "Hard", why: "Coordinate compression + segment tree max height." },
  ],
  revision: {
    takeaways: [
      "Segment tree: O(n) build, O(log n) query and point update.",
      "Lazy propagation for range updates.",
      "4n array size for safety.",
      "Combine function is problem-specific (sum / min / max / gcd).",
    ],
    formulas: [
      "node i has children 2i and 2i+1",
      "query: fully inside → return, fully outside → identity, else recurse",
    ],
    complexitySummary: "O(n) build, O(log n) query/update, O(n) space.",
    patterns: ["Range query + update", "Lazy propagation", "Merge sort tree"],
    memoryTrick: "Balanced tree over ranges. Update leaf, recombine to root. Query decomposes to O(log n) nodes.",
  },
};
