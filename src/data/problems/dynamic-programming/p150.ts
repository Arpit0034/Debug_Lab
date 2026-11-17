import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p150',
  title: 'Single-coin combination is not counted',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Coin Change Ways',
  tags: ['Coins', 'Combinations', 'Loop Bound'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Coin change combinations pattern',
  description:
    'Return how many different combinations of the given coin values can add up to the target amount. Coins may be reused.',
  constraints: ['1 <= coins.length <= 20', '0 <= amount <= 5000'],
  examples: [
    { input: 'coins = [1,2,5], amount = 5', output: '4' },
  ],
  hints: ['Check whether using only one coin of a denomination can form the amount.', 'Trace the inner loop start for the coin value 5.'],
  complexity: { time: 'O(n * amount)', space: 'O(amount)' },
  explanation: {
    overview: 'Count coin combinations that produce the target sum.',
    algorithm: 'Process each coin and update a one-dimensional count table from that coin value up to the amount.',
    bug: 'The inner loop starts one past the coin value.',
    whyItFails: 'A combination that uses exactly one coin equal to the amount is skipped, and other combinations may also be undercounted.',
    failingTestCase: 'coins = [1,2,5], amount = 5: the code prints 2 instead of 4.',
    fix: 'Start the inner loop at the coin value itself.',
    whyFixWorks: 'The state for using one coin exactly is included, so the count for that denomination is correct.',
    dryRun: 'With the wrong start, coin 5 never updates the amount 5, and coin 1 misses its first update. The final count becomes 2 instead of 4.',
    debuggingLesson: 'For unbounded combination loops, check the first index where the current item alone is a valid state.',
  },
  testCases: [{ input: '[1,2,5], 5', expected: '4' }],
  harness: {
    expected: '4',
    driver: {
      java: `System.out.println(Solution.countWays(new int[]{1,2,5}, 5));`,
      python: `print(count_ways([1,2,5], 5))`,
      c: `printf("%d", count_ways((int[]){1,2,5}, 3, 5));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int countWays(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int i = 0; i < coins.length; i++) {
            for (int x = coins[i]; x <= amount; x++) {
                dp[x] += dp[x - coins[i]];
            }
        }
        return dp[amount];
    }
}
`,
      bugs: { 7: { was: 'for (int x = coins[i]; x <= amount; x++)', buggy: 'for (int x = coins[i] + 1; x <= amount; x++) {' } },
    },
    python: {
      correct: `
def count_ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] += dp[x - coin]
    return dp[amount]
`,
      bugs: { 5: { was: 'range(coin, amount + 1)', buggy: 'for x in range(coin + 1, amount + 1):' } },
    },
    c: {
      correct: `
int count_ways(int coins[], int n, int amount) {
    int dp[100] = {0};
    dp[0] = 1;
    for (int i = 0; i < n; i++) {
        for (int x = coins[i]; x <= amount; x++) {
            dp[x] += dp[x - coins[i]];
        }
    }
    return dp[amount];
}
`,
      bugs: { 5: { was: 'for (int x = coins[i]; x <= amount; x++)', buggy: 'for (int x = coins[i] + 1; x <= amount; x++) {' } },
    },
  },
});
