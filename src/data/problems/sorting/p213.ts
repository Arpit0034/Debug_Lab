import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p213',
  title: 'Three-way partition ignores the final cell',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Dutch National Flag',
  tags: ['Partition', 'In-place Sort'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Sort colors pattern',
  description:
    'Sort an array containing only 0, 1 and 2 in one pass. The current loop stops before processing the last cell.',
  constraints: ['1 <= n <= 100000', 'a[i] is 0, 1 or 2'],
  examples: [
    { input: 'a = [2,0,1]', output: '0 1 2' },
  ],
  hints: ['The middle pointer may still need to process the last index.', 'Trace the loop condition when mid equals hi.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Sort three possible values in place.',
    algorithm: 'Maintain regions for 0s, 1s and unprocessed values; move the middle pointer until it passes the high pointer.',
    bug: 'The loop uses mid < hi instead of mid <= hi.',
    whyItFails: 'The final unprocessed cell is ignored, so the array may remain unsorted.',
    failingTestCase: 'a = [2,0,1] becomes 1 0 2 instead of 0 1 2.',
    fix: 'Use while (mid <= hi).',
    whyFixWorks: 'The cell at hi is still part of the unprocessed region when mid equals hi.',
    dryRun: 'After swapping the first 2 with the last 1, mid=0 and hi=1. The correct loop continues; the buggy loop stops immediately at mid<hi false and leaves 1 before 0.',
    debuggingLesson: 'In inclusive pointer ranges, the loop must continue while the pointers can still point at unprocessed data.',
  },
  testCases: [
    { input: '[2,0,1]', expected: '0 1 2', buggyOutput: '1 0 2' },
  ],
  harness: {
    expected: '0 1 2',
    driver: {
      java: `int[] r = Solution.sortColors(new int[]{2,0,1}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*sort_colors([2,0,1]))`,
      c: `int a[] = {2,0,1}; sort_colors(a, 3); for (int i = 0; i < 3; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] sortColors(int[] a) {
        int lo = 0;
        int mid = 0;
        int hi = a.length - 1;
        while (mid <= hi) {
            if (a[mid] == 0) {
                int t = a[lo];
                a[lo] = a[mid];
                a[mid] = t;
                lo++;
                mid++;
            } else if (a[mid] == 1) {
                mid++;
            } else {
                int t = a[mid];
                a[mid] = a[hi];
                a[hi] = t;
                hi--;
            }
        }
        return a;
    }
}
`,
      bugs: { 6: { was: 'mid <= hi', buggy: 'while (mid < hi) {' } },
    },
    python: {
      correct: `
def sort_colors(a):
    lo = 0
    mid = 0
    hi = len(a) - 1
    while mid <= hi:
        if a[mid] == 0:
            a[lo], a[mid] = a[mid], a[lo]
            lo += 1
            mid += 1
        elif a[mid] == 1:
            mid += 1
        else:
            a[mid], a[hi] = a[hi], a[mid]
            hi -= 1
    return a
`,
      bugs: { 5: { was: 'mid <= hi', buggy: 'while mid < hi:' } },
    },
    c: {
      correct: `
void sort_colors(int a[], int n) {
    int lo = 0;
    int mid = 0;
    int hi = n - 1;
    while (mid <= hi) {
        if (a[mid] == 0) {
            int t = a[lo];
            a[lo] = a[mid];
            a[mid] = t;
            lo++;
            mid++;
        } else if (a[mid] == 1) {
            mid++;
        } else {
            int t = a[mid];
            a[mid] = a[hi];
            a[hi] = t;
            hi--;
        }
    }
}
`,
      bugs: { 5: { was: 'mid <= hi', buggy: 'while (mid < hi) {' } },
    },
  },
});
