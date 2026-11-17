import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p206',
  title: 'Rotated minimum returns a larger value',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'Minimum in Rotated Array',
  tags: ['Binary Search', 'Rotated Array'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Minimum in rotated sorted array pattern',
  description:
    'Return the smallest value in a rotated sorted array of distinct values. The current code often returns a value from the unsorted side.',
  constraints: ['1 <= n <= 100000', 'All values are distinct', 'The array is a rotation of a sorted array'],
  examples: [
    { input: 'a = [4,5,6,7,0,1,2]', output: '0' },
  ],
  hints: ['Compare the middle with the rightmost element.', 'If a[mid] is larger than a[hi], where is the minimum?'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the minimum value in a rotated sorted array.',
    algorithm: 'Compare the middle value with the right end. If the middle is larger, the minimum is to the right; otherwise it is at or to the left.',
    bug: 'The comparison uses a[mid] < a[hi] instead of a[mid] > a[hi].',
    whyItFails: 'The search moves toward the larger half and can end on a value that is not the minimum.',
    failingTestCase: 'a = [4,5,6,7,0,1,2] returns 7 instead of 0.',
    fix: 'Use a[mid] > a[hi] to decide to move lo.',
    whyFixWorks: 'If the middle is greater than the right end, the rotation point is strictly to the right.',
    dryRun: 'mid=3 has 7 > 2, so lo becomes 4 and the search reaches 0. The buggy 7 < 2 is false, so hi becomes 3 and the search stays on the larger side.',
    debuggingLesson: 'Rotated-array searches compare with the sorted side, not with an arbitrary neighbour.',
  },
  testCases: [
    { input: '[4,5,6,7,0,1,2]', expected: '0', buggyOutput: '7' },
  ],
  harness: {
    expected: '0',
    driver: {
      java: `System.out.println(Solution.findMin(new int[]{4,5,6,7,0,1,2}));`,
      python: `print(find_min([4,5,6,7,0,1,2]))`,
      c: `printf("%d", find_min((int[]){4,5,6,7,0,1,2}, 7));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int findMin(int[] a) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] > a[hi]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return a[lo];
    }
}
`,
      bugs: { 7: { was: 'a[mid] > a[hi]', buggy: 'if (a[mid] < a[hi]) {' } },
    },
    python: {
      correct: `
def find_min(a):
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] > a[hi]:
            lo = mid + 1
        else:
            hi = mid
    return a[lo]
`,
      bugs: { 6: { was: 'a[mid] > a[hi]', buggy: 'if a[mid] < a[hi]:' } },
    },
    c: {
      correct: `
int find_min(int a[], int n) {
    int lo = 0;
    int hi = n - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] > a[hi]) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return a[lo];
}
`,
      bugs: { 6: { was: 'a[mid] > a[hi]', buggy: 'if (a[mid] < a[hi]) {' } },
    },
  },
});
