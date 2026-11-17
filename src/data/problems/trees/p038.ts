import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p038',
  title: 'One level is left unread',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Level Sums',
  tags: ['Level Sums', 'Queue', 'Loop Boundary'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Level order sum per level pattern',
  description:'Return the sum of node values on each depth level, from top to bottom. The code returns an empty result even for a non-empty tree.',
    
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 3, null, null, 4]', output: '1 5 4' },
  ],
    hints: ['Trace how many nodes are pending before the first level is processed.', 'Check whether the loop should allow exactly one pending node.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Produce one sum for each depth level.',
    algorithm:
      'Use a queue. For each level, record how many nodes belong to it, remove that many nodes, add their values, and enqueue their children.',
    bug: 'The main loop continues only while more than one node is pending.',
    whyItFails:
      'A queue with one node is still valid work, so the function exits immediately for a normal tree root.',
    failingTestCase: 'root = [1, 2, 3, null, null, 4]: the code prints nothing instead of 1 5 4.',
    fix: 'Continue while the queue is non-empty.',
    whyFixWorks: 'Every pending node belongs to a level and must be processed.',
    dryRun:
      'Queue starts with root 1. With the fix, level 0 sums to 1; level 1 sums 2 + 3 = 5; level 2 sums 4.',
    debuggingLesson:
      'When using a queue, test the condition when the queue has exactly one element.',
  },
  testCases: [
    { input: 'root = [1, 2, 3, null, null, 4]', expected: '1 5 4', buggyOutput: '' },
  ],
  harness: {
    expected: '1 5 4',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.left.left = new Solution.TreeNode(4); r.right = new Solution.TreeNode(3); System.out.println(Solution.levelSums(r));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.left.left = TreeNode(4); r.right = TreeNode(3); print(level_sums(r))`,
      c: `char out[100]; out[0]=0; struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}, d={4,0,0}; a.left=&b; a.right=&c; b.left=&d; level_sums(&a, out); printf("%s", out);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static String levelSums(TreeNode root) {
        if (root == null) return "";
        TreeNode[] q = new TreeNode[100];
        int head = 0, tail = 0;
        q[tail++] = root;
        StringBuilder sb = new StringBuilder();
        while (head < tail) {
            int size = tail - head;
            int sum = 0;
            for (int i = 0; i < size; i++) {
                TreeNode cur = q[head++];
                sum += cur.val;
                if (cur.left != null) q[tail++] = cur.left;
                if (cur.right != null) q[tail++] = cur.right;
            }
            sb.append(sum).append(' ');
        }
        return sb.toString().trim();
    }
}
`,
      bugs: { 9: { was: 'while (head < tail)', buggy: '        while (head < tail - 1) {' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def level_sums(root):
    if root is None:
        return ''
    q = []
    head = 0
    q.append(root)
    out = []
    while head < len(q):
        size = len(q) - head
        total = 0
        for i in range(size):
            cur = q[head]
            head += 1
            total += cur.val
            if cur.left is not None: q.append(cur.left)
            if cur.right is not None: q.append(cur.right)
        out.append(str(total))
    return ' '.join(out)
`,
      bugs: { 14: { was: 'while head < len(q):', buggy: '    while head < len(q) - 1:' } },
    },
    c: {
      correct: `
#include <string.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

void level_sums(struct TreeNode *root, char *out) {
    if (root == 0) return;
    struct TreeNode *q[100];
    int head = 0, tail = 0;
    q[tail++] = root;
    while (head < tail) {
        int size = tail - head;
        int sum = 0;
        for (int i = 0; i < size; i++) {
            struct TreeNode *cur = q[head++];
            sum += cur->val;
            if (cur->left != 0) q[tail++] = cur->left;
            if (cur->right != 0) q[tail++] = cur->right;
        }
        sprintf(out + strlen(out), "%d ", sum);
    }
}
`,
      bugs: { 9: { was: 'while (head < tail) {', buggy: '    while (head < tail - 1) {' } },
    },
  },
});
