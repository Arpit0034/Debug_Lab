import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p161',
  title: 'Reusing a value becomes impossible',
  difficulty: 'Easy',
  topic: 'Backtracking',
  subtopic: 'Combination Sum',
  tags: ['Combinations', 'Reuse', 'Recursion'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Combination sum reuse pattern',
  description:
    'Return how many combinations of the given positive values add up to a target. Each value may be used any number of times.',
  constraints: ['1 <= values.length <= 20', '1 <= target <= 40'],
  examples: [
    { input: 'a = [2,3,6,7], target = 7', output: '2' },
  ],
  hints: ['After choosing a value, check whether it can still be chosen again.', 'Trace the branch that uses 2 twice.'],
  complexity: { time: 'O(2^target)', space: 'O(target)' },
  explanation: {
    overview: 'Count combinations that reach a target with unlimited reuse.',
    algorithm: 'Try values from the current start index, subtract a chosen value, and allow the same start index to be used again.',
    bug: 'The recursive call moves to the next index, so a value cannot be reused.',
    whyItFails: 'Combinations that need the same value more than once are lost.',
    failingTestCase: 'a = [2,3,6,7], target = 7: the code prints 1 instead of 2.',
    fix: 'Recurse with the same index after choosing a value.',
    whyFixWorks: 'The same value remains available for later choices, which is required for unlimited reuse.',
    dryRun: 'The correct combination 2 + 2 + 3 needs two uses of 2. Moving to the next index after the first 2 prevents that branch.',
    debuggingLesson: 'In combination generation, the next start index controls whether values may repeat.',
  },
  testCases: [{ input: '[2,3,6,7], 7', expected: '2' }],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.combinationSum(new int[]{2,3,6,7}, 7));`,
      python: `print(combination_sum([2,3,6,7], 7))`,
      c: `printf("%d", combination_sum((int[]){2,3,6,7}, 4, 7));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static void dfs(int[] a, int start, int remain, List<Integer> path, int[] count) {
        if (remain == 0) {
            count[0]++;
            return;
        }
        for (int i = start; i < a.length; i++) {
            if (a[i] > remain) {
                break;
            }
            path.add(a[i]);
            dfs(a, i, remain - a[i], path, count);
            path.remove(path.size() - 1);
        }
    }
    static int combinationSum(int[] a, int target) {
        Arrays.sort(a);
        int[] count = new int[1];
        dfs(a, 0, target, new ArrayList<>(), count);
        return count[0];
    }
}
`,
      bugs: { 13: { was: 'dfs(a, i, remain - a[i], path, count)', buggy: 'dfs(a, i + 1, remain - a[i], path, count);' } },
    },
    python: {
      correct: `
def combination_sum(a, target):
    a.sort()
    count = [0]
    def dfs(start, remain, path):
        if remain == 0:
            count[0] += 1
            return
        for i in range(start, len(a)):
            if a[i] > remain:
                break
            path.append(a[i])
            dfs(i, remain - a[i], path)
            path.pop()
    dfs(0, target, [])
    return count[0]
`,
      bugs: { 12: { was: 'dfs(i, remain - a[i], path)', buggy: 'dfs(i + 1, remain - a[i], path)' } },
    },
    c: {
      correct: `
void dfs(int a[], int n, int start, int remain, int *count) {
    if (remain == 0) {
        (*count)++;
        return;
    }
    for (int i = start; i < n; i++) {
        if (a[i] > remain) {
            break;
        }
        dfs(a, n, i, remain - a[i], count);
    }
}
int combination_sum(int a[], int n, int target) {
    int count = 0;
    dfs(a, n, 0, target, &count);
    return count;
}
`,
      bugs: { 10: { was: 'dfs(a, n, i, remain - a[i], count)', buggy: 'dfs(a, n, i + 1, remain - a[i], count);' } },
    },
  },
});
