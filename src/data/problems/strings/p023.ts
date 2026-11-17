import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p023',
  title: 'The shared prefix ends too early',
  difficulty: 'Medium',
  topic: 'Strings',
  subtopic: 'Longest Common Prefix',
  tags: ['Strings', 'Prefix', 'Multiple Strings'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Longest common prefix comparison pattern',
  description:
    'Given a list of strings, return the longest prefix shared by every string. Return an empty string if no non-empty prefix is shared.',
  constraints: ['1 <= strings.length <= 1000', '0 <= strings[i].length <= 1000'],
  examples: [
    { input: 'strings = ["flower", "flow", "flight"]', output: '"fl"' },
    { input: 'strings = ["dog", "racecar", "car"]', output: '""' },
  ],
  hints: [
    'The shortest string places an upper limit on the possible answer.',
    'Pay attention to the last valid character index.',
  ],
  complexity: { time: 'O(n * m)', space: 'O(1)' },
  explanation: {
    overview:
      'Find the longest sequence of starting characters shared by every string.',
    algorithm:
      'Use the first string as the reference. For each character position, compare that character with the corresponding character of every remaining string. Stop when a string ends or a mismatch occurs.',
    bug:
      'The comparison loop stops one index early, so the final character of the reference string is never compared.',
    whyItFails:
      'The loop condition excludes the last valid index. A mismatch that happens exactly at the last character of the reference string is never detected, and a prefix that matches fully may lose its final character.',
    failingTestCase:
      'strings = ["ab", "ac"]: the buggy code returns "ab" instead of "a". Some versions instead drop the last character of strings = ["ab", "ab"].',
    fix: 'Allow the loop to continue while i is less than first.length.',
    whyFixWorks:
      'The final character is now checked along with every preceding character, while the existing mismatch and length checks still stop the search safely.',
    dryRun:
      'For ["ab", "ac"], the first string has length 2. At i=0, both strings contain a, so the prefix continues. At i=1, b and c differ, so the answer is "a". The buggy loop stops after i=0, never sees the mismatch, and returns the whole first string "ab".',
    debuggingLesson:
      'For string comparisons, distinguish between a string length and its final valid index. A loop using index < length must include index length - 1.',
  },
  testCases: [
    { input: '["ab", "ab"]', expected: '"ab"' },
    { input: '["ab", "ac"]', expected: '"a"', buggyOutput: '"ab"' },
    { input: '["flower", "flow", "flight"]', expected: '"fl"' },
    { input: '["dog", "racecar", "car"]', expected: '""' },
  ],
  harness: {
    expected: 'ab a fl #',
    driver: {
      java: `System.out.println(Solution.longestCommonPrefix(new String[]{"ab", "ab"}) + " " + Solution.longestCommonPrefix(new String[]{"ab", "ac"}) + " " + Solution.longestCommonPrefix(new String[]{"flower", "flow", "flight"}) + " " + (Solution.longestCommonPrefix(new String[]{"dog", "racecar", "car"}).isEmpty() ? "#" : "X"));`,
      python: `print(longest_common_prefix(["ab", "ab"]), longest_common_prefix(["ab", "ac"]), longest_common_prefix(["flower", "flow", "flight"]), longest_common_prefix(["dog", "racecar", "car"]) or "#")`,
      c: `printf("%s ", longest_common_prefix((char *[]){"ab", "ab"}, 2));
printf("%s ", longest_common_prefix((char *[]){"ab", "ac"}, 2));
printf("%s ", longest_common_prefix((char *[]){"flower", "flow", "flight"}, 3));
char *r = longest_common_prefix((char *[]){"dog", "racecar", "car"}, 3);
printf("%s", r[0] ? r : "#");`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static String longestCommonPrefix(String[] words) {
        String first = words[0];
        for (int i = 0; i < first.length(); i++) {
            char ch = first.charAt(i);
            for (int j = 1; j < words.length; j++) {
                if (i >= words[j].length() || words[j].charAt(i) != ch) {
                    return first.substring(0, i);
                }
            }
        }
        return first;
    }
}
`,
      bugs: {
        4: {
          was: 'i < first.length()',
          buggy: 'for (int i = 0; i < first.length() - 1; i++) {',
        },
      },
    },
    python: {
      correct: `
def longest_common_prefix(words):
    first = words[0]
    for i in range(len(first)):
        ch = first[i]
        for word in words[1:]:
            if i >= len(word) or word[i] != ch:
                return first[:i]
    return first
`,
      bugs: {
        3: {
          was: 'range(len(first))',
          buggy: 'for i in range(len(first) - 1):',
        },
      },
    },
    c: {
      correct: `
#include <string.h>
char *longest_common_prefix(char *words[], int n) {
    static char result[1001];
    int len = strlen(words[0]);
    int i = 0;
    for (i = 0; i < len; i++) {
        char ch = words[0][i];
        for (int j = 1; j < n; j++) {
            if (i >= strlen(words[j]) || words[j][i] != ch) {
                result[i] = '\\0';
                return result;
            }
        }
        result[i] = ch;
    }
    result[i] = '\\0';
    return result;
}
`,
      bugs: {
        6: {
          was: 'i < len',
          buggy: 'for (i = 0; i < len - 1; i++) {',
        },
      },
    },
  },
});
