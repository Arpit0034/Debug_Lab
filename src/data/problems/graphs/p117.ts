import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p117',
  title: 'Extra connections sneak past the stop limit',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Cheapest Route with Limited Stops',
  tags: ['Shortest Paths', 'Bellman-Ford', 'Flight Scheduling'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Cheapest flight with bounded stops pattern',
  description:
    'Given directed flights with prices, a starting city, a destination, and a maximum number of intermediate stops, return the minimum possible travel cost. Return -1 when no valid route exists.',
  constraints: [
    '1 <= n <= 100',
    '0 <= flights.length <= 10000',
    '0 <= k <= 100',
    'All flight prices are positive.',
  ],
  examples: [
    {
      input: 'n = 4, flights = [[0,1,1],[1,2,1],[2,3,1],[0,3,10]], src = 0, dst = 3, k = 1',
      output: '10',
      note: 'Only two flights are allowed because at most one intermediate stop is permitted.',
    },
    {
      input: 'n = 2, flights = [[0,1,7]], src = 0, dst = 1, k = 0',
      output: '7',
    },
  ],
  hints: [
    'The number of allowed flights is one greater than the number of allowed intermediate stops.',
    'Consider whether an update during the current pass should influence another update in that same pass.',
  ],
  complexity: { time: 'O(KE)', space: 'O(V)' },
  explanation: {
    overview: 'Find the cheapest route between two cities while limiting the number of intermediate stops.',
    algorithm: 'Initialize the source cost to zero and all other costs to infinity. Perform at most k + 1 relaxation passes. During each pass, copy the previous distance array and calculate new costs using only the previous pass values. Replace the distance array after all flights have been examined.',
    bug: 'The implementation reads the starting cost of a flight from the array being updated in the current pass.',
    whyItFails: 'An update made earlier in the flight list can be reused by a later edge during the same pass. This allows several flights to be chained even though each pass should permit only one additional flight.',
    failingTestCase: 'With flights 0->1, 1->2, and 2->3 each costing 1, plus a direct flight 0->3 costing 10, the limit of one stop allows at most two flights. The correct result is 10. The buggy implementation chains all three cheap flights and returns 3.',
    fix: 'Read the base cost from dist[u], not next[u].',
    whyFixWorks: 'Every pass now extends only routes that were available before that pass began. A route containing more than k + 1 flights cannot influence the final destination cost.',
    dryRun: 'Initially, dist is [0,INF,INF,INF]. During pass one, city 1 becomes 1 and city 3 becomes 10. During pass two, city 2 becomes 2, but city 3 cannot use city 2 until the next pass because city 2 was not reachable in the previous snapshot. The result remains 10.',
    debuggingLesson: 'When a dynamic update is limited by the number of steps, use a snapshot of the previous state. Otherwise, update order can silently allow extra steps.',
  },
  testCases: [
    {
      input: '4, [[0,1,1],[1,2,1],[2,3,1],[0,3,10]], 0, 3, 1',
      expected: '10',
      buggyOutput: '3',
    },
    {
      input: '2, [[0,1,7]], 0, 1, 0',
      expected: '7',
    },
  ],
  harness: {
    expected: '10 7',
    driver: {
      java: `int[][] a = {{0,1,1},{1,2,1},{2,3,1},{0,3,10}};
int[][] b = {{0,1,7}};
System.out.print(Solution.cheapestFlight(4,a,0,3,1) + " ");
System.out.print(Solution.cheapestFlight(2,b,0,1,0));`,
      python: `print(cheapest_flight(4, [[0,1,1],[1,2,1],[2,3,1],[0,3,10]], 0, 3, 1), cheapest_flight(2, [[0,1,7]], 0, 1, 0))`,
      c: `int a[4][3] = {{0,1,1},{1,2,1},{2,3,1},{0,3,10}};
int b[1][3] = {{0,1,7}};
printf("%d %d",cheapest_flight(4,a,4,0,3,1),cheapest_flight(2,b,1,0,1,0));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int cheapestFlight(int n, int[][] flights, int src, int dst, int k) {
        int inf = 1000000000;
        int[] dist = new int[n];
        Arrays.fill(dist, inf);
        dist[src] = 0;
        for (int pass = 0; pass <= k; pass++) {
            int[] next = dist.clone();
            for (int[] flight : flights) {
                int u = flight[0], v = flight[1], price = flight[2];
                int base = dist[u];
                if (base != inf && base + price < next[v]) {
                    next[v] = base + price;
                }
            }
            dist = next;
        }
        return dist[dst] == inf ? -1 : dist[dst];
    }
}
`,
      bugs: {
        13: {
          was: 'int base = dist[u];',
          buggy: '                int base = next[u];',
        },
      },
    },
    python: {
      correct: `
def cheapest_flight(n, flights, src, dst, k):
    inf = 10**9
    dist = [inf] * n
    dist[src] = 0
    for _ in range(k + 1):
        next_dist = dist[:]
        for u, v, price in flights:
            base = dist[u]
            if base != inf and base + price < next_dist[v]:
                next_dist[v] = base + price
        dist = next_dist
    return -1 if dist[dst] == inf else dist[dst]
`,
      bugs: {
        8: {
          was: 'base = dist[u]',
          buggy: '            base = next_dist[u]',
        },
      },
    },
    c: {
      correct: `
int cheapest_flight(int n, int flights[][3], int m, int src, int dst, int k) {
    const int inf = 1000000000;
    int* dist = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) dist[i] = inf;
    dist[src] = 0;
    for (int pass = 0; pass <= k; pass++) {
        int next[n];
        for (int i = 0; i < n; i++) next[i] = dist[i];
        for (int e = 0; e < m; e++) {
            int u = flights[e][0], v = flights[e][1], w = flights[e][2];
            int base = dist[u];
            if (base != inf) {
                int candidate = base + w;
                if (candidate < next[v]) next[v] = candidate;
            }
        }
        for (int i = 0; i < n; i++) dist[i] = next[i];
    }
    int answer = dist[dst] == inf ? -1 : dist[dst];
    free(dist);
    return answer;
}
`,
      bugs: {
        11: {
          was: 'int base = dist[u];',
          buggy: '            int base = next[u];',
        },
      },
    },
  },
});
