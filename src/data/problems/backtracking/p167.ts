import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p167',
  title: 'Single-character pieces are discarded',
  difficulty: 'Medium',
  topic: 'Backtracking',
  subtopic: 'Palindrome Partitioning',
  tags: ['Palindrome', 'Partition', 'Base Case'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Palindrome partitioning backtracking pattern',
  description:
    'Return how many ways a string can be split into pieces that are each palindromes.',
  constraints: ['1 <= length <= 12'],
  examples: [
    { input: 's = aba', output: '2' },
  ],
  hints: ['A one-character piece is always a palindrome.', 'List the partitions of aba.'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
  explanation: {
    overview: 'Count all partitions where every piece is a palindrome.',
    algorithm: 'Try every end position from the current start, and recurse only when the piece is a palindrome.',
    bug: 'The condition rejects pieces of length one by requiring the end to be greater than the start.',
    whyItFails: 'Partitions that use single characters, which are always valid palindromes, are lost.',
    failingTestCase: 's = aba: the code prints 1 instead of 2.',
    fix: 'Accept any palindrome piece, including length one.',
    whyFixWorks: 'Single characters are valid pieces and are needed for the fully split partition a, b, a.',
    dryRun: 'For aba, the valid partitions are a|b|a and aba. Rejecting length-one pieces leaves only aba.',
    debuggingLesson: 'When partitioning, verify that the shortest valid piece is not accidentally excluded by an extra length check.',
  },
  testCases: [{ input: 'aba', expected: '2' }],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.countPartitions("aba"));`,
      python: `print(count_partitions("aba"))`,
      c: `printf("%d", count_partitions("aba", 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean pal(String s, int i, int j) {
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) return false;
            i++;
            j--;
        }
        return true;
    }
    static void dfs(String s, int start, int[] count) {
        if (start == s.length()) {
            count[0]++;
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (pal(s, start, end)) {
                dfs(s, end + 1, count);
            }
        }
    }
    static int countPartitions(String s) {
        int[] count = new int[1];
        dfs(s, 0, count);
        return count[0];
    }
}
`,
      bugs: { 16: { was: 'if (pal(s, start, end))', buggy: 'if (pal(s, start, end) && end > start) {' } },
    },
    python: {
      correct: `
def count_partitions(s):
    count = [0]
    def pal(i, j):
        while i < j:
            if s[i] != s[j]:
                return False
            i += 1
            j -= 1
        return True
    def dfs(start):
        if start == len(s):
            count[0] += 1
            return
        for end in range(start, len(s)):
            if pal(start, end):
                dfs(end + 1)
    dfs(0)
    return count[0]
`,
      bugs: { 15: { was: 'if pal(start, end):', buggy: 'if pal(start, end) and end > start:' } },
    },
    c: {
      correct: `
int pal(char s[], int i, int j) {
    while (i < j) {
        if (s[i] != s[j]) return 0;
        i++;
        j--;
    }
    return 1;
}
void dfs(char s[], int n, int start, int *count) {
    if (start == n) {
        (*count)++;
        return;
    }
    for (int end = start; end < n; end++) {
        if (pal(s, start, end)) {
            dfs(s, n, end + 1, count);
        }
    }
}
int count_partitions(char s[], int n) {
    int count = 0;
    dfs(s, n, 0, &count);
    return count;
}
`,
      bugs: { 15: { was: 'if (pal(s, start, end))', buggy: 'if (pal(s, start, end) && end > start) {' } },
    },
  },
});
