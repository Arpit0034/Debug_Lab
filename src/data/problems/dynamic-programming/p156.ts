import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p156',
  title: 'Cache check reads empty slots as answers',
  difficulty: 'Easy',
  topic: 'Dynamic Programming',
  subtopic: 'Memoized Fibonacci',
  tags: ['Memoization', 'Fibonacci', 'Cache'],
  bugCategory: 'Incorrect Memoization',
  sourceInspiredBy: 'Fibonacci memoization pattern',
  description:
    'Return the nth Fibonacci number where F(0) = 0 and F(1) = 1. The memoized code returns a wrong value because of its cache check.',
  constraints: ['0 <= n <= 30'],
  examples: [
    { input: 'n = 5', output: '5' },
  ],
  hints: ['Check what the cache contains before a value has been computed.', 'Trace the first call with n = 5.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Compute Fibonacci numbers efficiently by caching previously computed values.',
    algorithm: 'Use recursion with base cases 0 and 1 and store each computed result in an array initialized to -1.',
    bug: 'The cache check returns a value when the slot is still -1.',
    whyItFails: 'Uncomputed slots are mistaken for valid answers, so the function immediately returns -1.',
    failingTestCase: 'n = 5: the code prints -1 instead of 5.',
    fix: 'Return a cached value only when the slot is not -1.',
    whyFixWorks: 'The function then computes missing values and caches them before returning.',
    dryRun: 'For n = 5, memo[5] is -1. The wrong check sees -1 and returns it immediately, so the answer is -1.',
    debuggingLesson: 'When using sentinel values in a cache, test the condition against the sentinel in the correct direction.',
  },
  testCases: [{ input: '5', expected: '5' }],
  harness: {
    expected: '5',
    driver: {
      java: `System.out.println(Solution.fibonacci(5));`,
      python: `print(fibonacci(5))`,
      c: `printf("%d", fibonacci(5));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static int fib(int n, int[] memo) {
        if (n <= 1) {
            return n;
        }
        if (memo[n] != -1) {
            return memo[n];
        }
        memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
        return memo[n];
    }
    static int fibonacci(int n) {
        int[] memo = new int[n + 1];
        Arrays.fill(memo, -1);
        return fib(n, memo);
    }
}
`,
      bugs: { 7: { was: 'memo[n] != -1', buggy: 'if (memo[n] == -1) {' } },
    },
    python: {
      correct: `
def fib(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if memo.get(n, -1) != -1:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

def fibonacci(n):
    return fib(n)
`,
      bugs: { 6: { was: 'memo.get(n, -1) != -1', buggy: 'if memo.get(n, -1) == -1:' } },
    },
    c: {
      correct: `
int fib(int n, int memo[]) {
    if (n <= 1) {
        return n;
    }
    if (memo[n] != -1) {
        return memo[n];
    }
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}
int fibonacci(int n) {
    int memo[100];
    for (int i = 0; i <= n; i++) {
        memo[i] = -1;
    }
    return fib(n, memo);
}
`,
      bugs: { 5: { was: 'memo[n] != -1', buggy: 'if (memo[n] == -1) {' } },
    },
  },
});
