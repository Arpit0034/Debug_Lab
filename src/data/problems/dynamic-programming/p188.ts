import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p188',
  title: 'An empty text rejects a free wildcard',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Wildcard Matching',
  tags: ['Strings', 'Matching', 'Wildcards'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Wildcard matching pattern',
  description:
    'Return whether a pattern matches a whole string, where a star can stand for any sequence of characters. An empty string with a star pattern is rejected.',
  constraints: ['0 <= lengths <= 100', 'Pattern uses lowercase letters, question marks and stars'],
  examples: [
    { input: 's = "", p = "*"', output: 'true' },
    { input: 's = "ad", p = "a?"', output: 'true' },
  ],
  hints: ['A star can match an empty sequence.', 'Check the table entries for an empty text before filling the rest.'],
  complexity: { time: 'O(n * m)', space: 'O(n * m)' },
  explanation: {
    overview: 'Decide whether a wildcard pattern matches an entire string.',
    algorithm: 'Build matches for prefixes of the text and pattern, letting a star either consume a character or match nothing.',
    bug: 'The empty-text row only advances for question marks instead of stars.',
    whyItFails: 'A star can match zero characters, so a pattern made only of stars should match an empty string.',
    failingTestCase: 'For empty text and pattern "*", the correct answer is true but the code returns false.',
    fix: 'When the pattern character is a star, propagate the empty-prefix match from the previous pattern position.',
    whyFixWorks: 'That represents the star matching an empty sequence and allows consecutive stars to match empty text.',
    dryRun: 'dp[0][0] is true. For pattern "*", the correct dp[0][1] becomes true. The bug checks for question mark, leaves it false, and returns false.',
    debuggingLesson: 'For pattern matching, test empty input against patterns that can match nothing.',
  },
  testCases: [
    { input: '"" and "*"', expected: '1', buggyOutput: '0' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.match("","*") ? 1 : 0);`,
      python: `print(int(match("","*")))`,
      c: `printf("%d", match("","*"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean match(String s, String p) {
        int n = s.length();
        int m = p.length();
        boolean[][] dp = new boolean[n + 1][m + 1];
        dp[0][0] = true;
        for (int j = 1; j <= m; j++) {
            if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 1];
        }
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                char pc = p.charAt(j - 1);
                if (pc == '*') {
                    dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
                } else if (pc == '?' || pc == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
        return dp[n][m];
    }
}
`,
      bugs: { 8: { was: "if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 1];", buggy: "if (p.charAt(j - 1) == '?') dp[0][j] = dp[0][j - 1];" } },
    },
    python: {
      correct: `
def match(s, p):
    n = len(s)
    m = len(p)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for j in range(1, m + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 1]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            pc = p[j - 1]
            if pc == '*':
                dp[i][j] = dp[i - 1][j] or dp[i][j - 1]
            elif pc == '?' or pc == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[n][m]
`,
      bugs: { 7: { was: "if p[j - 1] == '*':", buggy: "if p[j - 1] == '?':" } },
    },
    c: {
      correct: `
int match(char s[], char p[]) {
    int n = 0, m = 0;
    while (s[n]) n++;
    while (p[m]) m++;
    int dp[20][20] = {0};
    dp[0][0] = 1;
    for (int j = 1; j <= m; j++) {
        if (p[j - 1] == '*') dp[0][j] = dp[0][j - 1];
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            char pc = p[j - 1];
            if (pc == '*') {
                dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
            } else if (pc == '?' || pc == s[i - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
        }
    }
    return dp[n][m];
}
`,
      bugs: { 8: { was: "if (p[j - 1] == '*') dp[0][j] = dp[0][j - 1];", buggy: "if (p[j - 1] == '?') dp[0][j] = dp[0][j - 1];" } },
    },
  },
});
