import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p060",
  title: "The test is applied to the node instead of its parent",
  difficulty: "Medium",
  topic: "Trees",
  subtopic: "Nodes with Even-Valued Parents",
  tags: ["Parent State", "Tree Aggregation"],
  bugCategory: "Incorrect Condition",
  sourceInspiredBy: "Sum of nodes with an even-valued parent pattern",
  description: "Return the sum of values of all nodes whose immediate parent has an even value. The root has no parent and is not included.",
  constraints: ["The tree has at most 100000 nodes.", "Node values may be negative."],
  examples: [
    { input: "root = [2, 3, 4, null, 6]", output: "7" },
    { input: "root = [1, 2]", output: "0" }
  ],
  hints: ["The condition concerns the parent value, not the current value.", "Track the parity state passed into a child call."],
  complexity: { time: "O(n)", space: "O(h)" },
  explanation: {
    overview: "Add nodes selected by the parity of their immediate parent.",
    algorithm: "Carry a boolean that says whether the current node has an even parent. Add the current node when that state is true, then pass the current node parity to its children.",
    bug: "The current node value is tested for evenness instead of using the parent-parity state.",
    whyItFails: "A node can be even while its parent is odd, or odd while its parent is even. The requested property belongs to the relationship between adjacent nodes.",
    failingTestCase: "For root 2 with children 3 and 4, only the children are selected, so the result is 7. The buggy routine adds even-valued nodes 2 and 4 instead.",
    fix: "Use the boolean state that describes whether the parent is even.",
    whyFixWorks: "Each recursive call receives the parity of its direct parent, so the current contribution is based on exactly the requested relationship.",
    dryRun: "Root 2 is called with evenParent=false and contributes nothing. It passes true to children 3 and 4. Both are added, giving 3 + 4 = 7. Node 6 under 3 receives false and is not added.",
    debuggingLesson: "When a rule depends on a parent or neighbour, pass that related state explicitly rather than recomputing the condition from the current item."
  },
  testCases: [
    { input: "[2,3,4,null,6]", expected: "7" },
    { input: "[1,2]", expected: "0" }
  ],
  harness: {
    expected: "7 0",
    driver: {
      java: "Solution.Node a=new Solution.Node(2); a.left=new Solution.Node(3); a.right=new Solution.Node(4); a.left.right=new Solution.Node(6); Solution.Node b=new Solution.Node(1); b.left=new Solution.Node(2); System.out.print(Solution.sumEvenParent(a,false)+\" \"+Solution.sumEvenParent(b,false));",
      python: "a=Node(2); a.left=Node(3); a.right=Node(4); a.left.right=Node(6); b=Node(1); b.left=Node(2); print(sum_even_parent(a,False), sum_even_parent(b,False))",
      c: "struct Node a={2,NULL,NULL}, a3={3,NULL,NULL}, a4={4,NULL,NULL}, a6={6,NULL,NULL}; a.left=&a3; a.right=&a4; a3.right=&a6; struct Node b={1,NULL,NULL}, b2={2,NULL,NULL}; b.left=&b2; printf(\"%d %d\", sum_even_parent(&a,0), sum_even_parent(&b,0));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
// Keep this step explicit for line-by-line tracing.
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int sumEvenParent(Node n, boolean evenParent) {
        if (n == null) return 0;
        int total = evenParent ? n.val : 0;
        boolean currentEven = n.val % 2 == 0;
        return total + sumEvenParent(n.left, currentEven) + sumEvenParent(n.right, currentEven);
    }
}
`,
      bugs: { 6: { was: "int total = evenParent ? n.val : 0;", buggy: "        int total = n.val % 2 == 0 ? n.val : 0;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def sum_even_parent(node, even_parent):
    if node is None:
        return 0
    total = node.val if even_parent else 0
    current_even = node.val % 2 == 0
    return total + sum_even_parent(node.left, current_even) + sum_even_parent(node.right, current_even)
`,
      bugs: { 8: { was: "total = node.val if even_parent else 0", buggy: "    total = node.val if node.val % 2 == 0 else 0" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
/* Keep this step explicit for line-by-line tracing. */
int sum_even_parent(struct Node *n, int even_parent) {
    if (n == NULL) return 0;
    int total = even_parent ? n->val : 0;
    int current_even = (n->val % 2 == 0);
    return total + sum_even_parent(n->left, current_even) + sum_even_parent(n->right, current_even);
}
`,
      bugs: { 7: { was: "int total = even_parent ? n->val : 0;", buggy: "    int total = n->val % 2 == 0 ? n->val : even_parent * 0;" } },
    }
  },
});
