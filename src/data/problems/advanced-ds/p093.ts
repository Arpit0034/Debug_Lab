import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p093',
  title: 'Compression points to the wrong root',
  difficulty: 'Easy',
  topic: 'Advanced Data Structures',
  subtopic: 'Union-Find Path Compression',
  tags: ['Union-Find', 'Path Compression', 'Root'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'Recursive path compression in a disjoint-set structure',
  description:
    'Return the parent pointer of a node after finding its set representative. The compression step assigns the node to itself instead of to its root.',
  constraints: ['1 <= n <= 100', 'The parent array forms a tree'],
  examples: [
    { input: 'parent = [0,0,1,2], node = 3', output: '0' },
  ],
  hints: ['Compression should connect the node directly to the representative.', 'The right-hand side must be the recursive find result.'],
  complexity: { time: 'O(alpha(n))', space: 'O(n)' },
  explanation: {
    overview: 'Perform path compression in a union-find structure.',
    algorithm: 'Recursively find the root of the parent, assign it to the current node, and return it.',
    bug: 'The code assigns p[x] = p[x] instead of p[x] = find(p, p[x]).',
    whyItFails: 'The node is not connected to the root, and the function returns its immediate parent rather than the representative.',
    failingTestCase: 'For parent [0,0,1,2] and node 3, the code leaves parent[3]=2 instead of compressing it to 0.',
    fix: 'Assign p[x] = find(p, p[x]).',
    whyFixWorks: 'The recursive call returns the true root, and every node on the path is pointed directly to it.',
    dryRun: '3 points to 2, 2 points to 1, and 1 points to 0. Correct compression sets 3,2,1 all to 0. Buggy code sets p[3]=p[3] and returns 2.',
    debuggingLesson: 'Path compression must store the result of the recursive find, not the old parent again.',
  },
  testCases: [
    { input: '[0,0,1,2], 3', expected: '0', buggyOutput: '2' },
  ],
  harness: {
    expected: '0',
    driver: {
      java: `int[] p = {0,0,1,2}; Solution.find(p, 3); System.out.print(p[3]);`,
      python: `p = [0,0,1,2]; find(p, 3); print(p[3])`,
      c: `int p[4] = {0,0,1,2}; find_compress(p, 3); printf("%d", p[3]);`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int find(int[] p, int x) {
        if (p[x] != x) {
            p[x] = find(p, p[x]);
        }
        return p[x];
    }
}
`,
      bugs: { 4: { was: 'p[x] = find(p, p[x])', buggy: 'p[x] = p[x];' } },
    },
    python: {
      correct: `
def find(p, x):
    if p[x] != x:
        p[x] = find(p, p[x])
    return p[x]
`,
      bugs: { 3: { was: 'p[x] = find(p, p[x])', buggy: 'p[x] = p[x]' } },
    },
    c: {
      correct: `
int find_compress(int p[], int x) {
    if (p[x] != x) {
        p[x] = find_compress(p, p[x]);
    }
    return p[x];
}
`,
      bugs: { 3: { was: 'p[x] = find_compress(p, p[x])', buggy: 'p[x] = p[x];' } },
    },
  },
});
