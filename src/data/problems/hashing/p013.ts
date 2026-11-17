import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p013',
  title: 'Lookup never finds its partner',
  difficulty: 'Medium',
  topic: 'Hashing',
  subtopic: 'Complement Lookup',
  tags: ['HashMap', 'Two Sum'],
  bugCategory: 'Incorrect Hash-based Lookup',
  sourceInspiredBy: 'Two-sum with a hash map',
  description: 'Return the indices of two different elements that add up to target, or [-1, -1] if none do. The function returns [-1, -1] even when a pair exists.',
  constraints: ['2 <= n <= 10000', 'At most one valid pair'],
  examples: [{ input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', note: 'The buggy code returns [-1, -1].' }],
  hints: ['What does the map store as its key, and what does the lookup search for?'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Find two numbers that sum to a target in one pass.',
    algorithm: 'For each number, compute the complement target - x. If the complement was seen earlier, the pair is found. Otherwise remember x with its index.',
    bug: 'The map stores the complement as the key instead of the number itself.',
    whyItFails: 'Later lookups search for a complement among keys that are other complements, not among the numbers seen. The two sets rarely match, so the pair is never found.',
    failingTestCase: 'nums = [3, 2, 4], target = 6 stores 3, 4, 2 as keys. Looking up 2 never happens before 4 is stored at the wrong key, and the result is [-1, -1].',
    fix: 'Store the current number: seen[nums[i]] = i.',
    whyFixWorks: 'The map now contains exactly the numbers already visited, so a complement lookup answers "have I seen it?" correctly.',
    dryRun: 'nums = [3,2,4], target 6. i=0: need 3, not seen, store 3. i=1: need 4, not seen, store 2. i=2: need 2, seen at index 1, return [1, 2].',
    debuggingLesson: 'In hash lookups, keys and queries must come from the same space. Say out loud what the key represents.',
  },
  testCases: [{ input: '[3, 2, 4], 6', expected: '[1, 2]', buggyOutput: '[-1, -1]' }],
  harness: {
    expected: '1 2',
    driver: {
      java: `int[] r = Solution.twoSum(new int[]{3, 2, 4}, 6);\nSystem.out.println(r[0] + " " + r[1]);`,
      python: `r = two_sum([3, 2, 4], 6)\nprint(r[0], r[1])`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                return new int[] {seen.get(need), i};
            }
            seen.put(nums[i], i);
        }
        return new int[] {-1, -1};
    }
}
`,
      bugs: { 11: { was: 'nums[i]', buggy: 'seen.put(need, i);' } },
    },
    python: {
      correct: `
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return [-1, -1]
`,
      bugs: { 7: { was: 'seen[x]', buggy: 'seen[need] = i' } },
    },
  },
});
