import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p192',
  title: 'Combination order flips around',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Coin Change Ways',
  tags: ['Coins', 'Counting', 'DP'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Coin change combinations pattern',
  description:
    'Return how many different combinations of coins add up to an amount. The code undercounts because it processes amounts in the reverse direction.',
  constraints: ['1 <= coins <= 20', '1 <= amount <= 1000'],
  examples: [
    { input: 'coins = [1,2], amount = 3', output: '2' },
    { input: 'coins = [2], amount = 4', output: '1' },
  ],
  hints: ['Each coin should be able to be reused many times.', 'Check the direction in which the amount loop runs.'],
  complexity: { time: 'O(coins * amount)', space: 'O(amount)' },
  explanation: {
    overview: 'Count unordered combinations of coins that make an amount.',
    algorithm: 'Process one coin at a time and update amounts from smaller to larger so the coin can be reused.',
    bug: 'The amount loop runs from large to small.',
    whyItFails: 'Descending order prevents a coin from being reused within the same pass, turning the problem into a subset count.',
    failingTestCase: 'For coins [1,2] and amount 3, the correct count is 2 but the code returns 1.',
    fix: 'Iterate amounts from the coin value upward.',
    whyFixWorks: 'Ascending order lets a value already updated with the current coin be used again for a larger amount.',
    dryRun: 'With coin 1, ascending order makes amount 1, then 2, then 3 reachable. Descending order only makes amount 1 reachable before moving on.',
    debuggingLesson: 'When unlimited reuse is allowed, check the direction of the inner state loop.',
  },
  testCases: [
    { input: '[1,2], 3', expected: '2', buggyOutput: '1' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.ways(new int[]{1,2}, 3));`,
      python: `print(ways([1,2], 3))`,
      c: `printf("%d", ways((int[]){1,2}, 2, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int ways(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int coin : coins) {
            for (int a = coin; a <= amount; a++) {
                dp[a] += dp[a - coin];
            }
        }
        return dp[amount];
    }
}
`,
      bugs: { 6: { was: 'for (int a = coin; a <= amount; a++) {', buggy: 'for (int a = amount; a >= coin; a--) {' } },
    },
    python: {
      correct: `
def ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    return dp[amount]
`,
      bugs: { 5: { was: 'for a in range(coin, amount + 1):', buggy: 'for a in range(amount, coin - 1, -1):' } },
    },
    c: {
      correct: `
int ways(int coins[], int n, int amount) {
    int dp[100] = {0};
    dp[0] = 1;
    for (int i = 0; i < n; i++) {
        for (int a = coins[i]; a <= amount; a++) {
            dp[a] += dp[a - coins[i]];
        }
    }
    return dp[amount];
}
`,
      bugs: { 5: { was: 'for (int a = coins[i]; a <= amount; a++) {', buggy: 'for (int a = amount; a >= coins[i]; a--) {' } },
    },
  },
});
