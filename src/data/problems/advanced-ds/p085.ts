import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p085',
  title: 'The minimum misses the last block',
  difficulty: 'Hard',
  topic: 'Advanced Data Structures',
  subtopic: 'Sparse Table Range Minimum',
  tags: ['Sparse Table', 'Range Minimum', 'Query'],
  bugCategory: 'Incorrect Binary Search Boundary',
  sourceInspiredBy: 'Sparse table range minimum query with overlapping blocks',
  description:
    'Return the minimum value in an inclusive range of an array. The second block of the query is aligned one position too far left.',
  constraints: ['1 <= n <= 1000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [9,9,9,9,9,1], l = 0, r = 5', output: '1' },
  ],
  hints: ['The two blocks must cover the left and right ends of the query.', 'The right block should end exactly at r.'],
  complexity: { time: 'O(n log n)', space: 'O(n log n)' },
  explanation: {
    overview: 'Answer range-minimum queries with a sparse table.',
    algorithm: 'Precompute minima for power-of-two lengths, then combine two overlapping blocks of length 2^k that cover the query.',
    bug: 'The right block starts at r - (1 << k) instead of r - (1 << k) + 1.',
    whyItFails: 'The right block no longer ends at r, so a minimum located at the last query position can be missed.',
    failingTestCase: 'For [9,9,9,9,9,1] querying 0..5, the code returns 9 instead of 1.',
    fix: 'Start the right block at r - (1 << k) + 1.',
    whyFixWorks: 'That start makes the block cover exactly the last 2^k elements ending at r.',
    dryRun: 'Length is 6, so k=2. The right block should cover indices 2..5 and include the 1 at index 5. The buggy start at index 1 covers 1..4 and misses it.',
    debuggingLesson: 'For overlapping range queries, verify that both blocks actually cover the query boundaries.',
  },
  testCases: [
    { input: '[9,9,9,9,9,1], 0, 5', expected: '1', buggyOutput: '9' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.print(Solution.rangeMin(new int[]{9,9,9,9,9,1}, 0, 5));`,
      python: `print(range_min([9,9,9,9,9,1], 0, 5))`,
      c: `printf("%d", range_min((int[]){9,9,9,9,9,1}, 6, 0, 5));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int rangeMin(int[] a, int l, int r) {
        int n = a.length;
        int log = 1;
        while ((1 << log) <= n) log++;
        int[][] st = new int[log][n];
        for (int i = 0; i < n; i++) st[0][i] = a[i];
        for (int k = 1; k < log; k++) {
            for (int i = 0; i + (1 << k) <= n; i++) {
                st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
            }
        }
        int len = r - l + 1;
        int k = 0;
        while ((1 << (k + 1)) <= len) k++;
        return Math.min(st[k][l], st[k][r - (1 << k) + 1]);
    }
}
`,
      bugs: { 16: { was: 'r - (1 << k) + 1', buggy: 'return Math.min(st[k][l], st[k][r - (1 << k)]);' } },
    },
    python: {
      correct: `
def range_min(a, l, r):
    n = len(a)
    log = 1
    while (1 << log) <= n:
        log += 1
    st = [[0] * n for _ in range(log)]
    for i in range(n):
        st[0][i] = a[i]
    for k in range(1, log):
        for i in range(n - (1 << k) + 1):
            st[k][i] = min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))])
    length = r - l + 1
    k = 0
    while (1 << (k + 1)) <= length:
        k += 1
    return min(st[k][l], st[k][r - (1 << k) + 1])
`,
      bugs: { 16: { was: 'r - (1 << k) + 1', buggy: 'return min(st[k][l], st[k][r - (1 << k)])' } },
    },
    c: {
      correct: `
int range_min(int a[], int n, int l, int r) {
    int log = 1;
    while ((1 << log) <= n) log++;
    int st[10][100] = {0};
    for (int i = 0; i < n; i++) st[0][i] = a[i];
    for (int k = 1; k < log; k++) {
        for (int i = 0; i + (1 << k) <= n; i++) {
            int left = st[k - 1][i];
            int right = st[k - 1][i + (1 << (k - 1))];
            st[k][i] = left < right ? left : right;
        }
    }
    int len = r - l + 1;
    int k = 0;
    while ((1 << (k + 1)) <= len) k++;
    int x = st[k][l];
    int y = st[k][r - (1 << k) + 1];
    return x < y ? x : y;
}
`,
      bugs: { 17: { was: 'r - (1 << k) + 1', buggy: 'int y = st[k][r - (1 << k)];' } },
    },
  },
});
