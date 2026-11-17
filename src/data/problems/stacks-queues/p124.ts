import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p124',
  title: 'Duplicate minimums vanish on pop',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Minimum Tracker',
  tags: ['State Container', 'Minimum Query'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Min stack with auxiliary minimum tracker pattern',
  description:
    'Simulate a container supporting push (operation 1) and pop (operation 2) while tracking the minimum value present after each step. Return the sum of all recorded minimums. The implementation fails when duplicate minimum values are inserted.',
  constraints: ['1 <= n <= 100', '-100 <= values <= 100'],
  examples: [
    { input: 'ops = [1, 1, 1, 2], vals = [5, 2, 2, 0]', output: '11', note: 'Steps: push 5 (min 5), push 2 (min 2), push 2 (min 2), pop (min 2). Sum = 5 + 2 + 2 + 2 = 11.' },
  ],
  hints: [
    'Notice how the auxiliary tracker decides whether a newly inserted value qualifies as the current minimum.',
    'Trace what happens when an element equal to the current minimum is pushed and then a pop occurs.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Maintain an auxiliary container of current minimums so that minimum retrieval is always constant time.',
    algorithm:
      'When inserting x, if x is less than or equal to the current minimum, push x to the minimum tracker. On pop, if the removed item matches the current minimum, pop from the tracker.',
    bug: 'The push condition requires strictly less (<) rather than less-than-or-equal (<=).',
    whyItFails:
      'When a duplicate minimum is inserted, it is not recorded in the tracker. When one instance is popped, the tracker pops its only record, leaving the remaining duplicate without a tracker entry.',
    failingTestCase: 'ops = [1, 1, 1, 2], vals = [5, 2, 2, 0]: returns 14 instead of 11 because popping the duplicate leaves 5 as the recorded minimum.',
    fix: 'Change vals[i] < minst[minTop] to vals[i] <= minst[minTop].',
    whyFixWorks: 'Recording all occurrences of the minimum ensures each pop of a minimum element removes only one occurrence.',
    dryRun:
      'Push 5: min=5. Push 2: 2<=5, min=2. Push 2: 2<=2, min=2 recorded. Pop: removes 2, tracker pops one 2, min remains 2. Correct sum = 5+2+2+2=11.',
    debuggingLesson:
      'When using an auxiliary tracking structure, pay close attention to ties and duplicates; tie-breaking rules must match removal triggers.',
  },
  testCases: [
    { input: 'ops = [1, 1, 1, 2], vals = [5, 2, 2, 0]', expected: '11', buggyOutput: '14' },
    { input: 'ops = [1, 1, 2], vals = [3, 5, 0]', expected: '9' },
  ],
  harness: {
    expected: '11 9',
    driver: {
      java: `System.out.println(Solution.runMinStack(new int[]{1, 1, 1, 2}, new int[]{5, 2, 2, 0}, 4) + " " + Solution.runMinStack(new int[]{1, 1, 2}, new int[]{3, 5, 0}, 3));`,
      python: `print(run_min_stack([1, 1, 1, 2], [5, 2, 2, 0], 4), run_min_stack([1, 1, 2], [3, 5, 0], 3))`,
      c: `printf("%d %d", run_min_stack((int[]){1, 1, 1, 2}, (int[]){5, 2, 2, 0}, 4), run_min_stack((int[]){1, 1, 2}, (int[]){3, 5, 0}, 3));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int runMinStack(int[] ops, int[] vals, int n) {
        int[] st = new int[n];
        int[] minst = new int[n];
        int top = -1, minTop = -1;
        int total = 0;
        for (int i = 0; i < n; i++) {
            if (ops[i] == 1) {
                st[++top] = vals[i];
                if (minTop == -1 || vals[i] <= minst[minTop]) {
                    minst[++minTop] = vals[i];
                }
            } else if (ops[i] == 2) {
                if (top >= 0) {
                    if (st[top] == minst[minTop]) {
                        minTop--;
                    }
                    top--;
                }
            }
            if (minTop >= 0) {
                total += minst[minTop];
            }
        }
        return total;
    }
}`,
      bugs: { 10: { was: 'vals[i] <= minst[minTop]', buggy: '                if (minTop == -1 || vals[i] < minst[minTop]) {' } },
    },
    python: {
      correct: `def run_min_stack(ops, vals, n):
    st = []
    minst = []
    total = 0
    for i in range(n):
        if ops[i] == 1:
            st.append(vals[i])
            if not minst or vals[i] <= minst[-1]:
                minst.append(vals[i])
        elif ops[i] == 2:
            if st:
                if st[-1] == minst[-1]:
                    minst.pop()
                st.pop()
        if minst:
            total += minst[-1]
    return total`,
      bugs: { 8: { was: 'vals[i] <= minst[-1]', buggy: '            if not minst or vals[i] < minst[-1]:' } },
    },
    c: {
      correct: `int run_min_stack(int ops[], int vals[], int n) {
    int st[100];
    int minst[100];
    int top = -1, min_top = -1;
    int total = 0;
    for (int i = 0; i < n; i++) {
        if (ops[i] == 1) {
            st[++top] = vals[i];
            if (min_top == -1 || vals[i] <= minst[min_top]) {
                minst[++min_top] = vals[i];
            }
        } else if (ops[i] == 2) {
            if (top >= 0) {
                if (st[top] == minst[min_top]) {
                    min_top--;
                }
                top--;
            }
        }
        if (min_top >= 0) {
            total += minst[min_top];
        }
    }
    return total;
}`,
      bugs: { 9: { was: 'vals[i] <= minst[min_top]', buggy: '            if (min_top == -1 || vals[i] < minst[min_top]) {' } },
    },
  },
});
