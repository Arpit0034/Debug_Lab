import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p004',
  title: 'Every subset comes out empty',
  difficulty: 'Medium',
  topic: 'Backtracking',
  subtopic: 'Subsets',
  tags: ['Backtracking', 'Aliasing'],
  bugCategory: 'Reference and Mutation Error',
  sourceInspiredBy: 'Generate all subsets pattern',
  description:
    'Return all subsets of a list of distinct integers. The function returns the right number of subsets, but every subset is empty.',
  constraints: ['0 <= n <= 15', 'All values are distinct'],
  examples: [
    { input: 'nums = [1, 2]', output: '[[], [1], [1, 2], [2]] (any order)', note: 'The buggy code returns [[], [], [], []].' },
  ],
hints: ['What happens to the list you stored after later code removes elements from it?'],
  complexity: { time: 'O(n * 2^n)', space: 'O(n)' },
  explanation: {
    overview: 'Enumerate every subset of the input.',
    algorithm:
      'Depth-first search with a shared working list. At each call record the current subset, then try adding each later element, recurse, and remove it again to restore the state.',
    bug: 'The working list itself is stored in the result instead of a copy of it.',
    whyItFails:
      'The same list object is reused and modified for the whole search. All stored entries are the same object, and by the end backtracking has removed everything from it, so every entry prints as empty.',
    failingTestCase: 'nums = [1, 2]: four entries are stored, all referring to one list that ends empty.',
    fix: 'Store a copy of the current path.',
    whyFixWorks: 'A copy keeps the contents as they were at that moment, no matter how the working list changes afterwards.',
    dryRun:
      'nums = [1, 2]. Record [] (copy). Add 1, record [1]. Add 2, record [1, 2]. Pop 2, pop 1. Add 2, record [2]. Each copy keeps its own contents.',
    debuggingLesson:
      'When a mutable object is shared and later modified, anything stored by reference changes too. Copy at the moment you record a result.',
  },
  testCases: [{ input: '[1, 2]', expected: '[[], [1], [1, 2], [2]]', buggyOutput: '[[], [], [], []]' }],
  harness: {
    expected: '[[], [1], [1, 2], [2]]',
    driver: {
      java: `System.out.println(Solution.subsets(new int[]{1, 2}));`,
      python: `print(sorted(subsets([1, 2])))`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }

    static void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
}
`,
      bugs: { 11: { was: 'res.add(new ArrayList<>(path))', buggy: 'res.add(path);', fixes: ['res.add(List.copyOf(path));'] } },
    },
    python: {
      correct: `
def subsets(nums):
    res = []

    def backtrack(start, path):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return res
`,
      bugs: {
        5: { was: 'res.append(path[:])', buggy: 'res.append(path)', fixes: ['res.append(list(path))', 'res.append(path.copy())', 'res.append([*path])'] },
      },
    },
  },
});
