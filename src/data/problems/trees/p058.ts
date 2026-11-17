import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p058",
  title: "Digits are accumulated without shifting the earlier places",
  difficulty: "Medium",
  topic: "Trees",
  subtopic: "Root-to-Leaf Number Sum",
  tags: ["Digit Paths", "Recursive Accumulation"],
  bugCategory: "Incorrect DP Transition",
  sourceInspiredBy: "Sum of root-to-leaf numbers pattern",
  description: "Each root-to-leaf route spells a decimal number. Return the sum of all such numbers.",
  constraints: ["Each node value is a digit from 0 through 9.", "The tree has at least one node."],
  examples: [
    { input: "root = [1, 2, 3]", output: "25" },
    { input: "root = [4, 5]", output: "45" }
  ],
  hints: ["Appending a digit changes the place value of every digit already accumulated.", "Trace the path 1 → 2 and compare the result with the integer 12."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Interpret each root-to-leaf path as a decimal number and add all path values.",
    algorithm: "Carry the number formed so far down the tree. When visiting a digit, multiply the previous prefix by ten and add the new digit. Return the completed value at a leaf; otherwise add both child results.",
    bug: "The new digit is added to the prefix without shifting the previous digits one decimal place.",
    whyItFails: "A path such as 1 → 2 represents 12, not 1 + 2. Without multiplication by ten, the positional value of the earlier digit is lost.",
    failingTestCase: "For root 1 with leaves 2 and 3, the correct sum is 12 + 13 = 25; the buggy code returns 3 + 4 = 7.",
    fix: "Compute the next prefix as prefix * 10 + node value.",
    whyFixWorks: "Multiplication by ten shifts the existing digits left before the new digit is appended in the ones place.",
    dryRun: "At root 1, prefix becomes 1. At leaf 2, the value becomes 1 * 10 + 2 = 12. At leaf 3 it becomes 13. Their sum is 25.",
    debuggingLesson: "When building numbers digit by digit, reason about place value rather than treating digits as ordinary additive values."
  },
  testCases: [
    { input: "[1,2,3]", expected: "25" },
    { input: "[4,5]", expected: "45" }
  ],
  harness: {
    expected: "25 45",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.left=new Solution.Node(2); a.right=new Solution.Node(3); Solution.Node b=new Solution.Node(4); b.left=new Solution.Node(5); System.out.print(Solution.sumRootNumbers(a,0)+\" \"+Solution.sumRootNumbers(b,0));",
      python: "a=Node(1); a.left=Node(2); a.right=Node(3); b=Node(4); b.left=Node(5); print(sum_root_numbers(a,0), sum_root_numbers(b,0))",
      c: "struct Node a={1,NULL,NULL}, a2={2,NULL,NULL}, a3={3,NULL,NULL}; a.left=&a2; a.right=&a3; struct Node b={4,NULL,NULL}, b5={5,NULL,NULL}; b.left=&b5; printf(\"%d %d\", sum_root_numbers(&a,0), sum_root_numbers(&b,0));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
// Keep this step explicit for line-by-line tracing.
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int sumRootNumbers(Node n, int prefix) {
        if (n == null) return 0;
        int value = prefix * 10 + n.val;
        if (n.left == null && n.right == null) return value;
        return sumRootNumbers(n.left, value) + sumRootNumbers(n.right, value);
    }
}
`,
      bugs: { 6: { was: "int value = prefix * 10 + n.val;", buggy: "        int value = prefix + n.val;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def sum_root_numbers(node, prefix):
    if node is None:
        return 0
    value = prefix * 10 + node.val
    if node.left is None and node.right is None:
        return value
    return sum_root_numbers(node.left, value) + sum_root_numbers(node.right, value)
`,
      bugs: { 8: { was: "value = prefix * 10 + node.val", buggy: "    value = prefix + node.val" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
int sum_root_numbers(struct Node *n, int prefix) {
    if (n == NULL) return 0;
    int value = prefix * 10 + n->val;
    if (n->left == NULL && n->right == NULL) return value;
    return sum_root_numbers(n->left, value) + sum_root_numbers(n->right, value);
}
`,
      bugs: { 7: { was: "int value = prefix * 10 + n->val;", buggy: "    int value = prefix + n->val;" } },
    }
  },
});
