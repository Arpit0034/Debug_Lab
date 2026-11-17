import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p217',
  title: 'Inversion count misses one pair per merge',
  difficulty: 'Hard',
  topic: 'Sorting',
  subtopic: 'Merge Sort Counting',
  tags: ['Merge Sort', 'Counting'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Count inversions with merge sort pattern',
  description:
    'Return the number of inversions in an array. The current merge step undercounts by one whenever a right value is smaller than a left value.',
  constraints: ['1 <= n <= 100000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [2,1,3]', output: '1' },
  ],
  hints: ['When a[j] is smaller, how many left values are still pending?', 'Check the formula added to the count in the else branch.'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Count pairs i < j with a[i] > a[j].',
    algorithm: 'Use merge sort. During merging, when a right value is chosen before remaining left values, each remaining left value forms an inversion with it.',
    bug: 'The count adds m - i instead of m - i + 1.',
    whyItFails: 'The remaining left segment includes index i, so the number of pending left values is one larger.',
    failingTestCase: 'a = [2,1,3] returns 0 instead of 1.',
    fix: 'Add m - i + 1 when taking a value from the right half.',
    whyFixWorks: 'Indices i through m inclusive are all pending and all are greater than a[j].',
    dryRun: 'Merging [2] and [1], i=0 and m=0. The correct count adds 1; the buggy count adds 0.',
    debuggingLesson: 'Counting formulas over inclusive index ranges need the +1 for both endpoints.',
  },
  testCases: [
    { input: '[2,1,3]', expected: '1', buggyOutput: '0' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.countInversions(new int[]{2,1,3}));`,
      python: `print(count_inversions([2,1,3]))`,
      c: `printf("%ld", count_inversions((int[]){2,1,3}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static long countInversions(int[] a) {
        return sort(a, 0, a.length - 1);
    }
    static long sort(int[] a, int l, int r) {
        if (l >= r) {
            return 0;
        }
        int m = l + (r - l) / 2;
        long count = sort(a, l, m) + sort(a, m + 1, r);
        int[] tmp = new int[r - l + 1];
        int i = l;
        int j = m + 1;
        int k = 0;
        while (i <= m && j <= r) {
            if (a[i] <= a[j]) {
                tmp[k++] = a[i++];
            } else {
                count += m - i + 1;
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
        return count;
    }
}
`,
      bugs: { 19: { was: 'm - i + 1', buggy: 'count += m - i;' } },
    },
    python: {
      correct: `
def count_inversions(a):
    return sort(a, 0, len(a) - 1)
def sort(a, l, r):
    if l >= r:
        return 0
    m = l + (r - l) // 2
    count = sort(a, l, m) + sort(a, m + 1, r)
    tmp = [0] * (r - l + 1)
    i = l
    j = m + 1
    k = 0
    while i <= m and j <= r:
        if a[i] <= a[j]:
            tmp[k] = a[i]
            i += 1
        else:
            count += m - i + 1
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
    return count
`,
      bugs: { 17: { was: 'm - i + 1', buggy: 'count += m - i' } },
    },
    c: {
      correct: `
long sort_count(int a[], int l, int r) {
    if (l >= r) {
        return 0;
    }
    int m = l + (r - l) / 2;
    long count = sort_count(a, l, m) + sort_count(a, m + 1, r);
    int tmp[100];
    int i = l;
    int j = m + 1;
    int k = 0;
    while (i <= m && j <= r) {
        if (a[i] <= a[j]) {
            tmp[k++] = a[i++];
        } else {
            count += m - i + 1;
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
    return count;
}
long count_inversions(int a[], int n) {
    return sort_count(a, 0, n - 1);
}
`,
      bugs: { 15: { was: 'm - i + 1', buggy: 'count += m - i;' } },
    },
  },
});
