import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p149',
  title: 'Exact-capacity item is skipped',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Zero-One Selection',
  tags: ['Capacity', 'Selection', 'Loop Bound'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: '0/1 knapsack capacity loop pattern',
  description:
    'Return the maximum total value of items that can be chosen when each item is used at most once and the total weight must not exceed the capacity.',
  constraints: ['1 <= n <= 100', '1 <= capacity <= 1000'],
  examples: [
    { input: 'w = [5,1], v = [10,2], cap = 5', output: '10' },
  ],
  hints: ['Check whether an item whose weight exactly equals the capacity is considered.', 'Trace the capacity loop for the weight-5 item.'],
  complexity: { time: 'O(n * cap)', space: 'O(cap)' },
  explanation: {
    overview: 'Pick items under a weight limit, maximizing value.',
    algorithm: 'Process items one by one and update a one-dimensional table from high capacity down to the item weight.',
    bug: 'The capacity loop requires c to be strictly greater than the item weight.',
    whyItFails: 'An item whose weight exactly equals the current capacity is never considered, even when it is the only good choice.',
    failingTestCase: 'w = [5,1], v = [10,2], cap = 5: the code prints 2 instead of 10.',
    fix: 'Allow c to be greater than or equal to the item weight.',
    whyFixWorks: 'The exact-capacity case is a valid state and must be updated like any other capacity.',
    dryRun: 'For the weight-5 item, the wrong loop starts at c = 5 and immediately stops because c > 5 is false. The item is never taken.',
    debuggingLesson: 'In descending capacity loops, test the equality boundary with an item that exactly fills the capacity.',
  },
  testCases: [{ input: '[5,1], [10,2], 5', expected: '10' }],
  harness: {
    expected: '10',
    driver: {
      java: `System.out.println(Solution.knapsack(new int[]{5,1}, new int[]{10,2}, 5));`,
      python: `print(knapsack([5,1], [10,2], 5))`,
      c: `printf("%d", knapsack((int[]){5,1}, (int[]){10,2}, 2, 5));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int knapsack(int[] w, int[] v, int cap) {
        int[] dp = new int[cap + 1];
        for (int i = 0; i < w.length; i++) {
            for (int c = cap; c >= w[i]; c--) {
                dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i]);
            }
        }
        return dp[cap];
    }
}
`,
      bugs: { 5: { was: 'c >= w[i]', buggy: 'for (int c = cap; c > w[i]; c--) {' } },
    },
    python: {
      correct: `
def knapsack(w, v, cap):
    dp = [0] * (cap + 1)
    for i in range(len(w)):
        for c in range(cap, w[i] - 1, -1):
            dp[c] = max(dp[c], dp[c - w[i]] + v[i])
    return dp[cap]
`,
      bugs: { 4: { was: 'range(cap, w[i] - 1, -1)', buggy: 'for c in range(cap, w[i], -1):' } },
    },
    c: {
      correct: `
int knapsack(int w[], int v[], int n, int cap) {
    int dp[100] = {0};
    for (int i = 0; i < n; i++) {
        for (int c = cap; c >= w[i]; c--) {
            int cand = dp[c - w[i]] + v[i];
            if (cand > dp[c]) {
                dp[c] = cand;
            }
        }
    }
    return dp[cap];
}
`,
      bugs: { 4: { was: 'c >= w[i]', buggy: 'for (int c = cap; c > w[i]; c--) {' } },
    },
  },
});
