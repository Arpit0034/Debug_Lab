import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p082',
  title: 'Every distance stays flat',
  difficulty: 'Easy',
  topic: 'Graphs',
  subtopic: 'BFS Distances',
  tags: ['Graph', 'BFS', 'Distance'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Maximum shortest-path distance from a source in an unweighted graph',
  description:
    'Return the largest shortest-path distance from a source vertex in an unweighted graph. The distance update forgets to add one for each edge.',
  constraints: ['1 <= n <= 100', 'The graph is connected'],
  examples: [
    { input: 'n = 3, edges = [[0,1],[1,2]], s = 0', output: '2' },
  ],
  hints: ['What should happen to the distance when moving across one edge?', 'Compare the neighbour distance with the current distance.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Compute the maximum BFS distance from a source in an unweighted graph.',
    algorithm: 'Initialize distances to -1, set source distance to 0, and set each newly discovered neighbour to current distance plus one.',
    bug: 'The neighbour distance is assigned the current distance without adding one.',
    whyItFails: 'All discovered vertices keep distance 0, so the maximum distance is reported as 0.',
    failingTestCase: 'For the path 0-1-2 starting at 0, the code returns 0 instead of 2.',
    fix: 'Assign dist[v] = dist[u] + 1.',
    whyFixWorks: 'Every edge in an unweighted graph adds exactly one unit of distance.',
    dryRun: 'Source 0 has distance 0. Correct BFS gives 1 distance 1 and 2 distance 2. Buggy BFS gives 1 distance 0 and 2 distance 0, so the maximum stays 0.',
    debuggingLesson: 'In unweighted shortest paths, every expansion must add exactly one to the distance.',
  },
  testCases: [
    { input: '3, [[0,1],[1,2]], 0', expected: '2', buggyOutput: '0' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.print(Solution.maxDistance(3, new int[][]{{0,1},{1,2}}, 0));`,
      python: `print(max_distance(3, [(0,1),(1,2)], 0))`,
      c: `printf("%d", max_distance(3, (int[][2]){{0,1},{1,2}}, 2, 0));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int maxDistance(int n, int[][] edges, int s) {
        int[][] g = new int[n][n];
        for (int[] e : edges) {
            g[e[0]][e[1]] = 1;
            g[e[1]][e[0]] = 1;
        }
        int[] dist = new int[n];
        for (int i = 0; i < n; i++) dist[i] = -1;
        int[] q = new int[n];
        int head = 0, tail = 0;
        dist[s] = 0;
        q[tail++] = s;
        int best = 0;
        while (head < tail) {
            int u = q[head++];
            for (int v = 0; v < n; v++) {
                if (g[u][v] == 1 && dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    q[tail++] = v;
                    if (dist[v] > best) best = dist[v];
                }
            }
        }
        return best;
    }
}
`,
      bugs: { 19: { was: 'dist[u] + 1', buggy: 'dist[v] = dist[u];' } },
    },
    python: {
      correct: `
def max_distance(n, edges, s):
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
        g[v][u] = 1
    dist = [-1] * n
    dist[s] = 0
    q = [s]
    head = 0
    best = 0
    while head < len(q):
        u = q[head]
        head += 1
        for v in range(n):
            if g[u][v] == 1 and dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
                if dist[v] > best:
                    best = dist[v]
    return best
`,
      bugs: { 16: { was: 'dist[u] + 1', buggy: 'dist[v] = dist[u]' } },
    },
    c: {
      correct: `
int max_distance(int n, int edges[][2], int m, int s) {
    int g[10][10] = {0};
    for (int i = 0; i < m; i++) {
        int u = edges[i][0], v = edges[i][1];
        g[u][v] = 1;
        g[v][u] = 1;
    }
    int dist[10];
    for (int i = 0; i < n; i++) dist[i] = -1;
    int q[100];
    int head = 0, tail = 0;
    dist[s] = 0;
    q[tail++] = s;
    int best = 0;
    while (head < tail) {
        int u = q[head++];
        for (int v = 0; v < n; v++) {
            if (g[u][v] == 1 && dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q[tail++] = v;
                if (dist[v] > best) best = dist[v];
            }
        }
    }
    return best;
}
`,
      bugs: { 19: { was: 'dist[u] + 1', buggy: 'dist[v] = dist[u];' } },
    },
  },
});
