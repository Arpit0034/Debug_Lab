import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p040',
  title: 'A missing child vanishes from the record',
  difficulty: 'Medium',
  topic: 'Trees',
  subtopic: 'Serialization',
  tags: ['Serialization', 'Null Marker', 'Edge Case'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Serialize binary tree with null markers pattern',
  description:
    'Return a textual record of the node structure that keeps empty child positions visible. The code skips empty positions, so the record is ambiguous.',
  constraints: ['0 <= number of nodes <= 10000'],
  examples: [
    { input: 'root = [1, 2, 3]', output: '1 2 # # 3 # #' },
  ],
  hints: ['Compare the record for a leaf with the record for an empty child.', 'Check what is written when a child link is empty.'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  explanation: {
    overview: 'Record every node and every empty child position in a fixed format.',
    algorithm:
      'Append the current value, then recurse into both children. When a child is empty, append a marker and return.',
    bug: 'For an empty child the code returns immediately without appending the marker.',
    whyItFails:
      'Missing markers remove the shape information, so different structures can produce the same record.',
    failingTestCase: 'root = [1, 2, 3]: the code returns 1 2 3 instead of 1 2 # # 3 # #.',
    fix: 'Append the marker before returning for an empty child.',
    whyFixWorks: 'Each empty position is then represented explicitly.',
    dryRun:
      'Node 1 writes 1, left 2 writes 2 and two markers, right 3 writes 3 and two markers.',
    debuggingLesson:
      'Serialization formats need explicit markers for absent children.',
  },
  testCases: [
    { input: 'root = [1, 2, 3]', expected: '1 2 # # 3 # #', buggyOutput: '1 2 3' },
  ],
  harness: {
    expected: '1 2 # # 3 # #',
    driver: {
      java: `Solution.TreeNode r = new Solution.TreeNode(1); r.left = new Solution.TreeNode(2); r.right = new Solution.TreeNode(3); System.out.println(Solution.serialize(r));`,
      python: `r = TreeNode(1); r.left = TreeNode(2); r.right = TreeNode(3); print(serialize(r))`,
      c: `char out[100]; out[0]=0; struct TreeNode a={1,0,0}, b={2,0,0}, c={3,0,0}; a.left=&b; a.right=&c; ser(&a, out); printf("%s", out);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }
    static void ser(TreeNode node, StringBuilder sb) {
        if (node == null) { sb.append("# "); return; }
        sb.append(node.val).append(' ');
        ser(node.left, sb);
        ser(node.right, sb);
    }
    static String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        ser(root, sb);
        return sb.toString().trim();
    }
}
`,
      bugs: { 4: { was: 'if (node == null) { sb.append("# "); return; }', buggy: 'if (node == null) { return; }' } },
    },
    python: {
      correct: `
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def ser(node, out):
    if node is None:
        out.append('#')
        return
    out.append(str(node.val))
    ser(node.left, out)
    ser(node.right, out)

def serialize(root):
    out = []
    ser(root, out)
    return ' '.join(out)
`,
      bugs: { 9: { was: "out.append('#')", buggy: '        pass' } },
    },
    c: {
      correct: `
#include <string.h>
struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

void ser(struct TreeNode *node, char *out) {
    if (node == 0) {
        sprintf(out + strlen(out), "# ");
        return;
    }
    sprintf(out + strlen(out), "%d ", node->val);
    ser(node->left, out);
    ser(node->right, out);
}
`,
      bugs: { 6: { was: 'sprintf(out + strlen(out), "# ");', buggy: '        ;' } },
    },
  },
});
