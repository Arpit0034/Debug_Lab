import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p006',
  title: 'Fewest coins, wrong answer',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Coin Change',
  tags: ['DP Transition', 'Initialization'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Minimum coins to make an amount pattern',
  description:
    'Given coin values and a target amount, return the fewest coins that sum to the amount, or -1 if it cannot be made. You may use each coin any number of times. The code gives wrong answers on unreachable amounts.',
  constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10000'],
  examples: [
    { input: 'coins = [1, 2, 5], amount = 11', output: '3' },
    { input: 'coins = [2], amount = 3', output: '-1', note: 'The buggy code does not return -1.' },
  ],
  hints: ['What value does an unreachable amount hold in your table?', 'What happens when you add 1 to that value?'],  complexity: { time: 'O(amount * coins)', space: 'O(amount)' },
  explanation: {
    overview: 'Find the minimum number of coins for an amount.',
    algorithm:
      'dp[a] is the fewest coins for amount a. dp[0] = 0. For each amount, try every coin c <= a and take dp[a - c] + 1, but only if a - c is reachable.',
    bug: 'Java and Python: unreachable states are not guarded or initialised as unreachable. C: dp[a] is initialised to 0 instead of a large value.',
    whyItFails:
      'Java: dp[a - c] may hold Integer.MAX_VALUE, and adding 1 overflows to a negative number that wins the min. Python: dp starts as all zeros, so min can never find a real count and the result is 0. C: dp[a] = 0 makes every candidate look worse, so every answer stays 0.',
    failingTestCase: 'coins = [2], amount = 3: the expected answer is -1.',
    fix: 'Java: skip states that are still unreachable. Python: initialise dp with infinity. C: initialise dp[a] to amount + 1.',
    whyFixWorks:
      'Unreachable states stay at a sentinel that is never extended or beaten by a bogus value, so only real combinations update the table.',
    dryRun:
      'coins = [2], amount = 3. dp[0]=0. a=1: no coin fits, stays unreachable. a=2: dp[0]+1 = 1. a=3: dp[1] is unreachable, so no update and the answer is -1.',
    debuggingLesson:
      'Every DP table needs a correct "unreachable" value, and any arithmetic on it must be guarded or must not overflow.',
  },
  testCases: [
    { input: '[2], 3', expected: '-1' },
    { input: '[1, 2, 5], 11', expected: '3' },
  ],
  harness: {
    expected: '-1 3',
    driver: {
      java: `System.out.println(Solution.coinChange(new int[]{2}, 3) + " " + Solution.coinChange(new int[]{1, 2, 5}, 11));`,
      python: `print(coin_change([2], 3), coin_change([1, 2, 5], 11))`,
      c: `printf("%d %d", coin_change((int[]){2}, 1, 3), coin_change((int[]){1, 2, 5}, 3, 11));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (c <= a && dp[a - c] != Integer.MAX_VALUE) {
                    dp[a] = Math.min(dp[a], dp[a - c] + 1);
                }
            }
        }
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
}
`,
      bugs: { 10: { was: 'if (c <= a &&', buggy: 'if (c <= a) {' } },
    },
    python: {
      correct: `
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]
`,
      bugs: { 2: { was: "float('inf')", buggy: 'dp = [0] * (amount + 1)', fixes: ['dp = [amount + 1] * (amount + 1)'] } },
    },
    c: {
      correct: `
int coin_change(int coins[], int n, int amount) {
    int dp[amount + 1];
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        dp[a] = amount + 1;
        for (int i = 0; i < n; i++) {
            if (coins[i] <= a && dp[a - coins[i]] + 1 < dp[a]) {
                dp[a] = dp[a - coins[i]] + 1;
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
`,
      bugs: { 5: { was: 'dp[a] = amount + 1', buggy: 'dp[a] = 0;' } },
    },
  },
});
