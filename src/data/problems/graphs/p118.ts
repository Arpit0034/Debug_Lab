import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p118',
  title: 'A return connection is mistaken for a bridge',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Bridge Detection in Undirected Graphs',
  tags: ['DFS', 'Low Link Values', 'Connectivity'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Tarjan bridge detection pattern',
  description:
    'Given an undirected graph represented by an adjacency matrix, return the number of edges whose removal would increase the number of connected components.',
  constraints: [
    '1 <= n <= 500',
    'The adjacency matrix is symmetric.',
    'The graph may contain multiple connected components.',
  ],
  examples: [
    {
      input: 'graph = [[0,1,1],[1,0,1],[1,1,0]]',
      output: '0',
      note: 'Removing any single edge still leaves another route between its endpoints.',
    },
    {
      input: 'graph = [[0,1,0],[1,0,1],[0,1,0]]',
      output: '2',
    },
  ],
  hints: [
    'Compare the earliest discovery time reachable from a child subtree with its parent.',
    'Consider what happens when the child has a connection back to the parent itself.',
  ],
  complexity: { time: 'O(V^2)', space: 'O(V)' },
  explanation: {
    overview: 'Count the edges that are essential for keeping an undirected graph connected within its components.',
    algorithm: 'Run depth-first traversal while recording each vertex discovery time and the earliest discovery time reachable from its subtree. After processing an unvisited child v of u, update the earliest reachable time of u using the child value. The edge u-v is a bridge only when the child subtree cannot reach u or any earlier ancestor through another connection.',
    bug: 'The bridge comparison uses greater-than-or-equal instead of strict greater-than.',
    whyItFails: 'When the child subtree can return directly to its parent, its earliest reachable discovery time equals the parent discovery time. The edge is therefore not a bridge. Treating equality as a bridge incorrectly counts edges that have an alternative route.',
    failingTestCase: 'For a triangle, the depth-first traversal finds that the third vertex can return to the root. The relevant low value equals the parent discovery time. The correct answer is zero, but the buggy condition reports one bridge.',
    fix: 'Use low[v] > disc[u] for the bridge test.',
    whyFixWorks: 'A bridge exists only when every alternative route from the child subtree to the rest of the graph is blocked by the parent edge. Equality means a back edge reaches the parent and prevents that edge from being critical.',
    dryRun: 'Visit vertex 0 at time 0, vertex 1 at time 1, and vertex 2 at time 2. Vertex 2 connects back to vertex 0, so its low value becomes 0. Returning to vertex 1, the low value is propagated as 0. Since 0 is less than the discovery time of vertex 1, edge 0-1 is not a bridge either.',
    debuggingLesson: 'For graph low-link algorithms, equality often represents an important boundary case. Test cycles and back edges explicitly before choosing between strict and non-strict comparisons.',
  },
  testCases: [
    {
      input: '[[0,1,1],[1,0,1],[1,1,0]]',
      expected: '0',
      buggyOutput: '1',
    },
    {
      input: '[[0,1,0],[1,0,1],[0,1,0]]',
      expected: '2',
    },
  ],
  harness: {
    expected: '0 2',
    driver: {
      java: `int[][] a = {{0,1,1},{1,0,1},{1,1,0}};
int[][] b = {{0,1,0},{1,0,1},{0,1,0}};
System.out.print(Solution.countBridges(a) + " " + Solution.countBridges(b));`,
      python: `print(count_bridges([[0,1,1],[1,0,1],[1,1,0]]), count_bridges([[0,1,0],[1,0,1],[0,1,0]]))`,
      c: `int a[9] = {0,1,1,1,0,1,1,1,0};
int b[9] = {0,1,0,1,0,1,0,1,0};
printf("%d %d",count_bridges(a,3),count_bridges(b,3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int timer, bridges;
    static void dfs(int[][] graph, int u, int parent, int[] disc, int[] low) {
        disc[u] = low[u] = timer++;
        for (int v = 0; v < graph.length; v++) {
            if (graph[u][v] == 0) continue;
            if (disc[v] == -1) {
                dfs(graph, v, u, disc, low);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) bridges++;
            } else if (v != parent) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    }
    static int countBridges(int[][] graph) {
        int n = graph.length;
        int[] disc = new int[n], low = new int[n];
        java.util.Arrays.fill(disc, -1);
        timer = 0;
        bridges = 0;
        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) dfs(graph, i, -1, disc, low);
        }
        return bridges;
    }
}
`,
      bugs: {
        10: {
          was: 'low[v] > disc[u]',
          buggy: '                if (low[v] >= disc[u]) bridges++;',
        },
      },
    },
    python: {
      correct: `
def count_bridges(graph):
    n = len(graph)
    disc = [-1] * n
    low = [0] * n
    timer = [0]
    bridges = [0]
    def dfs(u, parent):
        disc[u] = low[u] = timer[0]
        timer[0] += 1
        for v in range(n):
            if not graph[u][v]:
                continue
            if disc[v] == -1:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    bridges[0] += 1
            elif v != parent:
                low[u] = min(low[u], disc[v])
    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)
    return bridges[0]
`,
      bugs: {
        16: {
          was: 'low[v] > disc[u]',
          buggy: '                if low[v] >= disc[u]:',
        },
      },
    },
    c: {
      correct: `
void bridge_dfs(int* graph, int n, int u, int parent, int* disc, int* low, int* timer, int* bridges) {
    disc[u] = low[u] = (*timer)++;
    for (int v = 0; v < n; v++) {
        if (graph[u*n+v] == 0) continue;
        if (disc[v] == -1) {
            bridge_dfs(graph,n,v,u,disc,low,timer,bridges);
            if (low[v] < low[u]) low[u] = low[v];
            if (low[v] > disc[u]) (*bridges)++;
        } else if (v != parent && disc[v] < low[u]) {
            low[u] = disc[v];
        }
    }
}
int count_bridges(int* graph, int n) {
    int* disc = malloc(n * sizeof(int));
    int* low = calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) disc[i] = -1;
    int timer = 0, bridges = 0;
    for (int i = 0; i < n; i++) {
        if (disc[i] == -1) bridge_dfs(graph,n,i,-1,disc,low,&timer,&bridges);
    }
    free(disc); free(low);
    return bridges;
}
`,
      bugs: {
        8: {
          was: 'low[v] > disc[u]',
          buggy: '            if (low[v] >= disc[u]) (*bridges)++;',
        },
      },
    },
  },
});
