import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p211',
  title: 'Bit-count ties sort backwards',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Custom Comparator',
  tags: ['Comparator', 'Sorting'],
  bugCategory: 'Incorrect Comparator Logic',
  sourceInspiredBy: 'Sort by bit count then value pattern',
  description:
    'Sort integers by the number of set bits, breaking ties by value in ascending order. The current code reverses the tie-breaker.',
  constraints: ['1 <= n <= 10000', '0 <= a[i] <= 1000000'],
  examples: [
    { input: 'a = [3,1,2,4]', output: '1 2 4 3' },
  ],
  hints: ['What should happen when two numbers have the same set-bit count?', 'Trace the comparator return for equal bit counts.'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Sort by a primary key and a secondary key.',
    algorithm: 'Compare set-bit counts first, then compare the numbers themselves for ties.',
    bug: 'The tie-breaker returns y - x instead of x - y.',
    whyItFails: 'Equal bit counts are ordered from larger to smaller, which is the opposite of the required order.',
    failingTestCase: 'a = [3,1,2,4] returns 4 2 1 3 instead of 1 2 4 3.',
    fix: 'Return x - y for the tie-breaker.',
    whyFixWorks: 'For equal primary keys, smaller values must come first.',
    dryRun: '1,2,4 all have one set bit. The correct tie order is 1,2,4; the buggy order is 4,2,1.',
    debuggingLesson: 'Multi-key comparators must be tested with values that tie on the primary key.',
  },
  testCases: [
    { input: '[3,1,2,4]', expected: '1 2 4 3', buggyOutput: '4 2 1 3' },
  ],
  harness: {
    expected: '1 2 4 3',
    driver: {
      java: `int[] r = Solution.sortByBits(new int[]{3,1,2,4}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*sort_by_bits([3,1,2,4]))`,
      c: `int a[] = {3,1,2,4}; sort_by_bits(a, 4); for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static int[] sortByBits(int[] a) {
        Integer[] b = new Integer[a.length];
        for (int i = 0; i < a.length; i++) {
            b[i] = a[i];
        }
        Arrays.sort(b, (x, y) -> {
            int cx = Integer.bitCount(x);
            int cy = Integer.bitCount(y);
            if (cx != cy) {
                return cx - cy;
            }
            return x - y;
        });
        for (int i = 0; i < a.length; i++) {
            a[i] = b[i];
        }
        return a;
    }
}
`,
      bugs: { 14: { was: 'return x - y;', buggy: 'return y - x;' } },
    },
    python: {
      correct: `
def bit_count(x):
    count = 0
    while x > 0:
        count += x & 1
        x >>= 1
    return count
def sort_by_bits(a):
    def key(x):
        return (bit_count(x), x)
    return sorted(a, key=key)
`,
      bugs: { 9: { was: '(bit_count(x), x)', buggy: 'return (bit_count(x), -x)' } },
    },
    c: {
      correct: `
int bit_count(int x) {
    int c = 0;
    while (x > 0) {
        c += x & 1;
        x >>= 1;
    }
    return c;
}
int cmp(const void* p, const void* q) {
    int x = *(int*)p;
    int y = *(int*)q;
    int cx = bit_count(x);
    int cy = bit_count(y);
    if (cx != cy) {
        return cx - cy;
    }
    return x - y;
}
void sort_by_bits(int a[], int n) {
    qsort(a, n, sizeof(int), cmp);
}
`,
      bugs: { 17: { was: 'return x - y;', buggy: 'return y - x;' } },
    },
  },
});
