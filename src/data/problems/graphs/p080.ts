import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p080',
  title: 'A lone vertex is not counted',
  difficulty: 'Easy',
  topic: 'Graphs',
  subtopic: 'Connected Components',
  tags: ['Graph', 'Components', 'DFS'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Counting connected components in an undirected graph',
  description:
    'Return the number of connected components in an undirected graph. The outer scan does not look at the final vertex.',
  constraints: ['1 <= n <= 100', 'The graph is undirected'],
  examples: [
    { input: 'n = 4, edges = [[0,1]]', output: '3' },
  ],
  hints: ['Which vertex indices does the outer loop actually visit?', 'An isolated final vertex still counts as a component.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Count connected components in an undirected graph.',
    algorithm: 'Scan every vertex; when an unvisited vertex is found, start a traversal and increment the component count.',
    bug: 'The scan stops at n - 1 instead of including n - 1.',
    whyItFails: 'If the last vertex is isolated or starts its own component, it is never counted.',
    failingTestCase: 'For n = 4 with only edge 0-1, the code returns 2 instead of 3.',
    fix: 'Let the scan run while i < n.',
    whyFixWorks: 'Every vertex index is considered, including the final one.',
    dryRun: 'The correct scan visits 0 and marks 1, then visits 2, then visits isolated 3, giving 3. The buggy scan never reaches 3 and returns 2.',
    debuggingLesson: 'When counting over indices, check that the loop includes the last valid index.',
  },
  testCases: [
    { input: '4, [[0,1]]', expected: '3', buggyOutput: '2' },
  ],
  harness: {
    expected: '3',
    driver: {
      java: `System.out.print(Solution.countComponents(4, new int[][]{{0,1}}));`,
      python: `print(count_components(4, [(0,1)]))`,
      c: `printf("%d", count_components(4, (int[][2]){{0,1}}, 1));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int countComponents(int n, int[][] edges) {
        int[][] g = new int[n][n];
        for (int[] e : edges) {
            g[e[0]][e[1]] = 1;
            g[e[1]][e[0]] = 1;
        }
        boolean[] seen = new boolean[n];
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (!seen[i]) {
                count++;
                dfs(g, seen, i);
            }
        }
        return count;
    }
    static void dfs(int[][] g, boolean[] seen, int u) {
        seen[u] = true;
        for (int v = 0; v < seen.length; v++) {
            if (g[u][v] == 1 && !seen[v]) dfs(g, seen, v);
        }
    }
}
`,
      bugs: { 10: { was: 'i < n', buggy: 'for (int i = 0; i < n - 1; i++) {' } },
    },
    python: {
      correct: `
def count_components(n, edges):
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
        g[v][u] = 1
    seen = [False] * n
    def dfs(u):
        seen[u] = True
        for v in range(n):
            if g[u][v] == 1 and not seen[v]:
                dfs(v)
    count = 0
    for i in range(n):
        if not seen[i]:
            count += 1
            dfs(i)
    return count
`,
      bugs: { 13: { was: 'range(n)', buggy: 'range(n - 1)' } },
    },
    c: {
      correct: `
void dfs_comp(int n, int g[][10], int seen[], int u) {
    seen[u] = 1;
    for (int v = 0; v < n; v++) {
        if (g[u][v] == 1 && !seen[v]) dfs_comp(n, g, seen, v);
    }
}

int count_components(int n, int edges[][2], int m) {
    int g[10][10] = {0};
    for (int i = 0; i < m; i++) {
        int u = edges[i][0], v = edges[i][1];
        g[u][v] = 1;
        g[v][u] = 1;
    }
    int seen[10] = {0};
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (!seen[i]) {
            count++;
            dfs_comp(n, g, seen, i);
        }
    }
    return count;
}
`,
      bugs: { 17: { was: 'i < n', buggy: 'for (int i = 0; i < n - 1; i++) {' } },
    },
  },
});
