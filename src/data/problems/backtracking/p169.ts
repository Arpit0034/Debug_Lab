import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p169',
  title: 'Diagonal guard checks the wrong distance',
  difficulty: 'Hard',
  topic: 'Backtracking',
  subtopic: 'Queens Placement',
  tags: ['Queens', 'Diagonals', 'Safety Check'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'N-Queens counting pattern',
  description:
    'Return how many ways n queens can be placed on an n by n board so that no two attack each other.',
  constraints: ['1 <= n <= 8'],
  examples: [
    { input: 'n = 4', output: '2' },
  ],
  hints: ['Two queens attack diagonally when their row distance equals their column distance.', 'Trace the safety check for a queen two rows above.'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
  explanation: {
    overview: 'Count valid non-attacking queen placements row by row.',
    algorithm: 'Place one queen per row and check columns and diagonals against all previously placed queens.',
    bug: 'The diagonal test compares the column difference with the sum of row indices instead of the row difference.',
    whyItFails: 'Some attacking diagonal pairs are considered safe, so invalid boards are counted.',
    failingTestCase: 'n = 4: the code prints more than 2 solutions.',
    fix: 'Compare the column difference with the difference between the current row and the earlier row.',
    whyFixWorks: 'That is exactly the diagonal-attack condition on a square grid.',
    dryRun: 'For rows 0 and 2, columns 0 and 2 are diagonal because both differences are 2. The wrong check compares 2 with 0 + 2 in a different way and can miss it.',
    debuggingLesson: 'For grid safety checks, use the same distance measure for rows and columns.',
  },
  testCases: [{ input: '4', expected: '2' }],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.totalNQueens(4));`,
      python: `print(total_n_queens(4))`,
      c: `printf("%d", total_n_queens(4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean safe(int[] pos, int row, int col) {
        for (int r = 0; r < row; r++) {
            int c = pos[r];
            if (c == col || Math.abs(c - col) == row - r) {
                return false;
            }
        }
        return true;
    }
    static void dfs(int[] pos, int row, int n, int[] count) {
        if (row == n) {
            count[0]++;
            return;
        }
        for (int c = 0; c < n; c++) {
            if (safe(pos, row, c)) {
                pos[row] = c;
                dfs(pos, row + 1, n, count);
            }
        }
    }
    static int totalNQueens(int n) {
        int[] count = new int[1];
        dfs(new int[n], 0, n, count);
        return count[0];
    }
}
`,
      bugs: { 5: { was: 'Math.abs(c - col) == row - r', buggy: 'if (c == col || Math.abs(c - col) == row + r) {' } },
    },
    python: {
      correct: `
def total_n_queens(n):
    pos = [-1] * n
    count = [0]
    def safe(row, col):
        for r in range(row):
            c = pos[r]
            if c == col or abs(c - col) == row - r:
                return False
        return True
    def dfs(row):
        if row == n:
            count[0] += 1
            return
        for c in range(n):
            if safe(row, c):
                pos[row] = c
                dfs(row + 1)
    dfs(0)
    return count[0]
`,
      bugs: { 7: { was: 'abs(c - col) == row - r', buggy: 'if c == col or abs(c - col) == row + r:' } },
    },
    c: {
      correct: `
int safe(int pos[], int row, int col) {
    for (int r = 0; r < row; r++) {
        int c = pos[r];
        int dr = row - r;
        int dc = c > col ? c - col : col - c;
        if (c == col || dc == dr) {
            return 0;
        }
    }
    return 1;
}
void dfs(int pos[], int row, int n, int *count) {
    if (row == n) {
        (*count)++;
        return;
    }
    for (int c = 0; c < n; c++) {
        if (safe(pos, row, c)) {
            pos[row] = c;
            dfs(pos, row + 1, n, count);
        }
    }
}
int total_n_queens(int n) {
    int pos[10];
    int count = 0;
    dfs(pos, 0, n, &count);
    return count;
}
`,
      bugs: { 6: { was: 'dc == dr', buggy: 'if (c == col || dc == dr + row) {' } },
    },
  },
});
