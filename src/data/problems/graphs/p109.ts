import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p109',
  title: 'The safer route is never reconsidered',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Shortest Grid Path with Obstacle Elimination',
  tags: ['Grid Traversal', 'BFS', 'State Management'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Shortest path with limited obstacle removals pattern',
  description:
    'Given a grid where 0 represents an open cell and 1 represents an obstacle, return the minimum number of moves from the top-left cell to the bottom-right cell. You may pass through at most k obstacles. Return -1 when no route exists.',
  constraints: [
    '1 <= rows, columns <= 100',
    '0 <= k <= 1000',
    'Movement is allowed in four directions.',
  ],
  examples: [
    {
      input: 'grid = [[0,0,1],[1,0,1],[0,1,0]], k = 1',
      output: '4',
      note: 'A longer route to the center preserves enough obstacle removals to finish.',
    },
    {
      input: 'grid = [[0,1],[1,0]], k = 0',
      output: '-1',
    },
  ],
  hints: [
    'Reaching the same location with different remaining resources does not represent the same state.',
    'Consider whether the first route to a cell always leaves the most useful resources.',
  ],
  complexity: { time: 'O(RCK)', space: 'O(RCK)' },
  explanation: {
    overview: 'Find the shortest route through a grid when a limited number of obstacles may be removed.',
    algorithm: 'Use breadth-first traversal with states containing the row, column, remaining obstacle removals, and number of moves. For each cell, remember the greatest remaining resource count encountered so far. Add a state when it has a nonnegative resource count that improves this recorded value. The first destination state removed from the queue gives the shortest distance.',
    bug: 'The implementation allows a cell to be entered only once, regardless of how many obstacle removals remain.',
    whyItFails: 'Two routes can reach the same cell using different amounts of the available resource. A route that arrives first may have consumed the only available removal, while a later route can arrive with more removals remaining and successfully reach the destination.',
    failingTestCase: 'For [[0,0,1],[1,0,1],[0,1,0]] with k = 1, the shortest valid path has four moves. The buggy version first reaches the center using the obstacle at (1,0), marks it visited, and rejects the later arrival with one removal remaining. It returns -1.',
    fix: 'Allow a state when rem > best[nr][nc], rather than only when best[nr][nc] == -1.',
    whyFixWorks: 'A cell is revisited when the new route provides more remaining resources. This preserves states that may enable routes unavailable to the earlier arrival, while discarding dominated states.',
    dryRun: 'Start at (0,0) with one removal. The downward route reaches (1,1) with zero removals remaining. The rightward route reaches the same cell with one removal remaining. The second arrival improves the recorded resource count. From (1,1), move to (2,1), removing one obstacle, then move to (2,2). The destination is reached in four moves.',
    debuggingLesson: 'When a search has additional constraints or limited resources, include those resources in the state. A position alone may not uniquely describe the future possibilities.',
  },
  testCases: [
    {
      input: 'grid = [[0,0,1],[1,0,1],[0,1,0]], k = 1',
      expected: '4',
      buggyOutput: '-1',
    },
    {
      input: 'grid = [[0,1],[1,0]], k = 0',
      expected: '-1',
    },
  ],
  harness: {
    expected: '4 -1',
    driver: {
      java: `int[][] a = {{0,0,1},{1,0,1},{0,1,0}};
int[][] b = {{0,1},{1,0}};
System.out.print(Solution.shortestPath(a,1) + " " + Solution.shortestPath(b,0));`,
      python: `print(shortest_path([[0,0,1],[1,0,1],[0,1,0]],1), shortest_path([[0,1],[1,0]],0))`,
      c: `int a[9] = {0,0,1,1,0,1,0,1,0};
int b[4] = {0,1,1,0};
printf("%d %d",shortest_path(a,3,3,1),shortest_path(b,2,2,0));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int shortestPath(int[][] grid, int k) {
        int rows = grid.length, cols = grid[0].length;
        int[][] best = new int[rows][cols];
        for (int[] row : best) Arrays.fill(row, -1);
        Queue<int[]> q = new ArrayDeque<>();
        q.add(new int[]{0,0,k,0});
        best[0][0] = k;
        int[] dr = {1,-1,0,0}, dc = {0,0,1,-1};
        while (!q.isEmpty()) {
            int[] cur = q.remove();
            int r = cur[0], c = cur[1], rem = cur[2], steps = cur[3];
            if (r == rows-1 && c == cols-1) return steps;
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                int nextRem = rem - grid[nr][nc];
                if (nextRem >= 0 && nextRem > best[nr][nc]) {
                    best[nr][nc] = nextRem;
                    q.add(new int[]{nr,nc,nextRem,steps+1});
                }
            }
        }
        return -1;
    }
}
`,
      bugs: {
        20: {
          was: 'nextRem > best[nr][nc]',
          buggy: '                if (nextRem >= 0 && best[nr][nc] == -1) {',
        },
      },
    },
    python: {
      correct: `
from collections import deque

def shortest_path(grid, k):
    rows, cols = len(grid), len(grid[0])
    best = [[-1] * cols for _ in range(rows)]
    best[0][0] = k
    q = deque([(0, 0, k, 0)])
    directions = [(1,0),(-1,0),(0,1),(0,-1)]
    while q:
        r, c, rem, steps = q.popleft()
        if (r, c) == (rows - 1, cols - 1):
            return steps
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            next_rem = rem - grid[nr][nc]
            if next_rem >= 0 and next_rem > best[nr][nc]:
                best[nr][nc] = next_rem
                q.append((nr, nc, next_rem, steps + 1))
    return -1
`,
      bugs: {
        18: {
          was: 'next_rem > best[nr][nc]',
          buggy: '            if next_rem >= 0 and best[nr][nc] == -1:',
        },
      },
    },
    c: {
      correct: `
typedef struct {
    int r, c, rem, steps;
} State;
int shortest_path(int* grid, int rows, int cols, int k) {
    int size = rows * cols;
    int* best = malloc(size * sizeof(int));
    int cap = size + 1, head = 0, tail = 0;
    State* q = malloc(cap * sizeof(State));
    for (int i = 0; i < size; i++) best[i] = -1;
    best[0] = k;
    q[tail++] = (State){0,0,k,0};
    int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1};
    while (head < tail) {
        State cur = q[head++];
        if (cur.r == rows-1 && cur.c == cols-1) {
            free(best); free(q); return cur.steps;
        }
        for (int d = 0; d < 4; d++) {
            int nr = cur.r + dr[d], nc = cur.c + dc[d];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            int v = nr * cols + nc;
            int rem = cur.rem - grid[v];
            if (rem >= 0 && rem > best[v]) {
                best[v] = rem;
                if (tail == cap) {
                    cap *= 2;
                    q = realloc(q, cap * sizeof(State));
                }
                q[tail++] = (State){nr,nc,rem,cur.steps+1};
            }
        }
    }
    free(best); free(q);
    return -1;
}
`,
      bugs: {
        23: {
          was: 'rem > best[v]',
          buggy: '            if (rem >= 0 && best[v] == -1) {',
        },
      },
    },
  },
});
