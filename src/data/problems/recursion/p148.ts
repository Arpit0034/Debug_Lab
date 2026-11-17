import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p148',
  title: 'The digit sum stops too early',
  difficulty: 'Easy',
  topic: 'Recursion',
  subtopic: 'Recursive Digit Processing',
  tags: ['Recursion', 'Digits', 'Base Case'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Sum of digits using recursion',
  description: 'Return the sum of the decimal digits of a non-negative integer.',
  constraints: ['0 <= n <= 10^9'],
  examples: [{ input: '482', output: '14' }, { input: '0', output: '0' }],
  hints: ['Reduce the number on each recursive call.', 'Check the smallest input separately.'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
  explanation: {
    overview: 'Add all decimal digits of the input.',
    algorithm: 'Use the last digit and recursively process the remaining prefix.',
    bug: 'The base case returns the remaining single digit without adding it.',
    whyItFails: 'For multi-digit values, the final digit is dropped.',
    failingTestCase: '482 becomes 4 + 8 but omits 2 under the mutation.',
    fix: 'Use zero as the stopping case so the last digit is processed by the normal expression.',
    whyFixWorks: 'Every digit contributes exactly once.',
    dryRun: '482 -> 48 + 2; 48 -> 4 + 8; 4 -> 0 + 4.',
    debuggingLesson: 'A recursive base case must preserve the contribution of the smallest remaining input.'
  },
  testCases: [{ input: '482', expected: '14', buggyOutput: '12' }],
  harness: { expected: '14', driver: { java: 'System.out.print(Solution.digitSum(482));', python: 'print(digit_sum(482))', c: 'printf("%d", digit_sum(482));' } },
  code: {
    java: { correct: `
class Solution {
    static int digitSum(int n) {
        if (n == 0) return 0;
        return n % 10 + digitSum(n / 10);
    }
}
`, bugs: { 3: { was: 'if (n == 0) return 0;', buggy: 'if (n < 10) return 0;' } } },
    python: { correct: `
def digit_sum(n):
    if n == 0:
        return 0
    return n % 10 + digit_sum(n // 10)
`, bugs: { 2: { was: 'if n == 0:', buggy: 'if n < 10:' } } },
    c: { correct: `
int digit_sum(int n) {
    if (n == 0) return 0;
    return n % 10 + digit_sum(n / 10);
}
`, bugs: { 2: { was: 'if (n == 0) return 0;', buggy: 'if (n < 10) return 0;' } } }
  }
});
