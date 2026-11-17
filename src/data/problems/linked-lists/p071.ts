import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p071',
  title: 'The final carry vanishes',
  difficulty: 'Medium',
  topic: 'Linked Lists',
  subtopic: 'Add Two Numbers',
  tags: ['Linked List', 'Math', 'Carry'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Add two numbers stored as reversed digit lists',
  description:
    'Two non-negative numbers are stored as linked lists with the least significant digit first. Return the digits of their sum in the same order. A leftover carry at the end is lost.',
  constraints: ['0 <= digit <= 9', '1 <= length <= 100 for each list'],
  examples: [
    { input: 'a = [9,9], b = [1]', output: '0 0 1' },
  ],
  hints: [
    'Think about what happens when both lists end but a carry is still pending.',
    'Look at the loop condition, not the digit arithmetic.',
  ],
  complexity: { time: 'O(max(n, m))', space: 'O(max(n, m))' },
  explanation: {
    overview: 'Add two numbers digit by digit using linked lists.',
    algorithm: 'Walk both lists together, adding digits and the carry, appending sum % 10, and carrying sum / 10. Keep looping while either list has digits or a carry remains.',
    bug: 'The loop condition no longer checks whether a carry remains.',
    whyItFails: 'When both lists are exhausted with a carry of 1, the loop stops and the most significant digit is never appended.',
    failingTestCase: 'For 99 + 1 stored as [9,9] and [1], the code returns 0 0 instead of 0 0 1.',
    fix: 'Keep looping while p != null || q != null || carry != 0.',
    whyFixWorks: 'One extra iteration appends the final carry digit.',
    dryRun: '9 + 1 = 10 gives digit 0, carry 1. Then 9 + 0 + 1 = 10 gives digit 0, carry 1. Both lists are empty, but the carry is 1. Correct code appends 1; buggy code stops.',
    debuggingLesson: 'In carry-based algorithms, always test an input whose result is longer than either operand.',
  },
  testCases: [
    { input: '[9,9], [1]', expected: '0 0 1', buggyOutput: '0 0' },
  ],
  harness: {
    expected: '0 0 1',
    driver: {
      java: `System.out.print(Solution.addTwo(new int[]{9,9}, new int[]{1}));`,
      python: `print(add_two([9,9], [1]))`,
      c: `int a[2] = {9,9}; int b[1] = {1}; int out[10]; int len; add_two(a, 2, b, 1, out, &len); for (int i = 0; i < len; i++) printf(i ? " %d" : "%d", out[i]);`,
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
    static Node build(int[] vals) {
        Node dummy = new Node(0);
        Node tail = dummy;
        for (int v : vals) {
            tail.next = new Node(v);
            tail = tail.next;
        }
        return dummy.next;
    }
    static String addTwo(int[] a, int[] b) {
        Node p = build(a), q = build(b);
        Node dummy = new Node(0);
        Node tail = dummy;
        int carry = 0;
        while (p != null || q != null || carry != 0) {
            int sum = carry;
            if (p != null) { sum += p.val; p = p.next; }
            if (q != null) { sum += q.val; q = q.next; }
            tail.next = new Node(sum % 10);
            tail = tail.next;
            carry = sum / 10;
        }
        StringBuilder sb = new StringBuilder();
        for (Node cur = dummy.next; cur != null; cur = cur.next) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(cur.val);
        }
        return sb.toString();
    }
}
`,
      bugs: { 21: { was: '|| carry != 0', buggy: '        while (p != null || q != null) {' } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def build(vals):
    dummy = Node(0)
    tail = dummy
    for v in vals:
        tail.next = Node(v)
        tail = tail.next
    return dummy.next

def add_two(a, b):
    p, q = build(a), build(b)
    dummy = Node(0)
    tail = dummy
    carry = 0
    while p is not None or q is not None or carry != 0:
        total = carry
        if p is not None:
            total += p.val
            p = p.next
        if q is not None:
            total += q.val
            q = q.next
        tail.next = Node(total % 10)
        tail = tail.next
        carry = total // 10
    out = []
    cur = dummy.next
    while cur is not None:
        out.append(str(cur.val))
        cur = cur.next
    return ' '.join(out)
`,
      bugs: { 19: { was: 'or carry != 0', buggy: '    while p is not None or q is not None:' } },
    },
    c: {
      correct: `
typedef struct Node {
    int val;
    struct Node* next;
} Node;

void add_two(int a[], int na, int b[], int nb, int out[], int* outLen) {
    Node an[50], bn[50];
    for (int i = 0; i < na; i++) {
        an[i].val = a[i];
        an[i].next = (i + 1 < na) ? &an[i + 1] : NULL;
    }
    for (int i = 0; i < nb; i++) {
        bn[i].val = b[i];
        bn[i].next = (i + 1 < nb) ? &bn[i + 1] : NULL;
    }
    Node* p = na > 0 ? &an[0] : NULL;
    Node* q = nb > 0 ? &bn[0] : NULL;
    int carry = 0;
    *outLen = 0;
    while (p != NULL || q != NULL || carry != 0) {
        int sum = carry;
        if (p != NULL) { sum += p->val; p = p->next; }
        if (q != NULL) { sum += q->val; q = q->next; }
        out[(*outLen)++] = sum % 10;
        carry = sum / 10;
    }
}
`,
      bugs: { 20: { was: '|| carry != 0', buggy: '    while (p != NULL || q != NULL) {' } },
    },
  },
});
