import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p009',
  title: 'Largest value, all negative input',
  difficulty: 'Easy',
  topic: 'Arrays',
  subtopic: 'Maximum Element',
  tags: ['Initialization', 'Edge Case'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Find the maximum of an array',
  description: 'Return the largest value in a non-empty array of integers. The function works for most inputs but fails when every value is negative.',
  constraints: ['1 <= n <= 100000', 'Values may be negative'],
  examples: [
    { input: 'a = [3, 1, 2]', output: '3' },
    { input: 'a = [-5, -2, -9]', output: '-2', note: 'The buggy code returns 0.' },
  ],
  hints: ['What is the best value before any element has been looked at?', 'Try an array with only negative numbers.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Scan the array once and keep the largest value seen.',
    algorithm: 'Start with the first element as the best, then replace it whenever a larger element appears.',
    bug: 'The running maximum starts at 0 instead of at the first element.',
    whyItFails: '0 is only a valid starting maximum if the array contains a non-negative value. When every element is negative, none beats 0 and the function returns a value that is not in the array.',
    failingTestCase: 'a = [-5, -2, -9] returns 0, but the answer is -2.',
    fix: 'Initialise the maximum from the data: use a[0], or the smallest possible value of the type.',
    whyFixWorks: 'The starting value is now a real element, so the result is always an element of the array.',
    dryRun: 'a = [-5, -2, -9]. best = -5. -2 > -5 so best = -2. -9 > -2 is false. Return -2.',
    debuggingLesson: 'Never seed a max or min with a convenient constant like 0. Seed it with real data or with the true extreme of the type.',
  },
  testCases: [{ input: '[-5, -2, -9]', expected: '-2', buggyOutput: '0' }],
  harness: {
    expected: '-2 3',
    driver: {
      java: `System.out.println(Solution.maxValue(new int[]{-5, -2, -9}) + " " + Solution.maxValue(new int[]{3, 1, 2}));`,
      python: `print(max_value([-5, -2, -9]), max_value([3, 1, 2]))`,
      c: `printf("%d %d", max_value((int[]){-5, -2, -9}, 3), max_value((int[]){3, 1, 2}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int maxValue(int[] a) {
        int best = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] > best) {
                best = a[i];
            }
        }
        return best;
    }
}
`,
      bugs: { 3: { was: 'a[0]', buggy: 'int best = 0;', fixes: ['int best = Integer.MIN_VALUE;'] } },
    },
    python: {
      correct: `
def max_value(a):
    best = a[0]
    for x in a[1:]:
        if x > best:
            best = x
    return best
`,
      bugs: { 2: { was: 'a[0]', buggy: 'best = 0', fixes: ["best = float('-inf')", 'best = float("-inf")'] } },
    },
    c: {
      correct: `
int max_value(int a[], int n) {
    int best = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > best) {
            best = a[i];
        }
    }
    return best;
}
`,
      bugs: { 2: { was: 'a[0]', buggy: 'int best = 0;' } },
    },
  },
});
