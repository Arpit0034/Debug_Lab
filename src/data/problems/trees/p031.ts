import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p031',
  title: 'The right branch is skipped',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Preorder Traversal',
  tags: ['Preorder', 'Recursion', 'Traversal Order'],
  bugCategory: 'Incorrect Tree Traversal Logic',
  sourceInspiredBy: 'Preorder binary tree traversal pattern',
  description:
    'Return values by visiting a node before its child branches. The code repeats one branch and never visits the other side.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 3]', output: '1 2 3' },
  ],
  hints: ['Trace the call made after the left child finishes.', 'Check whether the second recursive call uses the correct child link.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'List node values in root-left-right order.',
    algorithm:
      'Append the current value, recurse into the left child, then recurse into the right child.',
    bug: 'The second recursive call invokes the left child again instead of the right child.',
    whyItFails:
      'The right subtree is never visited, and the left subtree is printed twice.',
    failingTestCase: 'root = [1, 2, 3]: the code returns 1 2 2 instead of 1 2 3.',
    fix: 'Call the recursive function on the right child in the second call.',
    whyFixWorks: 'The two calls then cover both distinct branches.',
    dryRun:
      'Visit 1, recurse left to 2, visit 2; then the fix recurses right to 3 and visits 3, giving 1 2 3.',
    debuggingLesson:
      'When copying recursive calls, verify that the child link changes between the two calls.',
  },
  testCases: [
    { input: 'root = [1, 2, 3]', expected: '1 2 3', buggyOutput: '1 2 2' },
  ],
  harness: {
    expected: '1 2 3',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); System.out.println(Solution.preorderString(r));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); print(preorder_string(r))`,
      c: `char out[100]; out[0]=0; struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}; a.left=&b; a.right=&c; preorder(&a, out); printf("%s", out);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static void preorder(TreeNode node, StringBuilder sb) {
        if (node == null) return;
        sb.append(node.val).append(' ');
        preorder(node.left, sb);
        preorder(node.right, sb);
    }
    static String preorderString(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        preorder(root, sb);
        return sb.toString().trim();
    }
}
`,
      bugs: { 7: { was: 'preorder(node.right, sb);', buggy: 'preorder(node.left, sb);' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def preorder(node, out):
    if node is None:
        return
    out.append(str(node.val))
    preorder(node.left, out)
    preorder(node.right, out)

def preorder_string(root):
    out = []
    preorder(root, out)
    return ' '.join(out)
`,
      bugs: { 12: { was: 'preorder(node.right, out)', buggy: '    preorder(node.left, out)' } },
    },
    c: {
      correct: `
#include <string.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

void preorder(struct TreeNode *node, char *out) {
    if (node == 0) return;
    sprintf(out + strlen(out), "%d ", node->val);
    preorder(node->left, out);
    preorder(node->right, out);
}
`,
      bugs: { 8: { was: 'preorder(node->right, out);', buggy: 'preorder(node->left, out);' } },
    },
  },
});
