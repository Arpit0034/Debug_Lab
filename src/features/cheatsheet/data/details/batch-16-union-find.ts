import type { ConceptDetail } from '../../types';

export const unionFindDetail: ConceptDetail = {
  id: 'union-find',
  overview: {
    essence:
      'Union-Find answers "are these two in the same group?" and "merge these two groups" in near-constant time. Two optimisations — path compression and union by rank — make each operation effectively O(1).',
    what:
      'A forest of trees where each set is a tree and the root identifies the set. find(x) returns the root; union(a,b) links two roots together.',
    problemSolved:
      'Dynamic connectivity: elements join groups over time, and you need to answer "same group?" queries. A BFS is O(V+E) per query; union-find is O(α(n)) amortised.',
    whyImportant:
      'Kruskal MST, cycle detection in undirected graphs, connected components in a dynamic graph, percolation, image segmentation, and accounts merging all use union-find.',
    usedIn: [
      'Kruskal\'s minimum spanning tree',
      'Cycle detection in undirected graphs',
      'Connected components of a dynamic graph',
      'Accounts merge (union records that share an email)',
      'Number of provinces / islands (grid connectivity)',
      'Percolation / image segmentation',
      'Equations satisfiability',
    ],
  },
  intuition: {
    explanation:
      'Each set is a tree; the root identifies the set. find(x) walks parent pointers until it hits a self-parent (root). union(a,b) finds both roots and makes one the parent of the other. Without optimisation, a bad merge order creates a long chain — find becomes O(n). Two fixes: (1) union by rank/size — attach the shorter tree under the taller one, keeping depth O(log n); (2) path compression — during find, re-point every node on the path directly at the root, so subsequent finds are O(1). Together they give amortised O(α(n)) — the inverse Ackermann function, effectively constant for all practical n.',
    analogy:
      'Companies merging. Each employee belongs to one company; the CEO identifies the company. To check "same company?", look up both CEOs. To merge companies, one CEO reports to the other. Path compression is like flattening the org chart during a look-up: everyone you visit reports directly to the CEO from now on.',
  },
  internals: [
    {
      title: 'parent array',
      body: 'parent[i] = i initially — each element is its own root. find walks parent[] until parent[i] == i.',
    },
    {
      title: 'find(x) with path compression',
      body: 'Recursively or iteratively walk to the root, then set every visited node\'s parent directly to the root. Amortised O(α(n)) after this.',
    },
    {
      title: 'union by rank/size',
      body: 'Attach the root with smaller rank under the root with larger rank. Keeps tree depth O(log n) even without path compression.',
    },
    {
      title: 'union(a, b)',
      body: 'ra = find(a), rb = find(b). If ra == rb, no-op (already same set). Otherwise attach the smaller-rank root under the larger.',
    },
    {
      title: 'connected(a, b)',
      body: 'find(a) == find(b). Same root means same set. O(α(n)).',
    },
    {
      title: 'Component count',
      body: 'Start count = n. Each successful union (ra ≠ rb) decrements count. Gives the current number of distinct sets in O(1).',
    },
    {
      title: 'Why α(n) is effectively constant',
      body: 'Inverse Ackermann α(n) ≤ 4 for all n < 10^600. It is not literally O(1) in theory, but you will never hit the difference.',
    },
  ],
  visual: {
    diagram:
      'Initial: parent = [0, 1, 2, 3, 4]  (each is its own root)\n' +
      '\n' +
      'union(0, 1): parent[1] = 0       union(2, 3): parent[3] = 2\n' +
      '   0      2                       \n' +
      '   |      |\n' +
      '   1      3\n' +
      '\n' +
      'union(1, 3)  → find(1)=0, find(3)=2 → parent[2] = 0\n' +
      '       0\n' +
      '      / \\\n' +
      '     1   2\n' +
      '         |\n' +
      '         3\n' +
      '\n' +
      'find(3): 3 → 2 → 0. With path compression: parent[3] = 0 directly.',
    caption:
      'Each set is a tree. find walks to the root. union attaches one root under the other.',
  },
  approach: {
    summary:
      'Two arrays: parent[] and rank[] (or size[]). find compresses paths on the way up. union attaches the smaller-rank root under the larger. connected = same find.',
    steps: [
      'Initialize parent[i] = i, rank[i] = 0 (or size[i] = 1).',
      'find(x): walk parent pointers to the root; on the way back, set each visited node\'s parent = root (path compression).',
      'union(a, b): ra = find(a), rb = find(b); if ra == rb, no-op. Else attach smaller-rank under larger.',
      'connected(a, b): find(a) == find(b).',
      'Track a component count: start at n, decrement on each successful union.',
    ],
    template: {
      code:
        'parent = list(range(n))\n' +
        'rank = [0] * n\n' +
        '\n' +
        'def find(x):\n' +
        '    if parent[x] != x:\n' +
        '        parent[x] = find(parent[x])   # path compression\n' +
        '    return parent[x]\n' +
        '\n' +
        'def union(a, b):\n' +
        '    ra, rb = find(a), find(b)\n' +
        '    if ra == rb: return False\n' +
        '    if rank[ra] < rank[rb]: ra, rb = rb, ra\n' +
        '    parent[rb] = ra\n' +
        '    if rank[ra] == rank[rb]: rank[ra] += 1\n' +
        '    return True',
      notes: ['The two optimisations are independent — apply both for O(α(n)).'],
    },
  },
  code: {
    python: {
      code:
        'class UnionFind:\n' +
        '    def __init__(self, n):\n' +
        '        self.parent = list(range(n))\n' +
        '        self.rank = [0] * n\n' +
        '        self.count = n\n' +
        '\n' +
        '    def find(self, x):\n' +
        '        while self.parent[x] != x:\n' +
        '            self.parent[x] = self.parent[self.parent[x]]  # path halving\n' +
        '            x = self.parent[x]\n' +
        '        return x\n' +
        '\n' +
        '    def union(self, a, b):\n' +
        '        ra, rb = self.find(a), self.find(b)\n' +
        '        if ra == rb: return False\n' +
        '        if self.rank[ra] < self.rank[rb]: ra, rb = rb, ra\n' +
        '        self.parent[rb] = ra\n' +
        '        if self.rank[ra] == self.rank[rb]: self.rank[ra] += 1\n' +
        '        self.count -= 1\n' +
        '        return True\n' +
        '\n' +
        '    def connected(self, a, b):\n' +
        '        return self.find(a) == self.find(b)\n' +
        '\n' +
        '# Example: cycle detection\n' +
        'def has_cycle(n, edges):\n' +
        '    uf = UnionFind(n)\n' +
        '    for u, v in edges:\n' +
        '        if not uf.union(u, v):\n' +
        '            return True\n' +
        '    return False',
      notes: [
        'Path halving (`self.parent[x] = self.parent[self.parent[x]]`) is a non-recursive path compression — often faster than full compression in Python.',
        'Union-find with path compression alone is O(log n) amortised; adding union by rank gives O(α(n)).',
      ],
    },
    java: {
      code:
        'class UnionFind {\n' +
        '    private final int[] parent;\n' +
        '    private final int[] rank;\n' +
        '    private int count;\n' +
        '\n' +
        '    public UnionFind(int n) {\n' +
        '        parent = new int[n];\n' +
        '        rank = new int[n];\n' +
        '        count = n;\n' +
        '        for (int i = 0; i < n; i++) parent[i] = i;\n' +
        '    }\n' +
        '\n' +
        '    public int find(int x) {\n' +
        '        if (parent[x] != x) parent[x] = find(parent[x]);\n' +
        '        return parent[x];\n' +
        '    }\n' +
        '\n' +
        '    public boolean union(int a, int b) {\n' +
        '        int ra = find(a), rb = find(b);\n' +
        '        if (ra == rb) return false;\n' +
        '        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }\n' +
        '        parent[rb] = ra;\n' +
        '        if (rank[ra] == rank[rb]) rank[ra]++;\n' +
        '        count--;\n' +
        '        return true;\n' +
        '    }\n' +
        '\n' +
        '    public boolean connected(int a, int b) {\n' +
        '        return find(a) == find(b);\n' +
        '    }\n' +
        '\n' +
        '    public int count() { return count; }\n' +
        '}',
      notes: [
        'Recursive find with path compression is clean and fast in Java (JIT inlines it).',
        'For very large n, the iterative path-halving variant avoids deep recursion.',
      ],
    },
    cpp: {
      code:
        '#include <vector>\n' +
        '\n' +
        'class UnionFind {\n' +
        '    std::vector<int> parent, rank_;\n' +
        '    int count_;\n' +
        'public:\n' +
        '    UnionFind(int n) : parent(n), rank_(n, 0), count_(n) {\n' +
        '        for (int i = 0; i < n; i++) parent[i] = i;\n' +
        '    }\n' +
        '\n' +
        '    int find(int x) {\n' +
        '        while (parent[x] != x) {\n' +
        '            parent[x] = parent[parent[x]];  // path halving\n' +
        '            x = parent[x];\n' +
        '        }\n' +
        '        return x;\n' +
        '    }\n' +
        '\n' +
        '    bool unite(int a, int b) {\n' +
        '        int ra = find(a), rb = find(b);\n' +
        '        if (ra == rb) return false;\n' +
        '        if (rank_[ra] < rank_[rb]) std::swap(ra, rb);\n' +
        '        parent[rb] = ra;\n' +
        '        if (rank_[ra] == rank_[rb]) rank_[ra]++;\n' +
        '        count_--;\n' +
        '        return true;\n' +
        '    }\n' +
        '\n' +
        '    bool connected(int a, int b) { return find(a) == find(b); }\n' +
        '    int count() const { return count_; }\n' +
        '};',
      notes: [
        'Iterative find avoids deep recursion. path halving keeps amortised O(α(n)).',
        'If you want path compression as well, set parent[x] = find(parent[x]) recursively.',
      ],
    },
  },
  languageNotes: [
    'Python: recursive find is clean but stack-overflows on very deep chains. Iterative path-halving is safer.',
    'Java: recursive find is idiomatic; JIT inlines well. For huge n, prefer the iterative variant.',
    'C++: iterative find with path halving is the standard idiom. Recursive is fine for small n.',
  ],
  complexity: {
    best: 'O(α(n)) — effectively O(1)',
    average: 'O(α(n))',
    worst: 'O(α(n))',
    auxiliary: 'O(n) — parent + rank arrays',
    total: 'O(α(n)) per operation, O(n) space',
    why: [
      {
        label: 'O(α(n)) with both optimisations',
        reason:
          'Union by rank bounds tree height to O(log n). Path compression flattens the path so subsequent finds are effectively O(1). Combined: inverse Ackermann, ≤ 4 for all realistic n.',
      },
      {
        label: 'O(log n) with one optimisation',
        reason:
          'Union by rank alone → O(log n). Path compression alone → O(log n) amortised. Either alone is fine; both is best.',
      },
      {
        label: 'O(n) worst case without optimisation',
        reason:
          'A bad merge order (always attaching the larger tree under the smaller) creates a chain of depth n. find becomes O(n).',
      },
      {
        label: 'O(n) space',
        reason: 'Two arrays of size n — parent and rank. No adjacency or edge lists needed.',
      },
    ],
  },
  dryRun: {
    input: 'n = 5, unions: (0,1), (2,3), (1,3); query connected(0, 3)',
    initialState: 'parent = [0,1,2,3,4], rank = [0,0,0,0,0], count = 5',
    steps: [
      { step: '1', state: 'union(0,1): find(0)=0, find(1)=1, ranks equal → parent[1]=0, rank[0]=1, count=4', note: '0 is root, 1 under it.' },
      { step: '2', state: 'union(2,3): find(2)=2, find(3)=3, ranks equal → parent[3]=2, rank[2]=1, count=3', note: '2 is root, 3 under it.' },
      { step: '3', state: 'union(1,3): find(1)=0, find(3)=2, ranks equal → parent[2]=0, rank[0]=2, count=2', note: 'Tree rooted at 0 has all four nodes.' },
      { step: '4', state: 'connected(0, 3): find(0)=0, find(3)=0 (path compressed)', note: 'true.' },
    ],
    output: 'connected(0, 3) = true, count = 2',
  },
  whenToUse: [
    'Dynamic connectivity: elements join over time, need "same group?" queries.',
    'Kruskal\'s MST — sort edges by weight, add edges if union(a, b) returns true (no cycle).',
    'Cycle detection in undirected graphs — union-find finds the first edge that closes a cycle.',
    'Connected components (grid, graph) where the graph is built incrementally.',
    'Accounts merge — union email indices that share a record.',
    'Detecting redundant connections.',
    'Constraint satisfaction problems modelled as equivalence relations.',
  ],
  whenNotToUse: [
    'You need to traverse or find a path — use BFS or DFS instead.',
    'You need to split sets (un-union) — union-find only merges.',
    'Directed graph cycles — use DFS with colouring or topological sort.',
    'The graph is static and you only need one answer — plain DFS is O(V+E) once.',
  ],
  mistakes: [
    {
      mistake: 'Not using path compression OR union by rank — O(n) worst case.',
      fix:
        'Always apply at least one. Applying both is trivial: two extra lines in find and union, and you get O(α(n)).',
    },
    {
      mistake: 'Comparing parent[a] == parent[b] for connectivity.',
      fix:
        'Compare roots: find(a) == find(b). Two elements under the same grandparent are connected even if their direct parents differ.',
    },
    {
      mistake: 'Union by rank without path compression in recursive find — stack overflow.',
      fix:
        'Use iterative path halving in Python/C++ for safety. Recursion depth is up to tree height, which is O(log n) after rank, but path-compressed recursion can still be deep on the first find.',
    },
    {
      mistake: 'Forgetting to increment rank only when ranks are equal.',
      fix:
        'if rank[ra] == rank[rb]: rank[ra] += 1. Incrementing unconditionally makes ranks useless — the tree can still skew.',
    },
    {
      mistake: 'Trying to use union-find for directed graph connectivity.',
      fix:
        'Union-find is for undirected equivalence. Directed connectivity needs DFS/BFS or strongly connected components (Tarjan / Kosaraju).',
    },
  ],
  interview: {
    questions: [
      'Number of Provinces — LeetCode 547. Union-find over an adjacency matrix.',
      'Redundant Connection — LeetCode 684. Find the edge that closes a cycle.',
      'Accounts Merge — LeetCode 721. Union email indices per account, group by root.',
      'Longest Consecutive Sequence — LeetCode 128. Union adjacent values.',
      'Satisfiability of Equality Equations — LeetCode 990. Union equalities, then check inequalities.',
      'Number of Islands II — union-find with incremental land additions (best-fit for DSU).',
    ],
    observations: [
      'Union-find shines when the graph is built incrementally — you cannot "re-BFS" per query.',
      'Cycle detection in undirected graphs: a cycle exists iff union(a, b) returns false for some edge.',
      'Kruskal\'s MST is union-find with a sorted edge list.',
      'Path compression is often written as `parent[x] = find(parent[x])` — one line.',
    ],
    optimizations: [
      'Path halving (iterative) is often faster than full compression in practice.',
      'Union by size often beats union by rank by a small constant.',
      'Rollback DSU (union-find with undo) for problems that need it — copy parent[] before each union.',
    ],
    followUps: [
      'What if you need to split sets? — union-find does not support split. Use a different structure.',
      'What if the graph is directed? — use DFS/SCC, not union-find.',
      'What about offline queries? — process them in chronological order with a persistent DSU.',
    ],
  },
  related: [
    { id: 'trees', relation: 'Each set is a tree; the root identifies the set' },
  ],
  practice: [
    { title: 'Number of Provinces', difficulty: 'Medium', why: 'The cleanest DSU problem — count components in an adjacency matrix.' },
    { title: 'Redundant Connection', difficulty: 'Medium', why: 'First edge where union returns false is the cycle-closing one.' },
    { title: 'Accounts Merge', difficulty: 'Medium', why: 'Union email indices, then group by root and sort.' },
    { title: 'Longest Consecutive Sequence', difficulty: 'Medium', why: 'Union adjacent values, find the largest component.' },
    { title: 'Satisfiability of Equality Equations', difficulty: 'Medium', why: 'Union equalities, then check inequalities do not connect.' },
  ],
  revision: {
    takeaways: [
      'Union-find answers "same group?" and "merge groups" in O(α(n)).',
      'Two optimisations: union by rank + path compression → effectively O(1).',
      'find returns the root; union links two roots; connected = find(a) == find(b).',
      'Cycle detection in undirected graphs: any union that returns false closes a cycle.',
    ],
    formulas: [
      'find(x): parent[x] = find(parent[x])  (path compression)',
      'union(a, b): attach smaller rank under larger',
      'count decrements on every successful union (ra != rb)',
    ],
    complexitySummary:
      'O(α(n)) per operation with both optimisations. O(n) space. Effectively O(1) for any realistic n.',
    patterns: [
      'Dynamic connectivity',
      'Cycle detection in undirected graphs',
      'Kruskal MST',
      'Accounts merge / grouping',
    ],
    memoryTrick:
      'Two arrays (parent, rank). find walks to root + compresses. union attaches smaller under larger. Both → O(α(n)).',
  },
};
