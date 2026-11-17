import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p178',
  title: 'The length check rejects a valid weave',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'String Interleaving',
  tags: ['Strings', 'Interleaving', 'DP'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Interleaving strings pattern',
  description:
    'Return whether the third string can be formed by interleaving the first two strings while preserving their internal orders. Valid inputs are rejected.',
  constraints: ['0 <= lengths <= 100', 'Strings contain lowercase letters'],
  examples: [
    { input: 'a = "ab", b = "cd", c = "acbd"', output: 'true' },
    { input: 'a = "ab", b = "cd", c = "abdc"', output: 'false' },
  ],
  hints: ['The total length must match exactly.', 'Check the equality test before the table is built.'],
  complexity: { time: 'O(n * m)', space: 'O(n * m)' },
  explanation: {
    overview: 'Decide whether two strings can be woven into a third without reordering either one.',
    algorithm: 'Track which prefixes can form the corresponding prefix of the target string.',
    bug: 'The length guard compares the sum with one less than the target length.',
    whyItFails: 'Any valid input has equal total length, but the bug reports a mismatch and returns false immediately.',
    failingTestCase: 'For "ab", "cd" and "acbd", the total lengths are both 4, yet the code returns false.',
    fix: 'Compare the sum of the two lengths with the exact target length.',
    whyFixWorks: 'A valid interleaving must use every character exactly once, so the lengths must match.',
    dryRun: 'n = 2 and m = 2, so n + m = 4. The target also has length 4. The bug compares 4 with 3 and rejects the input.',
    debuggingLesson: 'For early guards, test a valid case and an invalid case before trusting the boundary.',
  },
  testCases: [
    { input: '"ab", "cd", "acbd"', expected: '1', buggyOutput: '0' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.inter("ab","cd","acbd") ? 1 : 0);`,
      python: `print(int(inter("ab","cd","acbd")))`,
      c: `printf("%d", inter("ab","cd","acbd"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean inter(String a, String b, String c) {
        int n = a.length();
        int m = b.length();
        if (n + m != c.length()) return false;
        boolean[][] dp = new boolean[n + 1][m + 1];
        dp[0][0] = true;
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {
                if (i > 0 && a.charAt(i - 1) == c.charAt(i + j - 1)) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
                }
                if (j > 0 && b.charAt(j - 1) == c.charAt(i + j - 1)) {
                    dp[i][j] = dp[i][j] || dp[i][j - 1];
                }
            }
        }
        return dp[n][m];
    }
}
`,
      bugs: { 5: { was: 'if (n + m != c.length()) return false;', buggy: 'if (n + m != c.length() - 1) return false;' } },
    },
    python: {
      correct: `
def inter(a, b, c):
    n = len(a)
    m = len(b)
    if n + m != len(c):
        return False
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for i in range(n + 1):
        for j in range(m + 1):
            if i > 0 and a[i - 1] == c[i + j - 1]:
                dp[i][j] = dp[i][j] or dp[i - 1][j]
            if j > 0 and b[j - 1] == c[i + j - 1]:
                dp[i][j] = dp[i][j] or dp[i][j - 1]
    return dp[n][m]
`,
      bugs: { 4: { was: 'if n + m != len(c):', buggy: 'if n + m != len(c) - 1:' } },
    },
    c: {
      correct: `
int inter(char a[], char b[], char c[]) {
    int n = 0, m = 0, k = 0;
    while (a[n]) n++;
    while (b[m]) m++;
    while (c[k]) k++;
    if (n + m != k) return 0;
    int dp[20][20] = {0};
    dp[0][0] = 1;
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= m; j++) {
            if (i > 0 && a[i - 1] == c[i + j - 1]) dp[i][j] = dp[i][j] || dp[i - 1][j];
            if (j > 0 && b[j - 1] == c[i + j - 1]) dp[i][j] = dp[i][j] || dp[i][j - 1];
        }
    }
    return dp[n][m];
}
`,
      bugs: { 6: { was: 'if (n + m != k) return 0;', buggy: 'if (n + m != k - 1) return 0;' } },
    },
  },
});
