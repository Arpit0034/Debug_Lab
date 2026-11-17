import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p185',
  title: 'The cut count looks one piece too far',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Palindrome Partitioning',
  tags: ['Strings', 'Palindrome', 'Partition'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Minimum palindrome cuts pattern',
  description:
    'Return the minimum number of cuts needed so every piece of a string is a palindrome. The cut count is one too high.',
  constraints: ['1 <= length <= 100', 'String contains lowercase letters'],
  examples: [
    { input: 's = "aab"', output: '1' },
    { input: 's = "ab"', output: '1' },
  ],
  hints: ['If a palindrome starts at the beginning, no cut is needed before it.', 'Otherwise the new cut follows the best result just before the palindrome starts.'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Split a string into palindromic pieces using the fewest cuts.',
    algorithm: 'For each ending position, try every palindromic suffix and extend the best result from the position before that suffix.',
    bug: 'The transition reads the cut count at the palindrome start instead of the position just before it.',
    whyItFails: 'That position already includes the current palindrome piece, so the new cut is added on top of the wrong prefix.',
    failingTestCase: 'For "aab", the correct minimum is 1, but the code returns 2.',
    fix: 'Use the best cut count from the position just before the palindrome starts.',
    whyFixWorks: 'The new piece begins at the start index, so the prefix ends immediately before it.',
    dryRun: 'For "aab", the final b is a one-letter palindrome starting at index 2. The best prefix before it is "aa" with zero cuts, so the answer is one. The bug reads the state at index 2 itself and adds another cut.',
    debuggingLesson: 'When extending a partition, subtract one from the new piece start before reading the prefix state.',
  },
  testCases: [
    { input: '"aab"', expected: '1', buggyOutput: '2' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.minCut("aab"));`,
      python: `print(min_cut("aab"))`,
      c: `printf("%d", min_cut("aab"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int minCut(String s) {
        int n = s.length();
        int[] dp = new int[n];
        boolean[][] pal = new boolean[n][n];
        for (int i = 0; i < n; i++) dp[i] = i;
        for (int end = 0; end < n; end++) {
            for (int start = 0; start <= end; start++) {
                if (s.charAt(start) == s.charAt(end) && (end - start < 2 || pal[start + 1][end - 1])) {
                    pal[start][end] = true;
                    if (start == 0) {
                        dp[end] = 0;
                    } else {
                        dp[end] = Math.min(dp[end], dp[start - 1] + 1);
                    }
                }
            }
        }
        return dp[n - 1];
    }
}
`,
      bugs: { 14: { was: 'dp[end] = Math.min(dp[end], dp[start - 1] + 1);', buggy: 'dp[end] = Math.min(dp[end], dp[start] + 1);' } },
    },
    python: {
      correct: `
def min_cut(s):
    n = len(s)
    dp = list(range(n))
    pal = [[False] * n for _ in range(n)]
    for end in range(n):
        for start in range(end + 1):
            if s[start] == s[end] and (end - start < 2 or pal[start + 1][end - 1]):
                pal[start][end] = True
                if start == 0:
                    dp[end] = 0
                else:
                    dp[end] = min(dp[end], dp[start - 1] + 1)
    return dp[n - 1]
`,
      bugs: { 12: { was: 'dp[end] = min(dp[end], dp[start - 1] + 1)', buggy: 'dp[end] = min(dp[end], dp[start] + 1)' } },
    },
    c: {
      correct: `
int min_cut(char s[]) {
    int n = 0;
    while (s[n]) n++;
    int dp[20];
    int pal[20][20] = {0};
    for (int i = 0; i < n; i++) dp[i] = i;
    for (int end = 0; end < n; end++) {
        for (int start = 0; start <= end; start++) {
            if (s[start] == s[end] && (end - start < 2 || pal[start + 1][end - 1])) {
                pal[start][end] = 1;
                if (start == 0) {
                    dp[end] = 0;
                } else {
                    int v = dp[start - 1] + 1;
                    if (v < dp[end]) dp[end] = v;
                }
            }
        }
    }
    return dp[n - 1];
}
`,
      bugs: { 14: { was: 'int v = dp[start - 1] + 1;', buggy: 'int v = dp[start] + 1;' } },
    },
  },
});
