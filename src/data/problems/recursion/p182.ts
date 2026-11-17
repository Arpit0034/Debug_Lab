import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p182',
  title: 'A one-letter target is found too early',
  difficulty: 'Medium',
  topic: 'Recursion',
  subtopic: 'Subsequence Counting',
  tags: ['Recursion', 'Strings', 'Subsequence'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Count distinct subsequences pattern',
  description:
    'Return how many times the second string appears as a subsequence of the first string. A one-character target is reported too few times.',
  constraints: ['1 <= source length <= 30', '1 <= target length <= 10'],
  examples: [
    { input: 'source = "aa", target = "a"', output: '2' },
    { input: 'source = "abc", target = "ac"', output: '1' },
  ],
  hints: ['A target is complete only after all its characters are used.', 'Check the stopping condition for a single-character target.'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
  explanation: {
    overview: 'Count matches of a target string as a subsequence of a source string.',
    algorithm: 'At each source position, either skip the character or, if it matches the next target character, use it and continue.',
    bug: 'The success branch fires when the target index reaches one before its length.',
    whyItFails: 'The last target character has not been matched yet when the index is length minus one, so the count is too small.',
    failingTestCase: 'For source "aa" and target "a", the correct count is 2 but the code returns 1.',
    fix: 'Treat the target as complete only when its index reaches its full length.',
    whyFixWorks: 'The index represents how many target characters have already been matched.',
    dryRun: 'For target "a", index 0 still represents zero matched characters. The bug treats it as complete immediately and stops after one match.',
    debuggingLesson: 'When a recursive index represents progress, verify the meaning of the index at the boundary.',
  },
  testCases: [
    { input: '"aa", "a"', expected: '2', buggyOutput: '1' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.count("aa","a",0,0));`,
      python: `print(count("aa","a",0,0))`,
      c: `printf("%d", count("aa","a",0,0));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int count(String s, String t, int i, int j) {
        if (j == t.length()) {
            return 1;
        }
        if (i == s.length()) {
            return 0;
        }
        int ans = count(s, t, i + 1, j);
        if (s.charAt(i) == t.charAt(j)) {
            ans += count(s, t, i + 1, j + 1);
        }
        return ans;
    }
}
`,
      bugs: { 3: { was: 'if (j == t.length()) {', buggy: 'if (j == t.length() - 1) {' } },
    },
    python: {
      correct: `
def count(s, t, i, j):
    if j == len(t):
        return 1
    if i == len(s):
        return 0
    ans = count(s, t, i + 1, j)
    if s[i] == t[j]:
        ans += count(s, t, i + 1, j + 1)
    return ans
`,
      bugs: { 2: { was: 'if j == len(t):', buggy: 'if j == len(t) - 1:' } },
    },
    c: {
      correct: `
int count(char s[], char t[], int i, int j) {
    if (t[j] == 0) {
        return 1;
    }
    if (s[i] == 0) {
        return 0;
    }
    int ans = count(s, t, i + 1, j);
    if (s[i] == t[j]) {
        ans += count(s, t, i + 1, j + 1);
    }
    return ans;
}
`,
      bugs: { 2: { was: 'if (t[j] == 0) {', buggy: 'if (t[j + 1] == 0) {' } },
    },
  },
});
