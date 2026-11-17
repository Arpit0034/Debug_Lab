import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p184',
  title: 'A repeated letter is counted twice',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Longest Common Subsequence',
  tags: ['Strings', 'Subsequence', 'DP'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Longest common subsequence pattern',
  description:
    'Return the length of the longest sequence that appears in both strings in the same order. Repeated letters can be counted more than once.',
  constraints: ['1 <= lengths <= 100', 'Strings contain lowercase letters'],
  examples: [
    { input: 'a = "aa", b = "a"', output: '1' },
    { input: 'a = "abc", b = "ac"', output: '2' },
  ],
  hints: ['When the current characters match, the answer should extend the best result before either character.', 'Check whether the matching transition uses the row above or the diagonal.'],
  complexity: { time: 'O(n * m)', space: 'O(n * m)' },
  explanation: {
    overview: 'Find the longest ordered shared sequence between two strings.',
    algorithm: 'Compare prefixes of the two strings and reuse the best results from shorter prefixes.',
    bug: 'When characters match, the transition reuses the value above instead of the diagonal value.',
    whyItFails: 'The value above may already include a match for the same character, so the current character is added again without consuming a new position in the other string.',
    failingTestCase: 'For "aa" and "a", the correct answer is 1, but the bug returns 2.',
    fix: 'On a match, extend the diagonal value before either current character.',
    whyFixWorks: 'The diagonal state represents the best result after consuming both matched characters.',
    dryRun: 'At the second a in "aa", the value above already contains the first match. Adding one more gives 2, but both matches would use the same single a from the second string.',
    debuggingLesson: 'In two-string tables, a match must consume one character from each string.',
  },
  testCases: [
    { input: '"aa", "a"', expected: '1', buggyOutput: '2' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.lcs("aa","a"));`,
      python: `print(lcs("aa","a"))`,
      c: `printf("%d", lcs("aa","a"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int lcs(String a, String b) {
        int n = a.length();
        int m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[n][m];
    }
}
`,
      bugs: { 9: { was: 'dp[i][j] = dp[i - 1][j - 1] + 1;', buggy: 'dp[i][j] = dp[i - 1][j] + 1;' } },
    },
    python: {
      correct: `
def lcs(a, b):
    n = len(a)
    m = len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]
`,
      bugs: { 8: { was: 'dp[i][j] = dp[i - 1][j - 1] + 1', buggy: 'dp[i][j] = dp[i - 1][j] + 1' } },
    },
    c: {
      correct: `
int lcs(char a[], char b[]) {
    int n = 0, m = 0;
    while (a[n]) n++;
    while (b[m]) m++;
    int dp[20][20] = {0};
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
            }
        }
    }
    return dp[n][m];
}
`,
      bugs: { 9: { was: 'dp[i][j] = dp[i - 1][j - 1] + 1;', buggy: 'dp[i][j] = dp[i - 1][j] + 1;' } },
    },
  },
});
