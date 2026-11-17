import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p043',
  title: 'The kth value lands one too early',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Kth Smallest',
  tags: ['Kth Smallest', 'Ordered Tree', 'Counter'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Kth smallest element in BST using inorder counter pattern',
  description:
    'Return the kth value in sorted order from an ordered tree. The code records the answer one position too early.',
  constraints: ['1 <= k <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [3, 1, 4, null, 2], k = 2', output: '2' },
  ],
  hints: ['Trace the counter value when each node is visited.', 'Check the comparison between the counter and k after incrementing.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Find the kth smallest value by visiting nodes in sorted order.',
    algorithm:
      'Walk the left side, then increment a counter for the current node, record the value when the counter reaches k, then walk the right side.',
    bug: 'The code records the answer when the counter equals k minus one.',
    whyItFails:
      'It saves the previous value, so the final answer is one position before the requested position.',
    failingTestCase: 'Sorted values 1, 2, 3, 4 with k = 2: the code returns 1 instead of 2.',
    fix: 'Compare the counter directly with k.',
    whyFixWorks: 'After incrementing, the counter exactly represents the current position.',
    dryRun:
      'Visit 1: count becomes 1, not k. Visit 2: count becomes 2 and k is 2, so answer is 2.',
    debuggingLesson:
      'When a counter is updated before a comparison, verify whether the comparison uses the old or new value.',
  },
  testCases: [
    { input: 'root = [3, 1, 4, null, 2], k = 2', expected: '2', buggyOutput: '1' },
  ],
  harness: {
    expected: '2',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(3); r.left = new Solution.TreeNode(1); r.left.right = new Solution.TreeNode(2); r.right = new Solution.TreeNode(4); System.out.println(Solution.kthSmallest(r, 2));`,
      python: `r = TreeNode(3); r.left = TreeNode(1); r.left.right = TreeNode(2); r.right = TreeNode(4); print(kth_smallest(r, 2))`,
      c: `struct TreeNode a={3,0,0}, b={1,0,0}, c={2,0,0}, d={4,0,0}; a.left=&b; a.right=&d; b.right=&c; printf("%d", kth_smallest(&a, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static int count = 0;
    static int answer = 0;
    static void walk(TreeNode node, int k) {
        if (node == null) return;
        walk(node.left, k);
        count++;
        if (count == k) answer = node.val;
        walk(node.right, k);
    }
    static int kthSmallest(TreeNode root, int k) {
        count = 0;
        answer = 0;
        walk(root, k);
        return answer;
    }
}
`,
      bugs: { 9: { was: 'if (count == k) answer = node.val;', buggy: 'if (count == k - 1) answer = node.val;' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

count = 0
answer = 0

def walk(node, k):
    global count, answer
    if node is None:
        return
    walk(node.left, k)
    count += 1
    if count == k:
        answer = node.val
    walk(node.right, k)

def kth_smallest(root, k):
    global count, answer
    count = 0
    answer = 0
    walk(root, k)
    return answer
`,
      bugs: { 16: { was: 'if count == k:', buggy: '    if count == k - 1:' } },
    },
    c: {
      correct: `
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };
int count = 0;
int answer = 0;
void walk(struct TreeNode *node, int k) {
    if (node == 0) return;
    walk(node->left, k);
    count++;
    if (count == k) answer = node->val;
    walk(node->right, k);
}
int kth_smallest(struct TreeNode *root, int k) {
    count = 0;
    answer = 0;
    walk(root, k);
    return answer;
}
`,
      bugs: { 8: { was: 'if (count == k) answer = node->val;', buggy: 'if (count == k - 1) answer = node->val;' } },
    },
  },
});
