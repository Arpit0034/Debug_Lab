import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p042',
  title: 'The balance check is one-sided',
  difficulty: 'Hard',
  topic: 'Trees',
  subtopic: 'AVL Balance Check',
  tags: ['AVL', 'Balance Factor', 'Condition'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'AVL balanced tree check pattern',
  description:
    'Return whether every node has side heights that differ by at most one. The code misses an imbalance when the left side is much taller.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, null, 3]', output: 'false' },
    { input: 'root = [1, 2, 3]', output: 'true' },
  ],
  hints: ['Compute the side-height difference at the top of a long left chain.', 'Check which sign of the difference is rejected.'],
  complexity: { time: 'O(n^2)', space: 'O(h)' },
  explanation: {
    overview: 'Check whether all nodes are height-balanced.',
    algorithm:
      'For each node compute the left height minus the right height. Reject if the absolute difference is greater than one, then check both children.',
    bug: 'The rejection condition checks only differences below negative one, ignoring positive differences.',
    whyItFails:
      'A node whose left side is too tall has a positive difference and is accepted.',
    failingTestCase: 'A chain 1 left 2 left 3 has a positive difference of 2 at the root, but the code returns true.',
    fix: 'Reject when the difference is greater than one in either direction.',
    whyFixWorks: 'Both left-heavy and right-heavy nodes are then detected.',
    dryRun:
      'At root 1, left height is 2 and right height is 0, so diff is 2. The fix rejects immediately.',
    debuggingLesson:
      'Balance and difference checks usually need both positive and negative violations.',
  },
  testCases: [
    { input: 'unbalanced = [1, 2, null, 3], balanced = [1, 2, 3]', expected: '0 1', buggyOutput: '1 1' },
  ],
  harness: {
    expected: '0 1',
    driver: {
      java: `Solution.TreeNode a = new Solution.TreeNode(1); a.left = new Solution.TreeNode(2); a.left.left = new Solution.TreeNode(3); Solution.TreeNode b = new Solution.TreeNode(1); b.left = new Solution.TreeNode(2); b.right = new Solution.TreeNode(3); System.out.println((Solution.balanced(a) ? 1 : 0) + " " + (Solution.balanced(b) ? 1 : 0));`,
      python: `a = TreeNode(1); a.left = TreeNode(2); a.left.left = TreeNode(3); b = TreeNode(1); b.left = TreeNode(2); b.right = TreeNode(3); print(1 if balanced(a) else 0, 1 if balanced(b) else 0)`,
      c: `struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}, d={1,0,0}, e={2,0,0}, f={3,0,0}; a.left=&b; b.left=&c; d.left=&e; d.right=&f; printf("%d %d", balanced(&a), balanced(&d));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static int height(TreeNode node) {
        if (node == null) return 0;
        int l = height(node.left);
        int r = height(node.right);
        return 1 + Math.max(l, r);
    }
    static boolean balanced(TreeNode node) {
        if (node == null) return true;
        int diff = height(node.left) - height(node.right);
        if (diff > 1) return false;
        return balanced(node.left) && balanced(node.right);
    }
}
`,
      bugs: { 12: { was: 'if (diff > 1) return false;', buggy: 'if (diff < -1) return false;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def height(node):
    if node is None: return 0
    l = height(node.left)
    r = height(node.right)
    return 1 + max(l, r)

def balanced(node):
    if node is None: return True
    diff = height(node.left) - height(node.right)
    if diff > 1: return False
    return balanced(node.left) and balanced(node.right)
`,
      bugs: { 16: { was: 'if diff > 1: return False', buggy: '    if diff < -1: return False' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };
int height(struct TreeNode *node) {
    if (node == 0) return 0;
    int l = height(node->left);
    int r = height(node->right);
    return 1 + (l > r ? l : r);
}
int balanced(struct TreeNode *node) {
    if (node == 0) return 1;
    int diff = height(node->left) - height(node->right);
    if (diff > 1) return 0;
    return balanced(node->left) && balanced(node->right);
}
`,
      bugs: { 11: { was: 'if (diff > 1) return 0;', buggy: 'if (diff < -1) return 0;' } },
    },
  },
});
