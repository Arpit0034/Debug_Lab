import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p026',
  title: 'The empty branch adds a level',
  difficulty: 'Easy',
  topic: 'Trees',
  subtopic: 'Tree Height',
  tags: ['Tree Height', 'Recursion', 'Base Case'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Maximum depth of binary tree pattern',
  description:
    'Return the number of nodes on the longest path from the root down to a leaf. The code returns a height that is too large for non-empty inputs.',
  constraints: ['0 <= number of nodes <= 10000', 'Node values are integers'],
  examples: [
    { input: 'root = [1, 2, 3, null, null, 4]', output: '3', note: 'The longest path uses three nodes.' },
    { input: 'root = [7]', output: '1' },
  ],
  hints: ['Trace what happens when a child link is empty.', 'Look at the value returned for an empty branch.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Compute the height of a binary tree measured in nodes.',
    algorithm:
      'For an empty branch the height is zero. For a real node, compute both child heights, take the larger, and add one for the current node.',
    bug: 'The empty branch returns 1 instead of 0.',
    whyItFails:
      'Every missing child contributes an extra level, so the final height is larger than the true number of nodes on the longest path.',
    failingTestCase: 'root = [1, 2, null, 4] with a right child 3: the code returns 4 instead of 3.',
    fix: 'Return 0 when the node is empty.',
    whyFixWorks: 'An empty branch has no nodes, so its height must be zero before adding the current node.',
    dryRun:
      'For 1 with left 2 and right 3, and 2 with left 4: leaf 4 returns 1; node 2 returns 1 + max(1, 0) = 2; root returns 1 + max(2, 1) = 3.',
    debuggingLesson:
      'Always test the empty input and the single-node input for recursive tree functions.',
  },
  testCases: [
    { input: 'root = [1, 2, 3, 4], single = [9]', expected: '3 1', buggyOutput: '4 2' },
  ],
  harness: {
    expected: '3 1',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.left.left = new Solution.TreeNode(4); r.right = new Solution.TreeNode(3); System.out.println(Solution.height(r) + " " + Solution.height(new Solution.TreeNode(9)));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.left.left = TreeNode(4); r.right = TreeNode(3); print(height(r), height(TreeNode(9)))`,
      c: `struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}, d={4,0,0}; a.left=&b; a.right=&c; b.left=&d; printf("%d %d", height(&a), height(&c));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int v) { val = v; }
    }
    static int height(TreeNode node) {
        if (node == null) return 0;
        int left = height(node.left);
        int right = height(node.right);
        return 1 + Math.max(left, right);
    }
}
`,
      bugs: { 8: { was: 'if (node == null) return 0;', buggy: 'if (node == null) return 1;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def height(node):
    if node is None:
        return 0
    left = height(node.left)
    right = height(node.right)
    return 1 + max(left, right)
`,
      bugs: { 9: { was: 'return 0', buggy: '        return 1' } },
    },
    c: {
      correct: `
struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

int height(struct TreeNode *node) {
    if (node == 0) return 0;
    int left = height(node->left);
    int right = height(node->right);
    return 1 + (left > right ? left : right);
}
`,
      bugs: { 8: { was: 'if (node == 0) return 0;', buggy: 'if (node == 0) return 1;' } },
    },
  },
});
