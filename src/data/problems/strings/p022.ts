import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p022',
  title: 'The first distinct character is overlooked',
  difficulty: 'Medium',
  topic: 'Strings',
  subtopic: 'First Non-Repeating Character',
  tags: ['Strings', 'Frequency Counting', 'Hash Map'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'First unique character frequency pattern',
  description:
    'Return the index of the first character that occurs exactly once in a string. Return -1 if every character occurs more than once.',
  constraints: ['1 <= s.length <= 100000', 'The string contains lowercase English letters'],
  examples: [
    { input: 's = "swiss"', output: '1', note: 'The character w occurs only once.' },
    { input: 's = "aabbcc"', output: '-1' },
  ],
  hints: [
    'The order of characters matters when selecting the answer.',
    'Check what frequency qualifies a character as unique.',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview:
      'Find the earliest character whose total frequency in the string is exactly one.',
    algorithm:
      'First count the frequency of every character. Then traverse the string from left to right and return the first index whose character has frequency one.',
    bug:
      'The second traversal checks whether the frequency is not equal to one instead of checking whether it equals one.',
    whyItFails:
      'The condition selects repeated characters rather than unique characters. Consequently, the function can return an index that does not satisfy the problem requirement.',
    failingTestCase: 's = "swiss": the buggy code returns 0 instead of 1.',
    fix: 'Change the frequency condition to freq[s[i]] == 1.',
    whyFixWorks:
      'A frequency of exactly one identifies characters that occur once. Traversing from left to right guarantees that the earliest such character is selected.',
    dryRun:
      'For "swiss", frequencies are s=3, w=1, i=1. At index 0, s has frequency 3, so it is skipped. At index 1, w has frequency 1, so the answer is 1. The buggy condition instead accepts index 0.',
    debuggingLesson:
      'When implementing frequency-based selection, translate words such as unique, repeated and most frequent into exact numerical conditions before writing comparisons.',
  },
  testCases: [
    { input: '"swiss"', expected: '1', buggyOutput: '0' },
    { input: '"aabbcc"', expected: '-1' },
    { input: '"z"', expected: '0' },
  ],
  harness: {
    expected: '1 -1 0',
    driver: {
      java: `System.out.println(Solution.firstUnique("swiss") + " " + Solution.firstUnique("aabbcc") + " " + Solution.firstUnique("z"));`,
      python: `print(first_unique("swiss"), first_unique("aabbcc"), first_unique("z"))`,
      c: `printf("%d %d %d", first_unique("swiss"), first_unique("aabbcc"), first_unique("z"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int firstUnique(String s) {
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i) - 'a'] == 1) {
                return i;
            }
        }
        return -1;
    }
}
`,
      bugs: {
        8: {
          was: '== 1',
          buggy: "if (freq[s.charAt(i) - 'a'] != 1) {",
        },
      },
    },
    python: {
      correct: `
def first_unique(s):
    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - ord('a')] += 1
    for i in range(len(s)):
        if freq[ord(s[i]) - ord('a')] == 1:
            return i
    return -1
`,
      bugs: {
        6: {
          was: '== 1',
          buggy: "if freq[ord(s[i]) - ord('a')] != 1:",
        },
      },
    },
    c: {
      correct: `
#include <string.h>
int first_unique(char s[]) {
    int freq[26] = {0};
    int n = strlen(s);
    for (int i = 0; i < n; i++) {
        freq[s[i] - 'a']++;
    }
    for (int i = 0; i < n; i++) {
        if (freq[s[i] - 'a'] == 1) {
            return i;
        }
    }
    return -1;
}
`,
      bugs: {
        9: {
          was: '== 1',
          buggy: "if (freq[s[i] - 'a'] != 1) {",
        },
      },
    },
  },
});
