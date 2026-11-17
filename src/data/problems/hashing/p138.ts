import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p138',
  title: 'Starting chain skips forward',
  difficulty: 'Medium',
  topic: 'Hashing',
  subtopic: 'Sequence Continuity',
  tags: ['Lookup Set', 'Consecutive Sequence'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Longest consecutive sequence pattern',
  description:
    'Given an unsorted array of numbers, return the length of the longest consecutive sequence of elements where each value increases by exactly 1. The implementation checks the wrong end of sequences when looking for chain starting points.',
  constraints: ['0 <= n <= 1000', '0 <= a[i] < 1000'],
  examples: [
    { input: 'a = [100, 4, 200, 1, 3, 2]', output: '4', note: 'The sequence [1, 2, 3, 4] has length 4.' },
    { input: 'a = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', output: '9' },
  ],
  hints: [
    'Notice the condition that checks whether the current number represents the first element of a streak.',
    'Check whether the test looks for the predecessor or the successor.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Find the length of the longest consecutive streak of numbers in an unsorted list.',
    algorithm:
      'Store all numbers in a fast lookup set. To achieve linear time, only expand upward from numbers x where x - 1 does not exist in the set.',
    bug: 'The condition checks !contains(x + 1) instead of !contains(x - 1).',
    whyItFails:
      'Checking !contains(x + 1) triggers the streak expansion only on elements that have no successor. Then searching for cur + 1 terminates immediately, reporting length 1 for every streak.',
    failingTestCase: 'a = [100, 4, 200, 1, 3, 2]: returns 1 instead of 4 because expansion only starts on elements with no successor.',
    fix: 'Check for the absence of the predecessor: !set.contains(x - 1).',
    whyFixWorks: 'Starting only when x - 1 is absent ensures expansion begins at the true start of each consecutive run.',
    dryRun:
      'For [100, 4, 200, 1, 3, 2]: x=1 has no predecessor 0 in set. While loop finds 2, 3, 4. Length = 4. x=2, 3, 4 are skipped because their predecessors exist. Max = 4.',
    debuggingLesson:
      'When partitioning work by chain origins, always test for the absence of the predecessor (start of chain), not the successor.',
  },
  testCases: [
    { input: '[100, 4, 200, 1, 3, 2]', expected: '4', buggyOutput: '1' },
    { input: '[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', expected: '9' },
  ],
  harness: {
    expected: '4 9',
    driver: {
      java: `System.out.println(Solution.longestConsecutive(new int[]{100, 4, 200, 1, 3, 2}) + " " + Solution.longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}));`,
      python: `print(longest_consecutive([100, 4, 200, 1, 3, 2]), longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]))`,
      c: `printf("%d %d", longest_consecutive((int[]){100, 4, 200, 1, 3, 2}, 6), longest_consecutive((int[]){0, 3, 7, 2, 5, 8, 4, 6, 0, 1}, 10));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int longestConsecutive(int[] a) {
        Set<Integer> set = new HashSet<>();
        for (int x : a) {
            set.add(x);
        }
        int maxLen = 0;
        for (int x : a) {
            if (!set.contains(x - 1)) {
                int cur = x;
                int len = 1;
                while (set.contains(cur + 1)) {
                    cur++;
                    len++;
                }
                if (len > maxLen) {
                    maxLen = len;
                }
            }
        }
        return maxLen;
    }
}`,
      bugs: { 11: { was: 'set.contains(x - 1)', buggy: '            if (!set.contains(x + 1)) {' } },
    },
    python: {
      correct: `def longest_consecutive(a):
    s = set(a)
    max_len = 0
    for x in a:
        if (x - 1) not in s:
            cur = x
            length = 1
            while (cur + 1) in s:
                cur += 1
                length += 1
            if length > max_len:
                max_len = length
    return max_len`,
      bugs: { 5: { was: '(x - 1) not in s', buggy: '        if (x + 1) not in s:' } },
    },
    c: {
      correct: `int longest_consecutive(int a[], int n) {
    int present[1000] = {0};
    for (int i = 0; i < n; i++) {
        if (a[i] >= 0 && a[i] < 1000) {
            present[a[i]] = 1;
        }
    }
    int max_len = 0;
    for (int i = 0; i < n; i++) {
        int x = a[i];
        if (x >= 0 && x < 1000) {
            int prev_exists = (x > 0 && present[x - 1]);
            if (!prev_exists) {
                int cur = x;
                int len = 1;
                while (cur + 1 < 1000 && present[cur + 1]) {
                    cur++;
                    len++;
                }
                if (len > max_len) {
                    max_len = len;
                }
            }
        }
    }
    return max_len;
}`,
      bugs: { 12: { was: '(x > 0 && present[x - 1])', buggy: '            int prev_exists = (x + 1 < 1000 && present[x + 1]);' } },
    },
  },
});
