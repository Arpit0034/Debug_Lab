import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p045',
  title: 'Mirror check compares the same branch',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Symmetry Check',
  tags: ['Symmetry', 'Recursion', 'Child Pairing'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Symmetric binary tree check pattern',
  description:
    'Return whether the left and right sides of a structure are mirror images. The code compares matching sides instead of opposite sides.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 2, 3, null, null, 3]', output: 'true' },
  ],
  hints: ['For a mirror, which child of the left side pairs with the right child of the right side?', 'Trace a symmetric tree with values only on outer sides.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Check whether two branches are mirror images.',
    algorithm:
      'Compare the two current values, then compare the left child of one side with the right child of the other side, and the right child with the left child.',
    bug: 'The recursive calls pair same-side children instead of opposite-side children.',
    whyItFails:
      'A symmetric tree with a left-only grandchild on one side and a right-only grandchild on the other is rejected.',
    failingTestCase: 'root = [1, 2, 2, 3, null, null, 3]: the code returns false instead of true.',
    fix: 'Pair the left child with the opposite right child and vice versa.',
    whyFixWorks: 'That pairing matches the definition of a mirror image.',
    dryRun:
      'At the two 2 nodes, compare left 3 with opposite right 3. The fix accepts; same-side comparison sees empty on one side and fails.',
    debuggingLesson:
      'For mirror or symmetry checks, write the intended child pairs explicitly before coding.',
  },
  testCases: [
    { input: 'root = [1, 2, 2, 3, null, null, 3]', expected: '1', buggyOutput: '0' },
  ],
  harness: {
    expected: '1',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(2); r.left.left = new Solution.TreeNode(3); r.right.right = new Solution.TreeNode(3); System.out.println(Solution.symmetric(r) ? 1 : 0);`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(2); r.left.left = TreeNode(3); r.right.right = TreeNode(3); print(1 if symmetric(r) else 0)`,
      c: `struct TreeNode a={1,0,0}, b={2,0,0}, c={2,0,0}, d={3,0,0}, e={3,0,0}; a.left=&b; a.right=&c; b.left=&d; c.right=&e; printf("%d", symmetric(&a));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static boolean mirror(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
    }
    static boolean symmetric(TreeNode root) {
        if (root == null) return true;
        return mirror(root.left, root.right);
    }
}
`,
      bugs: { 6: { was: 'return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);', buggy: 'return a.val == b.val && mirror(a.left, b.left) && mirror(a.right, b.right);' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def mirror(a, b):
    if a is None and b is None:
        return True
    if a is None or b is None:
        return False
    return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)

def symmetric(root):
    if root is None:
        return True
    return mirror(root.left, root.right)
`,
      bugs: { 12: { was: 'return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)', buggy: '    return a.val == b.val and mirror(a.left, b.left) and mirror(a.right, b.right)' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

int mirror(struct TreeNode *a, struct TreeNode *b) {
    if (a == 0 && b == 0) return 1;
    if (a == 0 || b == 0) return 0;
    return a->val == b->val && mirror(a->left, b->right) && mirror(a->right, b->left);
}

int symmetric(struct TreeNode *root) {
    if (root == 0) return 1;
    return mirror(root->left, root->right);
}
`,
      bugs: { 6: { was: 'return a->val == b->val && mirror(a->left, b->right) && mirror(a->right, b->left);', buggy: 'return a->val == b->val && mirror(a->left, b->left) && mirror(a->right, b->right);' } },
    },
  },
});
