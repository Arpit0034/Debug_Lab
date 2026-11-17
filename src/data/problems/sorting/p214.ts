import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p214',
  title: 'Insertion sort forgets index zero',
  difficulty: 'Easy',
  topic: 'Sorting',
  subtopic: 'Insertion Sort',
  tags: ['Insertion Sort', 'Loop Boundary'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Insertion sort pattern',
  description:
    'Sort an array by inserting each element into the sorted prefix. The current code fails to move an element past index zero.',
  constraints: ['1 <= n <= 100000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [3,1,2]', output: '1 2 3' },
  ],
  hints: ['The sorted prefix includes index zero.', 'Check the condition that controls shifting left.'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
  explanation: {
    overview: 'Sort by repeatedly inserting the next value into the sorted prefix.',
    algorithm: 'Shift larger values to the right until the correct insertion point is found.',
    bug: 'The while condition uses j > 0 instead of j >= 0.',
    whyItFails: 'It is impossible to shift the first element, so a value smaller than a[0] can never move to the front.',
    failingTestCase: 'a = [3,1,2] remains 3 1 2 instead of 1 2 3.',
    fix: 'Use while (j >= 0 && a[j] > key).',
    whyFixWorks: 'Index zero is a valid position to compare and shift from.',
    dryRun: 'For key=1, j=0. The buggy j > 0 is false, so 3 is not shifted. The correct j >= 0 shifts 3 right and inserts 1 at index 0.',
    debuggingLesson: 'When a loop walks backward over an inclusive range, check the zero boundary.',
  },
  testCases: [
    { input: '[3,1,2]', expected: '1 2 3', buggyOutput: '3 1 2' },
  ],
  harness: {
    expected: '1 2 3',
    driver: {
      java: `int[] r = Solution.insertionSort(new int[]{3,1,2}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*insertion_sort([3,1,2]))`,
      c: `int a[] = {3,1,2}; insertion_sort(a, 3); for (int i = 0; i < 3; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] insertionSort(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
        return a;
    }
}
`,
      bugs: { 6: { was: 'j >= 0', buggy: 'while (j > 0 && a[j] > key) {' } },
    },
    python: {
      correct: `
def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a
`,
      bugs: { 5: { was: 'j >= 0', buggy: 'while j > 0 and a[j] > key:' } },
    },
    c: {
      correct: `
void insertion_sort(int a[], int n) {
    for (int i = 1; i < n; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}
`,
      bugs: { 5: { was: 'j >= 0', buggy: 'while (j > 0 && a[j] > key) {' } },
    },
  },
});
