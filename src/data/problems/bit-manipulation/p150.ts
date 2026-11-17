import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p150',
  title: 'The single set bit is miscounted',
  difficulty: 'Medium',
  topic: 'Bit Manipulation',
  subtopic: 'Counting Set Bits',
  tags: ['Bits', 'Integer', 'Counting'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Counting one-bits in a non-negative integer',
  description: 'Return the number of binary digits equal to one in a non-negative integer.',
  constraints: ['0 <= n <= 2^31 - 1'],
  examples: [{ input: '13', output: '3' }, { input: '8', output: '1' }],
  hints: ['Each iteration should remove or inspect one binary position.', 'Test a value with exactly one set bit.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Count the one-bits in the binary representation.',
    algorithm: 'Inspect the lowest bit repeatedly while shifting the value right.',
    bug: 'The test checks whether the value is even instead of whether its lowest bit is one.',
    whyItFails: 'The counter increases for zero bits rather than set bits.',
    failingTestCase: '13 is binary 1101 and should produce 3.',
    fix: 'Check whether the low bit equals one.',
    whyFixWorks: 'The counter increments exactly for set positions.',
    dryRun: '13 has low bits 1,0,1,1; three iterations contribute to the count.',
    debuggingLesson: 'Bitwise conditions should be tested against both odd and even values.'
  },
  testCases: [{ input: '13', expected: '3' }],
  harness: { expected: '3', driver: { java: 'System.out.print(Solution.countBits(13));', python: 'print(count_bits(13))', c: 'printf("%d", count_bits(13));' } },
  code: {
    java: { correct: `
class Solution {
    static int countBits(int n) {
        int count = 0;
        while (n > 0) {
            if ((n & 1) == 1) count++;
            n >>= 1;
        }
        return count;
    }
}
`, bugs: { 5: { was: 'if ((n & 1) == 1) count++;', buggy: 'if ((n & 1) == 0) count++;' } } },
    python: { correct: `
def count_bits(n):
    count = 0
    while n > 0:
        if (n & 1) == 1:
            count += 1
        n >>= 1
    return count
`, bugs: { 4: { was: 'if (n & 1) == 1:', buggy: 'if (n & 1) == 0:' } } },
    c: { correct: `
int count_bits(int n) {
    int count = 0;
    while (n > 0) {
        if ((n & 1) == 1) count++;
        n >>= 1;
    }
    return count;
}
`, bugs: { 4: { was: 'if ((n & 1) == 1) count++;', buggy: 'if ((n & 1) == 0) count++;' } } }
  }
});
