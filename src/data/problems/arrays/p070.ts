import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p070',
  title: 'Insertion lands past its target position',
  difficulty: 'Easy',
  topic: 'Arrays',
  subtopic: 'Insert at Position',
  tags: ['Insertion', 'Indexing', 'Sequence'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Insert an element at a given index in a sequence',
  description:
    'Given a sequence of values and an index k, insert a new value so that it ends up at position k in the original ordering, and return the resulting sequence.',
  constraints: ['0 <= k <= n', '1 <= n <= 1000'],
  examples: [
    { input: 'a = [1, 2, 3, 4], k = 2, val = 9', output: '1 2 9 3 4' },
  ],
  hints: ['Which position of the original sequence should the new value land in front of?', 'Trace the insertion for k = 2 and see where the new value is written.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Insert a value at a given index while preserving the order of the rest.',
    algorithm: 'Walk positions from 0 to n. Emit the new value right before the original element at position k, then continue copying the original elements.',
    bug: 'The guard that decides when to emit the new value checks i == k + 1, so the insertion lands one position later than requested.',
    whyItFails: 'The original element at index k has already been copied before the new value is emitted, so the new value shows up at index k + 1 instead of k.',
    failingTestCase: 'Inserting 9 at position 2 of [1,2,3,4] returns 1 2 3 9 4 instead of 1 2 9 3 4.',
    fix: 'Emit the new value when i == k.',
    whyFixWorks: 'The new value is written right before the original element at index k, which puts it at position k.',
    dryRun: 'Buggy loop: i = 0 writes 1, i = 1 writes 2, i = 2 writes 3 (guard fails because 2 != 3), i = 3 writes 9 then 4. Correct loop writes 9 before 3 at i = 2.',
    debuggingLesson: 'For insertion at a position, verify that the guard triggers before the element currently at that position is copied.',
  },
  testCases: [
    { input: '[1,2,3,4], 2, 9', expected: '1 2 9 3 4', buggyOutput: '1 2 3 9 4' },
  ],
  harness: {
    expected: '1 2 9 3 4',
    driver: {
      java: `int[] r = Solution.insertAt(new int[]{1,2,3,4}, 2, 9); StringBuilder sb = new StringBuilder(); for (int i = 0; i < r.length; i++) { if (i > 0) sb.append(' '); sb.append(r[i]); } System.out.print(sb.toString());`,
      python: `r = insert_at([1,2,3,4], 2, 9); print(' '.join(str(x) for x in r))`,
      c: `int out[10]; int m = insert_at((int[]){1,2,3,4}, 4, 2, 9, out); for (int i = 0; i < m; i++) { if (i > 0) printf(" "); printf("%d", out[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] insertAt(int[] a, int k, int val) {
        int n = a.length;
        int[] out = new int[n + 1];
        int j = 0;
        for (int i = 0; i <= n; i++) {
            if (i == k) {
                out[j++] = val;
            }
            if (i < n) {
                out[j++] = a[i];
            }
        }
        return out;
    }
}
`,
      bugs: { 7: { was: 'i == k', buggy: 'i == k + 1' } },
    },
    python: {
      correct: `
def insert_at(a, k, val):
    n = len(a)
    out = []
    for i in range(n + 1):
        if i == k:
            out.append(val)
        if i < n:
            out.append(a[i])
    return out
`,
      bugs: { 5: { was: 'i == k', buggy: 'if i == k + 1:' } },
    },
    c: {
      correct: `
int insert_at(int a[], int n, int k, int val, int out[]) {
    int j = 0;
    for (int i = 0; i <= n; i++) {
        if (i == k) {
            out[j++] = val;
        }
        if (i < n) {
            out[j++] = a[i];
        }
    }
    return j;
}
`,
      bugs: { 4: { was: 'i == k', buggy: 'if (i == k + 1) {' } },
    },
  },
});
