import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p157',
  title: 'Smallest product is built from the wrong extreme',
  difficulty: 'Hard',
  topic: 'Dynamic Programming',
  subtopic: 'Maximum Product Subarray',
  tags: ['Product', 'Negative Values', 'Extremes'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Maximum product subarray tracking extremes pattern',
  description:
    'Return the largest product of any contiguous subarray of the given numbers.',
  constraints: ['1 <= n <= 100000', 'Values may be negative'],
  examples: [
    { input: 'a = [-2,3,-4]', output: '24' },
  ],
  hints: ['Track both the largest and smallest product ending at the current position.', 'Trace how the smallest product changes after a negative value flips the order.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Find a contiguous subarray with the maximum product, where negatives can flip the best extreme.',
    algorithm: 'Keep the maximum and minimum products ending at the current position. Swap them when the next value is negative, then update both.',
    bug: 'The minimum product is updated using the maximum product instead of the minimum product.',
    whyItFails: 'The smallest ending product is needed because multiplying it by a future negative value can become the largest. Using the maximum loses this possibility.',
    failingTestCase: 'a = [-2,3,-4]: the code prints 3 instead of 24.',
    fix: 'Update the minimum product using the current minimum product.',
    whyFixWorks: 'The true minimum is preserved so a later negative can flip it into the maximum product.',
    dryRun: 'After -2 and 3, max is 3 and min is -6. At -4, the swapped values should use the old min -6 to get 24. The wrong update loses -6 and returns 3.',
    debuggingLesson: 'When values can be negative, verify that both the largest and smallest running states are updated from their correct sources.',
  },
  testCases: [{ input: '[-2,3,-4]', expected: '24' }],
  harness: {
    expected: '24',
    driver: {
      java: `System.out.println(Solution.maxProduct(new int[]{-2,3,-4}));`,
      python: `print(max_product([-2,3,-4]))`,
      c: `printf("%d", max_product((int[]){-2,3,-4}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int maxProduct(int[] a) {
        int best = a[0];
        int curMax = a[0];
        int curMin = a[0];
        for (int i = 1; i < a.length; i++) {
            int x = a[i];
            if (x < 0) {
                int t = curMax;
                curMax = curMin;
                curMin = t;
            }
            curMax = Math.max(x, curMax * x);
            curMin = Math.min(x, curMin * x);
            best = Math.max(best, curMax);
        }
        return best;
    }
}
`,
      bugs: { 14: { was: 'Math.min(x, curMin * x)', buggy: 'curMin = Math.min(x, curMax * x);' } },
    },
    python: {
      correct: `
def max_product(a):
    best = a[0]
    cur_max = a[0]
    cur_min = a[0]
    for x in a[1:]:
        if x < 0:
            cur_max, cur_min = cur_min, cur_max
        cur_max = max(x, cur_max * x)
        cur_min = min(x, cur_min * x)
        best = max(best, cur_max)
    return best
`,
      bugs: { 9: { was: 'cur_min * x', buggy: 'cur_min = min(x, cur_max * x)' } },
    },
    c: {
      correct: `
int max_product(int a[], int n) {
    int best = a[0];
    int cur_max = a[0];
    int cur_min = a[0];
    for (int i = 1; i < n; i++) {
        int x = a[i];
        if (x < 0) {
            int t = cur_max;
            cur_max = cur_min;
            cur_min = t;
        }
        int a1 = cur_max * x;
        int a2 = cur_min * x;
        cur_max = x > a1 ? x : a1;
        cur_min = x < a2 ? x : a2;
        if (cur_max > best) {
            best = cur_max;
        }
    }
    return best;
}
`,
      bugs: { 15: { was: 'x < a2 ? x : a2', buggy: 'cur_min = x < a1 ? x : a1;' } },
    },
  },
});
