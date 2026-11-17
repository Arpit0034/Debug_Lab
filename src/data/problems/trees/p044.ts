import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p044',
  title: 'A stale path total carries over',
  difficulty: 'Hard',
  topic: 'Trees',
  subtopic: 'Path Counting',
  tags: ['Path Counting', 'Backtracking', 'DFS'],
  bugCategory: 'Missing Backtracking Operation',
  sourceInspiredBy: 'Count downward paths with a target sum pattern',
  description:
    'Count downward paths whose values add to a target. The code forgets to remove the current node after exploring its children, so later paths include stale values.',
  constraints: ['0 <= number of nodes <= 1000', 'Values may be negative'],
  examples: [
    { input: 'root = [1, 2, 3], target = 5', output: '0' },
  ],
  hints: ['Trace the current path before and after returning from a child.', 'Check whether the path length is restored after exploring a branch.'],
  complexity: { time: 'O(n h)', space: 'O(h)' },
  explanation: {
    overview: 'Count paths that go downward and have a given sum.',
    algorithm:
      'Maintain the current path. Add the current value, check all suffixes ending here for the target sum, recurse into both children, then remove the current value.',
    bug: 'The current value is never removed after the child calls finish.',
    whyItFails:
      'A sibling branch sees values from the branch that has already been explored, creating paths that do not exist.',
    failingTestCase: 'root = [1, 2, 3], target = 5: the code counts 1 stale path instead of 0.',
    fix: 'Decrement the path length after both child calls.',
    whyFixWorks: 'Each sibling starts with exactly the path from the ancestors, not from a finished sibling.',
    dryRun:
      'Visit 1 then left 2; path is [1,2]. After returning, the fix removes 2. The right branch then sees [1] before adding 3. Without removal it sees [1,2,3] and finds a false 5.',
    debuggingLesson:
      'Whenever a shared mutable path is used in recursion, restore its size before returning.',
  },
  testCases: [
    { input: 'root = [1, 2, 3], target = 5', expected: '0', buggyOutput: '1' },
  ],
  harness: {
    expected: '0',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); System.out.println(Solution.countPaths(r, 5));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); print(count_paths(r, 5))`,
      c: `struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}; a.left=&b; a.right=&c; printf("%d", count_paths(&a, 5));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static int count = 0;
    static int depth = 0;
    static int[] path = new int[100];
    static void dfs(TreeNode node, int target) {
        if (node == null) return;
        path[depth++] = node.val;
        int sum = 0;
        for (int i = depth - 1; i >= 0; i--) {
            sum += path[i];
            if (sum == target) count++;
        }
        dfs(node.left, target);
        dfs(node.right, target);
        depth--;
    }
    static int countPaths(TreeNode root, int target) {
        count = 0;
        depth = 0;
        dfs(root, target);
        return count;
    }
}
`,
      bugs: { 16: { was: 'depth--;', buggy: ';' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

count = 0
depth = 0
path = [0] * 100

def dfs(node, target):
    global count, depth
    if node is None:
        return
    path[depth] = node.val
    depth += 1
    total = 0
    for i in range(depth - 1, -1, -1):
        total += path[i]
        if total == target:
            count += 1
    dfs(node.left, target)
    dfs(node.right, target)
    depth -= 1

def count_paths(root, target):
    global count, depth
    count = 0
    depth = 0
    dfs(root, target)
    return count
`,
      bugs: { 24: { was: 'depth -= 1', buggy: '    pass' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };
int count = 0;
int depth = 0;
int path[100];
void dfs(struct TreeNode *node, int target) {
    if (node == 0) return;
    path[depth++] = node->val;
    int total = 0;
    for (int i = depth - 1; i >= 0; i--) {
        total += path[i];
        if (total == target) count++;
    }
    dfs(node->left, target);
    dfs(node->right, target);
    depth--;
}
int count_paths(struct TreeNode *root, int target) {
    count = 0;
    depth = 0;
    dfs(root, target);
    return count;
}
`,
      bugs: { 15: { was: 'depth--;', buggy: ';' } },
    },
  },
});
