import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p173',
  title: 'A mismatch is welcomed as a match',
  difficulty: 'Easy',
  topic: 'Recursion',
  subtopic: 'String Palindrome Check',
  tags: ['Recursion', 'Strings', 'Palindrome'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Two-ended palindrome comparison pattern',
  description:
    'Return whether a string reads the same from both ends. The function sometimes accepts strings that differ near one end.',
  constraints: ['1 <= length <= 100', 'The string contains lowercase letters only'],
  examples: [
    { input: 's = "abba"', output: 'true' },
    { input: 's = "abca"', output: 'false' },
  ],
  hints: ['Compare characters from the outside inward.', 'When two compared characters differ, what should be returned immediately?'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Check whether the outer characters match while moving inward.',
    algorithm: 'Compare the left and right characters, then continue with the next inner pair.',
    bug: 'The mismatch branch returns true instead of false.',
    whyItFails: 'As soon as one pair differs, the whole string cannot be a palindrome.',
    failingTestCase: 'For "abca", the first and last characters match but the inner pair differs; the code still returns true.',
    fix: 'Return false when the compared characters differ.',
    whyFixWorks: 'A single unequal pair is enough to disprove the symmetric property.',
    dryRun: 'For "abca": compare a and a, then compare b and c. The correct result is false, but the bug returns true and stops.',
    debuggingLesson: 'For boolean checks, identify which condition is sufficient to reject immediately.',
  },
  testCases: [
    { input: '"abba" and "abca"', expected: '1 0', buggyOutput: '1 1' },
  ],
  harness: {
    expected: '1 0',
    driver: {
      java: `System.out.println((Solution.pal("abba",0,3)?1:0) + " " + (Solution.pal("abca",0,3)?1:0));`,
      python: `print(int(pal("abba",0,3)), int(pal("abca",0,3)))`,
      c: `printf("%d %d", pal("abba",0,3), pal("abca",0,3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean pal(String s, int l, int r) {
        if (l >= r) {
            return true;
        }
        if (s.charAt(l) != s.charAt(r)) {
            return false;
        }
        return pal(s, l + 1, r - 1);
    }
}
`,
      bugs: { 7: { was: 'return false;', buggy: 'return true;' } },
    },
    python: {
      correct: `
def pal(s, l, r):
    if l >= r:
        return True
    if s[l] != s[r]:
        return False
    return pal(s, l + 1, r - 1)
`,
      bugs: { 5: { was: 'return False', buggy: 'return True' } },
    },
    c: {
      correct: `
int pal(char s[], int l, int r) {
    if (l >= r) {
        return 1;
    }
    if (s[l] != s[r]) {
        return 0;
    }
    return pal(s, l + 1, r - 1);
}
`,
      bugs: { 6: { was: 'return 0;', buggy: 'return 1;' } },
    },
  },
});
