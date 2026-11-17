import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p159',
  title: 'Last split point is never tried',
  difficulty: 'Hard',
  topic: 'Dynamic Programming',
  subtopic: 'Matrix Chain Cost',
  tags: ['Chain', 'Cost', 'Splits'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Matrix chain multiplication interval DP pattern',
  description:
    'Return the minimum scalar multiplication cost of multiplying a chain of matrices described by dimension boundaries.',
  constraints: ['2 <= dimensions <= 20', 'Dimensions are positive'],
  examples: [
    { input: 'd = [10,20,30]', output: '6000' },
  ],
  hints: ['Check every possible split between the start and end of an interval.', 'Trace the interval that contains two matrices.'],
  complexity: { time: 'O(n^3)', space: 'O(n^2)' },
  explanation: {
    overview: 'Find the cheapest order to parenthesize a matrix chain.',
    algorithm: 'For every interval length, try each split point and combine the left cost, right cost and multiplication cost.',
    bug: 'The split loop stops before the final valid split.',
    whyItFails: 'For a two-matrix chain the only split is skipped, so the interval cost remains a large sentinel.',
    failingTestCase: 'd = [10,20,30]: the code prints 1000000000 instead of 6000.',
    fix: 'Let the split loop include k equal to j - 1.',
    whyFixWorks: 'The final split is valid and is needed especially for small intervals.',
    dryRun: 'With dimensions 10, 20, 30, the only split gives 10*20*30 = 6000. The wrong loop tries no split.',
    debuggingLesson: 'In interval DP over split points, check that the last possible split inside the interval is included.',
  },
  testCases: [{ input: '[10,20,30]', expected: '6000' }],
  harness: {
    expected: '6000',
    driver: {
      java: `System.out.println(Solution.matrixChain(new int[]{10,20,30}));`,
      python: `print(matrix_chain([10,20,30]))`,
      c: `printf("%d", matrix_chain((int[]){10,20,30}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int matrixChain(int[] d) {
        int n = d.length - 1;
        int[][] dp = new int[n + 1][n + 1];
        for (int len = 2; len <= n; len++) {
            for (int i = 1; i <= n - len + 1; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k + 1][j] + d[i - 1] * d[k] * d[j];
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                    }
                }
            }
        }
        return dp[1][n];
    }
}
`,
      bugs: { 11: { was: 'k < j', buggy: 'for (int k = i; k < j - 1; k++) {' } },
    },
    python: {
      correct: `
def matrix_chain(d):
    n = len(d) - 1
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for length in range(2, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            dp[i][j] = 10 ** 9
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + d[i - 1] * d[k] * d[j]
                if cost < dp[i][j]:
                    dp[i][j] = cost
    return dp[1][n]
`,
      bugs: { 9: { was: 'range(i, j)', buggy: 'for k in range(i, j - 1):' } },
    },
    c: {
      correct: `
int matrix_chain(int d[], int m) {
    int n = m - 1;
    int dp[20][20] = {0};
    for (int len = 2; len <= n; len++) {
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            dp[i][j] = 1000000000;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j] + d[i - 1] * d[k] * d[j];
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                }
            }
        }
    }
    return dp[1][n];
}
`,
      bugs: { 9: { was: 'k < j', buggy: 'for (int k = i; k < j - 1; k++) {' } },
    },
  },
});
