import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p181',
  title: 'A route stops at the edge',
  difficulty: 'Medium',
  topic: 'Recursion',
  subtopic: 'Grid Route Counting',
  tags: ['Recursion', 'Grid', 'Counting'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Count monotone grid paths pattern',
  description:
    'Return how many routes move only down and right from the top-left cell to the bottom-right cell of a grid with blocked cells. Routes are miscounted whenever a blocked cell sits on the last row.',
  constraints: ['1 <= rows, cols <= 10', 'Blocked cells are marked 1, open cells 0'],
  examples: [
    { input: '3 by 3 grid with a blocked cell at row 2, column 1', output: '3' },
    { input: 'all open 2 by 2 grid', output: '2' },
  ],
  hints: ['Only the bottom-right cell is a completed route.', 'Reaching the last row or the last column does not mean the route is finished; the cells ahead may be blocked.'],
  complexity: { time: 'O(2^(rows+cols))', space: 'O(rows+cols)' },
  explanation: {
    overview: 'Count routes from the top-left corner to the bottom-right corner using only down and right moves.',
    algorithm: 'At each cell, recurse down and right, and count a success only when the bottom-right cell is reached.',
    bug: 'The success condition accepts any cell on the last row or last column.',
    whyItFails: 'A cell on an edge is not necessarily the destination. Counting it as one assumes the rest of the edge is clear, so a blocked cell further along the last row is ignored.',
    failingTestCase: 'On a 3 by 3 grid whose cell at row 2, column 1 is blocked, the correct count is 3, but the code returns 4.',
    fix: 'Require both the last row and the last column for success.',
    whyFixWorks: 'Only the bottom-right cell represents a complete route, so the walk keeps checking cells past an edge entry.',
    dryRun: 'The blocked cell at (2,1) kills the route that reaches (2,0). The correct walk returns 0 from (2,0) and totals 3. The bug returns 1 at (2,0) and totals 4.',
    debuggingLesson: 'In grid recursion, write the exact destination coordinates and compare both coordinates; an edge is not a finish line.',
  },
  testCases: [
    { input: '3 by 3 with block at (2,1)', expected: '3', buggyOutput: '4' },
  ],
  harness: {
    expected: '3',
    driver: {
      java: `int[][] g={{0,0,0},{0,0,0},{0,1,0}}; System.out.println(Solution.count(g,0,0));`,
      python: `print(count([[0,0,0],[0,0,0],[0,1,0]],0,0))`,
      c: `int g[3][3]={{0,0,0},{0,0,0},{0,1,0}}; printf("%d", count(g,3,3,0,0));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int count(int[][] g, int r, int c) {
        int n = g.length;
        int m = g[0].length;
        if (r >= n || c >= m || g[r][c] == 1) {
            return 0;
        }
        if (r == n - 1 && c == m - 1) {
            return 1;
        }
        return count(g, r + 1, c) + count(g, r, c + 1);
    }
}
`,
      bugs: { 8: { was: 'if (r == n - 1 && c == m - 1) {', buggy: 'if (r == n - 1 || c == m - 1) {' } },
    },
    python: {
      correct: `
def count(g, r, c):
    n = len(g)
    m = len(g[0])
    if r >= n or c >= m or g[r][c] == 1:
        return 0
    if r == n - 1 and c == m - 1:
        return 1
    return count(g, r + 1, c) + count(g, r, c + 1)
`,
      bugs: { 6: { was: 'if r == n - 1 and c == m - 1:', buggy: 'if r == n - 1 or c == m - 1:' } },
    },
    c: {
      correct: `
int count(int g[][3], int n, int m, int r, int c) {
    if (r >= n || c >= m || g[r][c] == 1) {
        return 0;
    }
    if (r == n - 1 && c == m - 1) {
        return 1;
    }
    return count(g, n, m, r + 1, c) + count(g, n, m, r, c + 1);
}
`,
      bugs: { 5: { was: 'if (r == n - 1 && c == m - 1) {', buggy: 'if (r == n - 1 || c == m - 1) {' } },
    },
  },
});
