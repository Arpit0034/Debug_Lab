import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p087',
  title: 'The extra edge is hidden',
  difficulty: 'Medium',
  topic: 'Advanced Data Structures',
  subtopic: 'Union-Find Cycle Detection',
  tags: ['Union-Find', 'Cycle', 'Undirected'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Cycle detection with a disjoint-set structure',
  description:
    'Return whether an undirected graph contains a cycle. The union operation ignores the edge that connects two vertices already in the same set.',
  constraints: ['1 <= n <= 100', 'The graph is undirected'],
  examples: [
    { input: 'n = 3, edges = [[0,1],[1,2],[2,0]]', output: '1' },
  ],
  hints: ['What does it mean when two endpoints already have the same root?', 'That situation is exactly the cycle condition.'],
  complexity: { time: 'O(E alpha(n))', space: 'O(n)' },
  explanation: {
    overview: 'Detect a cycle in an undirected graph using union-find.',
    algorithm: 'Process edges one by one. If both endpoints already share a root, a cycle is found. Otherwise union them.',
    bug: 'When the roots are equal, the code returns false instead of true.',
    whyItFails: 'The only edge that closes a cycle is exactly the edge whose endpoints are already connected. Returning false hides every cycle.',
    failingTestCase: 'For the triangle 0-1, 1-2, 2-0, the code returns 0 instead of 1.',
    fix: 'Return true when the roots are equal.',
    whyFixWorks: 'An edge inside an existing component creates an alternate path between its endpoints, which is a cycle.',
    dryRun: 'Union 0-1 and 1-2. For edge 2-0, both roots are the same. Correct code returns true; buggy code returns false.',
    debuggingLesson: 'In union-find cycle detection, equal roots are the signal, not a reason to stop silently.',
  },
  testCases: [
    { input: '3, [[0,1],[1,2],[2,0]]', expected: '1', buggyOutput: '0' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.print(Solution.hasCycle(3, new int[][]{{0,1},{1,2},{2,0}}) ? 1 : 0);`,
      python: `print(1 if has_cycle_uf(3, [(0,1),(1,2),(2,0)]) else 0)`,
      c: `printf("%d", has_cycle_uf(3, (int[][2]){{0,1},{1,2},{2,0}}, 3));`,
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
    static boolean hasCycle(int n, int[][] edges) {
        p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        for (int[] e : edges) {
            int a = find(e[0]), b = find(e[1]);
            if (a == b) return true;
            p[a] = b;
        }
        return false;
    }
}
`,
      bugs: { 15: { was: 'return true', buggy: 'if (a == b) return false;' } },
    },
    python: {
      correct: `
def has_cycle_uf(n, edges):
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra == rb:
            return True
        p[ra] = rb
    return False
`,
      bugs: { 11: { was: 'return True', buggy: 'return False' } },
    },
    c: {
      correct: `
int cyc_parent[100];
int cyc_find(int x) {
    while (cyc_parent[x] != x) {
        cyc_parent[x] = cyc_parent[cyc_parent[x]];
        x = cyc_parent[x];
    }
    return x;
}
int has_cycle_uf(int n, int edges[][2], int m) {
    for (int i = 0; i < n; i++) cyc_parent[i] = i;
    for (int i = 0; i < m; i++) {
        int a = cyc_find(edges[i][0]), b = cyc_find(edges[i][1]);
        if (a == b) return 1;
        cyc_parent[a] = b;
    }
    return 0;
}
`,
      bugs: { 13: { was: 'return 1', buggy: 'if (a == b) return 0;' } },
    },
  },
});
