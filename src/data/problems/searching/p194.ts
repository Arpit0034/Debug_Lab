import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p194',
  title: 'Rotated target slips past the left edge',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'Rotated Array Search',
  tags: ['Binary Search', 'Rotated Array'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Search in rotated sorted array pattern',
  description:
    'Return the index of a target in a rotated sorted array, or -1 if it is absent. The current code misses some targets that sit exactly at the left edge of a sorted half.',
  constraints: ['1 <= n <= 100000', 'All values are distinct', 'The array is a rotation of a sorted array'],
  examples: [
    { input: 'a = [4,5,6,7,0,1,2], target = 4', output: '0' },
    { input: 'a = [4,5,6,7,0,1,2], target = 3', output: '-1' },
  ],
  hints: ['Trace the case where the target equals the value at lo.', 'Check the comparison that decides whether the target lies inside the sorted left half.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find a target in an array that was sorted and then rotated.',
    algorithm: 'Use two pointers and decide which half is sorted. If the target lies inside the sorted half, keep that half; otherwise keep the other half.',
    bug: 'The left-half membership check uses target > a[lo] instead of target >= a[lo].',
    whyItFails: 'When the target equals a[lo], it is inside the sorted left half, but the strict comparison rejects it and moves to the right half.',
    failingTestCase: 'a = [4,5,6,7,0,1,2], target = 4 returns -1 instead of 0.',
    fix: 'Use target >= a[lo] when testing the sorted left half.',
    whyFixWorks: 'The left half contains every value from a[lo] through a[mid], including a[lo].',
    dryRun: 'lo=0, hi=6, mid=3, a[mid]=7. Left half is sorted because a[0] <= a[3]. Target 4 equals a[0], so the correct check keeps hi=2 and eventually finds index 0.',
    debuggingLesson: 'For range membership checks, write the inclusive boundary explicitly and test the equality case.',
  },
  testCases: [
    { input: '[4,5,6,7,0,1,2], 4', expected: '0', buggyOutput: '-1' },
    { input: '[4,5,6,7,0,1,2], 3', expected: '-1' },
  ],
  harness: {
    expected: '0 -1',
    driver: {
      java: `System.out.println(Solution.searchRotated(new int[]{4,5,6,7,0,1,2}, 4) + " " + Solution.searchRotated(new int[]{4,5,6,7,0,1,2}, 3));`,
      python: `print(search_rotated([4,5,6,7,0,1,2], 4), search_rotated([4,5,6,7,0,1,2], 3))`,
      c: `printf("%d %d", search_rotated((int[]){4,5,6,7,0,1,2}, 7, 4), search_rotated((int[]){4,5,6,7,0,1,2}, 7, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int searchRotated(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) {
                return mid;
            }
            if (a[lo] <= a[mid]) {
                if (target >= a[lo] && target < a[mid]) {
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            } else {
                if (target > a[mid] && target <= a[hi]) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
        }
        return -1;
    }
}
`,
      bugs: { 11: { was: 'target >= a[lo]', buggy: 'if (target > a[lo] && target < a[mid]) {' } },
    },
    python: {
      correct: `
def search_rotated(a, target):
    lo = 0
    hi = len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        if a[lo] <= a[mid]:
            if target >= a[lo] and target < a[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if target > a[mid] and target <= a[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
`,
      bugs: { 9: { was: 'target >= a[lo]', buggy: 'if target > a[lo] and target < a[mid]:' } },
    },
    c: {
      correct: `
int search_rotated(int a[], int n, int target) {
    int lo = 0;
    int hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            return mid;
        }
        if (a[lo] <= a[mid]) {
            if (target >= a[lo] && target < a[mid]) {
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        } else {
            if (target > a[mid] && target <= a[hi]) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
    }
    return -1;
}
`,
      bugs: { 10: { was: 'target >= a[lo]', buggy: 'if (target > a[lo] && target < a[mid]) {' } },
    },
  },
});
