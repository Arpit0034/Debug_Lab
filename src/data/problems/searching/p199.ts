import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p199',
  title: 'Occurrence count loses every match',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'Counting Occurrences',
  tags: ['Binary Search', 'Duplicates'],
  bugCategory: 'Incorrect Binary Search Boundary',
  sourceInspiredBy: 'Count occurrences in sorted array pattern',
  description:
    'Return how many times a target appears in a sorted array. The current code reports zero even when the target is present.',
  constraints: ['1 <= n <= 100000', 'The array is sorted in non-decreasing order'],
  examples: [
    { input: 'a = [1,2,2,2,3], target = 2', output: '3' },
    { input: 'a = [1,2,2,2,3], target = 4', output: '0' },
  ],
  hints: ['The first match is found, but is it remembered?', 'Trace the branch where a[mid] equals the target.'],
  complexity: { time: 'O(log n + count)', space: 'O(1)' },
  explanation: {
    overview: 'Count copies of a value in a sorted array.',
    algorithm: 'Find a starting match with binary search, then scan forward while values remain equal.',
    bug: 'The search condition uses a[mid] > target instead of a[mid] >= target.',
    whyItFails: 'When a[mid] equals the target, the equality branch is never entered, so first stays -1 and the count is zero.',
    failingTestCase: 'a = [1,2,2,2,3], target = 2 returns 0 instead of 3.',
    fix: 'Use a[mid] >= target in the binary search.',
    whyFixWorks: 'Equality must be treated as a possible first occurrence, so the search continues left while remembering the match.',
    dryRun: 'For target 2, mid=2 gives 2 >= 2, so first becomes 2. The scan then counts indices 2,3 and returns 3.',
    debuggingLesson: 'When searching for a boundary, test the equality case explicitly because it usually belongs with one side.',
  },
  testCases: [
    { input: '[1,2,2,2,3], 2', expected: '3', buggyOutput: '0' },
    { input: '[1,2,2,2,3], 4', expected: '0' },
  ],
  harness: {
    expected: '3 0',
    driver: {
      java: `System.out.println(Solution.countOccurrences(new int[]{1,2,2,2,3}, 2) + " " + Solution.countOccurrences(new int[]{1,2,2,2,3}, 4));`,
      python: `print(count_occurrences([1,2,2,2,3], 2), count_occurrences([1,2,2,2,3], 4))`,
      c: `printf("%d %d", count_occurrences((int[]){1,2,2,2,3}, 5, 2), count_occurrences((int[]){1,2,2,2,3}, 5, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int countOccurrences(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1;
        int first = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= target) {
                if (a[mid] == target) {
                    first = mid;
                }
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        if (first == -1) {
            return 0;
        }
        int count = 0;
        for (int i = first; i < a.length && a[i] == target; i++) {
            count++;
        }
        return count;
    }
}
`,
      bugs: { 8: { was: 'a[mid] >= target', buggy: 'if (a[mid] > target) {' } },
    },
    python: {
      correct: `
def count_occurrences(a, target):
    lo = 0
    hi = len(a) - 1
    first = -1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] >= target:
            if a[mid] == target:
                first = mid
            hi = mid - 1
        else:
            lo = mid + 1
    if first == -1:
        return 0
    count = 0
    i = first
    while i < len(a) and a[i] == target:
        count += 1
        i += 1
    return count
`,
      bugs: { 7: { was: 'a[mid] >= target', buggy: 'if a[mid] > target:' } },
    },
    c: {
      correct: `
int count_occurrences(int a[], int n, int target) {
    int lo = 0;
    int hi = n - 1;
    int first = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] >= target) {
            if (a[mid] == target) {
                first = mid;
            }
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }
    if (first == -1) {
        return 0;
    }
    int count = 0;
    for (int i = first; i < n && a[i] == target; i++) {
        count++;
    }
    return count;
}
`,
      bugs: { 7: { was: 'a[mid] >= target', buggy: 'if (a[mid] > target) {' } },
    },
  },
});
