import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p091',
  title: 'The update adds instead of replaces',
  difficulty: 'Medium',
  topic: 'Advanced Data Structures',
  subtopic: 'Segment Tree Point Update',
  tags: ['Segment Tree', 'Point Update', 'Sum'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Point update on a segment tree',
  description:
    'Return the total sum after changing one array position to a new value. The leaf update adds the new value instead of replacing the old one.',
  constraints: ['1 <= n <= 1000', 'The update value fits in 32-bit integers'],
  examples: [
    { input: 'a = [1,2,3,4], update index 2 to 10', output: '17' },
  ],
  hints: ['A point update sets a new value, not an increment.', 'Look at what happens when the recursion reaches a single element.'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  explanation: {
    overview: 'Build a segment tree, replace one element, and return the new total sum.',
    algorithm: 'Build the tree from the array. For an update, recurse to the leaf and set its value, then recompute ancestors.',
    bug: 'At the leaf, the code adds val to the existing value instead of assigning val.',
    whyItFails: 'The updated position becomes old + val, so the root sum is too large.',
    failingTestCase: 'For [1,2,3,4] updating index 2 to 10, the code returns 20 instead of 17.',
    fix: 'Assign tree[node] = val at the leaf.',
    whyFixWorks: 'The leaf now stores exactly the new value, and ancestor sums are recomputed from correct children.',
    dryRun: 'The old leaf at index 2 is 3. Correct replacement sets it to 10, total 1+2+10+4=17. Buggy addition sets it to 13, total 20.',
    debuggingLesson: 'Distinguish point assignment from range addition when writing update routines.',
  },
  testCases: [
    { input: '[1,2,3,4], 2, 10', expected: '17', buggyOutput: '20' },
  ],
  harness: {
    expected: '17',
    driver: {
      java: `System.out.print(Solution.sumAfterUpdate(new int[]{1,2,3,4}));`,
      python: `print(sum_after_update([1,2,3,4]))`,
      c: `printf("%d", sum_after_update((int[]){1,2,3,4}, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] tree;
    static void build(int[] a, int node, int l, int r) {
        if (l == r) {
            tree[node] = a[l];
            return;
        }
        int mid = (l + r) / 2;
        build(a, node * 2 + 1, l, mid);
        build(a, node * 2 + 2, mid + 1, r);
        tree[node] = tree[node * 2 + 1] + tree[node * 2 + 2];
    }
    static void update(int node, int l, int r, int idx, int val) {
        if (l == r) {
            tree[node] = val;
            return;
        }
        int mid = (l + r) / 2;
        if (idx <= mid) update(node * 2 + 1, l, mid, idx, val);
        else update(node * 2 + 2, mid + 1, r, idx, val);
        tree[node] = tree[node * 2 + 1] + tree[node * 2 + 2];
    }
    static int sumAfterUpdate(int[] a) {
        tree = new int[4 * a.length];
        build(a, 0, 0, a.length - 1);
        update(0, 0, a.length - 1, 2, 10);
        return tree[0];
    }
}
`,
      bugs: { 15: { was: 'tree[node] = val', buggy: 'tree[node] += val;' } },
    },
    python: {
      correct: `
def sum_after_update(a):
    tree = [0] * (4 * len(a))
    def build(node, l, r):
        if l == r:
            tree[node] = a[l]
            return
        mid = (l + r) // 2
        build(node * 2 + 1, l, mid)
        build(node * 2 + 2, mid + 1, r)
        tree[node] = tree[node * 2 + 1] + tree[node * 2 + 2]
    def update(node, l, r, idx, val):
        if l == r:
            tree[node] = val
            return
        mid = (l + r) // 2
        if idx <= mid:
            update(node * 2 + 1, l, mid, idx, val)
        else:
            update(node * 2 + 2, mid + 1, r, idx, val)
        tree[node] = tree[node * 2 + 1] + tree[node * 2 + 2]
    build(0, 0, len(a) - 1)
    update(0, 0, len(a) - 1, 2, 10)
    return tree[0]
`,
      bugs: { 13: { was: 'tree[node] = val', buggy: 'tree[node] += val' } },
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

void seg_update(int node, int l, int r, int idx, int val) {
    if (l == r) {
        seg_tree[node] = val;
        return;
    }
    int mid = (l + r) / 2;
    if (idx <= mid) seg_update(node * 2 + 1, l, mid, idx, val);
    else seg_update(node * 2 + 2, mid + 1, r, idx, val);
    seg_tree[node] = seg_tree[node * 2 + 1] + seg_tree[node * 2 + 2];
}

int sum_after_update(int a[], int n) {
    seg_build(a, 0, 0, n - 1);
    seg_update(0, 0, n - 1, 2, 10);
    return seg_tree[0];
}
`,
      bugs: { 16: { was: 'seg_tree[node] = val', buggy: 'seg_tree[node] += val;' } },
    },
  },
});
