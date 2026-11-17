import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p046',
  title: 'The ancestor search branches too soon',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'BST Lowest Common Ancestor',
  tags: ['BST LCA', 'Ordered Tree', 'Boundary'],
  bugCategory: 'Incorrect Binary Search Boundary',
  sourceInspiredBy: 'Lowest common ancestor in BST using value boundaries pattern',
  description:
    'Return the deepest shared ancestor of two values in an ordered tree. The code walks left even when only one value is smaller, so it misses the split point.',
  constraints: ['2 <= number of nodes <= 10000', 'Both target values exist'],
  examples: [
    { input: 'root = [6, 2, 8], p = 2, q = 8', output: '6' },
  ],
  hints: ['Trace a case where one target is on each side of the root.', 'Check whether both targets must be smaller before moving left.'],
  complexity: { time: 'O(h)', space: 'O(h)' },
  explanation: {
    overview: 'Find the lowest node whose value range contains both targets.',
    algorithm:
      'If both targets are smaller than the current value, go left. If both are larger, go right. Otherwise the current node is the split point and the answer.',
    bug: 'The left-move condition uses OR, so it moves left when only one target is smaller.',
    whyItFails:
      'When the targets lie on different sides, the code still descends into one side and returns a node below the true ancestor.',
    failingTestCase: 'root = [6, 2, 8], targets 2 and 8: the code returns 2 instead of 6.',
    fix: 'Move left only when both targets are smaller.',
    whyFixWorks: 'A split point must not send both targets into the same side.',
    dryRun:
      'At root 6 with targets 2 and 8: 6 is greater than 2 but not greater than 8. With AND it stops at 6; with OR it wrongly goes left to 2.',
    debuggingLesson:
      'Ordered-tree decisions should use AND when both keys must lie on the same side.',
  },
  testCases: [
    { input: 'root = [6, 2, 8], p = 2, q = 8', expected: '6', buggyOutput: '2' },
  ],
  harness: {
    expected: '6',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(6); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(8); System.out.println(Solution.lca(r, r.left, r.right).val);`,
      python: `r = TreeNode(6); r.left = TreeNode(2); r.right = TreeNode(8); print(lca(r, r.left, r.right).val)`,
      c: `struct TreeNode a={6,0,0}, b={2,0,0}, c={8,0,0}; a.left=&b; a.right=&c; printf("%d", lca(&a, &b, &c)->val);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
        if (root.val > p.val && root.val > q.val) return lca(root.left, p, q);
        if (root.val < p.val && root.val < q.val) return lca(root.right, p, q);
        return root;
    }
}
`,
      bugs: { 4: { was: 'if (root.val > p.val && root.val > q.val) return lca(root.left, p, q);', buggy: 'if (root.val > p.val || root.val > q.val) return lca(root.left, p, q);' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def lca(root, p, q):
    if root.val > p.val and root.val > q.val:
        return lca(root.left, p, q)
    if root.val < p.val and root.val < q.val:
        return lca(root.right, p, q)
    return root
`,
      bugs: { 8: { was: 'if root.val > p.val and root.val > q.val:', buggy: '    if root.val > p.val or root.val > q.val:' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

struct TreeNode* lca(struct TreeNode *root, struct TreeNode *p, struct TreeNode *q) {
    if (root->val > p->val && root->val > q->val) return lca(root->left, p, q);
    if (root->val < p->val && root->val < q->val) return lca(root->right, p, q);
    return root;
}
`,
      bugs: { 4: { was: 'if (root->val > p->val && root->val > q->val) return lca(root->left, p, q);', buggy: 'if (root->val > p->val || root->val > q->val) return lca(root->left, p, q);' } },
    },
  },
});
