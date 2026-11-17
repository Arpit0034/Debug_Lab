import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p210',
  title: 'Counting sort skips single counts',
  difficulty: 'Easy',
  topic: 'Sorting',
  subtopic: 'Counting Sort',
  tags: ['Counting Sort', 'Frequency'],
  bugCategory: 'Collection-related Logical Error',
  sourceInspiredBy: 'Counting sort for small integer range pattern',
  description:
    'Sort an array of digits from 0 to 9. The current code drops every value whose frequency is exactly one.',
  constraints: ['1 <= n <= 100000', '0 <= a[i] <= 9'],
  examples: [
    { input: 'a = [3,1,3,2]', output: '1 2 3 3' },
  ],
  hints: ['How many times should a value be written if it appears once?', 'Check the while condition that consumes the frequency table.'],
  complexity: { time: 'O(n + 10)', space: 'O(10)' },
  explanation: {
    overview: 'Sort small non-negative integers by frequency counting.',
    algorithm: 'Count each value, then write values in increasing order while the count is positive.',
    bug: 'The output loop uses count[v] > 1 instead of count[v] > 0.',
    whyItFails: 'Values appearing exactly once have count 1, so they are never written.',
    failingTestCase: 'a = [3,1,3,2] returns 3 1 3 2 instead of 1 2 3 3.',
    fix: 'Use while (count[v] > 0).',
    whyFixWorks: 'A frequency of one still means the value must be emitted once.',
    dryRun: 'Counts are 1:1, 2:1, 3:2. The buggy loop skips values 1 and 2 and writes only one 3.',
    debuggingLesson: 'Frequency loops must emit a value for every positive count, including one.',
  },
  testCases: [
    { input: '[3,1,3,2]', expected: '1 2 3 3', buggyOutput: '3 1 3 2' },
  ],
  harness: {
    expected: '1 2 3 3',
    driver: {
      java: `int[] r = Solution.countingSort(new int[]{3,1,3,2}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*counting_sort([3,1,3,2]))`,
      c: `int a[] = {3,1,3,2}; counting_sort(a, 4); for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] countingSort(int[] a) {
        int[] count = new int[10];
        for (int x : a) {
            count[x]++;
        }
        int idx = 0;
        for (int v = 0; v < 10; v++) {
            while (count[v] > 0) {
                a[idx++] = v;
                count[v]--;
            }
        }
        return a;
    }
}
`,
      bugs: { 9: { was: 'count[v] > 0', buggy: 'while (count[v] > 1) {' } },
    },
    python: {
      correct: `
def counting_sort(a):
    count = [0] * 10
    for x in a:
        count[x] += 1
    idx = 0
    for v in range(10):
        while count[v] > 0:
            a[idx] = v
            idx += 1
            count[v] -= 1
    return a
`,
      bugs: { 7: { was: 'count[v] > 0', buggy: 'while count[v] > 1:' } },
    },
    c: {
      correct: `
void counting_sort(int a[], int n) {
    int count[10] = {0};
    for (int i = 0; i < n; i++) {
        count[a[i]]++;
    }
    int idx = 0;
    for (int v = 0; v < 10; v++) {
        while (count[v] > 0) {
            a[idx++] = v;
            count[v]--;
        }
    }
}
`,
      bugs: { 8: { was: 'count[v] > 0', buggy: 'while (count[v] > 1) {' } },
    },
  },
});
