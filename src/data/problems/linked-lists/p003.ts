import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p003',
  title: 'Reversal keeps only one node',
  difficulty: 'Medium',
  topic: 'Linked Lists',
  subtopic: 'Reversal',
  tags: ['Linked List', 'Pointer Manipulation'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'Classic iterative linked-list reversal',
  description:
    'Reverse a singly linked list in place and return the new head. For the list 1 -> 2 -> 3 the code returns a list with only one node.',
  constraints: ['0 <= length <= 5000'],
  examples: [
    { input: '1 -> 2 -> 3', output: '3 -> 2 -> 1' },
    { input: '(empty list)', output: '(empty list)' },
  ],
  hints: ['After curr.next = prev, what does curr.next point to?', 'Why is the saved next variable never used?'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Reverse the direction of every pointer in a singly linked list.',
    algorithm:
      'Walk the list with prev and curr. Save curr.next, point curr back at prev, advance prev to curr, then advance curr to the saved next node.',
    bug: 'The walk advances with curr = curr.next after curr.next was already overwritten with prev.',
    whyItFails:
      'Once curr.next = prev has run, curr.next no longer points forward. Moving to curr.next moves backwards (to null on the first step), so the loop ends after one node and the rest of the list is cut off.',
    failingTestCase: '1 -> 2 -> 3: after the first iteration curr becomes null, and the function returns node 1 alone.',
    fix: 'Advance with the saved pointer: curr = next.',
    whyFixWorks: 'next was read before the pointer was rewired, so it still refers to the original following node.',
    dryRun:
      '1 -> 2 -> 3. Iteration 1: next=2, 1.next=null, prev=1, curr=2. Iteration 2: next=3, 2.next=1, prev=2, curr=3. Iteration 3: next=null, 3.next=2, prev=3, curr=null. Return 3 -> 2 -> 1.',
    debuggingLesson:
      'When you save a pointer in a temporary variable, make sure it is the one you use afterwards. A saved-but-unused variable is a strong smell.',
  },
  testCases: [
    { input: '1 -> 2 -> 3', expected: '3 -> 2 -> 1', buggyOutput: '1' },
    { input: 'empty', expected: 'empty' },
  ],
  harness: {
    expected: '3 2 1',
    driver: {
      java: `Solution.Node a = new Solution.Node(1);
a.next = new Solution.Node(2);
a.next.next = new Solution.Node(3);
Solution.Node h = Solution.reverse(a);
StringBuilder sb = new StringBuilder();
while (h != null) { sb.append(h.val).append(" "); h = h.next; }
System.out.println(sb);`,
      python: `h = reverse(Node(1, Node(2, Node(3))))
out = []
while h:
    out.append(str(h.val))
    h = h.next
print(" ".join(out))`,
      c: `Node c3 = {3, NULL}, b2 = {2, &c3}, a1 = {1, &b2};
Node *h = reverse(&a1);
while (h) { printf("%d ", h->val); h = h->next; }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node {
        int val;
        Node next;
        Node(int val) { this.val = val; }
    }

    static Node reverse(Node head) {
        Node prev = null;
        Node curr = head;
        while (curr != null) {
            Node next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}
`,
      bugs: { 15: { was: 'curr = next', buggy: 'curr = curr.next;' } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next


def reverse(head):
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
`,
      bugs: { 14: { was: 'curr = nxt', buggy: 'curr = curr.next' } },
    },
    c: {
      correct: `
typedef struct Node {
    int val;
    struct Node *next;
} Node;

Node *reverse(Node *head) {
    Node *prev = NULL;
    Node *curr = head;
    while (curr != NULL) {
        Node *next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
`,
      bugs: { 13: { was: 'curr = next', buggy: 'curr = curr->next;' } },
    },
  },
});
