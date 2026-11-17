import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p095',
  title: 'The log table never grows',
  difficulty: 'Easy',
  topic: 'Advanced Data Structures',
  subtopic: 'Sparse Table Log Table',
  tags: ['Sparse Table', 'Log Table', 'Range Minimum'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Range minimum query with a precomputed floor-log table',
  description:
    'Return the minimum value in an inclusive range using a sparse table. The log table is computed incorrectly, so queries use too small a block.',
  constraints: ['1 <= n <= 1000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [9,1,9,9,9,9,2], l = 0, r = 6', output: '1' },
  ],
  hints: ['The logarithm table should increase as i grows.', 'Trace the value stored for i equal to 7.'],
  complexity: { time: 'O(n log n)', space: 'O(n log n)' },
  explanation: {
    overview: 'Precompute floor logarithms and use them to answer range-minimum queries.',
    algorithm: 'Build log[i] from log[i / 2] + 1, build the sparse table, and combine two blocks of length 2^k.',
    bug: 'The log table entry is overwritten with 0, so all floor logarithms collapse to zero.',
    whyItFails: 'The query picks k = log[length] = 0, so each block covers only one element instead of the intended larger power-of-two length. The two blocks then fail to cover the full range.',
    failingTestCase: 'For [9,1,9,9,9,9,2] querying 0..6, the code returns 2 instead of 1.',
    fix: 'Assign log[i] = log[i / 2] + 1 inside the loop.',
    whyFixWorks: 'The table then stores the true floor logarithm, and the two query blocks cover the full range.',
    dryRun: 'For length 7, correct log[7]=2 and the blocks include index 1. Buggy log[7]=0, so only single elements at 0 and 6 are compared, yielding min(9,2)=2.',
    debuggingLesson: 'For precomputed logarithm tables, verify the recurrence with small powers of two.',
  },
  testCases: [
    { input: '[9,1,9,9,9,9,2], 0, 6', expected: '1', buggyOutput: '2' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.print(Solution.rangeMin(new int[]{9,1,9,9,9,9,2}, 0, 6));`,
      python: `print(range_min([9,1,9,9,9,9,2], 0, 6))`,
      c: `printf("%d", range_min_log((int[]){9,1,9,9,9,9,2}, 7, 0, 6));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int rangeMin(int[] a, int l, int r) {
        int n = a.length;
        int[] log = new int[n + 1];
        for (int i = 2; i <= n; i++) log[i] = log[i / 2] + 1;
        int[][] st = new int[log[n] + 1][n];
        for (int i = 0; i < n; i++) st[0][i] = a[i];
        for (int k = 1; k < st.length; k++) {
            for (int i = 0; i + (1 << k) <= n; i++) {
                st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
            }
        }
        int len = r - l + 1;
        int k = log[len];
        return Math.min(st[k][l], st[k][r - (1 << k) + 1]);
    }
}
`,
      bugs: { 5: { was: 'log[i] = log[i / 2] + 1', buggy: 'for (int i = 2; i <= n; i++) log[i] = 0;' } },
    },
    python: {
      correct: `
def range_min(a, l, r):
    n = len(a)
    log = [0] * (n + 1)
    for i in range(2, n + 1):
        log[i] = log[i // 2] + 1
    st = [[0] * n for _ in range(log[n] + 1)]
    for i in range(n):
        st[0][i] = a[i]
    for k in range(1, len(st)):
        for i in range(n - (1 << k) + 1):
            st[k][i] = min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))])
    length = r - l + 1
    k = log[length]
    return min(st[k][l], st[k][r - (1 << k) + 1])
`,
      bugs: { 5: { was: 'log[i] = log[i // 2] + 1', buggy: 'log[i] = 0' } },
    },
    c: {
      correct: `
int range_min_log(int a[], int n, int l, int r) {
    int log[100] = {0};
    for (int i = 2; i <= n; i++) log[i] = log[i / 2] + 1;
    int st[10][100] = {0};
    for (int i = 0; i < n; i++) st[0][i] = a[i];
    for (int k = 1; k <= log[n]; k++) {
        for (int i = 0; i + (1 << k) <= n; i++) {
            int left = st[k - 1][i];
            int right = st[k - 1][i + (1 << (k - 1))];
            st[k][i] = left < right ? left : right;
        }
    }
    int len = r - l + 1;
    int k = log[len];
    int x = st[k][l];
    int y = st[k][r - (1 << k) + 1];
    return x < y ? x : y;
}
`,
      bugs: { 3: { was: 'log[i] = log[i / 2] + 1', buggy: 'for (int i = 2; i <= n; i++) log[i] = 0;' } },
    },
  },
});
