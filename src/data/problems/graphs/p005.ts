import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p005',
  title: 'One component goes missing',
  difficulty: 'Easy',
  topic: 'Graphs',
  subtopic: 'Connected Components',
  tags: ['DFS', 'Loop Boundary'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Count connected components pattern',
  description:
    'Count the connected components of an undirected graph with n vertices numbered 0 to n-1. The result is sometimes too small.',
  constraints: ['1 <= n <= 100', 'No self loops'],
  examples: [
    { input: 'n = 3, edges = [[1, 2]]', output: '2', note: 'Vertex 0 is isolated.' },
    { input: 'n = 4, edges = [[0, 1], [2, 3]]', output: '2' },
  ],
  hints: ['Which vertices does the outer loop actually visit?'],
  complexity: { time: 'O(V + E)', space: 'O(V + E)' },
  complexityOverrides: { c: { time: 'O(V^2)', space: 'O(V)' } },
  explanation: {
    overview: 'Count groups of vertices that are connected to each other.',
    algorithm:
      'Run DFS from every vertex that has not been visited yet. Each such start discovers one full component, so the number of starts is the number of components.',
    bug: 'The outer loop starts at vertex 1 instead of vertex 0.',
    whyItFails:
      'Vertex 0 is never used as a start. If vertex 0 is alone or forms a component of its own, that component is never counted.',
    failingTestCase: 'n = 3, edges = [[1, 2]]: the code returns 1, but vertex 0 is a separate component, so 2 is expected.',
    fix: 'Loop over every vertex, starting from 0.',
    whyFixWorks: 'Every vertex is now considered, so every component gets exactly one DFS start.',
    dryRun: 'n = 3, edges = [[1,2]]. i=0: not seen, DFS, count=1. i=1: not seen, DFS visits 1 and 2, count=2. i=2: seen. Result 2.',
    debuggingLesson: 'Check the first and last value of every loop range against the full set of items it should cover.',
  },
  testCases: [{ input: '3, [[1, 2]]', expected: '2', buggyOutput: '1' }],
  harness: {
    expected: '2 2',
    driver: {
      java: `System.out.println(Solution.countComponents(3, new int[][]{{1, 2}}) + " " + Solution.countComponents(4, new int[][]{{0, 1}, {2, 3}}));`,
      python: `print(count_components(3, [[1, 2]]), count_components(4, [[0, 1], [2, 3]]))`,
      c: `static int g1[MAXN][MAXN], g2[MAXN][MAXN];
g1[1][2] = g1[2][1] = 1;
g2[0][1] = g2[1][0] = g2[2][3] = g2[3][2] = 1;
printf("%d %d", count_components(3, g1), count_components(4, g2));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int countComponents(int n, int[][] edges) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] e : edges) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        boolean[] seen = new boolean[n];
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (!seen[i]) {
                dfs(graph, seen, i);
                count++;
            }
        }
        return count;
    }

    static void dfs(List<List<Integer>> graph, boolean[] seen, int node) {
        seen[node] = true;
        for (int next : graph.get(node)) {
            if (!seen[next]) {
                dfs(graph, seen, next);
            }
        }
    }
}
`,
      bugs: { 15: { was: 'for (int i = 0; i < n; i++)', buggy: 'for (int i = 1; i < n; i++) {' } },
    },
    python: {
      correct: `
def count_components(n, edges):
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    seen = [False] * n

    def dfs(node):
        seen[node] = True
        for nxt in graph[node]:
            if not seen[nxt]:
                dfs(nxt)

    count = 0
    for i in range(n):
        if not seen[i]:
            dfs(i)
            count += 1
    return count
`,
      bugs: { 16: { was: 'for i in range(n):', buggy: 'for i in range(1, n):' } },
    },
    c: {
      correct: `
#define MAXN 100

void dfs(int n, int g[][MAXN], int seen[], int node) {
    seen[node] = 1;
    for (int next = 0; next < n; next++) {
        if (g[node][next] && !seen[next]) {
            dfs(n, g, seen, next);
        }
    }
}

int count_components(int n, int g[][MAXN]) {
    int seen[MAXN] = {0};
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (!seen[i]) {
            dfs(n, g, seen, i);
            count++;
        }
    }
    return count;
}
`,
      bugs: { 15: { was: 'for (int i = 0; i < n; i++)', buggy: 'for (int i = 1; i < n; i++) {' } },
    },
  },
});
