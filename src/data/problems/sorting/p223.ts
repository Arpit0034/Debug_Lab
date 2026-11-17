import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p223',
  title: 'Wave sort swaps every neighbour',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Wave Ordering',
  tags: ['Sorting', 'Adjacent Swaps'],
  bugCategory: 'Collection-related Logical Error',
  sourceInspiredBy: 'Wave array arrangement pattern',
  description:
    'Rearrange a sorted array into a wave where even positions are not smaller than their right neighbours. The current swap step moves one index at a time and destroys the pattern.',
  constraints: ['1 <= n <= 100000', 'Values fit in 32-bit integers'],
  examples: [
    { input: 'a = [1,2,3,4]', output: '2 1 4 3' },
  ],
  hints: ['Wave formation swaps pairs, not every adjacent pair.', 'Check the increment of the loop that performs swaps.'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
  explanation: {
    overview: 'Turn a sorted array into a wave arrangement.',
    algorithm: 'Sort the array, then swap pairs of adjacent elements starting at index 0.',
    bug: 'The swap loop increments i by 1 instead of 2.',
    whyItFails: 'Overlapping swaps undo previous pairs and produce a non-wave order.',
    failingTestCase: 'a = [1,2,3,4] becomes 2 3 4 1 instead of 2 1 4 3.',
    fix: 'Increment i by 2 in the wave loop.',
    whyFixWorks: 'Each pair is independent, so the next swap starts after the previous pair.',
    dryRun: 'The correct loop swaps indices 0-1 and 2-3. The buggy loop also swaps 1-2, mixing the pairs.',
    debuggingLesson: 'When processing disjoint pairs, the loop step must skip the entire pair.',
  },
  testCases: [
    { input: '[1,2,3,4]', expected: '2 1 4 3', buggyOutput: '2 3 4 1' },
  ],
  harness: {
    expected: '2 1 4 3',
    driver: {
      java: `int[] r = Solution.waveSort(new int[]{1,2,3,4}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*wave_sort([1,2,3,4]))`,
      c: `int a[] = {1,2,3,4}; wave_sort(a, 4); for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", a[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static int[] waveSort(int[] a) {
        Arrays.sort(a);
        for (int i = 0; i < a.length - 1; i += 2) {
            int t = a[i];
            a[i] = a[i + 1];
            a[i + 1] = t;
        }
        return a;
    }
}
`,
      bugs: { 5: { was: 'i += 2', buggy: 'for (int i = 0; i < a.length - 1; i += 1) {' } },
    },
    python: {
      correct: `
def insertion(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
def wave_sort(a):
    insertion(a)
    for i in range(0, len(a) - 1, 2):
        a[i], a[i + 1] = a[i + 1], a[i]
    return a
`,
      bugs: { 11: { was: 'range(0, len(a) - 1, 2)', buggy: 'for i in range(0, len(a) - 1, 1):' } },
    },
    c: {
      correct: `
int cmp(const void* p, const void* q) {
    return *(int*)p - *(int*)q;
}
void wave_sort(int a[], int n) {
    qsort(a, n, sizeof(int), cmp);
    for (int i = 0; i < n - 1; i += 2) {
        int t = a[i];
        a[i] = a[i + 1];
        a[i + 1] = t;
    }
}
`,
      bugs: { 6: { was: 'i += 2', buggy: 'for (int i = 0; i < n - 1; i += 1) {' } },
    },
  },
});
