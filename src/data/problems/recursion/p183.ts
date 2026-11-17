import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p183',
  title: 'The last letter is never heard',
  difficulty: 'Medium',
  topic: 'Recursion',
  subtopic: 'String Traversal',
  tags: ['Recursion', 'Strings', 'Counting'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Recursive string scanning pattern',
  description:
    'Return the number of vowel letters in a string. The final character is never inspected.',
  constraints: ['1 <= length <= 100', 'Letters may be upper or lower case'],
  examples: [
    { input: 's = "abcde"', output: '2' },
    { input: 's = "AEI"', output: '3' },
  ],
  hints: ['The scan must reach one position past the last character.', 'Check the stopping position before any character is examined.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Count vowel letters by scanning the string from left to right.',
    algorithm: 'At each position, add one if the character is a vowel, then continue with the next position.',
    bug: 'The scan stops one character early.',
    whyItFails: 'The final character is never counted, even when it is a vowel.',
    failingTestCase: 'For "abcde", the correct count is 2, but the code returns 1 because the final e is skipped.',
    fix: 'Stop only after the index passes the full string length.',
    whyFixWorks: 'An index equal to the length means every character has already been checked.',
    dryRun: 'For "abcde", positions 0 to 3 count a only. Position 4 contains e, but the bug stops there before adding it.',
    debuggingLesson: 'In recursive scans, the stop index should be just beyond the last valid position.',
  },
  testCases: [
    { input: '"abcde"', expected: '2', buggyOutput: '1' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.vowels("abcde",0));`,
      python: `print(vowels("abcde",0))`,
      c: `printf("%d", vowels("abcde",0));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int vowels(String s, int i) {
        if (i == s.length()) {
            return 0;
        }
        char c = Character.toLowerCase(s.charAt(i));
        int add = (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') ? 1 : 0;
        return add + vowels(s, i + 1);
    }
}
`,
      bugs: { 3: { was: 'if (i == s.length()) {', buggy: 'if (i == s.length() - 1) {' } },
    },
    python: {
      correct: `
def vowels(s, i):
    if i == len(s):
        return 0
    c = s[i].lower()
    add = 1 if c in 'aeiou' else 0
    return add + vowels(s, i + 1)
`,
      bugs: { 2: { was: 'if i == len(s):', buggy: 'if i == len(s) - 1:' } },
    },
    c: {
      correct: `
#include <ctype.h>
int vowels(char s[], int i) {
    if (s[i] == 0) {
        return 0;
    }
    char c = tolower(s[i]);
    int add = (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') ? 1 : 0;
    return add + vowels(s, i + 1);
}
`,
      bugs: { 3: { was: 'if (s[i] == 0) {', buggy: 'if (s[i + 1] == 0) {' } },
    },
  },
});
