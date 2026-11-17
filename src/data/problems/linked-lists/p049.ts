import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p049",
  title: "Equal heads cause one legitimate copy to disappear",
  difficulty: "Medium",
  topic: "Linked Lists",
  subtopic: "Merge Sorted Lists with Duplicates",
  tags: ["Sorted Merge", "Duplicate Preservation"],
  bugCategory: "Incorrect Duplicate Handling",
  sourceInspiredBy: "Merge two sorted linked lists while preserving multiplicity pattern",
  description: "Merge two sorted lists into one sorted list and return its decimal signature. Every input node must appear in the result.",
  constraints: ["Each list is sorted in non-decreasing order.", "Node values are single digits."],
  examples: [
    { input: "a = [1, 2, 2], b = [2, 3]", output: "12223" },
    { input: "a = [1, 3], b = [2, 4]", output: "1234" }
  ],
  hints: ["Equal values in separate lists still represent two input nodes.", "Count how many copies of 2 exist before and after the merge."],
  complexity: { time: "O(m+n)", space: "O(1) additional nodes except when values are equal" },
  explanation: {
    overview: "Combine two sorted linked lists while retaining every value occurrence.",
    algorithm: "Repeatedly attach the smaller head. When both heads are equal, append one output node for each input occurrence and advance both lists, then attach the remaining suffix.",
    bug: "The equal-value case advances both input pointers after appending only one node.",
    whyItFails: "Two equal values are still two separate occurrences in the merged multiset. Advancing both pointers after one append drops one copy.",
    failingTestCase: "Merging [1,2,2] and [2,3] must produce [1,2,2,2,3] with signature 12223. The buggy code drops one 2 and returns 1223.",
    fix: "Append two equal-valued nodes, or advance only one input pointer for each appended node.",
    whyFixWorks: "Every append consumes exactly one source node, so the total number of output nodes equals the combined input lengths.",
    dryRun: "After appending 1, the heads are 2 and 2. Append one 2 and advance one list only. The next heads are 2 and 2 again; append the second 2, then the remaining 2 from the other list, followed by 3.",
    debuggingLesson: "For merge operations, preserve multiplicity as well as sorted order; equal keys do not mean the source records are duplicates."
  },
  testCases: [
    { input: "[1,2,2], [2,3]", expected: "12223" },
    { input: "[1,3], [2,4]", expected: "1234" }
  ],
  harness: {
    expected: "12223 1234",
    driver: {
      java: "Solution.Node a=new Solution.Node(1); a.next=new Solution.Node(2); a.next.next=new Solution.Node(2); Solution.Node b=new Solution.Node(2); b.next=new Solution.Node(3); Solution.Node c=new Solution.Node(1); c.next=new Solution.Node(3); Solution.Node d=new Solution.Node(2); d.next=new Solution.Node(4); System.out.print(Solution.signature(Solution.mergeSorted(a,b))+\" \"+Solution.signature(Solution.mergeSorted(c,d)));",
      python: "a=Node(1); a.next=Node(2); a.next.next=Node(2); b=Node(2); b.next=Node(3); c=Node(1); c.next=Node(3); d=Node(2); d.next=Node(4); print(signature(merge_sorted(a,b)), signature(merge_sorted(c,d)))",
      c: "struct Node a={1,NULL}, a2={2,NULL}, a3={2,NULL}, b={2,NULL}, b3={3,NULL}, c={1,NULL}, c3={3,NULL}, d={2,NULL}, d4={4,NULL}; a.next=&a2; a2.next=&a3; b.next=&b3; c.next=&c3; d.next=&d4; printf(\"%d %d\", signature(merge_sorted(&a,&b)), signature(merge_sorted(&c,&d)));"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node mergeSorted(Node a, Node b) {
        Node dummy=new Node(0), tail=dummy;
        while(a!=null && b!=null){
            if(a.val==b.val){tail.next=new Node(a.val);a=a.next;}
            else if(a.val<b.val){tail.next=a;a=a.next;}
            else{tail.next=b;b=b.next;}
            tail=tail.next;
        }
        tail.next=a!=null?a:b; return dummy.next;
    }
    static int signature(Node n) { int s=0; while(n!=null){s=s*10+n.val;n=n.next;} return s; }
}
`,
      bugs: { 6: { was: "if(a.val==b.val){tail.next=new Node(a.val);a=a.next;}", buggy: "            if(a.val==b.val){tail.next=new Node(a.val);a=a.next;b=b.next;}" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def merge_sorted(a, b):
    dummy = Node(0)
    tail = dummy
    while a is not None and b is not None:
        if a.val == b.val:
            tail.next = Node(a.val)
            a = a.next
        elif a.val < b.val:
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
    tail.next = a if a is not None else b
    return dummy.next

def signature(node):
    value = 0
    while node is not None:
        value = value * 10 + node.val
        node = node.next
    return value
`,
      bugs: { 10: { was: "tail.next = Node(a.val)", buggy: "            tail.next = Node(a.val); b = b.next" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *next; };
struct Node *merge_sorted(struct Node *a, struct Node *b) {
    struct Node dummy={0,NULL}, *tail=&dummy;
    while(a && b){
        if(a->val==b->val){tail->next=malloc(sizeof(struct Node));tail->next->val=a->val;tail->next->next=NULL;a=a->next;}
        else if(a->val<b->val){tail->next=a;a=a->next;}
        else{tail->next=b;b=b->next;}
        tail=tail->next;
    }
    tail->next=a?a:b; return dummy.next;
}
int signature(struct Node *n) { int s=0; while(n){s=s*10+n->val;n=n->next;} return s; }
`,
      bugs: { 5: { was: "if(a->val==b->val){tail->next=malloc(sizeof(struct Node));tail->next->val=a->val;tail->next->next=NULL;a=a->next;}", buggy: "        if(a->val==b->val){tail->next=malloc(sizeof(struct Node));tail->next->val=a->val;tail->next->next=NULL;a=a->next;b=b->next;}" } },
    }
  },
});
