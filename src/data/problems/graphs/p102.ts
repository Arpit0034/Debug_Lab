import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p102',
  title: 'A cycle sneaks into the spanning tree',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Kruskal Minimum Spanning Tree',
  tags: ['MST', 'Union Find', 'Weighted Graphs'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Kruskal minimum spanning tree pattern',
  description:
    'Given an undirected weighted graph, return the minimum total edge weight needed to connect all vertices. Return -1 when the graph is disconnected.',
  constraints: ['1 <= n <= 1000', '0 <= m <= 10000', 'Edge weights are nonnegative.'],
  examples: [
    { input: 'n = 3, edges = [[0,1,1],[1,2,2],[0,2,10]]', output: '3' },
    { input: 'n = 2, edges = [[0,1,8]]', output: '8' },
  ],
  hints: [
    'Consider what happens when an edge connects two vertices that are already connected.',
    'Check the condition that controls whether an edge contributes to the total.',
  ],
  complexity: { time: 'O(E log E)', space: 'O(V)' },
  explanation: {
    overview: 'Find the minimum-cost set of edges that connects every vertex without creating a cycle.',
    algorithm: 'Sort the edges by increasing weight. Maintain a representative for every connected group. For each edge, compare the representatives of its endpoints. Add the edge and merge the groups only when the representatives differ. Stop after selecting n - 1 edges.',
    bug: 'The condition for accepting an edge checks whether its endpoints already have the same representative.',
    whyItFails: 'An edge whose endpoints have the same representative creates a cycle and must be rejected. The reversed condition rejects useful connecting edges and accepts cycle-forming edges.',
    failingTestCase: 'n = 3, edges = [[0,1,1],[1,2,2],[0,2,10]]. The correct total is 3. The buggy version skips the first two edges and accepts the final edge, returning 10.',
    fix: 'Accept the edge only when ru != rv.',
    whyFixWorks: 'Different representatives mean the endpoints belong to separate connected groups. Joining them reduces the number of components without introducing a cycle.',
    dryRun: 'Initially, all three vertices belong to separate groups. The edge 0-1 with weight 1 joins two groups. The edge 1-2 with weight 2 joins the remaining group. Two edges have been selected, so the total is 1 + 2 = 3. The edge 0-2 is unnecessary.',
    debuggingLesson: 'When implementing union-find, distinguish between testing whether two vertices are connected and testing whether an edge can safely merge their components.',
  },
  testCases: [
    { input: '3, [[0,1,1],[1,2,2],[0,2,10]]', expected: '3', buggyOutput: '10' },
    { input: '2, [[0,1,8]]', expected: '8' },
  ],
  harness: {
    expected: '3 8',
    driver: {
      java: `System.out.print(Solution.kruskalMst(3, new int[][]{{0,1,1},{1,2,2},{0,2,10}}) + " ");
System.out.print(Solution.kruskalMst(2, new int[][]{{0,1,8}}));`,
      python: `print(kruskal_mst(3, [[0,1,1],[1,2,2],[0,2,10]]), kruskal_mst(2, [[0,1,8]]))`,
      c: `int e1[3][3] = {{0,1,1},{1,2,2},{0,2,10}};
int e2[1][3] = {{0,1,8}};
printf("%d %d", kruskal_mst(3,e1,3), kruskal_mst(2,e2,1));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int kruskalMst(int n, int[][] edges) {
        Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int total = 0, count = 0;
        for (int[] edge : edges) {
            int ru = find(parent, edge[0]);
            int rv = find(parent, edge[1]);
            if (ru != rv) {
                parent[ru] = rv;
                total += edge[2];
                count++;
                if (count == n - 1) break;
            }
        }
        return count == n - 1 ? total : -1;
    }
    static int find(int[] parent, int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
}
`,
      bugs: {
        12: { was: 'ru != rv', buggy: '            if (ru == rv) {' },
      },
    },
    python: {
      correct: `
def kruskal_mst(n, edges):
    edges = sorted(edges, key=lambda edge: edge[2])
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    total = 0
    count = 0
    for u, v, weight in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            total += weight
            count += 1
            if count == n - 1:
                break
    return total if count == n - 1 else -1
`,
      bugs: {
        13: { was: 'ru != rv', buggy: '        if ru == rv:' },
      },
    },
    c: {
      correct: `
#include <string.h>
int find_root(int parent[], int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
int compare_edges(const void* a, const void* b) {
    int x = ((const int*)a)[2], y = ((const int*)b)[2];
    return (x > y) - (x < y);
}
int kruskal_mst(int n, int edges[][3], int m) {
    qsort(edges, m, sizeof(edges[0]), compare_edges);
    int parent[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int total = 0, count = 0;
    for (int i = 0; i < m; i++) {
        int ru = find_root(parent, edges[i][0]);
        int rv = find_root(parent, edges[i][1]);
        if (ru != rv) {
            parent[ru] = rv;
            total += edges[i][2];
            count++;
            if (count == n - 1) break;
        }
    }
    return count == n - 1 ? total : -1;
}
`,
      bugs: {
        21: { was: 'ru != rv', buggy: '        if (ru == rv) {' },
      },
    },
  },
});
