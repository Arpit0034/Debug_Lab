import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p179',
  title: 'The final balloon is left unpopped',
  difficulty: 'Hard',
  topic: 'Dynamic Programming',
  subtopic: 'Interval DP',
  tags: ['Intervals', 'DP', 'Maximization'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Burst balloons interval pattern',
  description:
    'Choose the order of popping balloons to maximize the total reward. The last possible split point in each interval is skipped.',
  constraints: ['1 <= n <= 30', '0 <= value <= 100'],
  examples: [
    { input: 'values = [3,1,5]', output: '35' },
    { input: 'values = [1]', output: '1' },
  ],
  hints: ['For an interval, every balloon can be the final one popped.', 'Check whether the inner candidate loop includes the right endpoint.'],
  complexity: { time: 'O(n^3)', space: 'O(n^2)' },
  explanation: {
    overview: 'Maximize the reward from popping all balloons, where a pop earns the product of itself and its two current neighbours.',
    algorithm: 'For each interval, try each balloon as the final one popped and combine the best left and right subinterval results.',
    bug: 'The candidate loop excludes the right endpoint of the interval.',
    whyItFails: 'When the final balloon of an interval is the rightmost one, that choice is never considered, so the interval score is too low.',
    failingTestCase: 'For [3,1,5], the correct maximum is 35 but the bug returns 4.',
    fix: 'Let the candidate loop include the right endpoint.',
    whyFixWorks: 'Every balloon inside the interval must be allowed to be the final pop.',
    dryRun: 'For a single balloon interval, excluding the right endpoint leaves no candidate and the interval score stays zero. Later intervals inherit these wrong zeroes.',
    debuggingLesson: 'In interval enumeration, test intervals of length one before trusting larger intervals.',
  },
  testCases: [
    { input: '[3,1,5]', expected: '35', buggyOutput: '4' },
  ],
  harness: {
    expected: '35',
    driver: {
      java: `System.out.println(Solution.coins(new int[]{3,1,5}));`,
      python: `print(coins([3,1,5]))`,
      c: `printf("%d", coins((int[]){3,1,5}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int coins(int[] nums) {
        int n = nums.length;
        int[] a = new int[n + 2];
        a[0] = 1;
        a[n + 1] = 1;
        for (int i = 0; i < n; i++) a[i + 1] = nums[i];
        int[][] dp = new int[n + 2][n + 2];
        for (int len = 1; len <= n; len++) {
            for (int i = 1; i <= n - len + 1; i++) {
                int j = i + len - 1;
                for (int k = i; k <= j; k++) {
                    int v = dp[i][k - 1] + dp[k + 1][j] + a[i - 1] * a[k] * a[j + 1];
                    if (v > dp[i][j]) dp[i][j] = v;
                }
            }
        }
        return dp[1][n];
    }
}
`,
      bugs: { 12: { was: 'for (int k = i; k <= j; k++) {', buggy: 'for (int k = i; k < j; k++) {' } },
    },
    python: {
      correct: `
def coins(nums):
    n = len(nums)
    a = [1] + nums + [1]
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    for length in range(1, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            for k in range(i, j + 1):
                v = dp[i][k - 1] + dp[k + 1][j] + a[i - 1] * a[k] * a[j + 1]
                dp[i][j] = max(dp[i][j], v)
    return dp[1][n]
`,
      bugs: { 8: { was: 'for k in range(i, j + 1):', buggy: 'for k in range(i, j):' } },
    },
    c: {
      correct: `
int coins(int nums[], int n) {
    int a[20];
    a[0] = 1;
    a[n + 1] = 1;
    for (int i = 0; i < n; i++) a[i + 1] = nums[i];
    int dp[20][20] = {0};
    for (int len = 1; len <= n; len++) {
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            for (int k = i; k <= j; k++) {
                int v = dp[i][k - 1] + dp[k + 1][j] + a[i - 1] * a[k] * a[j + 1];
                if (v > dp[i][j]) dp[i][j] = v;
            }
        }
    }
    return dp[1][n];
}
`,
      bugs: { 10: { was: 'for (int k = i; k <= j; k++) {', buggy: 'for (int k = i; k < j; k++) {' } },
    },
  },
});
