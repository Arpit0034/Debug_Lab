import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p154',
  title: 'Longest mirrored sequence misses its full span',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Palindrome Subsequence',
  tags: ['Palindrome', 'Subsequence', 'Loop Bound'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Longest palindromic subsequence pattern',
  description:
    'Return the length of the longest subsequence of a string that reads the same forwards and backwards.',
  constraints: ['1 <= length <= 1000'],
  examples: [
    { input: 's = abba', output: '4' },
  ],
  hints: ['Check whether the full string length is ever processed.', 'Trace the outer loop range for length equal to n.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Find the longest palindromic subsequence length.',
    algorithm: 'Fill a table by increasing substring length, matching ends or taking the better of removing one end.',
    bug: 'The start-index loop stops one position too early for each length.',
    whyItFails: 'The full-length substring is never considered, so the final answer cell remains unset.',
    failingTestCase: 's = abba: the code prints 0 instead of 4.',
    fix: 'Include the final valid start index for each length.',
    whyFixWorks: 'The loop then reaches the full string when length equals n.',
    dryRun: 'For n = 4, length 4 needs start index 0. The wrong loop has no value for that length, leaving the answer cell at 0.',
    debuggingLesson: 'When iterating by substring length, verify the last start index is n minus length inclusive.',
  },
  testCases: [{ input: 'abba', expected: '4' }],
  harness: {
    expected: '4',
    driver: {
      java: `System.out.println(Solution.lps("abba"));`,
      python: `print(lps("abba"))`,
      c: `printf("%d", lps("abba", 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int lps(String s) {
        int n = s.length();
        int[][] dp = new int[n][n];
        for (int i = 0; i < n; i++) {
            dp[i][i] = 1;
        }
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i < n - len + 1; i++) {
                int j = i + len - 1;
                if (s.charAt(i) == s.charAt(j)) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[0][n - 1];
    }
}
`,
      bugs: { 9: { was: 'i < n - len + 1', buggy: 'for (int i = 0; i < n - len; i++) {' } },
    },
    python: {
      correct: `
def lps(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]
`,
      bugs: { 8: { was: 'range(n - length + 1)', buggy: 'for i in range(n - length):' } },
    },
    c: {
      correct: `
int lps(char s[], int n) {
    int dp[20][20] = {0};
    for (int i = 0; i < n; i++) {
        dp[i][i] = 1;
    }
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i < n - len + 1; i++) {
            int j = i + len - 1;
            if (s[i] == s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                int x = dp[i + 1][j];
                int y = dp[i][j - 1];
                dp[i][j] = x > y ? x : y;
            }
        }
    }
    return dp[0][n - 1];
}
`,
      bugs: { 7: { was: 'i < n - len + 1', buggy: 'for (int i = 0; i < n - len; i++) {' } },
    },
  },
});
