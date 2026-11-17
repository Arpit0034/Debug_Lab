import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p203',
  title: 'Shipping capacity lands too high',
  difficulty: 'Hard',
  topic: 'Searching',
  subtopic: 'Search on Answer',
  tags: ['Binary Search', 'Greedy Feasibility'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Ship packages within days pattern',
  description:
    'Return the smallest daily capacity that can ship all weights within the given number of days. The current code returns a capacity that is too large.',
  constraints: ['1 <= weights.length <= 50000', '1 <= days <= weights.length', 'Weights are positive'],
  examples: [
    { input: 'weights = [1,2,3,4,5], days = 3', output: '6' },
  ],
  hints: ['A capacity is feasible when the required day count is at most days.', 'Check the branch where the required days exactly equal the limit.'],
  complexity: { time: 'O(n log sum)', space: 'O(1)' },
  explanation: {
    overview: 'Minimize a capacity subject to a daily shipping limit.',
    algorithm: 'Binary search capacity. For each capacity, greedily count how many days are needed.',
    bug: 'The feasibility check uses need < days instead of need <= days.',
    whyItFails: 'A capacity that needs exactly the allowed number of days is feasible, but the code treats it as infeasible and searches higher.',
    failingTestCase: 'weights = [1,2,3,4,5], days = 3 returns 10 instead of 6.',
    fix: 'Use need <= days when deciding whether the capacity is feasible.',
    whyFixWorks: 'Using exactly the allowed number of days is allowed, so the capacity is valid.',
    dryRun: 'Capacity 6 needs 3 days. The correct code accepts 6 and lowers the high bound. The buggy code rejects it and returns 10.',
    debuggingLesson: 'For capacity and allocation searches, equality with the limit is feasible, not invalid.',
  },
  testCases: [
    { input: '[1,2,3,4,5], 3', expected: '6', buggyOutput: '10' },
  ],
  harness: {
    expected: '6',
    driver: {
      java: `System.out.println(Solution.minCapacity(new int[]{1,2,3,4,5}, 3));`,
      python: `print(min_capacity([1,2,3,4,5], 3))`,
      c: `printf("%d", min_capacity((int[]){1,2,3,4,5}, 5, 3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int minCapacity(int[] w, int days) {
        int lo = 0;
        int hi = 0;
        for (int x : w) {
            if (x > lo) {
                lo = x;
            }
            hi += x;
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int need = 1;
            int load = 0;
            for (int x : w) {
                if (load + x > mid) {
                    need++;
                    load = x;
                } else {
                    load += x;
                }
            }
            if (need <= days) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }
}
`,
      bugs: { 23: { was: 'need <= days', buggy: 'if (need < days) {' } },
    },
    python: {
      correct: `
def min_capacity(w, days):
    lo = 0
    hi = 0
    for x in w:
        if x > lo:
            lo = x
        hi += x
    while lo < hi:
        mid = lo + (hi - lo) // 2
        need = 1
        load = 0
        for x in w:
            if load + x > mid:
                need += 1
                load = x
            else:
                load += x
        if need <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo
`,
      bugs: { 18: { was: 'need <= days', buggy: 'if need < days:' } },
    },
    c: {
      correct: `
int min_capacity(int w[], int n, int days) {
    int lo = 0;
    int hi = 0;
    for (int i = 0; i < n; i++) {
        if (w[i] > lo) {
            lo = w[i];
        }
        hi += w[i];
    }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int need = 1;
        int load = 0;
        for (int i = 0; i < n; i++) {
            if (load + w[i] > mid) {
                need++;
                load = w[i];
            } else {
                load += w[i];
            }
        }
        if (need <= days) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return lo;
}
`,
      bugs: { 22: { was: 'need <= days', buggy: 'if (need < days) {' } },
    },
  },
});
