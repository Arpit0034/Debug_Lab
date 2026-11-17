import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p190',
  title: 'The common factor becomes zero',
  difficulty: 'Easy',
  topic: 'Recursion',
  subtopic: 'Greatest Common Divisor',
  tags: ['Recursion', 'Math', 'GCD'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Euclidean greatest common divisor pattern',
  description:
    'Return the largest positive integer that divides both input numbers. The result is always zero.',
  constraints: ['1 <= a, b <= 10000'],
  examples: [
    { input: 'a = 12, b = 8', output: '4' },
    { input: 'a = 7, b = 5', output: '1' },
  ],
  hints: ['When one number reaches zero, the other number is the answer.', 'Check which value is returned in the stopping case.'],
  complexity: { time: 'O(log min(a, b))', space: 'O(log min(a, b))' },
  explanation: {
    overview: 'Find the greatest common divisor using repeated remainder reduction.',
    algorithm: 'Replace the pair by the second number and the remainder until the second number becomes zero.',
    bug: 'When the second number is zero, the function returns zero instead of the first number.',
    whyItFails: 'At that moment the first number is the greatest common divisor, but the returned value loses it.',
    failingTestCase: 'For 12 and 8, the correct answer is 4 but the code returns 0.',
    fix: 'Return the first number when the second number is zero.',
    whyFixWorks: 'The first number is exactly the divisor that divides both original numbers at the stopping point.',
    dryRun: 'gcd(12,8) becomes gcd(8,4), then gcd(4,0). The correct return is 4; the bug returns the zero remainder.',
    debuggingLesson: 'In recursive Euclid-style code, verify the final non-zero remainder is preserved.',
  },
  testCases: [
    { input: '12, 8', expected: '4', buggyOutput: '0' },
  ],
  harness: {
    expected: '4',
    driver: {
      java: `System.out.println(Solution.gcd(12,8));`,
      python: `print(gcd(12,8))`,
      c: `printf("%d", gcd(12,8));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }
}
`,
      bugs: { 4: { was: 'return a;', buggy: 'return b;' } },
    },
    python: {
      correct: `
def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)
`,
      bugs: { 3: { was: 'return a', buggy: 'return b' } },
    },
    c: {
      correct: `
int gcd(int a, int b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}
`,
      bugs: { 3: { was: 'return a;', buggy: 'return b;' } },
    },
  },
});
