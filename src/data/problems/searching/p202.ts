import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p202',
  title: 'Kth matrix value jumps one too high',
  difficulty: 'Hard',
  topic: 'Searching',
  subtopic: 'Kth Smallest in Sorted Matrix',
  tags: ['Matrix', 'Binary Search'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Kth smallest in sorted matrix pattern',
  description:
    'Return the kth smallest value in a matrix whose rows and columns are sorted. The current code can return a value just above the true answer.',
  constraints: ['1 <= n <= 300', '1 <= k <= n * n', 'Rows and columns are sorted'],
  examples: [
    { input: 'm = [[1,5,9],[10,11,13],[12,13,15]], k = 8', output: '13' },
  ],
  hints: ['Count how many matrix values are at most a guessed value.', 'When the count equals k, should the upper bound stay at the guess or move past it?'],
  complexity: { time: 'O(n log(max - min))', space: 'O(1)' },
  explanation: {
    overview: 'Find the kth smallest value in a row-column sorted matrix.',
    algorithm: 'Binary search the value range. For each guess, count values at most the guess by walking from the bottom-left corner.',
    bug: 'The feasibility test uses count <= k instead of count < k.',
    whyItFails: 'When count equals k, the guess is still a valid upper bound, but the code moves the lower bound past it and returns a larger value.',
    failingTestCase: 'For the sample matrix and k=8, the code returns 14 instead of 13.',
    fix: 'Use if (count < k) to move lo; otherwise move hi.',
    whyFixWorks: 'If at least k values are at most mid, the answer cannot be greater than mid.',
    dryRun: 'At mid=13, count becomes 8. The correct code sets hi=13. The buggy code sets lo=14 and eventually returns 14.',
    debuggingLesson: 'In value-range binary search, equality with the target count means the guess is still feasible.',
  },
  testCases: [
    { input: '[[1,5,9],[10,11,13],[12,13,15]], 8', expected: '13', buggyOutput: '14' },
  ],
  harness: {
    expected: '13',
    driver: {
      java: `System.out.println(Solution.kthSmallest(new int[][]{{1,5,9},{10,11,13},{12,13,15}}, 8));`,
      python: `print(kth_smallest([[1,5,9],[10,11,13],[12,13,15]], 8))`,
      c: `int m[3][3] = {{1,5,9},{10,11,13},{12,13,15}}; printf("%d", kth_smallest(m, 3, 8));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int kthSmallest(int[][] m, int k) {
        int n = m.length;
        int lo = m[0][0];
        int hi = m[n - 1][n - 1];
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int count = 0;
            int row = n - 1;
            int col = 0;
            while (row >= 0 && col < n) {
                if (m[row][col] <= mid) {
                    count += row + 1;
                    col++;
                } else {
                    row--;
                }
            }
            if (count < k) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
}
`,
      bugs: { 19: { was: 'count < k', buggy: 'if (count <= k) {' } },
    },
    python: {
      correct: `
def kth_smallest(m, k):
    n = len(m)
    lo = m[0][0]
    hi = m[n - 1][n - 1]
    while lo < hi:
        mid = lo + (hi - lo) // 2
        count = 0
        row = n - 1
        col = 0
        while row >= 0 and col < n:
            if m[row][col] <= mid:
                count += row + 1
                col += 1
            else:
                row -= 1
        if count < k:
            lo = mid + 1
        else:
            hi = mid
    return lo
`,
      bugs: { 16: { was: 'count < k', buggy: 'if count <= k:' } },
    },
    c: {
      correct: `
int kth_smallest(int m[][3], int n, int k) {
    int lo = m[0][0];
    int hi = m[n - 1][n - 1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int count = 0;
        int row = n - 1;
        int col = 0;
        while (row >= 0 && col < n) {
            if (m[row][col] <= mid) {
                count += row + 1;
                col++;
            } else {
                row--;
            }
        }
        if (count < k) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
}
`,
      bugs: { 17: { was: 'count < k', buggy: 'if (count <= k) {' } },
    },
  },
});
