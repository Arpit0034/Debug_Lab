import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p072',
  title: 'The wrong neighbour gets tested',
  difficulty: 'Easy',
  topic: 'Linked Lists',
  subtopic: 'Remove Linked List Elements',
  tags: ['Linked List', 'Dummy Node', 'Deletion'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'Remove all nodes with a given value from a linked list',
  description:
    'Remove every node holding a given value from a singly linked list and return the remaining values. The deletion test looks at the wrong node.',
  constraints: ['0 <= length <= 100', 'Values are integers'],
  examples: [
    { input: 'list = [1,2,2,3], target = 2', output: '1 3' },
  ],
  hints: [
    'To unlink a node you stand on its predecessor.',
    'Check which node the condition inspects before cur.next is changed.',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Delete all nodes with a target value using a dummy head.',
    algorithm: 'Keep a cursor on the node before the one being examined. If cur.next holds the target, skip it; otherwise advance the cursor.',
    bug: 'The condition tests cur.val instead of cur.next.val.',
    whyItFails: 'The cursor tests itself, then deletes its successor. A node holding the target can be kept while an innocent neighbour is removed.',
    failingTestCase: 'For [1,2,2,3] and target 2, the code returns 1 2 instead of 1 3.',
    fix: 'Test cur.next.val == target.',
    whyFixWorks: 'The node being tested is exactly the node that is unlinked when the test succeeds.',
    dryRun: 'Correct: from the dummy, 2 and 2 are skipped one by one, leaving 1 3. Buggy: the cursor reaches the first 2, then removes the next node (the second 2) and then 3 because its own value still equals the target, leaving 1 2.',
    debuggingLesson: 'In deletion loops, make the tested node and the deleted node the same node.',
  },
  testCases: [
    { input: '[1,2,2,3], 2', expected: '1 3', buggyOutput: '1 2' },
  ],
  harness: {
    expected: '1 3',
    driver: {
      java: `System.out.print(Solution.removeValue(new int[]{1,2,2,3}, 2));`,
      python: `print(remove_value([1,2,2,3], 2))`,
      c: `int v[4] = {1,2,2,3}; int out[10]; int len; remove_value(v, 4, 2, out, &len); for (int i = 0; i < len; i++) printf(i ? " %d" : "%d", out[i]);`,
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
    static String removeValue(int[] vals, int target) {
        Node dummy = new Node(0);
        Node tail = dummy;
        for (int v : vals) {
            tail.next = new Node(v);
            tail = tail.next;
        }
        Node cur = dummy;
        while (cur.next != null) {
            if (cur.next.val == target) {
                cur.next = cur.next.next;
            } else {
                cur = cur.next;
            }
        }
        StringBuilder sb = new StringBuilder();
        for (Node n = dummy.next; n != null; n = n.next) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(n.val);
        }
        return sb.toString();
    }
}
`,
      bugs: { 16: { was: 'cur.next.val == target', buggy: '            if (cur.val == target) {' } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def remove_value(vals, target):
    dummy = Node(0)
    tail = dummy
    for v in vals:
        tail.next = Node(v)
        tail = tail.next
    cur = dummy
    while cur.next is not None:
        if cur.next.val == target:
            cur.next = cur.next.next
        else:
            cur = cur.next
    out = []
    n = dummy.next
    while n is not None:
        out.append(str(n.val))
        n = n.next
    return ' '.join(out)
`,
      bugs: { 14: { was: 'cur.next.val == target', buggy: '        if cur.val == target:' } },
    },
    c: {
      correct: `
typedef struct Node {
    int val;
    struct Node* next;
} Node;

void remove_value(int vals[], int len, int target, int out[], int* outLen) {
    Node nodes[100];
    for (int i = 0; i < len; i++) {
        nodes[i].val = vals[i];
        nodes[i].next = (i + 1 < len) ? &nodes[i + 1] : NULL;
    }
    Node dummy;
    dummy.val = 0;
    dummy.next = len > 0 ? &nodes[0] : NULL;
    Node* cur = &dummy;
    while (cur->next != NULL) {
        if (cur->next->val == target) {
            cur->next = cur->next->next;
        } else {
            cur = cur->next;
        }
    }
    *outLen = 0;
    for (Node* n = dummy.next; n != NULL; n = n->next) {
        out[(*outLen)++] = n->val;
    }
}
`,
      bugs: { 17: { was: 'cur->next->val == target', buggy: '        if (cur->val == target) {' } },
    },
  },
});
