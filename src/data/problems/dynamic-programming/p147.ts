import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p147',
  title: 'Neighbouring houses keep adding together',
  difficulty: 'Easy',
  topic: 'Dynamic Programming',
  subtopic: 'Non-adjacent Sum',
  tags: ['Houses', 'Non-adjacent', 'Transition'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'House robber linear DP pattern',
  description:
    'Return the largest total that can be collected from a row of values when no two chosen positions may be adjacent.',
  constraints: ['1 <= n <= 100000', 'Values are non-negative'],
  examples: [
    { input: 'a = [2, 7, 9, 3, 1]', output: '12' },
    { input: 'a = [5, 1, 1, 5]', output: '10' },
  ],
  hints: ['Compare the two previous totals used when skipping and when taking the current value.', 'Trace the first three values by hand.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Choose a maximum-value subset with no two adjacent indices.',
    algorithm: 'Keep the best total up to two positions back and one position back. At each value, either skip it or add it to the total from two positions back.',
    bug: 'Taking the current value adds it to the immediately previous total instead of the total from two positions back.',
    whyItFails: 'That reuses an adjacent position, which is forbidden, and inflates the answer.',
    failingTestCase: 'a = [2, 7, 9, 3, 1]: the code prints 22 instead of 12.',
    fix: 'Use the total from two positions back when taking the current value.',
    whyFixWorks: 'The two-back total excludes the immediately previous index, so adding the current index remains valid.',
    dryRun: 'For [2, 7, 9, 3, 1], the wrong transition gives totals 2, 9, 18, 21, 22. The correct totals are 2, 7, 11, 11, 12.',
    debuggingLesson: 'In adjacent-exclusion problems, check exactly which previous state is safe to combine with the current item.',
  },
  testCases: [{ input: '[2, 7, 9, 3, 1]', expected: '12' }],
  harness: {
    expected: '12 10',
    driver: {
      java: `System.out.println(Solution.rob(new int[]{2, 7, 9, 3, 1}) + " " + Solution.rob(new int[]{5, 1, 1, 5}));`,
      python: `print(rob([2, 7, 9, 3, 1]), rob([5, 1, 1, 5]))`,
      c: `printf("%d %d", rob((int[]){2, 7, 9, 3, 1}, 5), rob((int[]){5, 1, 1, 5}, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int rob(int[] a) {
        int prev2 = 0;
        int prev1 = 0;
        for (int i = 0; i < a.length; i++) {
            int cur = Math.max(prev1, prev2 + a[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
`,
      bugs: { 6: { was: 'Math.max(prev1, prev2 + a[i])', buggy: 'int cur = Math.max(prev1, prev1 + a[i]);' } },
    },
    python: {
      correct: `
def rob(a):
    prev2 = 0
    prev1 = 0
    for x in a:
        cur = max(prev1, prev2 + x)
        prev2 = prev1
        prev1 = cur
    return prev1
`,
      bugs: { 5: { was: 'max(prev1, prev2 + x)', buggy: 'cur = max(prev1, prev1 + x)' } },
    },
    c: {
      correct: `
int rob(int a[], int n) {
    int prev2 = 0;
    int prev1 = 0;
    for (int i = 0; i < n; i++) {
        int cur = prev1 > prev2 + a[i] ? prev1 : prev2 + a[i];
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}
`,
      bugs: { 6: { was: 'prev2 + a[i]', buggy: 'int cur = prev1 > prev1 + a[i] ? prev1 : prev1 + a[i];' } },
    },
  },
});
