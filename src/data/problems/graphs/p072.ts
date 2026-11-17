import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p072',
  title: 'The reversed pass starts from the wrong end',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Strongly Connected Components',
  tags: ['Graph', 'SCC', 'Two-Pass DFS'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Two-pass DFS for strongly connected components',
  description:
    'Return the number of strongly connected components in a directed graph. The second pass walks the finish order in the natural direction, merging components that should stay separate.',
  constraints: ['1 <= n <= 100', 'Edges are directed'],
  examples: [
    { input: 'n = 4, edges = [[0,1],[1,2],[2,0],[3,0]]', output: '2' },
  ],
  hints: ['The second pass must follow the finish time from latest to earliest.', 'Compare the order used by the second DFS with the order produced by the first.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Count strongly connected components using two passes of DFS.',
    algorithm: 'Record vertices by finishing time in the first DFS, then process them in reverse finishing order, expanding each unvisited vertex on the reversed graph as one component.',
    bug: 'The second pass walks the finishing order in ascending order, so vertices with earlier finish times are processed first.',
    whyItFails: 'In the reversed graph, starting from an early-finishing vertex can walk backwards into other components, gluing them into one.',
    failingTestCase: 'For edges 0->1, 1->2, 2->0, 3->0, the graph has two components ({0,1,2} and {3}), but the buggy version returns 1.',
    fix: 'Iterate over the finishing order in reverse (from the latest finish to the earliest).',
    whyFixWorks: 'Only the latest-finishing vertex of each component acts as a root on the reversed graph, so no other component leaks in.',
    dryRun: 'First pass finishes 2, 1, 0, 3. Correct second pass starts at 3 (only {3}), then at 0 which pulls in 1 and 2. Buggy second pass starts at 2, whose reverse edges include 3, merging everything into one component.',
    debuggingLesson: 'In two-pass SCC algorithms, the second pass direction is as important as the reversed graph.',
  },
  testCases: [
    { input: '4, [[0,1],[1,2],[2,0],[3,0]]', expected: '2', buggyOutput: '1' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.print(Solution.countSCC(4, new int[][]{{0,1},{1,2},{2,0},{3,0}}));`,
      python: `print(count_scc(4, [(0,1),(1,2),(2,0),(3,0)]))`,
      c: `printf("%d", count_scc(4, (int[][2]){{0,1},{1,2},{2,0},{3,0}}, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] compSCC;
    static void dfs(int u, int[][] g, boolean[] seen, int[] order, int[] idx) {
        seen[u] = true;
        for (int v = 0; v < g.length; v++) {
            if (g[u][v] == 1 && !seen[v]) dfs(v, g, seen, order, idx);
        }
        order[idx[0]++] = u;
    }
    static void rdfs(int u, int[][] rg, int c) {
        compSCC[u] = c;
        for (int v = 0; v < rg.length; v++) {
            if (rg[u][v] == 1 && compSCC[v] == -1) rdfs(v, rg, c);
        }
    }
    static int countSCC(int n, int[][] edges) {
        int[][] g = new int[n][n];
        int[][] rg = new int[n][n];
        for (int[] e : edges) {
            g[e[0]][e[1]] = 1;
            rg[e[1]][e[0]] = 1;
        }
        boolean[] seen = new boolean[n];
        int[] order = new int[n];
        int[] idx = {0};
        for (int i = 0; i < n; i++) {
            if (!seen[i]) dfs(i, g, seen, order, idx);
        }
        compSCC = new int[n];
        for (int i = 0; i < n; i++) compSCC[i] = -1;
        int count = 0;
        for (int i = 0; i < n; i++) {
            int u = order[n - 1 - i];
            if (compSCC[u] == -1) {
                rdfs(u, rg, count);
                count++;
            }
        }
        return count;
    }
}
`,
      bugs: { 33: { was: 'order[n - 1 - i]', buggy: 'int u = order[i];' } },
    },
    python: {
      correct: `
def count_scc(n, edges):
    g = [[] for _ in range(n)]
    rg = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        rg[v].append(u)
    seen = [False] * n
    order = []
    def dfs(u):
        seen[u] = True
        for v in g[u]:
            if not seen[v]:
                dfs(v)
        order.append(u)
    for i in range(n):
        if not seen[i]:
            dfs(i)
    comp = [-1] * n
    count = 0
    def rdfs(u, c):
        comp[u] = c
        for v in rg[u]:
            if comp[v] == -1:
                rdfs(v, c)
    for u in reversed(order):
        if comp[u] == -1:
            rdfs(u, count)
            count += 1
    return count
`,
      bugs: { 25: { was: 'reversed(order)', buggy: 'for u in order:' } },
    },
    c: {
      correct: `
int g_adj[10][10];
int rg_adj[10][10];
int scc_comp[10];
int scc_order[10];
int scc_seen[10];
int scc_len;

void scc_dfs(int n, int u) {
    scc_seen[u] = 1;
    for (int v = 0; v < n; v++) {
        if (g_adj[u][v] == 1 && !scc_seen[v]) scc_dfs(n, v);
    }
    scc_order[scc_len++] = u;
}

void scc_rdfs(int n, int u, int c) {
    scc_comp[u] = c;
    for (int v = 0; v < n; v++) {
        if (rg_adj[u][v] == 1 && scc_comp[v] == -1) scc_rdfs(n, v, c);
    }
}

int count_scc(int n, int edges[][2], int m) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            g_adj[i][j] = 0;
            rg_adj[i][j] = 0;
        }
        scc_comp[i] = -1;
        scc_seen[i] = 0;
    }
    for (int i = 0; i < m; i++) {
        int u = edges[i][0], v = edges[i][1];
        g_adj[u][v] = 1;
        rg_adj[v][u] = 1;
    }
    scc_len = 0;
    for (int i = 0; i < n; i++) {
        if (!scc_seen[i]) scc_dfs(n, i);
    }
    int count = 0;
    for (int i = 0; i < n; i++) {
        int u = scc_order[n - 1 - i];
        if (scc_comp[u] == -1) {
            scc_rdfs(n, u, count);
            count++;
        }
    }
    return count;
}
`,
      bugs: { 43: { was: 'scc_order[n - 1 - i]', buggy: 'int u = scc_order[i];' } },
    },
  },
});
