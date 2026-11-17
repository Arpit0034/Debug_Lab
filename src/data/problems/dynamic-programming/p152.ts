import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p152',
  title: 'Matching letters reuse the wrong cell',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'String Edit Cost',
  tags: ['Strings', 'Edit Cost', 'Transition'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Edit distance dynamic programming pattern',
  description:
    'Return the minimum number of insertions, deletions and replacements needed to turn one string into another.',
  constraints: ['0 <= lengths <= 100'],
  examples: [
    { input: 'a = ab, b = ab', output: '0' },
  ],
  hints: ['When the current letters match, which previous cost should be copied?', 'Trace the table diagonal for two equal strings.'],
  complexity: { time: 'O(m * n)', space: 'O(m * n)' },
  explanation: {
    overview: 'Compute the smallest edit cost between two strings.',
    algorithm: 'Fill a table where equal characters copy the diagonal cost, and different characters take one plus the best of delete, insert and replace.',
    bug: 'When characters match, the code copies from the cell above instead of the diagonal cell.',
    whyItFails: 'A match should not add any new edit, and the previous prefixes must both shrink. Copying from above leaves one prefix unpaired and reports a positive cost.',
    failingTestCase: 'a = ab, b = ab: the code prints 1 instead of 0.',
    fix: 'Use the diagonal cell when the current characters match.',
    whyFixWorks: 'The diagonal cell represents the cost before both current characters, which is exactly correct for a free match.',
    dryRun: 'For ab and ab, the final matching b should copy the cost for a and a, which is 0. The wrong transition copies a larger value and returns 1.',
    debuggingLesson: 'In two-string tables, matching characters usually advance both indices, so the diagonal neighbour is the one to inspect.',
  },
  testCases: [{ input: 'ab, ab', expected: '0' }],
  harness: {
    expected: '0',
    driver: {
      java: `System.out.println(Solution.editDistance("ab", "ab"));`,
      python: `print(edit_distance("ab", "ab"))`,
      c: `printf("%d", edit_distance("ab", "ab", 2, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int editDistance(String a, String b) {
        int m = a.length();
        int n = b.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    int x = Math.min(dp[i - 1][j], dp[i][j - 1]);
                    dp[i][j] = 1 + Math.min(x, dp[i - 1][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}
`,
      bugs: { 15: { was: 'dp[i][j] = dp[i - 1][j - 1];', buggy: 'dp[i][j] = dp[i - 1][j];' } },
    },
    python: {
      correct: `
def edit_distance(a, b):
    m = len(a)
    n = len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]
`,
      bugs: { 12: { was: 'dp[i][j] = dp[i - 1][j - 1]', buggy: 'dp[i][j] = dp[i - 1][j]' } },
    },
    c: {
      correct: `
int edit_distance(char a[], char b[], int m, int n) {
    int dp[20][20] = {0};
    for (int i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (int j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                int x = dp[i - 1][j] < dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
                int y = x < dp[i - 1][j - 1] ? x : dp[i - 1][j - 1];
                dp[i][j] = 1 + y;
            }
        }
    }
    return dp[m][n];
}
`,
      bugs: { 12: { was: 'dp[i][j] = dp[i - 1][j - 1];', buggy: 'dp[i][j] = dp[i - 1][j];' } },
    },
  },
});
