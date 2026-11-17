import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p164',
  title: 'The coin total is counted with an extra denomination',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Minimum Coin Count',
  tags: ['DP', 'Coins', 'Unbounded Choice'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Minimum number of coins to make a target amount',
  description: 'Return the minimum number of coins needed to make the target amount using unlimited coins of the supplied denominations, or -1 if impossible.',
  constraints: ['1 <= coin count <= 20', '0 <= amount <= 10000'],
  examples: [{ input: 'coins=[1,3,4], amount=6', output: '2' }],
  hints: ['Build answers from smaller amounts.', 'An unreachable amount should not be used as a valid predecessor.'],
  complexity: { time: 'O(amount * coin count)', space: 'O(amount)' },
  explanation: {
    overview: 'Minimize the number of coins whose values sum to the target.',
    algorithm: 'For each amount, try every denomination and extend a reachable smaller amount.',
    bug: 'The amount loop stops before calculating the requested target.',
    whyItFails: 'The final DP entry remains uninitialized for the requested amount.',
    failingTestCase: 'For [1,3,4] and amount 6, the answer is 2.',
    fix: 'Include the target amount in the loop.',
    whyFixWorks: 'Every state from zero through the target is computed.',
    dryRun: 'The target 6 is reached using 3+3.',
    debuggingLesson: 'Inclusive target bounds are common in table-based optimization.'
  },
  testCases: [{ input: '[1,3,4],6', expected: '2' }],
  harness: { expected: '2', driver: { java: 'System.out.print(Solution.minCoins(new int[]{1,3,4},6));', python: 'print(min_coins([1,3,4],6))', c: 'printf("%d",min_coins((int[]){1,3,4},3,6));' } },
  code: {
    java: { correct: `
class Solution {
    static int minCoins(int[] coins,int amount) {
        int inf=amount+1; int[] dp=new int[amount+1];
        java.util.Arrays.fill(dp,inf); dp[0]=0;
        for(int x=1;x<=amount;x++)
            for(int c:coins) if(c<=x) dp[x]=Math.min(dp[x],dp[x-c]+1);
        return dp[amount]==inf?-1:dp[amount];
    }
}
`, bugs: { 5: { was: 'for(int x=1;x<=amount;x++)', buggy: 'for(int x=1;x<amount;x++)' } } },
    python: { correct: `
def min_coins(coins, amount):
    inf = amount + 1
    dp = [inf] * (amount+1)
    dp[0] = 0
    for x in range(1, amount+1):
        for c in coins:
            if c <= x:
                dp[x] = min(dp[x], dp[x-c]+1)
    return -1 if dp[amount] == inf else dp[amount]
`, bugs: { 5: { was: 'for x in range(1, amount+1):', buggy: 'for x in range(1, amount):' } } },
    c: { correct: `
int min_coins(int coins[],int n,int amount) {
    int dp[10001],inf=amount+1;
    for(int i=0;i<=amount;i++)dp[i]=inf;
    dp[0]=0;
    for(int x=1;x<=amount;x++)
        for(int j=0;j<n;j++)
            if(coins[j]<=x && dp[x-coins[j]]+1<dp[x])dp[x]=dp[x-coins[j]]+1;
    return dp[amount]==inf?-1:dp[amount];
}
`, bugs: { 5: { was: 'for(int x=1;x<=amount;x++)', buggy: 'for(int x=1;x<amount;x++)' } } }
  }
});
