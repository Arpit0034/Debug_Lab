import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p218',
  title: 'Parity sort copies evens twice',
  difficulty: 'Easy',
  topic: 'Sorting',
  subtopic: 'Custom Partition Sort',
  tags: ['Partition', 'Parity'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Sort array by parity pattern',
  description:
    'Return an array with all even numbers first and all odd numbers after, preserving relative order. The current code writes even numbers in both passes.',
  constraints: ['1 <= n <= 100000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [3,1,2,4]', output: '2 4 3 1' },
  ],
  hints: ['The second pass should collect the values not collected by the first pass.', 'Check the parity test in the second loop.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Collect evens and odds into separate groups while preserving order.',
    algorithm: 'First append all even values, then append all odd values.',
    bug: 'The second loop tests x % 2 == 0 instead of x % 2 != 0.',
    whyItFails: 'Even values are appended twice and odd values are never appended.',
    failingTestCase: 'a = [3,1,2,4] returns 2 4 2 4 instead of 2 4 3 1.',
    fix: 'Use x % 2 != 0 in the second loop.',
    whyFixWorks: 'The second pass must collect exactly the values left out by the first pass.',
    dryRun: 'First pass adds 2 and 4. The buggy second pass adds 2 and 4 again; the correct second pass adds 3 and 1.',
    debuggingLesson: 'When partitioning into two groups, the second condition should be the logical complement of the first.',
  },
  testCases: [
    { input: '[3,1,2,4]', expected: '2 4 3 1', buggyOutput: '2 4 2 4' },
  ],
  harness: {
    expected: '2 4 3 1',
    driver: {
      java: `int[] r = Solution.sortByParity(new int[]{3,1,2,4}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*sort_by_parity([3,1,2,4]))`,
      c: `int a[] = {3,1,2,4}; int res[4]; sort_by_parity(a, 4, res); for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", res[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] sortByParity(int[] a) {
        int[] res = new int[a.length];
        int k = 0;
        for (int x : a) {
            if (x % 2 == 0) {
                res[k++] = x;
            }
        }
        for (int x : a) {
            if (x % 2 != 0) {
                res[k++] = x;
            }
        }
        return res;
    }
}
`,
      bugs: { 11: { was: 'x % 2 != 0', buggy: 'if (x % 2 == 0) {' } },
    },
    python: {
      correct: `
def sort_by_parity(a):
    res = []
    for x in a:
        if x % 2 == 0:
            res.append(x)
    for x in a:
        if x % 2 != 0:
            res.append(x)
    return res
`,
      bugs: { 7: { was: 'x % 2 != 0', buggy: 'if x % 2 == 0:' } },
    },
    c: {
      correct: `
void sort_by_parity(int a[], int n, int res[]) {
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] % 2 == 0) {
            res[k++] = a[i];
        }
    }
    for (int i = 0; i < n; i++) {
        if (a[i] % 2 != 0) {
            res[k++] = a[i];
        }
    }
}
`,
      bugs: { 9: { was: 'a[i] % 2 != 0', buggy: 'if (a[i] % 2 == 0) {' } },
    },
  },
});
