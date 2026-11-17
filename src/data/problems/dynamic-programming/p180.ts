import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p180',
  title: 'The route home is not added',
  difficulty: 'Hard',
  topic: 'Dynamic Programming',
  subtopic: 'Traveling Salesman Bitmask DP',
  tags: ['Bitmask', 'Routes', 'DP'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Traveling salesman subset-state pattern',
  description:
    'Return the minimum cost of a tour that starts at city 0, visits every city once, and returns to city 0. The return edge is forgotten.',
  constraints: ['1 <= cities <= 8', 'distances are square and non-negative'],
  examples: [
    { input: 'd = [[0,1,9],[1,0,2],[9,2,0]]', output: '12' },
    { input: 'd = [[0,5],[5,0]]', output: '10' },
  ],
  hints: ['The tour is not complete until the last city connects back to the start.', 'Check the final minimum computed after all cities are visited.'],
  complexity: { time: 'O(n^2 * 2^n)', space: 'O(n * 2^n)' },
  explanation: {
    overview: 'Find the cheapest cyclic route through all cities.',
    algorithm: 'Track the best cost to reach each city after visiting each set of cities, then close the cycle back to the start.',
    bug: 'The final minimum uses only the cost to reach the last city and omits the edge back to city 0.',
    whyItFails: 'An open path is cheaper than a full tour, so the reported minimum is too small.',
    failingTestCase: 'For the three-city example, the open path 0-1-2 costs 3, but the full tour costs 12.',
    fix: 'Add the return edge from the ending city back to city 0 when taking the final minimum.',
    whyFixWorks: 'The problem asks for a cycle, so every candidate must include the closing edge.',
    dryRun: 'Visiting 0 then 1 then 2 costs 1 + 2 = 3. Returning from 2 to 0 adds 9, making 12. The bug returns 3.',
    debuggingLesson: 'For cyclic tours, check the closing edge separately from the path-building transitions.',
  },
  testCases: [
    { input: '[[0,1,9],[1,0,2],[9,2,0]]', expected: '12', buggyOutput: '3' },
  ],
  harness: {
    expected: '12',
    driver: {
      java: `int[][] d={{0,1,9},{1,0,2},{9,2,0}}; System.out.println(Solution.tsp(d));`,
      python: `print(tsp([[0,1,9],[1,0,2],[9,2,0]]))`,
      c: `int d[3][3]={{0,1,9},{1,0,2},{9,2,0}}; printf("%d", tsp(d,3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int tsp(int[][] d) {
        int n = d.length;
        int total = 1 << n;
        int inf = 1000000000;
        int[][] dp = new int[total][n];
        for (int m = 0; m < total; m++) for (int i = 0; i < n; i++) dp[m][i] = inf;
        dp[1][0] = 0;
        for (int m = 1; m < total; m++) {
            for (int i = 0; i < n; i++) {
                if ((m & (1 << i)) == 0 || dp[m][i] == inf) continue;
                for (int j = 0; j < n; j++) {
                    if ((m & (1 << j)) == 0) {
                        int nm = m | (1 << j);
                        dp[nm][j] = Math.min(dp[nm][j], dp[m][i] + d[i][j]);
                    }
                }
            }
        }
        int ans = inf;
        for (int i = 0; i < n; i++) {
            ans = Math.min(ans, dp[total - 1][i] + d[i][0]);
        }
        return ans;
    }
}
`,
      bugs: { 22: { was: 'ans = Math.min(ans, dp[total - 1][i] + d[i][0]);', buggy: 'ans = Math.min(ans, dp[total - 1][i]);' } },
    },
    python: {
      correct: `
def tsp(d):
    n = len(d)
    total = 1 << n
    inf = 10 ** 9
    dp = [[inf] * n for _ in range(total)]
    dp[1][0] = 0
    for m in range(1, total):
        for i in range(n):
            if (m & (1 << i)) == 0 or dp[m][i] == inf:
                continue
            for j in range(n):
                if (m & (1 << j)) == 0:
                    nm = m | (1 << j)
                    dp[nm][j] = min(dp[nm][j], dp[m][i] + d[i][j])
    ans = inf
    for i in range(n):
        ans = min(ans, dp[total - 1][i] + d[i][0])
    return ans
`,
      bugs: { 17: { was: 'ans = min(ans, dp[total - 1][i] + d[i][0])', buggy: 'ans = min(ans, dp[total - 1][i])' } },
    },
    c: {
      correct: `
int tsp(int d[][3], int n) {
    int total = 1 << n;
    int inf = 1000000000;
    int dp[8][3];
    for (int m = 0; m < total; m++) for (int i = 0; i < n; i++) dp[m][i] = inf;
    dp[1][0] = 0;
    for (int m = 1; m < total; m++) {
        for (int i = 0; i < n; i++) {
            if ((m & (1 << i)) == 0 || dp[m][i] == inf) continue;
            for (int j = 0; j < n; j++) {
                if ((m & (1 << j)) == 0) {
                    int nm = m | (1 << j);
                    int v = dp[m][i] + d[i][j];
                    if (v < dp[nm][j]) dp[nm][j] = v;
                }
            }
        }
    }
    int ans = inf;
    for (int i = 0; i < n; i++) if (dp[total - 1][i] + d[i][0] < ans) ans = dp[total - 1][i] + d[i][0];
    return ans;
}
`,
      bugs: { 20: { was: 'for (int i = 0; i < n; i++) if (dp[total - 1][i] + d[i][0] < ans) ans = dp[total - 1][i] + d[i][0];', buggy: 'for (int i = 0; i < n; i++) if (dp[total - 1][i] < ans) ans = dp[total - 1][i];' } },
    },
  },
});
