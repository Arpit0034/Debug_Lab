import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p165',
  title: 'Subgrid duplicate is accepted',
  difficulty: 'Hard',
  topic: 'Backtracking',
  subtopic: 'Sudoku Validation',
  tags: ['Sudoku', 'Validation', 'Subgrid'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Sudoku board validation pattern',
  description:
    'Return whether a completed 4 by 4 number board is valid: every row, column and 2 by 2 subgrid must contain each number from 1 to 4 exactly once.',
  constraints: ['Board is 4 by 4', 'Entries are from 1 to 4'],
  examples: [
    { input: 'a cyclic Latin board whose subgrids repeat values', output: 'false' },
  ],
  hints: ['Rows and columns can be valid while a small square still repeats a number.', 'Check the duplicate handling inside each 2 by 2 block.'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  explanation: {
    overview: 'Validate all row, column and subgrid constraints of a small completed board.',
    algorithm: 'For each row, column and 2 by 2 block, scan its entries and ensure no value repeats.',
    bug: 'When a duplicate is found inside a block, the function returns true instead of false.',
    whyItFails: 'The first repeated value inside a block is treated as proof of validity, so invalid boards pass.',
    failingTestCase: 'The cyclic board with valid rows and columns but repeated subgrid values prints 1 instead of 0.',
    fix: 'Return false when a duplicate is seen.',
    whyFixWorks: 'Any duplicate violates the exactly-once rule, so validation must stop with failure.',
    dryRun: 'Rows and columns pass for the driver board. In the first 2 by 2 block, 1 appears twice; the wrong code returns true there.',
    debuggingLesson: 'In validation code, ensure every detected violation returns the failure value, not the success value.',
  },
  testCases: [{ input: 'cyclic 4 by 4 board', expected: '0' }],
  harness: {
    expected: '0',
    driver: {
      java: `System.out.println((Solution.isValid(new int[][]{{1,2,3,4},{2,3,4,1},{3,4,1,2},{4,1,2,3}}) ? 1 : 0));`,
      python: `print(1 if is_valid([[1,2,3,4],[2,3,4,1],[3,4,1,2],[4,1,2,3]]) else 0)`,
      c: `printf("%d", is_valid((int[][4]){{1,2,3,4},{2,3,4,1},{3,4,1,2},{4,1,2,3}}));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean isValid(int[][] b) {
        for (int r = 0; r < 4; r++) {
            boolean[] seen = new boolean[5];
            for (int c = 0; c < 4; c++) {
                int v = b[r][c];
                if (seen[v]) return false;
                seen[v] = true;
            }
        }
        for (int c = 0; c < 4; c++) {
            boolean[] seen = new boolean[5];
            for (int r = 0; r < 4; r++) {
                int v = b[r][c];
                if (seen[v]) return false;
                seen[v] = true;
            }
        }
        for (int br = 0; br < 4; br += 2) {
            for (int bc = 0; bc < 4; bc += 2) {
                boolean[] seen = new boolean[5];
                for (int i = 0; i < 2; i++) {
                    for (int j = 0; j < 2; j++) {
                        int v = b[br + i][bc + j];
                        if (seen[v]) return false;
                        seen[v] = true;
                    }
                }
            }
        }
        return true;
    }
}
`,
      bugs: { 25: { was: 'if (seen[v]) return false;', buggy: 'if (seen[v]) return true;' } },
    },
    python: {
      correct: `
def is_valid(b):
    for r in range(4):
        seen = [False] * 5
        for c in range(4):
            v = b[r][c]
            if seen[v]:
                return False
            seen[v] = True
    for c in range(4):
        seen = [False] * 5
        for r in range(4):
            v = b[r][c]
            if seen[v]:
                return False
            seen[v] = True
    for br in range(0, 4, 2):
        for bc in range(0, 4, 2):
            seen = [False] * 5
            for i in range(2):
                for j in range(2):
                    v = b[br + i][bc + j]
                    if seen[v]:
                        return False
                    seen[v] = True
    return True
`,
      bugs: { 23: { was: 'return False', buggy: 'return True' } },
    },
    c: {
      correct: `
int is_valid(int b[][4]) {
    for (int r = 0; r < 4; r++) {
        int seen[5] = {0};
        for (int c = 0; c < 4; c++) {
            int v = b[r][c];
            if (seen[v]) return 0;
            seen[v] = 1;
        }
    }
    for (int c = 0; c < 4; c++) {
        int seen[5] = {0};
        for (int r = 0; r < 4; r++) {
            int v = b[r][c];
            if (seen[v]) return 0;
            seen[v] = 1;
        }
    }
    for (int br = 0; br < 4; br += 2) {
        for (int bc = 0; bc < 4; bc += 2) {
            int seen[5] = {0};
            for (int i = 0; i < 2; i++) {
                for (int j = 0; j < 2; j++) {
                    int v = b[br + i][bc + j];
                    if (seen[v]) return 0;
                    seen[v] = 1;
                }
            }
        }
    }
    return 1;
}
`,
      bugs: { 25: { was: 'if (seen[v]) return 0;', buggy: 'if (seen[v]) return 1;' } },
    },
  },
});
