import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p076',
  title: 'A vertex enters the order too early',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Topological Sort',
  tags: ['Graph', 'Topological Sort', 'Indegree'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Kahn-style topological ordering of a directed acyclic graph',
  description:
        'Return an ordering of the vertices of a directed acyclic graph in which every edge goes from an earlier vertex to a later one. Some vertices appear before their prerequisites.',
  constraints: ['1 <= n <= 100', 'The graph is a DAG'],
  examples: [
    { input: 'n = 4, edges = [[0,1],[0,2],[1,3],[2,3]]', output: '0 1 2 3' },
  ],
    hints: ['Trace how many unfinished prerequisites vertex 3 has after each step.', 'Look at the exact condition that lets a vertex into the pending list.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Produce a topological ordering of a directed acyclic graph.',
    algorithm: 'Maintain indegrees, enqueue vertices with indegree zero, and decrement neighbours when a vertex is removed.',
    bug: 'A neighbour is enqueued when its updated indegree is at most one instead of exactly zero.',
    whyItFails: 'A vertex with one remaining prerequisite can enter early, and later its indegree becomes zero again and it may be queued twice.',
    failingTestCase: 'For edges 0->1, 0->2, 1->3, 2->3, the code returns 0 1 2 3 3 instead of 0 1 2 3.',
    fix: 'Use the condition indeg[v] == 0.',
    whyFixWorks: 'Only vertices whose prerequisites have all been processed enter the queue.',
    dryRun: 'After removing 1, indegree of 3 becomes 1. The buggy check <= 1 queues 3 too early. Removing 2 makes it 0 and queues 3 again.',
    debuggingLesson: 'In indegree-based algorithms, compare against exactly zero; using a range can admit partially ready vertices.',
  },
  testCases: [
    { input: '4, [[0,1],[0,2],[1,3],[2,3]]', expected: '0 1 2 3', buggyOutput: '0 1 2 3 3' },
  ],
  harness: {
    expected: '0 1 2 3',
    driver: {
      java: `System.out.print(Solution.topoOrder(4, new int[][]{{0,1},{0,2},{1,3},{2,3}}));`,
      python: `print(topo_order(4, [(0,1),(0,2),(1,3),(2,3)]))`,
      c: `int out[10]; int len; topo_order(4, (int[][2]){{0,1},{0,2},{1,3},{2,3}}, 4, out, &len); for (int i = 0; i < len; i++) printf("%d ", out[i]);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static String topoOrder(int n, int[][] edges) {
        int[] indeg = new int[n];
        int[][] g = new int[n][n];
        for (int[] e : edges) {
            g[e[0]][e[1]] = 1;
            indeg[e[1]]++;
        }
        int[] q = new int[n * n];
        int head = 0, tail = 0;
        for (int i = 0; i < n; i++) {
            if (indeg[i] == 0) q[tail++] = i;
        }
        StringBuilder sb = new StringBuilder();
        while (head < tail) {
            int u = q[head++];
            sb.append(u).append(' ');
            for (int v = 0; v < n; v++) {
                if (g[u][v] == 1) {
                    indeg[v]--;
                    if (indeg[v] == 0) {
                        q[tail++] = v;
                    }
                }
            }
        }
        return sb.toString().trim();
    }
}
`,
      bugs: { 21: { was: 'indeg[v] == 0', buggy: 'if (indeg[v] <= 1) {' } },
    },
    python: {
      correct: `
def topo_order(n, edges):
    indeg = [0] * n
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
        indeg[v] += 1
    q = []
    for i in range(n):
        if indeg[i] == 0:
            q.append(i)
    head = 0
    out = []
    while head < len(q):
        u = q[head]
        head += 1
        out.append(str(u))
        for v in range(n):
            if g[u][v] == 1:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
    return ' '.join(out)
`,
      bugs: { 20: { was: 'indeg[v] == 0', buggy: 'if indeg[v] <= 1:' } },
    },
    c: {
      correct: `
void topo_order(int n, int edges[][2], int m, int out[], int *len) {
    int indeg[10] = {0};
    int g[10][10] = {0};
    for (int i = 0; i < m; i++) {
        int u = edges[i][0];
        int v = edges[i][1];
        g[u][v] = 1;
        indeg[v]++;
    }
    int q[100];
    int head = 0, tail = 0;
    for (int i = 0; i < n; i++) {
        if (indeg[i] == 0) q[tail++] = i;
    }
    *len = 0;
    while (head < tail) {
        int u = q[head++];
        out[(*len)++] = u;
        for (int v = 0; v < n; v++) {
            if (g[u][v] == 1) {
                indeg[v]--;
                if (indeg[v] == 0) {
                    q[tail++] = v;
                }
            }
        }
    }
}
`,
      bugs: { 22: { was: 'indeg[v] == 0', buggy: 'if (indeg[v] <= 1) {' } },
    },
  },
});
