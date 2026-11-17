import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p019',
  title: 'Range sum misses one element',
  difficulty: 'Hard',
  topic: 'Advanced Data Structures',
  subtopic: 'Fenwick Tree',
  tags: ['Fenwick Tree', 'Prefix Sums'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Binary indexed tree range queries',
  description: 'A Fenwick tree stores point updates and answers prefix sums. range(l, r) should return the sum of elements from index l to index r inclusive, but it returns too little.',
  constraints: ['0-indexed positions', 'l <= r'],
  examples: [{ input: 'values = [1, 2, 3, 4, 5], range(1, 3)', output: '9', note: 'The buggy code returns 7.' }],
  hints: ['prefix(i) includes index i. Which prefix should be subtracted to remove everything before l?'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  explanation: {
    overview: 'Support fast point updates and range sums.',
    algorithm: 'prefix(i) returns the sum of indices 0 through i. The sum from l to r is prefix(r) minus the sum of everything strictly before l, which is prefix(l - 1).',
    bug: 'range subtracts prefix(l) instead of prefix(l - 1).',
    whyItFails: 'prefix(l) already includes the element at l, so subtracting it removes that element from the answer as well.',
    failingTestCase: 'values [1,2,3,4,5], range(1, 3): prefix(3) = 10 and prefix(1) = 3 gives 7, but 2 + 3 + 4 = 9.',
    fix: 'Subtract prefix(l - 1).',
    whyFixWorks: 'prefix(l - 1) covers exactly the indices before l, so only l through r remain. prefix(-1) correctly returns 0.',
    dryRun: 'prefix(3) = 1+2+3+4 = 10. prefix(0) = 1. 10 - 1 = 9.',
    debuggingLesson: 'With inclusive prefixes, the lower bound is l - 1. Check the first index (l = 0) as well.',
  },
  testCases: [{ input: '[1, 2, 3, 4, 5], range(1, 3)', expected: '9', buggyOutput: '7' }],
  harness: {
    expected: '9 15',
    driver: {
      java: `Solution.Fenwick f = new Solution.Fenwick(5);\nint[] v = {1, 2, 3, 4, 5};\nfor (int i = 0; i < 5; i++) { f.add(i, v[i]); }\nSystem.out.println(f.range(1, 3) + " " + f.range(0, 4));`,
      python: `f = Fenwick(5)\nfor i, x in enumerate([1, 2, 3, 4, 5]):\n    f.add(i, x)\nprint(f.range(1, 3), f.range(0, 4))`,
      c: `Fenwick f = {5, {0}};\nint v[] = {1, 2, 3, 4, 5};\nfor (int i = 0; i < 5; i++) { add(&f, i, v[i]); }\nprintf("%d %d", range(&f, 1, 3), range(&f, 0, 4));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static class Fenwick {
        int[] tree;
        int n;

        Fenwick(int n) {
            this.n = n;
            this.tree = new int[n + 1];
        }

        void add(int i, int delta) {
            for (i++; i <= n; i += i & -i) {
                tree[i] += delta;
            }
        }

        int prefix(int i) {
            int sum = 0;
            for (i++; i > 0; i -= i & -i) {
                sum += tree[i];
            }
            return sum;
        }

        int range(int l, int r) {
            return prefix(r) - prefix(l - 1);
        }
    }
}
`,
      bugs: { 26: { was: 'l - 1', buggy: 'return prefix(r) - prefix(l);' } },
    },
    python: {
      correct: `
class Fenwick:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def add(self, i, delta):
        i += 1
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i

    def prefix(self, i):
        i += 1
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total

    def range(self, l, r):
        return self.prefix(r) - self.prefix(l - 1)
`,
      bugs: { 21: { was: 'l - 1', buggy: 'return self.prefix(r) - self.prefix(l)' } },
    },
    c: {
      correct: `
typedef struct {
    int n;
    int tree[100];
} Fenwick;

void add(Fenwick *f, int i, int delta) {
    for (i++; i <= f->n; i += i & -i) {
        f->tree[i] += delta;
    }
}

int prefix(Fenwick *f, int i) {
    int sum = 0;
    for (i++; i > 0; i -= i & -i) {
        sum += f->tree[i];
    }
    return sum;
}

int range(Fenwick *f, int l, int r) {
    return prefix(f, r) - prefix(f, l - 1);
}
`,
      bugs: { 21: { was: 'l - 1', buggy: 'return prefix(f, r) - prefix(f, l);' } },
    },
  },
});
