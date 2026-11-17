import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p014',
  title: 'A diamond reported as a loop',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Cycle Detection',
  tags: ['DFS', 'Directed Graph'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Directed cycle detection with three states',
  description: 'Return true if a directed graph contains a cycle. The function finds real cycles but also reports cycles in some graphs that have none.',
  constraints: ['1 <= n <= 100', 'Edges are directed'],
  examples: [
    { input: 'n = 4, edges = [[0,1],[0,2],[1,3],[2,3]]', output: 'false', note: 'Two paths reach node 3. The buggy code returns true.' },
    { input: 'n = 3, edges = [[0,1],[1,2],[2,0]]', output: 'true' },
  ],
  hints: ['A node reached by two different paths is not a cycle. How does the code tell them apart?'],
  complexity: { time: 'O(V + E)', space: 'O(V + E)' },
  complexityOverrides: { c: { time: 'O(V^2)', space: 'O(V)' } },
  explanation: {
    overview: 'Detect whether following directed edges can lead back to a node already on the current path.',
    algorithm: 'DFS with three states per node: 0 unvisited, 1 on the current path, 2 fully explored. Meeting a node in state 1 is a back edge, so a cycle exists. Meeting a node in state 2 is harmless.',
    bug: 'When DFS finishes a node it leaves the state at 1 instead of setting it to 2.',
    whyItFails: 'Finished nodes still look like they are on the current path. Reaching one a second time, by a different route, is wrongly treated as a back edge.',
    failingTestCase: 'Edges 0->1, 0->2, 1->3, 2->3: node 3 is finished via 1, then reached again via 2 while still marked 1, so the function reports a cycle.',
    fix: 'Mark the node as finished (state 2) when its DFS completes.',
    whyFixWorks: 'Only nodes on the active path keep state 1, so state 1 now means exactly "an ancestor of the current node".',
    dryRun: 'Diamond graph. DFS 0 -> 1 -> 3, finish 3 (state 2), finish 1 (state 2). Back at 0, go to 2, see 3 in state 2, skip it. No cycle.',
    debuggingLesson: 'Directed cycle detection needs "currently on the path" separated from "already finished". One visited flag is not enough.',
  },
  testCases: [{ input: '4, [[0,1],[0,2],[1,3],[2,3]]', expected: 'false', buggyOutput: 'true' }],
  harness: {
    expected: '0 1',
    driver: {
      java: `System.out.println((Solution.hasCycle(4, new int[][]{{0, 1}, {0, 2}, {1, 3}, {2, 3}}) ? 1 : 0) + " " + (Solution.hasCycle(3, new int[][]{{0, 1}, {1, 2}, {2, 0}}) ? 1 : 0));`,
      python: `print(int(has_cycle(4, [[0, 1], [0, 2], [1, 3], [2, 3]])), int(has_cycle(3, [[0, 1], [1, 2], [2, 0]])))`,
      c: `static int g1[MAXN][MAXN], g2[MAXN][MAXN];\ng1[0][1] = g1[0][2] = g1[1][3] = g1[2][3] = 1;\ng2[0][1] = g2[1][2] = g2[2][0] = 1;\nprintf("%d %d", has_cycle(4, g1), has_cycle(3, g2));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static boolean hasCycle(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            g.add(new ArrayList<>());
        }
        for (int[] e : edges) {
            g.get(e[0]).add(e[1]);
        }
        int[] state = new int[n];
        for (int i = 0; i < n; i++) {
            if (state[i] == 0 && dfs(g, state, i)) {
                return true;
            }
        }
        return false;
    }

    static boolean dfs(List<List<Integer>> g, int[] state, int u) {
        state[u] = 1;
        for (int v : g.get(u)) {
            if (state[v] == 1) {
                return true;
            }
            if (state[v] == 0 && dfs(g, state, v)) {
                return true;
            }
        }
        state[u] = 2;
        return false;
    }
}
`,
      bugs: { 31: { was: 'state[u] = 2', buggy: 'state[u] = 1;' } },
    },
    python: {
      correct: `
def has_cycle(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
    state = [0] * n

    def dfs(u):
        state[u] = 1
        for v in g[u]:
            if state[v] == 1:
                return True
            if state[v] == 0 and dfs(v):
                return True
        state[u] = 2
        return False

    return any(state[i] == 0 and dfs(i) for i in range(n))
`,
      bugs: { 14: { was: 'state[u] = 2', buggy: 'state[u] = 1' } },
    },
    c: {
      correct: `
#define MAXN 100

int dfs(int n, int g[][MAXN], int state[], int u) {
    state[u] = 1;
    for (int v = 0; v < n; v++) {
        if (!g[u][v]) {
            continue;
        }
        if (state[v] == 1) {
            return 1;
        }
        if (state[v] == 0 && dfs(n, g, state, v)) {
            return 1;
        }
    }
    state[u] = 2;
    return 0;
}

int has_cycle(int n, int g[][MAXN]) {
    int state[MAXN] = {0};
    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && dfs(n, g, state, i)) {
            return 1;
        }
    }
    return 0;
}
`,
      bugs: { 16: { was: 'state[u] = 2', buggy: 'state[u] = 1;' } },
    },
  },
});
