import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p197',
  title: 'Exact square root is rejected',
  difficulty: 'Easy',
  topic: 'Searching',
  subtopic: 'Search on Answer',
  tags: ['Binary Search', 'Math'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Integer square root search pattern',
  description:
    'Return the floor of the square root of a non-negative integer. The current code is one too small when the input is a perfect square.',
  constraints: ['0 <= n <= 1000000000'],
  examples: [
    { input: 'n = 49', output: '7' },
    { input: 'n = 50', output: '7' },
  ],
  hints: ['What happens when mid * mid equals n?', 'Test n = 49 and follow the equality case.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the largest integer whose square is at most n.',
    algorithm: 'Binary search the answer range and keep the best value whose square does not exceed n.',
    bug: 'The condition uses mid < n / mid, so an exact square root is rejected.',
    whyItFails: 'When mid * mid equals n, mid is a valid answer, but the strict comparison sends the search to the left and the answer becomes mid - 1.',
    failingTestCase: 'n = 49 returns 6 instead of 7.',
    fix: 'Use mid <= n / mid.',
    whyFixWorks: 'Equality means mid squared is exactly n, so mid must be kept as a candidate.',
    dryRun: 'For n=49, mid=7 gives 7 <= 49/7, so ans becomes 7. The buggy check 7 < 7 is false and ans stays 6.',
    debuggingLesson: 'In answer-space searches, decide whether the boundary itself is feasible and encode that with the correct inequality.',
  },
  testCases: [
    { input: '49', expected: '7', buggyOutput: '6' },
    { input: '50', expected: '7' },
  ],
  harness: {
    expected: '7 7',
    driver: {
      java: `System.out.println(Solution.floorSqrt(49) + " " + Solution.floorSqrt(50));`,
      python: `print(floor_sqrt(49), floor_sqrt(50))`,
      c: `printf("%d %d", floor_sqrt(49), floor_sqrt(50));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int floorSqrt(int n) {
        int lo = 0;
        int hi = n;
        int ans = 0;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (mid <= n / mid) {
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
      bugs: { 8: { was: 'mid <= n / mid', buggy: 'if (mid < n / mid) {' } },
    },
    python: {
      correct: `
def floor_sqrt(n):
    lo = 0
    hi = n
    ans = 0
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if mid <= n // mid:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans
`,
      bugs: { 7: { was: 'mid <= n // mid', buggy: 'if mid < n // mid:' } },
    },
    c: {
      correct: `
int floor_sqrt(int n) {
    int lo = 0;
    int hi = n;
    int ans = 0;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid <= n / mid) {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}
`,
      bugs: { 7: { was: 'mid <= n / mid', buggy: 'if (mid < n / mid) {' } },
    },
  },
});
