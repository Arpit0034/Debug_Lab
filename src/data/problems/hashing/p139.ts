import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p139',
  title: 'Zero-sum subarray counts before it starts',
  difficulty: 'Medium',
  topic: 'Hashing',
  subtopic: 'Prefix Cumulative Table',
  tags: ['Prefix Frequency', 'Subarray Target'],
  bugCategory: 'Incorrect Hash-based Lookup',
  sourceInspiredBy: 'Subarray sum equals k pattern',
  description:
    'Given an array of integers and an integer k, return the total count of contiguous subsegments whose values sum to k. The implementation looks up the current cumulative sum rather than the required offset target.',
  constraints: ['1 <= n <= 1000', '-1000 <= a[i], k <= 1000'],
  examples: [
    { input: 'a = [1, 1, 1], k = 2', output: '2', note: 'Subsegments [1, 1] at indices 0..1 and 1..2 sum to 2.' },
    { input: 'a = [1, 2, 3], k = 3', output: '2' },
  ],
  hints: [
    'Notice which key is retrieved from the frequency table during traversal.',
    'Check whether the lookup queries the current prefix sum or the required difference sum - k.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Count the number of contiguous subsegments with sum equal to k.',
    algorithm:
      'Maintain a running prefix sum and a frequency table of previously observed prefix sums. A subsegment ending at the current index has sum k if an earlier prefix sum equaled currentSum - k.',
    bug: 'The lookup queries currentSum instead of currentSum - k.',
    whyItFails:
      'Querying currentSum only counts earlier points with the exact same prefix sum, which corresponds to subsegments summing to 0 rather than k.',
    failingTestCase: 'a = [1, 1, 1], k = 2: returns 0 instead of 2 because it queries prefix sum values instead of prefixSum - 2.',
    fix: 'Query the difference key: map.getOrDefault(sum - k, 0).',
    whyFixWorks: 'The identity sum(i..j) = prefix[j] - prefix[i-1] = k holds exactly when prefix[i-1] = prefix[j] - k.',
    dryRun:
      'For [1, 1, 1], k = 2: at index 1, sum = 2. Looking up 2 - 2 = 0 in table {0:1, 1:1} finds count 1. At index 2, sum = 3. Looking up 3 - 2 = 1 finds count 1. Total = 2.',
    debuggingLesson:
      'When using prefix sums to find target ranges, the lookup key must be currentSum - target, never currentSum alone.',
  },
  testCases: [
    { input: '[1, 1, 1], k = 2', expected: '2', buggyOutput: '0' },
    { input: '[1, 2, 3], k = 3', expected: '2', buggyOutput: '0' },
  ],
  harness: {
    expected: '2 2',
    driver: {
      java: `System.out.println(Solution.subarraySumCount(new int[]{1, 1, 1}, 2) + " " + Solution.subarraySumCount(new int[]{1, 2, 3}, 3));`,
      python: `print(subarray_sum_count([1, 1, 1], 2), subarray_sum_count([1, 2, 3], 3))`,
      c: `printf("%d %d", subarray_sum_count((int[]){1, 1, 1}, 3, 2), subarray_sum_count((int[]){1, 2, 3}, 3, 3));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int subarraySumCount(int[] a, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        int sum = 0, count = 0;
        for (int x : a) {
            sum += x;
            count += map.getOrDefault(sum - k, 0);
            map.put(sum, map.getOrDefault(sum, 0) + 1);
        }
        return count;
    }
}`,
      bugs: { 10: { was: 'sum - k', buggy: '            count += map.getOrDefault(sum, 0);' } },
    },
    python: {
      correct: `def subarray_sum_count(a, k):
    counts = {0: 1}
    total = 0
    ans = 0
    for x in a:
        total += x
        ans += counts.get(total - k, 0)
        counts[total] = counts.get(total, 0) + 1
    return ans`,
      bugs: { 7: { was: 'total - k', buggy: '        ans += counts.get(total, 0)' } },
    },
    c: {
      correct: `int subarray_sum_count(int a[], int n, int k) {
    int keys[100];
    int freqs[100];
    int size = 1;
    keys[0] = 0;
    freqs[0] = 1;
    int total = 0, ans = 0;
    for (int i = 0; i < n; i++) {
        total += a[i];
        int target = total - k;
        for (int j = 0; j < size; j++) {
            if (keys[j] == target) {
                ans += freqs[j];
                break;
            }
        }
        int found = 0;
        for (int j = 0; j < size; j++) {
            if (keys[j] == total) {
                freqs[j]++;
                found = 1;
                break;
            }
        }
        if (!found) {
            keys[size] = total;
            freqs[size] = 1;
            size++;
        }
    }
    return ans;
}`,
      bugs: { 10: { was: 'total - k', buggy: '        int target = total;' } },
    },
  },
});
