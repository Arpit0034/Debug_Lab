import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p069",
  title: "The cursor resumes from the wrong node after each swap",
  difficulty: "Medium",
  topic: "Linked Lists",
  subtopic: "Swap Adjacent Pairs",
  tags: ["Singly Linked List", "Pair Rewiring"],
  bugCategory: "Incorrect Pointer Manipulation",
  sourceInspiredBy: "Swap nodes in pairs without changing node values pattern",
  description: "Swap every adjacent pair of nodes and return the decimal signature formed by their values in order.",
  constraints: ["The list may be empty.", "Node values are single digits from 0 through 9."],
  examples: [
    { input: "head = [1, 2, 3, 4]", output: "2143" },
    { input: "head = [5, 6, 7]", output: "657" }
  ],
  hints: ["After a pair is swapped, the old first node becomes the tail of that pair.", "Trace the predecessor used to begin the next pair."],
  complexity: { time: "O(n)", space: "O(1)" },
  explanation: {
    overview: "Reorder nodes by swapping positions 1–2, 3–4, and so on, leaving a final unpaired node in place.",
    algorithm: "Use a dummy predecessor. For each pair, link the second node before the first, connect the old first node to the remainder, and make the old first node the predecessor for the next pair.",
    bug: "The predecessor advances to the new first node of the pair instead of the old first node, which is now the pair tail.",
    whyItFails: "The next iteration starts inside the already swapped pair. It rewires the wrong region and can change the order of later nodes.",
    failingTestCase: "For [1,2,3,4], the correct order is [2,1,4,3] (signature 2143). The buggy cursor produces [2,3,4,1] (signature 2341).",
    fix: "Advance the predecessor to the old first node after rewiring.",
    whyFixWorks: "The old first node is now immediately before the unswapped suffix, so it is the correct predecessor for the next pair.",
    dryRun: "Swap 1 and 2 to get 2→1→3→4. The predecessor must become node 1. Then swap 3 and 4 to get 2→1→4→3.",
    debuggingLesson: "After pointer rewiring, re-evaluate the roles of the nodes; names such as first and second may no longer match their positions."
  },
  testCases: [
    { input: "[1,2,3,4]", expected: "2143" },
    { input: "[5,6,7]", expected: "657" }
  ],
  harness: {
    expected: "2143 657",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.next=new Solution.Node(2); a.next.next=new Solution.Node(3); a.next.next.next=new Solution.Node(4); Solution.Node b=new Solution.Node(5); b.next=new Solution.Node(6); b.next.next=new Solution.Node(7); System.out.print(Solution.signature(Solution.swapPairs(a))+\" \"+Solution.signature(Solution.swapPairs(b)));",
      python: "a=Node(1); a.next=Node(2); a.next.next=Node(3); a.next.next.next=Node(4); b=Node(5); b.next=Node(6); b.next.next=Node(7); print(signature(swap_pairs(a)), signature(swap_pairs(b)))",
      c: "struct Node a={1,NULL}, a2={2,NULL}, a3={3,NULL}, a4={4,NULL}; a.next=&a2; a2.next=&a3; a3.next=&a4; struct Node b={5,NULL}, b6={6,NULL}, b7={7,NULL}; b.next=&b6; b6.next=&b7; printf(\"%d %d\", signature(swap_pairs(&a)), signature(swap_pairs(&b)));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node swapPairs(Node head) {
        Node dummy=new Node(0); dummy.next=head; Node prev=dummy;
        while(prev.next!=null && prev.next.next!=null){
            Node first=prev.next, second=first.next;
            first.next=second.next; second.next=first; prev.next=second;
            prev=first;
        }
        return dummy.next;
    }
    static int signature(Node n) { int s=0; while(n!=null){s=s*10+n.val;n=n.next;} return s; }
}
`,
      bugs: { 8: { was: "prev=first;", buggy: "            prev=second;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def swap_pairs(head):
    dummy = Node(0)
    dummy.next = head
    prev = dummy
    while prev.next is not None and prev.next.next is not None:
        first = prev.next
        second = first.next
        first.next = second.next
        second.next = first
        prev.next = second
        prev = first
    return dummy.next

def signature(node):
    value = 0
    while node is not None:
        value = value * 10 + node.val
        node = node.next
    return value
`,
      bugs: { 15: { was: "prev = first", buggy: "        prev = second" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next; };
struct Node *swap_pairs(struct Node *head) {
    struct Node dummy={0,head}, *prev=&dummy;
    while(prev->next && prev->next->next){
        struct Node *first=prev->next, *second=first->next;
        first->next=second->next; second->next=first; prev->next=second;
        prev=first;
    }
    return dummy.next;
}
int signature(struct Node *n) { int s=0; while(n){s=s*10+n->val;n=n->next;} return s; }
`,
      bugs: { 7: { was: "prev=first;", buggy: "        prev=second;" } },
    }
  },
});
