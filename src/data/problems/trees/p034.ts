import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p034',
  title: 'Deletion drops the only child',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'BST Delete',
  tags: ['BST Delete', 'Pointer Update', 'One Child'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'Binary search tree delete with one child pattern',
  description:
    'Remove one value from an ordered tree and keep the remaining values connected. The code loses a subtree when the removed node has only a right child.',
  constraints: ['1 <= number of nodes <= 10000', 'The value to remove exists'],
  examples: [
    { input: 'insert [5, 3, 7, 4], remove 3', output: '4 5 7' },
  ],
  hints: ['Trace removal of a node with no left child but a right child.', 'Check what is returned in place of that node.'],
  complexity: { time: 'O(h)', space: 'O(h)' },
  explanation: {
    overview: 'Delete a node from an ordered tree while preserving all other nodes.',
    algorithm:
      'Search for the value. When found, replace a missing-left node with its right child, a missing-right node with its left child, or use the smallest right-side value when both children exist.',
    bug: 'When the node has no left child, the code returns empty instead of returning the right child.',
    whyItFails:
      'The entire right subtree of the removed node is disconnected and lost.',
    failingTestCase: 'Delete 3 from [5, 3, 7, 4]: the code outputs 5 7 instead of 4 5 7.',
    fix: 'Return the right child when the left child is missing.',
    whyFixWorks: 'That child becomes the replacement link for the parent.',
    dryRun:
      'Node 3 has no left child and right child 4. Returning 4 makes 5.left point to 4, so sorted output is 4 5 7.',
    debuggingLesson:
      'For deletion, test nodes with zero, one, and two children separately.',
  },
  testCases: [
    { input: 'insert [5, 3, 7, 4], remove 3', expected: '4 5 7', buggyOutput: '5 7' },
  ],
  harness: {
    expected: '4 5 7',
    driver: {
      java: `Solution.TreeNode root = null; int[] vals = {5, 3, 7, 4}; for (int v : vals) root = Solution.insert(root, v); root = Solution.delete(root, 3); System.out.println(Solution.inorder(root).trim());`,
      python: `root = None\nfor v in [5, 3, 7, 4]:\n    root = insert(root, v)\nroot = delete(root, 3)\nprint(inorder(root).strip())`,
      c: `struct TreeNode *root=0; root=insert(root,5); root=insert(root,3); root=insert(root,7); root=insert(root,4); root=delete_node(root,3); char out[100]; out[0]=0; inorder(root,out); printf("%s", out);`,
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
    static TreeNode delete(TreeNode node, int val) {
        if (node == null) return null;
        if (val < node.val) node.left = delete(node.left, val);
        else if (val > node.val) node.right = delete(node.right, val);
        else {
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            TreeNode min = node.right;
            while (min.left != null) min = min.left;
            node.val = min.val;
            node.right = delete(node.right, min.val);
        }
        return node;
    }
    static String inorder(TreeNode node) {
        if (node == null) return "";
        return inorder(node.left) + node.val + " " + inorder(node.right);
    }
}
`,
      bugs: { 14: { was: 'if (node.left == null) return node.right;', buggy: 'if (node.left == null) return null;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(node, val):
    if node is None: return TreeNode(val)
    if val < node.val: node.left = insert(node.left, val)
    elif val > node.val: node.right = insert(node.right, val)
    return node

def delete(node, val):
    if node is None: return None
    if val < node.val: node.left = delete(node.left, val)
    elif val > node.val: node.right = delete(node.right, val)
    else:
        if node.left is None: return node.right
        if node.right is None: return node.left
        m = node.right
        while m.left is not None: m = m.left
        node.val = m.val
        node.right = delete(node.right, m.val)
    return node

def inorder(node):
    if node is None: return ''
    return inorder(node.left) + str(node.val) + ' ' + inorder(node.right)
`,
      bugs: { 18: { was: 'if node.left is None: return node.right', buggy: '        if node.left is None: return None' } },
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

struct TreeNode* delete_node(struct TreeNode *node, int val) {
    if (node == 0) return 0;
    if (val < node->val) node->left = delete_node(node->left, val);
    else if (val > node->val) node->right = delete_node(node->right, val);
    else {
        if (node->left == 0) return node->right;
        if (node->right == 0) return node->left;
        struct TreeNode *m = node->right;
        while (m->left != 0) m = m->left;
        node->val = m->val;
        node->right = delete_node(node->right, m->val);
    }
    return node;
}

void inorder(struct TreeNode *node, char *out) {
    if (node == 0) return;
    inorder(node->left, out);
    sprintf(out + strlen(out), "%d ", node->val);
    inorder(node->right, out);
}
`,
      bugs: { 20: { was: 'if (node->left == 0) return node->right;', buggy: 'if (node->left == 0) return 0;' } },
    },
  },
});
