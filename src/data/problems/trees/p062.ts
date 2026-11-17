import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p062",
  title: "The weaker child is carried into the next level",
  difficulty: "Hard",
  topic: "Trees",
  subtopic: "Maximum Path Sum",
  tags: ["Tree Dynamic Programming", "Negative Values"],
  bugCategory: "Incorrect DP Transition",
  sourceInspiredBy: "Maximum path sum in a binary tree pattern",
  description: "Return the largest sum over any non-empty path in the tree. A path may start and end at any nodes.",
  constraints: ["The tree has at least one node.", "Node values are between -10000 and 10000."],
  examples: [
    { input: "root = [50, 4, null, 1, 10]", output: "64" },
    { input: "root = [-3, -5]", output: "-3" }
  ],
  hints: ["A value returned to the parent can extend through only one child.", "Compare the best downward extension when the two child gains differ."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Find the maximum-sum path anywhere in the tree, including paths that use two child branches at one node.",
    algorithm: "For each node, clamp child gains at zero, update the global answer using the node plus both gains, and return the node plus the larger gain to its parent.",
    bug: "The recursive return chooses the smaller of the two child gains instead of the larger one.",
    whyItFails: "A path extending upward may use only one child, and it should choose the more valuable branch. Carrying the weaker branch reduces the gain available to ancestors.",
    failingTestCase: "For root 50 with left child 4 and grandchildren 1 and 10, the best path is 10–4–50 with sum 64. The buggy return carries 4 + 1 instead of 4 + 10 and returns 55.",
    fix: "Return the node value plus the larger non-negative child gain.",
    whyFixWorks: "A downward path can include only one child branch, so selecting the larger gain maximizes what the parent can extend. The global candidate still combines both sides.",
    dryRun: "At node 4, the child gains are 1 and 10. Its best downward gain is 4 + 10 = 14. At root 50, extending through that branch gives 50 + 14 = 64. The node-local through-path candidate is also considered separately.",
    debuggingLesson: "In tree dynamic programming, identify exactly what a recursive return represents; a parent extension usually has different constraints from a complete local answer."
  },
  testCases: [
    { input: "[50,4,null,1,10]", expected: "64" },
    { input: "[-3,-5]", expected: "-3" }
  ],
  harness: {
    expected: "64 -3",
    driver: {
      java: "Solution.Node a=new Solution.Node(50); a.left=new Solution.Node(4); a.left.left=new Solution.Node(1); a.left.right=new Solution.Node(10); Solution.Node b=new Solution.Node(-3); b.left=new Solution.Node(-5); System.out.print(Solution.maxPathSum(a)+\" \"+Solution.maxPathSum(b));",
      python: "a=Node(50); a.left=Node(4); a.left.left=Node(1); a.left.right=Node(10); b=Node(-3); b.left=Node(-5); print(max_path_sum(a), max_path_sum(b))",
      c: "struct Node a={50,NULL,NULL}, a4={4,NULL,NULL}, a1={1,NULL,NULL}, a10={10,NULL,NULL}; a.left=&a4; a4.left=&a1; a4.right=&a10; struct Node b={-3,NULL,NULL}, b5={-5,NULL,NULL}; b.left=&b5; printf(\"%d %d\", max_path_sum(&a), max_path_sum(&b));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int gain(Node n, int[] best) {
        if (n == null) return 0;
        int left = Math.max(0, gain(n.left, best));
        int right = Math.max(0, gain(n.right, best));
        best[0] = Math.max(best[0], n.val + left + right);
        return n.val + Math.max(left, right);
    }
    static int maxPathSum(Node root) { int[] best = {Integer.MIN_VALUE}; gain(root, best); return best[0]; }
}
`,
      bugs: { 8: { was: "return n.val + Math.max(left, right);", buggy: "        return n.val + Math.min(left, right);" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def max_path_sum(root):
    best = [float('-inf')]
    def gain(node):
        if node is None:
            return 0
        left = max(0, gain(node.left))
        right = max(0, gain(node.right))
        best[0] = max(best[0], node.val + left + right)
        return node.val + max(left, right)
    gain(root)
    return int(best[0])
`,
      bugs: { 13: { was: "return node.val + max(left, right)", buggy: "        return node.val + min(left, right)" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
int gain(struct Node *n, int *best) {
    if (n == NULL) return 0;
    int left = gain(n->left, best), right = gain(n->right, best);
    if (left < 0) left = 0;
    if (right < 0) right = 0;
    int through = n->val + left + right;
    if (through > *best) *best = through;
    return n->val + (left > right ? left : right);
}
int max_path_sum(struct Node *root) { int best=-2147483647; gain(root, &best); return best; }
`,
      bugs: { 9: { was: "return n->val + (left > right ? left : right);", buggy: "    return n->val + (left < right ? left : right);" } },
    }
  },
});
