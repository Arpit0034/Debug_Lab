import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p072',
  title: 'Half the sequence stays unreversed',
  difficulty: 'Easy',
  topic: 'Arrays',
  subtopic: 'In-place Reversal',
  tags: ['Reversal', 'Swap', 'Indexing'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'In-place reversal by symmetric swaps',
  description:
    'Return the given sequence with its elements in reverse order. The routine swaps symmetric positions in place.',
  constraints: ['1 <= n <= 1000'],
  examples: [
    { input: 'a = [1, 2, 3, 4]', output: '4 3 2 1' },
  ],
  hints: ['How many symmetric pairs must be swapped for a full reversal?', 'Check that the loop stops after the middle is reached, not earlier.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Reverse a sequence by swapping symmetric pairs in place.',
    algorithm: 'For every index i in the first half, swap a[i] with a[n - 1 - i]. The loop needs exactly floor(n / 2) iterations.',
    bug: 'The loop bound uses n / 4 instead of n / 2, so the later swaps never happen.',
    whyItFails: 'Only the first quarter of the sequence is swapped, so the second half keeps the elements that should have moved.',
    failingTestCase: 'For [1,2,3,4], the code returns 4 2 3 1 instead of 4 3 2 1.',
    fix: 'Use i < n / 2 as the loop bound.',
    whyFixWorks: 'Every symmetric pair is swapped once, and the middle element of an odd length sequence naturally stays in place.',
    dryRun: 'For n = 4, correct loop runs i = 0 and i = 1, producing 4 3 2 1. The buggy bound n / 4 = 1 runs only i = 0, producing 4 2 3 1.',
    debuggingLesson: 'For in-place reversal, count how many pairs exist; the loop bound should reach halfway, not a quarter.',
  },
  testCases: [
    { input: '[1,2,3,4]', expected: '4 3 2 1', buggyOutput: '4 2 3 1' },
  ],
  harness: {
    expected: '4 3 2 1',
    driver: {
      java: `int[] a = {1,2,3,4}; Solution.reverse(a); StringBuilder sb = new StringBuilder(); for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(' '); sb.append(a[i]); } System.out.print(sb.toString());`,
      python: `r = reverse([1,2,3,4]); print(' '.join(str(x) for x in r))`,
      c: `int a[] = {1,2,3,4}; reverse(a, 4); for (int i = 0; i < 4; i++) { if (i > 0) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static void reverse(int[] a) {
        int n = a.length;
        for (int i = 0; i < n / 2; i++) {
            int t = a[i];
            a[i] = a[n - 1 - i];
            a[n - 1 - i] = t;
        }
    }
}
`,
      bugs: { 4: { was: 'i < n / 2', buggy: 'for (int i = 0; i < n / 4; i++) {' } },
    },
    python: {
      correct: `
def reverse(a):
    n = len(a)
    for i in range(n // 2):
        t = a[i]
        a[i] = a[n - 1 - i]
        a[n - 1 - i] = t
    return a
`,
      bugs: { 3: { was: 'range(n // 2)', buggy: 'for i in range(n // 4):' } },
    },
    c: {
      correct: `
void reverse(int a[], int n) {
    for (int i = 0; i < n / 2; i++) {
        int t = a[i];
        a[i] = a[n - 1 - i];
        a[n - 1 - i] = t;
    }
}
`,
      bugs: { 2: { was: 'i < n / 2', buggy: 'for (int i = 0; i < n / 4; i++) {' } },
    },
  },
});
