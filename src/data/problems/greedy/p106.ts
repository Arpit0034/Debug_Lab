import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p106',
  title: 'A promising jump loses its reach',
  difficulty: 'Easy',
  topic: 'Greedy',
  subtopic: 'Jump Game Reachability',
  tags: ['Arrays', 'Reachability', 'Greedy'],
  bugCategory: 'Incorrect Greedy Decision',
  sourceInspiredBy: 'Maximum reachable index jump game pattern',
  description:
    'Given an array where each value represents the maximum number of positions that can be advanced from that index, return true if the final index can be reached from the first index.',
  constraints: ['1 <= n <= 100000', '0 <= nums[i] <= 100000'],
  examples: [
    { input: 'nums = [3,0,0,1,0]', output: 'true' },
    { input: 'nums = [2,0,0,1]', output: 'false' },
  ],
  hints: [
    'The furthest reachable position can only stay the same or increase.',
    'Trace what happens when a position has a smaller jump than the previous position.',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Determine whether a sequence of jumps can reach the final array index.',
    algorithm: 'Maintain the furthest index reachable so far. Scan positions from left to right. If the current position is beyond the reachable boundary, stop. Otherwise, extend the boundary using the current position and its maximum jump length. The final index is reachable when the boundary reaches or exceeds it.',
    bug: 'The current reachable boundary is overwritten with the reach from the current position instead of retaining the maximum of both values.',
    whyItFails: 'A position with a short jump cannot invalidate a farther position that was already reachable. Overwriting the boundary allows the recorded reach to move backward and can incorrectly report that the destination is unreachable.',
    failingTestCase: 'For [3,0,0,1,0], the first position reaches index 3. At index 1 the buggy version replaces the boundary with 1, so index 2 looks unreachable and it returns false. The correct result is true.',
    fix: 'Use farthest = Math.max(farthest, i + nums[i]).',
    whyFixWorks: 'The maximum operation preserves all previously established reachability while allowing a position to extend the boundary.',
    dryRun: 'Start with farthest = 0. At index 0, reach becomes 3. At indices 1 and 2 the maximum stays 3. At index 3, the jump of 1 extends the reach to 4, which is the final index, so the answer is true.',
    debuggingLesson: 'When tracking an accumulated maximum or minimum, check whether each new observation should replace the previous value or only improve it.',
  },
  testCases: [
    { input: '[3,0,0,1,0]', expected: 'true', buggyOutput: 'false' },
    { input: '[2,0,0,1]', expected: 'false' },
  ],
  harness: {
    expected: 'true false',
    driver: {
      java: `System.out.print(Solution.canReach(new int[]{3,0,0,1,0}) + " ");
System.out.print(Solution.canReach(new int[]{2,0,0,1}));`,
      python: `print(str(can_reach([3,0,0,1,0])).lower(), str(can_reach([2,0,0,1])).lower())`,
      c: `printf("%s %s", can_reach((int[]){3,0,0,1,0},5) ? "true" : "false",
can_reach((int[]){2,0,0,1},4) ? "true" : "false");`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static boolean canReach(int[] nums) {
        int farthest = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > farthest) return false;
            farthest = Math.max(farthest, i + nums[i]);
            if (farthest >= nums.length - 1) return true;
        }
        return true;
    }
}
`,
      bugs: {
        6: { was: 'Math.max(farthest, i + nums[i])', buggy: '            farthest = i + nums[i];' },
      },
    },
    python: {
      correct: `
def can_reach(nums):
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
        if farthest >= len(nums) - 1:
            return True
    return True
`,
      bugs: {
        6: { was: 'max(farthest, i + jump)', buggy: '        farthest = i + jump' },
      },
    },
    c: {
      correct: `
#include <stdbool.h>
bool can_reach(int nums[], int n) {
    int farthest = 0;
    for (int i = 0; i < n; i++) {
        if (i > farthest) return false;
        int reach = i + nums[i];
        if (reach > farthest) farthest = reach;
        if (farthest >= n - 1) return true;
    }
    return true;
}
`,
      bugs: {
        7: { was: 'if (reach > farthest)', buggy: '        farthest = reach;' },
      },
    },
  },
});
