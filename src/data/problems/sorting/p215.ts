import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p215',
  title: 'Selection sort selects the maximum',
  difficulty: 'Easy',
  topic: 'Sorting',
  subtopic: 'Selection Sort',
  tags: ['Selection Sort', 'Comparison'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'Selection sort pattern',
  description:
    'Sort an array by repeatedly selecting the smallest remaining value. The current comparison selects the largest value instead.',
  constraints: ['1 <= n <= 100000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [3,1,2]', output: '1 2 3' },
  ],
  hints: ['At each position you need the smallest remaining value.', 'Check the comparison that updates the chosen index.'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
  explanation: {
    overview: 'Sort by placing the smallest remaining value at the front.',
    algorithm: 'For each position, scan the rest of the array for the minimum and swap it into place.',
    bug: 'The comparison uses a[j] > a[min] instead of a[j] < a[min].',
    whyItFails: 'The scan finds the maximum instead of the minimum, producing descending order.',
    failingTestCase: 'a = [3,1,2] becomes 3 2 1 instead of 1 2 3.',
    fix: 'Use if (a[j] < a[min]) to update the minimum index.',
    whyFixWorks: 'Only a strictly smaller value should replace the current chosen minimum.',
    dryRun: 'At i=0, the buggy scan ignores 1 and 2 because they are smaller than 3, then swaps with itself. The correct scan chooses 1.',
    debuggingLesson: 'In selection routines, verify whether you are selecting a minimum or a maximum.',
  },
  testCases: [
    { input: '[3,1,2]', expected: '1 2 3', buggyOutput: '3 2 1' },
  ],
  harness: {
    expected: '1 2 3',
    driver: {
      java: `int[] r = Solution.selectionSort(new int[]{3,1,2}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*selection_sort([3,1,2]))`,
      c: `int a[] = {3,1,2}; selection_sort(a, 3); for (int i = 0; i < 3; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] selectionSort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) {
                    min = j;
                }
            }
            int t = a[i];
            a[i] = a[min];
            a[min] = t;
        }
        return a;
    }
}
`,
      bugs: { 6: { was: 'a[j] < a[min]', buggy: 'if (a[j] > a[min]) {' } },
    },
    python: {
      correct: `
def selection_sort(a):
    for i in range(len(a) - 1):
        min_idx = i
        for j in range(i + 1, len(a)):
            if a[j] < a[min_idx]:
                min_idx = j
        a[i], a[min_idx] = a[min_idx], a[i]
    return a
`,
      bugs: { 5: { was: 'a[j] < a[min_idx]', buggy: 'if a[j] > a[min_idx]:' } },
    },
    c: {
      correct: `
void selection_sort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[min_idx]) {
                min_idx = j;
            }
        }
        int t = a[i];
        a[i] = a[min_idx];
        a[min_idx] = t;
    }
}
`,
      bugs: { 5: { was: 'a[j] < a[min_idx]', buggy: 'if (a[j] > a[min_idx]) {' } },
    },
  },
});
