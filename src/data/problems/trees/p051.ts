import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p051",
  title: "A partial route is accepted as a complete journey",
  difficulty: "Medium",
  topic: "Trees",
  subtopic: "Root-to-Leaf Target Sum",
  tags: ["Root-to-Leaf Paths", "Recursion"],
  bugCategory: "Incorrect Recursion Base Case",
  sourceInspiredBy: "Root-to-leaf path sum existence pattern",
  description: "Return 1 if at least one complete route from the root to a leaf has values that add to the target, and 0 otherwise.",
  constraints: ["The tree may be empty.", "Node values and target are between -10000 and 10000."],
  examples: [
    { input: "root = [1, 2, 3], target = 3", output: "1" },
    { input: "root = [1, 2], target = 1", output: "0" }
  ],
  hints: ["The requested route must finish at a node with no children.", "Check what happens when the target is already reached at a node that still has a child."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Determine whether a root-to-leaf route has exactly the requested total.",
    algorithm: "Reject an empty subtree. At a leaf, compare its value with the remaining target. At an internal node, subtract its value and search either child.",
    bug: "The base condition treats any node with at least one missing child as a leaf.",
    whyItFails: "A one-child node can still continue along its existing child. Returning at that point can accept a partial route that has not reached a leaf.",
    failingTestCase: "For root 1 with left child 2 and target 1, the buggy routine returns 1 immediately at the root, while no root-to-leaf route totals 1.",
    fix: "Use the leaf condition that requires both children to be absent.",
    whyFixWorks: "The target is checked only after the route has reached its actual endpoint; internal nodes always pass the remaining total downward.",
    dryRun: "For root 1 and target 3, the remaining value is 2 after visiting the root. The left leaf 2 matches, so the answer is true. For target 1 on the same one-child shape, the root is not a leaf; its child receives remaining value 0 and fails.",
    debuggingLesson: "In recursive path problems, distinguish reaching a valid endpoint from merely running out of one branch."
  },
  testCases: [
    { input: "[1,2,3], 3", expected: "1" },
    { input: "[1,2], 1", expected: "0" }
  ],
  harness: {
    expected: "1 0",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.left=new Solution.Node(2); a.right=new Solution.Node(3); Solution.Node b=new Solution.Node(1); b.left=new Solution.Node(2); System.out.print((Solution.hasPathSum(a,3)?1:0)+\" \"+(Solution.hasPathSum(b,1)?1:0));",
      python: "a=Node(1); a.left=Node(2); a.right=Node(3); b=Node(1); b.left=Node(2); print(int(has_path_sum(a,3)), int(has_path_sum(b,1)))",
      c: "struct Node a={1,NULL,NULL}, a2={2,NULL,NULL}, a3={3,NULL,NULL}; a.left=&a2; a.right=&a3; struct Node b={1,NULL,NULL}, b2={2,NULL,NULL}; b.left=&b2; printf(\"%d %d\", has_path_sum(&a,3), has_path_sum(&b,1));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
// Keep this step explicit for line-by-line tracing.
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static boolean hasPathSum(Node n, int target) {
        if (n == null) return false;
        if (n.left == null && n.right == null) return n.val == target;
        int rest = target - n.val;
        return hasPathSum(n.left, rest) || hasPathSum(n.right, rest);
    }
}
`,
      bugs: { 6: { was: "if (n.left == null && n.right == null)", buggy: "        if (n.left == null || n.right == null) return n.val == target;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def has_path_sum(node, target):
    if node is None:
        return False
    if node.left is None and node.right is None:
        return node.val == target
    rest = target - node.val
    return has_path_sum(node.left, rest) or has_path_sum(node.right, rest)
`,
      bugs: { 8: { was: "if node.left is None and node.right is None:", buggy: "    if node.left is None or node.right is None:" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
int has_path_sum(struct Node *n, int target) {
    if (n == NULL) return 0;
    if (n->left == NULL && n->right == NULL) return n->val == target;
    int rest = target - n->val;
    return has_path_sum(n->left, rest) || has_path_sum(n->right, rest);
}
`,
      bugs: { 7: { was: "if (n->left == NULL && n->right == NULL)", buggy: "    if (n->left == NULL || n->right == NULL) return n->val == target;" } },
    }
  },
});
