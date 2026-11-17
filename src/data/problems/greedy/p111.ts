import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p111',
  title: 'The largest denomination wastes extra coins',
  difficulty: 'Medium',
  topic: 'Greedy',
  subtopic: 'Minimum Coin Change',
  tags: ['Coin Change', 'Memoization', 'Optimal Choices'],
  bugCategory: 'Incorrect Greedy Decision',
  sourceInspiredBy: 'Minimum coin change with noncanonical denominations',
  description:
    'Given a set of positive coin denominations and a target amount, return the minimum number of coins needed to form that amount. Each denomination may be used any number of times. Return -1 when the amount cannot be formed.',
  constraints: [
    '1 <= coins.length <= 50',
    '1 <= coins[i] <= 10000',
    '0 <= amount <= 10000',
  ],
  examples: [
    {
      input: 'coins = [1,3,4], amount = 6',
      output: '2',
      note: 'Two coins of value 3 are better than taking 4 first.',
    },
    {
      input: 'coins = [1,5,6], amount = 10',
      output: '2',
    },
  ],
  hints: [
    'A locally largest denomination does not always produce the fewest total coins.',
    'Compare the result of choosing the first coin with the results of choosing other available denominations.',
  ],
  complexity: { time: 'O(amount * coins.length)', space: 'O(amount)' },
  explanation: {
    overview: 'Find the minimum number of unlimited-use coins needed to form a target amount.',
    algorithm: 'Use memoized recursion. For each remaining amount, try every denomination that does not exceed it. Recursively solve the remaining amount and retain the smallest valid coin count. Cache the result for each amount so that repeated subproblems are not recalculated.',
    bug: 'The implementation considers only the largest denomination that fits the remaining amount.',
    whyItFails: 'Choosing the largest available coin is not always optimal for arbitrary denomination sets. A larger coin may leave an awkward remainder that requires several small coins, while a smaller first choice may produce a much better combination.',
    failingTestCase: 'For coins [1,3,4] and amount 6, taking 4 first leaves 2, requiring two additional coins of value 1. The buggy version returns 3, while two coins of value 3 produce the optimal result 2.',
    fix: 'Try every denomination that is positive and no greater than the remaining amount.',
    whyFixWorks: 'Evaluating every possible first coin allows the algorithm to compare all valid combinations. Memoization ensures that each remaining amount is solved only once.',
    dryRun: 'For amount 6, choosing coin 1 leaves 5, choosing coin 3 leaves 3, and choosing coin 4 leaves 2. The remaining amount 3 requires one coin, so choosing 3 gives a total of 2. Choosing 4 requires two more coins, giving 3. The minimum is therefore 2.',
    debuggingLesson: 'Do not assume a locally attractive choice is globally optimal. Before using a greedy rule, verify that the input structure guarantees that each local choice preserves an optimal solution.',
  },
  testCases: [
    {
      input: 'coins = [1,3,4], amount = 6',
      expected: '2',
      buggyOutput: '3',
    },
    {
      input: 'coins = [1,5,6], amount = 10',
      expected: '2',
      buggyOutput: '5',
    },
  ],
  harness: {
    expected: '2 2',
    driver: {
      java: `System.out.print(Solution.minCoins(new int[]{1,3,4}, 6) + " ");
System.out.print(Solution.minCoins(new int[]{1,5,6}, 10));`,
      python: `print(min_coins([1,3,4], 6), min_coins([1,5,6], 10))`,
      c: `int a[] = {1,3,4}, b[] = {1,5,6};
printf("%d %d",min_coins(a,3,6),min_coins(b,3,10));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int minCoins(int[] coins, int amount) {
        int[] memo = new int[amount + 1];
        Arrays.fill(memo, -2);
        return solve(amount, coins, memo);
    }
    static int solve(int amount, int[] coins, int[] memo) {
        if (amount == 0) return 0;
        if (memo[amount] != -2) return memo[amount];
        int best = 1000000;
        for (int coin : coins) {
            if (coin > 0 && coin <= amount) {
                int sub = solve(amount - coin, coins, memo);
                if (sub >= 0) best = Math.min(best, sub + 1);
            }
        }
        memo[amount] = best == 1000000 ? -1 : best;
        return memo[amount];
    }
    static int largestCoin(int amount, int[] coins) {
        int best = 0;
        for (int coin : coins) if (coin <= amount) best = Math.max(best, coin);
        return best;
    }
}
`,
      bugs: {
        13: {
          was: 'for (int coin : coins)',
          buggy: '        for (int coin : new int[]{largestCoin(amount, coins)}) {',
        },
      },
    },
    python: {
      correct: `
def min_coins(coins, amount):
    memo = {}
    def solve(rem):
        if rem == 0:
            return 0
        if rem in memo:
            return memo[rem]
        best = 1000000
        for coin in coins:
            if 0 < coin <= rem:
                sub = solve(rem - coin)
                if sub >= 0:
                    best = min(best, sub + 1)
        memo[rem] = -1 if best == 1000000 else best
        return memo[rem]
    return solve(amount)
`,
      bugs: {
        9: {
          was: 'for coin in coins:',
          buggy: '        for coin in [max((c for c in coins if 0 < c <= rem), default=0)]:',
        },
      },
    },
    c: {
      correct: `
int largest_coin_index(int amount, int coins[], int n) {
    int best = -1;
    for (int i = 0; i < n; i++) {
        if (coins[i] <= amount && (best == -1 || coins[i] > coins[best])) best = i;
    }
    return best;
}
int solve_coins(int amount, int coins[], int n, int memo[]) {
    if (amount == 0) return 0;
    if (memo[amount] != -2) return memo[amount];
    int best = 1000000;
    for (int i = 0; i < n; i++) {
        int coin = coins[i];
        if (coin > 0 && coin <= amount) {
            int sub = solve_coins(amount - coin, coins, n, memo);
            if (sub >= 0 && sub + 1 < best) best = sub + 1;
        }
    }
    memo[amount] = best == 1000000 ? -1 : best;
    return memo[amount];
}
int min_coins(int coins[], int n, int amount) {
    int* memo = malloc((amount + 1) * sizeof(int));
    for (int i = 0; i <= amount; i++) memo[i] = -2;
    int answer = solve_coins(amount, coins, n, memo);
    free(memo);
    return answer;
}
`,
      bugs: {
        12: {
          was: 'for (int i = 0; i < n; i++)',
          buggy: '    for (int i = largest_coin_index(amount, coins, n); i >= 0; i = -1) {',
        },
      },
    },
  },
});
