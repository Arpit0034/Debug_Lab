import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p191',
  title: 'The last unit of capacity is ignored',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Zero-One Knapsack',
  tags: ['Knapsack', 'Capacity', 'DP'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: '0/1 knapsack tabulation pattern',
  description:
    'Return the maximum value obtainable with a weight limit, where each item can be chosen at most once. The exact capacity limit is never filled.',
  constraints: ['1 <= items <= 50', '1 <= capacity <= 100'],
  examples: [
    { input: 'weights = [1,3,4], values = [15,20,30], capacity = 4', output: '35' },
    { input: 'weights = [2], values = [5], capacity = 2', output: '5' },
  ],
  hints: ['A state must exist for every capacity including the limit.', 'Check the upper bound of the capacity loop.'],
  complexity: { time: 'O(n * capacity)', space: 'O(n * capacity)' },
  explanation: {
    overview: 'Choose items to maximize value without exceeding a weight limit.',
    algorithm: 'For each item and capacity, either skip the item or include it if it fits.',
    bug: 'The capacity loop stops before the maximum capacity.',
    whyItFails: 'The final column of the table is never filled, so the answer at the exact limit remains zero.',
    failingTestCase: 'For weights [1,3,4], values [15,20,30], capacity 4, the correct answer is 35 but the code returns 0.',
    fix: 'Include capacity equal to the limit in the loop.',
    whyFixWorks: 'Every capacity up to and including the limit must be computed.',
    dryRun: 'With capacity 4, the code fills capacities 1 through 3. The result at capacity 4 stays zero instead of 35.',
    debuggingLesson: 'For one-dimensional limits, verify the table includes the exact upper bound.',
  },
  testCases: [
    { input: '[1,3,4], [15,20,30], 4', expected: '35', buggyOutput: '0' },
  ],
  harness: {
    expected: '35',
    driver: {
      java: `System.out.println(Solution.knap(new int[]{1,3,4}, new int[]{15,20,30}, 4));`,
      python: `print(knap([1,3,4], [15,20,30], 4))`,
      c: `printf("%d", knap((int[]){1,3,4}, (int[]){15,20,30}, 3, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int knap(int[] w, int[] v, int cap) {
        int n = w.length;
        int[][] dp = new int[n + 1][cap + 1];
        for (int i = 1; i <= n; i++) {
            for (int c = 1; c <= cap; c++) {
                if (w[i - 1] <= c) {
                    dp[i][c] = Math.max(dp[i - 1][c], v[i - 1] + dp[i - 1][c - w[i - 1]]);
                } else {
                    dp[i][c] = dp[i - 1][c];
                }
            }
        }
        return dp[n][cap];
    }
}
`,
      bugs: { 6: { was: 'for (int c = 1; c <= cap; c++) {', buggy: 'for (int c = 1; c < cap; c++) {' } },
    },
    python: {
      correct: `
def knap(w, v, cap):
    n = len(w)
    dp = [[0] * (cap + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for c in range(1, cap + 1):
            if w[i - 1] <= c:
                dp[i][c] = max(dp[i - 1][c], v[i - 1] + dp[i - 1][c - w[i - 1]])
            else:
                dp[i][c] = dp[i - 1][c]
    return dp[n][cap]
`,
      bugs: { 5: { was: 'for c in range(1, cap + 1):', buggy: 'for c in range(1, cap):' } },
    },
    c: {
      correct: `
int knap(int w[], int v[], int n, int cap) {
    int dp[20][20] = {0};
    for (int i = 1; i <= n; i++) {
        for (int c = 1; c <= cap; c++) {
            if (w[i - 1] <= c) {
                int a = dp[i - 1][c];
                int b = v[i - 1] + dp[i - 1][c - w[i - 1]];
                dp[i][c] = a > b ? a : b;
            } else {
                dp[i][c] = dp[i - 1][c];
            }
        }
    }
    return dp[n][cap];
}
`,
      bugs: { 4: { was: 'for (int c = 1; c <= cap; c++) {', buggy: 'for (int c = 1; c < cap; c++) {' } },
    },
  },
});
