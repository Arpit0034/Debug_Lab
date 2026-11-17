import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p137',
  title: 'Element pairs with its own reflection',
  difficulty: 'Easy',
  topic: 'Hashing',
  subtopic: 'Complement Lookup',
  tags: ['Lookup Table', 'Pair Search'],
  bugCategory: 'Incorrect Hash-based Lookup',
  sourceInspiredBy: 'Two-sum complement lookup pattern',
  description:
    'Given an array of non-negative integers and a target sum, determine if there exist two distinct indices whose values sum to the target. Return 1 if such a pair exists, or 0 otherwise. The implementation pairs an element with itself when the complement equals the value.',
  constraints: ['2 <= n <= 1000', '0 <= a[i], target <= 2000'],
  examples: [
    { input: 'a = [3, 4, 8], target = 6', output: '0', note: 'Only one 3 exists, so no distinct pair sums to 6.' },
    { input: 'a = [1, 5, 2], target = 7', output: '1' },
  ],
  hints: [
    'Trace the order in which the current element is registered relative to the complement query.',
    'Check whether an element can satisfy the complement check against itself.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Check if any two distinct entries sum to a target value.',
    algorithm:
      'Traverse elements one by one. For each element x, query if target - x was seen previously. If found, a pair exists. Otherwise, add x to the visited collection.',
    bug: 'The current element x is added to the collection before the complement lookup is performed.',
    whyItFails:
      'When target - x == x, inserting x first causes the lookup to immediately find x itself, falsely reporting a pair when only one copy exists.',
    failingTestCase: 'a = [3, 4, 8], target = 6: returns 1 instead of 0 because 3 pairs with itself.',
    fix: 'Query the collection for target - x before adding x to the collection.',
    whyFixWorks: 'Querying first ensures that any matching complement originated from an earlier distinct index.',
    dryRun:
      'For [3, 4, 8], target = 6: x=3, comp=3. Collection is empty, so 3 is not found. 3 is added. x=4, comp=2 not found. 4 added. x=8, comp=-2 not found. Returns 0.',
    debuggingLesson:
      'When searching for distinct pairs using a lookup table, always query for the complement before inserting the current item.',
  },
  testCases: [
    { input: 'a = [3, 4, 8], target = 6', expected: '0', buggyOutput: '1' },
    { input: 'a = [1, 5, 2], target = 7', expected: '1' },
  ],
  harness: {
    expected: '0 1',
    driver: {
      java: `System.out.println(Solution.hasTwoSum(new int[]{3, 4, 8}, 6) + " " + Solution.hasTwoSum(new int[]{1, 5, 2}, 7));`,
      python: `print(has_two_sum([3, 4, 8], 6), has_two_sum([1, 5, 2], 7))`,
      c: `printf("%d %d", has_two_sum((int[]){3, 4, 8}, 3, 6), has_two_sum((int[]){1, 5, 2}, 3, 7));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int hasTwoSum(int[] a, int target) {
        Set<Integer> seen = new HashSet<>();
        for (int x : a) {
            int comp = target - x;
            if (seen.contains(comp)) {
                return 1;
            }
            seen.add(x);
        }
        return 0;
    }
}`,
      bugs: { 8: { was: 'seen.contains(comp)', buggy: '            seen.add(x); if (seen.contains(comp)) {' } },
    },
    python: {
      correct: `def has_two_sum(a, target):
    seen = set()
    for x in a:
        comp = target - x
        if comp in seen:
            return 1
        seen.add(x)
    return 0`,
      bugs: { 5: { was: 'comp in seen', buggy: '        if (seen.add(x) is None) and comp in seen:' } },
    },
    c: {
      correct: `int has_two_sum(int a[], int n, int target) {
    int seen[2001] = {0};
    for (int i = 0; i < n; i++) {
        int x = a[i];
        int comp = target - x;
        if (comp >= 0 && comp <= 2000 && seen[comp]) {
            return 1;
        }
        if (x >= 0 && x <= 2000) {
            seen[x] = 1;
        }
    }
    return 0;
}`,
      bugs: { 6: { was: 'comp >= 0 && comp <= 2000 && seen[comp]', buggy: '        if (x >= 0 && x <= 2000) seen[x] = 1; if (comp >= 0 && comp <= 2000 && seen[comp]) {' } },
    },
  },
});
