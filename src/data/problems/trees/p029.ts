import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p029',
  title: 'The search checks one side only',
  difficulty: 'Easy',
  topic: 'Trees',
  subtopic: 'Tree Search',
  tags: ['Tree Search', 'Recursion'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Contains value in binary tree pattern',
  description:
    'Return whether a given value appears anywhere in the node structure. The code misses values that are not in the first branch it visits.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 3], target = 3', output: 'true' },
    { input: 'root = [1, 2, 3], target = 2', output: 'true' },
  ],
  hints: ['Trace a target that is in a right child.', 'Check whether both child branches are searched.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Search all nodes for a target value.',
    algorithm:
      'Return false for an empty branch, true when the current value matches, and otherwise search both children with OR.',
    bug: 'The recursive return searches only the left child and ignores the right child.',
    whyItFails:
      'A value that exists only in a right subtree is never examined, so the function returns false.',
    failingTestCase: 'root = [1, 2, 3], target = 3: the code returns false instead of true.',
    fix: 'Combine searches of both children with OR.',
    whyFixWorks: 'The target may be in either subtree, so both possibilities must be checked.',
    dryRun:
      'root 1 with left 2 and right 3, target 3: root is not 3; left 2 returns false; right 3 returns true; OR gives true.',
    debuggingLesson:
      'When a search can branch in two directions, verify that both branches are actually explored.',
  },
  testCases: [
    { input: 'root = [1, 2, 3], targets 3 and 2', expected: '1 1', buggyOutput: '0 1' },
  ],
  harness: {
    expected: '1 1',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); System.out.println((Solution.contains(r, 3) ? 1 : 0) + " " + (Solution.contains(r, 2) ? 1 : 0));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); print(1 if contains(r, 3) else 0, 1 if contains(r, 2) else 0)`,
      c: `struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}; a.left=&b; a.right=&c; printf("%d %d", contains(&a, 3), contains(&a, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static boolean contains(TreeNode node, int target) {
        if (node == null) return false;
        if (node.val == target) return true;
        return contains(node.left, target) || contains(node.right, target);
    }
}
`,
      bugs: { 6: { was: 'return contains(node.left, target) || contains(node.right, target);', buggy: 'return contains(node.left, target);' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def contains(node, target):
    if node is None:
        return False
    if node.val == target:
        return True
    return contains(node.left, target) or contains(node.right, target)
`,
      bugs: { 12: { was: 'return contains(node.left, target) or contains(node.right, target)', buggy: '    return contains(node.left, target)' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

int contains(struct TreeNode *node, int target) {
    if (node == 0) return 0;
    if (node->val == target) return 1;
    return contains(node->left, target) || contains(node->right, target);
}
`,
      bugs: { 6: { was: 'return contains(node->left, target) || contains(node->right, target);', buggy: 'return contains(node->left, target);' } },
    },
  },
});
