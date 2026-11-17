import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p177',
  title: 'The two-step start is ignored',
  difficulty: 'Easy',
  topic: 'Dynamic Programming',
  subtopic: 'Memoized Stair Count',
  tags: ['Memoization', 'Counting', 'Base Case'],
  bugCategory: 'Incorrect Memoization',
  sourceInspiredBy: 'Climbing stairs with memoization pattern',
  description:
    'Return how many ways there are to reach step n by taking one or two steps at a time. The count for a two-step start is wrong.',
  constraints: ['1 <= n <= 30'],
  examples: [
    { input: 'n = 2', output: '2' },
    { input: 'n = 5', output: '8' },
  ],
  hints: ['The first few answers are not all handled by the same rule.', 'Check what happens when n equals two.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Count ways to reach a step using one-step and two-step moves.',
    algorithm: 'Stop early for the first two steps, and otherwise combine the two previous answers while caching results.',
    bug: 'The early return only handles n less than two, so n equal to two falls into the general recurrence.',
    whyItFails: 'When n is two, the general recurrence depends on step zero, which is not part of the intended count.',
    failingTestCase: 'For n = 2 the correct answer is 2, but the code returns 1; later values also shift.',
    fix: 'Handle n less than or equal to two in the early return.',
    whyFixWorks: 'The two-step case has two valid ways and must not be decomposed further.',
    dryRun: 'With the bug, climb(2) becomes climb(1)+climb(0)=1+0=1. The correct value is 2. Then climb(5) becomes 5 instead of 8.',
    debuggingLesson: 'A memoized function still needs every base case checked before caching or recurrence.',
  },
  testCases: [
    { input: '2 and 5', expected: '2 8', buggyOutput: '1 5' },
  ],
  harness: {
    expected: '2 8',
    driver: {
      java: `System.out.println(Solution.climb(2, new int[6]) + " " + Solution.climb(5, new int[6]));`,
      python: `print(climb(2, [0]*6), climb(5, [0]*6))`,
      c: `int m1[6]={0}; int m2[6]={0}; printf("%d %d", climb(2,m1), climb(5,m2));`,
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
}
`,
      bugs: { 3: { was: 'if (n <= 2) {', buggy: 'if (n < 2) {' } },
    },
    python: {
      correct: `
def climb(n, memo):
    if n <= 2:
        return n
    if memo[n] != 0:
        return memo[n]
    memo[n] = climb(n - 1, memo) + climb(n - 2, memo)
    return memo[n]
`,
      bugs: { 2: { was: 'if n <= 2:', buggy: 'if n < 2:' } },
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
`,
      bugs: { 2: { was: 'if (n <= 2) {', buggy: 'if (n < 2) {' } },
    },
  },
});
