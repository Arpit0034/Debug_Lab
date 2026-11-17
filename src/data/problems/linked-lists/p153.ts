import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p153',
  title: 'The middle node is chosen one step late',
  difficulty: 'Medium',
  topic: 'Linked Lists',
  subtopic: 'Middle Node',
  tags: ['Linked List', 'Pointers', 'Traversal'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'Finding the middle node of a singly linked list',
  description: 'Return the value at the middle position of a non-empty singly linked list. For even length, return the second middle value.',
  constraints: ['1 <= n <= 10000'],
  examples: [{ input: '[1,2,3,4,5]', output: '3' }, { input: '[1,2,3,4]', output: '3' }],
  hints: ['The two traversal references do not move at the same speed.', 'Check the even-length case.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Locate the second middle node when the list length is even.',
    algorithm: 'Advance one reference by one node and another by two nodes.',
    bug: 'The slower reference advances twice per iteration.',
    whyItFails: 'It reaches the end too early and returns a node after the middle.',
    failingTestCase: '[1,2,3,4,5] should return 3.',
    fix: 'Advance the slower reference by exactly one node.',
    whyFixWorks: 'The faster reference covers twice the distance, leaving the slower one at the middle.',
    dryRun: 'Fast moves 1→3→5; slow moves 1→2→3.',
    debuggingLesson: 'Pointer speed is the invariant in two-reference list traversal.'
  },
  testCases: [{ input: '[1,2,3,4,5]', expected: '3' }],
  harness: { expected: '3', driver: { java: 'ListNode h = new ListNode(1,new ListNode(2,new ListNode(3,new ListNode(4,new ListNode(5,null))))); System.out.print(Solution.middleValue(h));', python: 'h=ListNode(1,ListNode(2,ListNode(3,ListNode(4,ListNode(5))))); print(middle_value(h))', c: 'struct Node a={1,0},b={2,0},c={3,0},d={4,0},e={5,0}; a.next=&b;b.next=&c;c.next=&d;d.next=&e;printf("%d",middle_value(&a));' } },
  code: {
    java: { correct: `
class ListNode { int val; ListNode next; ListNode(int v,ListNode n){val=v;next=n;} }
class Solution {
    static int middleValue(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow.val;
    }
}
`, bugs: { 6: { was: 'slow = slow.next;', buggy: 'slow = slow.next.next;' } } },
    python: { correct: `
class ListNode:
    def __init__(self, val, next=None):
        self.val, self.next = val, next
def middle_value(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow.val
`, bugs: { 7: { was: 'slow = slow.next', buggy: 'slow = slow.next.next' } } },
    c: { correct: `
struct Node { int val; struct Node *next; };
int middle_value(struct Node *head) {
    struct Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow->val;
}
`, bugs: { 5: { was: 'slow = slow->next;', buggy: 'slow = slow->next->next;' } } }
  }
});
