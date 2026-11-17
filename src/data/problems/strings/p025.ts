import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p025',
  title: 'The final character never gets encoded',
  difficulty: 'Medium',
  topic: 'Strings',
  subtopic: 'Run-Length Encoding',
  tags: ['Strings', 'Compression', 'Character Counting'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Run-length encoding pattern',
  description:
    'Compress a string by replacing each consecutive group of identical characters with the character followed by its frequency. Groups of length one must also include the count. Return the compressed string.',
  constraints: ['1 <= s.length <= 100000', 'The string contains lowercase English letters'],
  examples: [
    { input: 's = "aaabbc"', output: '"a3b2c1"' },
    { input: 's = "abcd"', output: '"a1b1c1d1"' },
  ],
  hints: [
    'A group is complete when the next character differs or the string ends.',
    'Check whether the final group receives the same treatment as earlier groups.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview:
      'Convert consecutive runs of identical characters into character-frequency pairs.',
    algorithm:
      'Maintain the first index of the current group. Scan through the string, and whenever the current character differs from the next one, append the group character and its length to the result. The final group must also be appended.',
    bug:
      'The loop processes only indices smaller than the last valid index, so the final character is never processed as the end of a group.',
    whyItFails:
      'The algorithm relies on detecting a character change to finish a group. However, the final group has no following character to trigger that condition. Excluding the final index means that group is never appended.',
    failingTestCase:
      's = "aaabbc": the buggy code returns "a3b2" instead of "a3b2c1".',
    fix:
      'Iterate through all character indices and explicitly process the final character as the end of the last group.',
    whyFixWorks:
      'The final index is now examined. Its end-of-string condition guarantees that the last group is appended even when no subsequent character exists.',
    dryRun:
      'For "aaabbc", indices 0 and 1 continue the first group. At index 2, the next character is b, so a3 is appended. At index 4, the next character is c, so b2 is appended. At index 5, there is no next character, so c1 must be appended. The correct result is "a3b2c1".',
    debuggingLesson:
      'Whenever processing groups of consecutive elements, separately verify how the final group is flushed. The absence of a following element must be treated as a valid group boundary.',
  },
  testCases: [
    { input: '"aaabbc"', expected: '"a3b2c1"', buggyOutput: '"a3b2"' },
    { input: '"abcd"', expected: '"a1b1c1d1"' },
    { input: '"aaaa"', expected: '"a4"' },
  ],
  harness: {
    expected: 'a3b2c1 a1b1c1d1 a4',
    driver: {
      java: `System.out.println(Solution.compress("aaabbc") + " " + Solution.compress("abcd") + " " + Solution.compress("aaaa"));`,
      python: `print(compress("aaabbc"), compress("abcd"), compress("aaaa"))`,
      c: `printf("%s ", compress("aaabbc"));
printf("%s ", compress("abcd"));
printf("%s", compress("aaaa"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static String compress(String s) {
        StringBuilder result = new StringBuilder();
        int start = 0;
        for (int i = 0; i < s.length(); i++) {
            if (i == s.length() - 1 || s.charAt(i) != s.charAt(i + 1)) {
                result.append(s.charAt(start));
                result.append(i - start + 1);
                start = i + 1;
            }
        }
        return result.toString();
    }
}
`,
      bugs: {
        5: {
          was: 'i < s.length()',
          buggy: 'for (int i = 0; i < s.length() - 1; i++) {',
        },
      },
    },
    python: {
      correct: `
def compress(s):
    result = []
    start = 0
    for i in range(len(s)):
        if i == len(s) - 1 or s[i] != s[i + 1]:
            result.append(s[start])
            result.append(str(i - start + 1))
            start = i + 1
    return ''.join(result)
`,
      bugs: {
        4: {
          was: 'range(len(s))',
          buggy: 'for i in range(len(s) - 1):',
        },
      },
    },
    c: {
      correct: `
#include <string.h>
char *compress(char s[]) {
    static char result[200001];
    int start = 0;
    int pos = 0;
    int n = strlen(s);
    for (int i = 0; i < n; i++) {
        if (i == n - 1 || s[i] != s[i + 1]) {
            result[pos++] = s[start];
            int count = i - start + 1;
            pos += sprintf(result + pos, "%d", count);
            start = i + 1;
        }
    }
    result[pos] = '\\0';
    return result;
}
`,
      bugs: {
        7: {
          was: 'i < n',
          buggy: 'for (int i = 0; i < n - 1; i++) {',
        },
      },
    },
  },
});
