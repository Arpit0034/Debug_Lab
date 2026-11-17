import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p160',
  title: 'Empty prefix rejects a free wildcard',
  difficulty: 'Hard',
  topic: 'Dynamic Programming',
  subtopic: 'Wildcard Matching',
  tags: ['Wildcards', 'Strings', 'Base Case'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Wildcard matching dynamic programming pattern',
  description:
    'Return whether a text matches a pattern where question mark matches one character and star matches any sequence including empty.',
  constraints: ['0 <= text length <= 200', '0 <= pattern length <= 200'],
  examples: [
    { input: 's = "", p = "*"', output: 'true' },
  ],
  hints: ['A star can match an empty prefix.', 'Check the first row of the table for a pattern of stars.'],
  complexity: { time: 'O(m * n)', space: 'O(m * n)' },
  explanation: {
    overview: 'Decide whether a wildcard pattern matches an entire string.',
    algorithm: 'Fill a table where a star can match nothing or one more character, question mark matches one, and normal characters must be equal.',
    bug: 'The empty-text row marks a star as not matching instead of inheriting the previous star state.',
    whyItFails: 'A pattern consisting only of stars should match an empty string, but the table marks it false.',
    failingTestCase: 's = empty, p = *: the code prints 0 instead of 1.',
    fix: 'Let a star in the first row inherit the previous cell.',
    whyFixWorks: 'Each star can match an empty sequence, so consecutive stars remain valid for empty text.',
    dryRun: 'With s empty and p as one star, dp[0][1] should copy dp[0][0] which is true. The wrong code writes false.',
    debuggingLesson: 'In string DP, initialize the empty-prefix row and column carefully, especially for wildcard tokens.',
  },
  testCases: [{ input: 'empty, *', expected: '1' }],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println((Solution.isMatch("", "*") ? 1 : 0));`,
      python: `print(1 if is_match("", "*") else 0)`,
      c: `printf("%d", is_match("", "*", 0, 1));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 1];
            }
        }
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                char pc = p.charAt(j - 1);
                if (pc == '?' || pc == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else if (pc == '*') {
                    dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
                }
            }
        }
        return dp[m][n];
    }
}
`,
      bugs: { 11: { was: 'dp[0][j] = dp[0][j - 1];', buggy: 'dp[0][j] = false;' } },
    },
    python: {
      correct: `
def is_match(s, p):
    m = len(s)
    n = len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(1, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 1]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            pc = p[j - 1]
            if pc == '?' or pc == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            elif pc == '*':
                dp[i][j] = dp[i - 1][j] or dp[i][j - 1]
    return dp[m][n]
`,
      bugs: { 9: { was: 'dp[0][j] = dp[0][j - 1]', buggy: 'dp[0][j] = False' } },
    },
    c: {
      correct: `
int is_match(char s[], char p[], int m, int n) {
    int dp[20][20] = {0};
    dp[0][0] = 1;
    for (int j = 1; j <= n; j++) {
        if (p[j - 1] == '*') {
            dp[0][j] = dp[0][j - 1];
        }
    }
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            char pc = p[j - 1];
            if (pc == '?' || pc == s[i - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else if (pc == '*') {
                dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
            }
        }
    }
    return dp[m][n];
}
`,
      bugs: { 7: { was: 'dp[0][j] = dp[0][j - 1];', buggy: 'dp[0][j] = 0;' } },
    },
  },
});
