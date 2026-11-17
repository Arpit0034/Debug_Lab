import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p001',
  title: 'Search that never terminates',
  difficulty: 'Easy',
  topic: 'Searching',
  subtopic: 'Binary Search',
  tags: ['Binary Search', 'Search Space'],
  bugCategory: 'Incorrect Binary Search Boundary',
  sourceInspiredBy: 'Classic binary search pattern',
  description:
    'Given a sorted array of distinct integers and a target, return the index of the target, or -1 if it is not present. The function below sometimes never returns.',
  constraints: ['1 <= n <= 100000', 'The array is sorted in ascending order', 'All values are distinct'],
  examples: [
    { input: 'a = [1, 3, 5, 7], target = 5', output: '2' },
    { input: 'a = [1, 3], target = 3', output: '1', note: 'Expected 1, but the buggy code loops forever.' },
  ],
  hints: ['Trace the array [1, 3] with target 3 by hand.', 'Does the search range shrink on every iteration?'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find a target in a sorted array by repeatedly halving the range that can still contain it.',
    algorithm:
      'Keep lo and hi as the inclusive bounds of the candidate range. Compare the middle element with the target and discard the half that cannot contain it. The middle element has already been checked, so it must be excluded from the remaining range.',
    bug: 'When a[mid] < target the code sets lo = mid instead of lo = mid + 1.',
    whyItFails:
      'mid is rounded down, so when lo and hi are adjacent mid equals lo. Setting lo = mid then leaves the range unchanged and the loop repeats forever.',
    failingTestCase: 'a = [1, 3], target = 3: lo = 0, hi = 1, mid = 0, a[0] < 3, lo stays 0 forever.',
    fix: 'Use lo = mid + 1 so the already-checked middle element is excluded.',
    whyFixWorks:
      'Every iteration now removes at least one element from the range, so the loop must end, and no element that could equal the target is discarded.',
    dryRun:
      'a = [1, 3], target = 3. lo=0, hi=1, mid=0, a[0]=1 < 3 so lo = 1. Now lo=1, hi=1, mid=1, a[1]=3 matches and 1 is returned.',
    debuggingLesson:
      'In a binary search, check that every branch strictly shrinks the range. A branch that can leave lo and hi unchanged is an infinite loop waiting for the right input.',
  },
  testCases: [
    { input: '[1, 3], 3', expected: '1', buggyOutput: 'infinite loop' },
    { input: '[1, 3, 5, 7], 5', expected: '2' },
  ],
  harness: {
    expected: '1 2 -1',
    driver: {
      java: `System.out.println(Solution.search(new int[]{1, 3}, 3) + " " + Solution.search(new int[]{1, 3, 5, 7}, 5) + " " + Solution.search(new int[]{1, 3, 5, 7}, 4));`,
      python: `print(search([1, 3], 3), search([1, 3, 5, 7], 5), search([1, 3, 5, 7], 4))`,
      c: `printf("%d %d %d", search((int[]){1, 3}, 2, 3), search((int[]){1, 3, 5, 7}, 4, 5), search((int[]){1, 3, 5, 7}, 4, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int search(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) {
                return mid;
            } else if (a[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }
}
`,
      bugs: { 9: { was: 'lo = mid + 1', buggy: 'lo = mid;', fixes: ['lo = 1 + mid;'] } },
    },
    python: {
      correct: `
def search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
      bugs: { 8: { was: 'lo = mid + 1', buggy: 'lo = mid', fixes: ['lo = 1 + mid'] } },
    },
    c: {
      correct: `
int search(int a[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            return mid;
        } else if (a[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return -1;
}
`,
      bugs: { 8: { was: 'lo = mid + 1', buggy: 'lo = mid;', fixes: ['lo = 1 + mid;'] } },
    },
  },
});
