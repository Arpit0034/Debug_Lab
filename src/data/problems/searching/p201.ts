import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p201',
  title: 'Duplicate shrink skips the hidden target',
  difficulty: 'Hard',
  topic: 'Searching',
  subtopic: 'Rotated Array with Duplicates',
  tags: ['Binary Search', 'Duplicates', 'Rotated Array'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Rotated sorted array with duplicates pattern',
  description:
    'Return whether a target exists in a rotated sorted array that may contain duplicates. The current code shrinks the range too aggressively when equal values appear.',
  constraints: ['1 <= n <= 100000', 'Values may repeat', 'The array is a rotation of a sorted array'],
  examples: [
    { input: 'a = [3,1,2,3,3,3,3], target = 2', output: '1' },
    { input: 'a = [3,1,2,3,3,3,3], target = 4', output: '0' },
  ],
  hints: ['When lo, mid and hi are all equal, only one step may be safe.', 'Trace target 2 in the sample after the first middle is 3.'],
  complexity: { time: 'O(log n) average, O(n) worst case', space: 'O(1)' },
  explanation: {
    overview: 'Search a rotated sorted array that may contain repeated values.',
    algorithm: 'Use the usual rotated-array logic, but when the three boundary values are equal, shrink both ends carefully.',
    bug: 'The equality guard uses OR instead of AND, so it shrinks even when only one side is equal.',
    whyItFails: 'The range can lose the only segment that still contains the target.',
    failingTestCase: 'a = [3,1,2,3,3,3,3], target = 2 returns false instead of true.',
    fix: 'Shrink only when a[lo], a[mid] and a[hi] are all equal.',
    whyFixWorks: 'All three equal means the values in this slice cannot help distinguish which side is sorted.',
    dryRun: 'After the first shrink, lo=1, mid=3, hi=5. The buggy OR sees a[mid] == a[hi] and shrinks to lo=2, hi=4, then loses the 2 at index 2.',
    debuggingLesson: 'With duplicates, an equality shortcut must require all relevant boundary conditions, not just one.',
  },
  testCases: [
    { input: '[3,1,2,3,3,3,3], 2', expected: '1', buggyOutput: '0' },
    { input: '[3,1,2,3,3,3,3], 4', expected: '0' },
  ],
  harness: {
    expected: '1 0',
    driver: {
      java: `System.out.println((Solution.searchRotatedDup(new int[]{3,1,2,3,3,3,3}, 2) ? 1 : 0) + " " + (Solution.searchRotatedDup(new int[]{3,1,2,3,3,3,3}, 4) ? 1 : 0));`,
      python: `print(int(search_rotated_dup([3,1,2,3,3,3,3], 2)), int(search_rotated_dup([3,1,2,3,3,3,3], 4)))`,
      c: `printf("%d %d", search_rotated_dup((int[]){3,1,2,3,3,3,3}, 7, 2), search_rotated_dup((int[]){3,1,2,3,3,3,3}, 7, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean searchRotatedDup(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) {
                return true;
            }
            if (a[lo] == a[mid] && a[mid] == a[hi]) {
                lo++;
                hi--;
            } else if (a[lo] <= a[mid]) {
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
        return false;
    }
}
`,
      bugs: { 10: { was: 'a[lo] == a[mid] && a[mid] == a[hi]', buggy: 'if (a[lo] == a[mid] || a[mid] == a[hi]) {' } },
    },
    python: {
      correct: `
def search_rotated_dup(a, target):
    lo = 0
    hi = len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return True
        if a[lo] == a[mid] and a[mid] == a[hi]:
            lo += 1
            hi -= 1
        elif a[lo] <= a[mid]:
            if target >= a[lo] and target < a[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if target > a[mid] and target <= a[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return False
`,
      bugs: { 8: { was: 'a[lo] == a[mid] and a[mid] == a[hi]', buggy: 'if a[lo] == a[mid] or a[mid] == a[hi]:' } },
    },
    c: {
      correct: `
int search_rotated_dup(int a[], int n, int target) {
    int lo = 0;
    int hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            return 1;
        }
        if (a[lo] == a[mid] && a[mid] == a[hi]) {
            lo++;
            hi--;
        } else if (a[lo] <= a[mid]) {
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
    return 0;
}
`,
      bugs: { 9: { was: 'a[lo] == a[mid] && a[mid] == a[hi]', buggy: 'if (a[lo] == a[mid] || a[mid] == a[hi]) {' } },
    },
  },
});
