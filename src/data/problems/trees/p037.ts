import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p037',
  title: 'The longest path loses an edge',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Tree Diameter',
  tags: ['Diameter', 'Height', 'Edge Count'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Diameter of binary tree in edges pattern',
  description:
    'Return the number of edges on the longest path between any two nodes. The code reports one more edge than the true longest path.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 3, 4]', output: '3' },
  ],
  hints: ['For a node, count the edges through it from the left depth and right depth.', 'Check whether the current node itself should add an edge.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Find the largest number of edges on any path.',
    algorithm:
      'For each node compute the height of its left and right sides. A path through the node has left height plus right height edges. Track the maximum and return the taller side plus one to the parent.',
    bug: 'The candidate diameter adds one extra edge.',
    whyItFails:
      'Left and right heights already count the edges from the node to the deepest leaves, so adding one overcounts.',
    failingTestCase: 'root = [1, 2, 3, 4] has a longest path with 3 edges, but the code returns 4.',
    fix: 'Update the best value with left + right, without adding one.',
    whyFixWorks: 'The number of edges through a node is exactly the sum of its two side heights.',
    dryRun:
      'At root 1, left height is 2 and right height is 1, so the path through it has 3 edges. The buggy version records 4.',
    debuggingLesson:
      'Clarify whether a tree metric counts nodes or edges before writing the combine step.',
  },
  testCases: [
    { input: 'root = [1, 2, 3, 4]', expected: '3', buggyOutput: '4' },
  ],
  harness: {
    expected: '3',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); r.left.left = new Solution.TreeNode(4); System.out.println(Solution.diameter(r));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); r.left.left = TreeNode(4); print(diameter(r))`,
      c: `struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}, d={4,0,0}; a.left=&b; a.right=&c; b.left=&d; printf("%d", diameter(&a));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static int best = 0;
    static int depth(TreeNode node) {
        if (node == null) return 0;
        int left = depth(node.left);
        int right = depth(node.right);
        best = Math.max(best, left + right);
        return 1 + Math.max(left, right);
    }
    static int diameter(TreeNode root) {
        best = 0;
        depth(root);
        return best;
    }
}
`,
      bugs: { 8: { was: 'best = Math.max(best, left + right);', buggy: 'best = Math.max(best, left + right + 1);' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

best = 0

def depth(node):
    global best
    if node is None:
        return 0
    left = depth(node.left)
    right = depth(node.right)
    best = max(best, left + right)
    return 1 + max(left, right)

def diameter(root):
    global best
    best = 0
    depth(root)
    return best
`,
      bugs: { 15: { was: 'best = max(best, left + right)', buggy: '    best = max(best, left + right + 1)' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };
int best = 0;
int depth(struct TreeNode *node) {
    if (node == 0) return 0;
    int left = depth(node->left);
    int right = depth(node->right);
    if (left + right > best) best = left + right;
    return 1 + (left > right ? left : right);
}
int diameter(struct TreeNode *root) {
    best = 0;
    depth(root);
    return best;
}
`,
      bugs: { 7: { was: 'if (left + right > best) best = left + right;', buggy: 'if (left + right + 1 > best) best = left + right + 1;' } },
    },
  },
});
