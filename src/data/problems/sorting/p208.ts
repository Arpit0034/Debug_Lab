import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p208',
  title: 'Merge drops the last left element',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Merge Sort',
  tags: ['Merge Sort', 'Merge Step'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Merge sort merge step pattern',
  description:
    'Sort an array using a recursive split and merge. The current merge step leaves the largest remaining left element out of the copied result.',
  constraints: ['1 <= n <= 100000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [3,4,1,2]', output: '1 2 3 4' },
  ],
  hints: ['After the main merge loop, which side may still have elements?', 'Trace the final merge of [3,4] and [1,2].'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Sort an array by recursively sorting halves and merging them.',
    algorithm: 'Split the array, sort both halves, then merge the two sorted halves into a temporary array.',
    bug: 'The leftover-left loop uses i < m instead of i <= m.',
    whyItFails: 'When the left half still has elements, the last one is skipped and the copied array keeps an old value.',
    failingTestCase: 'a = [3,4,1,2] becomes 1 2 3 2 instead of 1 2 3 4.',
    fix: 'Use while (i <= m) for the leftover left elements.',
    whyFixWorks: 'The left half includes index m, so the loop must process that index.',
    dryRun: 'Merging [3,4] and [1,2], the main loop copies 1 and 2. The buggy left loop copies 3 only and misses 4.',
    debuggingLesson: 'Merge routines need three loops: main, leftover left, leftover right. Check each boundary separately.',
  },
  testCases: [
    { input: '[3,4,1,2]', expected: '1 2 3 4', buggyOutput: '1 2 3 2' },
  ],
  harness: {
    expected: '1 2 3 4',
    driver: {
      java: `int[] r = Solution.mergeSort(new int[]{3,4,1,2}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*merge_sort([3,4,1,2]))`,
      c: `int a[] = {3,4,1,2}; merge_sort(a, 4); for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] mergeSort(int[] a) {
        sort(a, 0, a.length - 1);
        return a;
    }
    static void sort(int[] a, int l, int r) {
        if (l >= r) {
            return;
        }
        int m = l + (r - l) / 2;
        sort(a, l, m);
        sort(a, m + 1, r);
        int[] tmp = new int[r - l + 1];
        int i = l;
        int j = m + 1;
        int k = 0;
        while (i <= m && j <= r) {
            if (a[i] <= a[j]) {
                tmp[k++] = a[i++];
            } else {
                tmp[k++] = a[j++];
            }
        }
        while (i <= m) {
            tmp[k++] = a[i++];
        }
        while (j <= r) {
            tmp[k++] = a[j++];
        }
        for (int p = 0; p < tmp.length; p++) {
            a[l + p] = tmp[p];
        }
    }
}
`,
      bugs: { 24: { was: 'i <= m', buggy: 'while (i < m) {' } },
    },
    python: {
      correct: `
def merge_sort(a):
    sort(a, 0, len(a) - 1)
    return a
def sort(a, l, r):
    if l >= r:
        return
    m = l + (r - l) // 2
    sort(a, l, m)
    sort(a, m + 1, r)
    tmp = [0] * (r - l + 1)
    i = l
    j = m + 1
    k = 0
    while i <= m and j <= r:
        if a[i] <= a[j]:
            tmp[k] = a[i]
            i += 1
        else:
            tmp[k] = a[j]
            j += 1
        k += 1
    while i <= m:
        tmp[k] = a[i]
        i += 1
        k += 1
    while j <= r:
        tmp[k] = a[j]
        j += 1
        k += 1
    for p in range(len(tmp)):
        a[l + p] = tmp[p]
`,
      bugs: { 22: { was: 'while i <= m:', buggy: 'while i < m:' } },
    },
    c: {
      correct: `
void sort(int a[], int l, int r) {
    if (l >= r) {
        return;
    }
    int m = l + (r - l) / 2;
    sort(a, l, m);
    sort(a, m + 1, r);
    int tmp[100];
    int i = l;
    int j = m + 1;
    int k = 0;
    while (i <= m && j <= r) {
        if (a[i] <= a[j]) {
            tmp[k++] = a[i++];
        } else {
            tmp[k++] = a[j++];
        }
    }
    while (i <= m) {
        tmp[k++] = a[i++];
    }
    while (j <= r) {
        tmp[k++] = a[j++];
    }
    for (int p = 0; p < k; p++) {
        a[l + p] = tmp[p];
    }
}
void merge_sort(int a[], int n) {
    sort(a, 0, n - 1);
}
`,
      bugs: { 19: { was: 'i <= m', buggy: 'while (i < m) {' } },
    },
  },
});
