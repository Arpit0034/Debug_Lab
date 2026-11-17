import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p104',
  title: 'The open corridor is treated as a wall',
  difficulty: 'Easy',
  topic: 'Graphs',
  subtopic: 'Shortest Path in a Grid',
  tags: ['Grid Traversal', 'Shortest Path', 'BFS'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Unweighted grid shortest-path pattern',
  description:
    'Given a rectangular grid where 0 represents an open cell and 1 represents a blocked cell, return the minimum number of moves from the top-left cell to the bottom-right cell. Moves are allowed in four directions. Return -1 when no route exists.',
  constraints: ['1 <= rows, columns <= 500', 'The grid is rectangular.', 'Movement is limited to four directions.'],
  examples: [
    {
      input: 'grid = [[0,1,0],[0,0,0],[1,1,0]]',
      output: '4',
      note: 'The shortest route requires four moves.',
    },
    { input: 'grid = [[0,1],[1,0]]', output: '-1' },
  ],
  hints: [
    'Check which cell values represent locations that can be entered.',
    'Trace the neighbor condition for an open cell.',
  ],
  complexity: { time: 'O(RC)', space: 'O(RC)' },
  explanation: {
    overview: 'Find the shortest four-directional route through a grid of open and blocked cells.',
    algorithm: 'Start from the top-left cell with distance zero. Process cells in increasing distance order using a queue. For every cell, inspect its four neighbors. Add an in-bounds, open, unvisited neighbor to the queue and assign it a distance one greater than the current cell. Return the destination distance or -1.',
    bug: 'The neighbor condition accepts blocked cells instead of open cells.',
    whyItFails: 'The grid uses zero to represent an open location and one to represent an obstacle. Reversing this condition prevents movement through valid cells and can allow movement through blocked ones.',
    failingTestCase: 'For [[0,1,0],[0,0,0],[1,1,0]], the shortest route has four moves. The buggy version cannot enter the open neighbor below the start and returns -1.',
    fix: 'Check that grid[nr][nc] == 0.',
    whyFixWorks: 'Only cells explicitly marked as open are added to the queue, so every explored route follows the movement rules.',
    dryRun: 'Start at (0,0) with distance 0. Move to (1,0), then (1,1), then (1,2), and finally (2,2). The destination is reached at distance 4.',
    debuggingLesson: 'For grid problems, write down the meaning of each cell value before implementing traversal conditions. A reversed encoding check can invalidate an otherwise correct search.',
  },
  testCases: [
    { input: '[[0,1,0],[0,0,0],[1,1,0]]', expected: '4', buggyOutput: '-1' },
    { input: '[[0,1],[1,0]]', expected: '-1' },
  ],
  harness: {
    expected: '4 -1',
    driver: {
      java: `int[][] a = {{0,1,0},{0,0,0},{1,1,0}};
int[][] b = {{0,1},{1,0}};
System.out.print(Solution.shortestGridPath(a) + " " + Solution.shortestGridPath(b));`,
      python: `print(shortest_grid_path([[0,1,0],[0,0,0],[1,1,0]]), shortest_grid_path([[0,1],[1,0]]))`,
      c: `int a[9] = {0,1,0,0,0,0,1,1,0};
int b[4] = {0,1,1,0};
printf("%d %d", shortest_grid_path(a,3,3), shortest_grid_path(b,2,2));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int shortestGridPath(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        if (grid[0][0] == 1 || grid[rows-1][cols-1] == 1) return -1;
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, -1);
        int[] dr = {-1,1,0,0}, dc = {0,0,-1,1};
        Queue<int[]> q = new ArrayDeque<>();
        q.add(new int[]{0,0});
        dist[0][0] = 0;
        while (!q.isEmpty()) {
            int[] cur = q.remove();
            int r = cur[0], c = cur[1];
            if (r == rows-1 && c == cols-1) return dist[r][c];
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                        && grid[nr][nc] == 0 && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    q.add(new int[]{nr,nc});
                }
            }
        }
        return -1;
    }
}
`,
      bugs: {
        20: { was: 'grid[nr][nc] == 0', buggy: '                        && grid[nr][nc] == 1 && dist[nr][nc] == -1) {' },
      },
    },
    python: {
      correct: `
from collections import deque

def shortest_grid_path(grid):
    rows, cols = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[-1][-1] == 1:
        return -1
    dist = [[-1] * cols for _ in range(rows)]
    dist[0][0] = 0
    q = deque([(0, 0)])
    directions = [(-1,0),(1,0),(0,-1),(0,1)]
    while q:
        r, c = q.popleft()
        if (r, c) == (rows - 1, cols - 1):
            return dist[r][c]
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                if grid[nr][nc] == 0 and dist[nr][nc] == -1:
                    dist[nr][nc] = dist[r][c] + 1
                    q.append((nr, nc))
    return -1
`,
      bugs: {
        18: { was: 'grid[nr][nc] == 0', buggy: '                if grid[nr][nc] == 1 and dist[nr][nc] == -1:' },
      },
    },
    c: {
      correct: `
int shortest_grid_path(int* grid, int rows, int cols) {
    if (grid[0] == 1 || grid[rows*cols-1] == 1) return -1;
    int* dist = malloc(rows * cols * sizeof(int));
    int* queue = malloc(rows * cols * sizeof(int));
    for (int i = 0; i < rows*cols; i++) dist[i] = -1;
    int front = 0, back = 0;
    queue[back++] = 0;
    dist[0] = 0;
    int dr[4] = {-1,1,0,0}, dc[4] = {0,0,-1,1};
    while (front < back) {
        int u = queue[front++];
        int r = u / cols, c = u % cols;
        if (u == rows*cols-1) break;
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                int v = nr * cols + nc;
                if (grid[v] == 0 && dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue[back++] = v;
                }
            }
        }
    }
    int answer = dist[rows*cols-1];
    free(dist); free(queue);
    return answer;
}
`,
      bugs: {
        18: { was: 'grid[v] == 0', buggy: '                if (grid[v] == 1 && dist[v] == -1) {' },
      },
    },
  },
});
