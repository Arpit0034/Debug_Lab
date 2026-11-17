import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p147',
  title: 'The first unique character is skipped',
  difficulty: 'Easy',
  topic: 'Strings',
  subtopic: 'Character Frequency',
  tags: ['String', 'Frequency', 'Index'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Finding the first non-repeating character',
  description: 'Return the index of the first character that occurs exactly once, or -1 if no such character exists.',
  constraints: ['1 <= s.length <= 100000', 's contains lowercase English letters'],
  examples: [{ input: '"swiss"', output: '1' }, { input: '"aabb"', output: '-1' }],
  hints: ['Count occurrences before choosing an index.', 'The returned position is an index, not a character count.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Identify the earliest character with frequency one.',
    algorithm: 'Count each letter, then scan the string from left to right.',
    bug: 'The second scan begins at index one.',
    whyItFails: 'A unique character at the first position is never considered.',
    failingTestCase: '"abcd" should return 0 but the mutated loop misses that position.',
    fix: 'Start the second scan at index zero.',
    whyFixWorks: 'Every character is considered in original order.',
    dryRun: 'For "abcd", every count is one; index zero is the first valid answer.',
    debuggingLesson: 'Two-pass string tasks often require the second pass to include the first position.'
  },
  testCases: [{ input: '"abcd"', expected: '0', buggyOutput: '1' }],
  harness: { expected: '0', driver: { java: 'System.out.print(Solution.firstUnique("abcd"));', python: 'print(first_unique("abcd"))', c: 'printf("%d", first_unique("abcd"));' } },
  code: {
    java: { correct: `
class Solution {
    static int firstUnique(String s) {
        int[] f = new int[26];
        for (int i = 0; i < s.length(); i++) f[s.charAt(i)-'a']++;
        for (int i = 0; i < s.length(); i++)
            if (f[s.charAt(i)-'a'] == 1) return i;
        return -1;
    }
}
`, bugs: { 5: { was: 'for (int i = 0; i < s.length(); i++)', buggy: 'for (int i = 1; i < s.length(); i++)' } } },
    python: { correct: `
def first_unique(s):
    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - 97] += 1
    for i, ch in enumerate(s):
        if freq[ord(ch) - 97] == 1:
            return i
    return -1
`, bugs: { 5: { was: 'for i, ch in enumerate(s):', buggy: 'for i, ch in enumerate(s[1:], 1):' } } },
    c: { correct: `
int first_unique(char *s) {
    int f[26] = {0};
    for (int i = 0; s[i]; i++) f[s[i]-'a']++;
    for (int i = 0; s[i]; i++)
        if (f[s[i]-'a'] == 1) return i;
    return -1;
}
`, bugs: { 4: { was: 'for (int i = 0; s[i]; i++)', buggy: 'for (int i = 1; s[i]; i++)' } } }
  }
});
