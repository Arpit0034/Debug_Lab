import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p196',
  title: 'Last copy stops at the first',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'Last Occurrence',
  tags: ['Binary Search', 'Duplicates'],
  bugCategory: 'Incorrect Binary Search Boundary',
  sourceInspiredBy: 'Last occurrence in sorted array pattern',
  description:
    'Return the index of the last occurrence of a target in a sorted array, or -1 if absent. The current code can return an earlier duplicate.',
  constraints: ['1 <= n <= 100000', 'The array is sorted in non-decreasing order'],
  examples: [
    { input: 'a = [1,2,2,2,3], target = 2', output: '3' },
    { input: 'a = [1,2,2,2,3], target = 4', output: '-1' },
  ],
  hints: ['After a match, where must a later copy be?', 'Check which pointer is updated in the match branch.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the rightmost position of a repeated value in a sorted array.',
    algorithm: 'Record every matching index and continue searching the right half until the range is empty.',
    bug: 'When a match is found, the code moves hi to mid - 1 instead of lo to mid + 1.',
    whyItFails: 'Moving hi backward searches the left half, so earlier duplicates overwrite ans and the last occurrence is lost.',
    failingTestCase: 'a = [1,2,2,2,3], target = 2 returns 1 instead of 3.',
    fix: 'Set lo = mid + 1 after recording ans.',
    whyFixWorks: 'Any later occurrence must be at an index larger than mid.',
    dryRun: 'The correct code records mid=2, searches right, records mid=3, and returns 3. The buggy code records mid=2, searches left, and returns 1.',
    debuggingLesson: 'The direction of the remaining search determines whether you find the first or the last boundary.',
  },
  testCases: [
    { input: '[1,2,2,2,3], 2', expected: '3', buggyOutput: '1' },
    { input: '[1,2,2,2,3], 4', expected: '-1' },
  ],
  harness: {
    expected: '3 -1',
    driver: {
      java: `System.out.println(Solution.lastOccurrence(new int[]{1,2,2,2,3}, 2) + " " + Solution.lastOccurrence(new int[]{1,2,2,2,3}, 4));`,
      python: `print(last_occurrence([1,2,2,2,3], 2), last_occurrence([1,2,2,2,3], 4))`,
      c: `printf("%d %d", last_occurrence((int[]){1,2,2,2,3}, 5, 2), last_occurrence((int[]){1,2,2,2,3}, 5, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int lastOccurrence(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1;
        int ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) {
                ans = mid;
                lo = mid + 1;
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
      bugs: { 10: { was: 'lo = mid + 1;', buggy: 'hi = mid - 1;' } },
    },
    python: {
      correct: `
def last_occurrence(a, target):
    lo = 0
    hi = len(a) - 1
    ans = -1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            ans = mid
            lo = mid + 1
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return ans
`,
      bugs: { 9: { was: 'lo = mid + 1', buggy: 'hi = mid - 1' } },
    },
    c: {
      correct: `
int last_occurrence(int a[], int n, int target) {
    int lo = 0;
    int hi = n - 1;
    int ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) {
            ans = mid;
            lo = mid + 1;
        } else if (a[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}
`,
      bugs: { 9: { was: 'lo = mid + 1;', buggy: 'hi = mid - 1;' } },
    },
  },
});
