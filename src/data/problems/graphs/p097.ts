import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p097',
  title: 'A reachable route stops one edge short',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Bellman-Ford Shortest Paths',
  tags: ['Weighted Graphs', 'Shortest Paths', 'Negative Edges'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Repeated edge relaxation shortest-path pattern',
  description:
    'Given a directed weighted network and a source node, return the minimum cost to reach every node. Use 1000000000 for a node that cannot be reached.',
  constraints: [
    '1 <= n <= 1000',
    '0 <= edges.length <= 10000',
    'Edge weights may be negative, but the input has no negative cycle reachable from the source.',
  ],
  examples: [
    {
      input: 'n = 4, edges = [[2,3,7],[1,2,7],[0,1,5]], src = 0',
      output: '[0, 5, 12, 19]',
      note: 'The route to node 3 uses all three edges.',
    },
    {
      input: 'n = 3, edges = [[0,1,4],[1,2,-1]], src = 0',
      output: '[0, 4, 3]',
    },
  ],
  hints: [
    'Consider how many edges a simple route can contain when there are four nodes.',
    'Trace the passes using the edges in the exact order supplied.',
  ],
  complexity: { time: 'O(VE)', space: 'O(V)' },
  explanation: {
    overview:
      'Compute the minimum cost from one source node to every other node, including networks with negative edge weights.',
    algorithm:
      'Initialize every distance to infinity except the source, whose distance is zero. Repeatedly inspect every directed edge and improve its destination distance whenever its source is reachable and the new route is cheaper. A shortest simple route contains at most V - 1 edges, so V - 1 complete passes are sufficient.',
    bug:
      'The outer loop performs only n - 2 passes instead of n - 1 passes.',
    whyItFails:
      'When edges are supplied in reverse route order, an improvement can advance only one edge along the route during each pass. A route containing three edges may therefore require three complete passes. Stopping after two passes leaves the final destination incorrectly unreachable.',
    failingTestCase:
      'n = 4, edges = [[2,3,7],[1,2,7],[0,1,5]], src = 0. The correct distances are [0,5,12,19], while the buggy version returns [0,5,12,1000000000].',
    fix:
      'Change the pass condition to pass < n - 1.',
    whyFixWorks:
      'A shortest route without a negative cycle never needs to repeat a vertex, so it uses at most n - 1 edges. Performing n - 1 passes accommodates even the worst edge ordering.',
    dryRun:
      'Start with distances [0,INF,INF,INF]. Pass 1 examines 2->3 and 1->2 before 0->1, so only node 1 becomes 5. Pass 2 updates node 2 to 12. Pass 3 updates node 3 to 19. The buggy version stops after pass 2 and never discovers the final route.',
    debuggingLesson:
      'When an algorithm repeatedly propagates information, test the maximum number of propagation steps required. Also test an input ordering that prevents improvements from travelling through several edges in one pass.',
  },
  testCases: [
    {
      input: '4, [[2,3,7],[1,2,7],[0,1,5]], 0',
      expected: '[0, 5, 12, 19]',
      buggyOutput: '[0, 5, 12, 1000000000]',
    },
    {
      input: '3, [[0,1,4],[1,2,-1]], 0',
      expected: '[0, 4, 3]',
    },
  ],
  harness: {
    expected: '0 5 12 19',
    driver: {
      java: `int[] d = Solution.bellmanFord(4, new int[][]{{2,3,7},{1,2,7},{0,1,5}}, 0);
System.out.print(d[0] + " " + d[1] + " " + d[2] + " " + d[3]);`,
      python: `d = bellman_ford(4, [[2,3,7],[1,2,7],[0,1,5]], 0)
print(*d)`,
      c: `int edges[3][3] = {{2,3,7},{1,2,7},{0,1,5}};
int* d = bellman_ford(4, edges, 3, 0);
printf("%d %d %d %d", d[0], d[1], d[2], d[3]);
free(d);`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int[] bellmanFord(int n, int[][] edges, int src) {
        int inf = 1000000000;
        int[] dist = new int[n];
        Arrays.fill(dist, inf);
        dist[src] = 0;
        for (int pass = 0; pass < n - 1; pass++) {
            for (int[] edge : edges) {
                int u = edge[0], v = edge[1], w = edge[2];
                if (dist[u] != inf && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
        return dist;
    }
}
`,
      bugs: {
        9: {
          was: 'pass < n - 1',
          buggy: 'for (int pass = 0; pass < n - 2; pass++) {',
        },
      },
    },
    python: {
      correct: `
def bellman_ford(n, edges, src):
    inf = 10**9
    dist = [inf] * n
    dist[src] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != inf and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist
`,
      bugs: {
        5: {
          was: 'range(n - 1)',
          buggy: '    for _ in range(n - 2):',
        },
      },
    },
    c: {
      correct: `
int* bellman_ford(int n, int edges[][3], int m, int src) {
    const int inf = 1000000000;
    int* dist = malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) dist[i] = inf;
    dist[src] = 0;
    for (int pass = 0; pass < n - 1; pass++) {
        for (int e = 0; e < m; e++) {
            int u = edges[e][0], v = edges[e][1], w = edges[e][2];
            if (dist[u] != inf && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    return dist;
}
`,
      bugs: {
        6: {
          was: 'pass < n - 1',
          buggy: '    for (int pass = 0; pass < n - 2; pass++) {',
        },
      },
    },
  },
});
