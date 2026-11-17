import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p113',
  title: 'An odd cycle passes the group assignment',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Bipartite Graph Validation',
  tags: ['Graph Coloring', 'Undirected Graphs', 'BFS'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Two-group graph coloring pattern',
  description:
    'Given an undirected graph represented by an adjacency matrix, determine whether its vertices can be divided into two groups such that every edge connects vertices from different groups.',
  constraints: [
    '1 <= n <= 500',
    'The adjacency matrix is symmetric.',
    'The graph may be disconnected.',
  ],
  examples: [
    {
      input: 'graph = [[0,1,1],[1,0,1],[1,1,0]]',
      output: 'false',
      note: 'All three vertices are mutually connected.',
    },
    {
      input: 'graph = [[0,1,0],[1,0,1],[0,1,0]]',
      output: 'true',
    },
  ],
  hints: [
    'When two connected vertices receive groups, their assignments must differ.',
    'Check what happens when an edge joins two vertices that have already received assignments.',
  ],
  complexity: { time: 'O(V^2)', space: 'O(V)' },
  explanation: {
    overview: 'Determine whether the vertices of an undirected graph can be separated into two groups with no internal edges.',
    algorithm: 'Assign an initial group to an unassigned vertex and use breadth-first traversal to assign the opposite group to every unassigned neighbor. Repeat for disconnected components. Whenever an edge connects two vertices with the same group assignment, the required division is impossible.',
    bug: 'The condition for rejecting a conflicting edge is reversed.',
    whyItFails: 'An edge between vertices with the same assignment proves that the required two-group division is impossible. The reversed condition instead rejects valid edges between different groups and permits the conflicting edges.',
    failingTestCase: 'In a triangle, vertex 0 assigns both vertices 1 and 2 to the opposite group. When the edge between vertices 1 and 2 is examined, both have the same group. The correct answer is false, but the buggy condition misses this conflict.',
    fix: 'Reject the graph when color[v] == color[u].',
    whyFixWorks: 'Every edge is checked against the requirement that its endpoints have opposite assignments. Any conflict immediately proves that a valid division is impossible.',
    dryRun: 'Assign vertex 0 to group 0. Its neighbors 1 and 2 receive group 1. When processing vertex 1, the edge to vertex 2 is inspected. Both vertices have group 1, so the triangle cannot be divided into two valid groups.',
    debuggingLesson: 'For validation problems, distinguish between the condition that establishes a valid relationship and the condition that detects a contradiction. Reversing a comparison can accept invalid structures.',
  },
  testCases: [
    {
      input: '[[0,1,1],[1,0,1],[1,1,0]]',
      expected: 'false',
      buggyOutput: 'true',
    },
    {
      input: '[[0,1,0],[1,0,1],[0,1,0]]',
      expected: 'true',
    },
  ],
  harness: {
    expected: 'false true',
    driver: {
      java: `int[][] a = {{0,1,1},{1,0,1},{1,1,0}};
int[][] b = {{0,1,0},{1,0,1},{0,1,0}};
System.out.print(Solution.isBipartite(a) + " " + Solution.isBipartite(b));`,
      python: `print(str(is_bipartite([[0,1,1],[1,0,1],[1,1,0]])).lower(), str(is_bipartite([[0,1,0],[1,0,1],[0,1,0]])).lower())`,
      c: `int a[9] = {0,1,1,1,0,1,1,1,0};
int b[9] = {0,1,0,1,0,1,0,1,0};
printf("%s %s",is_bipartite(a,3) ? "true" : "false",is_bipartite(b,3) ? "true" : "false");`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static boolean isBipartite(int[][] graph) {
        int n = graph.length;
        int[] color = new int[n];
        Arrays.fill(color, -1);
        Queue<Integer> q = new ArrayDeque<>();
        for (int start = 0; start < n; start++) {
            if (color[start] != -1) continue;
            color[start] = 0;
            q.add(start);
            while (!q.isEmpty()) {
                int u = q.remove();
                for (int v = 0; v < n; v++) {
                    if (graph[u][v] == 0) continue;
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.add(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
`,
      bugs: {
        20: {
          was: 'color[v] == color[u]',
          buggy: '                    } else if (color[v] != color[u]) {',
        },
      },
    },
    python: {
      correct: `
from collections import deque

def is_bipartite(graph):
    n = len(graph)
    color = [-1] * n
    for start in range(n):
        if color[start] != -1:
            continue
        color[start] = 0
        q = deque([start])
        while q:
            u = q.popleft()
            for v in range(n):
                if graph[u][v] == 0:
                    continue
                if color[v] == -1:
                    color[v] = 1 - color[u]
                    q.append(v)
                elif color[v] == color[u]:
                    return False
    return True
`,
      bugs: {
        19: {
          was: 'color[v] == color[u]',
          buggy: '                elif color[v] != color[u]:',
        },
      },
    },
    c: {
      correct: `
int is_bipartite(int* graph, int n) {
    int* color = malloc(n * sizeof(int));
    int* queue = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) color[i] = -1;
    for (int start = 0; start < n; start++) {
        if (color[start] != -1) continue;
        int front = 0, back = 0;
        color[start] = 0;
        queue[back++] = start;
        while (front < back) {
            int u = queue[front++];
            for (int v = 0; v < n; v++) {
                if (graph[u*n+v] == 0) continue;
                if (color[v] == -1) {
                    color[v] = 1 - color[u];
                    queue[back++] = v;
                } else if (color[v] == color[u]) {
                    free(color); free(queue); return 0;
                }
            }
        }
    }
    free(color); free(queue);
    return 1;
}
`,
      bugs: {
        17: {
          was: 'color[v] == color[u]',
          buggy: '                } else if (color[v] != color[u]) {',
        },
      },
    },
  },
});
