import type { ConceptDetail, ConceptMeta } from '../types';

export const arraysMeta: ConceptMeta = {
  id: 'arrays',
  title: 'Arrays',
  tagline: 'Contiguous memory, O(1) index access, O(n) insert/delete.',
  category: 'foundations',
  level: 'beginner',
  tier: 'flagship',
  time: 'O(1) access · O(n) insert/delete',
  space: 'O(n)',
  estMinutes: 25,
  keywords: ['array', 'contiguous', 'index', 'random access', 'in-place', 'shift', 'two-pointer'],
  patterns: ['random access by index', 'contiguous subarray', 'in-place modification', 'reverse in place'],
  relatedTopics: ['Arrays'],
  chunk: 'batch-02-arrays',
};

export const hashMapsMeta: ConceptMeta = {
  id: 'hash-maps',
  title: 'Hash Maps',
  tagline: 'Trade space for average O(1) lookup, insert, and delete.',
  category: 'data-structures',
  level: 'beginner',
  tier: 'flagship',
  time: 'O(1) avg · O(n) worst',
  space: 'O(n)',
  estMinutes: 25,
  keywords: ['hash map', 'hash table', 'dictionary', 'lookup', 'deduplication', 'frequency', 'counting'],
  patterns: ['have I seen this', 'frequency count', 'pair sum via complement', 'group by key', 'cache / memo'],
  relatedTopics: ['Hashing'],
  chunk: 'batch-02-hash-maps',
};

export const treesMeta: ConceptMeta = {
  id: 'trees',
  title: 'Trees',
  tagline: 'Recursive data structure; every operation is do(root) + do(left) + do(right).',
  category: 'data-structures',
  level: 'intermediate',
  tier: 'flagship',
  time: 'O(h) typical · O(n) worst',
  space: 'O(h) recursion',
  estMinutes: 40,
  keywords: ['tree', 'binary tree', 'bst', 'traversal', 'preorder', 'inorder', 'postorder', 'level order', 'recursion', 'height', 'depth'],
  patterns: ['structural recursion', 'in-order = sorted (BST)', 'post-order = aggregate', 'level-order = BFS', 'tree height / depth', 'lowest common ancestor'],
  relatedTopics: ['Trees'],
  chunk: 'batch-03-trees',
};

export const recursionMeta: ConceptMeta = {
  id: 'recursion',
  title: 'Recursion',
  tagline: 'Self-similarity with a fixed seed. Base case = identity of the combine step.',
  category: 'paradigms',
  level: 'intermediate',
  tier: 'flagship',
  time: 'O(branches^depth) naive',
  space: 'O(depth) call stack',
  estMinutes: 30,
  keywords: ['recursion', 'base case', 'recursive call', 'divide and conquer', 'call stack', 'self-similar', 'induction'],
  patterns: ['self-similar structure', 'tree / graph traversal', 'divide and conquer', 'backtracking', 'recursive math (factorial, fibonacci, height)'],
  relatedTopics: ['Recursion'],
  chunk: 'batch-04-recursion',
};

export const twoPointersMeta: ConceptMeta = {
  id: 'two-pointers',
  title: 'Two Pointers',
  tagline: 'Two indices move inward or in tandem. Each pointer advances at most n times → O(n).',
  category: 'techniques',
  level: 'intermediate',
  tier: 'flagship',
  time: 'O(n)',
  space: 'O(1)',
  estMinutes: 25,
  keywords: ['two pointers', 'pair sum', 'sorted array', 'converging pointers', 'fast slow', 'in-place', 'reverse', 'palindrome'],
  patterns: ['sorted array + pair sum', 'palindrome check', 'remove duplicates in sorted', 'merge two sorted arrays', 'container with most water', 'trapping rain water'],
  relatedTopics: ['Arrays', 'Sliding Window and Two Pointers'],
  chunk: 'batch-05-two-pointers',
};

export const slidingWindowMeta: ConceptMeta = {
  id: 'sliding-window',
  title: 'Sliding Window',
  tagline: 'Contiguous window that grows right, shrinks left. Each element enters and exits once → O(n).',
  category: 'techniques',
  level: 'intermediate',
  tier: 'flagship',
  time: 'O(n)',
  space: 'O(k) — state dependent',
  estMinutes: 30,
  keywords: ['sliding window', 'two pointers forward', 'contiguous subarray', 'substring', 'window sum', 'distinct characters', 'fixed window', 'variable window'],
  patterns: ['longest subarray with property', 'shortest subarray with property', 'at most k distinct', 'minimum window containing', 'fixed-size window sum'],
  relatedTopics: ['Sliding Window and Two Pointers', 'Arrays'],
  chunk: 'batch-06-sliding-window',
};

