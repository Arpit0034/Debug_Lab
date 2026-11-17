import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p103',
  title: 'Two connected groups become one',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Strongly Connected Components',
  tags: ['SCC', 'Kosaraju', 'Directed Graphs'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Kosaraju strongly connected components pattern',
  description:
    'Given a directed graph represented by an adjacency matrix, return the number of groups in which every vertex can reach every other vertex in the same group.',
  constraints: ['1 <= n <= 500', 'The graph is directed.', 'No duplicate edges are present.'],
  examples: [
    {
      input: 'graph = [[0,1,0],[1,0,1],[0,0,0]]',
      output: '2',
      note: 'Vertices 0 and 1 form one group, while vertex 2 forms another.',
    },
  ],
  hints: [
    'Consider why reversing every edge changes which vertices can be reached.',
    'Check which graph is used during the second traversal.',
  ],
  complexity: { time: 'O(V^2)', space: 'O(V^2)' },
  explanation: {
    overview: 'Count the maximal groups of mutually reachable vertices in a directed graph.',
    algorithm: 'Perform a depth-first traversal of the original graph and record vertices in finishing order. Reverse every edge. Process vertices in decreasing finishing order, starting a new traversal in the reversed graph for every unvisited vertex. Each such traversal identifies one strongly connected component.',
    bug: 'The second traversal uses the original graph instead of the reversed graph.',
    whyItFails: 'The finishing order from the first traversal is meaningful only when the second traversal follows reversed edges. Traversing the original graph can combine vertices that belong to different strongly connected components.',
    failingTestCase: 'For edges 0->1, 1->0, and 1->2, the correct answer is 2. The buggy second traversal starts at vertex 0 and reaches vertices 1 and 2, incorrectly reporting one component.',
    fix: 'Pass the transposed adjacency matrix to the second traversal.',
    whyFixWorks: 'Reversing the edges ensures that each traversal started in decreasing finishing order collects exactly one strongly connected component.',
    dryRun: 'The first traversal visits 0, then 1, then 2, producing finishing order [2,1,0]. Reverse the edges: 1->0, 0->1, and 2->1. Process 0 first and collect {0,1}. Vertex 2 remains unvisited, so it forms the second component.',
    debuggingLesson: 'When an algorithm has multiple traversal phases, verify that each phase uses the intended representation of the graph. Reusing a valid structure from an earlier phase can still be logically incorrect.',
  },
  testCases: [
    { input: '[[0,1,0],[1,0,1],[0,0,0]]', expected: '2', buggyOutput: '1' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `int[][] g = {{0,1,0},{1,0,1},{0,0,0}};
System.out.print(Solution.countScc(g));`,
      python: `g = [[0,1,0],[1,0,1],[0,0,0]]
print(count_scc(g))`,
      c: `int g[9] = {0,1,0,1,0,1,0,0,0};
printf("%d", count_scc(g,3));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static void orderDfs(int[][] g, int u, boolean[] seen, List<Integer> order) {
        seen[u] = true;
        for (int v = 0; v < g.length; v++) {
            if (g[u][v] == 1 && !seen[v]) orderDfs(g, v, seen, order);
        }
        order.add(u);
    }
    static void markDfs(int[][] g, int u, boolean[] seen) {
        seen[u] = true;
        for (int v = 0; v < g.length; v++) {
            if (g[u][v] == 1 && !seen[v]) markDfs(g, v, seen);
        }
    }
    static int countScc(int[][] graph) {
        int n = graph.length;
        boolean[] seen = new boolean[n];
        List<Integer> order = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (!seen[i]) orderDfs(graph, i, seen, order);
        }
        int[][] rev = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) rev[j][i] = graph[i][j];
        }
        Arrays.fill(seen, false);
        int count = 0;
        for (int i = order.size() - 1; i >= 0; i--) {
            int u = order.get(i);
            if (!seen[u]) {
                markDfs(rev, u, seen);
                count++;
            }
        }
        return count;
    }
}
`,
      bugs: {
        33: { was: 'markDfs(rev, u, seen)', buggy: '                markDfs(graph, u, seen);' },
      },
    },
    python: {
      correct: `
def count_scc(graph):
    n = len(graph)
    seen = [False] * n
    order = []
    def visit(g, u):
        seen[u] = True
        for v in range(n):
            if g[u][v] and not seen[v]:
                visit(g, v)
        order.append(u)
    for u in range(n):
        if not seen[u]:
            visit(graph, u)
    rev = [[graph[j][i] for j in range(n)] for i in range(n)]
    seen = [False] * n
    def mark(g, u):
        seen[u] = True
        for v in range(n):
            if g[u][v] and not seen[v]:
                mark(g, v)
    count = 0
    for u in reversed(order):
        if not seen[u]:
            mark(rev, u)
            count += 1
    return count
`,
      bugs: {
        24: { was: 'mark(rev, u)', buggy: '            mark(graph, u)' },
      },
    },
    c: {
      correct: `
void order_dfs(int* g, int n, int u, int* seen, int* order, int* size) {
    seen[u] = 1;
    for (int v = 0; v < n; v++) {
        if (g[u*n+v] && !seen[v]) order_dfs(g,n,v,seen,order,size);
    }
    order[(*size)++] = u;
}
void mark_dfs(int* g, int n, int u, int* seen) {
    seen[u] = 1;
    for (int v = 0; v < n; v++) {
        if (g[u*n+v] && !seen[v]) mark_dfs(g,n,v,seen);
    }
}
int count_scc(int* graph, int n) {
    int* rev = calloc(n*n, sizeof(int));
    int* seen = calloc(n, sizeof(int));
    int* order = malloc(n * sizeof(int));
    int size = 0;
    for (int i = 0; i < n; i++) {
        if (!seen[i]) order_dfs(graph,n,i,seen,order,&size);
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) rev[j*n+i] = graph[i*n+j];
    }
    for (int i = 0; i < n; i++) seen[i] = 0;
    int count = 0;
    for (int i = size - 1; i >= 0; i--) {
        int u = order[i];
        if (!seen[u]) {
            mark_dfs(rev,n,u,seen);
            count++;
        }
    }
    free(rev); free(seen); free(order);
    return count;
}
`,
      bugs: {
        30: { was: 'mark_dfs(rev,n,u,seen)', buggy: '            mark_dfs(graph,n,u,seen);' },
      },
    },
  },
});
