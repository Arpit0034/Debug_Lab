import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p056",
  title: "The longest route is reduced to a single branch",
  difficulty: "Medium",
  topic: "Trees",
  subtopic: "Binary Tree Diameter",
  tags: ["Tree Diameter", "Postorder Aggregation"],
  bugCategory: "Incorrect Tree Traversal Logic",
  sourceInspiredBy: "Binary tree diameter via subtree heights pattern",
  description: "Return the number of edges on the longest path between any two nodes in the tree.",
  constraints: ["The tree has at least one node.", "The tree contains at most 100000 nodes."],
  examples: [
    { input: "root = [1, 2, 3, null, 4]", output: "3" },
    { input: "root = [2, 1, 3]", output: "2" }
  ],
  hints: ["A longest path may use two child branches of the same node.", "Compare the best route through a node with the height of only one side."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Find the largest edge count among all paths whose endpoints may be any two nodes.",
    algorithm: "Compute subtree heights bottom-up. At each node, a path passing through it uses the left height plus the right height. Keep the maximum such sum and return one plus the larger height to the parent.",
    bug: "The global best is updated using only the larger child height.",
    whyItFails: "The diameter passing through a node can enter through one child and leave through the other. Looking at only one branch measures height, not the full through-node path.",
    failingTestCase: "For root 1 with left child 2 and 2.right = 4, plus right child 3, the longest route is 4–2–1–3 with 3 edges; the buggy result is 2.",
    fix: "Update the best diameter with left height plus right height.",
    whyFixWorks: "The two subtree heights count the edges extending from the current node into each side, so their sum is the complete path through that node.",
    dryRun: "At node 2, left height is 0 and right height is 1, so the through-path length is 1. At root 1, left height is 2 and right height is 1, giving 2 + 1 = 3 edges.",
    debuggingLesson: "For path problems, distinguish a one-sided value returned to a parent from a complete path candidate evaluated locally."
  },
  testCases: [
    { input: "[1,2,3,null,4]", expected: "3" },
    { input: "[2,1,3]", expected: "2" }
  ],
  harness: {
    expected: "3 2",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.left=new Solution.Node(2); a.right=new Solution.Node(3); a.left.right=new Solution.Node(4); Solution.Node b=new Solution.Node(2); b.left=new Solution.Node(1); b.right=new Solution.Node(3); System.out.print(Solution.diameter(a)+\" \"+Solution.diameter(b));",
      python: "a=Node(1); a.left=Node(2); a.right=Node(3); a.left.right=Node(4); b=Node(2); b.left=Node(1); b.right=Node(3); print(diameter(a), diameter(b))",
      c: "struct Node a={1,NULL,NULL}, a2={2,NULL,NULL}, a3={3,NULL,NULL}, a4={4,NULL,NULL}; a.left=&a2; a.right=&a3; a2.right=&a4; struct Node b={2,NULL,NULL}, b1={1,NULL,NULL}, b3={3,NULL,NULL}; b.left=&b1; b.right=&b3; printf(\"%d %d\", diameter(&a), diameter(&b));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int height(Node n, int[] best) {
        if (n == null) return 0;
        int left = height(n.left, best), right = height(n.right, best);
        best[0] = Math.max(best[0], left + right);
        return 1 + Math.max(left, right);
    }
    static int diameter(Node root) { int[] best = {0}; height(root, best); return best[0]; }
}
`,
      bugs: { 6: { was: "best[0] = Math.max(best[0], left + right);", buggy: "        best[0] = Math.max(best[0], Math.max(left, right));" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def diameter(root):
    best = [0]
    def height(node):
        if node is None:
            return 0
        left = height(node.left)
        right = height(node.right)
        best[0] = max(best[0], left + right)
        return 1 + max(left, right)
    height(root)
    return best[0]
`,
      bugs: { 12: { was: "best[0] = max(best[0], left + right)", buggy: "        best[0] = max(best[0], max(left, right))" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
int height(struct Node *n, int *best) {
    if (n == NULL) return 0;
    int left = height(n->left, best), right = height(n->right, best);
    int through = left + right;
    if (through > *best) *best = through;
    return 1 + (left > right ? left : right);
}
int diameter(struct Node *root) { int best=0; height(root, &best); return best; }
`,
      bugs: { 6: { was: "int through = left + right;", buggy: "    int through = left > right ? left : right;" } },
    }
  },
});
