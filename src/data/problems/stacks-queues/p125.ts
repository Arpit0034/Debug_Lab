import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p125',
  title: 'Full buffer mistaken for empty',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Circular Buffer',
  tags: ['Ring Buffer', 'Capacity Tracking'],
  bugCategory: 'Collection-related Logical Error',
  sourceInspiredBy: 'Circular queue / ring buffer pattern',
  description:
    'Simulate a fixed-capacity ring buffer supporting enqueue (operation 1) and dequeue (operation 2). Full insertions and empty removals are ignored. Return the sum of all successfully dequeued values. The implementation confuses the empty pointer state with the full state.',
  constraints: ['1 <= n <= 100', '1 <= cap <= 10'],
  examples: [
    { input: 'ops = [1, 1, 2, 1, 2], vals = [10, 20, 0, 30, 0], cap = 2', output: '30', note: 'Dequeues 10 and 20 for total 30.' },
  ],
  hints: [
    'Examine the fullness check used before inserting a new element.',
    'Consider whether head == tail uniquely indicates a full container or also describes an empty container.',
  ],
  complexity: { time: 'O(n)', space: 'O(k)' },
  explanation: {
    overview: 'Simulate a circular ring buffer where items are added at the tail and removed from the head.',
    algorithm:
      'Track head, tail, and current element count. Enqueue rejects when count == cap; dequeue rejects when count == 0.',
    bug: 'The capacity check tests tail == head instead of count == cap.',
    whyItFails:
      'In a ring buffer, tail == head occurs when the buffer is completely empty. Checking tail == head on insertion causes the initial insertion into an empty buffer to be rejected.',
    failingTestCase: 'ops = [1, 2], vals = [5, 0], cap = 2: returns 0 instead of 5 because the first push is rejected.',
    fix: 'Change the insertion check from tail == head to count == cap.',
    whyFixWorks: 'An explicit count tracks occupancy unambiguously regardless of pointer wrap-around.',
    dryRun:
      'Initially head=0, tail=0, count=0. With the count == cap check, 0 == 2 is false, so 5 is stored. With tail == head, 0 == 0 is true, incorrectly rejecting the item.',
    debuggingLesson:
      'In circular buffers, pointer equality head == tail is ambiguous without an auxiliary occupancy counter or sentinel gap.',
  },
  testCases: [
    { input: 'ops = [1, 1, 2, 1, 2], vals = [10, 20, 0, 30, 0], cap = 2', expected: '30', buggyOutput: '0' },
    { input: 'ops = [1, 2], vals = [5, 0], cap = 2', expected: '5', buggyOutput: '0' },
  ],
  harness: {
    expected: '30 5',
    driver: {
      java: `System.out.println(Solution.simulateQueue(new int[]{1, 1, 2, 1, 2}, new int[]{10, 20, 0, 30, 0}, 5, 2) + " " + Solution.simulateQueue(new int[]{1, 2}, new int[]{5, 0}, 2, 2));`,
      python: `print(simulate_queue([1, 1, 2, 1, 2], [10, 20, 0, 30, 0], 5, 2), simulate_queue([1, 2], [5, 0], 2, 2))`,
      c: `printf("%d %d", simulate_queue((int[]){1, 1, 2, 1, 2}, (int[]){10, 20, 0, 30, 0}, 5, 2), simulate_queue((int[]){1, 2}, (int[]){5, 0}, 2, 2));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int simulateQueue(int[] ops, int[] vals, int n, int cap) {
        int[] buf = new int[cap];
        int head = 0, tail = 0, count = 0;
        int total = 0;
        for (int i = 0; i < n; i++) {
            if (ops[i] == 1) {
                if (count == cap) {
                    continue;
                }
                buf[tail] = vals[i];
                tail = (tail + 1) % cap;
                count++;
            } else if (ops[i] == 2) {
                if (count == 0) {
                    continue;
                }
                total += buf[head];
                head = (head + 1) % cap;
                count--;
            }
        }
        return total;
    }
}`,
      bugs: { 8: { was: 'count == cap', buggy: '                if (tail == head) {' } },
    },
    python: {
      correct: `def simulate_queue(ops, vals, n, cap):
    buf = [0] * cap
    head = 0
    tail = 0
    count = 0
    total = 0
    for i in range(n):
        if ops[i] == 1:
            if count == cap:
                continue
            buf[tail] = vals[i]
            tail = (tail + 1) % cap
            count += 1
        elif ops[i] == 2:
            if count == 0:
                continue
            total += buf[head]
            head = (head + 1) % cap
            count -= 1
    return total`,
      bugs: { 9: { was: 'count == cap', buggy: '            if tail == head:' } },
    },
    c: {
      correct: `int simulate_queue(int ops[], int vals[], int n, int cap) {
    int buf[10];
    int head = 0, tail = 0, count = 0;
    int total = 0;
    for (int i = 0; i < n; i++) {
        if (ops[i] == 1) {
            if (count == cap) {
                continue;
            }
            buf[tail] = vals[i];
            tail = (tail + 1) % cap;
            count++;
        } else if (ops[i] == 2) {
            if (count == 0) {
                continue;
            }
            total += buf[head];
            head = (head + 1) % cap;
            count--;
        }
    }
    return total;
}`,
      bugs: { 7: { was: 'count == cap', buggy: '            if (tail == head) {' } },
    },
  },
});
