import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p205',
  title: 'Missing number search overshoots the gap',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'Missing Number',
  tags: ['Binary Search', 'Sorted Array'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Missing number in sorted range pattern',
  description:
    'A sorted array contains distinct numbers from 0 through n with exactly one missing. Return the missing number. The current code often returns n even when the gap is earlier.',
  constraints: ['1 <= n <= 100000', 'Values are distinct and sorted'],
  examples: [
    { input: 'a = [0,1,3,4]', output: '2' },
  ],
  hints: ['At index mid, what value would you expect if no number were missing before it?', 'Trace a[mid] compared with mid.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the single missing value in a sorted range starting at zero.',
    algorithm: 'At a correct prefix, a[mid] equals mid. At or after the gap, a[mid] is larger than mid.',
    bug: 'The code checks a[mid] > mid to move lo, which reverses the search direction.',
    whyItFails: 'When the gap is at or before mid, the code moves right and skips the gap, often returning the array length.',
    failingTestCase: 'a = [0,1,3,4] returns 4 instead of 2.',
    fix: 'Use a[mid] == mid to move lo; otherwise move hi to mid.',
    whyFixWorks: 'If a[mid] equals mid, all values through mid are present, so the gap must be to the right.',
    dryRun: 'lo=0, hi=4, mid=2 has a[2]=3. The correct code sets hi=2. The buggy code sees 3 > 2 and sets lo=3, eventually returning 4.',
    debuggingLesson: 'In a sorted invariant search, compare the observed value with the value expected at that index.',
  },
  testCases: [
    { input: '[0,1,3,4]', expected: '2', buggyOutput: '4' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.missingNumber(new int[]{0,1,3,4}));`,
      python: `print(missing_number([0,1,3,4]))`,
      c: `printf("%d", missing_number((int[]){0,1,3,4}, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int missingNumber(int[] a) {
        int lo = 0;
        int hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == mid) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
}
`,
      bugs: { 7: { was: 'a[mid] == mid', buggy: 'if (a[mid] > mid) {' } },
    },
    python: {
      correct: `
def missing_number(a):
    lo = 0
    hi = len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == mid:
            lo = mid + 1
        else:
            hi = mid
    return lo
`,
      bugs: { 6: { was: 'a[mid] == mid', buggy: 'if a[mid] > mid:' } },
    },
    c: {
      correct: `
int missing_number(int a[], int n) {
    int lo = 0;
    int hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == mid) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
}
`,
      bugs: { 6: { was: 'a[mid] == mid', buggy: 'if (a[mid] > mid) {' } },
    },
  },
});
