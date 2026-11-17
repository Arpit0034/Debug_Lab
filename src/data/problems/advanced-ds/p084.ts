import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p084',
  title: 'The update stops one index early',
  difficulty: 'Medium',
  topic: 'Advanced Data Structures',
  subtopic: 'Fenwick Tree Update',
  tags: ['Fenwick Tree', 'Prefix Sum', 'Update'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Building a Fenwick tree with point updates',
  description:
    'Return the total sum of an array after building a Fenwick tree. The update loop does not propagate to the final Fenwick index.',
  constraints: ['1 <= n <= 1000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [1,2,3,4]', output: '10' },
  ],
  hints: ['A Fenwick update must reach every node whose range contains the index.', 'The last valid tree index is n.'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Build a Fenwick tree and return the prefix sum of the whole array.',
    algorithm: 'For each array position, add its value at index i and then at i += i & -i while i <= n.',
    bug: 'The update loop uses i < n, so the node at index n is never updated.',
    whyItFails: 'The prefix query for n reads tree[n], which is missing contributions from the last update, so the total is too small.',
    failingTestCase: 'For [1,2,3,4], the code returns 6 instead of 10.',
    fix: 'Use the loop condition i <= n.',
    whyFixWorks: 'Fenwick indices are 1-based, and index n is a valid tree node that may need updating.',
    dryRun: 'Updating index 4 should add 4 to tree[4]. With i < n, the loop body does not run for i=4. The query for 4 returns 1+2+3 = 6.',
    debuggingLesson: 'Fenwick tree loops are inclusive on n; using a half-open bound drops the final tree node.',
  },
  testCases: [
    { input: '[1,2,3,4]', expected: '10', buggyOutput: '6' },
  ],
  harness: {
    expected: '10',
    driver: {
      java: `System.out.print(Solution.totalSum(new int[]{1,2,3,4}));`,
      python: `print(total_sum([1,2,3,4]))`,
      c: `printf("%d", total_sum((int[]){1,2,3,4}, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] tree;
    static void update(int i, int delta, int n) {
        while (i <= n) {
            tree[i] += delta;
            i += i & -i;
        }
    }
    static int totalSum(int[] a) {
        int n = a.length;
        tree = new int[n + 1];
        for (int i = 0; i < n; i++) update(i + 1, a[i], n);
        int sum = 0;
        for (int i = n; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
}
`,
      bugs: { 4: { was: 'i <= n', buggy: 'while (i < n) {' } },
    },
    python: {
      correct: `
def total_sum(a):
    n = len(a)
    tree = [0] * (n + 1)
    def update(i, delta):
        while i <= n:
            tree[i] += delta
            i += i & -i
    for i, x in enumerate(a):
        update(i + 1, x)
    total = 0
    i = n
    while i > 0:
        total += tree[i]
        i -= i & -i
    return total
`,
      bugs: { 5: { was: 'i <= n', buggy: 'while i < n:' } },
    },
    c: {
      correct: `
int fenwick_tree[100];

void fenwick_update(int i, int delta, int n) {
    while (i <= n) {
        fenwick_tree[i] += delta;
        i += i & -i;
    }
}

int total_sum(int a[], int n) {
    for (int i = 0; i <= n; i++) fenwick_tree[i] = 0;
    for (int i = 0; i < n; i++) fenwick_update(i + 1, a[i], n);
    int total = 0;
    int i = n;
    while (i > 0) {
        total += fenwick_tree[i];
        i -= i & -i;
    }
    return total;
}
`,
      bugs: { 4: { was: 'i <= n', buggy: 'while (i < n) {' } },
    },
  },
});
