import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p170',
  title: 'First route blocks the second',
  difficulty: 'Medium',
  topic: 'Backtracking',
  subtopic: 'Grid Route Counting',
  tags: ['Grid', 'Routes', 'Undo'],
  bugCategory: 'Missing Backtracking Operation',
  sourceInspiredBy: 'Rat in a maze path counting pattern',
  description:
    'Return how many routes exist from the top-left to the bottom-right cell of an open grid while moving in four directions without revisiting a cell in the same route.',
  constraints: ['1 <= rows, cols <= 5', 'Cells contain 0 for open and 1 for blocked'],
  examples: [
    { input: 'grid = [[0,0],[0,0]]', output: '2' },
  ],
  hints: ['After a route is counted, the cells it used must be available for another route.', 'Trace the two routes through a 2 by 2 grid.'],
  complexity: { time: 'O(4^(rows * cols))', space: 'O(rows * cols)' },
  explanation: {
    overview: 'Count simple paths from the start to the destination through open cells.',
    algorithm: 'Mark the current cell as visited, explore four neighbours, and then unmark the cell before returning.',
    bug: 'The cell is marked again instead of being unmarked after exploration.',
    whyItFails: 'Cells used by the first route stay blocked, so later valid routes cannot pass through them.',
    failingTestCase: 'A 2 by 2 open grid: the code prints 1 instead of 2.',
    fix: 'Restore the cell to open after exploring its neighbours.',
    whyFixWorks: 'Each route starts from the original grid, so all routes are counted independently.',
    dryRun: 'The first route down-right marks all four cells. Without undo, the second route right-down sees blocked cells and is lost.',
    debuggingLesson: 'In path counting, any temporary visited mark must be removed before trying sibling routes.',
  },
  testCases: [{ input: '[[0,0],[0,0]]', expected: '2' }],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.countPaths(new int[][]{{0,0},{0,0}}));`,
      python: `print(count_paths([[0,0],[0,0]]))`,
      c: `printf("%d", count_paths((int[][2]){{0,0},{0,0}}, 2, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static void dfs(int[][] g, int r, int c, int[] count) {
        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] == 1) {
            return;
        }
        if (r == g.length - 1 && c == g[0].length - 1) {
            count[0]++;
            return;
        }
        g[r][c] = 1;
        dfs(g, r + 1, c, count);
        dfs(g, r - 1, c, count);
        dfs(g, r, c + 1, count);
        dfs(g, r, c - 1, count);
        g[r][c] = 0;
    }
    static int countPaths(int[][] g) {
        int[] count = new int[1];
        dfs(g, 0, 0, count);
        return count[0];
    }
}
`,
      bugs: { 15: { was: 'g[r][c] = 0;', buggy: 'g[r][c] = 1;' } },
    },
    python: {
      correct: `
def count_paths(g):
    count = [0]
    def dfs(r, c):
        if r < 0 or r >= len(g) or c < 0 or c >= len(g[0]) or g[r][c] == 1:
            return
        if r == len(g) - 1 and c == len(g[0]) - 1:
            count[0] += 1
            return
        g[r][c] = 1
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        g[r][c] = 0
    dfs(0, 0)
    return count[0]
`,
      bugs: { 14: { was: 'g[r][c] = 0', buggy: 'g[r][c] = 1' } },
    },
    c: {
      correct: `
void dfs(int g[][2], int m, int n, int r, int c, int *count) {
    if (r < 0 || r >= m || c < 0 || c >= n || g[r][c] == 1) {
        return;
    }
    if (r == m - 1 && c == n - 1) {
        (*count)++;
        return;
    }
    g[r][c] = 1;
    dfs(g, m, n, r + 1, c, count);
    dfs(g, m, n, r - 1, c, count);
    dfs(g, m, n, r, c + 1, count);
    dfs(g, m, n, r, c - 1, count);
    g[r][c] = 0;
}
int count_paths(int g[][2], int m, int n) {
    int count = 0;
    dfs(g, m, n, 0, 0, &count);
    return count;
}
`,
      bugs: { 14: { was: 'g[r][c] = 0;', buggy: 'g[r][c] = 1;' } },
    },
  },
});
