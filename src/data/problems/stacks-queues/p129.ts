import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p129',
  title: 'Leading zeroes linger after removal',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Greedy Digit Pruning',
  tags: ['Digit Manipulation', 'Greedy Pruning'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Smallest number after removing k digits pattern',
  description:
    'Given a number represented as an array of single digits, remove exactly k digits so that the remaining digits form the smallest possible numerical value. Return the resulting number as an integer. The solution fails when digits are already in non-decreasing order.',
  constraints: ['1 <= n <= 9', '1 <= k < n', '0 <= digits[i] <= 9'],
  examples: [
    { input: 'digits = [1, 2, 3, 4, 5], k = 2', output: '123', note: 'Removing 4 and 5 leaves 123.' },
    { input: 'digits = [4, 3, 2, 1], k = 2', output: '21' },
  ],
  hints: [
    'Trace what happens when the digits are strictly increasing and no drops are triggered during traversal.',
    'Check whether any unused removal quota is deducted from the tail end.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Construct the minimal number by greedily discarding larger leading digits.',
    algorithm:
      'Traverse digits from left to right. Discard preceding digits that are larger than the current digit while removal budget k remains. After traversal, discard any leftover budget from the tail end.',
    bug: 'The implementation omits deducting the remaining k removals from the end (top -= k is replaced with top -= 0).',
    whyItFails:
      'When input digits are already sorted in ascending order, no digits trigger drops during iteration. If leftover budget is not trimmed from the end, all original digits remain.',
    failingTestCase: 'digits = [1, 2, 3, 4, 5], k = 2: returns 12345 instead of 123 because no digits were removed.',
    fix: 'Deduct remaining quota: top -= k (or slice st[:-k]).',
    whyFixWorks: 'The largest remaining digits in an increasing sequence reside at the tail end, so pruning from the right achieves the minimal value.',
    dryRun:
      'For [1, 2, 3, 4, 5], k = 2: all digits pushed without drops. Remaining k = 2. Deducting k from top leaves [1, 2, 3]. Output is 123.',
    debuggingLesson:
      'When an iterative loop consumes a quota based on condition triggers, always handle any unconsumed budget after loop termination.',
  },
  testCases: [
    { input: 'digits = [1, 2, 3, 4, 5], n = 5, k = 2', expected: '123', buggyOutput: '12345' },
    { input: 'digits = [4, 3, 2, 1], n = 4, k = 2', expected: '21' },
  ],
  harness: {
    expected: '123 21',
    driver: {
      java: `System.out.println(Solution.removeKDigits(new int[]{1, 2, 3, 4, 5}, 5, 2) + " " + Solution.removeKDigits(new int[]{4, 3, 2, 1}, 4, 2));`,
      python: `print(remove_k_digits([1, 2, 3, 4, 5], 5, 2), remove_k_digits([4, 3, 2, 1], 4, 2))`,
      c: `printf("%d %d", remove_k_digits((int[]){1, 2, 3, 4, 5}, 5, 2), remove_k_digits((int[]){4, 3, 2, 1}, 4, 2));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int removeKDigits(int[] digits, int n, int k) {
        int[] st = new int[n];
        int top = -1;
        for (int i = 0; i < n; i++) {
            while (k > 0 && top >= 0 && st[top] > digits[i]) {
                top--;
                k--;
            }
            st[++top] = digits[i];
        }
        top -= k;
        int val = 0;
        for (int i = 0; i <= top; i++) {
            val = val * 10 + st[i];
        }
        return val;
    }
}`,
      bugs: { 12: { was: 'top -= k;', buggy: '        top -= 0;' } },
    },
    python: {
      correct: `def remove_k_digits(digits, n, k):
    st = []
    for d in digits:
        while k > 0 and st and st[-1] > d:
            st.pop()
            k -= 1
        st.append(d)
    if k > 0:
        st = st[:-k]
    val = 0
    for d in st:
        val = val * 10 + d
    return val`,
      bugs: { 9: { was: 'st = st[:-k]', buggy: '        st = st' } },
    },
    c: {
      correct: `int remove_k_digits(int digits[], int n, int k) {
    int st[100];
    int top = -1;
    for (int i = 0; i < n; i++) {
        while (k > 0 && top >= 0 && st[top] > digits[i]) {
            top--;
            k--;
        }
        st[++top] = digits[i];
    }
    top -= k;
    int val = 0;
    for (int i = 0; i <= top; i++) {
        val = val * 10 + st[i];
    }
    return val;
}`,
      bugs: { 11: { was: 'top -= k;', buggy: '    top -= 0;' } },
    },
  },
});
