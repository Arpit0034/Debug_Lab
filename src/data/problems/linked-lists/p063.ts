import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p063",
  title: "Matching nodes are visited but never unlinked",
  difficulty: "Easy",
  topic: "Linked Lists",
  subtopic: "Remove All Matching Nodes",
  tags: ["Singly Linked List", "Deletion"],
  bugCategory: "Incorrect Linked-List Update",
  sourceInspiredBy: "Remove all occurrences of a value from a linked list pattern",
  description: "Remove every node containing the target value and return the sum of the remaining node values.",
  constraints: ["The list may be empty.", "Node values and target are integers."],
  examples: [
    { input: "head = [1, 2, 2, 3], target = 2", output: "4" },
    { input: "head = [2, 2, 1], target = 2", output: "1" }
  ],
  hints: ["When the next node matches, the link before it must skip over it.", "Trace what happens to cur after a deletion."],
  complexity: { time: "O(n)", space: "O(1)" },
  explanation: {
    overview: "Delete every node whose value equals the target while preserving the relative order of the other nodes.",
    algorithm: "Use a dummy node before the head. Inspect cur.next; unlink it when it matches, otherwise advance cur. Return the sum of the retained chain.",
    bug: "The matching-node branch advances cur instead of changing cur.next to bypass the matched node.",
    whyItFails: "Moving the cursor does not remove a node from the chain. It leaves the matched node connected and can cause later matches to be skipped.",
    failingTestCase: "For [1,2,2,3] with target 2, the correct remaining sum is 4; the buggy code retains both 2s and returns 8.",
    fix: "Set the predecessor link to the matched node’s next node and keep the cursor at the predecessor.",
    whyFixWorks: "The predecessor now points directly to the node after the deletion, so the matched node is no longer reachable from the list head.",
    dryRun: "The dummy points to 1. At node 1, next is 2, so set 1.next to the second 2. The next iteration sees that 2 and bypasses it to 3. The remaining values are 1 and 3, sum 4.",
    debuggingLesson: "For singly linked-list deletion, draw the predecessor and successor and update the predecessor’s next link; cursor movement alone does not delete."
  },
  testCases: [
    { input: "[1,2,2,3], 2", expected: "4" },
    { input: "[2,2,1], 2", expected: "1" }
  ],
  harness: {
    expected: "4 1",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.next=new Solution.Node(2); a.next.next=new Solution.Node(2); a.next.next.next=new Solution.Node(3); Solution.Node b=new Solution.Node(2); b.next=new Solution.Node(2); b.next.next=new Solution.Node(1); System.out.print(Solution.sumList(Solution.removeValue(a,2))+\" \"+Solution.sumList(Solution.removeValue(b,2)));",
      python: "a=Node(1); a.next=Node(2); a.next.next=Node(2); a.next.next.next=Node(3); b=Node(2); b.next=Node(2); b.next.next=Node(1); print(sum_list(remove_value(a,2)), sum_list(remove_value(b,2)))",
      c: "struct Node a={1,NULL}, a2={2,NULL}, a3={2,NULL}, a4={3,NULL}; a.next=&a2; a2.next=&a3; a3.next=&a4; struct Node b={2,NULL}, b2={2,NULL}, b3={1,NULL}; b.next=&b2; b2.next=&b3; printf(\"%d %d\", sum_list(remove_value(&a,2)), sum_list(remove_value(&b,2)));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node removeValue(Node head, int target) {
        Node dummy = new Node(0); dummy.next = head; Node cur = dummy;
        while (cur.next != null) {
            if (cur.next.val == target) cur.next = cur.next.next;
            else cur = cur.next;
        }
        return dummy.next;
    }
    static int sumList(Node n) { int sum=0; while(n!=null){ sum+=n.val; n=n.next; } return sum; }
}
`,
      bugs: { 6: { was: "if (cur.next.val == target) cur.next = cur.next.next;", buggy: "            if (cur.next.val == target) cur = cur.next;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def remove_value(head, target):
    dummy = Node(0)
    dummy.next = head
    cur = dummy
    while cur.next is not None:
        if cur.next.val == target:
            cur.next = cur.next.next
        else:
            cur = cur.next
    return dummy.next

def sum_list(node):
    total = 0
    while node is not None:
        total += node.val
        node = node.next
    return total
`,
      bugs: { 11: { was: "cur.next = cur.next.next", buggy: "            cur = cur.next" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next; };
struct Node *remove_value(struct Node *head, int target) {
    struct Node dummy={0,head}, *cur=&dummy;
    while (cur->next != NULL) {
        if (cur->next->val == target) cur->next = cur->next->next;
        else cur = cur->next;
    }
    return dummy.next;
}
int sum_list(struct Node *n) { int sum=0; while(n){ sum+=n->val; n=n->next; } return sum; }
`,
      bugs: { 5: { was: "if (cur->next->val == target) cur->next = cur->next->next;", buggy: "        if (cur->next->val == target) cur = cur->next;" } },
    }
  },
});
