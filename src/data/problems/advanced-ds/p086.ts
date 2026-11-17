import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p086',
  title: 'A repeated edge shrinks the count',
  difficulty: 'Easy',
  topic: 'Advanced Data Structures',
  subtopic: 'Union-Find Components',
  tags: ['Union-Find', 'Components', 'Duplicate Edge'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Counting connected components with a disjoint-set structure',
  description:
    'Return the number of connected components after processing edges. A duplicate edge incorrectly reduces the component count.',
  constraints: ['1 <= n <= 100', 'Edges may repeat'],
  examples: [
    { input: 'n = 3, edges = [[0,1],[1,0]]', output: '2' },
  ],
  hints: ['What should happen when both endpoints already share a root?', 'Only a successful merge should reduce the number of components.'],
  complexity: { time: 'O(E alpha(n))', space: 'O(n)' },
  explanation: {
    overview: 'Maintain connected components under edge additions with union-find.',
    algorithm: 'Start with n components. For each edge, find the roots. If the roots differ, merge them and decrement the count.',
    bug: 'When the roots are already equal, the code decrements the component count before returning.',
    whyItFails: 'A duplicate or internal edge does not merge two components, so the count becomes too small.',
    failingTestCase: 'For n = 3 and edges 0-1, 1-0, the code returns 1 instead of 2.',
    fix: 'Return immediately when the roots are equal, without changing the count.',
    whyFixWorks: 'The component count changes only when two different sets are actually joined.',
    dryRun: 'Initially components=3. Edge 0-1 merges and makes it 2. The duplicate 1-0 has equal roots. Correct code leaves it 2; buggy code decrements to 1.',
    debuggingLesson: 'In union-find, update the component count only after a successful union.',
  },
  testCases: [
    { input: '3, [[0,1],[1,0]]', expected: '2', buggyOutput: '1' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.print(Solution.countComponents(3, new int[][]{{0,1},{1,0}}));`,
      python: `print(count_components_uf(3, [(0,1),(1,0)]))`,
      c: `printf("%d", count_components_uf(3, (int[][2]){{0,1},{1,0}}, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] parent;
    static int comps;
    static int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
    static void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        parent[ra] = rb;
        comps--;
    }
    static int countComponents(int n, int[][] edges) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        comps = n;
        for (int[] e : edges) union(e[0], e[1]);
        return comps;
    }
}
`,
      bugs: { 13: { was: 'if (ra == rb) return', buggy: 'if (ra == rb) { comps--; return; }' } },
    },
    python: {
      correct: `
def count_components_uf(n, edges):
    parent = list(range(n))
    comps = [n]
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb: return
        parent[ra] = rb
        comps[0] -= 1
    for u, v in edges:
        union(u, v)
    return comps[0]
`,
      bugs: { 11: { was: 'if ra == rb: return', buggy: 'if ra == rb: comps[0] -= 1; return' } },
    },
    c: {
      correct: `
int uf_parent[100];
int uf_comps;

int uf_find(int x) {
    while (uf_parent[x] != x) {
        uf_parent[x] = uf_parent[uf_parent[x]];
        x = uf_parent[x];
    }
    return x;
}

void uf_union(int a, int b) {
    int ra = uf_find(a), rb = uf_find(b);
    if (ra == rb) return;
    uf_parent[ra] = rb;
    uf_comps--;
}

int count_components_uf(int n, int edges[][2], int m) {
    for (int i = 0; i < n; i++) uf_parent[i] = i;
    uf_comps = n;
    for (int i = 0; i < m; i++) uf_union(edges[i][0], edges[i][1]);
    return uf_comps;
}
`,
      bugs: { 14: { was: 'if (ra == rb) return', buggy: 'if (ra == rb) { uf_comps--; return; }' } },
    },
  },
});
