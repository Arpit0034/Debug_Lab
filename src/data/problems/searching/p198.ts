import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p198',
  title: 'Matrix walk turns the wrong way',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: '2D Matrix Search',
  tags: ['Matrix', 'Binary Search'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Search in row and column sorted matrix pattern',
  description:
    'Return whether a target exists in a matrix whose rows and columns are sorted. The current walk moves in the wrong direction when comparing values.',
  constraints: ['1 <= rows, cols <= 1000', 'Rows and columns are sorted in non-decreasing order'],
  examples: [
    { input: 'm = [[1,4,7],[2,5,8],[3,6,9]], target = 4', output: '1' },
    { input: 'm = [[1,4,7],[2,5,8],[3,6,9]], target = 10', output: '0' },
  ],
  hints: ['Start at the top-right corner and think about what a larger or smaller value means.', 'Trace target 4 through the first comparison.'],
  complexity: { time: 'O(rows + cols)', space: 'O(1)' },
  explanation: {
    overview: 'Decide whether a value appears in a matrix sorted along both rows and columns.',
    algorithm: 'Start at the top-right cell. If the cell is too large, move left; if it is too small, move down.',
    bug: 'The comparison uses a[r][c] < target where it should use a[r][c] > target.',
    whyItFails: 'The directions are reversed, so the walk moves away from the target and reports false.',
    failingTestCase: 'target 4 in the sample matrix returns false instead of true.',
    fix: 'Use a[r][c] > target to decide to move left.',
    whyFixWorks: 'At the top-right, a value greater than the target means the target cannot be in that column.',
    dryRun: 'Start at 7. Since 7 > 4, move left to 4 and return true. The buggy check 7 < 4 is false, so it moves down and misses 4.',
    debuggingLesson: 'In monotone matrix searches, verify the meaning of each movement direction with one concrete cell.',
  },
  testCases: [
    { input: '[[1,4,7],[2,5,8],[3,6,9]], 4', expected: '1', buggyOutput: '0' },
    { input: '[[1,4,7],[2,5,8],[3,6,9]], 10', expected: '0' },
  ],
  harness: {
    expected: '1 0',
    driver: {
      java: `System.out.println((Solution.searchMatrix(new int[][]{{1,4,7},{2,5,8},{3,6,9}}, 4) ? 1 : 0) + " " + (Solution.searchMatrix(new int[][]{{1,4,7},{2,5,8},{3,6,9}}, 10) ? 1 : 0));`,
      python: `print(int(search_matrix([[1,4,7],[2,5,8],[3,6,9]], 4)), int(search_matrix([[1,4,7],[2,5,8],[3,6,9]], 10)))`,
      c: `int m[3][3] = {{1,4,7},{2,5,8},{3,6,9}}; printf("%d %d", search_matrix(m, 3, 4), search_matrix(m, 3, 10));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean searchMatrix(int[][] m, int target) {
        int r = 0;
        int c = m[0].length - 1;
        while (r < m.length && c >= 0) {
            if (m[r][c] == target) {
                return true;
            } else if (m[r][c] > target) {
                c--;
            } else {
                r++;
            }
        }
        return false;
    }
}
`,
      bugs: { 8: { was: 'm[r][c] > target', buggy: '} else if (m[r][c] < target) {' } },
    },
    python: {
      correct: `
def search_matrix(m, target):
    r = 0
    c = len(m[0]) - 1
    while r < len(m) and c >= 0:
        if m[r][c] == target:
            return True
        elif m[r][c] > target:
            c -= 1
        else:
            r += 1
    return False
`,
      bugs: { 7: { was: 'm[r][c] > target', buggy: 'elif m[r][c] < target:' } },
    },
    c: {
      correct: `
int search_matrix(int m[][3], int rows, int target) {
    int r = 0;
    int c = 2;
    while (r < rows && c >= 0) {
        if (m[r][c] == target) {
            return 1;
        } else if (m[r][c] > target) {
            c--;
        } else {
            r++;
        }
    }
    return 0;
}
`,
      bugs: { 7: { was: 'm[r][c] > target', buggy: '} else if (m[r][c] < target) {' } },
    },
  },
});
