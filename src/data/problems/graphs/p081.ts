import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p081',
  title: 'The island grows twice',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Grid Components',
  tags: ['Graph', 'Grid', 'BFS'],
  bugCategory: 'Incorrect Graph Visited-state Handling',
  sourceInspiredBy: 'Counting connected land regions in a binary grid',
  description:
    'Return the number of connected regions of 1s in a grid. The search marks the wrong cell as visited while exploring.',
  constraints: ['1 <= rows, cols <= 100', 'Grid values are 0 or 1'],
  examples: [
    { input: 'grid = [[1,1],[1,1]]', output: '1' },
  ],
  hints: ['Trace the visited flags after the first cell is processed.', 'A neighbour should be marked before it is queued.'],
  complexity: { time: 'O(rows * cols)', space: 'O(rows * cols)' },
  explanation: {
    overview: 'Count connected components of 1s in a grid.',
    algorithm: 'Scan the grid. When an unvisited 1 is found, run BFS, mark discovered neighbours, and count the region once.',
    bug: 'The BFS marks the current cell visited instead of the neighbour being enqueued.',
    whyItFails: 'Some cells remain unvisited after the first region is explored, so the outer scan starts a new region for them and overcounts.',
    failingTestCase: 'For a 2x2 block of 1s, the code returns 2 instead of 1.',
    fix: 'Mark seen[nr][nc] when enqueueing the neighbour.',
    whyFixWorks: 'Every cell in the region is marked before it can be discovered again.',
    dryRun: 'The first BFS starts at (0,0). It marks (0,0) repeatedly while enqueueing neighbours. Cell (1,1) is never marked. The outer scan later starts a second region at (1,1).',
    debuggingLesson: 'In BFS, mark a vertex when it enters the queue, not when it is removed or when its parent is processed.',
  },
  testCases: [
    { input: '[[1,1],[1,1]]', expected: '1', buggyOutput: '2' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.print(Solution.numIslands(new int[][]{{1,1},{1,1}}));`,
      python: `print(num_islands([[1,1],[1,1]]))`,
      c: `printf("%d", num_islands((int[][4]){{1,1,0,0},{1,1,0,0}}, 2, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int numIslands(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        boolean[][] seen = new boolean[rows][cols];
        int count = 0;
        int[] dr = {1, -1, 0, 0};
        int[] dc = {0, 0, 1, -1};
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == 1 && !seen[i][j]) {
                    count++;
                    int[][] q = new int[rows * cols][2];
                    int head = 0, tail = 0;
                    q[tail][0] = i; q[tail][1] = j; tail++;
                    seen[i][j] = true;
                    while (head < tail) {
                        int r = q[head][0], c = q[head][1]; head++;
                        for (int d = 0; d < 4; d++) {
                            int nr = r + dr[d], nc = c + dc[d];
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1 && !seen[nr][nc]) {
                                seen[nr][nc] = true;
                                q[tail][0] = nr; q[tail][1] = nc; tail++;
                            }
                        }
                    }
                }
            }
        }
        return count;
    }
}
`,
      bugs: { 21: { was: 'seen[nr][nc] = true', buggy: 'seen[r][c] = true;' } },
    },
    python: {
      correct: `
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    seen = [[False] * cols for _ in range(rows)]
    count = 0
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 1 and not seen[i][j]:
                count += 1
                q = [(i, j)]
                seen[i][j] = True
                head = 0
                while head < len(q):
                    r, c = q[head]
                    head += 1
                    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1 and not seen[nr][nc]:
                            seen[nr][nc] = True
                            q.append((nr, nc))
    return count
`,
      bugs: { 18: { was: 'seen[nr][nc] = True', buggy: 'seen[r][c] = True' } },
    },
    c: {
      correct: `
int num_islands(int grid[][4], int rows, int cols) {
    int seen[10][10] = {0};
    int count = 0;
    int dr[4] = {1, -1, 0, 0};
    int dc[4] = {0, 0, 1, -1};
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (grid[i][j] == 1 && !seen[i][j]) {
                count++;
                int qr[100], qc[100];
                int head = 0, tail = 0;
                qr[tail] = i; qc[tail] = j; tail++;
                seen[i][j] = 1;
                while (head < tail) {
                    int r = qr[head], c = qc[head]; head++;
                    for (int d = 0; d < 4; d++) {
                        int nr = r + dr[d], nc = c + dc[d];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1 && !seen[nr][nc]) {
                            seen[nr][nc] = 1;
                            qr[tail] = nr; qc[tail] = nc; tail++;
                        }
                    }
                }
            }
        }
    }
    return count;
}
`,
      bugs: { 19: { was: 'seen[nr][nc] = 1', buggy: 'seen[r][c] = 1;' } },
    },
  },
});
