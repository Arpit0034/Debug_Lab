import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p079',
  title: 'A two-colour split fails on an even cycle',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Bipartite Check',
  tags: ['Graph', 'Bipartite', 'Colouring'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Two-colour assignment on an undirected graph',
  description:
    'Return whether the vertices of an undirected graph can be split into two groups with no edge inside a group. The check rejects any already-coloured neighbour.',
  constraints: ['1 <= n <= 100', 'The graph is undirected'],
  examples: [
    { input: 'n = 4, edges = [[0,1],[1,2],[2,3],[3,0]]', output: '1' },
  ],
  hints: ['A visited neighbour is allowed if it has the opposite colour.', 'Reject only when a neighbour has the same colour.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Check whether an undirected graph is bipartite.',
    algorithm: 'Colour each component with two colours using BFS. Neighbours must receive the opposite colour.',
    bug: 'The code rejects every already-coloured neighbour instead of only same-colour neighbours.',
    whyItFails: 'Even cycles are bipartite, but their closing edge reaches a vertex that is already coloured with the opposite colour. The faulty check reports a conflict.',
    failingTestCase: 'For the 4-cycle 0-1-2-3-0, the code returns 0 instead of 1.',
    fix: 'Reject only when color[v] == color[u].',
    whyFixWorks: 'Different colours are exactly what bipartiteness requires; only equal colours form a conflict.',
    dryRun: 'Colour 0 as 0, then 1 and 3 as 1. Process 1 and colour 2 as 0. Processing 3 sees neighbour 2 already coloured 0, which differs from colour[3]=1. The buggy code rejects it; correct code accepts.',
    debuggingLesson: 'When checking a colouring, compare the neighbour with the current colour, not merely with uncoloured.',
  },
  testCases: [
    { input: '4, [[0,1],[1,2],[2,3],[3,0]]', expected: '1', buggyOutput: '0' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.print(Solution.isBipartite(4, new int[][]{{0,1},{1,2},{2,3},{3,0}}) ? 1 : 0);`,
      python: `print(1 if is_bipartite(4, [(0,1),(1,2),(2,3),(3,0)]) else 0)`,
      c: `printf("%d", is_bipartite(4, (int[][2]){{0,1},{1,2},{2,3},{3,0}}, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean isBipartite(int n, int[][] edges) {
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
                        if (color[v] == color[u]) {
                            return false;
                        }
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
      bugs: { 20: { was: 'color[v] == color[u]', buggy: 'if (color[v] != -1) {' } },
    },
    python: {
      correct: `
def is_bipartite(n, edges):
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
      bugs: { 18: { was: 'color[v] == color[u]', buggy: 'if color[v] != -1:' } },
    },
    c: {
      correct: `
int is_bipartite(int n, int edges[][2], int m) {
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
                    if (color[v] == color[u]) {
                        return 0;
                    }
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
      bugs: { 20: { was: 'color[v] == color[u]', buggy: 'if (color[v] != -1) {' } },
    },
  },
});
