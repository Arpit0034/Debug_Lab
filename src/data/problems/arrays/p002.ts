import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p002',
  title: 'Window total drifts off',
  difficulty: 'Medium',
  topic: 'Sliding Window and Two Pointers',
  subtopic: 'Fixed-size Window',
  tags: ['Sliding Window', 'Window Update'],
  bugCategory: 'Incorrect Sliding Window Update',
  sourceInspiredBy: 'Maximum sum of a fixed-size subarray pattern',
  description:
    'Return the maximum sum of any contiguous subarray of exactly k elements. The solution slides a window across the array but returns wrong sums.',
  constraints: ['1 <= k <= n <= 100000', 'Values may be negative'],
  examples: [
    { input: 'a = [1, 2, 3, 4, 5], k = 2', output: '9', note: 'The best window is [4, 5].' },
    { input: 'a = [5, -1, -2, 3], k = 3', output: '2' },
  ],
  hints: ['After sliding, which element should have just left the window?', 'Check the window by hand for i = k.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the largest sum over all windows of length k.',
    algorithm:
      'Compute the sum of the first k elements, then slide the window one step at a time: add the new element on the right and subtract the element that falls off on the left. Track the best sum seen.',
    bug: 'The element removed on each slide is a[i - k + 1] instead of a[i - k].',
    whyItFails:
      'At index i the window covers a[i-k+1..i]. After adding a[i], the element that just left is a[i-k]. Subtracting a[i-k+1] removes an element that is still inside the window and keeps the one that left.',
    failingTestCase: 'a = [1, 2, 3, 4, 5], k = 2: the code returns 6, not 9.',
    fix: 'Subtract a[i - k].',
    whyFixWorks: 'a[i - k] is exactly the element that is no longer in the window once a[i] has been added.',
    dryRun:
      'a = [1,2,3,4,5], k = 2. Start sum = 3. i=2: add 3 gives 6, subtract a[0]=1 gives 5 (window [2,3]). i=3: add 4 gives 9, subtract a[1]=2 gives 7. i=4: add 5 gives 12, subtract a[2]=3 gives 9. Best = 9.',
    debuggingLesson:
      'For sliding windows, write down the exact index range of the window before and after the slide, then check which index leaves.',
  },
  testCases: [
    { input: '[1, 2, 3, 4, 5], 2', expected: '9', buggyOutput: '6' },
    { input: '[5, -1, -2, 3], 3', expected: '2' },
  ],
  harness: {
    expected: '9 2',
    driver: {
      java: `System.out.println(Solution.maxWindowSum(new int[]{1, 2, 3, 4, 5}, 2) + " " + Solution.maxWindowSum(new int[]{5, -1, -2, 3}, 3));`,
      python: `print(max_window_sum([1, 2, 3, 4, 5], 2), max_window_sum([5, -1, -2, 3], 3))`,
      c: `printf("%d %d", max_window_sum((int[]){1, 2, 3, 4, 5}, 5, 2), max_window_sum((int[]){5, -1, -2, 3}, 4, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int maxWindowSum(int[] a, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) {
            sum += a[i];
        }
        int best = sum;
        for (int i = k; i < a.length; i++) {
            sum += a[i];
            sum -= a[i - k];
            best = Math.max(best, sum);
        }
        return best;
    }
}
`,
      bugs: { 10: { was: 'sum -= a[i - k]', buggy: 'sum -= a[i - k + 1];' } },
    },
    python: {
      correct: `
def max_window_sum(a, k):
    total = sum(a[:k])
    best = total
    for i in range(k, len(a)):
        total += a[i]
        total -= a[i - k]
        best = max(best, total)
    return best
`,
      bugs: { 6: { was: 'total -= a[i - k]', buggy: 'total -= a[i - k + 1]' } },
    },
    c: {
      correct: `
int max_window_sum(int a[], int n, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) {
        sum += a[i];
    }
    int best = sum;
    for (int i = k; i < n; i++) {
        sum += a[i];
        sum -= a[i - k];
        if (sum > best) {
            best = sum;
        }
    }
    return best;
}
`,
      bugs: { 9: { was: 'sum -= a[i - k]', buggy: 'sum -= a[i - k + 1];' } },
    },
  },
});
