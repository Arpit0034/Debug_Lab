import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p070',
  title: 'The cycle check is missing',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Minimum Spanning Tree',
  tags: ['Graph', 'MST', 'Union-Find'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Kruskal style minimum spanning tree with union-find',
  description:
    'Return the total weight of a minimum spanning tree over an undirected weighted graph given its edges sorted by weight. The routine adds an edge even when it would close a cycle.',
  constraints: ['1 <= n <= 100', 'Edges are sorted by weight', 'All weights are positive'],
  examples: [
    { input: 'n = 3, edges = [[0,1,1],[1,2,1],[0,2,5]]', output: '2' },
  ],
  hints: ['When should an edge be skipped during the merge step?', 'Consider what happens when both endpoints share the same set.'],
  complexity: { time: 'O(E alpha(n))', space: 'O(n)' },
  explanation: {
    overview: 'Build a minimum spanning tree by adding edges in increasing weight order.',
    algorithm: 'Scan edges in weight order. If the endpoints belong to different sets, merge them and add the edge weight to the total; otherwise skip the edge.',
    bug: 'The cycle check is disabled, so edges whose endpoints already share a root are still added.',
    whyItFails: 'Adding an edge inside an existing component creates a cycle, so the total includes extra weight that a spanning tree must not contain.',
    failingTestCase: 'For edges 0-1 (weight 1), 1-2 (weight 1) and 0-2 (weight 5), the code returns 7 instead of 2.',
    fix: 'Skip an edge when its endpoints already share the same root.',
    whyFixWorks: 'Only edges that join two different components belong in the tree, which keeps the total minimal.',
    dryRun: 'Initially each vertex is its own set. Add 0-1 (total 1), then 1-2 (total 2). Edge 0-2 closes a cycle: correct code skips it, buggy code adds 5 for a total of 7.',
    debuggingLesson: 'In union-find based MST routines, always verify the cycle check before adding an edge weight.',
  },
  testCases: [
    { input: '3, [[0,1,1],[1,2,1],[0,2,5]]', expected: '2', buggyOutput: '7' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.print(Solution.mstWeight(3, new int[][]{{0,1,1},{1,2,1},{0,2,5}}));`,
      python: `print(mst_weight(3, [(0,1,1),(1,2,1),(0,2,5)]))`,
      c: `printf("%d", mst_weight(3, (int[][3]){{0,1,1},{1,2,1},{0,2,5}}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] p;
    static int find(int x) {
        while (p[x] != x) {
            p[x] = p[p[x]];
            x = p[x];
        }
        return x;
    }
    static int mstWeight(int n, int[][] edges) {
        p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        int total = 0;
        for (int[] e : edges) {
            int a = find(e[0]), b = find(e[1]);
            if (a == b) continue;
            p[a] = b;
            total += e[2];
        }
        return total;
    }
}
`,
      bugs: { 16: { was: 'if (a == b) continue;', buggy: 'if (1 == 2) continue;' } },
    },
    python: {
      correct: `
def mst_weight(n, edges):
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    total = 0
    for u, v, w in edges:
        a, b = find(u), find(v)
        if a == b:
            continue
        p[a] = b
        total += w
    return total
`,
      bugs: { 12: { was: 'if a == b:', buggy: 'if 1 == 2:' } },
    },
    c: {
      correct: `
int mst_p[100];
int mst_find(int x) {
    while (mst_p[x] != x) {
        mst_p[x] = mst_p[mst_p[x]];
        x = mst_p[x];
    }
    return x;
}
int mst_weight(int n, int edges[][3], int m) {
    for (int i = 0; i < n; i++) mst_p[i] = i;
    int total = 0;
    for (int i = 0; i < m; i++) {
        int a = mst_find(edges[i][0]), b = mst_find(edges[i][1]);
        if (a == b) continue;
        mst_p[a] = b;
        total += edges[i][2];
    }
    return total;
}
`,
      bugs: { 14: { was: 'if (a == b) continue;', buggy: 'if (1 == 2) continue;' } },
    },
  },
});