export const sortingMeta: ConceptMeta = {
  id: 'sorting',
  title: 'Sorting',
  tagline: 'Merge = stable, quick = in-place, heap = O(1) worst-case space. All comparison sorts ≥ O(n log n).',
  category: 'algorithms',
  level: 'intermediate',
  tier: 'flagship',
  time: 'O(n log n)',
  space: 'O(1) to O(n), depends',
  estMinutes: 30,
  keywords: ['sorting', 'merge sort', 'quick sort', 'heap sort', 'stable', 'in place', 'comparator', 'order'],
  patterns: ['sort first then scan', 'custom comparator', 'stability matters', 'in-place', 'top k via heap'],
  relatedTopics: ['Sorting'],
  chunk: 'batch-07-sorting',
};

const stacksQueuesMeta: ConceptMeta = {
  id: 'stacks-queues',
  title: 'Stacks & Queues',
  tagline: 'LIFO for nesting, FIFO for breadth.',
  category: 'data-structures',
  level: 'beginner',
  tier: 'flagship',
  time: 'O(1) per op',
  space: 'O(n)',
  estMinutes: 25,
  keywords: ['stack', 'queue', 'deque', 'lifo', 'fifo', 'push', 'pop', 'enqueue', 'dequeue'],
  patterns: ['nested matching', 'undo/redo', 'BFS level-order', 'expression evaluation', 'monotonic stack'],
  relatedTopics: ['Stacks and Queues'],
  chunk: 'batch-08-stacks-queues',
};

const unionFindMeta: ConceptMeta = {
  id: 'union-find',
  title: 'Union-Find (Disjoint Set Union)',
  tagline: 'Dynamic connectivity in O(α(n)) — effectively O(1).',
  category: 'data-structures',
  level: 'advanced',
  tier: 'flagship',
  time: 'O(α(n))',
  space: 'O(n)',
  estMinutes: 35,
  keywords: ['union find', 'disjoint set', 'dsu', 'connectivity', 'path compression', 'union by rank', 'kruskal'],
  patterns: ['dynamic connectivity', 'cycle detection in undirected', 'Kruskal MST', 'accounts merge', 'province count'],
  relatedTopics: ['Graphs', 'Advanced Data Structures'],
  chunk: 'batch-16-union-find',
};

const bitManipulationMeta: ConceptMeta = {
  id: "bit-manipulation",
  title: "Bit Manipulation",
  tagline: "XOR cancellation, popcount, bitmask enumeration. O(1) per op.",
  category: "foundations",
  level: "intermediate",
  tier: "flagship",
  time: "O(1) per op",
  space: "O(1)",
  estMinutes: 30,
  keywords: ["bit", "xor", "and", "or", "shift", "popcount", "bitmask", "single number"],
  patterns: ["XOR uniqueness", "popcount", "power of two", "subset enumeration", "bitmask dp"],
  relatedTopics: ["Bit Manipulation"],
  chunk: "batch-17-bit-manipulation",
};

const bigOFamilyMeta: ConceptMeta = {
  id: "big-o-family",
  title: "Big-O Family",
  tagline: "O vs Θ vs Ω. Growth classes and Master Theorem.",
  category: "foundations",
  level: "beginner",
  tier: "core",
  time: "Concept",
  space: "Concept",
  estMinutes: 20,
  keywords: ["big-o", "big-theta", "big-omega", "complexity", "growth", "master theorem"],
  patterns: ["feasibility", "master theorem", "amortized analysis"],
  relatedTopics: ["Complexity Analysis"],
  chunk: "batch-18-big-o",
};

const monotonicStackMeta: ConceptMeta = {
  id: "monotonic-stack",
  title: "Monotonic Stack",
  tagline: "Next greater/smaller in O(n). Each element pushed once, popped once.",
  category: "techniques",
  level: "intermediate",
  tier: "core",
  time: "O(n)",
  space: "O(n)",
  estMinutes: 25,
  keywords: ["monotonic stack", "next greater", "next smaller", "daily temperatures", "histogram"],
  patterns: ["next greater element", "daily temperatures", "largest rectangle", "stock span"],
  relatedTopics: ["Stacks and Queues"],
  chunk: "batch-19-monotonic-stack",
};

const triesMeta: ConceptMeta = {
  id: "tries",
  title: "Tries",
  tagline: "Prefix tree. Lookup O(L), independent of dictionary size.",
  category: "data-structures",
  level: "advanced",
  tier: "flagship",
  time: "O(L) per op",
  space: "O(total × alphabet)",
  estMinutes: 30,
  keywords: ["trie", "prefix tree", "autocomplete", "word search", "xor trie"],
  patterns: ["autocomplete", "prefix count", "word search with pruning", "max xor"],
  relatedTopics: ["Heaps and Tries"],
  chunk: "batch-15-tries",
};

