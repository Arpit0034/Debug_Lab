import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p144',
  title: 'Obsolete duplicate rewinds the start',
  difficulty: 'Medium',
  topic: 'Hashing',
  subtopic: 'Last Seen Position',
  tags: ['Sliding Horizon', 'Unique Elements'],
  bugCategory: 'Incorrect Sliding Window Update',
  sourceInspiredBy: 'Longest substring without repeating characters pattern',
  description:
    'Given an array of integer tokens, find the length of the longest contiguous subsegment containing all distinct values. The implementation rewinds the subsegment start backward when encountering a previously seen token that occurred before the current subsegment boundary.',
  constraints: ['1 <= n <= 1000', '0 <= a[i] < 256'],
  examples: [
    { input: 'a = [1, 2, 2, 1]', output: '2', note: 'Longest contiguous unique subsegment has length 2 (e.g. [1, 2] or [2, 1]).' },
    { input: 'a = [1, 2, 3, 1]', output: '3' },
  ],
  hints: [
    'Notice how the start pointer is updated when an element has a previous recording in the position table.',
    'Check whether the start pointer can move backwards to an obsolete index smaller than its current position.',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the maximum length of a contiguous sequence with no duplicate elements.',
    algorithm:
      'Maintain a table of each token last seen index. As the right pointer advances, update the start pointer to lastSeen[c] + 1 only if the previous occurrence lies inside the current active window (lastSeen[c] >= start).',
    bug: 'The start pointer is updated whenever the token was seen at all (last[c] >= 0), without checking that the previous occurrence is inside the current window (last[c] >= start).',
    whyItFails:
      'If a duplicate token was recorded before the current start pointer, updating start = last[c] + 1 moves the window boundary backward, reintroducing older duplicates into the window.',
    failingTestCase: 'a = [1, 2, 2, 1]: at i=3 (value 1), last seen at index 0 rewinds start from 2 back to 1, inflating the window to length 3 with duplicate 2s.',
    fix: 'Only advance start forward: if (last[c] >= start) start = last[c] + 1.',
    whyFixWorks: 'The start boundary must be monotonic; it can never move backward to expand over old duplicates.',
    dryRun:
      'For [1, 2, 2, 1]: i=0: [1], start=0. i=1: [1,2], start=0. i=2: duplicate 2 at 1, start moves to 2. i=3: 1 was seen at 0. Since 0 < start=2, start remains 2. Window is [2, 1], length 2. Max length = 2.',
    debuggingLesson:
      'When sliding a window forward using historical indices, the start pointer must be monotonically non-decreasing: always take max(start, new_start).',
  },
  testCases: [
    { input: 'a = [1, 2, 2, 1]', expected: '2', buggyOutput: '3' },
    { input: 'a = [1, 2, 3, 1]', expected: '3' },
  ],
  harness: {
    expected: '2 3',
    driver: {
      java: `System.out.println(Solution.longestUniqueSubsegment(new int[]{1, 2, 2, 1}, 4) + " " + Solution.longestUniqueSubsegment(new int[]{1, 2, 3, 1}, 4));`,
      python: `print(longest_unique_subsegment([1, 2, 2, 1], 4), longest_unique_subsegment([1, 2, 3, 1], 4))`,
      c: `printf("%d %d", longest_unique_subsegment((int[]){1, 2, 2, 1}, 4), longest_unique_subsegment((int[]){1, 2, 3, 1}, 4));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int longestUniqueSubsegment(int[] a, int n) {
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int start = 0;
        int maxLen = 0;
        for (int i = 0; i < n; i++) {
            int c = a[i];
            if (last[c] >= start) {
                start = last[c] + 1;
            }
            last[c] = i;
            int len = i - start + 1;
            if (len > maxLen) {
                maxLen = len;
            }
        }
        return maxLen;
    }
}`,
      bugs: { 11: { was: 'last[c] >= start', buggy: '            if (last[c] >= 0) {' } },
    },
    python: {
      correct: `def longest_unique_subsegment(a, n):
    last = {}
    start = 0
    max_len = 0
    for i in range(n):
        c = a[i]
        if c in last and last[c] >= start:
            start = last[c] + 1
        last[c] = i
        length = i - start + 1
        if length > max_len:
            max_len = length
    return max_len`,
      bugs: { 7: { was: 'last[c] >= start', buggy: '        if c in last and last[c] >= 0:' } },
    },
    c: {
      correct: `int longest_unique_subsegment(int a[], int n) {
    int last[256];
    for (int i = 0; i < 256; i++) last[i] = -1;
    int start = 0;
    int max_len = 0;
    for (int i = 0; i < n; i++) {
        int c = a[i];
        if (last[c] >= start) {
            start = last[c] + 1;
        }
        last[c] = i;
        int len = i - start + 1;
        if (len > max_len) {
            max_len = len;
        }
    }
    return max_len;
}`,
      bugs: { 8: { was: 'last[c] >= start', buggy: '        if (last[c] >= 0) {' } },
    },
  },
});
