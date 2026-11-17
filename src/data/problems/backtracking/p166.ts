import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p166',
  title: 'Nine is never allowed in the set',
  difficulty: 'Medium',
  topic: 'Backtracking',
  subtopic: 'Fixed-Size Number Combinations',
  tags: ['Combinations', 'Digits', 'Boundary'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Combination sum with digits 1 to 9 pattern',
  description:
    'Return how many ways to choose exactly k distinct numbers from 1 to 9 so that their sum equals n.',
  constraints: ['1 <= k <= 9', '1 <= n <= 45'],
  examples: [
    { input: 'k = 2, n = 11', output: '4' },
  ],
  hints: ['Check whether the digit 9 can be chosen.', 'List the pairs that sum to 11.'],
  complexity: { time: 'O(2^9)', space: 'O(k)' },
  explanation: {
    overview: 'Count size-k subsets of digits 1 through 9 with a target sum.',
    algorithm: 'Try digits in increasing order, prune when the sum is exceeded, and stop when the chosen count reaches k.',
    bug: 'The digit loop stops before 9.',
    whyItFails: 'All valid subsets containing 9 are omitted.',
    failingTestCase: 'k = 2, n = 11: the code prints 3 instead of 4 because 2 + 9 is missed.',
    fix: 'Allow the loop to include 9.',
    whyFixWorks: 'The full allowed digit range is then considered.',
    dryRun: 'Pairs summing to 11 are 2+9, 3+8, 4+7 and 5+6. Excluding 9 removes the first pair.',
    debuggingLesson: 'For bounded digit ranges, verify the loop condition includes the stated maximum.',
  },
  testCases: [{ input: '2, 11', expected: '4' }],
  harness: {
    expected: '4',
    driver: {
      java: `System.out.println(Solution.combinationSum3(2, 11));`,
      python: `print(combination_sum3(2, 11))`,
      c: `printf("%d", combination_sum3(2, 11));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static void dfs(int start, int k, int remain, List<Integer> path, int[] count) {
        if (path.size() == k) {
            if (remain == 0) count[0]++;
            return;
        }
        for (int v = start; v <= 9; v++) {
            if (v > remain) break;
            path.add(v);
            dfs(v + 1, k, remain - v, path, count);
            path.remove(path.size() - 1);
        }
    }
    static int combinationSum3(int k, int n) {
        int[] count = new int[1];
        dfs(1, k, n, new ArrayList<>(), count);
        return count[0];
    }
}
`,
      bugs: { 8: { was: 'v <= 9', buggy: 'for (int v = start; v < 9; v++) {' } },
    },
    python: {
      correct: `
def combination_sum3(k, n):
    count = [0]
    def dfs(start, remain, path):
        if len(path) == k:
            if remain == 0:
                count[0] += 1
            return
        for v in range(start, 10):
            if v > remain:
                break
            path.append(v)
            dfs(v + 1, remain - v, path)
            path.pop()
    dfs(1, n, [])
    return count[0]
`,
      bugs: { 8: { was: 'range(start, 10)', buggy: 'for v in range(start, 9):' } },
    },
    c: {
      correct: `
void dfs(int start, int k, int remain, int depth, int *count) {
    if (depth == k) {
        if (remain == 0) (*count)++;
        return;
    }
    for (int v = start; v <= 9; v++) {
        if (v > remain) break;
        dfs(v + 1, k, remain - v, depth + 1, count);
    }
}
int combination_sum3(int k, int n) {
    int count = 0;
    dfs(1, k, n, 0, &count);
    return count;
}
`,
      bugs: { 6: { was: 'v <= 9', buggy: 'for (int v = start; v < 9; v++) {' } },
    },
  },
});
