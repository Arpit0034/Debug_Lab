import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p096',
  title: 'The largest component is undercounted',
  difficulty: 'Medium',
  topic: 'Advanced Data Structures',
  subtopic: 'Union-Find Component Size',
  tags: ['Union-Find', 'Component Size', 'Union by Size'],
  bugCategory: 'Incorrect Counting Update',
  sourceInspiredBy: 'Largest connected component size using union by size',
  description:
    'Return the size of the largest connected component in an undirected graph. When two components merge, the size update overwrites the new root size instead of adding to it.',
  constraints: ['1 <= n <= 100', 'The graph is undirected'],
  examples: [
    { input: 'n = 5, edges = [[0,1],[2,3],[3,4]]', output: '3' },
  ],
  hints: ['A merge should combine both component sizes.', 'Check the size of the root that survives the union.'],
  complexity: { time: 'O(E alpha(n))', space: 'O(n)' },
  explanation: {
    overview: 'Track component sizes with union-find and return the largest size.',
    algorithm: 'Maintain a size for each root. When merging two roots, attach the smaller to the larger and add the smaller size into the larger.',
    bug: 'The code assigns sz[rb] = sz[ra] instead of adding sz[ra].',
    whyItFails: 'The surviving root loses its previous component size, so merged components are reported much smaller than they are.',
    failingTestCase: 'For edges 0-1, 2-3, 3-4, the code returns 1 instead of 3.',
    fix: 'Use sz[rb] += sz[ra].',
    whyFixWorks: 'The new root size is the sum of both merged components.',
    dryRun: 'Union 2-3 gives size 1 with the buggy overwrite instead of 2. Union 3-4 overwrites again to 1. The three-vertex component is never recorded as size 3.',
    debuggingLesson: 'When merging aggregate values, decide whether the operation is assignment or accumulation.',
  },
  testCases: [
    { input: '5, [[0,1],[2,3],[3,4]]', expected: '3', buggyOutput: '1' },
  ],
  harness: {
    expected: '3',
    driver: {
      java: `System.out.print(Solution.largestComponent(5, new int[][]{{0,1},{2,3},{3,4}}));`,
      python: `print(largest_component(5, [(0,1),(2,3),(3,4)]))`,
      c: `printf("%d", largest_component(5, (int[][2]){{0,1},{2,3},{3,4}}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] p;
    static int[] sz;
    static int find(int x) {
        while (p[x] != x) {
            p[x] = p[p[x]];
            x = p[x];
        }
        return x;
    }
    static void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (sz[ra] > sz[rb]) {
            int t = ra; ra = rb; rb = t;
        }
        p[ra] = rb;
        sz[rb] += sz[ra];
    }
    static int largestComponent(int n, int[][] edges) {
        p = new int[n];
        sz = new int[n];
        for (int i = 0; i < n; i++) { p[i] = i; sz[i] = 1; }
        for (int[] e : edges) union(e[0], e[1]);
        int best = 0;
        for (int i = 0; i < n; i++) best = Math.max(best, sz[i]);
        return best;
    }
}
`,
      bugs: { 18: { was: 'sz[rb] += sz[ra]', buggy: 'sz[rb] = sz[ra];' } },
    },
    python: {
      correct: `
def largest_component(n, edges):
    p = list(range(n))
    sz = [1] * n
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return
        if sz[ra] > sz[rb]:
            ra, rb = rb, ra
        p[ra] = rb
        sz[rb] += sz[ra]
    for u, v in edges:
        union(u, v)
    return max(sz)
`,
      bugs: { 16: { was: 'sz[rb] += sz[ra]', buggy: 'sz[rb] = sz[ra]' } },
    },
    c: {
      correct: `
int comp_p[100];
int comp_sz[100];

int comp_find(int x) {
    while (comp_p[x] != x) {
        comp_p[x] = comp_p[comp_p[x]];
        x = comp_p[x];
    }
    return x;
}

void comp_union(int a, int b) {
    int ra = comp_find(a), rb = comp_find(b);
    if (ra == rb) return;
    if (comp_sz[ra] > comp_sz[rb]) {
        int t = ra; ra = rb; rb = t;
    }
    comp_p[ra] = rb;
    comp_sz[rb] += comp_sz[ra];
}

int largest_component(int n, int edges[][2], int m) {
    for (int i = 0; i < n; i++) {
        comp_p[i] = i;
        comp_sz[i] = 1;
    }
    for (int i = 0; i < m; i++) comp_union(edges[i][0], edges[i][1]);
    int best = 0;
    for (int i = 0; i < n; i++) if (comp_sz[i] > best) best = comp_sz[i];
    return best;
}
`,
      bugs: { 19: { was: 'comp_sz[rb] += comp_sz[ra]', buggy: 'comp_sz[rb] = comp_sz[ra];' } },
    },
  },
});