const topologicalSortMeta: ConceptMeta = {
  id: "topological-sort",
  title: "Topological Sort",
  tagline: "Order a DAG by dependencies. Cycle detection is free with Kahn's.",
  category: "algorithms",
  level: "intermediate",
  tier: "core",
  time: "O(V + E)",
  space: "O(V + E)",
  estMinutes: 30,
  keywords: ["topological sort", "toposort", "kahn's", "dag", "dependency", "course schedule"],
  patterns: ["dependency order", "cycle detection directed", "DAG shortest path"],
  relatedTopics: ["Graphs"],
  chunk: "batch-20-topological-sort",
};

const dijkstraMeta: ConceptMeta = {
  id: "dijkstra",
  title: "Dijkstra's Algorithm",
  tagline: "Weighted shortest path with a min-heap. Non-negative weights only.",
  category: "algorithms",
  level: "intermediate",
  tier: "core",
  time: "O((V+E) log V)",
  space: "O(V)",
  estMinutes: 35,
  keywords: ["dijkstra", "shortest path", "weighted graph", "min-heap", "network delay"],
  patterns: ["weighted shortest path", "grid cost", "K-stops variant"],
  relatedTopics: ["Graphs"],
  chunk: "batch-21-dijkstra",
};

const mstMeta: ConceptMeta = {
  id: "minimum-spanning-tree",
  title: "Minimum Spanning Tree",
  tagline: "Connect all vertices with minimum edge weight. Kruskal or Prim.",
  category: "algorithms",
  level: "intermediate",
  tier: "core",
  time: "O(E log E)",
  space: "O(V + E)",
  estMinutes: 30,
  keywords: ["mst", "spanning tree", "kruskal", "prim", "union find", "connect all"],
  patterns: ["cheapest connection", "clustering", "network design"],
  relatedTopics: ["Graphs", "Advanced Data Structures"],
  chunk: "batch-22-mst",
};

const lcsMeta: ConceptMeta = {
  id: 'lcs',
  title: 'Longest Common Subsequence',
  tagline: 'Two-string 2D DP. Find the longest common subsequence.',
  category: 'paradigms',
  level: 'advanced',
  tier: 'flagship',
  time: 'O(m * n)',
  space: 'O(m * n)',
  estMinutes: 40,
  keywords: [
    'lcs',
    'longest common subsequence',
    'two strings',
    'dp',
    'edit distance',
  ],
  patterns: [
    'two-string dp',
    '2d dp',
    'edit distance variant',
    'sequence alignment',
  ],
  relatedTopics: [
    'Dynamic Programming',
  ],
  chunk: 'batch-23-lcs',
};

const lisMeta: ConceptMeta = {
  id: 'lis',
  title: 'Longest Increasing Subsequence',
  tagline: 'O(n^2) DP or O(n log n) with patience sort.',
  category: 'paradigms',
  level: 'advanced',
  tier: 'flagship',
  time: 'O(n log n)',
  space: 'O(n)',
  estMinutes: 40,
  keywords: [
    'lis',
    'longest increasing subsequence',
    'patience sort',
    'binary search',
    'subsequence',
  ],
  patterns: [
    'increasing subsequence',
    '2d lis',
    'patience sort',
    'russian doll',
  ],
  relatedTopics: [
    'Dynamic Programming',
    'Binary Search',
  ],
  chunk: 'batch-24-lis',
};

const knapsack01Meta: ConceptMeta = {
  id: 'knapsack-01',
  title: '0/1 Knapsack',
  tagline: 'Max value with weight constraint. Each item taken at most once.',
  category: 'paradigms',
  level: 'advanced',
  tier: 'flagship',
  time: 'O(n * W)',
  space: 'O(W)',
  estMinutes: 40,
  keywords: [
    'knapsack',
    '0/1 knapsack',
    'subset sum',
    'target sum',
    'partition',
  ],
  patterns: [
    'subset sum',
    'target sum',
    'minimize difference',
    'ones and zeroes',
  ],
  relatedTopics: [
    'Dynamic Programming',
  ],
  chunk: 'batch-25-knapsack',
};

const unboundedKnapsackMeta: ConceptMeta = {
  id: 'unbounded-knapsack',
  title: 'Unbounded Knapsack',
  tagline: 'Items reusable any number of times. Ascending w-loop instead of descending.',
  category: 'paradigms',
  level: 'advanced',
  tier: 'flagship',
  time: 'O(n * W)',
  space: 'O(W)',
  estMinutes: 35,
  keywords: [
    'unbounded knapsack',
    'coin change',
    'coin change 2',
    'combinations',
    'permutations',
  ],
  patterns: [
    'coin change',
    'count combinations',
    'count permutations',
    'unbounded selection',
  ],
  relatedTopics: [
    'Dynamic Programming',
  ],
  chunk: 'batch-26-unbounded-knapsack',
};

