import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p020',
  title: 'Queens that block too much',
  difficulty: 'Hard',
  topic: 'Backtracking',
  subtopic: 'N-Queens',
  tags: ['Backtracking', 'State Restoration'],
  bugCategory: 'Missing Backtracking Operation',
  sourceInspiredBy: 'Counting N-Queens placements',
  description: 'Count the ways to place n queens on an n by n board so that none attack each other. The function returns too few solutions for n = 4 and above.',
  constraints: ['1 <= n <= 12'],
  examples: [{ input: 'n = 4', output: '2' }, { input: 'n = 6', output: '4', note: 'The buggy code returns 0 for both.' }],
  hints: ['After trying a queen and coming back, is every piece of state the way it was before?'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
  explanation: {
    overview: 'Count all valid queen arrangements.',
    algorithm: 'Place one queen per row. Track used columns and both diagonal directions. After exploring a placement, undo every marker so the next column starts from a clean state.',
    bug: 'Java and C: only the column marker is cleared on the way back. Python: the wrong key is removed from the anti-diagonal set.',
    whyItFails: 'The diagonal markers from earlier attempts remain set, so squares that are actually free look attacked and valid placements are pruned away.',
    failingTestCase: 'n = 4 should give 2 solutions. The leftover diagonal markers block every later placement, and the count is 0.',
    fix: 'Undo all three markers: column, diagonal and anti-diagonal (with the same key used to set them).',
    whyFixWorks: 'Each recursive call starts with exactly the state its caller had, which is what backtracking requires.',
    dryRun: 'n = 4: place in row 0 col 1, continue to rows 1 to 3 and find a solution, then clear col 1, its diagonal and anti-diagonal, and try col 2. All markers are clean for each attempt.',
    debuggingLesson: 'Every "do" step in backtracking needs an exact mirror "undo". List both side by side and compare them.',
  },
  testCases: [{ input: '4', expected: '2', buggyOutput: '0' }],
  harness: {
    expected: '2 4',
    driver: {
      java: `System.out.println(Solution.solveNQueens(4) + " " + Solution.solveNQueens(6));`,
      python: `print(solve_n_queens(4), solve_n_queens(6))`,
      c: `printf("%d %d", solve_n_queens(4), solve_n_queens(6));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int solveNQueens(int n) {
        return place(0, n, new boolean[n], new boolean[2 * n], new boolean[2 * n]);
    }

    static int place(int row, int n, boolean[] cols, boolean[] diag, boolean[] anti) {
        if (row == n) {
            return 1;
        }
        int count = 0;
        for (int c = 0; c < n; c++) {
            int d = row - c + n;
            int a = row + c;
            if (cols[c] || diag[d] || anti[a]) {
                continue;
            }
            cols[c] = diag[d] = anti[a] = true;
            count += place(row + 1, n, cols, diag, anti);
            cols[c] = diag[d] = anti[a] = false;
        }
        return count;
    }
}
`,
      bugs: { 19: { was: 'anti[a] = false', buggy: 'cols[c] = false;' } },
    },
    python: {
      correct: `
def solve_n_queens(n):
    cols, diag, anti = set(), set(), set()

    def place(row):
        if row == n:
            return 1
        count = 0
        for c in range(n):
            if c in cols or (row - c) in diag or (row + c) in anti:
                continue
            cols.add(c)
            diag.add(row - c)
            anti.add(row + c)
            count += place(row + 1)
            cols.remove(c)
            diag.remove(row - c)
            anti.remove(row + c)
        return count

    return place(0)
`,
      bugs: { 17: { was: 'anti.remove(row + c)', buggy: 'anti.discard(row - c)' } },
    },
    c: {
      correct: `
int place(int row, int n, int cols[], int diag[], int anti[]) {
    if (row == n) {
        return 1;
    }
    int count = 0;
    for (int c = 0; c < n; c++) {
        int d = row - c + n;
        int a = row + c;
        if (cols[c] || diag[d] || anti[a]) {
            continue;
        }
        cols[c] = diag[d] = anti[a] = 1;
        count += place(row + 1, n, cols, diag, anti);
        cols[c] = diag[d] = anti[a] = 0;
    }
    return count;
}

int solve_n_queens(int n) {
    int cols[16] = {0}, diag[32] = {0}, anti[32] = {0};
    return place(0, n, cols, diag, anti);
}
`,
      bugs: { 14: { was: 'anti[a] = 0', buggy: 'cols[c] = 0;' } },
    },
  },
});
