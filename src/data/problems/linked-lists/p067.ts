import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p067",
  title: "Equal values are mistaken for a shared node",
  difficulty: "Medium",
  topic: "Linked Lists",
  subtopic: "Intersection by Node Identity",
  tags: ["Reference Identity", "Two Pointers"],
  bugCategory: "Incorrect Condition",
  sourceInspiredBy: "Intersection of two singly linked lists pattern",
  description: "Return the value at the first node shared by reference by both lists, or -1 if the lists never share a node.",
  constraints: ["The lists may have different lengths.", "Node values are not guaranteed to be unique."],
  examples: [
    { input: "two lists begin with separate 1 nodes and share a 2 node", output: "2" },
    { input: "two separate one-node lists both contain 5", output: "-1" }
  ],
  hints: ["Intersection means the exact same node object, not equal contents.", "Trace two distinct nodes that happen to store the same integer."],
  complexity: { time: "O(m+n)", space: "O(1)" },
  explanation: {
    overview: "Find the first node object that belongs to both singly linked lists.",
    algorithm: "Advance two pointers one step at a time. When a pointer reaches null, redirect it to the other list’s head. Both pointers then travel equal total distances and meet at the shared node or at null.",
    bug: "The loop may stop when the current node values match, even when the node references are different.",
    whyItFails: "Two lists can contain equal values in separate allocations. A shared tail is defined by reference identity and common links, not by matching data.",
    failingTestCase: "Two different head nodes both contain 1 and share a later node containing 2. The correct intersection value is 2; the buggy code stops at the first pair of equal values and returns 1.",
    fix: "Continue until the two node references themselves are identical.",
    whyFixWorks: "Reference equality is true only when both pointers refer to the same allocated node, which is exactly the definition of intersection.",
    dryRun: "Pointer A starts at its own node 1 and pointer B starts at another node 1. Their values match, but their addresses differ. Both advance and eventually meet at the shared node 2.",
    debuggingLesson: "Whenever a task asks whether linked lists intersect, compare node identity rather than payload values."
  },
  testCases: [
    { input: "[1] -> shared [2]", expected: "2" },
    { input: "[5] and [5] separately allocated", expected: "-1" }
  ],
  harness: {
    expected: "2 -1",
    driver: {
      java: "Solution.Node shared=new Solution.Node(2); Solution.Node a=new Solution.Node(1); a.next=shared; Solution.Node b=new Solution.Node(1); b.next=shared; Solution.Node c=new Solution.Node(5), d=new Solution.Node(5); System.out.print(Solution.intersectionValue(a,b)+\" \"+Solution.intersectionValue(c,d));",
      python: "shared=Node(2); a=Node(1); a.next=shared; b=Node(1); b.next=shared; c=Node(5); d=Node(5); print(intersection_value(a,b), intersection_value(c,d))",
      c: "struct Node shared={2,NULL}, a={1,NULL}, b={1,NULL}, c={5,NULL}, d={5,NULL}; a.next=&shared; b.next=&shared; printf(\"%d %d\", intersection_value(&a,&b), intersection_value(&c,&d));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node intersection(Node a, Node b) {
        Node x=a, y=b;
        while (x != y) {
            x = x == null ? b : x.next;
            y = y == null ? a : y.next;
        }
        return x;
    }
    static int intersectionValue(Node a, Node b) { Node n=intersection(a,b); return n==null?-1:n.val; }
}
`,
      bugs: { 5: { was: "while (x != y) {", buggy: "        while (x != y && (x == null || y == null || x.val != y.val)) {" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def intersection_value(a, b):
    x, y = a, b
    while x is not y:
        x = b if x is None else x.next
        y = a if y is None else y.next
    return -1 if x is None else x.val
`,
      bugs: { 7: { was: "while x is not y:", buggy: "    while x is not y and (x is None or y is None or x.val != y.val):" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next; };
struct Node *intersection(struct Node *a, struct Node *b) {
    struct Node *x=a, *y=b;
    while (x != y) {
        x = x == NULL ? b : x->next;
        y = y == NULL ? a : y->next;
    }
    return x;
}
int intersection_value(struct Node *a, struct Node *b) { struct Node *n=intersection(a,b); return n? n->val : -1; }
`,
      bugs: { 4: { was: "while (x != y) {", buggy: "    while (x != y && (x == NULL || y == NULL || x->val != y->val)) {" } },
    }
  },
});
