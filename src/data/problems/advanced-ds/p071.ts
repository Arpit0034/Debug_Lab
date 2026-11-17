import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p071',
  title: 'The boundary cell is excluded',
  difficulty: 'Medium',
  topic: 'Advanced Data Structures',
  subtopic: 'Segment Tree Range Sum Query',
  tags: ['Segment Tree', 'Range Sum', 'Recursive Query'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Recursive segment tree range sum query',
  description:
    'Return the sum of an inclusive range in an array using a segment tree. The query treats ranges that touch the node boundary as fully outside.',
  constraints: ['1 <= n <= 1000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [1,2,3,4], l = 1, r = 2', output: '5' },
  ],
  hints: ['An empty intersection allows touching boundaries.', 'Compare qr with l and r with ql carefully.'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  explanation: {
    overview: 'Answer inclusive range-sum queries with a recursive segment tree.',
    algorithm: 'Recurse down the tree. Return 0 for a disjoint range and the stored value for a fully covered node, otherwise sum the two children.',
    bug: 'The disjoint condition uses <= instead of <, so single-cell ranges that sit exactly on a node boundary are treated as empty.',
    whyItFails: 'Every cell falls on some node boundary. Those cells silently contribute 0, shrinking the reported sum.',
    failingTestCase: 'For [1,2,3,4] and range [1,2], the code returns 0 instead of 5.',
    fix: 'Compare with strict inequalities: qr < l or r < ql.',
    whyFixWorks: 'Ranges that merely touch the boundary still overlap and are not dropped.',
    dryRun: 'Query [1,2] splits at root. The left child [0,1] touches ql=1, the right child [2,3] touches qr=2. With <=, both branches are pruned to 0, so the total is 0.',
    debuggingLesson: 'When pruning recursion on disjoint ranges, use strict inequalities so boundary-touching cells are not lost.',
  },
  testCases: [
    { input: '[1,2,3,4], 1, 2', expected: '5', buggyOutput: '0' },
  ],
  harness: {
    expected: '5',
    driver: {
      java: `System.out.print(Solution.rangeSum(new int[]{1,2,3,4}, 1, 2));`,
      python: `print(range_sum([1,2,3,4], 1, 2))`,
      c: `printf("%d", range_sum((int[]){1,2,3,4}, 4, 1, 2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] segTree;
    static void build(int[] a, int node, int l, int r) {
        if (l == r) {
            segTree[node] = a[l];
            return;
        }
        int mid = (l + r) / 2;
        build(a, node * 2 + 1, l, mid);
        build(a, node * 2 + 2, mid + 1, r);
        segTree[node] = segTree[node * 2 + 1] + segTree[node * 2 + 2];
    }
    static int query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) {
            return 0;
        }
        if (ql <= l && r <= qr) {
            return segTree[node];
        }
        int mid = (l + r) / 2;
        return query(node * 2 + 1, l, mid, ql, qr) + query(node * 2 + 2, mid + 1, r, ql, qr);
    }
    static int rangeSum(int[] a, int ql, int qr) {
        segTree = new int[4 * a.length];
        build(a, 0, 0, a.length - 1);
        return query(0, 0, a.length - 1, ql, qr);
    }
}
`,
      bugs: { 15: { was: 'qr < l || r < ql', buggy: 'if (qr <= l || r <= ql) {' } },
    },
    python: {
      correct: `
def range_sum(a, ql, qr):
    tree = [0] * (4 * len(a))
    def build(node, l, r):
        if l == r:
            tree[node] = a[l]
            return
        mid = (l + r) // 2
        build(node * 2 + 1, l, mid)
        build(node * 2 + 2, mid + 1, r)
        tree[node] = tree[node * 2 + 1] + tree[node * 2 + 2]
    def query(node, l, r):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return tree[node]
        mid = (l + r) // 2
        return query(node * 2 + 1, l, mid) + query(node * 2 + 2, mid + 1, r)
    build(0, 0, len(a) - 1)
    return query(0, 0, len(a) - 1)
`,
      bugs: { 13: { was: 'qr < l or r < ql', buggy: 'if qr <= l or r <= ql:' } },
    },
    c: {
      correct: `
int seg_tree[100];
void seg_build(int a[], int node, int l, int r) {
    if (l == r) {
        seg_tree[node] = a[l];
        return;
    }
    int mid = (l + r) / 2;
    seg_build(a, node * 2 + 1, l, mid);
    seg_build(a, node * 2 + 2, mid + 1, r);
    seg_tree[node] = seg_tree[node * 2 + 1] + seg_tree[node * 2 + 2];
}
int seg_query(int node, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) {
        return 0;
    }
    if (ql <= l && r <= qr) {
        return seg_tree[node];
    }
    int mid = (l + r) / 2;
    return seg_query(node * 2 + 1, l, mid, ql, qr) + seg_query(node * 2 + 2, mid + 1, r, ql, qr);
}
int range_sum(int a[], int n, int ql, int qr) {
    seg_build(a, 0, 0, n - 1);
    return seg_query(0, 0, n - 1, ql, qr);
}
`,
      bugs: { 14: { was: 'qr < l || r < ql', buggy: 'if (qr <= l || r <= ql) {' } },
    },
  },
});
