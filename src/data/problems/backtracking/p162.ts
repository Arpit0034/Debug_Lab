import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p162',
  title: 'Duplicate orders slip past the filter',
  difficulty: 'Medium',
  topic: 'Backtracking',
  subtopic: 'Unique Permutations',
  tags: ['Permutations', 'Duplicates', 'Pruning'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Unique permutations duplicate pruning pattern',
  description:
    'Return how many distinct orderings can be formed from the given values, including possible duplicates.',
  constraints: ['1 <= n <= 8', 'Values may repeat'],
  examples: [
    { input: 'a = [1,1,2]', output: '3' },
  ],
  hints: ['When equal values are adjacent, check which one should lead the group.', 'Trace the first level for two equal ones.'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
  explanation: {
    overview: 'Generate only distinct permutations of a multiset.',
    algorithm: 'Sort the values and skip a duplicate when the previous equal value has not been used in the current path.',
    bug: 'The duplicate filter skips when the previous equal value has been used instead of when it has not been used.',
    whyItFails: 'The pruning rule is inverted, so some valid permutations are removed and the count is too small.',
    failingTestCase: 'a = [1,1,2]: the code prints 2 instead of 3.',
    fix: 'Skip a duplicate only when the previous equal value is not used.',
    whyFixWorks: 'This forces equal values to be chosen in a fixed order, preventing duplicates without deleting valid orders.',
    dryRun: 'For [1,1,2], the correct distinct orders are [1,1,2], [1,2,1] and [2,1,1]. The inverted filter loses one of them.',
    debuggingLesson: 'In duplicate-pruning rules, trace both used and unused previous duplicates at the same recursion level.',
  },
  testCases: [{ input: '[1,1,2]', expected: '3' }],
  harness: {
    expected: '3',
    driver: {
      java: `System.out.println(Solution.permuteUnique(new int[]{1,1,2}));`,
      python: `print(permute_unique([1,1,2]))`,
      c: `printf("%d", permute_unique((int[]){1,1,2}, 3));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static void dfs(int[] a, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == a.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < a.length; i++) {
            if (used[i]) {
                continue;
            }
            if (i > 0 && a[i] == a[i - 1] && !used[i - 1]) {
                continue;
            }
            used[i] = true;
            path.add(a[i]);
            dfs(a, used, path, res);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
    static int permuteUnique(int[] a) {
        Arrays.sort(a);
        List<List<Integer>> res = new ArrayList<>();
        dfs(a, new boolean[a.length], new ArrayList<>(), res);
        return res.size();
    }
}
`,
      bugs: { 12: { was: '!used[i - 1]', buggy: 'if (i > 0 && a[i] == a[i - 1] && used[i - 1]) {' } },
    },
    python: {
      correct: `
def permute_unique(a):
    a.sort()
    used = [False] * len(a)
    res = []
    def dfs(path):
        if len(path) == len(a):
            res.append(path[:])
            return
        for i in range(len(a)):
            if used[i]:
                continue
            if i > 0 and a[i] == a[i - 1] and not used[i - 1]:
                continue
            used[i] = True
            path.append(a[i])
            dfs(path)
            path.pop()
            used[i] = False
    dfs([])
    return len(res)
`,
      bugs: { 12: { was: 'not used[i - 1]', buggy: 'if i > 0 and a[i] == a[i - 1] and used[i - 1]:' } },
    },
    c: {
      correct: `
int used[10];
int res;
void dfs(int a[], int n, int path[], int depth) {
    if (depth == n) {
        res++;
        return;
    }
    for (int i = 0; i < n; i++) {
        if (used[i]) {
            continue;
        }
        if (i > 0 && a[i] == a[i - 1] && !used[i - 1]) {
            continue;
        }
        used[i] = 1;
        path[depth] = a[i];
        dfs(a, n, path, depth + 1);
        used[i] = 0;
    }
}
int permute_unique(int a[], int n) {
    for (int i = 0; i < n; i++) used[i] = 0;
    res = 0;
    int path[10];
    dfs(a, n, path, 0);
    return res;
}
`,
      bugs: { 12: { was: '!used[i - 1]', buggy: 'if (i > 0 && a[i] == a[i - 1] && used[i - 1]) {' } },
    },
  },
});
