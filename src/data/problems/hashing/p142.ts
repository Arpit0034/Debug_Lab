import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p142',
  title: 'Distant duplicate evades eviction',
  difficulty: 'Medium',
  topic: 'Hashing',
  subtopic: 'Bounded Horizon Lookup',
  tags: ['Sliding Horizon', 'Set Eviction'],
  bugCategory: 'Incorrect Sliding Window Update',
  sourceInspiredBy: 'Contains duplicate within k distance pattern',
  description:
    'Given an array of integers and an integer k, determine if there are two identical values separated by a distance of at most k. Return 1 if such a pair exists, or 0 otherwise. The implementation allows values outside the distance boundary to evade eviction.',
  constraints: ['1 <= n <= 1000', '1 <= k <= 1000'],
  examples: [
    { input: 'a = [1, 2, 3, 1], k = 2', output: '0', note: 'The two 1s are separated by distance 3, which exceeds k=2.' },
    { input: 'a = [1, 0, 1, 1], k = 1', output: '1' },
  ],
  hints: [
    'Notice which element is removed from the active set once the window size exceeds k.',
    'Check the index calculation for the item scheduled for removal.',
  ],
  complexity: { time: 'O(n)', space: 'O(k)' },
  explanation: {
    overview: 'Find whether any duplicate values occur within k steps of one another.',
    algorithm:
      'Maintain a lookup set of the most recent k elements. If an arriving element is found in the set, return 1. If the set grows larger than k, evict the element at index i - k.',
    bug: 'The eviction index removes a[i - k + 1], failing to evict the oldest element at index i - k.',
    whyItFails:
      'Failing to evict a[i - k] leaves elements in the active set beyond the permitted distance k, falsely detecting duplicates that are too far apart.',
    failingTestCase: 'a = [1, 2, 3, 1], k = 2: returns 1 instead of 0 because 1 at index 0 is not evicted when i=2, matching 1 at index 3.',
    fix: 'Evict the exact element that falls outside the horizon: set.remove(a[i - k]).',
    whyFixWorks: 'The active set at index i should contain only elements from index i - k + 1 to i; removing a[i - k] enforces this invariant.',
    dryRun:
      'For a = [1, 2, 3, 1], k = 2: i=0 adds 1; i=1 adds 2; i=2 adds 3 (size 3 > 2), evicts a[2 - 2] = a[0] = 1 (set has {2, 3}). i=3 checks 1: not found, adds 1. Returns 0.',
    debuggingLesson:
      'When bounding a lookup set to horizon k, the element leaving the horizon at step i is always at index i - k.',
  },
  testCases: [
    { input: 'a = [1, 2, 3, 1], k = 2', expected: '0', buggyOutput: '1' },
    { input: 'a = [1, 0, 1, 1], k = 1', expected: '1' },
  ],
  harness: {
    expected: '0 1',
    driver: {
      java: `System.out.println(Solution.containsNearbyDuplicate(new int[]{1, 2, 3, 1}, 2) + " " + Solution.containsNearbyDuplicate(new int[]{1, 0, 1, 1}, 1));`,
      python: `print(contains_nearby_duplicate([1, 2, 3, 1], 2), contains_nearby_duplicate([1, 0, 1, 1], 1))`,
      c: `printf("%d %d", contains_nearby_duplicate((int[]){1, 2, 3, 1}, 4, 2), contains_nearby_duplicate((int[]){1, 0, 1, 1}, 4, 1));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int containsNearbyDuplicate(int[] a, int k) {
        Set<Integer> set = new HashSet<>();
        for (int i = 0; i < a.length; i++) {
            if (set.contains(a[i])) {
                return 1;
            }
            set.add(a[i]);
            if (set.size() > k) {
                set.remove(a[i - k]);
            }
        }
        return 0;
    }
}`,
      bugs: { 12: { was: 'set.remove(a[i - k]);', buggy: '                set.remove(a[i - k + 1]);' } },
    },
    python: {
      correct: `def contains_nearby_duplicate(a, k):
    s = set()
    for i, x in enumerate(a):
        if x in s:
            return 1
        s.add(x)
        if len(s) > k:
            s.remove(a[i - k])
    return 0`,
      bugs: { 8: { was: 's.remove(a[i - k])', buggy: '            s.remove(a[i - k + 1])' } },
    },
    c: {
      correct: `int contains_nearby_duplicate(int a[], int n, int k) {
    int set[100];
    int size = 0;
    for (int i = 0; i < n; i++) {
        int x = a[i];
        for (int j = 0; j < size; j++) {
            if (set[j] == x) return 1;
        }
        set[size++] = x;
        if (size > k) {
            int to_remove = a[i - k];
            for (int j = 0; j < size; j++) {
                if (set[j] == to_remove) {
                    for (int m = j; m < size - 1; m++) set[m] = set[m + 1];
                    size--;
                    break;
                }
            }
        }
    }
    return 0;
}`,
      bugs: { 11: { was: 'a[i - k]', buggy: '            int to_remove = a[i - k + 1];' } },
    },
  },
});
