import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p036',
  title: 'The common ancestor climbs too far',
  difficulty: 'Hard',
  topic: 'Trees',
  subtopic: 'Lowest Common Ancestor',
  tags: ['Lowest Common Ancestor', 'Recursion', 'Base Case'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Lowest common ancestor in binary tree pattern',
  description:
    'Return the deepest node that is an ancestor of both given nodes. The code recognises only one of the two target nodes while stopping the recursion.',
  constraints: ['2 <= number of nodes <= 10000', 'Both target nodes exist and are distinct'],
  examples: [
    { input: 'root = [3, 5, 1], p = 5, q = 1', output: '3' },
  ],
  hints: ['Trace what happens when the recursion reaches the second target.', 'Check whether both target comparisons appear in the stopping condition.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Find the lowest node that has both requested nodes in its subtree.',
    algorithm:
      'Stop when the current node is empty or is one of the requested nodes. Search both children. If both searches find something, the current node is the answer; otherwise return the non-empty side.',
    bug: 'The stopping condition checks only one target node, not both.',
    whyItFails:
      'When the recursion reaches the other target, it does not stop, so that target may appear missing and the answer is chosen too low.',
    failingTestCase: 'root = [3, 5, 1], targets 5 and 1: the code returns 5 instead of 3.',
    fix: 'Stop when the current node equals either target.',
    whyFixWorks: 'A target node must be reported upward as found.',
    dryRun:
      'At root 3, left search finds 5, right search should stop at 1. With both found, root 3 is returned.',
    debuggingLesson:
      'In multi-target recursion, ensure every target is handled in the base case.',
  },
  testCases: [
    { input: 'root = [3, 5, 1], p = 5, q = 1', expected: '3', buggyOutput: '5' },
  ],
  harness: {
    expected: '3',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(3); r.left = new Solution.TreeNode(5); r.right = new Solution.TreeNode(1); System.out.println(Solution.lca(r, r.left, r.right).val);`,
      python: `r = TreeNode(3); r.left = TreeNode(5); r.right = TreeNode(1); print(lca(r, r.left, r.right).val)`,
      c: `struct TreeNode a={3,0,0}, b={5,0,0}, c={1,0,0}; a.left=&b; a.right=&c; printf("%d", lca(&a, &b, &c)->val);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lca(root.left, p, q);
        TreeNode right = lca(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}
`,
      bugs: { 4: { was: 'if (root == null || root == p || root == q) return root;', buggy: 'if (root == null || root == p) return root;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def lca(root, p, q):
    if root is None or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left is not None and right is not None:
        return root
    return left if left is not None else right
`,
      bugs: { 8: { was: 'if root is None or root is p or root is q:', buggy: '    if root is None or root is p:' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

struct TreeNode* lca(struct TreeNode *root, struct TreeNode *p, struct TreeNode *q) {
    if (root == 0 || root == p || root == q) return root;
    struct TreeNode *left = lca(root->left, p, q);
    struct TreeNode *right = lca(root->right, p, q);
    if (left != 0 && right != 0) return root;
    return left != 0 ? left : right;
}
`,
      bugs: { 4: { was: 'if (root == 0 || root == p || root == q) return root;', buggy: 'if (root == 0 || root == p) return root;' } },
    },
  },
});