const fastExponentiationMeta: ConceptMeta = {
  id: 'fast-exponentiation',
  title: 'Fast Exponentiation',
  tagline: 'a^n in O(log n) via repeated squaring. Matrix version for linear recurrences.',
  category: 'techniques',
  level: 'intermediate',
  tier: 'core',
  time: 'O(log n)',
  space: 'O(1)',
  estMinutes: 25,
  keywords: [
    'fast pow',
    'binary exponentiation',
    'modular exponentiation',
    'matrix power',
    'repeated squaring',
  ],
  patterns: [
    'modular power',
    'matrix power',
    'fast fibonacci',
  ],
  relatedTopics: [
    'Basic Mathematics',
  ],
  chunk: 'batch-27-fast-exp',
};

const mcmMeta: ConceptMeta = {
  id: 'matrix-chain-multiplication',
  title: 'Matrix Chain Multiplication',
  tagline: 'Interval DP: optimal parenthesization of a chain of matrices.',
  category: 'paradigms',
  level: 'advanced',
  tier: 'overview',
  time: 'O(n^3)',
  space: 'O(n^2)',
  estMinutes: 25,
  keywords: [
    'mcm',
    'matrix chain',
    'interval dp',
    'parenthesization',
    'burst balloons',
  ],
  patterns: [
    'interval dp',
    'optimal parenthesization',
    'burst balloons',
  ],
  relatedTopics: [
    'Dynamic Programming',
  ],
  chunk: 'batch-28-mcm',
};

const bellmanFordMeta: ConceptMeta = {
  id: 'bellman-ford',
  title: 'Bellman-Ford',
  tagline: 'Shortest path with negative weights. O(VE). Detects negative cycles.',
  category: 'algorithms',
  level: 'advanced',
  tier: 'overview',
  time: 'O(VE)',
  space: 'O(V)',
  estMinutes: 20,
  keywords: [
    'bellman ford',
    'negative weights',
    'negative cycle',
    'shortest path',
    'relaxation',
  ],
  patterns: [
    'negative weights',
    'negative cycle detection',
    'K-stops variant',
  ],
  relatedTopics: [
    'Graphs',
  ],
  chunk: 'batch-29-bellman-ford',
};

const floydWarshallMeta: ConceptMeta = {
  id: 'floyd-warshall',
  title: 'Floyd-Warshall',
  tagline: 'All-pairs shortest path in O(V^3). k must be the outer loop.',
  category: 'algorithms',
  level: 'advanced',
  tier: 'overview',
  time: 'O(V^3)',
  space: 'O(V^2)',
  estMinutes: 20,
  keywords: [
    'floyd warshall',
    'all pairs',
    'transitive closure',
    'negative cycle',
    'dynamic programming',
  ],
  patterns: [
    'all-pairs shortest',
    'transitive closure',
    'dense graph',
  ],
  relatedTopics: [
    'Graphs',
    'Dynamic Programming',
  ],
  chunk: 'batch-30-floyd-warshall',
};

const sccMeta: ConceptMeta = {
  id: 'strongly-connected-components',
  title: 'Strongly Connected Components',
  tagline: 'Kosaraju (two DFS) or Tarjan (one DFS). Both O(V + E).',
  category: 'algorithms',
  level: 'advanced',
  tier: 'overview',
  time: 'O(V + E)',
  space: 'O(V)',
  estMinutes: 25,
  keywords: [
    'scc',
    'strongly connected',
    'kosaraju',
    'tarjan',
    'low link',
    'condensation',
  ],
  patterns: [
    'directed cycles',
    'graph condensation',
    '2-sat',
  ],
  relatedTopics: [
    'Graphs',
  ],
  chunk: 'batch-31-scc',
};

const stringMatchingMeta: ConceptMeta = {
  id: 'string-matching',
  title: 'String Matching (KMP)',
  tagline: 'Pattern search in O(n + m) via the LPS fallback table.',
  category: 'techniques',
  level: 'advanced',
  tier: 'overview',
  time: 'O(n + m)',
  space: 'O(m)',
  estMinutes: 25,
  keywords: [
    'kmp',
    'string matching',
    'lps',
    'pattern search',
    'substring',
  ],
  patterns: [
    'pattern search',
    'repeated substring',
    'shortest palindrome',
  ],
  relatedTopics: [
    'Strings',
  ],
  chunk: 'batch-32-string-matching',
};

const segmentTreeMeta: ConceptMeta = {
  id: 'segment-tree',
  title: 'Segment Tree',
  tagline: 'Range query and point update in O(log n). Lazy propagation for range updates.',
  category: 'advanced',
  level: 'advanced',
  tier: 'overview',
  time: 'O(log n)',
  space: 'O(n)',
  estMinutes: 30,
  keywords: [
    'segment tree',
    'range query',
    'lazy propagation',
    'point update',
    'range sum',
  ],
  patterns: [
    'range query with update',
    'lazy propagation',
    'counting in range',
  ],
  relatedTopics: [
    'Advanced Data Structures',
  ],
  chunk: 'batch-33-segment-tree',
};

