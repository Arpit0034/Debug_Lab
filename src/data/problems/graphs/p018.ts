import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p018',
  title: 'Shortest paths that are not shortest',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Dijkstra',
  tags: ['Priority Queue', 'Shortest Path'],
  bugCategory: 'Incorrect Comparator Logic',
  sourceInspiredBy: 'Dijkstra with a binary heap',
  description: 'Compute the shortest distance from a source to every node in a directed graph with non-negative weights. For some graphs the distances are too large.',
  constraints: ['1 <= n <= 1000', '0 <= weight <= 10000', 'All nodes are reachable'],
  examples: [{ input: 'n = 4, edges = [[0,1,10],[0,2,1],[2,1,1],[1,3,1]], src = 0', output: '0 2 1 3', note: 'The buggy code does not find the route 0 -> 2 -> 1.' }],
    hints: ['Which node should be processed next? What is that choice actually ordered by?'],
  complexity: { time: 'O((V + E) log V)', space: 'O(V + E)' },
  explanation: {
    overview: 'Find the cheapest path from one source to every other node.',
    algorithm: 'Always settle the unsettled node with the smallest known distance. A priority queue provides that node. Once a node is settled its distance is final, and its edges are relaxed.',
    bug: 'Java: the heap is ordered by node number (x[0]) instead of distance (x[1]). Python: the heap entry stores the edge weight w instead of the total distance nd.',
    whyItFails: 'Dijkstra is only correct when the next settled node is the closest one. Ordering by node id (or by edge weight) settles nodes too early with a distance that is not minimal, and settled nodes are never updated again.',
    failingTestCase: 'Edges 0->1 (10), 0->2 (1), 2->1 (1), 1->3 (1). Node 1 is settled with distance 10 before node 2 is processed, so its true distance 2 and the distance to node 3 are wrong.',
    fix: 'Java: compare x[1] with y[1]. Python: push (nd, v).',
    whyFixWorks: 'The heap always returns the smallest total distance, so the first time a node is removed its distance cannot be improved.',
    dryRun: 'Source 0: relax 1 (10) and 2 (1). Smallest is node 2 (1): relax 1 to 2. Smallest is node 1 (2): relax 3 to 3. Result 0 2 1 3.',
    debuggingLesson: 'A priority queue is only as correct as its ordering key. Check what the comparator or the first tuple element really sorts by.',
  },
  testCases: [{ input: '4, [[0,1,10],[0,2,1],[2,1,1],[1,3,1]], 0', expected: '0 2 1 3' }],
  harness: {
    expected: '0 2 1 3',
    driver: {
      java: `int[] d = Solution.dijkstra(4, new int[][]{{0, 1, 10}, {0, 2, 1}, {2, 1, 1}, {1, 3, 1}}, 0);\nSystem.out.println(d[0] + " " + d[1] + " " + d[2] + " " + d[3]);`,
      python: `d = dijkstra(4, [[0, 1, 10], [0, 2, 1], [2, 1, 1], [1, 3, 1]], 0)\nprint(*d)`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int[] dijkstra(int n, int[][] edges, int src) {
        List<List<int[]>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            g.add(new ArrayList<>());
        }
        for (int[] e : edges) {
            g.get(e[0]).add(new int[] {e[1], e[2]});
        }
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        boolean[] done = new boolean[n];
        PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> Integer.compare(x[1], y[1]));
        pq.add(new int[] {src, 0});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int u = cur[0];
            if (done[u]) {
                continue;
            }
            done[u] = true;
            for (int[] edge : g.get(u)) {
                int v = edge[0];
                int nd = dist[u] + edge[1];
                if (!done[v] && nd < dist[v]) {
                    dist[v] = nd;
                    pq.add(new int[] {v, nd});
                }
            }
        }
        return dist;
    }
}
`,
      bugs: { 16: { was: 'x[1], y[1]', buggy: 'PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> Integer.compare(x[0], y[0]));' } },
    },
    python: {
      correct: `
import heapq


def dijkstra(n, edges, src):
    g = [[] for _ in range(n)]
    for u, v, w in edges:
        g[u].append((v, w))
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0
    done = [False] * n
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if done[u]:
            continue
        done[u] = True
        for v, w in g[u]:
            nd = d + w
            if not done[v] and nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist
`,
      bugs: { 22: { was: '(nd, v)', buggy: 'heapq.heappush(pq, (w, v))' } },
    },
  },
});
