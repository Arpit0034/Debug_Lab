import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p016',
  title: 'Window jumps backwards',
  difficulty: 'Medium',
  topic: 'Sliding Window and Two Pointers',
  subtopic: 'Variable-size Window',
  tags: ['Sliding Window', 'Duplicates'],
  bugCategory: 'Incorrect Sliding Window Update',
  sourceInspiredBy: 'Longest substring without repeating characters',
  description: 'Return the length of the longest substring with no repeated character. Most inputs work, but some strings give a length that is too large.',
  constraints: ['0 <= length <= 100000', 'Characters are ASCII'],
  examples: [
    { input: 's = "abcabcbb"', output: '3' },
    { input: 's = "abba"', output: '2', note: 'The buggy code returns 3.' },
  ],
  hints: ['Can the left edge of the window ever move left? Trace "abba".'],
  complexity: { time: 'O(n)', space: 'O(k)' },
  complexityOverrides: { c: { time: 'O(n)', space: 'O(1)' } },
  explanation: {
    overview: 'Find the longest stretch of characters that are all different.',
    algorithm: 'Keep a window [left, right]. Remember the last index of each character. When the new character was seen inside the window, move left just past that earlier occurrence.',
    bug: 'left is set to last[c] + 1 without taking the maximum with its current value.',
    whyItFails: 'A character can appear in the map from before the window started. Using its old position pulls left backwards and brings already-excluded characters back into the window.',
    failingTestCase: 's = "abba": at the final a, last[a] = 0 so left becomes 1, although left is already 2. The window "bba" is counted as length 3.',
    fix: 'Use left = max(left, last[c] + 1).',
    whyFixWorks: 'The left edge only ever moves forward, so the window never contains a repeat.',
    dryRun: '"abba". right=0 a. right=1 b. right=2 b: left=2. right=3 a: last[a]=0 so max(2, 1) = 2, window "ba", length 2. Best stays 2.',
    debuggingLesson: 'In sliding windows, ask whether an edge is allowed to move backwards. If not, the update needs a max or min.',
  },
  testCases: [{ input: '"abba"', expected: '2', buggyOutput: '3' }],
  harness: {
    expected: '2 3',
    driver: {
      java: `System.out.println(Solution.longestUnique("abba") + " " + Solution.longestUnique("abcabcbb"));`,
      python: `print(longest_unique("abba"), longest_unique("abcabcbb"))`,
      c: `printf("%d %d", longest_unique("abba"), longest_unique("abcabcbb"));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int longestUnique(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last.containsKey(c)) {
                left = Math.max(left, last.get(c) + 1);
            }
            last.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
`,
      bugs: { 10: { was: 'Math.max', buggy: 'left = last.get(c) + 1;' } },
    },
    python: {
      correct: `
def longest_unique(s):
    last = {}
    left = 0
    best = 0
    for right, c in enumerate(s):
        if c in last:
            left = max(left, last[c] + 1)
        last[c] = right
        best = max(best, right - left + 1)
    return best
`,
      bugs: { 7: { was: 'max(', buggy: 'left = last[c] + 1' } },
    },
    c: {
      correct: `
int longest_unique(const char *s) {
    int last[256];
    for (int i = 0; i < 256; i++) {
        last[i] = -1;
    }
    int left = 0, best = 0;
    for (int right = 0; s[right]; right++) {
        unsigned char c = (unsigned char)s[right];
        if (last[c] >= 0) {
            left = last[c] + 1 > left ? last[c] + 1 : left;
        }
        last[c] = right;
        if (right - left + 1 > best) {
            best = right - left + 1;
        }
    }
    return best;
}
`,
      bugs: { 10: { was: '> left', buggy: 'left = last[c] + 1;' } },
    },
  },
});
