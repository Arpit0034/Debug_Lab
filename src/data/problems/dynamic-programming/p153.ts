import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p153',
  title: 'Blocked cell is treated as open ground',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Grid Paths with Blocks',
  tags: ['Grid', 'Obstacles', 'Paths'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Unique paths with obstacles pattern',
  description:
    'Return the number of monotone paths from the top-left to the bottom-right cell of a grid where marked cells are blocked.',
  constraints: ['1 <= rows, cols <= 100', 'Cells contain 0 for open and 1 for blocked'],
  examples: [
    { input: 'grid = [[0,0,0],[0,1,0],[0,0,0]]', output: '2' },
  ],
  hints: ['Check which cell value is supposed to stop a path.', 'Trace the centre cell of the example grid.'],
  complexity: { time: 'O(rows * cols)', space: 'O(rows * cols)' },
  explanation: {
    overview: 'Count right and down paths that avoid blocked cells.',
    algorithm: 'Fill a table where a blocked cell has zero ways and other cells sum the ways from the top and left.',
    bug: 'The blocked-cell check compares against 2 instead of 1.',
    whyItFails: 'Blocked cells are treated as open, so paths pass through them and the count is too high.',
    failingTestCase: 'grid with a single centre block: the code prints 6 instead of 2.',
    fix: 'Compare the cell value with 1.',
    whyFixWorks: 'The intended blocked marker then forces zero ways at that cell.',
    dryRun: 'On a 3 by 3 grid with the centre blocked, the correct count is 2. Ignoring the block allows all 6 monotone paths.',
    debuggingLesson: 'When a grid uses sentinel values, confirm that the comparison uses the actual blocked marker.',
  },
  testCases: [{ input: '[[0,0,0],[0,1,0],[0,0,0]]', expected: '2' }],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.uniquePaths(new int[][]{{0,0,0},{0,1,0},{0,0,0}}));`,
      python: `print(unique_paths([[0,0,0],[0,1,0],[0,0,0]]))`,
      c: `printf("%d", unique_paths((int[][3]){{0,0,0},{0,1,0},{0,0,0}}, 3, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int uniquePaths(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        int[][] dp = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    dp[i][j] = 0;
                } else if (i == 0 && j == 0) {
                    dp[i][j] = 1;
                } else {
                    int up = i > 0 ? dp[i - 1][j] : 0;
                    int left = j > 0 ? dp[i][j - 1] : 0;
                    dp[i][j] = up + left;
                }
            }
        }
        return dp[m - 1][n - 1];
    }
}
`,
      bugs: { 9: { was: 'grid[i][j] == 1', buggy: 'if (grid[i][j] == 2) {' } },
    },
    python: {
      correct: `
def unique_paths(grid):
    m = len(grid)
    n = len(grid[0])
    dp = [[0] * n for _ in range(m)]
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[i][j] = 0
            elif i == 0 and j == 0:
                dp[i][j] = 1
            else:
                up = dp[i - 1][j] if i > 0 else 0
                left = dp[i][j - 1] if j > 0 else 0
                dp[i][j] = up + left
    return dp[m - 1][n - 1]
`,
      bugs: { 7: { was: 'grid[i][j] == 1', buggy: 'if grid[i][j] == 2:' } },
    },
    c: {
      correct: `
int unique_paths(int grid[][3], int m, int n) {
    int dp[10][10] = {0};
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 1) {
                dp[i][j] = 0;
            } else if (i == 0 && j == 0) {
                dp[i][j] = 1;
            } else {
                int up = i > 0 ? dp[i - 1][j] : 0;
                int left = j > 0 ? dp[i][j - 1] : 0;
                dp[i][j] = up + left;
            }
        }
    }
    return dp[m - 1][n - 1];
}
`,
      bugs: { 5: { was: 'grid[i][j] == 1', buggy: 'if (grid[i][j] == 2) {' } },
    },
  },
});
