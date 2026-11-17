import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p035',
  title: 'A deep value escapes the range',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'BST Validation',
  tags: ['BST Validation', 'Range Check', 'Condition'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Validate binary search tree with min max bounds pattern',
  description:
    'Return whether an ordered tree satisfies the strict ordering rule everywhere. The code accepts some invalid trees because its rejection condition uses the wrong logical operator.',
  constraints: ['0 <= number of nodes <= 10000', 'Values may be large'],
  examples: [
    { input: 'root = [5, 1, 4]', output: 'false' },
    { input: 'root = [5, 3, 7]', output: 'true' },
  ],
  hints: ['Trace a node that is smaller than an ancestor on its right side.', 'Check whether both range failures must happen at once to reject a node.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Check that every node lies inside the allowed range from its ancestors.',
    algorithm:
      'Pass a lower and upper bound down the recursion. A node must be strictly above the lower bound and strictly below the upper bound. Update the bounds for each child.',
    bug: 'The rejection condition combines the lower-bound and upper-bound failures with AND.',
    whyItFails:
      'A single range violation does not satisfy both sides at once, so invalid nodes are accepted.',
    failingTestCase: 'root = [5, 1, 4]: the code returns true instead of false.',
    fix: 'Reject when either bound is violated by using OR.',
    whyFixWorks: 'A node is invalid as soon as it is too small or too large.',
    dryRun:
      'At node 4 with lower bound 5 and upper bound infinity: 4 is below 5, so OR rejects. AND would fail because 4 is not also above infinity.',
    debuggingLesson:
      'For range checks, ask whether one violation is enough to reject; usually it is OR.',
  },
  testCases: [
    { input: 'invalid = [5, 1, 4], valid = [5, 3, 7]', expected: '0 1', buggyOutput: '1 1' },
  ],
  harness: {
    expected: '0 1',
    driver: {
      java: `Solution.TreeNode a = new Solution.TreeNode(5); a.left = new Solution.TreeNode(1); a.right = new Solution.TreeNode(4); Solution.TreeNode b = new Solution.TreeNode(5); b.left = new Solution.TreeNode(3); b.right = new Solution.TreeNode(7); System.out.println((Solution.isValid(a) ? 1 : 0) + " " + (Solution.isValid(b) ? 1 : 0));`,
      python: `a = TreeNode(5); a.left = TreeNode(1); a.right = TreeNode(4); b = TreeNode(5); b.left = TreeNode(3); b.right = TreeNode(7); print(1 if is_valid(a) else 0, 1 if is_valid(b) else 0)`,
      c: `struct TreeNode a={5,0,0}, b={1,0,0}, c={4,0,0}, d={5,0,0}, e={3,0,0}, f={7,0,0}; a.left=&b; a.right=&c; d.left=&e; d.right=&f; printf("%d %d", is_valid(&a), is_valid(&d));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static boolean valid(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return valid(node.left, min, node.val) && valid(node.right, node.val, max);
    }
    static boolean isValid(TreeNode root) {
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
}
`,
      bugs: { 5: { was: 'if (node.val <= min || node.val >= max) return false;', buggy: 'if (node.val <= min && node.val >= max) return false;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def valid(node, low, high):
    if node is None:
        return True
    if (low is not None and node.val <= low) or (high is not None and node.val >= high):
        return False
    return valid(node.left, low, node.val) and valid(node.right, node.val, high)

def is_valid(root):
    return valid(root, None, None)
`,
      bugs: { 10: { was: 'if (low is not None and node.val <= low) or (high is not None and node.val >= high):', buggy: '    if (low is not None and node.val <= low) and (high is not None and node.val >= high):' } },
    },
    c: {
      correct: `
#include <limits.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

int valid(struct TreeNode *node, long long low, long long high) {
    if (node == 0) return 1;
    if (node->val <= low || node->val >= high) return 0;
    return valid(node->left, low, node->val) && valid(node->right, node->val, high);
}

int is_valid(struct TreeNode *root) {
    return valid(root, LLONG_MIN, LLONG_MAX);
}
`,
      bugs: { 6: { was: 'if (node->val <= low || node->val >= high) return 0;', buggy: 'if (node->val <= low && node->val >= high) return 0;' } },
    },
  },
});
