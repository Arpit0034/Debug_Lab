import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p128',
  title: 'Histogram rectangle spans too far',
  difficulty: 'Hard',
  topic: 'Stacks and Queues',
  subtopic: 'Area Optimization',
  tags: ['Histogram Area', 'Boundary Determination'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Largest rectangle in histogram pattern',
  description:
    'Given heights of contiguous columns each of unit width, find the area of the largest rectangular region that fits entirely within the column bounds. The implementation calculates an incorrect span width for popped column heights.',
  constraints: ['1 <= n <= 1000', '0 <= h[i] <= 10000'],
  examples: [
    { input: 'h = [2, 1, 5, 6, 2, 3]', output: '10', note: 'The columns 5 and 6 form a rectangle of height 5 and width 2 with area 10.' },
    { input: 'h = [2, 4]', output: '4' },
  ],
  hints: [
    'Examine how the horizontal span is computed when a height is popped and bounded by previous smaller columns.',
    'Check whether both boundary column indices are excluded when deriving the active span width.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Determine the maximum rectangular area possible across a histogram.',
    algorithm:
      'Maintain column indices in increasing order of height. When a shorter bar is encountered, pop taller bars and compute their rectangular area bounded by the current index and the preceding index.',
    bug: 'The width computation uses (i - st[top]) instead of (i - st[top] - 1) when the container is not empty.',
    whyItFails:
      'The rectangle can only extend strictly between index st[top] and index i. The number of valid columns between two boundaries left and right is right - left - 1. Omitting the - 1 overestimates the width by 1.',
    failingTestCase: 'h = [2, 4]: popping 4 bounded by 2 at index 0 computes width 2 - 0 = 2 instead of 2 - 0 - 1 = 1, yielding area 8 instead of 4.',
    fix: 'Change (i - st[top]) to (i - st[top] - 1).',
    whyFixWorks: 'Subtracting an extra 1 properly excludes both the left and right bounding indices where heights fall below the popped bar.',
    dryRun:
      'For h = [2, 4] at i = 2 (sentinel 0): height 4 popped. Left bound is index 0. Correct width = 2 - 0 - 1 = 1. Area = 4 * 1 = 4. Then height 2 popped. Container empty -> width = 2. Area = 2 * 2 = 4. Max = 4.',
    debuggingLesson:
      'For interval lengths bounded strictly between two indices (L, R), the count of included elements is always R - L - 1.',
  },
  testCases: [
    { input: '[2, 1, 5, 6, 2, 3]', expected: '10', buggyOutput: '15' },
    { input: '[2, 4]', expected: '4', buggyOutput: '8' },
  ],
  harness: {
    expected: '10 4',
    driver: {
      java: `System.out.println(Solution.largestRectangleArea(new int[]{2, 1, 5, 6, 2, 3}) + " " + Solution.largestRectangleArea(new int[]{2, 4}));`,
      python: `print(largest_rectangle_area([2, 1, 5, 6, 2, 3]), largest_rectangle_area([2, 4]))`,
      c: `printf("%d %d", largest_rectangle_area((int[]){2, 1, 5, 6, 2, 3}, 6), largest_rectangle_area((int[]){2, 4}, 2));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int largestRectangleArea(int[] h) {
        int n = h.length;
        int[] st = new int[n + 1];
        int top = -1;
        int maxA = 0;
        for (int i = 0; i <= n; i++) {
            int curH = (i == n) ? 0 : h[i];
            while (top >= 0 && h[st[top]] >= curH) {
                int height = h[st[top--]];
                int width = (top == -1) ? i : (i - st[top] - 1);
                int area = height * width;
                if (area > maxA) {
                    maxA = area;
                }
            }
            st[++top] = i;
        }
        return maxA;
    }
}`,
      bugs: { 11: { was: 'i - st[top] - 1', buggy: '                int width = (top == -1) ? i : (i - st[top]);' } },
    },
    python: {
      correct: `def largest_rectangle_area(h):
    n = len(h)
    st = []
    max_a = 0
    for i in range(n + 1):
        cur_h = 0 if i == n else h[i]
        while st and h[st[-1]] >= cur_h:
            height = h[st.pop()]
            width = i if not st else (i - st[-1] - 1)
            area = height * width
            if area > max_a:
                max_a = area
        st.append(i)
    return max_a`,
      bugs: { 9: { was: 'i - st[-1] - 1', buggy: '            width = i if not st else (i - st[-1])' } },
    },
    c: {
      correct: `int largest_rectangle_area(int h[], int n) {
    int st[100];
    int top = -1;
    int max_a = 0;
    for (int i = 0; i <= n; i++) {
        int cur_h = (i == n) ? 0 : h[i];
        while (top >= 0 && h[st[top]] >= cur_h) {
            int height = h[st[top--]];
            int width = (top == -1) ? i : (i - st[top] - 1);
            int area = height * width;
            if (area > max_a) {
                max_a = area;
            }
        }
        st[++top] = i;
    }
    return max_a;
}`,
      bugs: { 9: { was: 'i - st[top] - 1', buggy: '            int width = (top == -1) ? i : (i - st[top]);' } },
    },
  },
});
