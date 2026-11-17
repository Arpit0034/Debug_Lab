import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p112',
  title: 'An improved route keeps its old path count',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Counting Shortest Paths',
  tags: ['Dijkstra', 'Path Counting', 'Weighted Graphs'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Counting shortest weighted routes pattern',
  description:
    'Given a directed weighted graph, return the number of distinct minimum-cost paths from vertex zero to the last vertex. Use an adjacency matrix with -1 representing a missing edge. Return zero when the destination is unreachable.',
  constraints: ['1 <= n <= 300', 'All edge weights are positive.', 'The answer is reported modulo 1000000007.'],
  examples: [
    {
      input: 'graph = [[-1,10,1,-1],[-1,-1,-1,1],[-1,1,-1,5],[-1,-1,-1,-1]]',
      output: '1',
      note: 'The cheapest route uses vertices 0, 2, 1, and 3.',
    },
    {
      input: 'graph = [[-1,1,1,-1],[-1,-1,-1,1],[-1,-1,-1,1],[-1,-1,-1,-1]]',
      output: '2',
    },
  ],
  hints: [
    'What should happen to the previous path count when a strictly shorter route is discovered?',
    'Compare the updates for an improved distance and an equally good distance.',
  ],
  complexity: { time: 'O(V^2)', space: 'O(V)' },
  explanation: {
    overview: 'Count the distinct minimum-cost paths from the first vertex to the final vertex.',
    algorithm: 'Maintain a minimum distance and a path count for each vertex. Initially, the source has distance zero and one path. When a shorter route is discovered, replace the destination distance and copy the source vertex path count. When an equally short route is discovered, add the source path count to the existing count. Use the minimum unprocessed distance to select the next vertex.',
    bug: 'When a strictly shorter route is discovered, the implementation adds the new path count instead of replacing the existing count.',
    whyItFails: 'The previous path count belongs to routes that are no longer optimal. Keeping those counts causes longer paths to be included in the answer.',
    failingTestCase: 'The first graph initially discovers vertex 1 at cost 10, then improves it to cost 2 through vertex 2. The path count must be reset to 1. The buggy version retains the old count and reports 2 shortest paths to the destination.',
    fix: 'Assign ways[v] = ways[u] when nd < dist[v].',
    whyFixWorks: 'A strictly shorter distance invalidates every previously known route to that vertex. Copying the source count preserves only paths that achieve the new minimum. Equal-distance alternatives are still accumulated separately.',
    dryRun: 'From vertex 0, vertex 1 initially receives distance 10 and one path. Vertex 2 receives distance 1 and one path. Processing vertex 2 improves vertex 1 to distance 2. Its old path count is replaced with 1. Processing vertex 1 reaches vertex 3 at distance 3 with one shortest route.',
    debuggingLesson: 'When maintaining both an optimal value and the number of ways to achieve it, distinguish strictly better results from equally good results. Their state updates are different.',
  },
  testCases: [
    {
      input: '[[-1,10,1,-1],[-1,-1,-1,1],[-1,1,-1,5],[-1,-1,-1,-1]]',
      expected: '1',
      buggyOutput: '2',
    },
    {
      input: '[[-1,1,1,-1],[-1,-1,-1,1],[-1,-1,-1,1],[-1,-1,-1,-1]]',
      expected: '2',
    },
  ],
  harness: {
    expected: '1 2',
    driver: {
      java: `int[][] a = {{-1,10,1,-1},{-1,-1,-1,1},{-1,1,-1,5},{-1,-1,-1,-1}};
int[][] b = {{-1,1,1,-1},{-1,-1,-1,1},{-1,-1,-1,1},{-1,-1,-1,-1}};
System.out.print(Solution.countShortestPaths(a) + " " + Solution.countShortestPaths(b));`,
      python: `a = [[-1,10,1,-1],[-1,-1,-1,1],[-1,1,-1,5],[-1,-1,-1,-1]]
b = [[-1,1,1,-1],[-1,-1,-1,1],[-1,-1,-1,1],[-1,-1,-1,-1]]
print(count_shortest_paths(a), count_shortest_paths(b))`,
      c: `int a[16] = {-1,10,1,-1,-1,-1,-1,1,-1,1,-1,5,-1,-1,-1,-1};
int b[16] = {-1,1,1,-1,-1,-1,-1,1,-1,-1,-1,1,-1,-1,-1,-1};
printf("%lld %lld",count_shortest_paths(a,4),count_shortest_paths(b,4));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int countShortestPaths(int[][] graph) {
        int n = graph.length, inf = 1000000000;
        long mod = 1000000007L;
        int[] dist = new int[n];
        long[] ways = new long[n];
        boolean[] used = new boolean[n];
        Arrays.fill(dist, inf);
        dist[0] = 0;
        ways[0] = 1;
        for (int count = 0; count < n; count++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!used[v] && (u == -1 || dist[v] < dist[u])) u = v;
            }
            if (u == -1 || dist[u] == inf) break;
            used[u] = true;
            for (int v = 0; v < n; v++) {
                int w = graph[u][v];
                if (w < 0 || used[v]) continue;
                int nd = dist[u] + w;
                if (nd < dist[v]) {
                    dist[v] = nd;
                    ways[v] = ways[u];
                } else if (nd == dist[v]) {
                    ways[v] = (ways[v] + ways[u]) % mod;
                }
            }
        }
        return (int) ways[n - 1];
    }
}
`,
      bugs: {
        26: {
          was: 'ways[v] = ways[u];',
          buggy: '                    ways[v] += ways[u];',
        },
      },
    },
    python: {
      correct: `
def count_shortest_paths(graph):
    n = len(graph)
    inf = 10**9
    mod = 1000000007
    dist = [inf] * n
    ways = [0] * n
    used = [False] * n
    dist[0] = 0
    ways[0] = 1
    for _ in range(n):
        u = -1
        for v in range(n):
            if not used[v] and (u == -1 or dist[v] < dist[u]):
                u = v
        if u == -1 or dist[u] == inf:
            break
        used[u] = True
        for v, w in enumerate(graph[u]):
            if w < 0 or used[v]:
                continue
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                ways[v] = ways[u]
            elif nd == dist[v]:
                ways[v] = (ways[v] + ways[u]) % mod
    return ways[-1]
`,
      bugs: {
        24: {
          was: 'ways[v] = ways[u]',
          buggy: '                ways[v] += ways[u]',
        },
      },
    },
    c: {
      correct: `
long long count_shortest_paths(int* graph, int n) {
    const int inf = 1000000000;
    const long long mod = 1000000007;
    int* dist = malloc(n * sizeof(int));
    long long* ways = calloc(n, sizeof(long long));
    int* used = calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) dist[i] = inf;
    dist[0] = 0;
    ways[0] = 1;
    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!used[v] && (u == -1 || dist[v] < dist[u])) u = v;
        }
        if (u == -1 || dist[u] == inf) break;
        used[u] = 1;
        for (int v = 0; v < n; v++) {
            int w = graph[u*n+v];
            if (w < 0 || used[v]) continue;
            int nd = dist[u] + w;
            if (nd < dist[v]) {
                dist[v] = nd;
                ways[v] = ways[u];
            } else if (nd == dist[v]) {
                ways[v] = (ways[v] + ways[u]) % mod;
            }
        }
    }
    long long answer = ways[n-1];
    free(dist); free(ways); free(used);
    return answer;
}
`,
      bugs: {
        23: {
          was: 'ways[v] = ways[u];',
          buggy: '                ways[v] += ways[u];',
        },
      },
    },
  },
});
