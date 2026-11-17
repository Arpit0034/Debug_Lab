import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p130',
  title: 'Evicted item stays in window bounds',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Bounded Segment Extremum',
  tags: ['Sliding Extremum', 'Deque Invalidation'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Sliding window maximum pattern',
  description:
    'Given an array of integers and a segment length k, find the maximum value in each contiguous segment of length k. Return the sum of all segment maximums. The solution allows elements that have drifted outside the active segment boundary to remain.',
  constraints: ['1 <= k <= n <= 1000', '-1000 <= a[i] <= 1000'],
  examples: [
    { input: 'a = [10, 1, 1, 1], k = 2', output: '12', note: 'Segments [10,1] -> 10, [1,1] -> 1, [1,1] -> 1. Sum = 12.' },
    { input: 'a = [4, 2, 1], k = 2', output: '6' },
  ],
  hints: [
    'Observe how older indices are pruned when the active segment shifts forward.',
    'Check the comparison operator used to test whether an index falls outside the range [i - k + 1, i].',
  ],
  complexity: { time: 'O(n)', space: 'O(k)' },
  explanation: {
    overview: 'Maintain the maximum of every contiguous k-length segment.',
    algorithm:
      'Maintain a double-ended container of indices in descending order of value. Discard indices that have moved beyond the current segment boundary before recording the maximum from the front.',
    bug: 'The eviction condition uses dq[head] < i - k instead of dq[head] <= i - k.',
    whyItFails:
      'At index i, the segment covers [i - k + 1, i]. An element at index i - k is outside the active segment. Using strict < fails to evict index i - k, allowing outdated maximums to persist.',
    failingTestCase: 'a = [10, 1, 1, 1], k = 2: returns 21 instead of 12 because 10 is not evicted when evaluating the second segment [1, 1].',
    fix: 'Change dq[head] < i - k to dq[head] <= i - k.',
    whyFixWorks: 'The boundary index i - k is strictly to the left of the current valid window, so <= ensures it is removed immediately.',
    dryRun:
      'For [10, 1, 1, 1], k = 2: at i = 1, window [10, 1] has max 10. At i = 2, i - k = 0. Index 0 must be evicted because 0 <= 0. With <=, 10 is evicted and the max of [1, 1] is 1.',
    debuggingLesson:
      'When bounding a window [start, end], any index < start (which equals <= end - k) is invalid and must be evicted.',
  },
  testCases: [
    { input: '[10, 1, 1, 1], n = 4, k = 2', expected: '12', buggyOutput: '21' },
    { input: '[4, 2, 1], n = 3, k = 2', expected: '6' },
  ],
  harness: {
    expected: '12 6',
    driver: {
      java: `System.out.println(Solution.maxSlidingSum(new int[]{10, 1, 1, 1}, 4, 2) + " " + Solution.maxSlidingSum(new int[]{4, 2, 1}, 3, 2));`,
      python: `print(max_sliding_sum([10, 1, 1, 1], 4, 2), max_sliding_sum([4, 2, 1], 3, 2))`,
      c: `printf("%d %d", max_sliding_sum((int[]){10, 1, 1, 1}, 4, 2), max_sliding_sum((int[]){4, 2, 1}, 3, 2));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int maxSlidingSum(int[] a, int n, int k) {
        int[] dq = new int[n];
        int head = 0, tail = 0;
        int total = 0;
        for (int i = 0; i < n; i++) {
            while (head < tail && dq[head] <= i - k) {
                head++;
            }
            while (head < tail && a[dq[tail - 1]] <= a[i]) {
                tail--;
            }
            dq[tail++] = i;
            if (i >= k - 1) {
                total += a[dq[head]];
            }
        }
        return total;
    }
}`,
      bugs: { 7: { was: 'dq[head] <= i - k', buggy: '            while (head < tail && dq[head] < i - k) {' } },
    },
    python: {
      correct: `def max_sliding_sum(a, n, k):
    dq = []
    total = 0
    for i in range(n):
        while dq and dq[0] <= i - k:
            dq.pop(0)
        while dq and a[dq[-1]] <= a[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            total += a[dq[0]]
    return total`,
      bugs: { 5: { was: 'dq[0] <= i - k', buggy: '        while dq and dq[0] < i - k:' } },
    },
    c: {
      correct: `int max_sliding_sum(int a[], int n, int k) {
    int dq[100];
    int head = 0, tail = 0;
    int total = 0;
    for (int i = 0; i < n; i++) {
        while (head < tail && dq[head] <= i - k) {
            head++;
        }
        while (head < tail && a[dq[tail - 1]] <= a[i]) {
            tail--;
        }
        dq[tail++] = i;
        if (i >= k - 1) {
            total += a[dq[head]];
        }
    }
    return total;
}`,
      bugs: { 6: { was: 'dq[head] <= i - k', buggy: '        while (head < tail && dq[head] < i - k) {' } },
    },
  },
});
