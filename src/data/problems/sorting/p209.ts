import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p209',
  title: 'Partition loop stops before the pivot',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Quick Sort Partition',
  tags: ['Quick Sort', 'Partition'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Lomuto partition pattern',
  description:
    'Sort an array using a pivot-based partition. The current partition loop stops one element early and leaves the array unsorted.',
  constraints: ['1 <= n <= 100000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [2,1,3]', output: '1 2 3' },
  ],
  hints: ['Which index is the pivot stored at before the final swap?', 'Check the range of j in the partition loop.'],
  complexity: { time: 'O(n log n) average', space: 'O(log n)' },
  explanation: {
    overview: 'Sort an array by partitioning around a pivot and recursing.',
    algorithm: 'Use the last element as the pivot. Move smaller elements to the front, place the pivot, then recurse on both sides.',
    bug: 'The partition loop uses j < hi - 1 instead of j < hi.',
    whyItFails: 'The element just before the pivot is never considered, so the partition is wrong and the array can remain unsorted.',
    failingTestCase: 'a = [2,1,3] becomes 2 3 1 instead of 1 2 3.',
    fix: 'Use for (j = lo; j < hi; j++) in the partition loop.',
    whyFixWorks: 'All elements before the pivot index hi must be examined exactly once.',
    dryRun: 'For [2,1,3], pivot=3. The buggy loop only checks index 0, then swaps the pivot into the wrong place and returns [2,3,1].',
    debuggingLesson: 'Partition loops should scan exactly the non-pivot segment, no more and no less.',
  },
  testCases: [
    { input: '[2,1,3]', expected: '1 2 3', buggyOutput: '2 3 1' },
  ],
  harness: {
    expected: '1 2 3',
    driver: {
      java: `int[] r = Solution.quickSort(new int[]{2,1,3}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*quick_sort([2,1,3]))`,
      c: `int a[] = {2,1,3}; quick_sort(a, 3); for (int i = 0; i < 3; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] quickSort(int[] a) {
        qs(a, 0, a.length - 1);
        return a;
    }
    static void qs(int[] a, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int p = partition(a, lo, hi);
        qs(a, lo, p - 1);
        qs(a, p + 1, hi);
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
      bugs: { 17: { was: 'j < hi', buggy: 'for (int j = lo; j < hi - 1; j++) {' } },
    },
    python: {
      correct: `
def quick_sort(a):
    qs(a, 0, len(a) - 1)
    return a
def qs(a, lo, hi):
    if lo >= hi:
        return
    p = partition(a, lo, hi)
    qs(a, lo, p - 1)
    qs(a, p + 1, hi)
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
      bugs: { 13: { was: 'range(lo, hi)', buggy: 'for j in range(lo, hi - 1):' } },
    },
    c: {
      correct: `
void qs(int a[], int lo, int hi) {
    if (lo >= hi) {
        return;
    }
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
    int p = i;
    qs(a, lo, p - 1);
    qs(a, p + 1, hi);
}
void quick_sort(int a[], int n) {
    qs(a, 0, n - 1);
}
`,
      bugs: { 7: { was: 'j < hi', buggy: 'for (int j = lo; j < hi - 1; j++) {' } },
    },
  },
});
