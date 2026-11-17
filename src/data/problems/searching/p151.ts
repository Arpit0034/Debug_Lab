import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p151',
  title: 'The insertion point shifts past duplicates',
  difficulty: 'Medium',
  topic: 'Searching',
  subtopic: 'Lower Bound',
  tags: ['Binary Search', 'Sorted Array', 'Duplicates'],
  bugCategory: 'Incorrect Binary Search Boundary',
  sourceInspiredBy: 'First position not smaller than a target',
  description: 'In a sorted array, return the first index whose value is greater than or equal to the target, or the array length if none exists.',
  constraints: ['0 <= n <= 100000', 'Values are sorted in non-decreasing order'],
  examples: [{ input: 'a=[1,2,2,4], target=2', output: '1' }, { input: 'a=[1,3,5], target=4', output: '2' }],
  hints: ['Duplicates may occupy several adjacent positions.', 'When a candidate qualifies, earlier positions may still qualify.'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the earliest qualifying position in a sorted array.',
    algorithm: 'Maintain a half-open search interval and keep the left portion when the middle value qualifies.',
    bug: 'The right boundary is moved to mid minus one in a half-open interval.',
    whyItFails: 'A qualifying middle position can be discarded, shifting the result.',
    failingTestCase: '[1,2,2], target 2 should return 1.',
    fix: 'Set the exclusive right boundary to mid.',
    whyFixWorks: 'The candidate remains inside the active interval until the earliest one is identified.',
    dryRun: 'The first middle value 2 qualifies; retaining the left half finds index 1.',
    debuggingLesson: 'Binary-search boundary conventions must remain consistent throughout the loop.'
  },
  testCases: [{ input: '[1,2,2],2', expected: '1' }],
  harness: { expected: '1', driver: { java: 'System.out.print(Solution.lowerBound(new int[]{1,2,2}, 2));', python: 'print(lower_bound([1,2,2], 2))', c: 'printf("%d", lower_bound((int[]){1,2,2}, 3, 2));' } },
  code: {
    java: { correct: `
class Solution {
    static int lowerBound(int[] a, int x) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= x) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
}
`, bugs: { 6: { was: 'hi = mid;', buggy: 'if (a[mid] >= x) hi = mid - 1;' } } },
    python: { correct: `
def lower_bound(a, x):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] >= x:
            hi = mid
        else:
            lo = mid + 1
    return lo
`, bugs: { 6: { was: 'hi = mid', buggy: 'hi = mid - 1' } } },
    c: { correct: `
int lower_bound(int a[], int n, int x) {
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] >= x) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
`, bugs: { 5: { was: 'hi = mid;', buggy: 'if (a[mid] >= x) hi = mid - 1;' } } }
  }
});
