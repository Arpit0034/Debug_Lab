import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p174',
  title: 'A blocked square is walked through',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Grid Paths with Obstacles',
  tags: ['Grid', 'Paths', 'Obstacles'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Count paths in a grid with blocked cells pattern',
  description:
    'Return how many routes move only right and down from the top-left cell to the bottom-right cell. Some cells are blocked.',
  constraints: ['1 <= rows, cols <= 20', 'Blocked cells are marked 1, open cells 0'],
  examples: [
    { input: 'grid = [[0,0],[0,0]]', output: '2' },
    { input: 'grid = [[0,0,0],[0,1,0],[0,0,0]]', output: '2' },
  ],
  hints: ['Count routes into each cell from above and from the left.', 'A blocked cell must contribute zero routes.'],
  complexity: { time: 'O(rows * cols)', space: 'O(rows * cols)' },
  explanation: {
    overview: 'Count routes through a grid while respecting blocked cells.',
    algorithm: 'Build a table of route counts cell by cell, adding the counts from the top and left.',
    bug: 'The blocked-cell check tests for value 2 instead of value 1.',
    whyItFails: 'Cells marked as blocked are treated as open, so routes illegally pass through walls.',
    failingTestCase: 'For a 3 by 3 grid with the centre blocked, the correct count is 2 but the code returns 6.',
    fix: 'Check whether the cell equals 1 and set its route count to zero.',
    whyFixWorks: 'A blocked cell has no valid incoming routes, so it must not pass counts onward.',
    dryRun: 'The open 3 by 3 grid has 6 routes. With the centre blocked, only the top-right and bottom-left routes survive, giving 2; the bug ignores the centre block and returns 6.',
    debuggingLesson: 'When a table stores counts, verify that forbidden states are explicitly zeroed.',
  },
  testCases: [
    { input: '3 by 3 grid with centre 1', expected: '2', buggyOutput: '6' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `int[][] g={{0,0,0},{0,1,0},{0,0,0}}; System.out.println(Solution.paths(g));`,
      python: `print(paths([[0,0,0],[0,1,0],[0,0,0]]))`,
      c: `int g[3][3]={{0,0,0},{0,1,0},{0,0,0}}; printf("%d", paths(g,3,3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int paths(int[][] g) {
        int n = g.length;
        int m = g[0].length;
        int[][] dp = new int[n][m];
        dp[0][0] = 1;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (g[i][j] == 1) {
                    dp[i][j] = 0;
                    continue;
                }
                if (i > 0) {
                    dp[i][j] += dp[i - 1][j];
                }
                if (j > 0) {
                    dp[i][j] += dp[i][j - 1];
                }
            }
        }
        return dp[n - 1][m - 1];
    }
}
`,
      bugs: { 9: { was: 'if (g[i][j] == 1) {', buggy: 'if (g[i][j] == 2) {' } },
    },
    python: {
      correct: `
def paths(g):
    n = len(g)
    m = len(g[0])
    dp = [[0] * m for _ in range(n)]
    dp[0][0] = 1
    for i in range(n):
        for j in range(m):
            if g[i][j] == 1:
                dp[i][j] = 0
                continue
            if i > 0:
                dp[i][j] += dp[i - 1][j]
            if j > 0:
                dp[i][j] += dp[i][j - 1]
    return dp[n - 1][m - 1]
`,
      bugs: { 8: { was: 'if g[i][j] == 1:', buggy: 'if g[i][j] == 2:' } },
    },
    c: {
      correct: `
int paths(int g[][3], int n, int m) {
    int dp[10][10] = {0};
    dp[0][0] = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (g[i][j] == 1) {
                dp[i][j] = 0;
                continue;
            }
            if (i > 0) {
                dp[i][j] += dp[i - 1][j];
            }
            if (j > 0) {
                dp[i][j] += dp[i][j - 1];
            }
        }
    }
    return dp[n - 1][m - 1];
}
`,
      bugs: { 6: { was: 'if (g[i][j] == 1) {', buggy: 'if (g[i][j] == 2) {' } },
    },
  },
});
