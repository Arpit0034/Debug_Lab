import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p146',
  title: 'Memo pad stores one step less',
  difficulty: 'Easy',
  topic: 'Dynamic Programming',
  subtopic: 'Memoized Stair Counting',
  tags: ['Memoization', 'Recursion', 'Counting'],
  bugCategory: 'Incorrect Memoization',
  sourceInspiredBy: 'Climbing stairs memoization pattern',
  description:
    'Return the number of ways to climb n steps when each move is 1 or 2 steps. The memoized solution stores an incorrect value for larger n.',
  constraints: ['1 <= n <= 30'],
  examples: [
    { input: 'n = 5', output: '8' },
    { input: 'n = 6', output: '13' },
  ],
  hints: ['Trace what gets written into the cache for n = 3.', 'Compare the cached value for n = 3 with the expected value.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Count ordered ways to reach exactly n steps using moves of size 1 or 2.',
    algorithm: 'Use the recurrence ways(n) = ways(n - 1) + ways(n - 2), with base cases 1 and 2, and cache computed values.',
    bug: 'The cached value is reduced by 1 before it is stored.',
    whyItFails: 'Every cached result is one less than the true count, so all later results built from it are also too small.',
    failingTestCase: 'n = 5: the code prints 4 instead of 8.',
    fix: 'Store the sum without subtracting 1.',
    whyFixWorks: 'The recurrence counts both last moves, so the stored value must be exactly the sum of the two smaller answers.',
    dryRun: 'n = 3 gives 2 + 1 - 1 = 2 instead of 3. n = 4 gives 2 + 2 - 1 = 3 instead of 5. n = 5 gives 3 + 2 - 1 = 4 instead of 8.',
    debuggingLesson: 'When a recursive result is cached, compare the cached value against the recurrence before trusting later calls.',
  },
  testCases: [{ input: '5', expected: '8' }],
  harness: {
    expected: '8 13',
    driver: {
      java: `System.out.println(Solution.climbStairs(5) + " " + Solution.climbStairs(6));`,
      python: `print(climb_stairs(5), climb_stairs(6))`,
      c: `printf("%d %d", climb_stairs(5), climb_stairs(6));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int climb(int n, int[] memo) {
        if (n <= 2) {
            return n;
        }
        if (memo[n] != 0) {
            return memo[n];
        }
        memo[n] = climb(n - 1, memo) + climb(n - 2, memo);
        return memo[n];
    }
    static int climbStairs(int n) {
        int[] memo = new int[n + 1];
        return climb(n, memo);
    }
}
`,
      bugs: { 9: { was: 'memo[n] = climb(n - 1, memo) + climb(n - 2, memo)', buggy: 'memo[n] = climb(n - 1, memo) + climb(n - 2, memo) - 1;' } },
    },
    python: {
      correct: `
def climb(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 2:
        return n
    if n in memo:
        return memo[n]
    memo[n] = climb(n - 1, memo) + climb(n - 2, memo)
    return memo[n]

def climb_stairs(n):
    return climb(n)
`,
      bugs: { 8: { was: 'memo[n] = climb(n - 1, memo) + climb(n - 2, memo)', buggy: 'memo[n] = climb(n - 1, memo) + climb(n - 2, memo) - 1' } },
    },
    c: {
      correct: `
int climb(int n, int memo[]) {
    if (n <= 2) {
        return n;
    }
    if (memo[n] != 0) {
        return memo[n];
    }
    memo[n] = climb(n - 1, memo) + climb(n - 2, memo);
    return memo[n];
}
int climb_stairs(int n) {
    int memo[100] = {0};
    return climb(n, memo);
}
`,
      bugs: { 8: { was: 'memo[n] = climb(n - 1, memo) + climb(n - 2, memo)', buggy: 'memo[n] = climb(n - 1, memo) + climb(n - 2, memo) - 1;' } },
    },
  },
});
