import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p107',
  title: 'Zero-cost connections arrive too late',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Zero-One Shortest Paths',
  tags: ['Deque', 'Weighted Graphs', 'Shortest Paths'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Zero-one BFS shortest-path pattern',
  description:
    'Given a directed graph whose edge weights are either zero or one, return the minimum distance from vertex zero to every other vertex. The adjacency matrix uses -1 for a missing edge.',
  constraints: ['1 <= n <= 500', 'Edge weights are 0 or 1.', 'The graph may be disconnected.'],
  examples: [
    {
      input: 'graph = [[-1,1,0,-1],[-1,-1,-1,0],[-1,0,-1,-1],[-1,-1,-1,-1]]',
      output: '[0,0,0,0]',
      note: 'Vertex 1 is initially reached at cost 1 but can later be reached at cost 0.',
    },
    {
      input: 'graph = [[-1,1],[-1,-1]]',
      output: '[0,1]',
    },
  ],
  hints: [
    'A vertex may be discovered before its minimum distance is known.',
    'Compare the moment a vertex is discovered with the moment it is permanently processed.',
  ],
  complexity: { time: 'O(V + E)', space: 'O(V + E)' },
  explanation: {
    overview: 'Calculate minimum path costs in a directed graph where every edge costs either zero or one.',
    algorithm: 'Initialize the source distance to zero and insert it into a double-ended queue. Process vertices from the front. When an edge improves a neighbor, insert that neighbor at the front for a zero-cost edge or at the back for a unit-cost edge. Finalize a vertex when it is removed from the deque for the first time.',
    bug: 'The implementation marks a vertex as permanently processed as soon as it receives its first tentative distance.',
    whyItFails: 'The first discovered route is not necessarily the cheapest. A vertex may initially be reached through a cost-one edge and later through a zero-cost route. Finalizing it during discovery prevents that improvement and can also prevent its outgoing edges from being explored.',
    failingTestCase: 'Edges are 0->1 with cost 1, 0->2 with cost 0, 2->1 with cost 0, and 1->3 with cost 0. The correct distances are [0,0,0,0]. The buggy version marks vertex 1 too early and leaves vertex 3 unreachable.',
    fix: 'Set the processed flag only after removing the vertex from the deque.',
    whyFixWorks: 'Deque ordering ensures that the first removal of a vertex has its minimum possible distance. Until removal, improvements from zero-cost routes remain possible.',
    dryRun: 'Start at vertex 0. Insert vertex 1 with distance 1 at the back and vertex 2 with distance 0 at the front. Remove vertex 2 first. Its edge improves vertex 1 from 1 to 0, so vertex 1 moves to the front. Process vertex 1 and reach vertex 3 with distance 0.',
    debuggingLesson: 'Distinguish between discovery and finalization. A tentative result must remain changeable until the algorithm guarantees that it is optimal.',
  },
  testCases: [
    {
      input: '[[-1,1,0,-1],[-1,-1,-1,0],[-1,0,-1,-1],[-1,-1,-1,-1]]',
      expected: '[0, 0, 0, 0]',
      buggyOutput: '[0, 1, 0, 1000000000]',
    },
    {
      input: '[[-1,1],[-1,-1]]',
      expected: '[0, 1]',
    },
  ],
  harness: {
    expected: '0 0 0 0',
    driver: {
      java: `int[][] g = {{-1,1,0,-1},{-1,-1,-1,0},{-1,0,-1,-1},{-1,-1,-1,-1}};
int[] d = Solution.zeroOneDistances(g);
System.out.print(d[0] + " " + d[1] + " " + d[2] + " " + d[3]);`,
      python: `g = [[-1,1,0,-1],[-1,-1,-1,0],[-1,0,-1,-1],[-1,-1,-1,-1]]
print(*zero_one_distances(g))`,
      c: `int g[16] = {-1,1,0,-1,-1,-1,-1,0,-1,0,-1,-1,-1,-1,-1,-1};
int* d = zero_one_distances(g,4);
printf("%d %d %d %d",d[0],d[1],d[2],d[3]);
free(d);`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int[] zeroOneDistances(int[][] graph) {
        int n = graph.length, inf = 1000000000;
        int[] dist = new int[n];
        boolean[] done = new boolean[n];
        Arrays.fill(dist, inf);
        dist[0] = 0;
        ArrayDeque<Integer> dq = new ArrayDeque<>();
        dq.add(0);
        while (!dq.isEmpty()) {
            int u = dq.removeFirst();
            if (done[u]) continue;
            done[u] = true;
            for (int v = 0; v < n; v++) {
                int w = graph[u][v];
                if (w < 0 || done[v]) continue;
                int nd = dist[u] + w;
                if (nd < dist[v]) {
                    dist[v] = nd;
                    if (w == 0) dq.addFirst(v);
                    else dq.addLast(v);
                }
            }
        }
        return dist;
    }
}
`,
      bugs: {
        20: {
          was: 'if (nd < dist[v]) {',
          buggy: '                if (nd < dist[v]) { done[v] = true;',
        },
      },
    },
    python: {
      correct: `
from collections import deque

def zero_one_distances(graph):
    n = len(graph)
    inf = 10**9
    dist = [inf] * n
    done = [False] * n
    dist[0] = 0
    dq = deque([0])
    while dq:
        u = dq.popleft()
        if done[u]:
            continue
        done[u] = True
        for v, w in enumerate(graph[u]):
            if w < 0 or done[v]:
                continue
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                if w == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)
    return dist
`,
      bugs: {
        18: {
          was: 'nd = dist[u] + w',
          buggy: '            nd = dist[u] + w; done[v] = True',
        },
      },
    },
    c: {
      correct: `
#include <stdbool.h>

int* zero_one_distances(int* graph, int n) {
    int inf = 1000000000;
    int* dist = malloc(n * sizeof(int));
    int* done = calloc(n, sizeof(int));
    int cap = 2 * n * n + 10;
    int* dq = malloc(cap * sizeof(int));
    int head = cap / 2, tail = head;
    for (int i = 0; i < n; i++) dist[i] = inf;
    dist[0] = 0;
    dq[tail++] = 0;
    while (head < tail) {
        int u = dq[head++];
        if (done[u]) continue;
        done[u] = 1;
        for (int v = 0; v < n; v++) {
            int w = graph[u*n+v];
            if (w < 0 || done[v]) continue;
            int nd = dist[u] + w;
            if (nd < dist[v]) {
                dist[v] = nd;
                if (w == 0) dq[--head] = v;
                else dq[tail++] = v;
            }
        }
    }
    free(done); free(dq);
    return dist;
}
`,
      bugs: {
        21: {
          was: 'if (nd < dist[v]) {',
          buggy: '            if (nd < dist[v]) { done[v] = 1;',
        },
      },
    },
  },
});
