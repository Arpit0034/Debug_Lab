import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p027',
  title: 'The total forgets the parent',
  difficulty: 'Easy',
  topic: 'Trees',
  subtopic: 'Tree Node Sum',
  tags: ['Tree Sum', 'Recursion'],
  bugCategory: 'Incorrect Tree Traversal Logic',
  sourceInspiredBy: 'Sum of all nodes in a binary tree pattern',
  description:
    'Return the sum of all values stored in the nodes. The code returns a total that misses one value at every step.',
  constraints: ['0 <= number of nodes <= 10000', 'Values may be negative'],
  examples: [
    { input: 'root = [1, 2, 3]', output: '6' },
    { input: 'root = [7]', output: '7' },
  ],
  hints: ['Compare the returned value at a leaf with its own value.', 'Check whether the current node value is included in the return expression.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Add every node value in a binary tree.',
    algorithm:
      'An empty branch contributes 0. A real node contributes its own value plus the sums of its left and right subtrees.',
    bug: 'The return expression adds only the two child sums and leaves out the current node value.',
    whyItFails:
      'The root and every internal node are skipped, so the final total is the sum of only some descendants.',
    failingTestCase: 'root = [1, 2, 3]: the code returns 5 instead of 6.',
    fix: 'Include node.val in the returned expression.',
    whyFixWorks: 'Each call must account for its own node before adding the child results.',
    dryRun:
      'Leaf 2 returns 2, leaf 3 returns 3, root 1 returns 1 + 2 + 3 = 6.',
    debuggingLesson:
      'For recursive totals, check that the combine step includes the current element, not just the recursive results.',
  },
  testCases: [
    { input: 'root = [1, 2, 3], single = [7]', expected: '6 7', buggyOutput: '5 0' },
  ],
  harness: {
    expected: '6 7',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); System.out.println(Solution.sumTree(r) + " " + Solution.sumTree(new Solution.TreeNode(7)));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); print(sum_tree(r), sum_tree(TreeNode(7)))`,
      c: `struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}, d={7,0,0}; a.left=&b; a.right=&c; printf("%d %d", sum_tree(&a), sum_tree(&d));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static int sumTree(TreeNode node) {
        if (node == null) return 0;
        return node.val + sumTree(node.left) + sumTree(node.right);
    }
}
`,
      bugs: { 5: { was: 'return node.val + sumTree(node.left) + sumTree(node.right);', buggy: 'return sumTree(node.left) + sumTree(node.right);' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def sum_tree(node):
    if node is None:
        return 0
    return node.val + sum_tree(node.left) + sum_tree(node.right)
`,
      bugs: { 10: { was: 'return node.val + sum_tree(node.left) + sum_tree(node.right)', buggy: '    return sum_tree(node.left) + sum_tree(node.right)' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

int sum_tree(struct TreeNode *node) {
    if (node == 0) return 0;
    return node->val + sum_tree(node->left) + sum_tree(node->right);
}
`,
      bugs: { 5: { was: 'return node->val + sum_tree(node->left) + sum_tree(node->right);', buggy: 'return sum_tree(node->left) + sum_tree(node->right);' } },
    },
  },
});
