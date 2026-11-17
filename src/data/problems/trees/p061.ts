import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: "p061",
  title: "Single-element slices disappear during reconstruction",
  difficulty: "Hard",
  topic: "Trees",
  subtopic: "Build Tree from Preorder and Inorder",
  tags: ["Tree Construction", "Recursive Ranges"],
  bugCategory: "Incorrect Recursion Base Case",
  sourceInspiredBy: "Binary tree reconstruction from preorder and inorder pattern",
  description: "Construct the unique binary tree described by its preorder and inorder traversals. Return the value of the right child of the left child, or -1 when that position is empty.",
  constraints: ["All values are distinct.", "Both traversals describe the same tree."],
  examples: [
    { input: "preorder = [3, 1, 2], inorder = [1, 2, 3]", output: "2" },
    { input: "preorder = [2, 1, 3], inorder = [1, 2, 3]", output: "-1" }
  ],
  hints: ["A range containing one index still represents one real node.", "Trace the recursive call whose lower and upper indices are equal."],
  complexity: { time: "O(n²)", space: "O(n)" },
  explanation: {
    overview: "Reconstruct a binary tree from its preorder and inorder sequences, then inspect one structural position.",
    algorithm: "The next preorder value is the root of the current range. Find that value in the matching inorder range; values before it form the left subtree and values after it form the right subtree.",
    bug: "The base case stops when the range has one index as well as when it is empty.",
    whyItFails: "A singleton range contains exactly one node and must be constructed. Treating it as empty drops leaves and can also remove the bottom of longer branches.",
    failingTestCase: "For preorder [3,1,2] and inorder [1,2,3], node 2 is the right child of node 1. The buggy reconstruction drops that singleton range and returns -1 for the inspected position.",
    fix: "Return null only when the lower bound is greater than the upper bound.",
    whyFixWorks: "A range with equal bounds is still non-empty and creates one node; only a crossed range represents no nodes.",
    dryRun: "The root is 3 at inorder index 2. Its left range is indices 0 through 1, whose root is 1 at index 0. The right range of node 1 is indices 1 through 1, so it must create node 2.",
    debuggingLesson: "For inclusive index ranges, an empty range is lo > hi; lo == hi is a valid one-element range."
  },
  testCases: [
    { input: "[3,1,2], [1,2,3]", expected: "2" },
    { input: "[2,1,3], [1,2,3]", expected: "-1" }
  ],
  harness: {
    expected: "2 -1",
    driver: {
      java: "int[] p={3,1,2}, i={1,2,3}; Solution.preIndex=0; Solution.Node a=Solution.buildTree(p,i,0,2); int x=(a.left!=null && a.left.right!=null)?a.left.right.val:-1; int[] p2={2,1,3}; Solution.preIndex=0; Solution.Node b=Solution.buildTree(p2,i,0,2); int y=(b.left!=null && b.left.right!=null)?b.left.right.val:-1; System.out.print(x+\" \"+y);",
      python: "a=build_tree([3,1,2],[1,2,3]); x=a.left.right.val if a.left and a.left.right else -1; b=build_tree([2,1,3],[1,2,3]); y=b.left.right.val if b.left and b.left.right else -1; print(x,y)",
      c: "int p[]={3,1,2}, in[]={1,2,3}, idx=0; struct Node *a=build_tree(p,in,0,2,&idx); int x=(a->left && a->left->right)?a->left->right->val:-1; int p2[]={2,1,3}; idx=0; struct Node *b=build_tree(p2,in,0,2,&idx); int y=(b->left && b->left->right)?b->left->right->val:-1; printf(\"%d %d\",x,y);"
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Node { int val; Node left, right; Node(int v) { val = v; } }
    static int preIndex;
    static Node buildTree(int[] pre, int[] in, int lo, int hi) {
        if (lo > hi) return null;
        int value = pre[preIndex++]; Node root = new Node(value);
        int split = lo;
        while (split <= hi && in[split] != value) split++;
        root.left = buildTree(pre, in, lo, split - 1);
        root.right = buildTree(pre, in, split + 1, hi);
        return root;
    }
}
`,
      bugs: { 5: { was: "if (lo > hi) return null;", buggy: "        if (lo >= hi) return null;" } },
    },
    python: {
      correct: `
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def build_tree(preorder, inorder):
    index = [0]
    def build(lo, hi):
        if lo > hi:
            return None
        value = preorder[index[0]]
        index[0] += 1
        root = Node(value)
        split = inorder.index(value, lo, hi + 1)
        root.left = build(lo, split - 1)
        root.right = build(split + 1, hi)
        return root
    return build(0, len(inorder) - 1)
`,
      bugs: { 8: { was: "if lo > hi:", buggy: "        if lo >= hi:" } },
    },
    c: {
      correct: `
#include <string.h>
struct Node { int val; struct Node *left, *right; };
struct Node *build_tree(int pre[], int in[], int lo, int hi, int *idx) {
    if (lo > hi) return NULL;
    struct Node *root = (struct Node*)malloc(sizeof(struct Node));
    root->val = pre[(*idx)++]; root->left = root->right = NULL;
    int split = lo;
    while (split <= hi && in[split] != root->val) split++;
    root->left = build_tree(pre, in, lo, split - 1, idx);
    root->right = build_tree(pre, in, split + 1, hi, idx);
    return root;
}
`,
      bugs: { 4: { was: "if (lo > hi) return NULL;", buggy: "    if (lo >= hi) return NULL;" } },
    }
  },
});
