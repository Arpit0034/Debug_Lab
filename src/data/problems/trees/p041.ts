import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p041',
  title: 'Rotation keeps the old parent',
  difficulty: 'Hard',
  topic: 'Trees',
  subtopic: 'AVL Rotation',
  tags: ['AVL Rotation', 'Pointer Update', 'Left Rotation'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'AVL left rotation pointer update pattern',
  description:
    'Perform a left rotation around a node and return the new local root. The code leaves a link pointing back to the new root and creates an unintended cycle.',
  constraints: ['The rotated node has a right child', 'The right child may have a left child'],
  examples: [
    { input: 'x = 10, right = 20, right.left = 15', output: '20 10 15' },
  ],
  hints: ['Write down the three links before and after a rotation.', 'Check which subtree should become the old node right child.'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  explanation: {
    overview: 'Move the right child up and make the old node its left child.',
    algorithm:
      'Save the right child y and its left subtree t. Set y.left to x and set x.right to t. Return y as the new local root.',
    bug: 'The old node right link is set to y instead of the saved middle subtree t.',
    whyItFails:
      'The old node and new root point to each other, so the structure is no longer a valid tree.',
    failingTestCase: 'x = 10 with right 20 and 20.left 15: the code makes 10.right point to 20 instead of 15.',
    fix: 'Set the old node right link to the saved middle subtree.',
    whyFixWorks: 'The middle subtree keeps its values and the cycle is removed.',
    dryRun:
      'Before: 10.right = 20 and 20.left = 15. After the fix: 20.left = 10 and 10.right = 15.',
    debuggingLesson:
      'In pointer rotations, save every moved subtree before changing links and check for cycles.',
  },
  testCases: [
    { input: 'x = 10, right = 20, right.left = 15', expected: '20 10 15', buggyOutput: '20 10 20' },
  ],
  harness: {
    expected: '20 10 15',
    driver: {
      java: `Solution.TreeNode x = new Solution.TreeNode(10); x.right = new Solution.TreeNode(20); x.right.left = new Solution.TreeNode(15); System.out.println(Solution.rotateInfo(x));`,
      python: `x = TreeNode(10); x.right = TreeNode(20); x.right.left = TreeNode(15); print(rotate_info(x))`,
      c: `struct TreeNode a={10,0,0}, b={20,0,0}, c={15,0,0}; a.right=&b; b.left=&c; int out[3]; rotate_info(&a, out); printf("%d %d %d", out[0], out[1], out[2]);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static TreeNode leftRotate(TreeNode x) {
        TreeNode y = x.right;
        TreeNode t = y.left;
        y.left = x;
        x.right = t;
        return y;
    }
    static String rotateInfo(TreeNode x) {
        TreeNode root = leftRotate(x);
        return root.val + " " + root.left.val + " " + root.left.right.val;
    }
}
`,
      bugs: { 7: { was: 'x.right = t;', buggy: 'x.right = y;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def left_rotate(x):
    y = x.right
    t = y.left
    y.left = x
    x.right = t
    return y

def rotate_info(x):
    root = left_rotate(x)
    return str(root.val) + ' ' + str(root.left.val) + ' ' + str(root.left.right.val)
`,
      bugs: { 11: { was: 'x.right = t', buggy: '    x.right = y' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

struct TreeNode* left_rotate(struct TreeNode *x) {
    struct TreeNode *y = x->right;
    struct TreeNode *t = y->left;
    y->left = x;
    x->right = t;
    return y;
}

void rotate_info(struct TreeNode *x, int out[3]) {
    struct TreeNode *root = left_rotate(x);
    out[0] = root->val;
    out[1] = root->left->val;
    out[2] = root->left->right->val;
}
`,
      bugs: { 7: { was: 'x->right = t;', buggy: 'x->right = y;' } },
    },
  },
});
