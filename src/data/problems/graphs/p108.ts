import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p108',
  title: 'Prerequisites point in the wrong direction',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Topological Ordering',
  tags: ['Directed Graphs', 'Indegree', 'Course Scheduling'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Course prerequisite ordering pattern',
  description:
    'Given a directed graph where an edge from u to v means u must be completed before v, determine whether every vertex can be processed while respecting all dependencies.',
  constraints: [
    '1 <= n <= 1000',
    'The graph is represented by an n by n adjacency matrix.',
    'The graph contains no duplicate edges.',
  ],
  examples: [
    {
      input: 'graph = [[0,1,0],[0,0,1],[0,0,0]]',
      output: 'true',
      note: 'The three vertices can be processed in order 0, 1, 2.',
    },
    {
      input: 'graph = [[0,1],[1,0]]',
      output: 'false',
    },
  ],
  hints: [
    'Count how many incoming dependencies each vertex has.',
    'Check which endpoint should receive the increment when an edge is discovered.',
  ],
  complexity: { time: 'O(V^2)', space: 'O(V)' },
  explanation: {
    overview: 'Determine whether all tasks can be completed without violating their directed prerequisites.',
    algorithm: 'Calculate the incoming-edge count for every vertex. Add all vertices with zero incoming edges to a queue. Repeatedly remove one vertex, count it as processed, and reduce the incoming-edge count of its outgoing neighbors. When a neighbor reaches zero, add it to the queue. All vertices can be processed exactly when the processed count equals the number of vertices.',
    bug: 'The incoming-edge count is increased for the source vertex instead of the destination vertex.',
    whyItFails: 'For an edge u->v, vertex v gains one incoming dependency. Updating u instead reverses the meaning of the count. Vertices with unfinished prerequisites may appear ready, while vertices that have no prerequisites may remain blocked.',
    failingTestCase: 'For 0->1 and 1->2, every vertex can be processed in the order 0,1,2. The buggy version calculates the wrong incoming counts and returns false.',
    fix: 'Increment indegree[v] when an edge from u to v exists.',
    whyFixWorks: 'The destination now accurately records the number of prerequisites that must be processed before it can enter the queue.',
    dryRun: 'The chain has edges 0->1 and 1->2. Correct incoming counts are [0,1,1]. Process vertex 0, reducing vertex 1 to zero. Process vertex 1, reducing vertex 2 to zero. Process vertex 2. Three vertices are processed, so the answer is true.',
    debuggingLesson: 'For directed relationships, carefully distinguish the source and destination. A correct loop can still calculate the wrong graph property when an update targets the wrong endpoint.',
  },
  testCases: [
    {
      input: '[[0,1,0],[0,0,1],[0,0,0]]',
      expected: 'true',
      buggyOutput: 'false',
    },
    {
      input: '[[0,1],[1,0]]',
      expected: 'false',
    },
  ],
  harness: {
    expected: 'true false',
    driver: {
      java: `System.out.print(Solution.canFinish(new int[][]{{0,1,0},{0,0,1},{0,0,0}}) + " ");
System.out.print(Solution.canFinish(new int[][]{{0,1},{1,0}}));`,
      python: `print(str(can_finish([[0,1,0],[0,0,1],[0,0,0]])).lower(), str(can_finish([[0,1],[1,0]])).lower())`,
      c: `int a[9] = {0,1,0,0,0,1,0,0,0};
int b[4] = {0,1,1,0};
printf("%s %s",can_finish(a,3) ? "true" : "false",can_finish(b,2) ? "true" : "false");`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static boolean canFinish(int[][] graph) {
        int n = graph.length;
        int[] indegree = new int[n];
        for (int u = 0; u < n; u++) {
            for (int v = 0; v < n; v++) {
                if (graph[u][v] == 1) indegree[v]++;
            }
        }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) q.add(i);
        }
        int processed = 0;
        while (!q.isEmpty()) {
            int u = q.remove();
            processed++;
            for (int v = 0; v < n; v++) {
                if (graph[u][v] == 1) {
                    indegree[v]--;
                    if (indegree[v] == 0) q.add(v);
                }
            }
        }
        return processed == n;
    }
}
`,
      bugs: {
        9: {
          was: 'indegree[v]++',
          buggy: '                if (graph[u][v] == 1) indegree[u]++;',
        },
      },
    },
    python: {
      correct: `
from collections import deque

def can_finish(graph):
    n = len(graph)
    indegree = [0] * n
    for u in range(n):
        for v in range(n):
            if graph[u][v] == 1:
                indegree[v] += 1
    q = deque(i for i in range(n) if indegree[i] == 0)
    processed = 0
    while q:
        u = q.popleft()
        processed += 1
        for v in range(n):
            if graph[u][v] == 1:
                indegree[v] -= 1
                if indegree[v] == 0:
                    q.append(v)
    return processed == n
`,
      bugs: {
        9: {
          was: 'indegree[v] += 1',
          buggy: '                indegree[u] += 1',
        },
      },
    },
    c: {
      correct: `
int can_finish(int* graph, int n) {
    int* indegree = calloc(n, sizeof(int));
    int* queue = malloc(n * sizeof(int));
    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) {
            if (graph[u*n+v] == 1) indegree[v]++;
        }
    }
    int front = 0, back = 0;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) queue[back++] = i;
    }
    int processed = 0;
    while (front < back) {
        int u = queue[front++];
        processed++;
        for (int v = 0; v < n; v++) {
            if (graph[u*n+v] == 1) {
                indegree[v]--;
                if (indegree[v] == 0) queue[back++] = v;
            }
        }
    }
    free(indegree); free(queue);
    return processed == n;
}
`,
      bugs: {
        6: {
          was: 'indegree[v]++',
          buggy: '            if (graph[u*n+v] == 1) indegree[u]++;',
        },
      },
    },
  },
});
