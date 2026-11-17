import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p222',
  title: 'Absolute-value ties flip order',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Absolute Value Comparator',
  tags: ['Comparator', 'Sorting'],
  bugCategory: 'Incorrect Comparator Logic',
  sourceInspiredBy: 'Sort by absolute value pattern',
  description:
    'Sort integers by absolute value ascending, breaking ties by the actual value ascending. The current tie-breaker reverses equal absolute values.',
  constraints: ['1 <= n <= 10000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [-3,2,-1,1]', output: '-1 1 2 -3' },
  ],
  hints: ['What should happen for -1 and 1?', 'Check the comparison used when absolute values are equal.'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Sort by magnitude and then by signed value.',
    algorithm: 'Compare absolute values first; if equal, compare the original values.',
    bug: 'The tie-breaker returns y - x instead of x - y.',
    whyItFails: 'Values with the same absolute value appear in descending signed order.',
    failingTestCase: 'a = [-3,2,-1,1] returns 1 -1 2 -3 instead of -1 1 2 -3.',
    fix: 'Return x - y for equal absolute values.',
    whyFixWorks: 'The signed tie-breaker should be ascending.',
    dryRun: 'For -1 and 1, both have absolute value 1. The buggy comparator puts 1 before -1.',
    debuggingLesson: 'Test custom comparators with both a primary-key tie and negative values.',
  },
  testCases: [
    { input: '[-3,2,-1,1]', expected: '-1 1 2 -3', buggyOutput: '1 -1 2 -3' },
  ],
  harness: {
    expected: '-1 1 2 -3',
    driver: {
      java: `int[] r = Solution.sortByAbs(new int[]{-3,2,-1,1}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*sort_by_abs([-3,2,-1,1]))`,
      c: `int a[] = {-3,2,-1,1}; sort_by_abs(a, 4); for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static int[] sortByAbs(int[] a) {
        Integer[] b = new Integer[a.length];
        for (int i = 0; i < a.length; i++) {
            b[i] = a[i];
        }
        Arrays.sort(b, (x, y) -> {
            int ax = Math.abs(x);
            int ay = Math.abs(y);
            if (ax != ay) {
                return ax - ay;
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
def abs_value(x):
    if x < 0:
        return -x
    return x
def sort_by_abs(a):
    res = a[:]
    for i in range(1, len(res)):
        key = res[i]
        j = i - 1
        while j >= 0 and abs_value(res[j]) > abs_value(key):
            res[j + 1] = res[j]
            j -= 1
        res[j + 1] = key
    return res
`,
      bugs: { 10: { was: 'abs_value(res[j]) > abs_value(key)', buggy: 'while j >= 0 and abs_value(res[j]) < abs_value(key):' } },
    },
    c: {
      correct: `
int abs_value(int x) {
    if (x < 0) {
        return -x;
    }
    return x;
}
int cmp(const void* p, const void* q) {
    int x = *(int*)p;
    int y = *(int*)q;
    int ax = abs_value(x);
    int ay = abs_value(y);
    if (ax != ay) {
        return ax - ay;
    }
    return x - y;
}
void sort_by_abs(int a[], int n) {
    qsort(a, n, sizeof(int), cmp);
}
`,
      bugs: { 15: { was: 'return x - y;', buggy: 'return y - x;' } },
    },
  },
});
