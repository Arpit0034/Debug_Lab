import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p123',
  title: 'The current day is left uncounted',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Span Tracking',
  tags: ['Span Calculation', 'Index Difference'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Online stock span pattern',
  description:
    'Given a series of daily values, determine for each day the count of consecutive days up to today having a value less than or equal to today. Return the maximum span across all days. The implementation miscounts the length of bounded spans.',
  constraints: ['1 <= n <= 1000', '1 <= a[i] <= 10000'],
  examples: [
    { input: 'a = [100, 80, 60, 70, 60, 75, 85]', output: '6', note: 'Day 6 with value 85 spans 6 consecutive days back to value 80.' },
    { input: 'a = [30, 20, 10]', output: '1' },
  ],
  hints: [
    'Trace how the span length is computed from the difference between the current index and the previous greater index.',
    'Consider whether the difference between two indices includes both endpoints or omits the current element.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Calculate the maximum number of consecutive prior days with values at or below the current day.',
    algorithm:
      'Maintain indices of previous greater elements. For each index i, discard smaller preceding entries. The span is i + 1 if no strictly greater element exists, else i - prev.',
    bug: 'The bounded span subtraction subtracts an extra 1 (i - st[top] - 1), miscounting the span.',
    whyItFails:
      'The count of elements in the half-open interval (prev, i] is i - prev. Subtracting an extra 1 excludes the current day.',
    failingTestCase: 'a = [100, 80, 60, 70, 60, 75, 85]: returns 5 instead of 6.',
    fix: 'Change (i - st[top] - 1) to (i - st[top]).',
    whyFixWorks: 'The difference i - st[top] accurately counts all elements in the half-open interval (st[top], i], which includes index i.',
    dryRun:
      'At index 6 (val 85), previous greater element is 100 at index 0. The span is 6 - 0 = 6 days. With the bug, 6 - 0 - 1 = 5.',
    debuggingLesson:
      'When calculating the length of a range (left, right], the number of elements is right - left, not right - left - 1.',
  },
  testCases: [
    { input: '[100, 80, 60, 70, 60, 75, 85]', expected: '6', buggyOutput: '5' },
    { input: '[30, 20, 10]', expected: '1' },
  ],
  harness: {
    expected: '6 1',
    driver: {
      java: `System.out.println(Solution.maxSpan(new int[]{100, 80, 60, 70, 60, 75, 85}) + " " + Solution.maxSpan(new int[]{30, 20, 10}));`,
      python: `print(max_span([100, 80, 60, 70, 60, 75, 85]), max_span([30, 20, 10]))`,
      c: `printf("%d %d", max_span((int[]){100, 80, 60, 70, 60, 75, 85}, 7), max_span((int[]){30, 20, 10}, 3));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int maxSpan(int[] a) {
        int n = a.length;
        int[] st = new int[n];
        int top = -1;
        int maxS = 0;
        for (int i = 0; i < n; i++) {
            while (top >= 0 && a[st[top]] <= a[i]) {
                top--;
            }
            int span = (top == -1) ? (i + 1) : (i - st[top]);
            if (span > maxS) {
                maxS = span;
            }
            st[++top] = i;
        }
        return maxS;
    }
}`,
      bugs: { 13: { was: 'i - st[top]', buggy: '            int span = (top == -1) ? (i + 1) : (i - st[top] - 1);' } },
    },
    python: {
      correct: `def max_span(a):
    st = []
    max_s = 0
    for i, x in enumerate(a):
        while st and a[st[-1]] <= x:
            st.pop()
        span = (i + 1) if not st else (i - st[-1])
        if span > max_s:
            max_s = span
        st.append(i)
    return max_s`,
      bugs: { 7: { was: 'i - st[-1]', buggy: '        span = (i + 1) if not st else (i - st[-1] - 1)' } },
    },
    c: {
      correct: `int max_span(int a[], int n) {
    int st[100];
    int top = -1;
    int max_s = 0;
    for (int i = 0; i < n; i++) {
        while (top >= 0 && a[st[top]] <= a[i]) {
            top--;
        }
        int span = (top == -1) ? (i + 1) : (i - st[top]);
        if (span > max_s) {
            max_s = span;
        }
        st[++top] = i;
    }
    return max_s;
}`,
      bugs: { 9: { was: 'i - st[top]', buggy: '        int span = (top == -1) ? (i + 1) : (i - st[top] - 1);' } },
    },
  },
});
