import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p122',
  title: 'Equal elements clear the horizon',
  difficulty: 'Easy',
  topic: 'Stacks and Queues',
  subtopic: 'Monotonic Container',
  tags: ['Monotonic Pattern', 'Rightward Scan'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Next greater element pattern',
  description:
    'For each element in an array, find the first strictly greater element located to its right. Return the sum of these rightward greater values (using 0 when no greater element exists). The implementation fails to skip equal values when looking for strictly greater items.',
  constraints: ['1 <= n <= 1000', '-1000 <= a[i] <= 1000'],
  examples: [
    { input: 'a = [2, 1, 2, 4, 3]', output: '10', note: 'Next greater elements are 4, 2, 4, 0, 0 with sum 10.' },
    { input: 'a = [5, 4, 3, 2, 1]', output: '0' },
  ],
  hints: [
    'Trace what happens when an element encounters an identical value while scanning to the right.',
    'Check the comparison operator used when discarding candidate elements from consideration.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'For each array element, identify the nearest strictly greater element to its right and sum them.',
    algorithm:
      'Traverse from right to left while maintaining candidate values in decreasing order. Pop values less than or equal to the current element before reading the top candidate.',
    bug: 'The while loop condition uses strict inequality (<) instead of non-strict (<=), failing to discard equal values.',
    whyItFails:
      'When an element encounters an equal value to its right, strict inequality leaves the duplicate at the top of the container, mistakenly treating equal values as strictly greater.',
    failingTestCase: 'a = [2, 1, 2, 4, 3]: returns 8 instead of 10 because the first 2 picks the second 2 (summing 2 instead of 4).',
    fix: 'Change the while condition from st[top] < a[i] to st[top] <= a[i].',
    whyFixWorks: 'Using <= ensures all values that are not strictly greater are removed before recording the nearest greater neighbor.',
    dryRun:
      'For a = [2, 1, 2, 4, 3] from right: 3 has none (st=[3]); 4 pops 3 (st=[4]); 2 sees 4 (st=[4,2]); 1 sees 2 (st=[4,2,1]); 2 pops 1 and 2, seeing 4. Total = 4 + 2 + 4 + 0 + 0 = 10.',
    debuggingLesson:
      'When a problem requires strictly greater elements, elements equal to the query must be discarded along with strictly smaller ones.',
  },
  testCases: [
    { input: '[2, 1, 2, 4, 3]', expected: '10', buggyOutput: '8' },
    { input: '[5, 4, 3, 2, 1]', expected: '0' },
  ],
  harness: {
    expected: '10 0',
    driver: {
      java: `System.out.println(Solution.sumNextGreater(new int[]{2, 1, 2, 4, 3}) + " " + Solution.sumNextGreater(new int[]{5, 4, 3, 2, 1}));`,
      python: `print(sum_next_greater([2, 1, 2, 4, 3]), sum_next_greater([5, 4, 3, 2, 1]))`,
      c: `printf("%d %d", sum_next_greater((int[]){2, 1, 2, 4, 3}, 5), sum_next_greater((int[]){5, 4, 3, 2, 1}, 5));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int sumNextGreater(int[] a) {
        int n = a.length;
        int[] st = new int[n];
        int top = -1;
        int total = 0;
        for (int i = n - 1; i >= 0; i--) {
            while (top >= 0 && st[top] <= a[i]) {
                top--;
            }
            if (top >= 0) {
                total += st[top];
            }
            st[++top] = a[i];
        }
        return total;
    }
}`,
      bugs: { 10: { was: 'st[top] <= a[i]', buggy: '            while (top >= 0 && st[top] < a[i]) {' } },
    },
    python: {
      correct: `def sum_next_greater(a):
    st = []
    total = 0
    for x in reversed(a):
        while st and st[-1] <= x:
            st.pop()
        if st:
            total += st[-1]
        st.append(x)
    return total`,
      bugs: { 5: { was: 'st[-1] <= x', buggy: '        while st and st[-1] < x:' } },
    },
    c: {
      correct: `int sum_next_greater(int a[], int n) {
    int st[100];
    int top = -1;
    int total = 0;
    for (int i = n - 1; i >= 0; i--) {
        while (top >= 0 && st[top] <= a[i]) {
            top--;
        }
        if (top >= 0) {
            total += st[top];
        }
        st[++top] = a[i];
    }
    return total;
}`,
      bugs: { 6: { was: 'st[top] <= a[i]', buggy: '        while (top >= 0 && st[top] < a[i]) {' } },
    },
  },
});
