import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p186',
  title: 'Both halves count as different groups',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Subset Counting',
  tags: ['Subsets', 'Counting', 'Partition'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Count equal-sum subset partitions pattern',
  description:
    'Return the number of ways to split the numbers into two groups with equal totals, where swapping the two groups is not a new way. The code counts both halves separately.',
  constraints: ['1 <= n <= 12', '1 <= value <= 100'],
  examples: [
    { input: 'nums = [1,2,3]', output: '1' },
    { input: 'nums = [1,1]', output: '1' },
  ],
  hints: ['Each split is seen once from each side.', 'Check the final conversion from counted subsets to partitions.'],
  complexity: { time: 'O(n * 2^n)', space: 'O(1)' },
  explanation: {
    overview: 'Count unordered splits into two equal-total groups.',
    algorithm: 'Count subsets whose total is half the whole sum, then remove the double counting caused by the two complementary halves.',
    bug: 'The final result returns the raw subset count instead of halving it.',
    whyItFails: 'Every valid split is found twice, once for each of the two complementary subsets.',
    failingTestCase: 'For [1,2,3], the code returns 2 but the correct answer is 1.',
    fix: 'Divide the subset count by two before returning.',
    whyFixWorks: 'The two complementary subsets represent the same split, so exactly two counts correspond to one answer.',
    dryRun: 'Subsets with total 3 are {3} and {1,2}. They describe the same split, so the final answer is 1, not 2.',
    debuggingLesson: 'When both sides of a symmetric choice are counted, check for double counting at the end.',
  },
  testCases: [
    { input: '[1,2,3]', expected: '1', buggyOutput: '2' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println(Solution.ways(new int[]{1,2,3}));`,
      python: `print(ways([1,2,3]))`,
      c: `printf("%d", ways((int[]){1,2,3}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int ways(int[] a) {
        int sum = 0;
        for (int x : a) sum += x;
        if (sum % 2 != 0) return 0;
        int target = sum / 2;
        int n = a.length;
        int count = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            int s = 0;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) s += a[i];
            }
            if (s == target) count++;
        }
        return count / 2;
    }
}
`,
      bugs: { 16: { was: 'return count / 2;', buggy: 'return count;' } },
    },
    python: {
      correct: `
def ways(a):
    total = sum(a)
    if total % 2 != 0:
        return 0
    target = total // 2
    n = len(a)
    count = 0
    for mask in range(1 << n):
        s = 0
        for i in range(n):
            if mask & (1 << i):
                s += a[i]
        if s == target:
            count += 1
    return int(count / 2)
`,
      bugs: { 15: { was: 'return int(count / 2)', buggy: 'return count' } },
    },
    c: {
      correct: `
int ways(int a[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) sum += a[i];
    if (sum % 2 != 0) return 0;
    int target = sum / 2;
    int count = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        int s = 0;
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) s += a[i];
        }
        if (s == target) count++;
    }
    return count / 2;
}
`,
      bugs: { 14: { was: 'return count / 2;', buggy: 'return count;' } },
    },
  },
});
