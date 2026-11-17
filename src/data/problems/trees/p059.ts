import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p059",
  title: "Two failed subtrees cancel each other out",
  difficulty: "Hard",
  topic: "Trees",
  subtopic: "Height-Balanced Tree Validation",
  tags: ["Balance Invariant", "Sentinel Propagation"],
  bugCategory: "Incorrect Edge-case Handling",
  sourceInspiredBy: "Height-balanced binary tree validation pattern",
  description: "Return 1 if, at every node, the heights of its two child subtrees differ by at most one; otherwise return 0.",
  constraints: ["The tree contains at most 100000 nodes.", "The tree may be empty."],
  examples: [
    { input: "root has two long one-sided chains", output: "0" },
    { input: "root has two leaf children", output: "1" }
  ],
  hints: ["A negative height is used to signal that a descendant is already unbalanced.", "Check what happens if both child calls return the sentinel value."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Verify the height constraint at every node, not just at the root.",
    algorithm: "Compute heights bottom-up. Return a special negative value when a subtree is unbalanced. A parent must propagate that sentinel immediately; otherwise it checks the absolute height difference and returns its own height.",
    bug: "The parent checks only the difference between the returned heights and does not propagate a negative sentinel from either child.",
    whyItFails: "If both children are already unbalanced, both can return -1. Their difference is zero, so the parent mistakenly treats them as balanced and returns a valid-looking height.",
    failingTestCase: "When each side of the root is a one-sided chain of four nodes, both child computations return -1. The buggy root sees an absolute difference of zero and returns true.",
    fix: "Treat either negative child height as an immediate failure before comparing the heights.",
    whyFixWorks: "The sentinel represents a violation anywhere below the current node. Propagating it preserves the fact that the whole subtree is unbalanced.",
    dryRun: "The left chain is too deep and returns -1. The right chain is also too deep and returns -1. Correct logic sees a sentinel and returns -1 at the root. Buggy logic calculates abs(-1 - -1) = 0 and returns height 0.",
    debuggingLesson: "When recursion uses a sentinel to encode failure, check and propagate the sentinel explicitly; arithmetic on sentinel values can hide errors."
  },
  testCases: [
    { input: "root with two unbalanced depth-4 chains", expected: "0" },
    { input: "[10,9,11]", expected: "1" }
  ],
  harness: {
    expected: "0 1",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.left=new Solution.Node(2); a.left.left=new Solution.Node(3); a.left.left.left=new Solution.Node(4); a.right=new Solution.Node(5); a.right.right=new Solution.Node(6); a.right.right.right=new Solution.Node(7); Solution.Node b=new Solution.Node(10); b.left=new Solution.Node(9); b.right=new Solution.Node(11); System.out.print((Solution.isBalanced(a)?1:0)+\" \"+(Solution.isBalanced(b)?1:0));",
      python: "a=Node(1); a.left=Node(2); a.left.left=Node(3); a.left.left.left=Node(4); a.right=Node(5); a.right.right=Node(6); a.right.right.right=Node(7); b=Node(10); b.left=Node(9); b.right=Node(11); print(int(is_balanced(a)), int(is_balanced(b)))",
      c: "struct Node a={1,NULL,NULL}, a2={2,NULL,NULL}, a3={3,NULL,NULL}, a4={4,NULL,NULL}, a5={5,NULL,NULL}, a6={6,NULL,NULL}, a7={7,NULL,NULL}; a.left=&a2; a2.left=&a3; a3.left=&a4; a.right=&a5; a5.right=&a6; a6.right=&a7; struct Node b={10,NULL,NULL}, b9={9,NULL,NULL}, b11={11,NULL,NULL}; b.left=&b9; b.right=&b11; printf(\"%d %d\", is_balanced(&a), is_balanced(&b));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int height(Node n) {
        if (n == null) return 0;
        int left = height(n.left), right = height(n.right);
        if (left == -1 || right == -1 || Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }
    static boolean isBalanced(Node root) { return height(root) != -1; }
}
`,
      bugs: { 6: { was: "if (left == -1 || right == -1 || Math.abs(left - right) > 1) return -1;", buggy: "        if (Math.abs(left - right) > 1) return -1;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def is_balanced(root):
    def height(node):
        if node is None:
            return 0
        left = height(node.left)
        right = height(node.right)
        if left == -1 or right == -1 or abs(left - right) > 1:
            return -1
        return 1 + max(left, right)
    return height(root) != -1
`,
      bugs: { 11: { was: "if left == -1 or right == -1 or abs(left - right) > 1:", buggy: "        if abs(left - right) > 1:" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
int height(struct Node *n) {
    if (n == NULL) return 0;
    int left = height(n->left), right = height(n->right);
    if (left == -1 || right == -1 || abs(left - right) > 1) return -1;
    return 1 + (left > right ? left : right);
}
int is_balanced(struct Node *root) { return height(root) != -1; }
`,
      bugs: { 7: { was: "if (left == -1 || right == -1 || abs(left - right) > 1) return -1;", buggy: "    if (abs(left - right) > 1) return -1;" } },
    }
  },
});
