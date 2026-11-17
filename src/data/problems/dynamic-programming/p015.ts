import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p015',
  title: 'Matches add nothing',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Longest Common Subsequence',
  tags: ['2D DP', 'Strings'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Longest common subsequence pattern',
  description: 'Return the length of the longest common subsequence of two strings. The function returns 0 for strings that clearly share characters.',
  constraints: ['0 <= length <= 1000'],
  examples: [{ input: 'a = "abcde", b = "ace"', output: '3', note: 'The buggy code returns 0.' }],
  hints: ['When two characters match, how much longer does the common subsequence become?'],
  complexity: { time: 'O(m * n)', space: 'O(m * n)' },
  explanation: {
    overview: 'Find the longest sequence of characters that appears in both strings in the same order.',
    algorithm: 'dp[i][j] is the answer for the first i characters of a and the first j of b. On a match, extend the diagonal answer by one. Otherwise take the better of dropping a character from either string.',
    bug: 'On a character match the code copies dp[i-1][j-1] without adding 1.',
    whyItFails: 'A match should lengthen the subsequence, but the table never grows, so every cell stays 0.',
    failingTestCase: 'a = "abcde", b = "ace" returns 0 instead of 3.',
    fix: 'Add 1 on a match: dp[i][j] = dp[i-1][j-1] + 1.',
    whyFixWorks: 'Each matched pair contributes exactly one character to the subsequence, so the table counts matches along the best alignment.',
    dryRun: '"abcde" vs "ace". a matches a: dp=1. c matches c extending to 2. e matches e extending to 3. Result 3.',
    debuggingLesson: 'In DP, check each branch of the recurrence against a tiny example. A branch that never increases the value cannot be right for a counting problem.',
  },
  testCases: [{ input: '"abcde", "ace"', expected: '3', buggyOutput: '0' }],
  harness: {
    expected: '3 0',
    driver: {
      java: `System.out.println(Solution.lcs("abcde", "ace") + " " + Solution.lcs("abc", "def"));`,
      python: `print(lcs("abcde", "ace"), lcs("abc", "def"))`,
      c: `printf("%d %d", lcs("abcde", "ace"), lcs("abc", "def"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int lcs(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[a.length()][b.length()];
    }
}
`,
      bugs: { 7: { was: '+ 1', buggy: 'dp[i][j] = dp[i - 1][j - 1];', fixes: ['dp[i][j] = 1 + dp[i - 1][j - 1];'] } },
    },
    python: {
      correct: `
def lcs(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]
`,
      bugs: { 6: { was: '+ 1', buggy: 'dp[i][j] = dp[i - 1][j - 1]', fixes: ['dp[i][j] = 1 + dp[i - 1][j - 1]'] } },
    },
    c: {
      correct: `
#include <string.h>

int lcs(const char *a, const char *b) {
    int m = strlen(a), n = strlen(b);
    int dp[m + 1][n + 1];
    memset(dp, 0, sizeof(dp));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
            }
        }
    }
    return dp[m][n];
}
`,
      bugs: { 10: { was: '+ 1', buggy: 'dp[i][j] = dp[i - 1][j - 1];', fixes: ['dp[i][j] = 1 + dp[i - 1][j - 1];'] } },
    },
  },
});
