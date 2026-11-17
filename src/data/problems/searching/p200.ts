import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p200',
  title: 'Peak search picks the valley',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'Peak Element',
  tags: ['Binary Search', 'Array'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Find peak element pattern',
  description:
    'Return the index of a peak element in an array where neighbours are never equal. The current code often returns an end index instead of a peak.',
  constraints: ['1 <= n <= 100000', 'a[i] != a[i + 1] for all valid i'],
  examples: [
    { input: 'a = [1,2,3,1]', output: '2' },
    { input: 'a = [1,3,5,4,2]', output: '2' },
  ],
  hints: ['Compare the middle with its right neighbour.', 'If the slope is going down, where can a peak be?'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find any index whose value is greater than its neighbours.',
    algorithm: 'Move toward the side with the higher neighbour until the range collapses to a peak.',
    bug: 'The code checks a[mid] > a[mid + 1] but moves lo when the slope goes down.',
    whyItFails: 'The movement is reversed, so the search walks away from the peak and can settle on an endpoint.',
    failingTestCase: 'a = [1,2,3,1] returns 0 instead of 2.',
    fix: 'Use a[mid] < a[mid + 1] to decide to move lo to mid + 1.',
    whyFixWorks: 'If the next value is larger, a peak must exist on the right side.',
    dryRun: 'For [1,2,3,1], mid=1 has 2 < 3, so move lo to 2. The range ends at index 2, a peak.',
    debuggingLesson: 'Binary search on a shape depends on moving uphill, not downhill.',
  },
  testCases: [
    { input: '[1,2,3,1]', expected: '2', buggyOutput: '0' },
    { input: '[1,3,5,4,2]', expected: '2', buggyOutput: '4' },
  ],
  harness: {
    expected: '2 2',
    driver: {
      java: `System.out.println(Solution.findPeak(new int[]{1,2,3,1}) + " " + Solution.findPeak(new int[]{1,3,5,4,2}));`,
      python: `print(find_peak([1,2,3,1]), find_peak([1,3,5,4,2]))`,
      c: `printf("%d %d", find_peak((int[]){1,2,3,1}, 4), find_peak((int[]){1,3,5,4,2}, 5));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int findPeak(int[] a) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] < a[mid + 1]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
}
`,
      bugs: { 7: { was: 'a[mid] < a[mid + 1]', buggy: 'if (a[mid] > a[mid + 1]) {' } },
    },
    python: {
      correct: `
def find_peak(a):
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] < a[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo
`,
      bugs: { 6: { was: 'a[mid] < a[mid + 1]', buggy: 'if a[mid] > a[mid + 1]:' } },
    },
    c: {
      correct: `
int find_peak(int a[], int n) {
    int lo = 0;
    int hi = n - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < a[mid + 1]) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
}
`,
      bugs: { 6: { was: 'a[mid] < a[mid + 1]', buggy: 'if (a[mid] > a[mid + 1]) {' } },
    },
  },
});
