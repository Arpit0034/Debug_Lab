import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p070',
  title: 'The gap is one node too short',
  difficulty: 'Medium',
  topic: 'Linked Lists',
  subtopic: 'Remove Nth Node From End',
  tags: ['Linked List', 'Two Pointers', 'Dummy Node'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Remove the nth node from the end of a singly linked list',
  description:
    'Remove the nth node from the end of a singly linked list and return the remaining values. The two-pointer gap is created with the wrong number of steps.',
  constraints: ['1 <= length <= 100', '1 <= n <= length'],
  examples: [
    { input: 'list = [1,2,3,4,5], n = 2', output: '1 2 3 5' },
  ],
  hints: [
    'Count how many steps the fast pointer takes before the slow pointer starts moving.',
    'The slow pointer must stop on the node before the one being removed.',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Delete the nth node from the end in a single pass.',
    algorithm: 'Put a dummy node before the head. Advance a fast pointer n steps, then move fast and slow together until fast reaches the last node. The slow pointer is then just before the node to delete.',
    bug: 'The fast pointer is advanced n - 1 steps instead of n steps.',
    whyItFails: 'The gap between the pointers is one node too short, so the slow pointer finishes one node too far to the right and the wrong node is unlinked.',
    failingTestCase: 'For [1,2,3,4,5] and n = 2, the code removes 5 and prints 1 2 3 4 instead of 1 2 3 5.',
    fix: 'Advance fast exactly n steps: i < n.',
    whyFixWorks: 'With a gap of n nodes, slow stops directly before the nth node from the end.',
    dryRun: 'Correct: fast moves to node 2, then three more steps while slow moves to node 3, so node 4 is removed. Buggy: fast moves to node 1, then four more steps while slow moves to node 4, so node 5 is removed.',
    debuggingLesson: 'For two-pointer gap problems, test the gap size on a small list by hand before trusting the loop.',
  },
  testCases: [
    { input: '[1,2,3,4,5], 2', expected: '1 2 3 5', buggyOutput: '1 2 3 4' },
  ],
  harness: {
    expected: '1 2 3 5',
    driver: {
      java: `System.out.print(Solution.removeNthFromEnd(new int[]{1,2,3,4,5}, 2));`,
      python: `print(remove_nth_from_end([1,2,3,4,5], 2))`,
      c: `int v[5] = {1,2,3,4,5}; int out[10]; int len; remove_nth_from_end(v, 5, 2, out, &len); for (int i = 0; i < len; i++) printf(i ? " %d" : "%d", out[i]);`,
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
    static String removeNthFromEnd(int[] vals, int n) {
        Node dummy = new Node(0);
        Node tail = dummy;
        for (int v : vals) {
            tail.next = new Node(v);
            tail = tail.next;
        }
        Node fast = dummy, slow = dummy;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        StringBuilder sb = new StringBuilder();
        for (Node cur = dummy.next; cur != null; cur = cur.next) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(cur.val);
        }
        return sb.toString();
    }
}
`,
      bugs: { 15: { was: 'i < n', buggy: '        for (int i = 0; i < n - 1; i++) fast = fast.next;' } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def remove_nth_from_end(vals, n):
    dummy = Node(0)
    tail = dummy
    for v in vals:
        tail.next = Node(v)
        tail = tail.next
    fast = slow = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next is not None:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    out = []
    cur = dummy.next
    while cur is not None:
        out.append(str(cur.val))
        cur = cur.next
    return ' '.join(out)
`,
      bugs: { 13: { was: 'range(n)', buggy: '    for _ in range(n - 1):' } },
    },
    c: {
      correct: `
typedef struct Node {
    int val;
    struct Node* next;
} Node;

void remove_nth_from_end(int vals[], int len, int n, int out[], int* outLen) {
    Node nodes[100];
    for (int i = 0; i < len; i++) {
        nodes[i].val = vals[i];
        nodes[i].next = (i + 1 < len) ? &nodes[i + 1] : NULL;
    }
    Node dummy;
    dummy.val = 0;
    dummy.next = &nodes[0];
    Node* fast = &dummy;
    Node* slow = &dummy;
    for (int i = 0; i < n; i++) fast = fast->next;
    while (fast->next != NULL) {
        fast = fast->next;
        slow = slow->next;
    }
    slow->next = slow->next->next;
    *outLen = 0;
    for (Node* cur = dummy.next; cur != NULL; cur = cur->next) {
        out[(*outLen)++] = cur->val;
    }
}
`,
      bugs: { 17: { was: 'i < n', buggy: '    for (int i = 0; i < n - 1; i++) fast = fast->next;' } },
    },
  },
});
