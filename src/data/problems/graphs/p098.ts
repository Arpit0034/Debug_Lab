import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p098',
  title: 'Routes through the final hub vanish',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Floyd-Warshall All-Pairs Shortest Paths',
  tags: ['All-Pairs Shortest Paths', 'Distance Matrix', 'Weighted Graphs'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'All-pairs shortest-path intermediate vertex pattern',
  description:
    'Given a matrix of direct travel costs between locations, calculate the minimum travel cost between every pair. A value of 1000000 represents no direct connection.',
  constraints: [
    '1 <= n <= 100',
    'dist[i][i] = 0',
    'All finite edge weights are nonnegative.',
  ],
  examples: [
    {
      input: 'dist = [[0,1000000,1000000,2],[1000000,0,1000000,1000000],[1000000,1000000,0,1000000],[1000000,4,1,0]]',
      output: 'dist[0][1] = 6, dist[0][2] = 3',
      note: 'Both routes pass through location 3.',
    },
  ],
  hints: [
    'Check whether every location is considered as a possible middle point.',
    'Pay particular attention to the largest valid index.',
  ],
  complexity: { time: 'O(V^3)', space: 'O(1)' },
  explanation: {
    overview:
      'Find the minimum travel cost between every pair of locations, allowing routes to pass through other locations.',
    algorithm:
      'Start with the supplied distance matrix. For each possible intermediate location k, inspect every pair (i,j). If i can reach k and k can reach j, compare the current distance from i to j with the combined cost through k. Keep the smaller value in the matrix.',
    bug:
      'The outer loop stops before processing the last location as an intermediate location.',
    whyItFails:
      'The matrix contains n locations indexed from 0 through n - 1. The final location can be essential to connecting two otherwise disconnected pairs. Excluding it prevents the algorithm from discovering every route that uses that location.',
    failingTestCase:
      'The supplied four-location matrix has a route 0->3->1 costing 6 and a route 0->3->2 costing 3. The buggy version leaves both distances at 1000000.',
    fix:
      'Change the outer loop condition to k < n.',
    whyFixWorks:
      'Every valid intermediate location is then processed exactly once, including the location with index n - 1.',
    dryRun:
      'Initially, dist[0][3] = 2, dist[3][1] = 4, and dist[3][2] = 1. When k = 3 is processed, the algorithm checks the route from 0 to 3 to 1: 2 + 4 = 6, replacing infinity. It also checks the route from 0 to 3 to 2: 2 + 1 = 3. The buggy loop never performs this final intermediate-location pass.',
    debuggingLesson:
      'For nested loops over an indexed collection, verify that the loop visits every valid index. Test a case whose only valid solution depends on the final index.',
  },
  testCases: [
    {
      input: '[[0,INF,INF,2],[INF,0,INF,INF],[INF,INF,0,INF],[INF,4,1,0]]',
      expected: '6 3',
      buggyOutput: '1000000 1000000',
    },
  ],
  harness: {
    expected: '6 3',
    driver: {
      java: `int inf = 1000000;
int[][] d = {{0,inf,inf,2},{inf,0,inf,inf},{inf,inf,0,inf},{inf,4,1,0}};
Solution.floydWarshall(d);
System.out.print(d[0][1] + " " + d[0][2]);`,
      python: `inf = 1000000
d = [[0,inf,inf,2],[inf,0,inf,inf],[inf,inf,0,inf],[inf,4,1,0]]
floyd_warshall(d)
print(d[0][1], d[0][2])`,
      c: `int inf = 1000000;
int d[16] = {0,inf,inf,2,inf,0,inf,inf,inf,inf,0,inf,inf,4,1,0};
floyd_warshall(d, 4);
printf("%d %d", d[1], d[2]);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static void floydWarshall(int[][] dist) {
        int n = dist.length;
        int inf = 1000000;
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] != inf && dist[k][j] != inf
                            && dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }
}
`,
      bugs: {
        5: {
          was: 'k < n',
          buggy: '        for (int k = 0; k < n - 1; k++) {',
        },
      },
    },
    python: {
      correct: `
def floyd_warshall(dist):
    n = len(dist)
    inf = 1000000
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != inf and dist[k][j] != inf:
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist
`,
      bugs: {
        4: {
          was: 'range(n)',
          buggy: '    for k in range(n - 1):',
        },
      },
    },
    c: {
      correct: `
void floyd_warshall(int* dist, int n) {
    const int inf = 1000000;
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int left = dist[i * n + k];
                int right = dist[k * n + j];
                if (left != inf && right != inf && left + right < dist[i * n + j]) {
                    dist[i * n + j] = left + right;
                }
            }
        }
    }
}
`,
      bugs: {
        3: {
          was: 'k < n',
          buggy: '    for (int k = 0; k < n - 1; k++) {',
        },
      },
    },
  },
});
