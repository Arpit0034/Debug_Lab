import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p155',
  title: 'Perfect square is not allowed as a move',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Square Sum Minimum',
  tags: ['Squares', 'Minimum Count', 'Loop Bound'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Perfect squares minimum count pattern',
  description:
    'Return the minimum number of perfect-square values whose sum equals n.',
  constraints: ['1 <= n <= 10000'],
  examples: [
    { input: 'n = 4', output: '1' },
  ],
  hints: ['Check whether the square equal to the current number is included.', 'Trace the inner loop when i is a perfect square.'],
  complexity: { time: 'O(n * sqrt(n))', space: 'O(n)' },
  explanation: {
    overview: 'Represent n as a sum of as few perfect squares as possible.',
    algorithm: 'For every value up to n, try every square not exceeding it and keep the smallest previous count plus one.',
    bug: 'The inner square loop excludes squares equal to the current value.',
    whyItFails: 'When the number itself is a perfect square, the best one-move answer is missed.',
    failingTestCase: 'n = 4: the code prints 4 instead of 1.',
    fix: 'Include the square equal to the current value in the loop.',
    whyFixWorks: 'The state with one perfect square is then considered, giving the correct minimum.',
    dryRun: 'For n = 4, the wrong loop tries only 1. The answer becomes 3 + 1 = 4. The correct loop also tries 4 and gets 1.',
    debuggingLesson: 'In loops over candidate squares, include the equality case when the candidate can exactly equal the target.',
  },
  testCases: [{ input: '4', expected: '1' }],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.numSquares(4));`,
      python: `print(num_squares(4))`,
      c: `printf("%d", num_squares(4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int numSquares(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            dp[i] = i;
            for (int j = 1; j <= (int)Math.sqrt(i); j++) {
                dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
            }
        }
        return dp[n];
    }
}
`,
      bugs: { 7: { was: 'j <= (int)Math.sqrt(i)', buggy: 'for (int j = 1; j < (int)Math.sqrt(i); j++) {' } },
    },
    python: {
      correct: `
def num_squares(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = i
        for j in range(1, int(i ** 0.5) + 1):
            dp[i] = min(dp[i], dp[i - j * j] + 1)
    return dp[n]
`,
      bugs: { 5: { was: 'range(1, int(i ** 0.5) + 1)', buggy: 'for j in range(1, int(i ** 0.5)):' } },
    },
    c: {
      correct: `
int num_squares(int n) {
    int dp[1000] = {0};
    for (int i = 1; i <= n; i++) {
        dp[i] = i;
        for (int j = 1; j * j <= i; j++) {
            int cand = dp[i - j * j] + 1;
            if (cand < dp[i]) {
                dp[i] = cand;
            }
        }
    }
    return dp[n];
}
`,
      bugs: { 5: { was: 'j * j <= i', buggy: 'for (int j = 1; j * j < i; j++) {' } },
    },
  },
});
