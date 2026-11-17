import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p204',
  title: 'Floor value misses an exact match',
  difficulty: 'Easy',
  topic: 'Searching',
  subtopic: 'Floor in Sorted Array',
  tags: ['Binary Search', 'Boundary'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Floor of a number in sorted array pattern',
  description:
    'Return the index of the largest value not greater than x, or -1 if no such value exists. The current code misses exact matches.',
  constraints: ['1 <= n <= 100000', 'The array is sorted in non-decreasing order'],
  examples: [
    { input: 'a = [1,3,5,7], x = 5', output: '2' },
    { input: 'a = [1,3,5,7], x = 1', output: '0' },
  ],
  hints: ['Should equality count as a valid floor?', 'Trace x equal to the first element.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the rightmost value that does not exceed a limit.',
    algorithm: 'Binary search and remember the best index whose value is at most x.',
    bug: 'The condition uses a[mid] < x instead of a[mid] <= x.',
    whyItFails: 'When a[mid] equals x, it is a valid floor, but the code ignores it and may return a smaller value or -1.',
    failingTestCase: 'a = [1,3,5,7], x = 5 returns 1 instead of 2; x = 1 returns -1 instead of 0.',
    fix: 'Use a[mid] <= x in the comparison.',
    whyFixWorks: 'Equality means the value is a valid floor, so it should update the answer.',
    dryRun: 'For x=5, mid=1 has 3 < 5 and ans=1. The next mid=2 has 5 < 5 false, so the buggy code stops at ans=1. The correct check accepts 5 and returns 2.',
    debuggingLesson: 'Boundary problems usually hinge on whether equality belongs to the left or right side.',
  },
  testCases: [
    { input: '[1,3,5,7], 5', expected: '2', buggyOutput: '1' },
    { input: '[1,3,5,7], 1', expected: '0', buggyOutput: '-1' },
  ],
  harness: {
    expected: '2 0',
    driver: {
      java: `System.out.println(Solution.floorIndex(new int[]{1,3,5,7}, 5) + " " + Solution.floorIndex(new int[]{1,3,5,7}, 1));`,
      python: `print(floor_index([1,3,5,7], 5), floor_index([1,3,5,7], 1))`,
      c: `printf("%d %d", floor_index((int[]){1,3,5,7}, 4, 5), floor_index((int[]){1,3,5,7}, 4, 1));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int floorIndex(int[] a, int x) {
        int lo = 0;
        int hi = a.length - 1;
        int ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] <= x) {
                ans = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}
`,
      bugs: { 8: { was: 'a[mid] <= x', buggy: 'if (a[mid] < x) {' } },
    },
    python: {
      correct: `
def floor_index(a, x):
    lo = 0
    hi = len(a) - 1
    ans = -1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] <= x:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans
`,
      bugs: { 7: { was: 'a[mid] <= x', buggy: 'if a[mid] < x:' } },
    },
    c: {
      correct: `
int floor_index(int a[], int n, int x) {
    int lo = 0;
    int hi = n - 1;
    int ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] <= x) {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}
`,
      bugs: { 7: { was: 'a[mid] <= x', buggy: 'if (a[mid] < x) {' } },
    },
  },
});
