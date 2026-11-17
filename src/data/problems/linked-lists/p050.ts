import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p050",
  title: "The new tail is connected to the new head",
  difficulty: "Hard",
  topic: "Linked Lists",
  subtopic: "Rotate List Right",
  tags: ["List Rotation", "Cycle Breaking"],
  bugCategory: "Incorrect Pointer Manipulation",
  sourceInspiredBy: "Rotate a singly linked list right by k positions pattern",
  description: "Rotate the list to the right by k positions and return the first five visited values as a decimal signature (or all values if fewer than five).",
  constraints: ["The list may be empty.", "k is non-negative.", "Node values are single digits."],
  examples: [
    { input: "head = [1, 2, 3, 4], k = 1", output: "4123" },
    { input: "head = [5, 6], k = 0", output: "56" }
  ],
  hints: ["Temporarily closing the list into a circle is useful, but the final list must be linear.", "After choosing the new head, identify which pointer should reconnect to the original head."],
  complexity: { time: "O(n)", space: "O(1)" },
  explanation: {
    overview: "Move the final k nodes to the front while keeping the relative order of all nodes.",
    algorithm: "Measure the length and find the original tail. Temporarily connect the tail to the head, locate the new tail at length - (k mod length) - 1, cut after it, and return the following node.",
    bug: "The original tail is connected to the new head rather than the original head after the cut.",
    whyItFails: "The cut is made at the new tail, but connecting the old tail to the returned head creates a self-cycle or a smaller cycle instead of a linear rotated list.",
    failingTestCase: "Rotating [1,2,3,4] right by 1 should produce [4,1,2,3]. The buggy connection makes node 4 point to itself, so the bounded signature is 44444.",
    fix: "Connect the original tail to the original head before returning the new head.",
    whyFixWorks: "The temporary circle is broken at the new tail; linking the old tail to the old head creates the correct single linear sequence from the new head.",
    dryRun: "Length is 4 and k is 1, so the new tail is node 3 and the new head is node 4. Set node 3.next to null, then connect original tail node 4 to original head node 1. The list is 4→1→2→3.",
    debuggingLesson: "When a list operation temporarily creates a cycle, explicitly identify the one link that must be cut and the one link that must remain connected to the original head."
  },
  testCases: [
    { input: "[1,2,3,4], 1", expected: "4123" },
    { input: "[5,6], 0", expected: "56" }
  ],
  harness: {
    expected: "4123 56",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.next=new Solution.Node(2); a.next.next=new Solution.Node(3); a.next.next.next=new Solution.Node(4); Solution.Node b=new Solution.Node(5); b.next=new Solution.Node(6); System.out.print(Solution.signatureFive(Solution.rotateRight(a,1))+\" \"+Solution.signatureFive(Solution.rotateRight(b,0)));",
      python: "a=Node(1); a.next=Node(2); a.next.next=Node(3); a.next.next.next=Node(4); b=Node(5); b.next=Node(6); print(signature_five(rotate_right(a,1)), signature_five(rotate_right(b,0)))",
      c: "struct Node a={1,NULL}, a2={2,NULL}, a3={3,NULL}, a4={4,NULL}; a.next=&a2; a2.next=&a3; a3.next=&a4; struct Node b={5,NULL}, b6={6,NULL}; b.next=&b6; printf(\"%d %d\", signature_five(rotate_right(&a,1)), signature_five(rotate_right(&b,0)));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node rotateRight(Node head, int k) {
        if(head==null || head.next==null || k==0)return head;
        int len=1; Node tail=head; while(tail.next!=null){len++;tail=tail.next;}
        k%=len; if(k==0)return head;
        tail.next=head; int steps=len-k; Node newTail=head;
        for(int i=1;i<steps;i++)newTail=newTail.next;
        Node newHead=newTail.next; newTail.next=null;
        tail.next=head; return newHead;
    }
    static int signatureFive(Node n) { int s=0,c=0; while(n!=null && c<5){s=s*10+n.val;n=n.next;c++;} return s; }
}
`,
      bugs: { 10: { was: "tail.next=head; return newHead;", buggy: "        tail.next=newHead; return newHead;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def rotate_right(head, k):
    if head is None or head.next is None or k == 0:
        return head
    length, tail = 1, head
    while tail.next is not None:
        length += 1
        tail = tail.next
    k %= length
    if k == 0:
        return head
    tail.next = head
    steps = length - k
    new_tail = head
    for _ in range(1, steps):
        new_tail = new_tail.next
    new_head = new_tail.next
    new_tail.next = None
    tail.next = head  # reconnect to original head
    return new_head

def signature_five(node):
    value, count = 0, 0
    while node is not None and count < 5:
        value = value * 10 + node.val
        node = node.next
        count += 1
    return value
`,
      bugs: { 22: { was: "tail.next = head  # reconnect to original head", buggy: "    tail.next = new_head  # reconnect to original head" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next; };
struct Node *rotate_right(struct Node *head, int k) {
    if(!head || !head->next || k==0)return head;
    int len=1; struct Node *tail=head; while(tail->next){len++;tail=tail->next;}
    k%=len; if(k==0)return head;
    tail->next=head; int steps=len-k; struct Node *new_tail=head;
    for(int i=1;i<steps;i++)new_tail=new_tail->next;
    struct Node *new_head=new_tail->next; new_tail->next=NULL;
    tail->next=head; return new_head;
}
int signature_five(struct Node *n) { int s=0,c=0; while(n && c<5){s=s*10+n->val;n=n->next;c++;} return s; }
`,
      bugs: { 9: { was: "tail->next=head; return new_head;", buggy: "    tail->next=new_head; return new_head;" } },
    }
  },
});
