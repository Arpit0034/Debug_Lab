import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p145',
  title: 'Pair sums skip orthogonal matches',
  difficulty: 'Medium',
  topic: 'Hashing',
  subtopic: 'Pair Sum Complements',
  tags: ['Intermediate Pair Table', 'Complement Count'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Four sum count pattern',
  description:
    'Given four equal-length integer arrays a, b, c, d, count how many quadruplets (i, j, k, l) satisfy a[i] + b[j] + c[k] + d[l] == 0. The implementation restricts pair index selection across distinct arrays, omitting valid combination counts.',
  constraints: ['1 <= n <= 10', '-1000 <= values <= 1000'],
  examples: [
    { input: 'a = [0, 1], b = [-1, 0], c = [0, 0], d = [0, 0]', output: '8', note: 'Pairs (0, 0) and (1, -1) each match all 4 combinations of c and d, giving 8.' },
    { input: 'a = [0], b = [0], c = [0], d = [0]', output: '1' },
  ],
  hints: [
    'Notice how the nested loops combine elements from array a and array b.',
    'Check whether the inner loop variable is initialized to 0 or erroneously tied to the outer loop variable.',
  ],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
  explanation: {
    overview: 'Count index quadruplets across four arrays summing to zero.',
    algorithm:
      'Precompute the frequencies of all pair sums a[i] + b[j] into a hash table. Then iterate over all pairs (c[k], d[l]) and add the frequency of -(c[k] + d[l]) to the total.',
    bug: 'The inner loop pairing a[i] and b[j] starts at j = i instead of j = 0.',
    whyItFails:
      'Starting j from i assumes pairing within the same array rather than across two independent arrays, skipping all valid pairs where j < i.',
    failingTestCase: 'a = [0, 1], b = [-1, 0], c = [0, 0], d = [0, 0]: returns 4 instead of 8 because pair a[1]=1 and b[0]=-1 is skipped.',
    fix: 'Initialize j = 0 in the inner loop: for (int j = 0; j < n; j++).',
    whyFixWorks: 'Every index in b can combine with every index in a, forming all n^2 combinations.',
    dryRun:
      'For a = [0, 1], b = [-1, 0]: i=0 pairs with j=0 (-1) and j=1 (0). i=1 pairs with j=0 (0) and j=1 (1). Zero-sum pairs are (0,0) and (1,-1), each appearing once (total 2). c and d produce sum 0 in all 4 pairs. Total = 2 * 4 = 8.',
    debuggingLesson:
      'When combining elements across distinct collections, the inner index must start at 0; j = i is only for symmetric pairs within the same collection.',
  },
  testCases: [
    { input: 'a = [0, 1], b = [-1, 0], c = [0, 0], d = [0, 0], n = 2', expected: '8', buggyOutput: '4' },
    { input: 'a = [0], b = [0], c = [0], d = [0], n = 1', expected: '1' },
  ],
  harness: {
    expected: '8 1',
    driver: {
      java: `System.out.println(Solution.fourSumCount(new int[]{0, 1}, new int[]{-1, 0}, new int[]{0, 0}, new int[]{0, 0}, 2) + " " + Solution.fourSumCount(new int[]{0}, new int[]{0}, new int[]{0}, new int[]{0}, 1));`,
      python: `print(four_sum_count([0, 1], [-1, 0], [0, 0], [0, 0], 2), four_sum_count([0], [0], [0], [0], 1))`,
      c: `printf("%d %d", four_sum_count((int[]){0, 1}, (int[]){-1, 0}, (int[]){0, 0}, (int[]){0, 0}, 2), four_sum_count((int[]){0}, (int[]){0}, (int[]){0}, (int[]){0}, 1));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int fourSumCount(int[] a, int[] b, int[] c, int[] d, int n) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int sum = a[i] + b[j];
                map.put(sum, map.getOrDefault(sum, 0) + 1);
            }
        }
        int count = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int target = -(c[i] + d[j]);
                count += map.getOrDefault(target, 0);
            }
        }
        return count;
    }
}`,
      bugs: { 7: { was: 'for (int j = 0; j < n; j++) {', buggy: '            for (int j = i; j < n; j++) {' } },
    },
    python: {
      correct: `def four_sum_count(a, b, c, d, n):
    pair_counts = {}
    for i in range(n):
        for j in range(n):
            s = a[i] + b[j]
            pair_counts[s] = pair_counts.get(s, 0) + 1
    total = 0
    for i in range(n):
        for j in range(n):
            target = -(c[i] + d[j])
            total += pair_counts.get(target, 0)
    return total`,
      bugs: { 4: { was: 'for j in range(n):', buggy: '        for j in range(i, n):' } },
    },
    c: {
      correct: `int four_sum_count(int a[], int b[], int c[], int d[], int n) {
    int keys[100];
    int freqs[100];
    int size = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int s = a[i] + b[j];
            int found = 0;
            for (int k = 0; k < size; k++) {
                if (keys[k] == s) {
                    freqs[k]++;
                    found = 1;
                    break;
                }
            }
            if (!found) {
                keys[size] = s;
                freqs[size] = 1;
                size++;
            }
        }
    }
    int total = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int target = -(c[i] + d[j]);
            for (int k = 0; k < size; k++) {
                if (keys[k] == target) {
                    total += freqs[k];
                    break;
                }
            }
        }
    }
    return total;
}`,
      bugs: { 6: { was: 'for (int j = 0; j < n; j++) {', buggy: '        for (int j = i; j < n; j++) {' } },
    },
  },
});