const fenwickTreeMeta: ConceptMeta = {
  id: 'fenwick-tree',
  title: 'Fenwick Tree',
  tagline: 'Prefix sum and point update in O(log n) with 10 lines of code.',
  category: 'advanced',
  level: 'advanced',
  tier: 'overview',
  time: 'O(log n)',
  space: 'O(n)',
  estMinutes: 20,
  keywords: [
    'fenwick',
    'bit',
    'binary indexed tree',
    'prefix sum',
    'inversion count',
  ],
  patterns: [
    'prefix sum with update',
    'inversion counting',
    'coordinate compression',
  ],
  relatedTopics: [
    'Advanced Data Structures',
  ],
  chunk: 'batch-34-fenwick-tree',
};

const prefixSumMeta: ConceptMeta = {
  id: 'prefix-sum',
  title: 'Prefix Sum',
  tagline: 'Precompute cumulative sums. O(1) range queries, O(n) build.',
  category: 'techniques',
  level: 'beginner',
  tier: 'core',
  time: 'O(1) range query',
  space: 'O(n)',
  estMinutes: 25,
  keywords: [
    'prefix sum',
    'cumulative sum',
    'range query',
    'subarray sum',
    '2d prefix',
  ],
  patterns: [
    'range sum',
    'subarray sum equals k',
    '2d prefix',
    'difference array',
  ],
  relatedTopics: [
    'Arrays',
  ],
  chunk: 'batch-35-prefix-sum',
};

const kadaneMeta: ConceptMeta = {
  id: 'kadane',
  title: 'Kadane Algorithm',
  tagline: 'Maximum subarray sum in one pass, O(n) time, O(1) space.',
  category: 'techniques',
  level: 'intermediate',
  tier: 'core',
  time: 'O(n)',
  space: 'O(1)',
  estMinutes: 20,
  keywords: [
    'kadane',
    'max subarray',
    'max product',
    'buy sell stock',
    'circular subarray',
  ],
  patterns: [
    'max subarray',
    'max product',
    'buy sell stock',
    'circular variant',
  ],
  relatedTopics: [
    'Arrays',
    'Dynamic Programming',
  ],
  chunk: 'batch-36-kadane',
};

const mergeIntervalsMeta: ConceptMeta = {
  id: 'merge-intervals',
  title: 'Merge Intervals',
  tagline: 'Sort by start, extend end while overlapping. O(n log n).',
  category: 'techniques',
  level: 'intermediate',
  tier: 'core',
  time: 'O(n log n)',
  space: 'O(n)',
  estMinutes: 25,
  keywords: [
    'merge intervals',
    'insert interval',
    'meeting rooms',
    'overlap',
    'arrow balloons',
  ],
  patterns: [
    'merge overlapping',
    'insert interval',
    'meeting rooms',
    'arrow bursting',
  ],
  relatedTopics: [
    'Sorting',
    'Greedy',
  ],
  chunk: 'batch-37-merge-intervals',
};

const fastSlowPointersMeta: ConceptMeta = {
  id: 'fast-slow-pointers',
  title: 'Fast & Slow Pointers',
  tagline: 'Floyd cycle detection. Two pointers, one 2x the other. O(1) space.',
  category: 'techniques',
  level: 'intermediate',
  tier: 'core',
  time: 'O(n)',
  space: 'O(1)',
  estMinutes: 25,
  keywords: [
    'fast slow pointers',
    'floyd',
    'tortoise hare',
    'cycle detection',
    'middle node',
    'duplicate',
  ],
  patterns: [
    'cycle detection',
    'find middle',
    'nth from end',
    'find duplicate',
  ],
  relatedTopics: [
    'Linked Lists',
  ],
  chunk: 'batch-38-fast-slow-pointers',
};

const bitmaskDpMeta: ConceptMeta = {
  id: 'bitmask-dp',
  title: 'Bitmask DP',
  tagline: 'State = integer subset. O(2^n * n). Only for n <= 20.',
  category: 'paradigms',
  level: 'advanced',
  tier: 'core',
  time: 'O(2^n * n)',
  space: 'O(2^n * k)',
  estMinutes: 35,
  keywords: [
    'bitmask dp',
    'subset dp',
    'tsp',
    'hamiltonian',
    'set cover',
    'state compression',
  ],
  patterns: [
    'tsp exact',
    'subset selection',
    'set cover',
    'partition into groups',
  ],
  relatedTopics: [
    'Bit Manipulation',
    'Dynamic Programming',
  ],
  chunk: 'batch-39-bitmask-dp',
};

