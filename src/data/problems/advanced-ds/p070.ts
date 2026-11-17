import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p070',
  title: 'Later disconnected groups are never inspected',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Bipartite Check Across Components',
  tags: ['Graph', 'Bipartite', 'Components'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Two-colour feasibility test on a possibly disconnected graph',
  description:
    'Return whether an undirected graph can be split into two groups with no edge inside a group. The check inspects only the first group of connected vertices.',
  constraints: ['1 <= n <= 100', 'The graph may be disconnected'],
  examples: [
    { input: 'n = 4, edges = [[0,1],[1,2],[2,0],[3,3]]', output: '0' },
  ],
  hints: ['Disconnected graphs have several starting points.', 'Trace which starting vertices the outer scan actually visits.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Test whether every connected component admits a two-colour assignment.',
    algorithm: 'For every unvisited vertex, colour it and run a BFS that assigns the opposite colour to neighbours, rejecting equal-coloured edges.',
    bug: 'The outer scan over starting vertices only visits the first index, so later components are never checked.',
    whyItFails: 'An odd cycle hidden in a later component is never inspected, so the function returns true even when the graph is not bipartite.',
    failingTestCase: 'For two components (a square on 0-1-2-3 and a triangle on 4-5-6), the code returns 1 instead of 0.',
    fix: 'Let the outer scan range over all vertex indices.',
    whyFixWorks: 'Every component gets a starting vertex, so all components are checked.',
    dryRun: 'The first component 0-1-2-3-0 is bipartite. The second component 4-5-6-4 is a triangle and fails. The buggy scan never reaches vertex 4 and returns true.',
    debuggingLesson: 'For component-wise checks, always confirm that the outer scan visits every starting vertex.',
  },
  testCases: [
    {
      input: '7, [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,4]]',
      expected: '0',
      buggyOutput: '1',
    },
  ],
  harness: {
    expected: '0',
    driver: {
      java: `System.out.print(Solution.bipartiteCheck(7, new int[][]{{0,1},{1,2},{2,3},{3,0},{4,5},{5,6},{6,4}}) ? 1 : 0);`,
      python: `print(1 if bipartite_check(7, [(0,1),(1,2),(2,3),(3,0),(4,5),(5,6),(6,4)]) else 0)`,
      c: `printf("%d", bipartite_check(7, (int[][2]){{0,1},{1,2},{2,3},{3,0},{4,5},{5,6},{6,4}}, 7));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean bipartiteCheck(int n, int[][] edges) {
        int[][] g = new int[n][n];
        for (int[] e : edges) {
            g[e[0]][e[1]] = 1;
            g[e[1]][e[0]] = 1;
        }
        int[] color = new int[n];
        for (int i = 0; i < n; i++) color[i] = -1;
        int[] q = new int[n];
        for (int s = 0; s < n; s++) {
            if (color[s] != -1) continue;
            int head = 0, tail = 0;
            q[tail++] = s;
            color[s] = 0;
            while (head < tail) {
                int u = q[head++];
                for (int v = 0; v < n; v++) {
                    if (g[u][v] == 1) {
                        if (color[v] == color[u]) return false;
                        if (color[v] == -1) {
                            color[v] = 1 - color[u];
                            q[tail++] = v;
                        }
                    }
                }
            }
        }
        return true;
    }
}
`,
      bugs: { 12: { was: 's < n', buggy: 'for (int s = 0; s < 1; s++) {' } },
    },
    python: {
      correct: `
def bipartite_check(n, edges):
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
        g[v][u] = 1
    color = [-1] * n
    for s in range(n):
        if color[s] != -1:
            continue
        q = [s]
        color[s] = 0
        head = 0
        while head < len(q):
            u = q[head]
            head += 1
            for v in range(n):
                if g[u][v] == 1:
                    if color[v] == color[u]:
                        return False
                    if color[v] == -1:
                        color[v] = 1 - color[u]
                        q.append(v)
    return True
`,
      bugs: { 8: { was: 'range(n)', buggy: 'for s in range(1):' } },
    },
    c: {
      correct: `
int bipartite_check(int n, int edges[][2], int m) {
    int g[10][10] = {0};
    for (int i = 0; i < m; i++) {
        int u = edges[i][0], v = edges[i][1];
        g[u][v] = 1;
        g[v][u] = 1;
    }
    int color[10];
    for (int i = 0; i < n; i++) color[i] = -1;
    int q[100];
    for (int s = 0; s < n; s++) {
        if (color[s] != -1) continue;
        int head = 0, tail = 0;
        q[tail++] = s;
        color[s] = 0;
        while (head < tail) {
            int u = q[head++];
            for (int v = 0; v < n; v++) {
                if (g[u][v] == 1) {
                    if (color[v] == color[u]) return 0;
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q[tail++] = v;
                    }
                }
            }
        }
    }
    return 1;
}
`,
      bugs: { 12: { was: 's < n', buggy: 'for (int s = 0; s < 1; s++) {' } },
    },
  },
});
