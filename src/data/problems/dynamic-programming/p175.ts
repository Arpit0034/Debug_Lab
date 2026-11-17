import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p175',
  title: 'An exact half is missed',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Equal Sum Partition',
  tags: ['Partition', 'Subset Sum', 'DP'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Partition into equal-sum subsets pattern',
  description:
    'Return whether the numbers can be split into two groups with equal totals. The code fails when one number exactly fills the target total.',
  constraints: ['1 <= n <= 100', '1 <= value <= 100'],
  examples: [
    { input: 'nums = [2, 2, 2, 2]', output: 'true' },
    { input: 'nums = [1, 2, 4]', output: 'false' },
  ],
  hints: ['The target total is half of the whole sum.', 'When updating possible totals, do not skip the total equal to the current number.'],
  complexity: { time: 'O(n * sum)', space: 'O(sum)' },
  explanation: {
    overview: 'Decide whether some subset adds up to exactly half of the total.',
    algorithm: 'Update reachable totals from high to low so each number is used at most once.',
    bug: 'The update loop stops just before the current number itself.',
    whyItFails: 'A total equal to the current number is a valid reachable state and can enable later combinations.',
    failingTestCase: 'For [2,2,2,2], the target is 4. The code never reaches the state equal to 2, so it reports false instead of true.',
    fix: 'Include the total equal to the current number by using a greater-than-or-equal comparison.',
    whyFixWorks: 'This lets a number create the state equal to its own value, which is needed for exact matches.',
    dryRun: 'With [2,2,2,2], the first two 2s should make total 4 reachable. Because the bug skips the state 2, the state 4 is never formed and the answer becomes false.',
    debuggingLesson: 'In subset-style updates, the current item must be allowed to fill a total equal to its own value.',
  },
  testCases: [
    { input: '[2,2,2,2]', expected: '1', buggyOutput: '0' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.can(new int[]{2,2,2,2}) ? 1 : 0);`,
      python: `print(int(can([2,2,2,2])))`,
      c: `printf("%d", can((int[]){2,2,2,2}, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean can(int[] a) {
        int sum = 0;
        for (int x : a) sum += x;
        if (sum % 2 != 0) return false;
        int t = sum / 2;
        boolean[] dp = new boolean[t + 1];
        dp[0] = true;
        for (int x : a) {
            for (int s = t; s >= x; s--) {
                dp[s] = dp[s] || dp[s - x];
            }
        }
        return dp[t];
    }
}
`,
      bugs: { 10: { was: 'for (int s = t; s >= x; s--) {', buggy: 'for (int s = t; s > x; s--) {' } },
    },
    python: {
      correct: `
def can(a):
    s = sum(a)
    if s % 2 != 0:
        return False
    t = s // 2
    dp = [False] * (t + 1)
    dp[0] = True
    for x in a:
        for v in range(t, x - 1, -1):
            dp[v] = dp[v] or dp[v - x]
    return dp[t]
`,
      bugs: { 9: { was: 'for v in range(t, x - 1, -1):', buggy: 'for v in range(t, x, -1):' } },
    },
    c: {
      correct: `
int can(int a[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) sum += a[i];
    if (sum % 2 != 0) return 0;
    int t = sum / 2;
    int dp[100] = {0};
    dp[0] = 1;
    for (int i = 0; i < n; i++) {
        for (int s = t; s >= a[i]; s--) {
            dp[s] = dp[s] || dp[s - a[i]];
        }
    }
    return dp[t];
}
`,
      bugs: { 9: { was: 'for (int s = t; s >= a[i]; s--) {', buggy: 'for (int s = t; s > a[i]; s--) {' } },
    },
  },
});
