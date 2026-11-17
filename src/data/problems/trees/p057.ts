import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p057",
  title: "The selected rank arrives one visit too late",
  difficulty: "Medium",
  topic: "Trees",
  subtopic: "Kth Smallest in a Binary Search Tree",
  tags: ["Inorder Order", "Rank Selection"],
  bugCategory: "Off-by-one Error",
  sourceInspiredBy: "Kth smallest element in a binary search tree pattern",
  description: "Return the value that appears at position k when the tree values are arranged in increasing order.",
  constraints: ["All node values are distinct.", "1 <= k <= number of nodes."],
  examples: [
    { input: "root = [4, 2, 6, 1, 3, 5, 7], k = 3", output: "3" },
    { input: "root = [4, 2, 6, 1, 3, 5, 7], k = 1", output: "1" }
  ],
    hints: ["Count a node at the moment it is taken from the pending nodes.", "Trace the counter for k = 1 before moving to the next branch."],
  complexity: { time: "O(h + k)", space: "O(h)" },
  explanation: {
    overview: "Select the kth value in ascending order from a binary search tree.",
    algorithm: "Iteratively visit nodes in increasing order using a stack. Increment the visit count when a node is popped and return as soon as the count equals k.",
    bug: "The comparison waits for k + 1 visited nodes.",
    whyItFails: "The current node is already the kth visited node when the counter equals k. Waiting for one additional visit shifts every answer forward.",
    failingTestCase: "For the values 1 through 7 and k = 3, the correct answer is 3; the buggy code returns 4.",
    fix: "Return when the visited count equals k.",
    whyFixWorks: "The stack traversal visits values in sorted order, so its kth pop is exactly the kth smallest value.",
    dryRun: "The visit sequence is 1, 2, 3, 4, 5, 6, 7. With k = 3, the counter reaches 3 while visiting value 3; that value must be returned immediately.",
    debuggingLesson: "For rank-based loops, specify whether the counter is zero-based or one-based and test the smallest valid rank."
  },
  testCases: [
    { input: "[4,2,6,1,3,5,7], 3", expected: "3" },
    { input: "[4,2,6,1,3,5,7], 1", expected: "1" }
  ],
  harness: {
    expected: "3 1",
    driver: {
      java: "Solution.Node r=new Solution.Node(4); r.left=new Solution.Node(2); r.right=new Solution.Node(6); r.left.left=new Solution.Node(1); r.left.right=new Solution.Node(3); r.right.left=new Solution.Node(5); r.right.right=new Solution.Node(7); System.out.print(Solution.kthSmallest(r,3)+\" \"+Solution.kthSmallest(r,1));",
      python: "r=Node(4); r.left=Node(2); r.right=Node(6); r.left.left=Node(1); r.left.right=Node(3); r.right.left=Node(5); r.right.right=Node(7); print(kth_smallest(r,3), kth_smallest(r,1))",
      c: "struct Node r={4,NULL,NULL}, n2={2,NULL,NULL}, n6={6,NULL,NULL}, n1={1,NULL,NULL}, n3={3,NULL,NULL}, n5={5,NULL,NULL}, n7={7,NULL,NULL}; r.left=&n2; r.right=&n6; n2.left=&n1; n2.right=&n3; n6.left=&n5; n6.right=&n7; printf(\"%d %d\", kth_smallest(&r,3), kth_smallest(&r,1));"
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int kthSmallest(Node root, int k) {
        Deque<Node> stack = new ArrayDeque<>(); Node cur = root; int seen = 0;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop(); seen++;
            if (seen == k) return cur.val;
            cur = cur.right;
        }
        return -1;
    }
}
`,
      bugs: { 9: { was: "if (seen == k) return cur.val;", buggy: "            if (seen == k + 1) return cur.val;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def kth_smallest(root, k):
    stack = []
    cur = root
    seen = 0
    while cur is not None or stack:
        while cur is not None:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        seen += 1
        if seen == k:
            return cur.val
        cur = cur.right
    return -1
`,
      bugs: { 15: { was: "if seen == k:", buggy: "        if seen == k + 1:" } },
    },
    c: {
      correct: `
struct Node { int val; struct Node *left, *right; };
int kth_smallest(struct Node *root, int k) {
    struct Node *stack[128]; int top=-1, seen=0;
    struct Node *cur=root;
    while (cur != NULL || top >= 0) {
        while (cur != NULL) { stack[++top]=cur; cur=cur->left; }
        cur=stack[top--]; seen++;
        if (seen == k) return cur->val;
        cur=cur->right;
    }
    return -1;
}
`,
      bugs: { 8: { was: "if (seen == k) return cur->val;", buggy: "        if (seen == k + 1) return cur->val;" } },
    }
  },
});
