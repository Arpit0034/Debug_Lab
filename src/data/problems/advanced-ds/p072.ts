import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p072',
  title: 'The shorter set becomes the root',
  difficulty: 'Medium',
  topic: 'Advanced Data Structures',
  subtopic: 'Union by Size',
  tags: ['Union-Find', 'Union by Size', 'Complexity'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Union by size in a disjoint-set structure',
  description:
    'Return the tree height after several unions using union by size. The comparison keeps the smaller tree as the parent, so heights do not stay small.',
  constraints: ['1 <= n <= 100', 'The input forms disjoint singleton sets'],
  examples: [
    { input: 'n = 4, edges = [[0,1],[1,2],[2,3]]', output: '2' },
  ],
  hints: ['Which root should become the parent when two sets are merged?', 'Union by size makes the smaller tree point to the larger one.'],
  complexity: { time: 'O(alpha(n))', space: 'O(n)' },
  explanation: {
    overview: 'Merge sets using union by size and report the resulting tree height.',
    algorithm: 'Always attach the smaller set under the larger root so tree heights stay logarithmic.',
    bug: 'The swap condition is inverted; when size of ra is smaller than size of rb, the code still makes ra the parent.',
    whyItFails: 'The chain grows linearly instead of logarithmically, and the reported height is larger than necessary.',
    failingTestCase: 'For 0-1, 1-2, 2-3, the correct height is 2 but the buggy code reports 3.',
    fix: 'Swap the roots only when sz[ra] is smaller, so the larger root becomes the parent.',
    whyFixWorks: 'Larger roots stay on top, keeping tree height close to the logarithm of the set size.',
    dryRun: 'Union 0-1: sizes equal, no swap. Union 1-2: the faulty check swaps, making the smaller root the parent and adding one to the chain. Union 2-3 grows the chain further, giving height 3 instead of 2.',
    debuggingLesson: 'In union by size, verify that the parent always comes from the larger tree.',
  },
  testCases: [
    { input: '4, [[0,1],[1,2],[2,3]]', expected: '2', buggyOutput: '3' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.print(Solution.height(4, new int[][]{{0,1},{1,2},{2,3}}));`,
      python: `print(height_uf(4, [(0,1),(1,2),(2,3)]))`,
      c: `printf("%d", height_uf(4, (int[][2]){{0,1},{1,2},{2,3}}, 3));`,
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
        if (sz[ra] < sz[rb]) {
            int t = ra; ra = rb; rb = t;
        }
        p[rb] = ra;
        sz[ra] += sz[rb];
    }
    static int height(int n, int[][] edges) {
        p = new int[n];
        sz = new int[n];
        for (int i = 0; i < n; i++) { p[i] = i; sz[i] = 1; }
        for (int[] e : edges) union(e[0], e[1]);
        int best = 0;
        for (int i = 0; i < n; i++) {
            int d = 0, x = i;
            while (p[x] != x) { x = p[x]; d++; }
            if (d > best) best = d;
        }
        return best;
    }
}
`,
      bugs: { 14: { was: 'if (sz[ra] < sz[rb]) {', buggy: 'if (sz[ra] > sz[rb]) {' } },
    },
    python: {
      correct: `
def height_uf(n, edges):
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
        if sz[ra] < sz[rb]:
            ra, rb = rb, ra
        p[rb] = ra
        sz[ra] += sz[rb]
    for u, v in edges:
        union(u, v)
    best = 0
    for i in range(n):
        d = 0
        x = i
        while p[x] != x:
            x = p[x]
            d += 1
        if d > best:
            best = d
    return best
`,
      bugs: { 11: { was: 'if sz[ra] < sz[rb]:', buggy: 'if sz[ra] > sz[rb]:' } },
    },
    c: {
      correct: `
int h_p[100], h_sz[100];
int h_find(int x) {
    while (h_p[x] != x) { h_p[x] = h_p[h_p[x]]; x = h_p[x]; }
    return x;
}
void h_union(int a, int b) {
    int ra = h_find(a), rb = h_find(b);
    if (ra == rb) return;
    if (h_sz[ra] < h_sz[rb]) { int t = ra; ra = rb; rb = t; }
    h_p[rb] = ra;
    h_sz[ra] += h_sz[rb];
}
int height_uf(int n, int edges[][2], int m) {
    for (int i = 0; i < n; i++) { h_p[i] = i; h_sz[i] = 1; }
    for (int i = 0; i < m; i++) h_union(edges[i][0], edges[i][1]);
    int best = 0;
    for (int i = 0; i < n; i++) {
        int d = 0, x = i;
        while (h_p[x] != x) { x = h_p[x]; d++; }
        if (d > best) best = d;
    }
    return best;
}
`,
      bugs: { 8: { was: 'h_sz[ra] < h_sz[rb]', buggy: 'h_sz[ra] > h_sz[rb]' } },
    },
  },
});
