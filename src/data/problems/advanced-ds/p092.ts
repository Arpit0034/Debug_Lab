import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p092',
  title: 'The range reads one element short',
  difficulty: 'Medium',
  topic: 'Advanced Data Structures',
  subtopic: 'Fenwick Tree Range Sum',
  tags: ['Fenwick Tree', 'Range Sum', 'Prefix'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Inclusive range sum using two prefix queries',
  description:
    'Return the sum of an inclusive range in an array using a Fenwick tree. The right prefix is taken with the wrong bound, so the range loses its last element.',
  constraints: ['1 <= n <= 1000', '0 <= l <= r < n'],
  examples: [
    { input: 'a = [1,2,3,4], l = 1, r = 2', output: '5' },
  ],
  hints: ['A prefix helper usually returns the sum of the first k elements.', 'Inclusive r needs a prefix bound of r + 1.'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  explanation: {
    overview: 'Answer an inclusive range-sum query with a Fenwick tree.',
    algorithm: 'Build the Fenwick tree, then compute prefix(r + 1) - prefix(l).',
    bug: 'The code computes prefix(r) - prefix(l), which excludes the element at index r.',
    whyItFails: 'The prefix helper is defined on counts of elements, so using r instead of r + 1 misses the right endpoint.',
    failingTestCase: 'For [1,2,3,4] and range [1,2], the code returns 2 instead of 5.',
    fix: 'Use prefix(r + 1) - prefix(l).',
    whyFixWorks: 'The difference then includes all elements from l through r inclusive.',
    dryRun: 'prefix(3)=1+2+3=6 and prefix(1)=1. Correct range sum is 6-1=5. The buggy prefix(2)=3 minus 1 gives 2.',
    debuggingLesson: 'Fenwick prefix functions are naturally half-open; inclusive ranges need a +1 on the right bound.',
  },
  testCases: [
    { input: '[1,2,3,4], 1, 2', expected: '5', buggyOutput: '2' },
  ],
  harness: {
    expected: '5',
    driver: {
      java: `System.out.print(Solution.rangeSum(new int[]{1,2,3,4}, 1, 2));`,
      python: `print(range_sum_fenwick([1,2,3,4], 1, 2))`,
      c: `printf("%d", range_sum_fenwick((int[]){1,2,3,4}, 4, 1, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] bit;
    static void add(int i, int v, int n) {
        while (i <= n) {
            bit[i] += v;
            i += i & -i;
        }
    }
    static int sum(int i) {
        int s = 0;
        while (i > 0) {
            s += bit[i];
            i -= i & -i;
        }
        return s;
    }
    static int rangeSum(int[] a, int l, int r) {
        int n = a.length;
        bit = new int[n + 1];
        for (int i = 0; i < n; i++) add(i + 1, a[i], n);
        return sum(r + 1) - sum(l);
    }
}
`,
      bugs: { 21: { was: 'sum(r + 1)', buggy: 'return sum(r) - sum(l);' } },
    },
    python: {
      correct: `
def range_sum_fenwick(a, l, r):
    n = len(a)
    bit = [0] * (n + 1)
    def add(i, v):
        while i <= n:
            bit[i] += v
            i += i & -i
    def pref(i):
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s
    for i, x in enumerate(a):
        add(i + 1, x)
    return pref(r + 1) - pref(l)
`,
      bugs: { 16: { was: 'pref(r + 1)', buggy: 'return pref(r) - pref(l)' } },
    },
    c: {
      correct: `
int bit_arr[100];

void bit_add(int i, int v, int n) {
    while (i <= n) {
        bit_arr[i] += v;
        i += i & -i;
    }
}

int bit_sum(int i) {
    int s = 0;
    while (i > 0) {
        s += bit_arr[i];
        i -= i & -i;
    }
    return s;
}

int range_sum_fenwick(int a[], int n, int l, int r) {
    for (int i = 0; i <= n; i++) bit_arr[i] = 0;
    for (int i = 0; i < n; i++) bit_add(i + 1, a[i], n);
    return bit_sum(r + 1) - bit_sum(l);
}
`,
      bugs: { 22: { was: 'bit_sum(r + 1)', buggy: 'return bit_sum(r) - bit_sum(l);' } },
    },
  },
});
