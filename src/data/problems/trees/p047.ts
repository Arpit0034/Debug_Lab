import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p047',
  title: 'All-negative tree loses its best node',
  difficulty: 'Hard',
  topic: 'Trees',
  subtopic: 'Maximum Path Sum',
  tags: ['Maximum Path Sum', 'Negative Values', 'Edge Case'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Maximum path sum in binary tree pattern',
  description:
    'Return the largest sum of values along any path between two nodes. The code returns zero for a structure whose values are all negative.',
  constraints: ['1 <= number of nodes <= 10000', 'Values may be negative'],
  examples: [
    { input: 'root = [-3, -2, -5]', output: '-2' },
  ],
  hints: ['Trace a single-node tree with a negative value.', 'Check the initial best value before any node is processed.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Find the maximum sum over any path in a node structure with negative values allowed.',
    algorithm:
      'For each node compute the best downward gain from the left and right, ignore negative gains, update the best path through the node, and return the best single-side gain to the parent.',
    bug: 'The best value is initialized to zero instead of a very small number.',
    whyItFails:
      'When every value is negative, the best path should be the largest negative value, but zero is never replaced.',
    failingTestCase: 'root = [-3, -2, -5]: the code returns 0 instead of -2.',
    fix: 'Initialize the best value below every possible node value.',
    whyFixWorks: 'The first real path can then replace the initial value even if it is negative.',
    dryRun:
      'Node -2 gives candidate -2. The fix keeps -2. The buggy zero stays larger and is returned.',
    debuggingLesson:
      'When values may be negative, do not initialize maximum answers to zero without checking the all-negative case.',
  },
  testCases: [
    { input: 'root = [-3, -2, -5]', expected: '-2', buggyOutput: '0' },
  ],
  harness: {
    expected: '-2',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(-3); r.left = new Solution.TreeNode(-2); r.right = new Solution.TreeNode(-5); System.out.println(Solution.maxPathSum(r));`,
      python: `r = TreeNode(-3); r.left = TreeNode(-2); r.right = TreeNode(-5); print(max_path_sum(r))`,
      c: `struct TreeNode a={-3,0,0}, b={-2,0,0}, c={-5,0,0}; a.left=&b; a.right=&c; printf("%d", max_path_sum(&a));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static int best;
    static int gain(TreeNode node) {
        if (node == null) return 0;
        int left = Math.max(0, gain(node.left));
        int right = Math.max(0, gain(node.right));
        best = Math.max(best, node.val + left + right);
        return node.val + Math.max(left, right);
    }
    static int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
    }
}
`,
      bugs: { 12: { was: 'best = Integer.MIN_VALUE;', buggy: 'best = 0;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

best = 0

def gain(node):
    global best
    if node is None:
        return 0
    left = max(0, gain(node.left))
    right = max(0, gain(node.right))
    best = max(best, node.val + left + right)
    return node.val + max(left, right)

def max_path_sum(root):
    global best
    best = -10**9
    gain(root)
    return best
`,
      bugs: { 20: { was: 'best = -10**9', buggy: '    best = 0' } },
    },
    c: {
      correct: `
#include <limits.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };
int best;
int gain(struct TreeNode *node) {
    if (node == 0) return 0;
    int left = gain(node->left);
    int right = gain(node->right);
    if (left < 0) left = 0;
    if (right < 0) right = 0;
    int total = node->val + left + right;
    if (total > best) best = total;
    int one = node->val + (left > right ? left : right);
    return one;
}
int max_path_sum(struct TreeNode *root) {
    best = INT_MIN;
    gain(root);
    return best;
}
`,
      bugs: { 16: { was: 'best = INT_MIN;', buggy: 'best = 0;' } },
    },
  },
});
