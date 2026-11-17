import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p176',
  title: 'The last job is never assigned',
  difficulty: 'Hard',
  topic: 'Dynamic Programming',
  subtopic: 'Bitmask Assignment',
  tags: ['Assignment', 'Bitmask', 'DP'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Minimum-cost assignment with subset states pattern',
  description:
    'Assign every person to one distinct job and return the minimum total cost. The last job is never considered.',
  constraints: ['1 <= n <= 8', 'cost is an n by n matrix'],
  examples: [
    { input: 'cost = [[1,2],[3,4]]', output: '5' },
    { input: 'cost = [[5]]', output: '5' },
  ],
  hints: ['Each job can be used at most once.', 'Check whether the job loop includes every possible job index.'],
  complexity: { time: 'O(n * 2^n)', space: 'O(2^n)' },
  explanation: {
    overview: 'Choose one distinct job per person with minimum total cost.',
    algorithm: 'For each set of used jobs, try assigning the next person every unused job and keep the best total.',
    bug: 'The job loop stops before the final job index.',
    whyItFails: 'Some assignments can only be completed by using the last job, so those states stay unreachable.',
    failingTestCase: 'For a two-person example, the best total is 5, but the last job is never tried and the answer becomes an enormous sentinel value.',
    fix: 'Loop through all job indices, including n - 1.',
    whyFixWorks: 'Every job must be available as a candidate for every still-unassigned person.',
    dryRun: 'With two jobs, the code only tries job 0. Person 0 takes job 0, then person 1 has no legal job left, so the full state is never reached.',
    debuggingLesson: 'For assignment loops, verify that all candidate indices are visited exactly once.',
  },
  testCases: [
    { input: '[[1,2],[3,4]]', expected: '5', buggyOutput: '1000000000' },
  ],
  harness: {
    expected: '5',
    driver: {
      java: `System.out.println(Solution.minCost(new int[][]{{1,2},{3,4}}));`,
      python: `print(min_cost([[1,2],[3,4]]))`,
      c: `int c[2][2]={{1,2},{3,4}}; printf("%d", min_cost(c,2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int minCost(int[][] c) {
        int n = c.length;
        int total = 1 << n;
        int inf = 1000000000;
        int[] dp = new int[total];
        for (int m = 1; m < total; m++) dp[m] = inf;
        for (int m = 0; m < total; m++) {
            int i = Integer.bitCount(m);
            for (int j = 0; j < n; j++) {
                if ((m & (1 << j)) == 0) {
                    int nm = m | (1 << j);
                    dp[nm] = Math.min(dp[nm], dp[m] + c[i][j]);
                }
            }
        }
        return dp[total - 1];
    }
}
`,
      bugs: { 10: { was: 'for (int j = 0; j < n; j++) {', buggy: 'for (int j = 0; j < n - 1; j++) {' } },
    },
    python: {
      correct: `
def min_cost(c):
    n = len(c)
    total = 1 << n
    inf = 10 ** 9
    dp = [inf] * total
    dp[0] = 0
    for m in range(total):
        i = bin(m).count('1')
        for j in range(n):
            if (m & (1 << j)) == 0:
                nm = m | (1 << j)
                dp[nm] = min(dp[nm], dp[m] + c[i][j])
    return dp[total - 1]
`,
      bugs: { 9: { was: 'for j in range(n):', buggy: 'for j in range(n - 1):' } },
    },
    c: {
      correct: `
int min_cost(int c[][2], int n) {
    int total = 1 << n;
    int inf = 1000000000;
    int dp[4];
    for (int m = 0; m < total; m++) dp[m] = inf;
    dp[0] = 0;
    for (int m = 0; m < total; m++) {
        int i = __builtin_popcount(m);
        for (int j = 0; j < n; j++) {
            if ((m & (1 << j)) == 0) {
                int nm = m | (1 << j);
                int v = dp[m] + c[i][j];
                if (v < dp[nm]) dp[nm] = v;
            }
        }
    }
    return dp[total - 1];
}
`,
      bugs: { 9: { was: 'for (int j = 0; j < n; j++) {', buggy: 'for (int j = 0; j < n - 1; j++) {' } },
    },
  },
});
