import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p075',
  title: 'The fill leaks through walls',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Grid Flood Fill',
  tags: ['Graph', 'Grid', 'Flood Fill'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Flood fill area on a grid with blocked cells',
  description:
    'Return the area of the region of 1s connected to a starting cell. Cells containing 2 are walls and must block the fill.',
  constraints: ['1 <= rows, cols <= 100', 'Grid values are 0, 1 or 2'],
  examples: [
    { input: 'grid = [[1,1,2,1],[1,1,2,1],[0,0,2,1]], start = (0,0)', output: '4' },
  ],
  hints: ['Decide exactly which cell values should stop the recursion.', 'A wall has value 2, not value 1.'],
  complexity: { time: 'O(rows * cols)', space: 'O(rows * cols)' },
  explanation: {
    overview: 'Count the connected area of land cells while walls block movement.',
    algorithm: 'Recursively visit neighbours of value 1, marking visited cells by changing them to 0.',
    bug: 'The stopping condition treats only water (0) as blocked, so walls (2) are traversed and counted.',
    whyItFails: 'The fill passes through walls, joins separate regions, and counts wall cells as part of the area.',
    failingTestCase: 'The sample grid returns 10 instead of 4 because the wall column is crossed.',
    fix: 'Stop when the cell value is not 1.',
    whyFixWorks: 'Both water and walls are rejected, so only connected land cells contribute to the area.',
    dryRun: 'Starting at (0,0), the correct fill visits four left-side 1s and stops at the 2 column. The buggy fill steps onto the 2s, then reaches the right-side 1s, giving 10.',
    debuggingLesson: 'For grid searches, write down the exact set of passable cell values before trusting a boundary condition.',
  },
  testCases: [
    { input: '[[1,1,2,1],[1,1,2,1],[0,0,2,1]], 0, 0', expected: '4', buggyOutput: '10' },
  ],
  harness: {
    expected: '4',
    driver: {
      java: `System.out.print(Solution.floodArea(new int[][]{{1,1,2,1},{1,1,2,1},{0,0,2,1}}, 0, 0));`,
      python: `print(flood_area([[1,1,2,1],[1,1,2,1],[0,0,2,1]], 0, 0))`,
      c: `printf("%d", flood_area((int[][4]){{1,1,2,1},{1,1,2,1},{0,0,2,1}}, 3, 0, 0));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int floodArea(int[][] g, int r, int c) {
        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length) {
            return 0;
        }
        if (g[r][c] != 1) {
            return 0;
        }
        g[r][c] = 0;
        return 1 + floodArea(g, r + 1, c) + floodArea(g, r - 1, c)
                 + floodArea(g, r, c + 1) + floodArea(g, r, c - 1);
    }
}
`,
      bugs: { 6: { was: 'g[r][c] != 1', buggy: 'if (g[r][c] == 0) {' } },
    },
    python: {
      correct: `
def flood_area(g, r, c):
    if r < 0 or r >= len(g) or c < 0 or c >= len(g[0]):
        return 0
    if g[r][c] != 1:
        return 0
    g[r][c] = 0
    return 1 + flood_area(g, r + 1, c) + flood_area(g, r - 1, c) + flood_area(g, r, c + 1) + flood_area(g, r, c - 1)
`,
      bugs: { 4: { was: 'g[r][c] != 1', buggy: 'if g[r][c] == 0:' } },
    },
    c: {
      correct: `
int flood_area(int g[][4], int rows, int r, int c) {
    if (r < 0 || r >= rows || c < 0 || c >= 4) {
        return 0;
    }
    if (g[r][c] != 1) {
        return 0;
    }
    g[r][c] = 0;
    return 1 + flood_area(g, rows, r + 1, c) + flood_area(g, rows, r - 1, c) + flood_area(g, rows, r, c + 1) + flood_area(g, rows, r, c - 1);
}
`,
      bugs: { 5: { was: 'g[r][c] != 1', buggy: 'if (g[r][c] == 0) {' } },
    },
  },
});
