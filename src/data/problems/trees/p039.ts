import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p039',
  title: 'The zigzag starts on the wrong side',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Zigzag Levels',
  tags: ['Zigzag', 'Level Order', 'Direction'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Zigzag level order traversal pattern',
  description:
    'Return node values level by level, alternating the reading direction on each level. The code reverses the wrong levels.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 3]', output: '1 3 2' },
  ],
  hints: ['Trace the direction flag before the second level is printed.', 'Check whether the condition tests the flag directly or its opposite.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Print levels in alternating left-to-right and right-to-left order.',
    algorithm:
      'Collect each level into a small array. Print it forward when the flag is true and backward when it is false, then flip the flag.',
    bug: 'The direction condition is negated, so the first level and every later level use the opposite direction.',
    whyItFails:
      'The first level has one value so it looks unchanged, but the second level is printed forward instead of backward.',
    failingTestCase: 'root = [1, 2, 3]: the code returns 1 2 3 instead of 1 3 2.',
    fix: 'Test the direction flag directly.',
    whyFixWorks: 'The true flag then means left-to-right and false means right-to-left as intended.',
    dryRun:
      'Level 0: [1]. Flip to false. Level 1: [2,3] should be printed 3 2. The buggy condition prints 2 3.',
    debuggingLesson:
      'For alternating directions, trace the flag before and after the first two levels.',
  },
  testCases: [
    { input: 'root = [1, 2, 3]', expected: '1 3 2', buggyOutput: '1 2 3' },
  ],
  harness: {
    expected: '1 3 2',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); System.out.println(Solution.zigzag(r));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); print(zigzag(r))`,
      c: `char out[100]; out[0]=0; struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}; a.left=&b; a.right=&c; zigzag(&a, out); printf("%s", out);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static String zigzag(TreeNode root) {
        if (root == null) return "";
        TreeNode[] q = new TreeNode[100];
        int head = 0, tail = 0;
        q[tail++] = root;
        StringBuilder sb = new StringBuilder();
        boolean leftToRight = true;
        while (head < tail) {
            int size = tail - head;
            int[] vals = new int[size];
            for (int i = 0; i < size; i++) {
                TreeNode cur = q[head++];
                vals[i] = cur.val;
                if (cur.left != null) q[tail++] = cur.left;
                if (cur.right != null) q[tail++] = cur.right;
            }
            if (leftToRight) {
                for (int i = 0; i < size; i++) sb.append(vals[i]).append(' ');
            } else {
                for (int i = size - 1; i >= 0; i--) sb.append(vals[i]).append(' ');
            }
            leftToRight = !leftToRight;
        }
        return sb.toString().trim();
    }
}
`,
      bugs: { 19: { was: 'if (leftToRight) {', buggy: 'if (!leftToRight) {' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def zigzag(root):
    if root is None:
        return ''
    q = []
    head = 0
    q.append(root)
    out = []
    left_to_right = True
    while head < len(q):
        size = len(q) - head
        vals = []
        for i in range(size):
            cur = q[head]
            head += 1
            vals.append(cur.val)
            if cur.left is not None: q.append(cur.left)
            if cur.right is not None: q.append(cur.right)
        if left_to_right:
            out.extend(str(v) for v in vals)
        else:
            out.extend(str(v) for v in reversed(vals))
        left_to_right = not left_to_right
    return ' '.join(out)
`,
      bugs: { 24: { was: 'if left_to_right:', buggy: '        if not left_to_right:' } },
    },
    c: {
      correct: `
#include <string.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

void zigzag(struct TreeNode *root, char *out) {
    if (root == 0) return;
    struct TreeNode *q[100];
    int head = 0, tail = 0;
    q[tail++] = root;
    int left_to_right = 1;
    while (head < tail) {
        int size = tail - head;
        int vals[100];
        for (int i = 0; i < size; i++) {
            struct TreeNode *cur = q[head++];
            vals[i] = cur->val;
            if (cur->left != 0) q[tail++] = cur->left;
            if (cur->right != 0) q[tail++] = cur->right;
        }
        if (left_to_right) {
            for (int i = 0; i < size; i++) sprintf(out + strlen(out), "%d ", vals[i]);
        } else {
            for (int i = size - 1; i >= 0; i--) sprintf(out + strlen(out), "%d ", vals[i]);
        }
        left_to_right = !left_to_right;
    }
}
`,
      bugs: { 19: { was: 'if (left_to_right) {', buggy: 'if (!left_to_right) {' } },
    },
  },
});
