import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p064",
  title: "New digits are allocated beside the list instead of onto it",
  difficulty: "Medium",
  topic: "Linked Lists",
  subtopic: "Add Two Numbers",
  tags: ["Carry Propagation", "List Construction"],
  bugCategory: "Incorrect Pointer Manipulation",
  sourceInspiredBy: "Add two reversed-digit linked-list numbers pattern",
  description: "Each list stores a non-negative integer in reverse digit order. Return the sum as a new list, and report the sum of its output digits.",
  constraints: ["Each node contains one digit from 0 through 9.", "The lists are non-empty."],
  examples: [
    { input: "a = [2, 4, 3], b = [5, 6, 4]", output: "15" },
    { input: "a = [9, 9], b = [1]", output: "1" }
  ],
  hints: ["After creating a node, the tail pointer must refer to the node that was linked.", "Trace where the tail points on the second iteration."],
  complexity: { time: "O(max(m,n))", space: "O(max(m,n))" },
  explanation: {
    overview: "Add two integers whose digits are stored from least significant to most significant.",
    algorithm: "Walk both lists while either has digits or a carry remains. Add available digits and carry, append the ones digit to the result, then carry the tens digit.",
    bug: "The tail pointer is moved to a separately allocated node rather than to the node linked after the result tail.",
    whyItFails: "The new node is not reachable from the dummy head. Subsequent digits are appended to this detached node, so the returned list contains only the first digit.",
    failingTestCase: "Adding [2,4,3] and [5,6,4] should produce [7,0,8], whose digit sum is 15. The buggy list contains only [7] and returns 7.",
    fix: "Advance tail to tail.next immediately after linking the new digit node.",
    whyFixWorks: "The tail then tracks the last node reachable from the dummy head, so the next append extends the actual result list.",
    dryRun: "2 + 5 = 7, so append 7 and move tail to that node. Next, 4 + 6 = 10, append 0 and carry 1. Finally, 3 + 4 + 1 = 8. The result is [7,0,8].",
    debuggingLesson: "When constructing a linked list, distinguish allocating a node from connecting it to the list; only linked nodes are part of the result."
  },
  testCases: [
    { input: "[2,4,3], [5,6,4]", expected: "15" },
    { input: "[9,9], [1]", expected: "1" }
  ],
  harness: {
    expected: "15 1",
    driver: {
      java: "Solution.Node a=new Solution.Node(2); a.next=new Solution.Node(4); a.next.next=new Solution.Node(3); Solution.Node b=new Solution.Node(5); b.next=new Solution.Node(6); b.next.next=new Solution.Node(4); Solution.Node c=new Solution.Node(9); c.next=new Solution.Node(9); Solution.Node d=new Solution.Node(1); System.out.print(Solution.digitSum(Solution.addNumbers(a,b))+\" \"+Solution.digitSum(Solution.addNumbers(c,d)));",
      python: "a=Node(2); a.next=Node(4); a.next.next=Node(3); b=Node(5); b.next=Node(6); b.next.next=Node(4); c=Node(9); c.next=Node(9); d=Node(1); print(digit_sum(add_numbers(a,b)), digit_sum(add_numbers(c,d)))",
      c: "struct Node a={2,NULL}, a4={4,NULL}, a3={3,NULL}, b={5,NULL}, b6={6,NULL}, b4={4,NULL}, c={9,NULL}, c2={9,NULL}, d={1,NULL}; a.next=&a4; a4.next=&a3; b.next=&b6; b6.next=&b4; c.next=&c2; printf(\"%d %d\", digit_sum(add_numbers(&a,&b)), digit_sum(add_numbers(&c,&d)));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node addNumbers(Node a, Node b) {
        Node dummy = new Node(0), tail = dummy; int carry = 0;
        while (a != null || b != null || carry > 0) {
            int sum = carry;
            if (a != null) { sum += a.val; a = a.next; }
            if (b != null) { sum += b.val; b = b.next; }
            tail.next = new Node(sum % 10);
            tail = tail.next; carry = sum / 10;
        }
        return dummy.next;
    }
    static int digitSum(Node n) { int s=0; while(n!=null){s+=n.val;n=n.next;} return s; }
}
`,
      bugs: { 10: { was: "tail = tail.next;", buggy: "            tail = new Node(sum % 10);" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def add_numbers(a, b):
    dummy = Node(0)
    tail = dummy
    carry = 0
    while a is not None or b is not None or carry:
        total = carry
        if a is not None:
            total += a.val
            a = a.next
        if b is not None:
            total += b.val
            b = b.next
        tail.next = Node(total % 10)
        tail = tail.next
        carry = total // 10
    return dummy.next

def digit_sum(node):
    total = 0
    while node is not None:
        total += node.val
        node = node.next
    return total
`,
      bugs: { 18: { was: "tail = tail.next", buggy: "        tail = Node(total % 10)" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next; };
struct Node *add_numbers(struct Node *a, struct Node *b) {
    struct Node dummy={0,NULL}, *tail=&dummy; int carry=0;
    while (a != NULL || b != NULL || carry) {
        int sum=carry;
        if (a) { sum+=a->val; a=a->next; }
        if (b) { sum+=b->val; b=b->next; }
        tail->next=(struct Node*)malloc(sizeof(struct Node));
        tail->next->val=sum%10; tail->next->next=NULL;
        tail=tail->next; carry=sum/10;
    }
    return dummy.next;
}
int digit_sum(struct Node *n) { int s=0; while(n){s+=n->val;n=n->next;} return s; }
`,
      bugs: { 10: { was: "tail=tail->next;", buggy: "        tail=(struct Node*)malloc(sizeof(struct Node)); carry=sum/10;" } },
    }
  },
});
