import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p089',
  title: 'The middle vertex is skipped',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'All-Pairs Shortest Paths',
  tags: ['Graph', 'Shortest Path', 'All Pairs'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Floyd-Warshall style all-pairs shortest path',
  description:
    'Return the shortest distance from a source to a target in a directed weighted graph. The all-pairs computation skips the last possible intermediate vertex.',
  constraints: ['1 <= n <= 100', 'Edge weights are positive in this test'],
  examples: [
    { input: 'n = 4, edges = [[0,3,1],[3,2,1],[0,2,10]], s = 0, t = 2', output: '2' },
  ],
  hints: ['Every vertex must be allowed as an intermediate point.', 'A shortest path may pass through vertex n - 1.'],
  complexity: { time: 'O(n^3)', space: 'O(n^2)' },
  explanation: {
    overview: 'Compute shortest paths between all pairs and return one distance.',
    algorithm: 'For each possible intermediate vertex k, update every pair i,j using paths that go through k.',
    bug: 'The intermediate-vertex loop stops before the last vertex.',
    whyItFails: 'Paths whose best route uses vertex n - 1 are never considered, so the answer can be too large.',
    failingTestCase: 'For edges 0->3 weight 1, 3->2 weight 1, 0->2 weight 10, the code returns 10 instead of 2.',
    fix: 'Let the k loop run through all vertices, k < n.',
    whyFixWorks: 'Every vertex is then considered as an intermediate, so all shortest paths are covered.',
    dryRun: 'Initially d[0][2]=10. When k=3, d[0][2] becomes d[0][3]+d[3][2]=2. Skipping k=3 leaves 10.',
    debuggingLesson: 'In all-pairs relaxation, missing the final intermediate vertex can hide the only good path.',
  },
  testCases: [
    { input: '4, [[0,3,1],[3,2,1],[0,2,10]], 0, 2', expected: '2', buggyOutput: '10' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.print(Solution.shortest(4, new int[][]{{0,3,1},{3,2,1},{0,2,10}}, 0, 2));`,
      python: `print(shortest(4, [(0,3,1),(3,2,1),(0,2,10)], 0, 2))`,
      c: `printf("%d", shortest_all(4, (int[][3]){{0,3,1},{3,2,1},{0,2,10}}, 3, 0, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int shortest(int n, int[][] edges, int s, int t) {
        int INF = 1000000000;
        int[][] d = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) d[i][j] = INF;
            d[i][i] = 0;
        }
        for (int[] e : edges) d[e[0]][e[1]] = e[2];
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (d[i][k] + d[k][j] < d[i][j]) {
                        d[i][j] = d[i][k] + d[k][j];
                    }
                }
            }
        }
        return d[s][t] >= INF ? -1 : d[s][t];
    }
}
`,
      bugs: { 10: { was: 'k < n', buggy: 'for (int k = 0; k < n - 1; k++) {' } },
    },
    python: {
      correct: `
def shortest(n, edges, s, t):
    INF = 1000000000
    d = [[INF] * n for _ in range(n)]
    for i in range(n):
        d[i][i] = 0
    for u, v, w in edges:
        d[u][v] = w
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return -1 if d[s][t] >= INF else d[s][t]
`,
      bugs: { 8: { was: 'range(n)', buggy: 'for k in range(n - 1):' } },
    },
    c: {
      correct: `
int shortest_all(int n, int edges[][3], int m, int s, int t) {
    int INF = 1000000000;
    int d[10][10];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) d[i][j] = INF;
        d[i][i] = 0;
    }
    for (int i = 0; i < m; i++) d[edges[i][0]][edges[i][1]] = edges[i][2];
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (d[i][k] + d[k][j] < d[i][j]) {
                    d[i][j] = d[i][k] + d[k][j];
                }
            }
        }
    }
    return d[s][t] >= INF ? -1 : d[s][t];
}
`,
      bugs: { 9: { was: 'k < n', buggy: 'for (int k = 0; k < n - 1; k++) {' } },
    },
  },
});
