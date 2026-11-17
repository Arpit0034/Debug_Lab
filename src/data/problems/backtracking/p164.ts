import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p164',
  title: 'Visited letter is never restored',
  difficulty: 'Medium',
  topic: 'Backtracking',
  subtopic: 'Grid Word Search',
  tags: ['Grid', 'Word Search', 'Undo'],
  bugCategory: 'Missing Backtracking Operation',
  sourceInspiredBy: 'Word search grid backtracking pattern',
  description:
    'Return whether a word can be formed by moving between adjacent cells of a grid without reusing a cell in the same path.',
  constraints: ['1 <= rows, cols <= 6', 'Letters are uppercase'],
  examples: [
    { input: 'board = [[A,B],[C,D]], word = ACDB', output: 'true' },
  ],
  hints: ['After exploring one direction, the cell must be available for other choices.', 'Trace the first branch from the top-left A.'],
  complexity: { time: 'O(rows * cols * 4^L)', space: 'O(L)' },
  explanation: {
    overview: 'Search a grid for a path spelling a target word.',
    algorithm: 'Mark the current cell, explore four neighbours, and restore the cell after exploring so other branches can use it.',
    bug: 'The cell is not restored after the recursive search.',
    whyItFails: 'A cell marked during a failed branch remains blocked, so later valid branches cannot use it.',
    failingTestCase: 'board [[A,B],[C,D]], word ACDB: the code prints 0 instead of 1.',
    fix: 'Restore the original character after the recursive calls.',
    whyFixWorks: 'Each branch then sees the board in its original state, as required for independent exploration.',
    dryRun: 'The path A to B fails and leaves B blocked. Later the path A to C to D needs B at the end, but B is still blocked.',
    debuggingLesson: 'Whenever a search marks state temporarily, pair every mark with an undo on the way out.',
  },
  testCases: [{ input: '[[A,B],[C,D]], ACDB', expected: '1' }],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println((Solution.exist(new char[][]{{'A','B'},{'C','D'}}, "ACDB") ? 1 : 0));`,
      python: `print(1 if exist([['A','B'],['C','D']], "ACDB") else 0)`,
      c: `printf("%d", exist((char[][2]){{'A','B'},{'C','D'}}, 2, 2, "ACDB"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean dfs(char[][] b, String w, int i, int j, int k) {
        if (k == w.length()) {
            return true;
        }
        if (i < 0 || i >= b.length || j < 0 || j >= b[0].length || b[i][j] != w.charAt(k)) {
            return false;
        }
        char tmp = b[i][j];
        b[i][j] = '#';
        boolean ok = dfs(b, w, i + 1, j, k + 1) || dfs(b, w, i - 1, j, k + 1) || dfs(b, w, i, j + 1, k + 1) || dfs(b, w, i, j - 1, k + 1);
        b[i][j] = tmp;
        return ok;
    }
    static boolean exist(char[][] b, String w) {
        for (int i = 0; i < b.length; i++) {
            for (int j = 0; j < b[0].length; j++) {
                if (dfs(b, w, i, j, 0)) {
                    return true;
                }
            }
        }
        return false;
    }
}
`,
      bugs: { 12: { was: 'b[i][j] = tmp;', buggy: "b[i][j] = '#';" } },
    },
    python: {
      correct: `
def exist(board, word):
    def dfs(i, j, k):
        if k == len(word):
            return True
        if i < 0 or i >= len(board) or j < 0 or j >= len(board[0]) or board[i][j] != word[k]:
            return False
        tmp = board[i][j]
        board[i][j] = '#'
        ok = dfs(i + 1, j, k + 1) or dfs(i - 1, j, k + 1) or dfs(i, j + 1, k + 1) or dfs(i, j - 1, k + 1)
        board[i][j] = tmp
        return ok
    for i in range(len(board)):
        for j in range(len(board[0])):
            if dfs(i, j, 0):
                return True
    return False
`,
      bugs: { 10: { was: 'board[i][j] = tmp', buggy: "board[i][j] = '#'" } },
    },
    c: {
      correct: `
int dfs(char b[][2], int m, int n, char w[], int i, int j, int k) {
    if (w[k] == 0) {
        return 1;
    }
    if (i < 0 || i >= m || j < 0 || j >= n || b[i][j] != w[k]) {
        return 0;
    }
    char tmp = b[i][j];
    b[i][j] = '#';
    int ok = dfs(b, m, n, w, i + 1, j, k + 1) || dfs(b, m, n, w, i - 1, j, k + 1) || dfs(b, m, n, w, i, j + 1, k + 1) || dfs(b, m, n, w, i, j - 1, k + 1);
    b[i][j] = tmp;
    return ok;
}
int exist(char b[][2], int m, int n, char w[]) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (dfs(b, m, n, w, i, j, 0)) {
                return 1;
            }
        }
    }
    return 0;
}
`,
      bugs: { 11: { was: 'b[i][j] = tmp;', buggy: "b[i][j] = '#';" } },
    },
  },
});
