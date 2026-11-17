import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p220',
  title: 'Quickselect asks for the wrong rank',
  difficulty: 'Hard',
  topic: 'Sorting',
  subtopic: 'Quickselect',
  tags: ['Quickselect', 'Partition'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'Kth largest via partition pattern',
  description:
    'Return the kth largest value in an array. The current code computes the wrong target rank and returns the next value.',
  constraints: ['1 <= n <= 100000', '1 <= k <= n', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [3,2,1,5,6,4], k = 2', output: '5' },
  ],
  hints: ['The kth largest corresponds to which index after sorting ascending?', 'Trace k=2 in a length 6 array.'],
  complexity: { time: 'O(n) average', space: 'O(1)' },
  explanation: {
    overview: 'Find the kth largest value using partitioning.',
    algorithm: 'The kth largest is at index n - k in ascending order. Partition until that index is reached.',
    bug: 'The target index is computed as n - k - 1 instead of n - k.',
    whyItFails: 'The code returns the value one position before the true rank.',
    failingTestCase: 'a = [3,2,1,5,6,4], k = 2 returns 4 instead of 5.',
    fix: 'Use int target = a.length - k.',
    whyFixWorks: 'For k=2 in length 6, the target ascending index is 4, which holds the second largest value.',
    dryRun: 'The first partition places 4 at index 3. The correct target is 4, so the search continues right and finds 5. The buggy target 3 stops at 4.',
    debuggingLesson: 'Rank conversions between largest and smallest must be checked with a small example.',
  },
  testCases: [
    { input: '[3,2,1,5,6,4], 2', expected: '5', buggyOutput: '4' },
  ],
  harness: {
    expected: '5',
    driver: {
      java: `System.out.println(Solution.kthLargest(new int[]{3,2,1,5,6,4}, 2));`,
      python: `print(kth_largest([3,2,1,5,6,4], 2))`,
      c: `printf("%d", kth_largest((int[]){3,2,1,5,6,4}, 6, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int kthLargest(int[] a, int k) {
        int target = a.length - k;
        int lo = 0;
        int hi = a.length - 1;
        while (lo <= hi) {
            int p = partition(a, lo, hi);
            if (p == target) {
                return a[p];
            } else if (p < target) {
                lo = p + 1;
            } else {
                hi = p - 1;
            }
        }
        return -1;
    }
    static int partition(int[] a, int lo, int hi) {
        int pivot = a[hi];
        int i = lo;
        for (int j = lo; j < hi; j++) {
            if (a[j] < pivot) {
                int t = a[i];
                a[i] = a[j];
                a[j] = t;
                i++;
            }
        }
        int t = a[i];
        a[i] = a[hi];
        a[hi] = t;
        return i;
    }
}
`,
      bugs: { 3: { was: 'a.length - k', buggy: 'int target = a.length - k - 1;' } },
    },
    python: {
      correct: `
def kth_largest(a, k):
    target = len(a) - k
    lo = 0
    hi = len(a) - 1
    while lo <= hi:
        p = partition(a, lo, hi)
        if p == target:
            return a[p]
        elif p < target:
            lo = p + 1
        else:
            hi = p - 1
    return -1
def partition(a, lo, hi):
    pivot = a[hi]
    i = lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    return i
`,
      bugs: { 2: { was: 'len(a) - k', buggy: 'target = len(a) - k - 1' } },
    },
    c: {
      correct: `
int partition(int a[], int lo, int hi) {
    int pivot = a[hi];
    int i = lo;
    for (int j = lo; j < hi; j++) {
        if (a[j] < pivot) {
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
            i++;
        }
    }
    int t = a[i];
    a[i] = a[hi];
    a[hi] = t;
    return i;
}
int kth_largest(int a[], int n, int k) {
    int target = n - k;
    int lo = 0;
    int hi = n - 1;
    while (lo <= hi) {
        int p = partition(a, lo, hi);
        if (p == target) {
            return a[p];
        } else if (p < target) {
            lo = p + 1;
        } else {
            hi = p - 1;
        }
    }
    return -1;
}
`,
      bugs: { 18: { was: 'n - k', buggy: 'int target = n - k - 1;' } },
    },
  },
});
