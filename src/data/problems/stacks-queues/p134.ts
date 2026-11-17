import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p134',
  title: 'Identical values counted twice',
  difficulty: 'Hard',
  topic: 'Stacks and Queues',
  subtopic: 'Monotonic Extent',
  tags: ['Subarray Contribution', 'Duplicate Disambiguation'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Sum of subarray minimums pattern',
  description:
    'Given an array of integers, compute the sum of the minimum elements of every possible contiguous subsegment. The implementation counts identical minimal values multiple times across overlapping subsegments.',
  constraints: ['1 <= n <= 1000', '1 <= a[i] <= 1000'],
  examples: [
    { input: 'a = [2, 2]', output: '6', note: 'Subsegments [2], [2], [2, 2] have minimums 2, 2, 2 totaling 6.' },
    { input: 'a = [3, 1, 2, 4]', output: '17' },
  ],
  hints: [
    'Notice how the left and right extent boundaries are established for each element.',
    'Check whether both boundary scans treat equal values the same way, and consider what happens when duplicate minimum values appear.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Calculate the total contribution of each element as the minimum across all subsegments.',
    algorithm:
      'For each index i, find the span of elements to its left and right where a[i] is minimal. Multiply value by leftSpan * rightSpan. Break ties asymmetrically: pop strictly greater values on the left scan and greater-or-equal values on the right scan.',
    bug: 'Both the left and right boundary scans pop on non-strict inequality (>=), so equal values never act as boundaries on either side.',
    whyItFails:
      'When an array contains duplicate minimums, both elements claim the subsegment containing both of them, double-counting its contribution.',
    failingTestCase: 'a = [2, 2]: returns 8 instead of 6 because the subsegment [2, 2] is credited to both index 0 and index 1.',
    fix: 'Use strict inequality (>) on the left scan and non-strict (>=) on the right scan.',
    whyFixWorks: 'Asymmetric boundary conditions ensure each subsegment with duplicate minimums is assigned uniquely to its first occurrence.',
    dryRun:
      'For [2, 2]: with > on left and >= on right, index 0 has left=1, right=2 (span [2], [2,2], contribution 4). Index 1 has left=1, right=1 (span [2], contribution 2). Total = 6.',
    debuggingLesson:
      'To avoid double counting intervals containing duplicate extrema, use asymmetric comparison operators: strict on one side, non-strict on the other.',
  },
  testCases: [
    { input: 'a = [2, 2]', expected: '6', buggyOutput: '8' },
    { input: 'a = [3, 1, 2, 4]', expected: '17' },
  ],
  harness: {
    expected: '6 17',
    driver: {
      java: `System.out.println(Solution.sumSubarrayMins(new int[]{2, 2}, 2) + " " + Solution.sumSubarrayMins(new int[]{3, 1, 2, 4}, 4));`,
      python: `print(sum_subarray_mins([2, 2], 2), sum_subarray_mins([3, 1, 2, 4], 4))`,
      c: `printf("%d %d", sum_subarray_mins((int[]){2, 2}, 2), sum_subarray_mins((int[]){3, 1, 2, 4}, 4));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int sumSubarrayMins(int[] a, int n) {
        int[] left = new int[n];
        int[] right = new int[n];
        int[] st = new int[n];
        int top = -1;
        for (int i = 0; i < n; i++) {
            while (top >= 0 && a[st[top]] > a[i]) {
                top--;
            }
            left[i] = (top == -1) ? (i + 1) : (i - st[top]);
            st[++top] = i;
        }
        top = -1;
        for (int i = n - 1; i >= 0; i--) {
            while (top >= 0 && a[st[top]] >= a[i]) {
                top--;
            }
            right[i] = (top == -1) ? (n - i) : (st[top] - i);
            st[++top] = i;
        }
        int total = 0;
        for (int i = 0; i < n; i++) {
            total += a[i] * left[i] * right[i];
        }
        return total;
    }
}`,
      bugs: { 8: { was: 'a[st[top]] > a[i]', buggy: '            while (top >= 0 && a[st[top]] >= a[i]) {' } },
    },
    python: {
      correct: `def sum_subarray_mins(a, n):
    left = [0] * n
    right = [0] * n
    st = []
    for i in range(n):
        while st and a[st[-1]] > a[i]:
            st.pop()
        left[i] = i + 1 if not st else i - st[-1]
        st.append(i)
    st = []
    for i in range(n - 1, -1, -1):
        while st and a[st[-1]] >= a[i]:
            st.pop()
        right[i] = n - i if not st else st[-1] - i
        st.append(i)
    total = 0
    for i in range(n):
        total += a[i] * left[i] * right[i]
    return total`,
      bugs: { 6: { was: 'a[st[-1]] > a[i]', buggy: '        while st and a[st[-1]] >= a[i]:' } },
    },
    c: {
      correct: `int sum_subarray_mins(int a[], int n) {
    int left[100];
    int right[100];
    int st[100];
    int top = -1;
    for (int i = 0; i < n; i++) {
        while (top >= 0 && a[st[top]] > a[i]) {
            top--;
        }
        left[i] = (top == -1) ? (i + 1) : (i - st[top]);
        st[++top] = i;
    }
    top = -1;
    for (int i = n - 1; i >= 0; i--) {
        while (top >= 0 && a[st[top]] >= a[i]) {
            top--;
        }
        right[i] = (top == -1) ? (n - i) : (st[top] - i);
        st[++top] = i;
    }
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += a[i] * left[i] * right[i];
    }
    return total;
}`,
      bugs: { 7: { was: 'a[st[top]] > a[i]', buggy: '        while (top >= 0 && a[st[top]] >= a[i]) {' } },
    },
  },
});
