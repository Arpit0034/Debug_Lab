import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p073',
  title: 'The reachable count forgets its neighbours',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'BFS Reachability',
  tags: ['Graph', 'BFS', 'Visited'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Reachable nodes from a source in an undirected graph',
  description:
    'Return how many vertices can be reached from a given source in an undirected graph. The traversal records visited vertices incorrectly.',
  constraints: ['1 <= n <= 100', '0 <= edges <= n * (n - 1) / 2'],
  examples: [
    { input: 'n = 3, edges = [[0,1],[0,2],[1,2]], s = 0', output: '3' },
    { input: 'n = 3, edges = [[0,1]], s = 0', output: '2' },
  ],
  hints: ['Trace which boolean entry changes when a neighbour is added.', 'Look closely at the visited update inside the neighbour loop.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Count all vertices reachable from a source in an undirected graph.',
    algorithm: 'Build an adjacency matrix, start a queue from the source, and mark every newly discovered neighbour before enqueueing it.',
    bug: 'The code marks the current vertex visited again instead of marking the neighbour.',
    whyItFails: 'Neighbours are enqueued but never marked. Their visited flags stay false, so the final count is too small.',
    failingTestCase: 'For n = 3 and a triangle on vertices 0, 1, 2 starting at 0, the code returns 2 instead of 3.',
    fix: 'Set visited[nb] = true when nb is discovered.',
    whyFixWorks: 'Each newly discovered vertex is marked exactly once, so the final visited count includes every reachable vertex.',
    dryRun: 'Start visited[0]=true. Processing 0 discovers 1 and 2 but marks 0. Processing 1 marks 1. Processing 2 marks nothing new. Only 0 and 1 are true, giving 2 instead of 3.',
    debuggingLesson: 'In graph traversal, always check that the discovered neighbour, not the current vertex, is the one being marked.',
  },
  testCases: [
    { input: '3, [[0,1],[0,2],[1,2]], 0', expected: '3', buggyOutput: '2' },
  ],
  harness: {
    expected: '3',
    driver: {
      java: `System.out.print(Solution.countReachable(3, new int[][]{{0,1},{0,2},{1,2}}, 0));`,
      python: `print(count_reachable(3, [(0,1),(0,2),(1,2)], 0))`,
      c: `printf("%d", count_reachable(3, (int[][2]){{0,1},{0,2},{1,2}}, 3, 0));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int countReachable(int n, int[][] edges, int s) {
        int[][] g = new int[n][n];
        for (int[] e : edges) {
            g[e[0]][e[1]] = 1;
            g[e[1]][e[0]] = 1;
        }
        boolean[] visited = new boolean[n];
        int[] q = new int[n];
        int head = 0, tail = 0;
        visited[s] = true;
        q[tail++] = s;
        while (head < tail) {
            int cur = q[head++];
            for (int nb = 0; nb < n; nb++) {
                if (g[cur][nb] == 1 && !visited[nb]) {
                    visited[nb] = true;
                    q[tail++] = nb;
                }
            }
        }
        int count = 0;
        for (boolean v : visited) {
            if (v) count++;
        }
        return count;
    }
}
`,
      bugs: { 17: { was: 'visited[nb] = true', buggy: 'visited[cur] = true;' } },
    },
    python: {
      correct: `
def count_reachable(n, edges, s):
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
        g[v][u] = 1
    visited = [False] * n
    q = [s]
    visited[s] = True
    head = 0
    while head < len(q):
        cur = q[head]
        head += 1
        for nb in range(n):
            if g[cur][nb] == 1 and not visited[nb]:
                visited[nb] = True
                q.append(nb)
    return sum(visited)
`,
      bugs: { 15: { was: 'visited[nb] = True', buggy: 'visited[cur] = True' } },
    },
    c: {
      correct: `
int count_reachable(int n, int edges[][2], int m, int s) {
    int g[10][10] = {0};
    for (int i = 0; i < m; i++) {
        int u = edges[i][0];
        int v = edges[i][1];
        g[u][v] = 1;
        g[v][u] = 1;
    }
    int visited[10] = {0};
    int q[10];
    int head = 0, tail = 0;
    visited[s] = 1;
    q[tail++] = s;
    while (head < tail) {
        int cur = q[head++];
        for (int nb = 0; nb < n; nb++) {
            if (g[cur][nb] == 1 && !visited[nb]) {
                visited[nb] = 1;
                q[tail++] = nb;
            }
        }
    }
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (visited[i]) count++;
    }
    return count;
}
`,
      bugs: { 18: { was: 'visited[nb] = 1', buggy: 'visited[cur] = 1;' } },
    },
  },
});
