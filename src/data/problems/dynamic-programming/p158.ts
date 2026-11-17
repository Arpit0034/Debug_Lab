import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p158',
  title: 'Exact half is not reachable',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Equal Sum Partition',
  tags: ['Partition', 'Subset Sum', 'Boundary'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Partition equal subset sum pattern',
  description:
    'Return whether the given numbers can be split into two groups with equal total sum.',
  constraints: ['1 <= n <= 200', 'Values are non-negative'],
  examples: [
    { input: 'nums = [2,2,2,2]', output: 'true' },
  ],
  hints: ['Check whether a subset can equal exactly half the total.', 'Trace the update loop for one element equal to the target sum.'],
  complexity: { time: 'O(n * target)', space: 'O(target)' },
  explanation: {
    overview: 'Decide whether some subset sums to exactly half of the total.',
    algorithm: 'Use a boolean table over sums from 0 to target, updating downward for each number.',
    bug: 'The subset-sum loop excludes the sum exactly equal to the current number.',
    whyItFails: 'An element that alone equals the target is never marked, and other exact sums can also be missed.',
    failingTestCase: 'nums = [2,2,2,2]: the code prints false instead of true.',
    fix: 'Include the equality case when descending through sums.',
    whyFixWorks: 'The state where one number exactly fills a sum is then updated correctly.',
    dryRun: 'For target 4 and four 2s, the wrong loop never sets sum 2 from one 2, so sum 4 is never reached. Correctly including equality reaches true.',
    debuggingLesson: 'In descending subset-sum loops, equality at the item value is a valid state and must not be skipped.',
  },
  testCases: [{ input: '[2,2,2,2]', expected: '1' }],
  harness: {
    expected: '1',
    driver: {
      java: `System.out.println((Solution.canPartition(new int[]{2,2,2,2}) ? 1 : 0));`,
      python: `print(1 if can_partition([2,2,2,2]) else 0)`,
      c: `printf("%d", can_partition((int[]){2,2,2,2}, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean canPartition(int[] nums) {
        int total = 0;
        for (int x : nums) {
            total += x;
        }
        if (total % 2 != 0) {
            return false;
        }
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums) {
            for (int s = target; s >= x; s--) {
                dp[s] = dp[s] || dp[s - x];
            }
        }
        return dp[target];
    }
}
`,
      bugs: { 14: { was: 's >= x', buggy: 'for (int s = target; s > x; s--) {' } },
    },
    python: {
      correct: `
def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for x in nums:
        for s in range(target, x - 1, -1):
            dp[s] = dp[s] or dp[s - x]
    return dp[target]
`,
      bugs: { 9: { was: 'range(target, x - 1, -1)', buggy: 'for s in range(target, x, -1):' } },
    },
    c: {
      correct: `
int can_partition(int nums[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += nums[i];
    }
    if (total % 2 != 0) {
        return 0;
    }
    int target = total / 2;
    int dp[1000] = {0};
    dp[0] = 1;
    for (int i = 0; i < n; i++) {
        int x = nums[i];
        for (int s = target; s >= x; s--) {
            if (dp[s - x]) {
                dp[s] = 1;
            }
        }
    }
    return dp[target];
}
`,
      bugs: { 14: { was: 's >= x', buggy: 'for (int s = target; s > x; s--) {' } },
    },
  },
});
