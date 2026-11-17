import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p055",
  title: "Two targets under one branch pull the answer too high",
  difficulty: "Medium",
  topic: "Trees",
  subtopic: "Lowest Common Ancestor",
  tags: ["Ancestor Queries", "Recursive Search"],
  bugCategory: "Incorrect Recursion Base Case",
  sourceInspiredBy: "Lowest common ancestor in a binary tree pattern",
  description: "Return the lowest node that has both requested values in its subtree. Both values are guaranteed to exist and are distinct.",
  constraints: ["All node values are distinct.", "Both requested values occur in the tree."],
  examples: [
    { input: "root = [1, 2, 3, 4, 5], values = 4 and 5", output: "2" },
    { input: "root = [1, 2, 3], values = 2 and 3", output: "1" }
  ],
  hints: ["A result found in one subtree should be propagated unchanged.", "Compare the case where both searches return non-null with the case where only one does."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Find the deepest node whose descendants include both requested values.",
    algorithm: "Return null for an empty node and return a matching node when either target is reached. Search both children. If both sides return a node, the current node is the common ancestor; otherwise propagate the non-null result.",
    bug: "The combine step returns the current node when either child search succeeds, rather than only when both succeed.",
    whyItFails: "If both targets are located within one child subtree, only one recursive side returns non-null. Returning the current node then skips the deeper answer already found below it.",
    failingTestCase: "For root 1 with left child 2 and children 4 and 5, the lowest common ancestor of 4 and 5 is 2. The buggy code returns 1.",
    fix: "Require both left and right results to be non-null before returning the current node.",
    whyFixWorks: "When only one side contains either target, its recursive result is already the lowest valid ancestor and should be propagated unchanged.",
    dryRun: "At node 2, the search for 4 returns node 4 and the search for 5 returns node 5, so node 2 is returned. At root 1, the left side returns node 2 and the right side is null, so node 2 propagates to the caller.",
    debuggingLesson: "In divide-and-combine recursion, distinguish the condition that creates a new answer from the condition that merely propagates an answer."
  },
  testCases: [
    { input: "[1,2,3,4,5], 4, 5", expected: "2" },
    { input: "[1,2,3], 2, 3", expected: "1" }
  ],
  harness: {
    expected: "2 1",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.left=new Solution.Node(2); a.right=new Solution.Node(3); a.left.left=new Solution.Node(4); a.left.right=new Solution.Node(5); Solution.Node b=new Solution.Node(1); b.left=new Solution.Node(2); b.right=new Solution.Node(3); System.out.print(Solution.lca(a,4,5).val+\" \"+Solution.lca(b,2,3).val);",
      python: "a=Node(1); a.left=Node(2); a.right=Node(3); a.left.left=Node(4); a.left.right=Node(5); b=Node(1); b.left=Node(2); b.right=Node(3); print(lca(a,4,5).val, lca(b,2,3).val)",
      c: "struct Node a={1,NULL,NULL}, a2={2,NULL,NULL}, a3={3,NULL,NULL}, a4={4,NULL,NULL}, a5={5,NULL,NULL}; a.left=&a2; a.right=&a3; a2.left=&a4; a2.right=&a5; struct Node b={1,NULL,NULL}, b2={2,NULL,NULL}, b3={3,NULL,NULL}; b.left=&b2; b.right=&b3; printf(\"%d %d\", lca(&a,4,5)->val, lca(&b,2,3)->val);"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static Node lca(Node n, int a, int b) {
        if (n == null || n.val == a || n.val == b) return n;
        Node left = lca(n.left, a, b);
        Node right = lca(n.right, a, b);
        if (left != null && right != null) return n;
        return left != null ? left : right;
    }
}
`,
      bugs: { 7: { was: "if (left != null && right != null) return n;", buggy: "        if (left != null || right != null) return n;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def lca(node, a, b):
    if node is None or node.val == a or node.val == b:
        return node
    left = lca(node.left, a, b)
    right = lca(node.right, a, b)
    if left is not None and right is not None:
        return node
    return left if left is not None else right
`,
      bugs: { 10: { was: "if left is not None and right is not None:", buggy: "    if left is not None or right is not None:" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
struct Node *lca(struct Node *n, int a, int b) {
    if (n == NULL || n->val == a || n->val == b) return n;
    struct Node *left = lca(n->left, a, b);
    struct Node *right = lca(n->right, a, b);
    if (left != NULL && right != NULL) return n;
    return left != NULL ? left : right;
}
`,
      bugs: { 8: { was: "if (left != NULL && right != NULL) return n;", buggy: "    if (left != NULL || right != NULL) return n;" } },
    }
  },
});
