import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p126',
  title: 'Outbox spills before it empties',
  difficulty: 'Easy',
  topic: 'Stacks and Queues',
  subtopic: 'Dual Buffer Order',
  tags: ['First-In-First-Out', 'Dual Buffers'],
  bugCategory: 'Collection-related Logical Error',
  sourceInspiredBy: 'Queue using two stacks pattern',
  description:
    'Simulate first-in-first-out order using two internal buffers: an ingestion buffer and a departure buffer. Support insert (1) and remove (2) operations. Return the sum of removed items. The solution transfers items from ingestion to departure prematurely.',
  constraints: ['1 <= n <= 100', '1 <= values <= 100'],
  examples: [
    { input: 'ops = [1, 1, 2, 1, 2, 2], vals = [10, 20, 0, 30, 0, 0]', output: '60', note: 'Items are removed in order 10, 20, 30.' },
  ],
  hints: [
    'Check when items are shifted from the primary ingestion buffer into the output buffer.',
    'Trace what happens if an insertion occurs while elements are still waiting inside the departure buffer.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Implement first-in first-out semantics using two lifo buffers.',
    algorithm:
      'Push incoming items to the input buffer. When removing an item, only transfer the input buffer contents to the output buffer if the output buffer is currently empty.',
    bug: 'The transfer from input to output runs on every removal (the outTop == -1 check is replaced by outTop >= -1, which is always true), placing newer items on top of older unconsumed items in the output buffer.',
    whyItFails:
      'Pouring new elements into a non-empty departure buffer places newer items above older items, violating the arrival order on subsequent removals.',
    failingTestCase: 'ops = [1, 1, 2, 1, 2], vals = [10, 20, 0, 30, 0]: removing 10 leaves 20 in the outbox. Adding 30 and removing transfers 30 on top of 20, yielding 30 instead of 20 (total 40 instead of 30).',
    fix: 'Only transfer from in-buffer to out-buffer when the out-buffer is empty (outTop == -1).',
    whyFixWorks: 'Ensuring the outbox is completely depleted preserves the strict arrival sequence of elements.',
    dryRun:
      'Enqueue 10, 20. Outbox empty -> transfers [20, 10]. Dequeue gives 10. Outbox holds [20]. Enqueue 30: in-box holds [30]. Next dequeue: outbox is NOT empty, so it yields 20. Then outbox empty -> transfers 30 -> yields 30.',
    debuggingLesson:
      'When implementing queues with two stacks, the transfer step is lazy: never transfer into a non-empty secondary stack.',
  },
  testCases: [
    { input: 'ops = [1, 1, 2, 1, 2, 2], vals = [10, 20, 0, 30, 0, 0]', expected: '60' },
    { input: 'ops = [1, 1, 2, 1, 2], vals = [10, 20, 0, 30, 0]', expected: '30', buggyOutput: '40' },
  ],
  harness: {
    expected: '60 30',
    driver: {
      java: `System.out.println(Solution.queueViaStacks(new int[]{1, 1, 2, 1, 2, 2}, new int[]{10, 20, 0, 30, 0, 0}, 6) + " " + Solution.queueViaStacks(new int[]{1, 1, 2, 1, 2}, new int[]{10, 20, 0, 30, 0}, 5));`,
      python: `print(queue_via_stacks([1, 1, 2, 1, 2, 2], [10, 20, 0, 30, 0, 0], 6), queue_via_stacks([1, 1, 2, 1, 2], [10, 20, 0, 30, 0], 5))`,
      c: `printf("%d %d", queue_via_stacks((int[]){1, 1, 2, 1, 2, 2}, (int[]){10, 20, 0, 30, 0, 0}, 6), queue_via_stacks((int[]){1, 1, 2, 1, 2}, (int[]){10, 20, 0, 30, 0}, 5));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int queueViaStacks(int[] ops, int[] vals, int n) {
        int[] inStk = new int[n];
        int[] outStk = new int[n];
        int inTop = -1, outTop = -1;
        int total = 0;
        for (int i = 0; i < n; i++) {
            if (ops[i] == 1) {
                inStk[++inTop] = vals[i];
            } else if (ops[i] == 2) {
                if (outTop == -1) {
                    while (inTop >= 0) {
                        outStk[++outTop] = inStk[inTop--];
                    }
                }
                if (outTop >= 0) {
                    total += outStk[outTop--];
                }
            }
        }
        return total;
    }
}`,
      bugs: { 11: { was: 'outTop == -1', buggy: '                if (outTop >= -1) {' } },
    },
    python: {
      correct: `def queue_via_stacks(ops, vals, n):
    in_stk = []
    out_stk = []
    total = 0
    for i in range(n):
        if ops[i] == 1:
            in_stk.append(vals[i])
        elif ops[i] == 2:
            if not out_stk:
                while in_stk:
                    out_stk.append(in_stk.pop())
            if out_stk:
                total += out_stk.pop()
    return total`,
      bugs: { 9: { was: 'if not out_stk:', buggy: '            if True:' } },
    },
    c: {
      correct: `int queue_via_stacks(int ops[], int vals[], int n) {
    int in_stk[100];
    int out_stk[100];
    int in_top = -1, out_top = -1;
    int total = 0;
    for (int i = 0; i < n; i++) {
        if (ops[i] == 1) {
            in_stk[++in_top] = vals[i];
        } else if (ops[i] == 2) {
            if (out_top == -1) {
                while (in_top >= 0) {
                    out_stk[++out_top] = in_stk[in_top--];
                }
            }
            if (out_top >= 0) {
                total += out_stk[out_top--];
            }
        }
    }
    return total;
}`,
      bugs: { 10: { was: 'out_top == -1', buggy: '            if (out_top >= -1) {' } },
    },
  },
});
