import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p068",
  title: "Copied random links still point into the original chain",
  difficulty: "Hard",
  topic: "Linked Lists",
  subtopic: "Clone List with Random Pointers",
  tags: ["Random Pointers", "Deep Copy"],
  bugCategory: "Incorrect Linked-List Update",
  sourceInspiredBy: "O(1)-auxiliary-space random-pointer list cloning pattern",
  description: "Create an independent copy of a linked list whose nodes have next and random pointers. Report whether selected random pointers target nodes inside the copied list.",
  constraints: ["Every random pointer is null or points to a node in the list.", "The list may contain one or more nodes."],
  examples: [
    { input: "three nodes with random links 1→3, 2→1, 3→2", output: "1" },
    { input: "one node whose random pointer points to itself", output: "1" }
  ],
  hints: ["A copied random link must refer to the copy of the original target.", "Inspect how the copied node is located from its original target."],
  complexity: { time: "O(n)", space: "O(1) extra, excluding the copied nodes" },
  explanation: {
    overview: "Produce a deep copy in which both next and random links remain internal to the new list.",
    algorithm: "Interleave each copy immediately after its original. Then set each copy’s random link using the original target’s next node. Finally detach the interleaved chain into original and copied lists.",
    bug: "The copied random pointer is assigned the original target node rather than the copy immediately after that target.",
    whyItFails: "The cloned list may display the same values, but its random pointers cross back into the original structure. This violates deep-copy independence.",
    failingTestCase: "When original node 1 points randomly to original node 3, the clone of node 1 must point to the clone of node 3. The buggy code points to original node 3, so the identity check fails.",
    fix: "Use cur.random.next as the copied target while originals and copies are interleaved.",
    whyFixWorks: "At the moment random links are assigned, every original node is immediately followed by its copy; therefore the original target’s next pointer identifies the cloned target.",
    dryRun: "After interleaving, the chain is 1,1′,2,2′,3,3′. If original 1.random is original 3, then original 3.next is 3′. Assigning that pointer makes 1′.random point inside the copied list.",
    debuggingLesson: "In deep-copy problems, verify pointer ownership as well as payload equality; a clone must not retain references into the original object graph."
  },
  testCases: [
    { input: "3-node list with 1.random = 3", expected: "1" },
    { input: "single node with random = itself", expected: "1" }
  ],
  harness: {
    expected: "1 1",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.next=new Solution.Node(2); a.next.next=new Solution.Node(3); a.random=a.next.next; a.next.random=a; a.next.next.random=a.next; Solution.Node x=Solution.cloneRandom(a); Solution.Node c=new Solution.Node(9); c.random=c; Solution.Node y=Solution.cloneRandom(c); System.out.print((x.random==x.next.next?1:0)+\" \"+(y.random==y?1:0));",
      python: "a=Node(1); a.next=Node(2); a.next.next=Node(3); a.random=a.next.next; a.next.random=a; a.next.next.random=a.next; x=clone_random(a); c=Node(9); c.random=c; y=clone_random(c); print(int(x.random is x.next.next), int(y.random is y))",
      c: "struct Node a={1,NULL,NULL}, a2={2,NULL,NULL}, a3={3,NULL,NULL}; a.next=&a2; a2.next=&a3; a.random=&a3; a2.random=&a; a3.random=&a2; struct Node *x=clone_random(&a); struct Node c={9,NULL,NULL}; c.random=&c; struct Node *y=clone_random(&c); printf(\"%d %d\", x->random==x->next->next, y->random==y);"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next, random; Node(int v) { val = v; } }
    static Node cloneRandom(Node head) {
        if (head == null) return null;
        for (Node cur=head; cur!=null;) { Node copy=new Node(cur.val); copy.next=cur.next; cur.next=copy; cur=copy.next; }
        for (Node cur=head; cur!=null; cur=cur.next.next) {
            Node copy=cur.next;
            copy.random = cur.random == null ? null : cur.random.next;
        }
        Node copyHead=head.next;
        for (Node cur=head; cur!=null;) { Node copy=cur.next; cur.next=copy.next; copy.next=copy.next==null?null:copy.next.next; cur=cur.next; }
        return copyHead;
    }
}
`,
      bugs: { 8: { was: "copy.random = cur.random == null ? null : cur.random.next;", buggy: "            copy.random = cur.random == null ? null : cur.random;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next, self.random = val, None, None

def clone_random(head):
    if head is None:
        return None
    cur = head
    while cur is not None:
        copy = Node(cur.val)
        copy.next = cur.next
        cur.next = copy
        cur = copy.next
    cur = head
    while cur is not None:
        copy = cur.next
        copy.random = cur.random.next if cur.random is not None else None
        cur = copy.next
    copy_head = head.next
    cur = head
    while cur is not None:
        copy = cur.next
        cur.next = copy.next
        copy.next = copy.next.next if copy.next is not None else None
        cur = cur.next
    return copy_head
`,
      bugs: { 17: { was: "copy.random = cur.random.next if cur.random is not None else None", buggy: "        copy.random = cur.random if cur.random is not None else None" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next, *random; };
struct Node *clone_random(struct Node *head) {
    if (!head) return NULL;
    for (struct Node *cur=head; cur;) { struct Node *copy=malloc(sizeof(struct Node)); copy->val=cur->val; copy->random=NULL; copy->next=cur->next; cur->next=copy; cur=copy->next; }
    for (struct Node *cur=head; cur; cur=cur->next->next) {
        struct Node *copy=cur->next;
        copy->random = cur->random == NULL ? NULL : cur->random->next;
    }
    struct Node *copy_head=head->next;
    for (struct Node *cur=head; cur;) { struct Node *copy=cur->next; cur->next=copy->next; copy->next=copy->next?copy->next->next:NULL; cur=cur->next; }
    return copy_head;
}
`,
      bugs: { 7: { was: "copy->random = cur->random == NULL ? NULL : cur->random->next;", buggy: "        copy->random = cur->random == NULL ? NULL : cur->random;" } },
    }
  },
});
