import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p083',
  title: 'The query drops the right edge',
  difficulty: 'Medium',
  topic: 'Advanced Data Structures',
  subtopic: 'Segment Tree Range Sum',
  tags: ['Segment Tree', 'Range Query', 'Sum'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Iterative segment tree range sum query',
  description:
    'Return the sum of an inclusive range in an array using a segment tree. The query range is converted with the wrong right endpoint.',
  constraints: ['1 <= n <= 1000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [1,2,3,4], l = 1, r = 2', output: '5' },
  ],
  hints: ['An inclusive range [l, r] needs a half-open conversion.', 'Check the value added to the right endpoint before the loop.'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  explanation: {
    overview: 'Answer inclusive range-sum queries with an iterative segment tree.',
    algorithm: 'Build a tree over a power-of-two size, convert the inclusive query to a half-open range, and combine nodes while moving upward.',
    bug: 'The right endpoint is converted to r + size instead of r + size + 1.',
    whyItFails: 'The half-open range excludes r, so the final element of the query is omitted.',
    failingTestCase: 'For [1,2,3,4], querying l=1, r=2 returns 2 instead of 5.',
    fix: 'Use hi = r + size + 1.',
    whyFixWorks: 'The half-open interval [l, r + 1) includes index r exactly once.',
    dryRun: 'Query [1,2] should include a[1]=2 and a[2]=3. The buggy right endpoint stops before a[2], so only 2 is added.',
    debuggingLesson: 'Whenever converting inclusive indices to half-open ranges, verify the +1 on the right endpoint.',
  },
  testCases: [
    { input: '[1,2,3,4], 1, 2', expected: '5', buggyOutput: '2' },
  ],
  harness: {
    expected: '5',
    driver: {
      java: `System.out.print(Solution.rangeSum(new int[]{1,2,3,4}, 1, 2));`,
      python: `print(range_sum([1,2,3,4], 1, 2))`,
      c: `printf("%d", range_sum((int[]){1,2,3,4}, 4, 1, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int rangeSum(int[] a, int l, int r) {
        int n = a.length;
        int size = 1;
        while (size < n) size *= 2;
        int[] tree = new int[2 * size];
        for (int i = 0; i < n; i++) tree[size + i] = a[i];
        for (int i = size - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
        int lo = l + size;
        int hi = r + size + 1;
        int sum = 0;
        while (lo < hi) {
            if ((lo & 1) == 1) sum += tree[lo++];
            if ((hi & 1) == 1) sum += tree[--hi];
            lo /= 2;
            hi /= 2;
        }
        return sum;
    }
}
`,
      bugs: { 10: { was: 'r + size + 1', buggy: 'int hi = r + size;' } },
    },
    python: {
      correct: `
def range_sum(a, l, r):
    n = len(a)
    size = 1
    while size < n:
        size *= 2
    tree = [0] * (2 * size)
    for i in range(n):
        tree[size + i] = a[i]
    for i in range(size - 1, 0, -1):
        tree[i] = tree[2 * i] + tree[2 * i + 1]
    lo = l + size
    hi = r + size + 1
    total = 0
    while lo < hi:
        if lo & 1:
            total += tree[lo]
            lo += 1
        if hi & 1:
            hi -= 1
            total += tree[hi]
        lo //= 2
        hi //= 2
    return total
`,
      bugs: { 12: { was: 'r + size + 1', buggy: 'hi = r + size' } },
    },
    c: {
      correct: `
int range_sum(int a[], int n, int l, int r) {
    int size = 1;
    while (size < n) size *= 2;
    int tree[100] = {0};
    for (int i = 0; i < n; i++) tree[size + i] = a[i];
    for (int i = size - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
    int lo = l + size;
    int hi = r + size + 1;
    int sum = 0;
    while (lo < hi) {
        if (lo & 1) sum += tree[lo++];
        if (hi & 1) sum += tree[--hi];
        lo /= 2;
        hi /= 2;
    }
    return sum;
}
`,
      bugs: { 8: { was: 'r + size + 1', buggy: 'int hi = r + size;' } },
    },
  },
});
