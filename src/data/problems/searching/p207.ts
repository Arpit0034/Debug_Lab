import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p207',
  title: 'Upper bound stops at equal values',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'Upper Bound',
  tags: ['Binary Search', 'Duplicates'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Upper bound in sorted array pattern',
  description:
    'Return the first index whose value is strictly greater than x, or the array length if none exists. The current code stops at the first equal value.',
  constraints: ['1 <= n <= 100000', 'The array is sorted in non-decreasing order'],
  examples: [
    { input: 'a = [1,2,2,2,3], x = 2', output: '4' },
    { input: 'a = [1,2,2,2,3], x = 3', output: '5' },
  ],
  hints: ['Equal values must be skipped, not accepted as the upper bound.', 'Trace x equal to the repeated value.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the first position after all values not greater than x.',
    algorithm: 'Binary search for the first value strictly greater than x.',
    bug: 'The condition uses a[mid] < x instead of a[mid] <= x.',
    whyItFails: 'Equal values are treated as greater than x, so the search stops at the first equal value instead of passing all duplicates.',
    failingTestCase: 'a = [1,2,2,2,3], x = 2 returns 1 instead of 4.',
    fix: 'Use a[mid] <= x to move lo past equal values.',
    whyFixWorks: 'Every value equal to x belongs before the upper bound, so lo must move right.',
    dryRun: 'For x=2, the buggy code stops at index 1 where 2 < 2 is false. The correct code treats 2 <= 2 as true and moves lo to 4.',
    debuggingLesson: 'Lower and upper bounds differ exactly in how they treat equality.',
  },
  testCases: [
    { input: '[1,2,2,2,3], 2', expected: '4', buggyOutput: '1' },
    { input: '[1,2,2,2,3], 3', expected: '5', buggyOutput: '4' },
  ],
  harness: {
    expected: '4 5',
    driver: {
      java: `System.out.println(Solution.upperBound(new int[]{1,2,2,2,3}, 2) + " " + Solution.upperBound(new int[]{1,2,2,2,3}, 3));`,
      python: `print(upper_bound([1,2,2,2,3], 2), upper_bound([1,2,2,2,3], 3))`,
      c: `printf("%d %d", upper_bound((int[]){1,2,2,2,3}, 5, 2), upper_bound((int[]){1,2,2,2,3}, 5, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int upperBound(int[] a, int x) {
        int lo = 0;
        int hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] <= x) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
}
`,
      bugs: { 7: { was: 'a[mid] <= x', buggy: 'if (a[mid] < x) {' } },
    },
    python: {
      correct: `
def upper_bound(a, x):
    lo = 0
    hi = len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] <= x:
            lo = mid + 1
        else:
            hi = mid
    return lo
`,
      bugs: { 6: { was: 'a[mid] <= x', buggy: 'if a[mid] < x:' } },
    },
    c: {
      correct: `
int upper_bound(int a[], int n, int x) {
    int lo = 0;
    int hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] <= x) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
}
`,
      bugs: { 6: { was: 'a[mid] <= x', buggy: 'if (a[mid] < x) {' } },
    },
  },
});
