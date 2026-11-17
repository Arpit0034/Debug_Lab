import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p131',
  title: 'Water level dips below ground',
  difficulty: 'Hard',
  topic: 'Stacks and Queues',
  subtopic: 'Elevation Containment',
  tags: ['Elevation Profile', 'Depression Volume'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Trapping rain water using container pattern',
  description:
    'Given an elevation map where each bar has unit width, compute the total volume of water it can retain after rainfall. The implementation incorrectly computes the retaining boundary height when resolving depressions.',
  constraints: ['1 <= n <= 1000', '0 <= h[i] <= 1000'],
  examples: [
    { input: 'h = [3, 0, 1]', output: '1', note: 'Depression at index 1 is constrained by height 1 on the right, retaining 1 unit.' },
    { input: 'h = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', output: '6' },
  ],
  hints: [
    'Examine how the water surface level is determined from the left and right retaining walls.',
    'Consider whether water can rise above the shorter of the two bounding walls.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Calculate trapped water volume by summing horizontal layers of depressions.',
    algorithm:
      'Track bar indices in decreasing order of elevation. When a taller bar appears, pop the bottom of the depression and compute bounded volume between the current bar and the left boundary bar.',
    bug: 'The bounded water height takes the maximum of the two walls instead of the minimum.',
    whyItFails:
      'Water cannot rise above the shorter wall without spilling over. Using the maximum creates an unphysical water level that overflows the shorter wall.',
    failingTestCase: 'h = [3, 0, 1]: computes bounded height max(3, 1) - 0 = 3 instead of min(3, 1) - 0 = 1, trapping 3 units instead of 1.',
    fix: 'Take the minimum of the left and right wall heights: min(h[left], h[i]) - h[mid].',
    whyFixWorks: 'The lower wall determines the maximum level before water spills out of the basin.',
    dryRun:
      'For [3, 0, 1]: mid is 1 (height 0), left is index 0 (height 3), right is index 2 (height 1). Min wall height is min(3, 1) = 1. Water depth = 1 - 0 = 1. Distance = 2 - 0 - 1 = 1. Volume = 1 * 1 = 1.',
    debuggingLesson:
      'In containment and capacity problems, capacity is governed by the bottleneck (the minimum capacity or lowest barrier).',
  },
  testCases: [
    { input: '[3, 0, 1]', expected: '1', buggyOutput: '3' },
    { input: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', expected: '6' },
  ],
  harness: {
    expected: '1 6',
    driver: {
      java: `System.out.println(Solution.trapWater(new int[]{3, 0, 1}) + " " + Solution.trapWater(new int[]{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}));`,
      python: `print(trap_water([3, 0, 1]), trap_water([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]))`,
      c: `printf("%d %d", trap_water((int[]){3, 0, 1}, 3), trap_water((int[]){0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}, 12));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int trapWater(int[] h) {
        int n = h.length;
        int[] st = new int[n];
        int top = -1;
        int total = 0;
        for (int i = 0; i < n; i++) {
            while (top >= 0 && h[i] > h[st[top]]) {
                int mid = st[top--];
                if (top == -1) {
                    break;
                }
                int left = st[top];
                int d = i - left - 1;
                int bounded = Math.min(h[left], h[i]) - h[mid];
                total += bounded * d;
            }
            st[++top] = i;
        }
        return total;
    }
}`,
      bugs: { 15: { was: 'Math.min(h[left], h[i])', buggy: '                int bounded = Math.max(h[left], h[i]) - h[mid];' } },
    },
    python: {
      correct: `def trap_water(h):
    st = []
    total = 0
    for i, x in enumerate(h):
        while st and x > h[st[-1]]:
            mid = st.pop()
            if not st:
                break
            left = st[-1]
            d = i - left - 1
            bounded = min(h[left], x) - h[mid]
            total += bounded * d
        st.append(i)
    return total`,
      bugs: { 11: { was: 'min(h[left], x)', buggy: '            bounded = max(h[left], x) - h[mid]' } },
    },
    c: {
      correct: `int trap_water(int h[], int n) {
    int st[100];
    int top = -1;
    int total = 0;
    for (int i = 0; i < n; i++) {
        while (top >= 0 && h[i] > h[st[top]]) {
            int mid = st[top--];
            if (top == -1) {
                break;
            }
            int left = st[top];
            int d = i - left - 1;
            int min_h = (h[left] < h[i]) ? h[left] : h[i];
            int bounded = min_h - h[mid];
            total += bounded * d;
        }
        st[++top] = i;
    }
    return total;
}`,
      bugs: { 13: { was: 'h[left] < h[i]', buggy: '            int min_h = (h[left] > h[i]) ? h[left] : h[i];' } },
    },
  },
});
