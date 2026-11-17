import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p033',
  title: 'Duplicates crowd the left side',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'BST Insert',
  tags: ['BST Insert', 'Duplicates', 'Ordered Tree'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Binary search tree insert with duplicate ignoring pattern',
  description:
    'Insert values into an ordered tree and ignore values that are already present. The code inserts duplicates and changes the sorted output.',
  constraints: ['0 <= number of inserted values <= 10000'],
  examples: [
    { input: 'values = [2, 1, 2, 3]', output: '1 2 3' },
  ],
  hints: ['Trace the second occurrence of an existing value.', 'Check which comparison branch catches an equal value.'],
  complexity: { time: 'O(n h)', space: 'O(n)' },
  explanation: {
    overview: 'Maintain an ordered tree while ignoring repeated values.',
    algorithm:
      'Go left for smaller values, go right for larger values, and do nothing for equal values.',
    bug: 'The left branch uses less-than-or-equal, so duplicates are inserted into the left side.',
    whyItFails:
      'An equal value should be ignored, but it is sent into recursion and becomes a new node.',
    failingTestCase: 'values [2, 1, 2, 3]: the code produces 1 2 2 3 instead of 1 2 3.',
    fix: 'Use strict less-than for the left branch.',
    whyFixWorks: 'Equal values then match neither the left nor the right branch and are ignored.',
    dryRun:
      'Insert 2, then 1 goes left. The duplicate 2 must stop; with the fix it returns the existing node unchanged. Insert 3 goes right.',
    debuggingLesson:
      'When duplicates should be ignored, use strict comparisons and test repeated values.',
  },
  testCases: [
    { input: 'values = [2, 1, 2, 3]', expected: '1 2 3', buggyOutput: '1 2 2 3' },
  ],
  harness: {
    expected: '1 2 3',
    driver: {
      java: `Solution.TreeNode root = null; int[] vals = {2, 1, 2, 3}; for (int v : vals) root = Solution.insert(root, v); System.out.println(Solution.inorder(root).trim());`,
      python: `root = None\nfor v in [2, 1, 2, 3]:\n    root = insert(root, v)\nprint(inorder(root).strip())`,
      c: `struct TreeNode *root=0; root=insert(root,2); root=insert(root,1); root=insert(root,2); root=insert(root,3); char out[100]; out[0]=0; inorder(root,out); printf("%s", out);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else if (val > node.val) node.right = insert(node.right, val);
        return node;
    }
    static String inorder(TreeNode node) {
        if (node == null) return "";
        String left = inorder(node.left);
        String right = inorder(node.right);
        String mid = node.val + " ";
        return left + mid + right;
    }
}
`,
      bugs: { 5: { was: 'if (val < node.val) node.left = insert(node.left, val);', buggy: 'if (val <= node.val) node.left = insert(node.left, val);' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(node, val):
    if node is None:
        return TreeNode(val)
    if val < node.val:
        node.left = insert(node.left, val)
    elif val > node.val:
        node.right = insert(node.right, val)
    return node

def inorder(node):
    if node is None:
        return ''
    return inorder(node.left) + str(node.val) + ' ' + inorder(node.right)
`,
      bugs: { 10: { was: 'if val < node.val:', buggy: '    if val <= node.val:' } },
    },
    c: {
      correct: `
#include <string.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

struct TreeNode* insert(struct TreeNode *node, int val) {
    if (node == 0) {
        struct TreeNode *n = malloc(sizeof(struct TreeNode));
        n->val = val; n->left = 0; n->right = 0;
        return n;
    }
    if (val < node->val) node->left = insert(node->left, val);
    else if (val > node->val) node->right = insert(node->right, val);
    return node;
}

void inorder(struct TreeNode *node, char *out) {
    if (node == 0) return;
    inorder(node->left, out);
    sprintf(out + strlen(out), "%d ", node->val);
    inorder(node->right, out);
}
`,
      bugs: { 10: { was: 'if (val < node->val) node->left = insert(node->left, val);', buggy: 'if (val <= node->val) node->left = insert(node->left, val);' } },
    },
  },
});
