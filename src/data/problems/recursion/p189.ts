import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p189',
  title: 'The reversed text loses its final letter',
  difficulty: 'Easy',
  topic: 'Recursion',
  subtopic: 'String Reversal',
  tags: ['Recursion', 'Strings', 'Reversal'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Recursive string reversal pattern',
  description:
    'Return a string with its characters in reverse order. The last character is omitted before reversing.',
  constraints: ['1 <= length <= 100', 'The string contains lowercase letters'],
  examples: [
    { input: 's = "abc"', output: 'cba' },
    { input: 's = "a"', output: 'a' },
  ],
  hints: ['A successful reversal must include every character.', 'Check the stopping position of the scan.'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  explanation: {
    overview: 'Reverse a string by processing one character at a time.',
    algorithm: 'Move to the end of the string, then append characters while returning from the calls.',
    bug: 'The scan stops at the last character and returns an empty result instead of including it.',
    whyItFails: 'The last character is never appended, so the reversed string is short by one character.',
    failingTestCase: 'For "abc", the correct reverse is "cba", but the code returns "ba".',
    fix: 'Stop only after moving past the end of the string.',
    whyFixWorks: 'That allows the last character to be processed like every other character.',
    dryRun: 'The bug stops at index 2 and returns empty. The unwind appends b then a, giving "ba" instead of "cba".',
    debuggingLesson: 'For recursive string walks, test a one-character string and a two-character string.',
  },
  testCases: [
    { input: '"abc"', expected: 'cba', buggyOutput: 'ba' },
  ],
  harness: {
    expected: 'cba',
    driver: {
      java: `System.out.println(Solution.rev("abc",0));`,
      python: `print(rev("abc",0))`,
      c: `char out[20]; int k=0; rev("abc",0,out,&k); printf("%s", out);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static String rev(String s, int i) {
        if (i == s.length()) {
            return "";
        }
        return rev(s, i + 1) + s.charAt(i);
    }
}
`,
      bugs: { 3: { was: 'if (i == s.length()) {', buggy: 'if (i == s.length() - 1) {' } },
    },
    python: {
      correct: `
def rev(s, i):
    if i == len(s):
        return ""
    return rev(s, i + 1) + s[i]
`,
      bugs: { 2: { was: 'if i == len(s):', buggy: 'if i == len(s) - 1:' } },
    },
    c: {
      correct: `
void rev(char s[], int i, char out[], int *k) {
    if (s[i] == 0) {
        out[*k] = 0;
        return;
    }
    rev(s, i + 1, out, k);
    out[(*k)++] = s[i];
}
`,
      bugs: { 2: { was: 'if (s[i] == 0) {', buggy: 'if (s[i + 1] == 0) {' } },
    },
  },
});
