import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p032',
  title: 'Postorder visits the children backwards',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Postorder Traversal',
  tags: ['Postorder', 'Recursion', 'Traversal Order'],
  bugCategory: 'Incorrect Tree Traversal Logic',
  sourceInspiredBy: 'Postorder binary tree traversal pattern',
  description:
    'Return values by visiting both child branches before their parent. The code visits one child twice and misses the other.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 3]', output: '2 3 1' },
  ],
  hints: ['Trace which value appears first for a root with two leaves.', 'Check the child link used in the first recursive call.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'List node values in left-right-root order.',
    algorithm:
      'Recurse into the left child, then the right child, then append the current node value.',
    bug: 'The first recursive call uses the right child instead of the left child.',
    whyItFails:
      'The right subtree is processed twice and the left subtree is never processed.',
    failingTestCase: 'root = [1, 2, 3]: the code returns 3 3 1 instead of 2 3 1.',
    fix: 'Recurse into the left child in the first call.',
    whyFixWorks: 'The two calls then process the left and right subtrees exactly once.',
    dryRun:
      'With the fix: left 2 prints 2, right 3 prints 3, root 1 prints last, giving 2 3 1.',
    debuggingLesson:
      'In ordered traversals, verify the child order and that each subtree is visited once.',
  },
  testCases: [
    { input: 'root = [1, 2, 3]', expected: '2 3 1', buggyOutput: '3 3 1' },
  ],
  harness: {
    expected: '2 3 1',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); System.out.println(Solution.postorderString(r));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); print(postorder_string(r))`,
      c: `char out[100]; out[0]=0; struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}; a.left=&b; a.right=&c; postorder(&a, out); printf("%s", out);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static void postorder(TreeNode node, StringBuilder sb) {
        if (node == null) return;
        postorder(node.left, sb);
        postorder(node.right, sb);
        sb.append(node.val).append(' ');
    }
    static String postorderString(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        postorder(root, sb);
        return sb.toString().trim();
    }
}
`,
      bugs: { 5: { was: 'postorder(node.left, sb);', buggy: 'postorder(node.right, sb);' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def postorder(node, out):
    if node is None:
        return
    postorder(node.left, out)
    postorder(node.right, out)
    out.append(str(node.val))

def postorder_string(root):
    out = []
    postorder(root, out)
    return ' '.join(out)
`,
      bugs: { 10: { was: 'postorder(node.left, out)', buggy: '    postorder(node.right, out)' } },
    },
    c: {
      correct: `
#include <string.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

void postorder(struct TreeNode *node, char *out) {
    if (node == 0) return;
    postorder(node->left, out);
    postorder(node->right, out);
    sprintf(out + strlen(out), "%d ", node->val);
}
`,
      bugs: { 6: { was: 'postorder(node->left, out);', buggy: 'postorder(node->right, out);' } },
    },
  },
});
