import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p012',
  title: 'Partition skips a neighbour',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Quick Sort',
  tags: ['Quick Sort', 'Partition'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Lomuto partition quick sort',
  description: 'Sort an array in place with quick sort. The program finishes, but some arrays come out only partly sorted.',
  constraints: ['0 <= n <= 100000'],
  examples: [{ input: 'a = [5, 1, 4, 2, 3]', output: '[1, 2, 3, 4, 5]', note: 'The buggy code leaves 2 out of place.' }],
  hints: ['Which index does the partition loop never examine?'],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
  explanation: {
    overview: 'Sort by choosing a pivot, placing it correctly, then sorting each side.',
    algorithm: 'Lomuto partition uses the last element as the pivot and scans from lo up to, but not including, hi. Elements smaller than the pivot are moved to the front. Finally the pivot is swapped into place.',
    bug: 'The scan stops one element early, at hi - 1 exclusive.',
    whyItFails: 'The element at hi - 1 is never compared with the pivot. If it is smaller than the pivot it stays on the wrong side, so the pivot lands in a position that is not its sorted position.',
    failingTestCase: 'a = [5, 1, 4, 2, 3]: the 2 is skipped, and the result is [1, 3, 4, 5, 2].',
    fix: 'Scan every index from lo to hi - 1 inclusive, which is j < hi.',
    whyFixWorks: 'Every element other than the pivot is compared exactly once, so the pivot ends with smaller values on its left and larger on its right.',
    dryRun: 'a = [5,1,4,2,3], pivot 3. j=0: 5 no. j=1: 1 yes, swap, i=1. j=2: 4 no. j=3: 2 yes, swap, i=2. Swap pivot into index 2: [1,2,3,4,5].',
    debuggingLesson: 'When a loop bound looks suspicious, ask which element would never be visited, then test with that element in play.',
  },
  testCases: [{ input: '[5, 1, 4, 2, 3]', expected: '[1, 2, 3, 4, 5]', buggyOutput: '[1, 3, 4, 5, 2]' }],
  harness: {
    expected: '[1, 2, 3, 4, 5]',
    driver: {
      java: `int[] a = {5, 1, 4, 2, 3};\nSolution.quickSort(a, 0, a.length - 1);\nSystem.out.println(Arrays.toString(a));`,
      python: `a = [5, 1, 4, 2, 3]\nquick_sort(a, 0, len(a) - 1)\nprint(a)`,
      c: `int a[] = {5, 1, 4, 2, 3};\nquick_sort(a, 0, 4);\nprintf("[");\nfor (int i = 0; i < 5; i++) { printf(i ? ", %d" : "%d", a[i]); }\nprintf("]");`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int p = partition(a, lo, hi);
        quickSort(a, lo, p - 1);
        quickSort(a, p + 1, hi);
    }

    static int partition(int[] a, int lo, int hi) {
        int pivot = a[hi];
        int i = lo;
        for (int j = lo; j < hi; j++) {
            if (a[j] < pivot) {
                int t = a[i]; a[i] = a[j]; a[j] = t;
                i++;
            }
        }
        int t = a[i]; a[i] = a[hi]; a[hi] = t;
        return i;
    }
}
`,
      bugs: { 14: { was: 'j < hi', buggy: 'for (int j = lo; j < hi - 1; j++) {', fixes: ['for (int j = lo; j <= hi - 1; j++) {'] } },
    },
    python: {
      correct: `
def quick_sort(a, lo, hi):
    if lo >= hi:
        return
    p = partition(a, lo, hi)
    quick_sort(a, lo, p - 1)
    quick_sort(a, p + 1, hi)


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
      bugs: { 12: { was: 'range(lo, hi)', buggy: 'for j in range(lo, hi - 1):' } },
    },
    c: {
      correct: `
void swap(int *x, int *y) {
    int t = *x;
    *x = *y;
    *y = t;
}

int partition(int a[], int lo, int hi) {
    int pivot = a[hi];
    int i = lo;
    for (int j = lo; j < hi; j++) {
        if (a[j] < pivot) {
            swap(&a[i], &a[j]);
            i++;
        }
    }
    swap(&a[i], &a[hi]);
    return i;
}

void quick_sort(int a[], int lo, int hi) {
    if (lo >= hi) {
        return;
    }
    int p = partition(a, lo, hi);
    quick_sort(a, lo, p - 1);
    quick_sort(a, p + 1, hi);
}
`,
      bugs: { 10: { was: 'j < hi', buggy: 'for (int j = lo; j < hi - 1; j++) {', fixes: ['for (int j = lo; j <= hi - 1; j++) {'] } },
    },
  },
});
