import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p195',
  title: 'First copy drifts to the right',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'First Occurrence',
  tags: ['Binary Search', 'Duplicates'],
  bugCategory: 'Incorrect Binary Search Boundary',
  sourceInspiredBy: 'First occurrence in sorted array pattern',
  description:
    'Return the index of the first occurrence of a target in a sorted array, or -1 if absent. The current code can return a later duplicate instead.',
  constraints: ['1 <= n <= 100000', 'The array is sorted in non-decreasing order'],
  examples: [
    { input: 'a = [1,2,2,2,3], target = 2', output: '1' },
    { input: 'a = [1,2,2,2,3], target = 4', output: '-1' },
  ],
  hints: ['After finding the target, which side must still be searched for an earlier copy?', 'Trace the assignment made when a[mid] equals the target.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the leftmost position of a repeated value in a sorted array.',
    algorithm: 'Record every matching index and continue searching the left half until the range is empty.',
    bug: 'When a match is found, the code moves lo to mid + 1 instead of hi to mid - 1.',
    whyItFails: 'Moving lo forward searches the right half, so later duplicates overwrite ans and the first occurrence is lost.',
    failingTestCase: 'a = [1,2,2,2,3], target = 2 returns 3 instead of 1.',
    fix: 'Set hi = mid - 1 after recording ans.',
    whyFixWorks: 'Any earlier occurrence must be at an index smaller than mid.',
    dryRun: 'The correct code records mid=2, then searches left; it records mid=1 and stops. The buggy code records mid=2, then searches right and records mid=3.',
    debuggingLesson: 'When binary searching for a boundary, decide explicitly which side can still contain a better answer.',
  },
  testCases: [
    { input: '[1,2,2,2,3], 2', expected: '1', buggyOutput: '3' },
    { input: '[1,2,2,2,3], 4', expected: '-1' },
  ],
  harness: {
    expected: '1 -1',
    driver: {
      java: `System.out.println(Solution.firstOccurrence(new int[]{1,2,2,2,3}, 2) + " " + Solution.firstOccurrence(new int[]{1,2,2,2,3}, 4));`,
      python: `print(first_occurrence([1,2,2,2,3], 2), first_occurrence([1,2,2,2,3], 4))`,
      c: `printf("%d %d", first_occurrence((int[]){1,2,2,2,3}, 5, 2), first_occurrence((int[]){1,2,2,2,3}, 5, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int firstOccurrence(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1;
        int ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) {
                ans = mid;
                hi = mid - 1;
            } else if (a[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}
`,
      bugs: { 10: { was: 'hi = mid - 1;', buggy: 'lo = mid + 1;' } },
    },
    python: {
      correct: `
def first_occurrence(a, target):
    lo = 0
    hi = len(a) - 1
    ans = -1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            ans = mid
            hi = mid - 1
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return ans
`,
      bugs: { 9: { was: 'hi = mid - 1', buggy: 'lo = mid + 1' } },
    },
    c: {
      correct: `
int first_occurrence(int a[], int n, int target) {
    int lo = 0;
    int hi = n - 1;
    int ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            ans = mid;
            hi = mid - 1;
        } else if (a[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}
`,
      bugs: { 9: { was: 'hi = mid - 1;', buggy: 'lo = mid + 1;' } },
    },
  },
});
