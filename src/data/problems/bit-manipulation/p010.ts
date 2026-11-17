import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p010',
  title: 'Zero passes the power check',
  difficulty: 'Easy',
  topic: 'Bit Manipulation',
  subtopic: 'Power of Two',
  tags: ['Bit Tricks', 'Edge Case'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Power of two check using n & (n - 1)',
  description: 'Return true if n is a positive power of two. The bit trick works for 1, 2, 4, 8 and rejects 6, but one input is wrongly accepted.',
  constraints: ['-2^31 <= n <= 2^31 - 1'],
  examples: [
    { input: 'n = 16', output: 'true' },
    { input: 'n = 0', output: 'false', note: 'The buggy code returns true.' },
  ],
  hints: ['Evaluate n & (n - 1) by hand for n = 0.'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  explanation: {
    overview: 'Decide whether a number has exactly one bit set.',
    algorithm: 'For n > 0, n & (n - 1) clears the lowest set bit. The result is 0 exactly when there was only one set bit.',
    bug: 'The n > 0 check is missing.',
    whyItFails: 'For n = 0, n - 1 is -1, which is all ones, so 0 & -1 = 0 and the test reports a power of two. Negative numbers can also slip through.',
    failingTestCase: 'n = 0 returns true, but 0 is not a power of two.',
    fix: 'Require n > 0 before applying the bit trick.',
    whyFixWorks: 'Only positive numbers reach the bit test, and for those the trick is exact.',
    dryRun: 'n = 16: 16 > 0, 16 & 15 = 0, true. n = 0: 0 > 0 is false, so false. n = 6: 6 & 5 = 4, not 0, false.',
    debuggingLesson: 'A neat bit trick usually has a precondition. Test it with 0 and with negative numbers.',
  },
  testCases: [{ input: '0', expected: 'false', buggyOutput: 'true' }],
  harness: {
    expected: '1 0 0',
    driver: {
      java: `System.out.println((Solution.isPowerOfTwo(16) ? 1 : 0) + " " + (Solution.isPowerOfTwo(0) ? 1 : 0) + " " + (Solution.isPowerOfTwo(6) ? 1 : 0));`,
      python: `print(int(is_power_of_two(16)), int(is_power_of_two(0)), int(is_power_of_two(6)))`,
      c: `printf("%d %d %d", is_power_of_two(16), is_power_of_two(0), is_power_of_two(6));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
}
`,
      bugs: { 3: { was: 'n > 0', buggy: 'return (n & (n - 1)) == 0;', fixes: ['return (n & (n - 1)) == 0 && n > 0;'] } },
    },
    python: {
      correct: `
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
`,
      bugs: { 2: { was: 'n > 0', buggy: 'return (n & (n - 1)) == 0', fixes: ['return (n & (n - 1)) == 0 and n > 0'] } },
    },
    c: {
      correct: `
int is_power_of_two(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}
`,
      bugs: { 2: { was: 'n > 0', buggy: 'return (n & (n - 1)) == 0;', fixes: ['return (n & (n - 1)) == 0 && n > 0;'] } },
    },
  },
});
