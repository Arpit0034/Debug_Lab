import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p021',
  title: 'Overlapping matches disappear',
  difficulty: 'Easy',
  topic: 'Strings',
  subtopic: 'Substring Occurrence Counting',
  tags: ['Strings', 'Substring', 'Loop Boundary'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Overlapping pattern occurrence counting',
  description:
    'Return the number of times a non-empty pattern appears inside a given text. Matches may overlap. Count every valid starting position.',
  constraints: ['1 <= pattern.length <= text.length <= 100000', 'Strings contain lowercase English letters'],
  examples: [
    { input: 'text = "aaaa", pattern = "aa"', output: '3', note: 'Matches start at positions 0, 1 and 2.' },
    { input: 'text = "abcabc", pattern = "abc"', output: '2' },
  ],
  hints: [
    'Consider whether two consecutive matches can share characters.',
    'Trace the starting index after finding a match.',
  ],
  complexity: { time: 'O(n * m)', space: 'O(1)' },
  explanation: {
    overview: 'Count all occurrences of a pattern in a text, including overlapping occurrences.',
    algorithm:
      'Check every possible starting position in the text. At each position, compare the substring of pattern length with the pattern and increment the count when they match.',
    bug:
      'The loop advances by pattern.length after finding a match instead of advancing by one position.',
    whyItFails:
      'Advancing by the entire pattern length skips starting positions that could contain overlapping matches. A match at one position does not prevent another match from beginning at the next position.',
    failingTestCase: 'text = "aaaa", pattern = "aa": the buggy code returns 2 instead of 3.',
    fix: 'Always advance the starting index by exactly one.',
    whyFixWorks:
      'Every possible starting position is examined, so overlapping and non-overlapping matches are both counted.',
    dryRun:
      'text = "aaaa", pattern = "aa". Correct starting positions are 0, 1 and 2. All three produce a match. The correct count is 3. The buggy version checks position 0, jumps to position 2, counts that match and then finishes with count 2.',
    debuggingLesson:
      'When counting substring occurrences, distinguish between advancing through the text and advancing past a previously matched pattern. Overlapping matches require examining every starting position.',
  },
  testCases: [
    { input: '"aaaa", "aa"', expected: '3', buggyOutput: '2' },
    { input: '"abcabc", "abc"', expected: '2' },
    { input: '"aaaaa", "b"', expected: '0' },
  ],
  harness: {
    expected: '3 2 0',
    driver: {
      java: `System.out.println(Solution.countOccurrences("aaaa", "aa") + " " + Solution.countOccurrences("abcabc", "abc") + " " + Solution.countOccurrences("aaaaa", "b"));`,
      python: `print(count_occurrences("aaaa", "aa"), count_occurrences("abcabc", "abc"), count_occurrences("aaaaa", "b"))`,
      c: `printf("%d %d %d", count_occurrences("aaaa", "aa"), count_occurrences("abcabc", "abc"), count_occurrences("aaaaa", "b"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int countOccurrences(String text, String pattern) {
        int count = 0;
        int n = text.length();
        int m = pattern.length();
        for (int i = 0; i <= n - m; i++) {
            if (text.startsWith(pattern, i)) {
                count++;
            }
        }
        return count;
    }
}
`,
      bugs: {
        6: {
          was: 'i++',
          buggy: 'for (int i = 0; i <= n - m; i += m) {',
        },
      },
    },
    python: {
      correct: `
def count_occurrences(text, pattern):
    count = 0
    n = len(text)
    m = len(pattern)
    for i in range(n - m + 1):
        if text[i:i + m] == pattern:
            count += 1
    return count
`,
      bugs: {
        5: {
          was: 'range(n - m + 1)',
          buggy: 'for i in range(0, n - m + 1, m):',
        },
      },
    },
    c: {
      correct: `
#include <string.h>
int count_occurrences(char text[], char pattern[]) {
    int count = 0;
    int n = strlen(text);
    int m = strlen(pattern);
    for (int i = 0; i <= n - m; i++) {
        if (strncmp(text + i, pattern, m) == 0) {
            count++;
        }
    }
    return count;
}
`,
      bugs: {
        6: {
          was: 'i++',
          buggy: 'for (int i = 0; i <= n - m; i += m) {',
        },
      },
    },
  },
});