const intervalDpMeta: ConceptMeta = {
  id: 'interval-dp',
  title: 'Interval DP',
  tagline: 'dp[i][j] for interval [i, j]. Fill by length. O(n^3).',
  category: 'paradigms',
  level: 'advanced',
  tier: 'core',
  time: 'O(n^3)',
  space: 'O(n^2)',
  estMinutes: 35,
  keywords: [
    'interval dp',
    'burst balloons',
    'palindrome partition',
    'stone game',
    'matrix chain',
  ],
  patterns: [
    'burst balloons',
    'palindrome partition',
    'stone game',
    'polygon triangulation',
  ],
  relatedTopics: [
    'Dynamic Programming',
  ],
  chunk: 'batch-40-interval-dp',
};

const linkedListsMeta: ConceptMeta = {
  id: 'linked-lists',
  title: 'Linked Lists',
  tagline: 'You never delete a node — you reconnect around it.',
  category: 'data-structures',
  level: 'beginner',
  tier: 'core',
  time: 'O(n) access · O(1) relink',
  space: 'O(n)',
  estMinutes: 25,
  keywords: ['linked list', 'pointer', 'node', 'reverse', 'cycle', 'floyd', 'dummy head'],
  patterns: ['reverse linked list', 'cycle detection', 'merge two lists', 'two-pointer mid', 'dummy head'],
  relatedTopics: ['Linked Lists'],
  chunk: 'batch-09-linked-lists',
};

const heapsMeta: ConceptMeta = {
  id: 'heaps',
  title: 'Heaps & Priority Queues',
  tagline: 'Peek min/max in O(1), push/pop in O(log n).',
  category: 'data-structures',
  level: 'intermediate',
  tier: 'core',
  time: 'O(1) peek · O(log n) push/pop',
  space: 'O(n)',
  estMinutes: 30,
  keywords: ['heap', 'priority queue', 'min-heap', 'max-heap', 'top-k', 'heapify'],
  patterns: ['top-k', 'streaming median', 'merge k sorted', 'dijkstra frontier'],
  relatedTopics: ['Heaps and Tries'],
  chunk: 'batch-14-heaps',
};

const greedyMeta: ConceptMeta = {
  id: 'greedy',
  title: 'Greedy',
  tagline: 'Pick the locally best. Only safe with an exchange proof.',
  category: 'paradigms',
  level: 'intermediate',
  tier: 'core',
  time: 'O(n log n) with sort',
  space: 'O(1)',
  estMinutes: 30,
  keywords: ['greedy', 'interval scheduling', 'jump game', 'sort', 'exchange argument'],
  patterns: ['sort + one pass', 'interval scheduling', 'farthest reach', 'priority-queue greedy'],
  relatedTopics: ['Greedy'],
  chunk: 'batch-13-greedy',
};

const backtrackingMeta: ConceptMeta = {
  id: 'backtracking',
  title: 'Backtracking',
  tagline: 'Try then recurse then undo. Copy state on record. Prune early.',
  category: 'paradigms',
  level: 'advanced',
  tier: 'core',
  time: 'O(2^n) or O(n!)',
  space: 'O(n)',
  estMinutes: 35,
  keywords: ['backtracking', 'permutations', 'combinations', 'subsets', 'n-queens', 'prune'],
  patterns: ['generate all', 'constraint satisfaction', 'path finding with pruning'],
  relatedTopics: ['Backtracking', 'Recursion'],
  chunk: 'batch-12-backtracking',
};

const dynamicProgrammingMeta: ConceptMeta = {
  id: 'dynamic-programming',
  title: 'Dynamic Programming',
  tagline: 'Recursion plus a cache. Overlapping subproblems is the trigger.',
  category: 'paradigms',
  level: 'advanced',
  tier: 'flagship',
  time: 'O(states x cost)',
  space: 'O(states)',
  estMinutes: 45,
  keywords: ['dynamic programming', 'dp', 'memoization', 'tabulation', 'subproblem', 'optimal substructure'],
  patterns: ['count ways', 'min cost', 'max profit', 'overlapping subproblems', 'optimal substructure'],
  relatedTopics: ['Dynamic Programming'],
  chunk: 'batch-11-dp',
};

const graphsMeta: ConceptMeta = {
  id: 'graphs',
  title: 'Graphs',
  tagline: 'BFS for breadth, DFS for depth. The traversal picks the answer.',
  category: 'data-structures',
  level: 'intermediate',
  tier: 'flagship',
  time: 'O(V + E)',
  space: 'O(V)',
  estMinutes: 40,
  keywords: ['graph', 'bfs', 'dfs', 'adjacency', 'visited', 'shortest path', 'connected components'],
  patterns: ['shortest unweighted path', 'connected components', 'cycle detection', 'topological sort', 'bipartite'],
  relatedTopics: ['Graphs'],
  chunk: 'batch-10-graphs',
};

