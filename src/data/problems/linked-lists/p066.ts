import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p066",
  title: "The forward chain is updated but its backward link is stale",
  difficulty: "Medium",
  topic: "Linked Lists",
  subtopic: "Doubly Linked List Insertion",
  tags: ["Doubly Linked List", "Bidirectional Links"],
  bugCategory: "Incorrect Linked-List Update",
  sourceInspiredBy: "Insert into a sorted doubly linked list pattern",
  description: "Insert a value into a sorted doubly linked list and return the sum obtained by traversing backward from the new tail.",
  constraints: ["The original list is sorted in non-decreasing order.", "The list may be empty."],
  examples: [
    { input: "list = [1, 3], value = 2", output: "6" },
    { input: "list = [2, 5], value = 4", output: "11" }
  ],
  hints: ["Every forward link change has a matching backward-link responsibility.", "Inspect the old successor after inserting between two existing nodes."],
  complexity: { time: "O(n)", space: "O(1)" },
  explanation: {
    overview: "Insert a value at its sorted position while keeping both directions of every adjacent link consistent.",
    algorithm: "Handle insertion before the head separately. Otherwise find the last node smaller than the new value, connect the new node between it and its successor, and update both neighbouring backward/forward links.",
    bug: "The insertion updates the current node’s previous pointer instead of the successor’s previous pointer.",
    whyItFails: "The forward chain contains the inserted node, but a backward traversal from the tail jumps over it because the old successor still points to the earlier predecessor.",
    failingTestCase: "Inserting 2 into [1,3] should make the backward sum 3 + 2 + 1 = 6. The buggy backward links produce 3 + 1 = 4.",
    fix: "Set the old successor’s prev pointer to the newly inserted node when a successor exists.",
    whyFixWorks: "The new node becomes the immediate predecessor of the old successor, so forward and backward traversal describe the same adjacency.",
    dryRun: "The insertion point is after node 1. Set new.prev = 1 and new.next = 3, then set 1.next = new and 3.prev = new. Backward from 3 now visits 2 and then 1.",
    debuggingLesson: "For doubly linked lists, review every insertion as four link assignments: new.prev, new.next, predecessor.next, and successor.prev when present."
  },
  testCases: [
    { input: "[1,3], 2", expected: "6" },
    { input: "[2,5], 4", expected: "11" }
  ],
  harness: {
    expected: "6 11",
    driver: {
      java: "Solution.DNode a=new Solution.DNode(1); a.next=new Solution.DNode(3); a.next.prev=a; a=Solution.insertSorted(a,2); Solution.DNode b=new Solution.DNode(2); b.next=new Solution.DNode(5); b.next.prev=b; b=Solution.insertSorted(b,4); System.out.print(Solution.backwardSum(a)+\" \"+Solution.backwardSum(b));",
      python: "a=DNode(1); a.next=DNode(3); a.next.prev=a; a=insert_sorted(a,2); b=DNode(2); b.next=DNode(5); b.next.prev=b; b=insert_sorted(b,4); print(backward_sum(a),backward_sum(b))",
      c: "struct DNode a={1,NULL,NULL}, a3={3,NULL,NULL}; a.next=&a3; a3.prev=&a; struct DNode b={2,NULL,NULL}, b5={5,NULL,NULL}; b.next=&b5; b5.prev=&b; struct DNode *x=insert_sorted(&a,2), *y=insert_sorted(&b,4); printf(\"%d %d\", backward_sum(x),backward_sum(y));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class DNode { int val; DNode prev, next; DNode(int v) { val = v; } }
    static DNode insertSorted(DNode head, int value) {
        DNode n=new DNode(value);
        if(head==null)return n;
        if(value<=head.val){n.next=head;head.prev=n;return n;}
        DNode cur=head; while(cur.next!=null && cur.next.val<value)cur=cur.next;
        n.next=cur.next; n.prev=cur;
        if(cur.next!=null) cur.next.prev=n;
        cur.next=n; return head;
    }
    static int backwardSum(DNode h) { if(h==null)return 0; while(h.next!=null)h=h.next; int s=0; while(h!=null){s+=h.val;h=h.prev;} return s; }
}
`,
      bugs: { 9: { was: "if(cur.next!=null) cur.next.prev=n;", buggy: "        if(cur.next!=null) cur.next.prev=cur;" } },
    },
    python: {
      correct: `
class DNode:
    def __init__(self, val):
        self.val, self.prev, self.next = val, None, None

def insert_sorted(head, value):
    node = DNode(value)
    if head is None:
        return node
    if value <= head.val:
        node.next = head
        head.prev = node
        return node
    cur = head
    while cur.next is not None and cur.next.val < value:
        cur = cur.next
    node.next = cur.next
    node.prev = cur
    if cur.next is not None:
        cur.next.prev = node
    cur.next = node
    return head

def backward_sum(head):
    if head is None:
        return 0
    while head.next is not None:
        head = head.next
    total = 0
    while head is not None:
        total += head.val
        head = head.prev
    return total
`,
      bugs: { 19: { was: "cur.next.prev = node", buggy: "        cur.next.prev = cur" } },
    },
    c: {
      correct: `
struct DNode { int val; struct DNode *prev, *next; };
struct DNode *insert_sorted(struct DNode *head, int value) {
    struct DNode *n=malloc(sizeof(struct DNode)); n->val=value; n->prev=n->next=NULL;
    if(!head)return n;
    if(value<=head->val){n->next=head;head->prev=n;return n;}
    struct DNode *cur=head; while(cur->next && cur->next->val<value)cur=cur->next;
    n->next=cur->next; n->prev=cur;
    if(cur->next)cur->next->prev=n;
    cur->next=n; return head;
}
int backward_sum(struct DNode *h) { if(!h)return 0; while(h->next)h=h->next; int s=0; while(h){s+=h->val;h=h->prev;} return s; }
`,
      bugs: { 8: { was: "if(cur->next)cur->next->prev=n;", buggy: "    if(cur->next)cur->next->prev=cur;" } },
    }
  },
});
