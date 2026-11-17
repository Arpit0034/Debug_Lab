import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p187',
  title: 'The top row forgets earlier cells',
  difficulty: 'Easy',
  topic: 'Dynamic Programming',
  subtopic: 'Grid Minimum Path Sum',
  tags: ['Grid', 'Path Sum', 'DP'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Minimum path sum in a grid pattern',
  description:
    'Return the smallest sum along a route that moves only right and down from the top-left to the bottom-right. The first row is initialized incorrectly.',
  constraints: ['1 <= rows, cols <= 20', 'Values are non-negative'],
  examples: [
    { input: 'grid = [[1,2,3],[4,5,6]]', output: '12' },
    { input: 'grid = [[1,2],[3,4]]', output: '7' },
  ],
  hints: ['A cell in the first row has only one possible predecessor.', 'Each later first-row cell should include the sum before it.'],
  complexity: { time: 'O(rows * cols)', space: 'O(rows * cols)' },
  explanation: {
    overview: 'Find the cheapest route through a grid using right and down moves.',
    algorithm: 'Fill the first row and column cumulatively, then combine the best of the top and left neighbours for every other cell.',
    bug: 'The first row is set directly to the cell value, losing the cumulative sum from the left.',
    whyItFails: 'A cell in the first row can only be reached by moving right, so it must include every earlier cell in that row.',
    failingTestCase: 'For [[1,2,3],[4,5,6]], the correct sum is 12 but the code returns 9.',
    fix: 'Add the previous first-row cell when initializing the current first-row cell.',
    whyFixWorks: 'This keeps the running sum along the only possible path in the first row.',
    dryRun: 'Correct first row sums are 1, 3, 6. The bug makes them 1, 2, 3. Later cells then compare against a too-small top value and return 9.',
    debuggingLesson: 'For boundary rows and columns, verify that cumulative initialization matches the allowed moves.',
  },
  testCases: [
    { input: '[[1,2,3],[4,5,6]]', expected: '12', buggyOutput: '9' },
  ],
  harness: {
    expected: '12',
    driver: {
      java: `int[][] g={{1,2,3},{4,5,6}}; System.out.println(Solution.minPath(g));`,
      python: `print(min_path([[1,2,3],[4,5,6]]))`,
      c: `int g[2][3]={{1,2,3},{4,5,6}}; printf("%d", min_path(g,2,3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int minPath(int[][] g) {
        int n = g.length;
        int m = g[0].length;
        int[][] dp = new int[n][m];
        dp[0][0] = g[0][0];
        for (int i = 1; i < n; i++) dp[i][0] = dp[i - 1][0] + g[i][0];
        for (int j = 1; j < m; j++) {
            dp[0][j] = dp[0][j - 1] + g[0][j];
        }
        for (int i = 1; i < n; i++) {
            for (int j = 1; j < m; j++) {
                dp[i][j] = g[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[n - 1][m - 1];
    }
}
`,
      bugs: { 9: { was: 'dp[0][j] = dp[0][j - 1] + g[0][j];', buggy: 'dp[0][j] = g[0][j];' } },
    },
    python: {
      correct: `
def min_path(g):
    n = len(g)
    m = len(g[0])
    dp = [[0] * m for _ in range(n)]
    dp[0][0] = g[0][0]
    for i in range(1, n):
        dp[i][0] = dp[i - 1][0] + g[i][0]
    for j in range(1, m):
        dp[0][j] = dp[0][j - 1] + g[0][j]
    for i in range(1, n):
        for j in range(1, m):
            dp[i][j] = g[i][j] + min(dp[i - 1][j], dp[i][j - 1])
    return dp[n - 1][m - 1]
`,
      bugs: { 9: { was: 'dp[0][j] = dp[0][j - 1] + g[0][j]', buggy: 'dp[0][j] = g[0][j]' } },
    },
    c: {
      correct: `
int min_path(int g[][3], int n, int m) {
    int dp[20][20];
    dp[0][0] = g[0][0];
    for (int i = 1; i < n; i++) dp[i][0] = dp[i - 1][0] + g[i][0];
    for (int j = 1; j < m; j++) dp[0][j] = dp[0][j - 1] + g[0][j];
    for (int i = 1; i < n; i++) {
        for (int j = 1; j < m; j++) {
            int up = dp[i - 1][j];
            int left = dp[i][j - 1];
            dp[i][j] = g[i][j] + (up < left ? up : left);
        }
    }
    return dp[n - 1][m - 1];
}
`,
      bugs: { 5: { was: 'for (int j = 1; j < m; j++) dp[0][j] = dp[0][j - 1] + g[0][j];', buggy: 'for (int j = 1; j < m; j++) dp[0][j] = g[0][j];' } },
    },
  },
});
