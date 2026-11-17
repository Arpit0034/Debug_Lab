import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p105',
  title: 'Discovered routes are never improved',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Dijkstra Vertex Finalization',
  tags: ['Dijkstra', 'Visited Array', 'Weighted Graphs'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Dijkstra shortest-path vertex finalization pattern',
  description:
    'Given a directed weighted graph represented by an adjacency matrix, return the minimum distance from vertex zero to every vertex. Use 1000000000 for unreachable vertices.',
  constraints: ['1 <= n <= 500', 'All edge weights are nonnegative.', 'A value of 1000000000 represents no edge.'],
  examples: [
    {
      input: 'graph = [[0,10,1,INF],[INF,0,INF,1],[INF,1,0,100],[INF,INF,INF,0]]',
      output: '[0,2,1,3]',
      note: 'The route to vertex 1 improves through vertex 2.',
    },
  ],
  hints: [
    'A vertex can receive a better distance after it is first discovered.',
    'Check when a vertex becomes permanently processed.',
  ],
  complexity: { time: 'O(V^2)', space: 'O(V)' },
  explanation: {
    overview: 'Calculate minimum distances from one source in a directed graph with nonnegative edge weights.',
    algorithm: 'Initialize the source distance to zero and all other distances to infinity. Repeatedly select the unprocessed vertex with the smallest tentative distance. Mark that vertex processed, then relax its outgoing edges to unprocessed neighbors.',
    bug: 'A neighbor is marked processed as soon as it receives its first tentative distance.',
    whyItFails: 'A vertex may initially be discovered through an expensive edge and later receive a cheaper route through another vertex. Marking it processed too early prevents that improvement and can also prevent its outgoing edges from being explored at the correct distance.',
    failingTestCase: 'The route 0->1 initially costs 10, but 0->2->1 costs 2. The correct distances are [0,2,1,3]. The buggy version keeps vertex 1 at 10 and never reaches vertex 3 at its correct cost.',
    fix: 'Remove the processed-state update from neighbor relaxation. Mark a vertex processed only after selecting it as the minimum unprocessed vertex.',
    whyFixWorks: 'The minimum tentative distance is finalized only when a vertex is selected. Until that point, later relaxations remain allowed to improve its distance.',
    dryRun: 'Select vertex 0. Its neighbors receive distances 10 and 1. Select vertex 2 next. Its edge to vertex 1 improves the distance from 10 to 2. Select vertex 1 and update vertex 3 to 3. The final distances are [0,2,1,3].',
    debuggingLesson: 'Separate discovery from finalization. In shortest-path algorithms, encountering a vertex does not automatically mean its best distance has been found.',
  },
  testCases: [
    {
      input: '[[0,10,1,INF],[INF,0,INF,1],[INF,1,0,100],[INF,INF,INF,0]]',
      expected: '0 2 1 3',
      buggyOutput: '0 10 1 1000000000',
    },
  ],
  harness: {
    expected: '0 2 1 3',
    driver: {
      java: `int inf = 1000000000;
int[][] g = {{0,10,1,inf},{inf,0,inf,1},{inf,1,0,100},{inf,inf,inf,0}};
int[] d = Solution.dijkstra(g);
System.out.print(d[0] + " " + d[1] + " " + d[2] + " " + d[3]);`,
      python: `inf = 1000000000
g = [[0,10,1,inf],[inf,0,inf,1],[inf,1,0,100],[inf,inf,inf,0]]
print(*dijkstra(g))`,
      c: `int inf = 1000000000;
int g[16] = {0,10,1,inf,inf,0,inf,1,inf,1,0,100,inf,inf,inf,0};
int* d = dijkstra(g,4);
printf("%d %d %d %d",d[0],d[1],d[2],d[3]);
free(d);`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int[] dijkstra(int[][] graph) {
        int n = graph.length, inf = 1000000000;
        int[] dist = new int[n];
        boolean[] used = new boolean[n];
        Arrays.fill(dist, inf);
        dist[0] = 0;
        for (int count = 0; count < n; count++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!used[v] && (u == -1 || dist[v] < dist[u])) u = v;
            }
            if (u == -1 || dist[u] == inf) break;
            used[u] = true;
            for (int v = 0; v < n; v++) {
                if (!used[v] && graph[u][v] != inf && dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                }
            }
        }
        return dist;
    }
}
`,
      bugs: {
        19: {
          was: 'dist[v] = dist[u] + graph[u][v];',
          buggy: '                    dist[v] = dist[u] + graph[u][v]; used[v] = true;',
        },
      },
    },
    python: {
      correct: `
def dijkstra(graph):
    n = len(graph)
    inf = 10**9
    dist = [inf] * n
    used = [False] * n
    dist[0] = 0
    for _ in range(n):
        u = -1
        for v in range(n):
            if not used[v] and (u == -1 or dist[v] < dist[u]):
                u = v
        if u == -1 or dist[u] == inf:
            break
        used[u] = True
        for v in range(n):
            if not used[v] and graph[u][v] != inf and dist[u] + graph[u][v] < dist[v]:
                dist[v] = dist[u] + graph[u][v]
    return dist
`,
      bugs: {
        17: {
          was: 'dist[v] = dist[u] + graph[u][v]',
          buggy: '                dist[v] = dist[u] + graph[u][v]; used[v] = True',
        },
      },
    },
    c: {
      correct: `
int* dijkstra(int* graph, int n) {
    const int inf = 1000000000;
    int* dist = malloc(n * sizeof(int));
    int* used = calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) dist[i] = inf;
    dist[0] = 0;
    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!used[v] && (u == -1 || dist[v] < dist[u])) u = v;
        }
        if (u == -1 || dist[u] == inf) break;
        used[u] = 1;
        for (int v = 0; v < n; v++) {
            int w = graph[u*n+v];
            if (!used[v] && w != inf && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    free(used);
    return dist;
}
`,
      bugs: {
        17: {
          was: 'dist[v] = dist[u] + w;',
          buggy: '                dist[v] = dist[u] + w; used[v] = 1;',
        },
      },
    },
  },
});
