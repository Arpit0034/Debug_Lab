import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p216',
  title: 'Bubble sort exits after one pass',
  difficulty: 'Easy',
  topic: 'Sorting',
  subtopic: 'Bubble Sort',
  tags: ['Bubble Sort', 'Early Exit'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Bubble sort with early exit pattern',
  description:
    'Sort an array with adjacent swaps. The current early-exit condition stops after the first pass whenever any swap happened.',
  constraints: ['1 <= n <= 100000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [2,3,1]', output: '1 2 3' },
  ],
  hints: ['A swap means the array changed, not that it is sorted.', 'Check the condition that breaks out of the outer loop.'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
  explanation: {
    overview: 'Sort by repeatedly swapping adjacent out-of-order values.',
    algorithm: 'Repeat passes until a full pass makes no swaps.',
    bug: 'The break condition uses if (swapped) instead of if (!swapped).',
    whyItFails: 'It exits after the first pass that performs any swap, even though later passes are still needed.',
    failingTestCase: 'a = [2,3,1] becomes 2 1 3 instead of 1 2 3.',
    fix: 'Break only when swapped is false.',
    whyFixWorks: 'No swaps in a full pass means the array is already sorted.',
    dryRun: 'Pass one on [2,3,1] leaves [2,1,3] and records a swap. The buggy code breaks at once and returns 2 1 3. The correct code runs a second pass, swaps 2 and 1, and returns 1 2 3.',
    debuggingLesson: 'An early-exit flag should mean no work was needed, not that some work was done.',
  },
  testCases: [
    { input: '[2,3,1]', expected: '1 2 3', buggyOutput: '2 1 3' },
  ],
  harness: {
    expected: '1 2 3',
    driver: {
      java: `int[] r = Solution.bubbleSort(new int[]{2,3,1}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*bubble_sort([2,3,1]))`,
      c: `int a[] = {2,3,1}; bubble_sort(a, 3); for (int i = 0; i < 3; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] bubbleSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
        return a;
    }
}
`,
      bugs: { 14: { was: '!swapped', buggy: 'if (swapped) {' } },
    },
    python: {
      correct: `
def bubble_sort(a):
    n = len(a)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    return a
`,
      bugs: { 9: { was: 'not swapped', buggy: 'if swapped:' } },
    },
    c: {
      correct: `
void bubble_sort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
                swapped = 1;
            }
        }
        if (!swapped) {
            break;
        }
    }
}
`,
      bugs: { 12: { was: '!swapped', buggy: 'if (swapped) {' } },
    },
  },
});
