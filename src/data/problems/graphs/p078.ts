import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p078',
  title: 'The parent edge looks like a cycle',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Undirected Cycle Detection',
  tags: ['Graph', 'Cycle', 'DFS'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Parent-aware cycle detection in an undirected graph',
  description:
    'Return whether an undirected graph contains a cycle. The traversal incorrectly treats the edge back to the parent as a cycle.',
  constraints: ['1 <= n <= 100', 'The graph is undirected'],
  examples: [
    { input: 'n = 3, edges = [[0,1],[1,2]]', output: '0' },
  ],
  hints: ['In an undirected graph, the edge to the parent is expected.', 'Compare the neighbour with the vertex you came from.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Detect a cycle in an undirected graph using parent-aware traversal.',
    algorithm: 'Traverse with DFS, passing the parent. A visited neighbour that is not the parent closes a cycle.',
    bug: 'The code compares the neighbour with the current vertex instead of with the parent.',
    whyItFails: 'In a tree, every child sees its parent as a visited neighbour. The faulty comparison treats that ordinary edge as a cycle.',
    failingTestCase: 'For the tree 0-1-2, the code reports a cycle instead of 0.',
    fix: 'Compare the visited neighbour with parent.',
    whyFixWorks: 'The only previously visited neighbour allowed in a tree traversal is the parent.',
    dryRun: 'DFS from 0 enters 1 with parent 0. At 1, neighbour 0 is visited. The buggy check 0 != 1 is true and reports a cycle. The correct check 0 != parent(0) is false.',
    debuggingLesson: 'For undirected graphs, always account for the edge back to the parent.',
  },
  testCases: [
    { input: '3, [[0,1],[1,2]]', expected: '0', buggyOutput: '1' },
  ],
  harness: {
    expected: '0',
    driver: {
      java: `System.out.print(Solution.hasUndirectedCycle(3, new int[][]{{0,1},{1,2}}) ? 1 : 0);`,
      python: `print(1 if has_undirected_cycle(3, [(0,1),(1,2)]) else 0)`,
      c: `printf("%d", has_undirected_cycle(3, (int[][2]){{0,1},{1,2}}, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean hasUndirectedCycle(int n, int[][] edges) {
        int[][] g = new int[n][n];
        for (int[] e : edges) {
            g[e[0]][e[1]] = 1;
            g[e[1]][e[0]] = 1;
        }
        boolean[] seen = new boolean[n];
        for (int i = 0; i < n; i++) {
            if (!seen[i] && dfs(g, seen, i, -1)) return true;
        }
        return false;
    }
    static boolean dfs(int[][] g, boolean[] seen, int u, int parent) {
        seen[u] = true;
        for (int v = 0; v < seen.length; v++) {
            if (g[u][v] == 1) {
                if (!seen[v]) {
                    if (dfs(g, seen, v, u)) return true;
                } else if (v != parent) {
                    return true;
                }
            }
        }
        return false;
    }
}
`,
      bugs: { 20: { was: 'v != parent', buggy: '} else if (v != u) {' } },
    },
    python: {
      correct: `
def has_undirected_cycle(n, edges):
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
        g[v][u] = 1
    seen = [False] * n
    def dfs(u, parent):
        seen[u] = True
        for v in range(n):
            if g[u][v] == 1:
                if not seen[v]:
                    if dfs(v, u):
                        return True
                elif v != parent:
                    return True
        return False
    for i in range(n):
        if not seen[i] and dfs(i, -1):
            return True
    return False
`,
      bugs: { 14: { was: 'v != parent', buggy: 'elif v != u:' } },
    },
    c: {
      correct: `
int dfs_undirected(int n, int g[][10], int seen[], int u, int parent) {
    seen[u] = 1;
    for (int v = 0; v < n; v++) {
        if (g[u][v] == 1) {
            if (!seen[v]) {
                if (dfs_undirected(n, g, seen, v, u)) return 1;
            } else if (v != parent) {
                return 1;
            }
        }
    }
    return 0;
}

int has_undirected_cycle(int n, int edges[][2], int m) {
    int g[10][10] = {0};
    for (int i = 0; i < m; i++) {
        int u = edges[i][0], v = edges[i][1];
        g[u][v] = 1;
        g[v][u] = 1;
    }
    int seen[10] = {0};
    for (int i = 0; i < n; i++) {
        if (!seen[i] && dfs_undirected(n, g, seen, i, -1)) return 1;
    }
    return 0;
}
`,
      bugs: { 7: { was: 'v != parent', buggy: '} else if (v != u) {' } },
    },
  },
});
