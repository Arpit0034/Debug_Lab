import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p048",
  title: "A failed comparison leaves half the input detached",
  difficulty: "Medium",
  topic: "Linked Lists",
  subtopic: "Palindrome Check with Restoration",
  tags: ["List Reversal", "Input Preservation"],
  bugCategory: "Reference and Mutation Error",
  sourceInspiredBy: "Palindrome linked-list check with restoration pattern",
  description: "Return whether the list reads the same forward and backward, and include the list signature after the check to verify that the input is unchanged.",
  constraints: ["The list contains at least one node.", "Node values are single digits."],
  examples: [
    { input: "head = [1, 2, 2, 1]", output: "1:1221" },
    { input: "head = [1, 2, 3, 4, 5]", output: "0:12345" }
  ],
  hints: ["The temporary reversed half must be put back regardless of the comparison result.", "Trace the exit path after the first unequal pair."],
  complexity: { time: "O(n)", space: "O(1)" },
  explanation: {
    overview: "Check whether a singly linked list is a palindrome without changing its final structure.",
    algorithm: "Find the midpoint, reverse the second half, compare corresponding values, then reverse the second half again and reconnect it before returning the comparison result.",
    bug: "The second half is restored only when the comparison succeeds.",
    whyItFails: "A mismatch is a normal result, not an exceptional exit. Skipping restoration on that path leaves the reversed suffix detached from the original predecessor.",
    failingTestCase: "For [1,2,3,4,5], the answer is false and the original signature must remain 12345. The buggy code returns false but leaves the reachable chain as 1234.",
    fix: "Restore and reconnect the reversed half unconditionally before returning.",
    whyFixWorks: "The comparison result and structural cleanup are independent. Every execution path restores the original next links.",
    dryRun: "The midpoint is node 3. The suffix 4→5 is reversed to 5→4 for comparison. The first values 1 and 5 differ, so the answer is false. Reverse 5→4 back to 4→5 and reconnect it after 3.",
    debuggingLesson: "When an algorithm temporarily mutates caller-owned data, ensure cleanup runs on success and failure paths alike."
  },
  testCases: [
    { input: "[1,2,2,1]", expected: "1:1221" },
    { input: "[1,2,3,4,5]", expected: "0:12345" }
  ],
  harness: {
    expected: "1:1221 0:12345",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.next=new Solution.Node(2); a.next.next=new Solution.Node(2); a.next.next.next=new Solution.Node(1); boolean x=Solution.isPalindrome(a); Solution.Node b=new Solution.Node(1); b.next=new Solution.Node(2); b.next.next=new Solution.Node(3); b.next.next.next=new Solution.Node(4); b.next.next.next.next=new Solution.Node(5); boolean y=Solution.isPalindrome(b); System.out.print((x?1:0)+\":\"+Solution.signature(a)+\" \"+(y?1:0)+\":\"+Solution.signature(b));",
      python: "a=Node(1); a.next=Node(2); a.next.next=Node(2); a.next.next.next=Node(1); x=is_palindrome(a); b=Node(1); b.next=Node(2); b.next.next=Node(3); b.next.next.next=Node(4); b.next.next.next.next=Node(5); y=is_palindrome(b); print(str(int(x))+\":\"+str(signature(a)), str(int(y))+\":\"+str(signature(b)))",
      c: "struct Node a={1,NULL}, a2={2,NULL}, a3={2,NULL}, a4={1,NULL}; a.next=&a2; a2.next=&a3; a3.next=&a4; int x=is_palindrome(&a); struct Node b={1,NULL}, b2={2,NULL}, b3={3,NULL}, b4={4,NULL}, b5={5,NULL}; b.next=&b2; b2.next=&b3; b3.next=&b4; b4.next=&b5; int y=is_palindrome(&b); printf(\"%d:%d %d:%d\",x,signature(&a),y,signature(&b));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node reverse(Node n) { Node prev=null; while(n!=null){Node next=n.next;n.next=prev;prev=n;n=next;} return prev; }
    static boolean isPalindrome(Node head) {
        Node slow=head, fast=head;
        while(fast.next!=null && fast.next.next!=null){slow=slow.next;fast=fast.next.next;}
        Node second=reverse(slow.next), left=head, right=second; boolean ok=true;
        while(right!=null){if(left.val!=right.val)ok=false;left=left.next;right=right.next;}
        slow.next=reverse(second);
        return ok;
    }
    static int signature(Node n) { int s=0; while(n!=null){s=s*10+n.val;n=n.next;} return s; }
}
`,
      bugs: { 9: { was: "slow.next=reverse(second);", buggy: "        if (ok) slow.next=reverse(second);" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def reverse(node):
    prev = None
    while node is not None:
        nxt = node.next
        node.next = prev
        prev = node
        node = nxt
    return prev

def is_palindrome(head):
    slow = fast = head
    while fast.next is not None and fast.next.next is not None:
        slow = slow.next
        fast = fast.next.next
    second = reverse(slow.next)
    left, right, ok = head, second, True
    while right is not None:
        if left.val != right.val:
            ok = False
        left, right = left.next, right.next
    slow.next = reverse(second)
    return ok

def signature(node):
    value = 0
    while node is not None:
        value = value * 10 + node.val
        node = node.next
    return value
`,
      bugs: { 25: { was: "slow.next = reverse(second)", buggy: "    if ok: slow.next = reverse(second)" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next; };
struct Node *reverse(struct Node *n) { struct Node *p=NULL; while(n){struct Node *q=n->next;n->next=p;p=n;n=q;} return p; }
int is_palindrome(struct Node *head) {
    struct Node *slow=head,*fast=head;
    while(fast->next && fast->next->next){slow=slow->next;fast=fast->next->next;}
    struct Node *second=reverse(slow->next), *left=head, *right=second; int ok=1;
    while(right){if(left->val!=right->val)ok=0;left=left->next;right=right->next;}
    slow->next=reverse(second);
    return ok;
}
int signature(struct Node *n) { int s=0; while(n){s=s*10+n->val;n=n->next;} return s; }
`,
      bugs: { 8: { was: "slow->next=reverse(second);", buggy: "    if (ok) slow->next=reverse(second);" } },
    }
  },
});
