import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p221',
  title: 'Merge of two lists loses the last left value',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Merging Sorted Arrays',
  tags: ['Merge', 'Sorted Arrays'],
  bugCategory: 'Collection-related Logical Error',
  sourceInspiredBy: 'Merge two sorted arrays pattern',
  description:
    'Merge two sorted arrays into one sorted array. The current leftover loop stops before the last element of the first array.',
  constraints: ['0 <= a.length, b.length <= 100000', 'Both input arrays are sorted'],
  examples: [
    { input: 'a = [1,3,5], b = [2,4]', output: '1 2 3 4 5' },
  ],
  hints: ['After the main loop, one array may still have multiple values.', 'Check the leftover loop for the first array.'],
  complexity: { time: 'O(n + m)', space: 'O(n + m)' },
  explanation: {
    overview: 'Merge two already sorted arrays.',
    algorithm: 'Compare the fronts of both arrays, append the smaller value, then append any leftovers.',
    bug: 'The leftover loop for a uses i < a.length - 1 instead of i < a.length.',
    whyItFails: 'If a still has values, the last one is never copied and the result keeps a default value.',
    failingTestCase: 'a = [1,3,5], b = [2,4] returns 1 2 3 4 0 instead of 1 2 3 4 5.',
    fix: 'Use while (i < a.length).',
    whyFixWorks: 'All remaining values in a must be copied, including the final one.',
    dryRun: 'After copying 2 and 4, b is empty and a still has 5 at index 2. The buggy loop runs while i < 2 and skips index 2.',
    debuggingLesson: 'Merge routines need independent leftover loops for both inputs.',
  },
  testCases: [
    { input: '[1,3,5], [2,4]', expected: '1 2 3 4 5', buggyOutput: '1 2 3 4 0' },
  ],
  harness: {
    expected: '1 2 3 4 5',
    driver: {
      java: `int[] r = Solution.mergeSorted(new int[]{1,3,5}, new int[]{2,4}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*merge_sorted([1,3,5], [2,4]))`,
      c: `int a[] = {1,3,5}; int b[] = {2,4}; int res[5]; merge_sorted(a, 3, b, 2, res); for (int i = 0; i < 5; i++) { if (i) printf(" "); printf("%d", res[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] mergeSorted(int[] a, int[] b) {
        int[] res = new int[a.length + b.length];
        int i = 0;
        int j = 0;
        int k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) {
                res[k++] = a[i++];
            } else {
                res[k++] = b[j++];
            }
        }
        while (i < a.length) {
            res[k++] = a[i++];
        }
        while (j < b.length) {
            res[k++] = b[j++];
        }
        return res;
    }
}
`,
      bugs: { 14: { was: 'i < a.length', buggy: 'while (i < a.length - 1) {' } },
    },
    python: {
      correct: `
def merge_sorted(a, b):
    res = []
    i = 0
    j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            res.append(a[i])
            i += 1
        else:
            res.append(b[j])
            j += 1
    while i < len(a):
        res.append(a[i])
        i += 1
    while j < len(b):
        res.append(b[j])
        j += 1
    return res
`,
      bugs: { 12: { was: 'i < len(a)', buggy: 'while i < len(a) - 1:' } },
    },
    c: {
      correct: `
void merge_sorted(int a[], int na, int b[], int nb, int res[]) {
    int i = 0;
    int j = 0;
    int k = 0;
    while (i < na && j < nb) {
        if (a[i] <= b[j]) {
            res[k++] = a[i++];
        } else {
            res[k++] = b[j++];
        }
    }
    while (i < na) {
        res[k++] = a[i++];
    }
    while (j < nb) {
        res[k++] = b[j++];
    }
}
`,
      bugs: { 12: { was: 'i < na', buggy: 'while (i < na - 1) {' } },
    },
  },
});
