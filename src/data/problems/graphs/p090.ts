import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p090',
  title: 'The postorder comes out sorted',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'DFS Topological Sort',
  tags: ['Graph', 'Topological Sort', 'DFS'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Topological ordering using depth-first postorder',
  description:
        'Return an ordering of the vertices of a directed acyclic graph in which every edge goes from an earlier vertex to a later one. Some edges point backwards in the result.',
  constraints: ['1 <= n <= 100', 'The graph is a DAG'],
  examples: [
    { input: 'n = 3, edges = [[2,0],[1,0]]', output: '2 1 0' },
  ],
   hints: ['Consider the order in which vertices finish during the recursive exploration.', 'Check what happens to that finishing order before it is returned.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Produce a topological order using DFS postorder.',
    algorithm: 'Run DFS, append each vertex after its descendants, then reverse the resulting list.',
    bug: 'The code keeps the postorder in its natural order instead of reversing it, so prerequisites come after their dependents.',
    whyItFails: 'The natural postorder places every vertex after its outgoing neighbours, which is exactly the reverse of a valid topological order.',
    failingTestCase: 'For edges 2->0 and 1->0, the code returns 0 1 2 instead of 2 1 0.',
    fix: 'Reverse the postorder list before writing it to the output.',
    whyFixWorks: 'In a DAG, reversing DFS postorder places every vertex before the vertices that depend on it.',
    dryRun: 'DFS appends 0, then 1, then 2, giving postorder [0,1,2]. Reversing gives [2,1,0]. Keeping the natural order produces [0,1,2], which violates 2->0.',
    debuggingLesson: 'For topological ordering, the postorder direction is meaningful; always reverse it before output.',
  },
  testCases: [
    { input: '3, [[2,0],[1,0]]', expected: '2 1 0', buggyOutput: '0 1 2' },
  ],
  harness: {
    expected: '2 1 0',
    driver: {
      java: `System.out.print(Solution.topoOrder(3, new int[][]{{2,0},{1,0}}));`,
      python: `print(topo_order_dfs(3, [(2,0),(1,0)]))`,
      c: `int out[10]; int len; topo_order_dfs(3, (int[][2]){{2,0},{1,0}}, 2, out, &len); for (int i = 0; i < len; i++) printf("%d ", out[i]);`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static int[][] g;
    static boolean[] seen;
    static List<Integer> order;
    static void dfs(int u) {
        seen[u] = true;
        for (int v = 0; v < g.length; v++) {
            if (g[u][v] == 1 && !seen[v]) dfs(v);
        }
        order.add(u);
    }
    static String topoOrder(int n, int[][] edges) {
        g = new int[n][n];
        for (int[] e : edges) g[e[0]][e[1]] = 1;
        seen = new boolean[n];
        order = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (!seen[i]) dfs(i);
        }
        Collections.reverse(order);
        StringBuilder sb = new StringBuilder();
        for (int x : order) sb.append(x).append(' ');
        return sb.toString().trim();
    }
}
`,
      bugs: { 21: { was: 'Collections.reverse(order)', buggy: 'Collections.sort(order);' } },
    },
    python: {
      correct: `
def topo_order_dfs(n, edges):
    g = [[0] * n for _ in range(n)]
    for u, v in edges:
        g[u][v] = 1
    seen = [False] * n
    order = []
    def dfs(u):
        seen[u] = True
        for v in range(n):
            if g[u][v] == 1 and not seen[v]:
                dfs(v)
        order.append(u)
    for i in range(n):
        if not seen[i]:
            dfs(i)
    order.reverse()
    return ' '.join(str(x) for x in order)
`,
      bugs: { 16: { was: 'order.reverse()', buggy: 'order.sort()' } },
    },
    c: {
      correct: `
int topo_g[10][10];
int topo_seen[10];
int topo_order[10];
int topo_len;

void topo_dfs(int n, int u) {
    topo_seen[u] = 1;
    for (int v = 0; v < n; v++) {
        if (topo_g[u][v] == 1 && !topo_seen[v]) topo_dfs(n, v);
    }
    topo_order[topo_len++] = u;
}

void topo_order_dfs(int n, int edges[][2], int m, int out[], int *len) {
    for (int i = 0; i < n; i++) topo_seen[i] = 0;
    topo_len = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) topo_g[i][j] = 0;
    }
    for (int i = 0; i < m; i++) topo_g[edges[i][0]][edges[i][1]] = 1;
    for (int i = 0; i < n; i++) {
        if (!topo_seen[i]) topo_dfs(n, i);
    }
    *len = topo_len;
    for (int i = 0; i < topo_len; i++) out[i] = topo_order[topo_len - 1 - i];
}
`,
      bugs: { 25: { was: 'topo_order[topo_len - 1 - i]', buggy: 'for (int i = 0; i < topo_len; i++) out[i] = topo_order[i];' } },
    },
  },
});
