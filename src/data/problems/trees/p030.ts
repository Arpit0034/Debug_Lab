import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p030',
  title: 'The walk stops before the root',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Inorder Iterative Walk',
  tags: ['Inorder', 'Stack', 'Loop Boundary'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Iterative inorder traversal pattern',
  description:
            'Return the node values of a tree in ascending order, where every left descendant is smaller than its node and every right descendant is larger, without using recursion. The code stops early and omits the root and the right side.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 3]', output: '2 1 3' },
  ],
    hints: ['Trace how many nodes are still pending after the first one is taken off.', 'Check the condition that decides whether the main loop continues.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Return all values in left-root-right order without recursion.',
    algorithm:
      'Push all left descendants, pop one node to visit it, then move to its right child. Continue while there is a current node or the stack is non-empty.',
    bug: 'The main loop continues only while the stack has more than one item, so it exits when one item remains.',
    whyItFails:
      'The root can remain on the stack, and the right subtree is never processed, so the output is incomplete.',
    failingTestCase: 'root = [1, 2, 3]: the code prints only 2 instead of 2 1 3.',
    fix: 'Continue while there is a current node or the stack is non-empty.',
    whyFixWorks: 'A single remaining node is still work to do.',
    dryRun:
      'Push 1 and 2, pop 2 and print it. With the fix, stack still has 1, so pop 1, print it, then push 3 and print it.',
    debuggingLesson:
      'For manual stacks, test the moment when exactly one item remains.',
  },
  testCases: [
    { input: 'root = [1, 2, 3]', expected: '2 1 3', buggyOutput: '2' },
  ],
  harness: {
    expected: '2 1 3',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); System.out.println(Solution.inorder(r));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); print(inorder(r))`,
      c: `char out[100]; out[0]=0; struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}; a.left=&b; a.right=&c; inorder(&a, out); printf("%s", out);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static String inorder(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        TreeNode[] stack = new TreeNode[100];
        int top = 0;
        TreeNode cur = root;
        while (cur != null || top > 0) {
            while (cur != null) {
                stack[top++] = cur;
                cur = cur.left;
            }
            cur = stack[--top];
            sb.append(cur.val).append(' ');
            cur = cur.right;
        }
        return sb.toString().trim();
    }
}
`,
      bugs: { 8: { was: 'while (cur != null || top > 0)', buggy: '        while (cur != null || top > 1) {' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorder(root):
    sb = []
    stack = []
    cur = root
    while cur is not None or len(stack) > 0:
        while cur is not None:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        sb.append(str(cur.val))
        cur = cur.right
    return ' '.join(sb)
`,
      bugs: { 11: { was: 'while cur is not None or len(stack) > 0:', buggy: '    while cur is not None or len(stack) > 1:' } },
    },
    c: {
      correct: `
#include <string.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

void inorder(struct TreeNode *root, char *out) {
    struct TreeNode *stack[100];
    int top = 0;
    struct TreeNode *cur = root;
    while (cur != 0 || top > 0) {
        while (cur != 0) {
            stack[top++] = cur;
            cur = cur->left;
        }
        cur = stack[--top];
        sprintf(out + strlen(out), "%d ", cur->val);
        cur = cur->right;
    }
}
`,
      bugs: { 8: { was: 'while (cur != 0 || top > 0)', buggy: '    while (cur != 0 || top > 1) {' } },
    },
  },
});
