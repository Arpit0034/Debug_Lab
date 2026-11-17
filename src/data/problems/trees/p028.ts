import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p028',
  title: 'Internal nodes counted as leaves',
  difficulty: 'Easy',
  topic: 'Trees',
  subtopic: 'Leaf Count',
  tags: ['Leaf Count', 'Condition Check'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Count leaves in a binary tree pattern',
  description:
    'Return how many nodes have no children. The code counts some nodes with exactly one child as if they had none.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, null, 3]', output: '1' },
    { input: 'root = [1, 2, 3]', output: '2' },
  ],
  hints: ['Write down the children of a node that should count.', 'Check whether both child links must be empty at the same time.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Count nodes that have no left child and no right child.',
    algorithm:
      'An empty branch contributes 0. A node with both children missing contributes 1. Otherwise return the sum of leaf counts from both children.',
    bug: 'The leaf test uses OR, so a node with only one child is counted as a leaf.',
    whyItFails:
      'A node with a single child is not a leaf, but the condition accepts it and stops exploring the subtree below that child.',
    failingTestCase: 'Tree 1 with only a left child 2, where 2 has leaves 3 and 4: the code returns 1 instead of 2.',
    fix: 'Use AND so that both child links must be empty.',
    whyFixWorks: 'Only nodes with no children satisfy both emptiness checks.',
    dryRun:
      'Node 2 has two leaf children, so it returns 1 + 1 = 2. The root has only a left child, so the buggy OR treats it as a leaf and returns 1. The fix requires both links empty, so the root returns the child count 2.',
    debuggingLesson:
      'For leaf checks, verify both child links and test a one-child node.',
  },
  testCases: [
    { input: 'one-child root with a two-leaf subtree, and its mirrored right-side twin', expected: '2 2', buggyOutput: '1 1' },
  ],
  harness: {
    expected: '2 2',
    driver: {
      java: `Solution.TreeNode a = new Solution.TreeNode(1); a.left = new Solution.TreeNode(2); a.left.left = new Solution.TreeNode(3); a.left.right = new Solution.TreeNode(4); Solution.TreeNode b = new Solution.TreeNode(5); b.right = new Solution.TreeNode(6); b.right.left = new Solution.TreeNode(7); b.right.right = new Solution.TreeNode(8); System.out.println(Solution.leafCount(a) + " " + Solution.leafCount(b));`,
      python: `a = TreeNode(1); a.left = TreeNode(2); a.left.left = TreeNode(3); a.left.right = TreeNode(4)
b = TreeNode(5); b.right = TreeNode(6); b.right.left = TreeNode(7); b.right.right = TreeNode(8)
print(leaf_count(a), leaf_count(b))`,
      c: `struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}, d={4,0,0}, e={5,0,0}, f={6,0,0}, g={7,0,0}, h={8,0,0};
a.left=&b; b.left=&c; b.right=&d;
e.right=&f; f.left=&g; f.right=&h;
printf("%d %d", leaf_count(&a), leaf_count(&e));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static int leafCount(TreeNode node) {
        if (node == null) return 0;
        if (node.left == null && node.right == null) return 1;
        return leafCount(node.left) + leafCount(node.right);
    }
}
`,
      bugs: { 5: { was: 'if (node.left == null && node.right == null) return 1;', buggy: 'if (node.left == null || node.right == null) return 1;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def leaf_count(node):
    if node is None:
        return 0
    if node.left is None and node.right is None:
        return 1
    return leaf_count(node.left) + leaf_count(node.right)
`,
      bugs: { 10: { was: 'if node.left is None and node.right is None:', buggy: '    if node.left is None or node.right is None:' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

int leaf_count(struct TreeNode *node) {
    if (node == 0) return 0;
    if (node->left == 0 && node->right == 0) return 1;
    return leaf_count(node->left) + leaf_count(node->right);
}
`,
      bugs: { 5: { was: 'if (node->left == 0 && node->right == 0) return 1;', buggy: 'if (node->left == 0 || node->right == 0) return 1;' } },
    },
  },
});
