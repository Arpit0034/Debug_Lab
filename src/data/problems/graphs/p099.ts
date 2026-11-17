import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p099',
  title: 'The cheapest tree keeps revisiting its start',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Prim Minimum Spanning Tree',
  tags: ['Minimum Spanning Tree', 'Weighted Graphs', 'Visited Vertices'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Minimum spanning tree vertex expansion pattern',
  description:
    'Given a connected, undirected weighted network represented by an adjacency matrix, return the minimum total cost needed to connect all locations. A value of 1000000 represents no edge.',
  constraints: [
    '1 <= n <= 500',
    'The graph is connected and undirected.',
    '0 <= edge weights <= 1000000',
  ],
  examples: [
    {
      input: 'graph = [[0,4,3],[4,0,1],[3,1,0]]',
      output: '4',
      note: 'The two cheapest connecting edges have weights 1 and 3.',
    },
    {
      input: 'graph = [[0,8],[8,0]]',
      output: '8',
    },
  ],
  hints: [
    'After a location has been included, should it be selected again?',
    'Trace the selection loop after the first location has been processed.',
  ],
  complexity: { time: 'O(V^2)', space: 'O(V)' },
  explanation: {
    overview:
      'Connect all locations with the minimum possible total edge weight, without introducing unnecessary cycles.',
    algorithm:
      'Maintain the cheapest known edge that can connect each location to the already connected group. Start with location zero and a key of zero. Repeatedly select the unused location with the smallest key, add its key to the total, and update the keys of its unused neighbors.',
    bug:
      'The selection loop considers every location, including locations that have already been selected.',
    whyItFails:
      'The starting location retains a key of zero after it is selected. Without checking its visited state, the selection loop can choose that same location again because its key remains smaller than all other keys. The algorithm then repeatedly adds zero instead of expanding the connected group.',
    failingTestCase:
      'For graph [[0,4,3],[4,0,1],[3,1,0]], the correct minimum total is 4. The buggy version repeatedly selects vertex 0 and returns 0.',
    fix:
      'Require !used[v] in the selection condition.',
    whyFixWorks:
      'The selection loop now chooses only locations that have not yet entered the connected group. Each iteration adds exactly one new location, and its cheapest connecting edge contributes once to the total.',
    dryRun:
      'Initially, keys are [0,INF,INF]. Select vertex 0 and mark it used. Its edges update the keys to [0,4,3]. The next unused location is vertex 2 with key 3. After selecting it, vertex 1 receives a cheaper key of 1. Select vertex 1 next. The total becomes 0 + 3 + 1 = 4.',
    debuggingLesson:
      'When an algorithm maintains a visited or processed state, verify that every selection step respects it. A value that was correct when first inserted may remain attractive even after its associated item has been processed.',
  },
  testCases: [
    {
      input: '[[0,4,3],[4,0,1],[3,1,0]]',
      expected: '4',
      buggyOutput: '0',
    },
    {
      input: '[[0,8],[8,0]]',
      expected: '8',
    },
  ],
  harness: {
    expected: '4',
    driver: {
      java: `int[][] g = {{0,4,3},{4,0,1},{3,1,0}};
System.out.print(Solution.primMst(g));`,
      python: `g = [[0,4,3],[4,0,1],[3,1,0]]
print(prim_mst(g))`,
      c: `int g[9] = {0,4,3,4,0,1,3,1,0};
printf("%d", prim_mst(g, 3));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int primMst(int[][] graph) {
        int n = graph.length, inf = 1000000;
        int[] key = new int[n];
        boolean[] used = new boolean[n];
        Arrays.fill(key, inf);
        key[0] = 0;
        int total = 0;
        for (int count = 0; count < n; count++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!used[v] && (u == -1 || key[v] < key[u])) {
                    u = v;
                }
            }
            if (u == -1 || key[u] == inf) return -1;
            used[u] = true;
            total += key[u];
            for (int v = 0; v < n; v++) {
                if (!used[v] && graph[u][v] < key[v]) {
                    key[v] = graph[u][v];
                }
            }
        }
        return total;
    }
}
`,
      bugs: {
        14: {
          was: '!used[v] &&',
          buggy: '                if (u == -1 || key[v] < key[u]) {',
        },
      },
    },
    python: {
      correct: `
def prim_mst(graph):
    n = len(graph)
    inf = 1000000
    key = [inf] * n
    used = [False] * n
    key[0] = 0
    total = 0
    for _ in range(n):
        u = -1
        for v in range(n):
            if not used[v] and (u == -1 or key[v] < key[u]):
                u = v
        if u == -1 or key[u] == inf:
            return -1
        used[u] = True
        total += key[u]
        for v in range(n):
            if not used[v] and graph[u][v] < key[v]:
                key[v] = graph[u][v]
    return total
`,
      bugs: {
        11: {
          was: 'not used[v] and',
          buggy: '            if u == -1 or key[v] < key[u]:',
        },
      },
    },
    c: {
      correct: `
#include <stdbool.h>

int prim_mst(int* graph, int n) {
    int inf = 1000000;
    int* key = malloc(sizeof(int) * n);
    bool* used = calloc(n, sizeof(bool));
    for (int i = 0; i < n; i++) key[i] = inf;
    key[0] = 0;
    int total = 0;
    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!used[v] && (u == -1 || key[v] < key[u])) {
                u = v;
            }
        }
        if (u == -1 || key[u] == inf) {
            free(key); free(used); return -1;
        }
        used[u] = true;
        total += key[u];
        for (int v = 0; v < n; v++) {
            if (!used[v] && graph[u * n + v] < key[v]) {
                key[v] = graph[u * n + v];
            }
        }
    }
    free(key); free(used);
    return total;
}
`,
      bugs: {
        13: {
          was: '!used[v] &&',
          buggy: '            if (u == -1 || key[v] < key[u]) {',
        },
      },
    },
  },
});
