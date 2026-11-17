import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p074',
  title: 'The stack skips the last neighbour',
  difficulty: 'Easy',
  topic: 'Graphs',
  subtopic: 'DFS Traversal Order',
  tags: ['Graph', 'DFS', 'Traversal'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Iterative depth-first traversal order in an undirected graph',
  description:
    'Return the order in which vertices are visited from a given start vertex. The traversal misses one neighbour because of a loop bound.',
  constraints: ['1 <= n <= 100', 'The graph is undirected'],
  examples: [
    { input: 'n = 4, edges = [[0,1],[0,2],[0,3]], s = 0', output: '0 3 2 1' },
  ],
  hints: ['Trace how many neighbours are pushed when the start vertex is processed.', 'Check the upper bound used when scanning neighbours.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Produce the visit order of an iterative depth-first traversal.',
    algorithm: 'Use an explicit stack, mark a vertex when pushed, and scan all possible neighbours.',
    bug: 'The neighbour loop stops before the last vertex index.',
    whyItFails: 'The last neighbour is never pushed, so it is absent from the traversal order.',
    failingTestCase: 'For a star with centre 0 connected to 1, 2, 3, the code returns 0 2 1 instead of 0 3 2 1.',
    fix: 'Let the neighbour loop run while nb < n.',
    whyFixWorks: 'All vertex indices from 0 through n - 1 are considered, so no neighbour is skipped.',
    dryRun: 'Start at 0. Correct pushes neighbours 1, 2, 3; stack pops 3, 2, 1. Buggy loop stops at nb < 3, so it pushes only 1 and 2; stack pops 2, 1.',
    debuggingLesson: 'When scanning a fixed range of vertices, verify the loop bound includes the final index.',
  },
  testCases: [
    { input: '4, [[0,1],[0,2],[0,3]], 0', expected: '0 3 2 1', buggyOutput: '0 2 1' },
  ],
  harness: {
    expected: '0 3 2 1',
    driver: {
      java: `System.out.print(Solution.dfsOrder(4, new int[][]{{0,1},{0,2},{0,3}}, 0));`,
      python: `print(dfs_order(4, [(0,1),(0,2),(0,3)], 0))`,
      c: `int out[10]; int len; dfs_order(4, (int[][2]){{0,1},{0,2},{0,3}}, 3, 0, out, &len); for (int i = 0; i < len; i++) printf("%d ", out[i]);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static String dfsOrder(int n, int[][] edges, int s) {
        int[][] g = new int[n][n];
        for (int[] e : edges) {
            g[e[0]][e[1]] = 1;
            g[e[1]][e[0]] = 1;
        }
        boolean[] seen = new boolean[n];
        int[] stack = new int[n * n];
        int top = 0;
        StringBuilder sb = new StringBuilder();
        stack[top++] = s;
        seen[s] = true;
        while (top > 0) {
            int cur = stack[--top];
            sb.append(cur).append(' ');
            for (int nb = 0; nb < n; nb++) {
                if (g[cur][nb] == 1 && !seen[nb]) {
                    seen[nb] = true;
                    stack[top++] = nb;
                }
            }
        }
        return sb.toString().trim();
    }
}
`,
      bugs: { 17: { was: 'nb < n', buggy: 'for (int nb = 0; nb < n - 1; nb++) {' } },
    },
    python: {
      correct: `
def dfs_order(n, edges, s):
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
        g[v][u] = 1
    seen = [False] * n
    stack = [s]
    seen[s] = True
    out = []
    while stack:
        cur = stack.pop()
        out.append(str(cur))
        for nb in range(n):
            if g[cur][nb] == 1 and not seen[nb]:
                seen[nb] = True
                stack.append(nb)
    return ' '.join(out)
`,
      bugs: { 13: { was: 'range(n)', buggy: 'range(n - 1)' } },
    },
    c: {
      correct: `
void dfs_order(int n, int edges[][2], int m, int s, int out[], int *len) {
    int g[10][10] = {0};
    for (int i = 0; i < m; i++) {
        int u = edges[i][0];
        int v = edges[i][1];
        g[u][v] = 1;
        g[v][u] = 1;
    }
    int seen[10] = {0};
    int stack[100];
    int top = 0;
    stack[top++] = s;
    seen[s] = 1;
    *len = 0;
    while (top > 0) {
        int cur = stack[--top];
        out[(*len)++] = cur;
        for (int nb = 0; nb < n; nb++) {
            if (g[cur][nb] == 1 && !seen[nb]) {
                seen[nb] = 1;
                stack[top++] = nb;
            }
        }
    }
}
`,
      bugs: { 18: { was: 'nb < n', buggy: 'for (int nb = 0; nb < n - 1; nb++) {' } },
    },
  },
});