export const CONCEPT_METAS: ConceptMeta[] = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    tagline: 'Halve the search space on each comparison.',
    category: 'techniques',
    level: 'intermediate',
    tier: 'flagship',
    time: 'O(log n)',
    space: 'O(1)',
    estMinutes: 20,
    keywords: ['binary search', 'bisect', 'lower bound', 'upper bound', 'monotonic', 'log n'],
    patterns: ['sorted array + find target', 'monotonic predicate', 'minimize maximum', 'maximize minimum'],
    chunk: 'batch-01',
  },
  arraysMeta,
  graphsMeta,
  hashMapsMeta,
  linkedListsMeta,
  heapsMeta,
  treesMeta,
  backtrackingMeta,
  dynamicProgrammingMeta,
  greedyMeta,
  recursionMeta,
  twoPointersMeta,
  slidingWindowMeta,
  sortingMeta,
  stacksQueuesMeta,
  unionFindMeta,
  bitManipulationMeta,
  bigOFamilyMeta,
  monotonicStackMeta,
  triesMeta,
  topologicalSortMeta,
  dijkstraMeta,
  mstMeta,
  lcsMeta,
  lisMeta,
  knapsack01Meta,
  unboundedKnapsackMeta,
  fastExponentiationMeta,
  mcmMeta,
  bellmanFordMeta,
  floydWarshallMeta,
  sccMeta,
  stringMatchingMeta,
  segmentTreeMeta,
  fenwickTreeMeta,
  prefixSumMeta,
  kadaneMeta,
  mergeIntervalsMeta,
  fastSlowPointersMeta,
  bitmaskDpMeta,
  intervalDpMeta,
];

