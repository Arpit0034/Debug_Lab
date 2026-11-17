import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p172',
  title: 'The first two values swap roles',
  difficulty: 'Medium',
  topic: 'Recursion',
  subtopic: 'Fibonacci Base Cases',
  tags: ['Recursion', 'Fibonacci', 'Base Case'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Fibonacci recurrence pattern',
  description:
    'Return the n-th value of a sequence where each value is the sum of the previous two. The first values are reported incorrectly.',
  constraints: ['0 <= n <= 20'],
  examples: [
    { input: 'n = 5', output: '5' },
    { input: 'n = 0', output: '0' },
  ],
  hints: ['Check the very first two answers before any addition happens.', 'A base value should be returned unchanged.'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
  explanation: {
    overview: 'Generate the sequence by adding the previous two values.',
    algorithm: 'Return n directly for the first two positions; otherwise add the two preceding results.',
    bug: 'Every base position returns 1, so position zero is wrong and later values shift upward.',
    whyItFails: 'The base values are not both one. Position zero must remain zero.',
    failingTestCase: 'fib(0) returns 1 and fib(5) returns 8 instead of 5.',
    fix: 'Return n for the base positions.',
    whyFixWorks: 'This preserves both seed values: zero stays zero and one stays one.',
    dryRun: 'With the bug, fib(0)=1 and fib(1)=1. Then fib(2)=2, fib(3)=3, fib(4)=5, fib(5)=8, but the correct fifth value is 5.',
    debuggingLesson: 'Verify every seed value separately before trusting the recurrence.',
  },
  testCases: [
    { input: '0 and 5', expected: '0 5', buggyOutput: '1 8' },
  ],
  harness: {
    expected: '0 5',
    driver: {
      java: `System.out.println(Solution.fib(0) + " " + Solution.fib(5));`,
      python: `print(fib(0), fib(5))`,
      c: `printf("%d %d", fib(0), fib(5));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int fib(int n) {
        if (n <= 1) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }
}
`,
      bugs: { 4: { was: 'return n;', buggy: 'return 1;' } },
    },
    python: {
      correct: `
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
`,
      bugs: { 3: { was: 'return n', buggy: 'return 1' } },
    },
    c: {
      correct: `
int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}
`,
      bugs: { 3: { was: 'return n;', buggy: 'return 1;' } },
    },
  },
});
