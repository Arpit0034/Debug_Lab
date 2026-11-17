import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p149',
  title: 'The reversed number loses its trailing zeroes',
  difficulty: 'Medium',
  topic: 'Basic Mathematics',
  subtopic: 'Integer Reversal',
  tags: ['Math', 'Modulo', 'Overflow'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Reversing decimal digits of an integer',
  description: 'Reverse the decimal digits of a non-negative integer and return the resulting integer.',
  constraints: ['0 <= n <= 10^9'],
  examples: [{ input: '1200', output: '21' }, { input: '507', output: '705' }],
  hints: ['The last digit can be separated from the remaining prefix.', 'Leading zeroes in the result do not change its numeric value.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Construct the number formed by reading the digits in reverse order.',
    algorithm: 'Repeatedly take the final digit and append it to the result.',
    bug: 'The result is initialized with the original input instead of zero.',
    whyItFails: 'The original digits remain in the accumulator and contaminate the reversed value.',
    failingTestCase: '1200 does not produce 21 when the accumulator starts at 1200.',
    fix: 'Initialize the accumulator to zero.',
    whyFixWorks: 'Only extracted digits are appended to the result.',
    dryRun: 'Start result=0; take 0, then 0, then 2, then 1 to build 21.',
    debuggingLesson: 'Accumulator initialization is part of the algorithm, not a cosmetic detail.'
  },
  testCases: [{ input: '1200', expected: '21' }],
  harness: { expected: '21', driver: { java: 'System.out.print(Solution.reverseNumber(1200));', python: 'print(reverse_number(1200))', c: 'printf("%d", reverse_number(1200));' } },
  code: {
    java: { correct: `
class Solution {
    static int reverseNumber(int n) {
        int result = 0;
        while (n > 0) {
            result = result * 10 + n % 10;
            n /= 10;
        }
        return result;
    }
}
`, bugs: { 3: { was: 'int result = 0;', buggy: 'int result = n;' } } },
    python: { correct: `
def reverse_number(n):
    result = 0
    while n > 0:
        result = result * 10 + n % 10
        n //= 10
    return result
`, bugs: { 2: { was: 'result = 0', buggy: 'result = n' } } },
    c: { correct: `
int reverse_number(int n) {
    int result = 0;
    while (n > 0) {
        result = result * 10 + n % 10;
        n /= 10;
    }
    return result;
}
`, bugs: { 2: { was: 'int result = 0;', buggy: 'int result = n;' } } }
  }
});
