import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p148',
  title: 'Last column is left blank',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Grid Path Cost',
  tags: ['Grid', 'Minimum Cost', 'Loop Bound'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Minimum path sum grid pattern',
  description:
    'Return the minimum total cost of a path from the top-left cell to the bottom-right cell, moving only right or down.',
  constraints: ['1 <= rows, cols <= 100', 'Costs are non-negative'],
  examples: [
    { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7' },
  ],
  hints: ['Check whether the final column of the grid is ever updated.', 'Trace the nested loop range for a 3 by 3 grid.'],
  complexity: { time: 'O(rows * cols)', space: 'O(rows * cols)' },
  explanation: {
    overview: 'Compute the cheapest monotone path through a cost grid.',
    algorithm: 'Fill the first row and first column, then compute each cell as its cost plus the smaller of the top and left neighbours.',
    bug: 'The inner loop stops one column before the last column.',
    whyItFails: 'The bottom-right cell is never assigned its real value, so the returned value is wrong.',
    failingTestCase: 'grid = [[1,3,1],[1,5,1],[4,2,1]]: the code prints 0 instead of 7.',
    fix: 'Run the inner loop while j is less than n.',
    whyFixWorks: 'Every column from 1 through n - 1 is then filled, including the destination column.',
    dryRun: 'For a 3 by 3 grid, the wrong inner loop only visits j = 1. Cells in column 2 remain 0, including the answer cell.',
    debuggingLesson: 'For grid transitions, verify that both boundary rows and boundary columns include their final indices.',
  },
  testCases: [{ input: '[[1,3,1],[1,5,1],[4,2,1]]', expected: '7' }],
  harness: {
    expected: '7',
    driver: {
      java: `System.out.println(Solution.minPath(new int[][]{{1,3,1},{1,5,1},{4,2,1}}));`,
      python: `print(min_path([[1,3,1],[1,5,1],[4,2,1]]))`,
      c: `printf("%d", min_path((int[][3]){{1,3,1},{1,5,1},{4,2,1}}, 3, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int minPath(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        int[][] dp = new int[m][n];
        dp[0][0] = grid[0][0];
        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        }
        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j - 1] + grid[0][j];
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[m - 1][n - 1];
    }
}
`,
      bugs: { 14: { was: 'for (int j = 1; j < n; j++)', buggy: 'for (int j = 1; j < n - 1; j++) {' } },
    },
    python: {
      correct: `
def min_path(grid):
    m = len(grid)
    n = len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] + grid[i][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] + grid[0][j]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])
    return dp[m - 1][n - 1]
`,
      bugs: { 11: { was: 'for j in range(1, n):', buggy: 'for j in range(1, n - 1):' } },
    },
    c: {
      correct: `
int min_path(int grid[][3], int m, int n) {
    int dp[10][10] = {0};
    dp[0][0] = grid[0][0];
    for (int i = 1; i < m; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    }
    for (int j = 1; j < n; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j];
    }
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            int a = dp[i - 1][j];
            int b = dp[i][j - 1];
            dp[i][j] = grid[i][j] + (a < b ? a : b);
        }
    }
    return dp[m - 1][n - 1];
}
`,
      bugs: { 11: { was: 'for (int j = 1; j < n; j++)', buggy: 'for (int j = 1; j < n - 1; j++) {' } },
    },
  },
});
