import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p052",
  title: "An absent branch masquerades as the shortest leaf",
  difficulty: "Easy",
  topic: "Trees",
  subtopic: "Minimum Depth",
  tags: ["Tree Depth", "Missing Child"],
  bugCategory: "Off-by-one Error",
  sourceInspiredBy: "Minimum depth of a binary tree pattern",
  description: "Return the number of nodes on the shortest route from the root to any leaf.",
  constraints: ["The tree has at least one node.", "The tree contains at most 100000 nodes."],
  examples: [
    { input: "root = [1, null, 2, null, 3]", output: "3" },
    { input: "root = [4, 2, 6]", output: "2" }
  ],
  hints: ["A missing child is not itself a leaf.", "Compare the depth of a one-sided chain with a tree that has two children."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Find the shortest node-count from the root to a real leaf.",
    algorithm: "Return zero for an empty subtree and one for a leaf. If exactly one child is missing, follow the existing child. When both children exist, take the smaller depth and add the current node.",
    bug: "The first special case handles only a leaf instead of every node whose left child is absent.",
    whyItFails: "When a node has no left child but does have a right child, the ordinary minimum expression compares the real right depth with zero and chooses the nonexistent branch.",
    failingTestCase: "For the chain 1 → 2 → 3 using only right children, the correct minimum depth is 3 but the buggy code returns 1.",
    fix: "Handle a missing left child by returning one plus the right-subtree depth.",
    whyFixWorks: "A route must continue through the only existing child; an absent pointer cannot terminate a root-to-leaf route.",
    dryRun: "At node 1, the left child is absent and the right depth is 2. The result is 1 + 2 = 3. At node 2 the result is 1 + 1 = 2, and node 3 is the leaf with depth 1.",
    debuggingLesson: "When taking a minimum over child results, handle missing children before comparing numeric depths."
  },
  testCases: [
    { input: "[1,null,2,null,3]", expected: "3" },
    { input: "[4,2,6]", expected: "2" }
  ],
  harness: {
    expected: "3 2",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.right=new Solution.Node(2); a.right.right=new Solution.Node(3); Solution.Node b=new Solution.Node(4); b.left=new Solution.Node(2); b.right=new Solution.Node(6); System.out.print(Solution.minDepth(a)+\" \"+Solution.minDepth(b));",
      python: "a=Node(1); a.right=Node(2); a.right.right=Node(3); b=Node(4); b.left=Node(2); b.right=Node(6); print(min_depth(a), min_depth(b))",
      c: "struct Node a={1,NULL,NULL}, a2={2,NULL,NULL}, a3={3,NULL,NULL}; a.right=&a2; a2.right=&a3; struct Node b={4,NULL,NULL}, b2={2,NULL,NULL}, b6={6,NULL,NULL}; b.left=&b2; b.right=&b6; printf(\"%d %d\", min_depth(&a), min_depth(&b));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int minDepth(Node n) {
        if (n == null) return 0;
        if (n.left == null && n.right == null) return 1;
        if (n.left == null) return 1 + minDepth(n.right);
        if (n.right == null) return 1 + minDepth(n.left);
        return 1 + Math.min(minDepth(n.left), minDepth(n.right));
    }
}
`,
      bugs: { 6: { was: "if (n.left == null) return 1 + minDepth(n.right);", buggy: "        if (n.left == null && n.right == null) return 1;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def min_depth(node):
    if node is None:
        return 0
    if node.left is None and node.right is None:
        return 1
    if node.left is None:
        return 1 + min_depth(node.right)
    if node.right is None:
        return 1 + min_depth(node.left)
    return 1 + min(min_depth(node.left), min_depth(node.right))
`,
      bugs: { 10: { was: "if node.left is None:", buggy: "    if node.left is None and node.right is None:" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
int min_depth(struct Node *n) {
    if (n == NULL) return 0;
    if (n->left == NULL && n->right == NULL) return 1;
    if (n->left == NULL) return 1 + min_depth(n->right);
    if (n->right == NULL) return 1 + min_depth(n->left);
    int a = min_depth(n->left), b = min_depth(n->right);
    return 1 + (a < b ? a : b);
}
`,
      bugs: { 6: { was: "if (n->left == NULL) return 1 + min_depth(n->right);", buggy: "    if (n->left == NULL && n->right == NULL) return 1;" } },
    }
  },
});