const CHUNK_LOADERS: Record<string, () => Promise<Record<string, ConceptDetail>>> = {
  'batch-01': () =>
    import('./details/batch-01').then((m) => ({
      'binary-search': m.binarySearchDetail,
    })),
  'batch-02-arrays': () =>
    import('./details/batch-02-arrays').then((m) => ({
      arrays: m.arraysDetail,
    })),
  'batch-02-hash-maps': () =>
    import('./details/batch-02-hash-maps').then((m) => ({
      'hash-maps': m.hashMapsDetail,
    })),
  'batch-03-trees': () =>
    import('./details/batch-03-trees').then((m) => ({
      trees: m.treesDetail,
    })),
  'batch-04-recursion': () =>
    import('./details/batch-04-recursion').then((m) => ({
      recursion: m.recursionDetail,
    })),
  'batch-05-two-pointers': () =>
    import('./details/batch-05-two-pointers').then((m) => ({
      'two-pointers': m.twoPointersDetail,
    })),
  'batch-06-sliding-window': () =>
    import('./details/batch-06-sliding-window').then((m) => ({
      'sliding-window': m.slidingWindowDetail,
    })),
  'batch-07-sorting': () =>
    import('./details/batch-07-sorting').then((m) => ({
      sorting: m.sortingDetail,
    })),
  'batch-08-stacks-queues': () =>
    import('./details/batch-08-stacks-queues').then((m) => ({
      'stacks-queues': m.stacksQueuesDetail,
    })),
  'batch-16-union-find': () =>
    import('./details/batch-16-union-find').then((m) => ({
      'union-find': m.unionFindDetail,
    })),
  'batch-17-bit-manipulation': () =>
    import('./details/batch-17-bit-manipulation').then((m) => ({
      'bit-manipulation': m.bitManipulationDetail,
    })),
  'batch-18-big-o': () =>
    import('./details/batch-18-big-o').then((m) => ({
      'big-o-family': m.bigOFamilyDetail,
    })),
  'batch-19-monotonic-stack': () =>
    import('./details/batch-19-monotonic-stack').then((m) => ({
      'monotonic-stack': m.monotonicStackDetail,
    })),
  'batch-15-tries': () =>
    import('./details/batch-15-tries').then((m) => ({
      'tries': m.triesDetail,
    })),
  'batch-20-topological-sort': () =>
    import('./details/batch-20-topological-sort').then((m) => ({
      'topological-sort': m.topologicalSortDetail,
    })),
  'batch-21-dijkstra': () =>
    import('./details/batch-21-dijkstra').then((m) => ({
      'dijkstra': m.dijkstraDetail,
    })),
  'batch-22-mst': () =>
    import('./details/batch-22-mst').then((m) => ({
      'minimum-spanning-tree': m.mstDetail,
    })),
  'batch-23-lcs': () =>
    import('./details/batch-23-lcs').then((m) => ({
      'lcs': m.lcsDetail,
    })),
  'batch-24-lis': () =>
    import('./details/batch-24-lis').then((m) => ({
      'lis': m.lisDetail,
    })),
  'batch-25-knapsack': () =>
    import('./details/batch-25-knapsack').then((m) => ({
      'knapsack-01': m.knapsackDetail,
    })),
  'batch-26-unbounded-knapsack': () =>
    import('./details/batch-26-unbounded-knapsack').then((m) => ({
      'unbounded-knapsack': m.unboundedKnapsackDetail,
    })),
  'batch-27-fast-exp': () =>
    import('./details/batch-27-fast-exp').then((m) => ({
      'fast-exponentiation': m.fastExponentiationDetail,
    })),
  'batch-28-mcm': () =>
    import('./details/batch-28-mcm').then((m) => ({
      'matrix-chain-multiplication': m.matrixChainMultiplicationDetail,
    })),
  'batch-29-bellman-ford': () =>
    import('./details/batch-29-bellman-ford').then((m) => ({
      'bellman-ford': m.bellmanFordDetail,
    })),
  'batch-30-floyd-warshall': () =>
    import('./details/batch-30-floyd-warshall').then((m) => ({
      'floyd-warshall': m.floydWarshallDetail,
    })),
  'batch-31-scc': () =>
    import('./details/batch-31-scc').then((m) => ({
      'strongly-connected-components': m.sccDetail,
    })),
  'batch-32-string-matching': () =>
    import('./details/batch-32-string-matching').then((m) => ({
      'string-matching': m.stringMatchingDetail,
    })),
  'batch-33-segment-tree': () =>
    import('./details/batch-33-segment-tree').then((m) => ({
      'segment-tree': m.segmentTreeDetail,
    })),
  'batch-34-fenwick-tree': () =>
    import('./details/batch-34-fenwick-tree').then((m) => ({
      'fenwick-tree': m.fenwickTreeDetail,
    })),
  'batch-35-prefix-sum': () =>
    import('./details/batch-35-prefix-sum').then((m) => ({
      'prefix-sum': m.prefixSumDetail,
    })),
  'batch-36-kadane': () =>
    import('./details/batch-36-kadane').then((m) => ({
      'kadane': m.kadaneDetail,
    })),
  'batch-37-merge-intervals': () =>
    import('./details/batch-37-merge-intervals').then((m) => ({
      'merge-intervals': m.mergeIntervalsDetail,
    })),
  'batch-38-fast-slow-pointers': () =>
    import('./details/batch-38-fast-slow-pointers').then((m) => ({
      'fast-slow-pointers': m.fastSlowPointersDetail,
    })),
  'batch-39-bitmask-dp': () =>
    import('./details/batch-39-bitmask-dp').then((m) => ({
      'bitmask-dp': m.bitmaskDpDetail,
    })),
  'batch-40-interval-dp': () =>
    import('./details/batch-40-interval-dp').then((m) => ({
      'interval-dp': m.intervalDpDetail,
    })),
  'batch-09-linked-lists': () =>
    import('./details/batch-09-linked-lists').then((m) => ({
      'linked-lists': m.linkedListsDetail,
    })),
  'batch-14-heaps': () =>
    import('./details/batch-14-heaps').then((m) => ({
      'heaps': m.heapsDetail,
    })),
  'batch-13-greedy': () =>
    import('./details/batch-13-greedy').then((m) => ({
      'greedy': m.greedyDetail,
    })),
  'batch-12-backtracking': () =>
    import('./details/batch-12-backtracking').then((m) => ({
      'backtracking': m.backtrackingDetail,
    })),
  'batch-11-dp': () =>
    import('./details/batch-11-dp').then((m) => ({
      'dynamic-programming': m.dynamicProgrammingDetail,
    })),
  'batch-10-graphs': () =>
    import('./details/batch-10-graphs').then((m) => ({
      'graphs': m.graphsDetail,
    })),
};

export async function loadConceptDetail(id: string): Promise<ConceptDetail | null> {
  const meta = CONCEPT_METAS.find((m) => m.id === id);
  if (!meta) return null;
  const loader = CHUNK_LOADERS[meta.chunk];
  if (!loader) return null;
  try {
    const chunk = await loader();
    return chunk[id] ?? null;
  } catch (err) {
    console.error('[concepts] failed to load detail for', id, err);
    return null;
  }
}

export function getMeta(id: string): ConceptMeta | undefined {
  return CONCEPT_METAS.find((m) => m.id === id);
}

export function getPrevNext(id: string): {
  prev: ConceptMeta | null;
  next: ConceptMeta | null;
} {
  const idx = CONCEPT_METAS.findIndex((m) => m.id === id);
  if (idx < 0) return { prev: null, next: null };
  const same = CONCEPT_METAS.filter((m) => m.category === CONCEPT_METAS[idx].category);
  const inCat = same.findIndex((m) => m.id === id);
  return {
    prev: inCat > 0 ? same[inCat - 1] : null,
    next: inCat >= 0 && inCat < same.length - 1 ? same[inCat + 1] : null,
  };
}
