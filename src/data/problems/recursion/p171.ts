import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p171',
  title: 'Zero exponent loses its identity',
  difficulty: 'Easy',
  topic: 'Recursion',
  subtopic: 'Power Base Case',
  tags: ['Recursion', 'Base Case', 'Power'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Recursive exponentiation pattern',
  description:
    'Return base raised to a non-negative exponent. The function returns wrong values when the exponent is zero.',
  constraints: ['0 <= exponent <= 12', '1 <= base <= 10'],
  examples: [
    { input: 'base = 2, exponent = 3', output: '8' },
    { input: 'base = 5, exponent = 0', output: '1' },
  ],
  hints: ['Trace the smallest exponent first.', 'Check what value is returned when no multiplications remain.'],
  complexity: { time: 'O(e)', space: 'O(e)' },
  explanation: {
    overview: 'Compute a power by repeatedly multiplying the base.',
    algorithm: 'Multiply the base once per exponent step and stop when the exponent reaches zero.',
    bug: 'The zero-exponent branch returns the base instead of one.',
    whyItFails: 'Any non-zero number to the power zero is one, but the code adds one extra factor of the base.',
    failingTestCase: 'base = 2, exponent = 3 gives 16 instead of 8; base = 5, exponent = 0 gives 5 instead of 1.',
    fix: 'Return 1 when the exponent is zero.',
    whyFixWorks: 'The empty product is one, so stopping at exponent zero must contribute no extra factor.',
    dryRun: 'power(2, 3) calls power(2, 2), then power(2, 1), then power(2, 0). The last call should return 1; the bug returns 2, so the product becomes 16.',
    debuggingLesson: 'Always test the smallest recursive input and confirm the identity value for the operation.',
  },
  testCases: [
    { input: '2, 3 and 5, 0', expected: '8 1', buggyOutput: '16 5' },
  ],
  harness: {
    expected: '8 1',
    driver: {
      java: `System.out.println(Solution.power(2, 3) + " " + Solution.power(5, 0));`,
      python: `print(power(2, 3), power(5, 0))`,
      c: `printf("%d %d", power(2, 3), power(5, 0));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int power(int b, int e) {
        if (e == 0) {
            return 1;
        }
        return b * power(b, e - 1);
    }
}
`,
      bugs: { 4: { was: 'return 1;', buggy: 'return b;' } },
    },
    python: {
      correct: `
def power(b, e):
    if e == 0:
        return 1
    return b * power(b, e - 1)
`,
      bugs: { 3: { was: 'return 1', buggy: 'return b' } },
    },
    c: {
      correct: `
int power(int b, int e) {
    if (e == 0) {
        return 1;
    }
    return b * power(b, e - 1);
}
`,
      bugs: { 3: { was: 'return 1;', buggy: 'return b;' } },
    },
  },
});
