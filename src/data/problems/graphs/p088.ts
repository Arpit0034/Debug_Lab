import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p088',
  title: 'The long path loses a round',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Bellman-Ford Relaxation',
  tags: ['Graph', 'Shortest Path', 'Relaxation'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Bellman-Ford shortest paths with positive weighted edges',
  description:
    'Return the shortest distance from a source to a target in a directed weighted graph. The relaxation loop performs one round too few for paths with many edges.',
  constraints: ['1 <= n <= 100', 'Edge weights are positive in this test'],
  examples: [
    { input: 'n = 4, edges = [[2,3,1],[1,2,1],[0,1,1]], s = 0, t = 3', output: '3' },
  ],
  hints: ['A shortest path may use up to n - 1 edges.', 'Count how many full relaxation rounds are performed.'],
  complexity: { time: 'O(V * E)', space: 'O(V)' },
  explanation: {
    overview: 'Compute a shortest path in a weighted directed graph by repeated relaxation.',
    algorithm: 'Relax all edges n - 1 times so that paths with up to n - 1 edges are discovered.',
    bug: 'The outer relaxation loop runs n - 2 times instead of n - 1 times.',
    whyItFails: 'A path that uses n - 1 edges needs the final round to propagate its last edge, so the target remains unreachable.',
    failingTestCase: 'With edges listed from the tail of the chain to the head (2->3, 1->2, 0->1), the code returns -1 instead of 3.',
    fix: 'Run the loop for n - 1 rounds.',
    whyFixWorks: 'After k rounds all shortest paths using at most k edges have been found, so n - 1 rounds cover every simple path.',
    dryRun: 'With n=4, the edges in reverse order require three rounds. Round 1 finds 0->1, round 2 finds 0->1->2, round 3 finds 0->1->2->3. The buggy code stops after round 2 and leaves vertex 3 at infinity.',
    debuggingLesson: 'For relaxation algorithms, check the number of rounds against the maximum possible number of edges in a shortest path. Also verify that in-place relaxation within a round does not accidentally propagate through the entire chain.',
  },
  testCases: [
    { input: '4, [[2,3,1],[1,2,1],[0,1,1]], 0, 3', expected: '3', buggyOutput: '-1' },
  ],
  harness: {
    expected: '3',
    driver: {
      java: `System.out.print(Solution.shortest(4, new int[][]{{2,3,1},{1,2,1},{0,1,1}}, 0, 3));`,
      python: `print(shortest(4, [(2,3,1),(1,2,1),(0,1,1)], 0, 3))`,
      c: `printf("%d", shortest_path(4, (int[][3]){{2,3,1},{1,2,1},{0,1,1}}, 3, 0, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int shortest(int n, int[][] edges, int s, int t) {
        int INF = 1000000000;
        int[] dist = new int[n];
        for (int i = 0; i < n; i++) dist[i] = INF;
        dist[s] = 0;
        for (int it = 0; it < n - 1; it++) {
            for (int[] e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
        return dist[t] >= INF ? -1 : dist[t];
    }
}
`,
      bugs: { 7: { was: 'it < n - 1', buggy: 'for (int it = 0; it < n - 2; it++) {' } },
    },
    python: {
      correct: `
def shortest(n, edges, s, t):
    INF = 1000000000
    dist = [INF] * n
    dist[s] = 0
    for it in range(n - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return -1 if dist[t] >= INF else dist[t]
`,
      bugs: { 5: { was: 'range(n - 1)', buggy: 'for it in range(n - 2):' } },
    },
    c: {
      correct: `
int shortest_path(int n, int edges[][3], int m, int s, int t) {
    int INF = 1000000000;
    int dist[10];
    for (int i = 0; i < n; i++) dist[i] = INF;
    dist[s] = 0;
    for (int it = 0; it < n - 1; it++) {
        for (int i = 0; i < m; i++) {
            int u = edges[i][0], v = edges[i][1], w = edges[i][2];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    return dist[t] >= INF ? -1 : dist[t];
}
`,
      bugs: { 6: { was: 'it < n - 1', buggy: 'for (int it = 0; it < n - 2; it++) {' } },
    },
  },
});
