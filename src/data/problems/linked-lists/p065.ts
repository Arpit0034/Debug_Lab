import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p065",
  title: "Odd-sized circles put the middle node in the wrong half",
  difficulty: "Easy",
  topic: "Linked Lists",
  subtopic: "Circular List Split",
  tags: ["Circular Linked List", "Partitioning"],
  bugCategory: "Off-by-one Error",
  sourceInspiredBy: "Split a circular linked list into two halves pattern",
  description: "Split a circular linked list into two circular lists. The first list must contain the extra node when the original length is odd. Return the two resulting lengths.",
  constraints: ["The list has at least two nodes.", "The input links form one valid circle."],
  examples: [
    { input: "circle = [1, 2, 3, 4, 5]", output: "3 2" },
    { input: "circle = [1, 2, 3, 4]", output: "2 2" }
  ],
  hints: ["For odd lengths, the first half is one node longer.", "Compare the split position for lengths 5 and 4."],
  complexity: { time: "O(n)", space: "O(1)" },
  explanation: {
    overview: "Divide one circular list into two separate circular lists while preserving the original order.",
    algorithm: "Count the nodes, place the first cut after ceil(n/2) nodes, close the first circle at the head, and close the second circle at its own head.",
    bug: "The first-half length uses floor(n/2), assigning the extra middle node to the second half for odd lengths.",
    whyItFails: "The required partition gives the first half the extra node. Floor division reverses that rule only when the length is odd.",
    failingTestCase: "For five nodes, the correct lengths are 3 and 2. The buggy split produces lengths 2 and 3.",
    fix: "Compute the first-half size as (length + 1) / 2 using integer division.",
    whyFixWorks: "Adding one before integer division rounds odd lengths upward while leaving even lengths unchanged.",
    dryRun: "The list has length 5. (5 + 1) / 2 = 3, so the first circle keeps nodes 1, 2, 3 and the second keeps 4, 5. For length 4, the result is 2 and 2.",
    debuggingLesson: "When dividing data structures of odd size, state explicitly which side receives the extra element and choose floor or ceiling accordingly."
  },
  testCases: [
    { input: "[1,2,3,4,5]", expected: "3 2" },
    { input: "[1,2,3,4]", expected: "2 2" }
  ],
  harness: {
    expected: "3 2 2 2",
    driver: {
      java: "Solution.Node a=Solution.circle(5); Solution.Node secondA=Solution.splitCircular(a); Solution.Node b=Solution.circle(4); Solution.Node secondB=Solution.splitCircular(b); System.out.print(Solution.circleLength(a)+\" \"+Solution.circleLength(secondA)+\" \"+Solution.circleLength(b)+\" \"+Solution.circleLength(secondB));",
      python: "a=circle(5); second_a=split_circular(a); b=circle(4); second_b=split_circular(b); print(circle_length(a),circle_length(second_a),circle_length(b),circle_length(second_b))",
      c: "struct Node *a=make_circle(5), *sa=split_circular(a), *b=make_circle(4), *sb=split_circular(b); printf(\"%d %d %d %d\", circle_length(a),circle_length(sa),circle_length(b),circle_length(sb));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node circle(int n) { Node h=new Node(1), t=h; for(int i=2;i<=n;i++){t.next=new Node(i);t=t.next;} t.next=h; return h; }
    static Node splitCircular(Node head) {
        if (head == null || head.next == head) return null;
        int len=1; Node cur=head; while(cur.next!=head){len++;cur=cur.next;}
        int first=(len+1)/2; cur=head;
        for(int i=1;i<first;i++) cur=cur.next;
        Node second=cur.next; cur.next=head;
        Node last=second; while(last.next!=head) last=last.next;
        last.next=second; return second;
    }
    static int circleLength(Node n) { if(n==null)return 0; int c=0; Node p=n; do{c++;p=p.next;}while(p!=n); return c; }
}
`,
      bugs: { 7: { was: "int first=(len+1)/2;", buggy: "        int first=len/2; cur=head;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def circle(n):
    head = Node(1); tail = head
    for value in range(2, n + 1):
        tail.next = Node(value); tail = tail.next
    tail.next = head
    return head

def split_circular(head):
    if head is None or head.next is head: return None
    length, cur = 1, head
    while cur.next is not head:
        length += 1; cur = cur.next
    first = (length + 1) // 2; cur = head
    for _ in range(1, first): cur = cur.next
    second = cur.next; cur.next = head
    last = second
    while last.next is not head: last = last.next
    last.next = second
    return second

def circle_length(node):
    if node is None: return 0
    count, cur = 0, node
    while True:
        count += 1; cur = cur.next
        if cur is node: return count
`,
      bugs: { 17: { was: "first = (length + 1) // 2", buggy: "    first = length // 2; cur = head" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next; };
struct Node *make_circle(int n) { struct Node *h=NULL,*t=NULL; for(int i=1;i<=n;i++){struct Node *x=malloc(sizeof(struct Node));x->val=i;x->next=NULL;if(!h)h=x;else t->next=x;t=x;} t->next=h; return h; }
struct Node *split_circular(struct Node *head) {
    if (!head || head->next == head) return NULL;
    int len=1; struct Node *cur=head; while(cur->next!=head){len++;cur=cur->next;}
    int first=(len+1)/2; cur=head; for(int i=1;i<first;i++)cur=cur->next;
    struct Node *second=cur->next; cur->next=head;
    struct Node *last=second; while(last->next!=head)last=last->next;
    last->next=second; return second;
}
int circle_length(struct Node *n) { if(!n)return 0; int c=0; struct Node *p=n; do{c++;p=p->next;}while(p!=n); return c; }
`,
      bugs: { 6: { was: "int first=(len+1)/2;", buggy: "    int first=len/2; cur=head; for(int i=1;i<first;i++)cur=cur->next;" } },
    }
  },
});
