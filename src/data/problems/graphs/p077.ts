import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p077',
  title: 'A finished vertex looks like a loop',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Directed Cycle Detection',
  tags: ['Graph', 'Cycle', 'DFS'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Three-colour depth-first cycle detection in a directed graph',
  description:
    'Return whether a directed graph contains a cycle. The traversal confuses a finished vertex with an active one.',
  constraints: ['1 <= n <= 100', 'Edges are directed'],
  examples: [
    { input: 'n = 3, edges = [[0,1],[0,2],[1,2]]', output: '0' },
  ],
  hints: ['Distinguish an active vertex from a completely processed vertex.', 'A cycle exists only when the next vertex is still active.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Detect a directed cycle using traversal states.',
    algorithm: 'Colour vertices as unvisited, active, and finished. A back edge to an active vertex means a cycle.',
    bug: 'The code treats an edge to a finished vertex as a cycle.',
    whyItFails: 'A finished vertex is not on the current recursion path, so reaching it does not create a cycle. The algorithm reports false positives.',
    failingTestCase: 'For edges 0->1, 0->2, 1->2, the graph is acyclic but the code returns 1.',
    fix: 'Report a cycle only when the neighbour is active.',
    whyFixWorks: 'Only an active neighbour lies on the current path and closes a directed cycle.',
    dryRun: 'DFS visits 0, then 1, then 2. Vertex 2 is finished. Returning to 0, edge 0->2 points to a finished vertex. The buggy code returns true; correct code ignores it.',
    debuggingLesson: 'In directed cycle detection, the difference between active and finished is the whole algorithm.',
  },
  testCases: [
    { input: '3, [[0,1],[0,2],[1,2]]', expected: '0', buggyOutput: '1' },
  ],
  harness: {
    expected: '0',
    driver: {
      java: `System.out.print(Solution.hasDirectedCycle(3, new int[][]{{0,1},{0,2},{1,2}}) ? 1 : 0);`,
      python: `print(1 if has_directed_cycle(3, [(0,1),(0,2),(1,2)]) else 0)`,
      c: `printf("%d", has_directed_cycle(3, (int[][2]){{0,1},{0,2},{1,2}}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean hasDirectedCycle(int n, int[][] edges) {
        int[][] g = new int[n][n];
        for (int[] e : edges) g[e[0]][e[1]] = 1;
        int[] color = new int[n];
        for (int i = 0; i < n; i++) {
            if (color[i] == 0 && dfs(g, color, i)) return true;
        }
        return false;
    }
    static boolean dfs(int[][] g, int[] color, int u) {
        color[u] = 1;
        for (int v = 0; v < color.length; v++) {
            if (g[u][v] == 1) {
                if (color[v] == 1) return true;
                if (color[v] == 0 && dfs(g, color, v)) return true;
            }
        }
        color[u] = 2;
        return false;
    }
}
`,
      bugs: { 15: { was: 'color[v] == 1', buggy: 'if (color[v] == 2) return true;' } },
    },
    python: {
      correct: `
def has_directed_cycle(n, edges):
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
    color = [0] * n
    def dfs(u):
        color[u] = 1
        for v in range(n):
            if g[u][v] == 1:
                if color[v] == 1:
                    return True
                if color[v] == 0 and dfs(v):
                    return True
        color[u] = 2
        return False
    for i in range(n):
        if color[i] == 0 and dfs(i):
            return True
    return False
`,
      bugs: { 10: { was: 'color[v] == 1', buggy: 'if color[v] == 2:' } },
    },
    c: {
      correct: `
int dfs_cycle(int n, int g[][10], int color[], int u) {
    color[u] = 1;
    for (int v = 0; v < n; v++) {
        if (g[u][v] == 1) {
            if (color[v] == 1) return 1;
            if (color[v] == 0 && dfs_cycle(n, g, color, v)) return 1;
        }
    }
    color[u] = 2;
    return 0;
}

int has_directed_cycle(int n, int edges[][2], int m) {
    int g[10][10] = {0};
    for (int i = 0; i < m; i++) {
        g[edges[i][0]][edges[i][1]] = 1;
    }
    int color[10] = {0};
    for (int i = 0; i < n; i++) {
        if (color[i] == 0 && dfs_cycle(n, g, color, i)) return 1;
    }
    return 0;
}
`,
      bugs: { 5: { was: 'color[v] == 1', buggy: 'if (color[v] == 2) return 1;' } },
    },
  },
});
