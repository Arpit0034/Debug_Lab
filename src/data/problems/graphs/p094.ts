import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p094',
  title: 'The shortest path rejects new cells',
  difficulty: 'Hard',
  topic: 'Graphs',
  subtopic: 'Grid Shortest Path',
  tags: ['Graph', 'Grid', 'BFS'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Shortest path in a binary grid with four-direction movement',
  description:
    'Return the length of the shortest path from the top-left to the bottom-right of a grid. The search admits only cells that have already been visited.',
  constraints: ['1 <= rows, cols <= 100', '0 is open, 1 is blocked'],
  examples: [
    { input: 'grid = [[0,0,0],[0,0,0],[0,0,0]]', output: '4' },
  ],
  hints: ['A newly reached cell should have distance -1 before it is added.', 'The condition deciding whether to enqueue a neighbour is inverted.'],
  complexity: { time: 'O(rows * cols)', space: 'O(rows * cols)' },
  explanation: {
    overview: 'Find the shortest path length in an open grid with blocked cells.',
    algorithm: 'Use BFS from the start, storing distances. Enqueue an open neighbour only if it has not been visited yet.',
    bug: 'The neighbour condition checks dist[nr][nc] != -1 instead of == -1.',
    whyItFails: 'Unvisited cells have distance -1, so they are rejected. Already visited cells are enqueued instead, and the target is never reached.',
    failingTestCase: 'For a 3x3 all-open grid, the code returns -1 instead of 4.',
    fix: 'Enqueue only when dist[nr][nc] == -1.',
    whyFixWorks: 'This adds each reachable cell exactly once and explores the grid normally.',
    dryRun: 'Start at (0,0) with distance 0. Its neighbours have distance -1. The buggy != -1 check is false, so none are queued. BFS stops immediately and returns -1.',
    debuggingLesson: 'In BFS, the unvisited condition must match the chosen sentinel value exactly.',
  },
  testCases: [
    { input: '[[0,0,0],[0,0,0],[0,0,0]]', expected: '4', buggyOutput: '-1' },
  ],
  harness: {
    expected: '4',
    driver: {
      java: `System.out.print(Solution.shortestPath(new int[][]{{0,0,0},{0,0,0},{0,0,0}}));`,
      python: `print(shortest_path([[0,0,0],[0,0,0],[0,0,0]]))`,
      c: `printf("%d", shortest_grid((int[][3]){{0,0,0},{0,0,0},{0,0,0}}, 3, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int shortestPath(int[][] grid) {
        int n = grid.length, m = grid[0].length;
        int[][] dist = new int[n][m];
        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) dist[i][j] = -1;
        int[] qr = new int[n * m];
        int[] qc = new int[n * m];
        int head = 0, tail = 0;
        qr[tail] = 0; qc[tail] = 0; tail++;
        dist[0][0] = 0;
        int[] dr = {1, -1, 0, 0};
        int[] dc = {0, 0, 1, -1};
        while (head < tail) {
            int r = qr[head], c = qc[head]; head++;
            if (r == n - 1 && c == m - 1) return dist[r][c];
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] == 0 && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    qr[tail] = nr; qc[tail] = nc; tail++;
                }
            }
        }
        return -1;
    }
}
`,
      bugs: { 18: { was: 'dist[nr][nc] == -1', buggy: 'if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] == 0 && dist[nr][nc] != -1) {' } },
    },
    python: {
      correct: `
def shortest_path(grid):
    n, m = len(grid), len(grid[0])
    dist = [[-1] * m for _ in range(n)]
    q = [(0, 0)]
    dist[0][0] = 0
    head = 0
    dr = (1, -1, 0, 0)
    dc = (0, 0, 1, -1)
    while head < len(q):
        r, c = q[head]
        head += 1
        if r == n - 1 and c == m - 1:
            return dist[r][c]
        for d in range(4):
            nr, nc = r + dr[d], c + dc[d]
            if 0 <= nr < n and 0 <= nc < m and grid[nr][nc] == 0 and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))
    return -1
`,
      bugs: { 16: { was: 'dist[nr][nc] == -1', buggy: 'if 0 <= nr < n and 0 <= nc < m and grid[nr][nc] == 0 and dist[nr][nc] != -1:' } },
    },
    c: {
      correct: `
int shortest_grid(int grid[][3], int n, int m) {
    int dist[10][10];
    for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) dist[i][j] = -1;
    int qr[100], qc[100];
    int head = 0, tail = 0;
    qr[tail] = 0; qc[tail] = 0; tail++;
    dist[0][0] = 0;
    int dr[4] = {1, -1, 0, 0};
    int dc[4] = {0, 0, 1, -1};
    while (head < tail) {
        int r = qr[head], c = qc[head]; head++;
        if (r == n - 1 && c == m - 1) return dist[r][c];
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] == 0 && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[r][c] + 1;
                qr[tail] = nr; qc[tail] = nc; tail++;
            }
        }
    }
    return -1;
}
`,
      bugs: { 15: { was: 'dist[nr][nc] == -1', buggy: 'if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] == 0 && dist[nr][nc] != -1) {' } },
    },
  },
});
