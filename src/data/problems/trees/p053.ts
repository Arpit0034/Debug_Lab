import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p053",
  title: "A shortcut is used before the shape is proven",
  difficulty: "Medium",
  topic: "Trees",
  subtopic: "Counting Nodes in a Complete Tree",
  tags: ["Complete Trees", "Height Comparison"],
  bugCategory: "Incorrect Algorithm Selection",
  sourceInspiredBy: "Node count in a complete binary tree pattern",
  description: "Return the number of nodes in a complete binary tree.",
  constraints: ["The input is guaranteed to be complete.", "The tree height is at most 20."],
  examples: [
    { input: "root = [1, 2, 3, 4, 5]", output: "5" },
    { input: "root = [1, 2, 3]", output: "3" }
  ],
  hints: ["Equal extreme heights certify a perfect shape; unequal heights do not.", "Trace a complete tree whose last level is only partly filled."],
  complexity: { time: "O(log² n)", space: "O(log n)" },
  explanation: {
    overview: "Count all nodes in a complete binary tree.",
    algorithm: "Measure the leftmost and rightmost heights. When they match, the tree is perfect and its node count follows the full-level formula. Otherwise count the root and recurse into both children.",
    bug: "The perfect-tree shortcut is selected when the two heights differ.",
    whyItFails: "Different extreme heights mean the tree is not perfect, so the full-level formula may count nodes that are not present.",
    failingTestCase: "The complete tree with root 1, children 2 and 3, and children 4 and 5 has 5 nodes; the buggy shortcut returns 7.",
    fix: "Use the closed-form count only when leftmost and rightmost heights are equal.",
    whyFixWorks: "Equal extreme heights in a complete tree mean every level is full. Otherwise recursive counting inspects the partially filled final level.",
    dryRun: "For the five-node tree, the leftmost height is 3 and the rightmost height is 2. Since they differ, count 1 for the root and recurse into subtrees: 3 nodes on the left and 1 on the right, yielding 5.",
    debuggingLesson: "An optimization shortcut needs a proven precondition; test the precondition before applying its formula."
  },
  testCases: [
    { input: "[1,2,3,4,5]", expected: "5" },
    { input: "[1,2,3]", expected: "3" }
  ],
  harness: {
    expected: "5 3",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.left=new Solution.Node(2); a.right=new Solution.Node(3); a.left.left=new Solution.Node(4); a.left.right=new Solution.Node(5); Solution.Node b=new Solution.Node(1); b.left=new Solution.Node(2); b.right=new Solution.Node(3); System.out.print(Solution.countComplete(a)+\" \"+Solution.countComplete(b));",
      python: "a=Node(1); a.left=Node(2); a.right=Node(3); a.left.left=Node(4); a.left.right=Node(5); b=Node(1); b.left=Node(2); b.right=Node(3); print(count_complete(a), count_complete(b))",
      c: "struct Node a={1,NULL,NULL}, a2={2,NULL,NULL}, a3={3,NULL,NULL}, a4={4,NULL,NULL}, a5={5,NULL,NULL}; a.left=&a2; a.right=&a3; a2.left=&a4; a2.right=&a5; struct Node b={1,NULL,NULL}, b2={2,NULL,NULL}, b3={3,NULL,NULL}; b.left=&b2; b.right=&b3; printf(\"%d %d\", count_complete(&a), count_complete(&b));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int leftHeight(Node n) { int h=0; while(n!=null){ h++; n=n.left; } return h; }
    static int rightHeight(Node n) { int h=0; while(n!=null){ h++; n=n.right; } return h; }
    static int countComplete(Node n) {
        if (n == null) return 0;
        int l = leftHeight(n), r = rightHeight(n);
        if (l == r) return (1 << l) - 1;
        return 1 + countComplete(n.left) + countComplete(n.right);
    }
}
`,
      bugs: { 8: { was: "if (l == r) return (1 << l) - 1;", buggy: "        if (l != r) return (1 << l) - 1;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def count_complete(node):
    if node is None:
        return 0
    left = node
    right = node
    lh = rh = 0
    while left:
        lh += 1
        left = left.left
    while right:
        rh += 1
        right = right.right
    if lh == rh:
        return (1 << lh) - 1
    return 1 + count_complete(node.left) + count_complete(node.right)
`,
      bugs: { 17: { was: "if lh == rh:", buggy: "    if lh != rh:" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
int left_height(struct Node *n) { int h=0; while(n){ h++; n=n->left; } return h; }
int right_height(struct Node *n) { int h=0; while(n){ h++; n=n->right; } return h; }
int count_complete(struct Node *n) {
    if (n == NULL) return 0;
    int l = left_height(n), r = right_height(n);
    if (l == r) return (1 << l) - 1;
    return 1 + count_complete(n->left) + count_complete(n->right);
}
`,
      bugs: { 8: { was: "if (l == r) return (1 << l) - 1;", buggy: "    if (l != r) return (1 << l) - 1;" } },
    }
  },
});
