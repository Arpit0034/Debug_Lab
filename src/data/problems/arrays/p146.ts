import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p146',
  title: 'The second-largest value disappears',
  difficulty: 'Easy',
  topic: 'Arrays',
  subtopic: 'Second Distinct Maximum',
  tags: ['Array', 'Distinct Values', 'Scan'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Finding the second distinct largest array value',
  description: 'Return the second-largest distinct value in an integer array. Return -1 when fewer than two distinct values exist.',
  constraints: ['1 <= n <= 100000', '-10^9 <= values[i] <= 10^9'],
  examples: [{ input: '[8, 3, 8, 5]', output: '5' }, { input: '[4, 4, 4]', output: '-1' }],
  hints: ['Consider what should happen when a new maximum is found.', 'Equal values should not occupy both result positions.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Track the largest and second-largest distinct values.',
    algorithm: 'Scan once while maintaining two candidate values and updating them when a larger distinct value appears.',
    bug: 'The second candidate is updated even when the current value equals the maximum.',
    whyItFails: 'A repeated maximum can be treated as the second distinct value.',
    failingTestCase: '[8, 3, 8, 5] can incorrectly return 8.',
    fix: 'Require the current value to be strictly smaller than the maximum before assigning it as the second candidate.',
    whyFixWorks: 'The two stored values remain distinct.',
    dryRun: 'After reading 8, max is 8. The next 3 becomes second. The repeated 8 must not replace second.',
    debuggingLesson: 'When a task says distinct, equality needs an explicit policy.'
  },
  testCases: [{ input: '[8,3,8,5]', expected: '5', buggyOutput: '8' }],
  harness: { expected: '5', driver: { java: 'System.out.print(Solution.secondLargest(new int[]{8,3,8,5}));', python: 'print(second_largest([8,3,8,5]))', c: 'printf("%d", second_largest((int[]){8,3,8,5}, 4));' } },
  code: {
    java: { correct: `
class Solution {
    static int secondLargest(int[] a) {
        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
        for (int x : a) {
            if (x > first) {
                second = first;
                first = x;
            } else if (x > second && x < first) {
                second = x;
            }
        }
        return second == Integer.MIN_VALUE ? -1 : second;
    }
}
`, bugs: { 8: { was: 'x < first', buggy: '} else if (x > second && x <= first) {' } } },
    python: { correct: `
def second_largest(a):
    first = second = float('-inf')
    for x in a:
        if x > first:
            second, first = first, x
        elif x > second and x < first:
            second = x
    return -1 if second == float('-inf') else second
`, bugs: { 6: { was: 'x < first', buggy: 'elif x > second and x <= first:' } } },
    c: { correct: `
int second_largest(int a[], int n) {
    int first = -2147483647, second = -2147483647;
    for (int i = 0; i < n; i++) {
        int x = a[i];
        if (x > first) { second = first; first = x; }
        else if (x > second && x < first) second = x;
    }
    return second == -2147483647 ? -1 : second;
}
`, bugs: { 6: { was: 'x < first', buggy: 'else if (x > second && x <= first) second = x;' } } }
  }
});
