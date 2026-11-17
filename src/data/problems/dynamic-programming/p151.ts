import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p151',
  title: 'Equal heights are treated as a climb',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Increasing Sequence',
  tags: ['Sequence', 'Strictness', 'Duplicates'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Longest increasing subsequence O(n^2) pattern',
  description:
    'Return the length of the longest strictly increasing subsequence of the given numbers.',
  constraints: ['1 <= n <= 1000', 'Values may repeat'],
  examples: [
    { input: 'a = [1,1,1]', output: '1' },
  ],
  hints: ['Decide whether equal values may extend a subsequence.', 'Trace the comparison used when the previous value equals the current value.'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  explanation: {
    overview: 'Find the longest subsequence whose values strictly increase from left to right.',
    algorithm: 'For each ending position, check all earlier positions and extend the best length only when the earlier value is strictly smaller.',
    bug: 'The comparison allows equal values to extend the subsequence.',
    whyItFails: 'A sequence containing equal values is not strictly increasing, so the reported length can grow using duplicates.',
    failingTestCase: 'a = [1,1,1]: the code prints 3 instead of 1.',
    fix: 'Use a strict less-than comparison.',
    whyFixWorks: 'Equal values are then rejected, preserving the strict-increase requirement.',
    dryRun: 'With the wrong comparison, each 1 extends the previous 1, giving lengths 1, 2, 3. The correct lengths are 1, 1, 1.',
    debuggingLesson: 'For order-based subsequences, test whether the condition must be strict or non-strict with repeated values.',
  },
  testCases: [{ input: '[1,1,1]', expected: '1' }],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.lis(new int[]{1,1,1}));`,
      python: `print(lis([1,1,1]))`,
      c: `printf("%d", lis((int[]){1,1,1}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int lis(int[] a) {
        int n = a.length;
        int[] dp = new int[n];
        int best = 0;
        for (int i = 0; i < n; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) {
                if (a[j] < a[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            best = Math.max(best, dp[i]);
        }
        return best;
    }
}
`,
      bugs: { 10: { was: 'a[j] < a[i]', buggy: 'if (a[j] <= a[i]) {' } },
    },
    python: {
      correct: `
def lis(a):
    n = len(a)
    dp = [1] * n
    best = 0
    for i in range(n):
        for j in range(i):
            if a[j] < a[i]:
                dp[i] = max(dp[i], dp[j] + 1)
        best = max(best, dp[i])
    return best
`,
      bugs: { 7: { was: 'a[j] < a[i]', buggy: 'if a[j] <= a[i]:' } },
    },
    c: {
      correct: `
int lis(int a[], int n) {
    int dp[100];
    int best = 0;
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i]) {
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                }
            }
        }
        if (dp[i] > best) {
            best = dp[i];
        }
    }
    return best;
}
`,
      bugs: { 8: { was: 'a[j] < a[i]', buggy: 'if (a[j] <= a[i]) {' } },
    },
  },
});
