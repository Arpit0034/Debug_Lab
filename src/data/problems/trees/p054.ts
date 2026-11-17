import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p054",
  title: "Repeated values are counted only once per branch",
  difficulty: "Easy",
  topic: "Trees",
  subtopic: "Counting a Target Value",
  tags: ["Duplicate Values", "Tree Recursion"],
  bugCategory: "Incorrect Duplicate Handling",
  sourceInspiredBy: "Count target occurrences in a binary tree pattern",
  description: "Return how many nodes in the tree contain the requested value.",
  constraints: ["Node values and the requested value are integers.", "The tree contains at most 100000 nodes."],
  examples: [
    { input: "root = [4, 4, 4], target = 4", output: "3" },
    { input: "root = [1, 2, 3], target = 1", output: "1" }
  ],
  hints: ["A match at the current node does not rule out matches below it.", "Trace a tree where the root and both children contain the target."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Count every node whose stored value equals the target.",
    algorithm: "For each node, add one when its value matches, then count matches independently in the left and right subtrees.",
    bug: "The matching-node branch returns immediately with one instead of including matches in both child subtrees.",
    whyItFails: "Equal values can appear at several positions in a tree. Returning at the first match abandons all descendants of that node.",
    failingTestCase: "When the root and both children all contain 4, the correct count is 3 but the buggy code returns 1.",
    fix: "After counting the current match, continue recursively into both children.",
    whyFixWorks: "Each node contributes independently, so the result is the current contribution plus the two subtree counts.",
    dryRun: "At the root 4, contribute 1. The left child contributes 1 and its children contribute 0. The right child contributes 1. Total = 1 + 1 + 1 = 3.",
    debuggingLesson: "Do not treat a successful local match as a reason to stop when the task asks for all occurrences."
  },
  testCases: [
    { input: "[4,4,4], 4", expected: "3" },
    { input: "[1,2,3], 1", expected: "1" }
  ],
  harness: {
    expected: "3 1",
    driver: {
      java: "Solution.Node a=new Solution.Node(4); a.left=new Solution.Node(4); a.right=new Solution.Node(4); Solution.Node b=new Solution.Node(1); b.left=new Solution.Node(2); b.right=new Solution.Node(3); System.out.print(Solution.countValue(a,4)+\" \"+Solution.countValue(b,1));",
      python: "a=Node(4); a.left=Node(4); a.right=Node(4); b=Node(1); b.left=Node(2); b.right=Node(3); print(count_value(a,4), count_value(b,1))",
      c: "struct Node a={4,NULL,NULL}, a2={4,NULL,NULL}, a3={4,NULL,NULL}; a.left=&a2; a.right=&a3; struct Node b={1,NULL,NULL}, b2={2,NULL,NULL}, b3={3,NULL,NULL}; b.left=&b2; b.right=&b3; printf(\"%d %d\", count_value(&a,4), count_value(&b,1));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
// Keep this step explicit for line-by-line tracing.
// Keep this step explicit for line-by-line tracing.
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int countValue(Node n, int target) {
        if (n == null) return 0;
        if (n.val == target) return 1 + countValue(n.left, target) + countValue(n.right, target);
        return countValue(n.left, target) + countValue(n.right, target);
    }
}
`,
      bugs: { 7: { was: "return 1 + countValue(n.left, target) + countValue(n.right, target);", buggy: "        if (n.val == target) return 1;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def count_value(node, target):
    if node is None:
        return 0
    if node.val == target:
        return 1 + count_value(node.left, target) + count_value(node.right, target)
    return count_value(node.left, target) + count_value(node.right, target)
`,
      bugs: { 9: { was: "return 1 + count_value(node.left, target) + count_value(node.right, target)", buggy: "        return 1" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
int count_value(struct Node *n, int target) {
    if (n == NULL) return 0;
    if (n->val == target) return 1 + count_value(n->left, target) + count_value(n->right, target);
    return count_value(n->left, target) + count_value(n->right, target);
}
`,
      bugs: { 8: { was: "return 1 + count_value(n->left, target) + count_value(n->right, target);", buggy: "    if (n->val == target) return 1;" } },
    }
  },
});
