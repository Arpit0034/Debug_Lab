import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p143',
  title: 'Tombstone halts linear probe',
  difficulty: 'Hard',
  topic: 'Hashing',
  subtopic: 'Open Addressing Search',
  tags: ['Collision Resolution', 'Tombstone Marker'],
  bugCategory: 'Incorrect Hash-based Lookup',
  sourceInspiredBy: 'Hash table with open addressing deletion pattern',
  description:
    'Simulate an open-addressed key container with linear collision resolution across capacity 16. Support insert (1), delete (2), and search (3) operations. Return the count of successful searches. The search implementation halts upon encountering a tombstone marker created by deletion, severing the collision chain.',
  constraints: ['1 <= n <= 100', '1 <= keys[i] <= 1000'],
  examples: [
    { input: 'ops = [1, 1, 2, 3], keys = [1, 17, 1, 17]', output: '1', note: 'Key 1 and 17 collide at slot 1. Deleting 1 leaves 17 reachable at slot 2.' },
    { input: 'ops = [1, 3], keys = [5, 5]', output: '1' },
  ],
  hints: [
    'Notice the difference between an unallocated empty slot and a slot from which a key was deleted.',
    'Check whether searching linear probe chains should stop when encountering a deletion marker.',
  ],
  complexity: { time: 'O(n)', space: 'O(cap)' },
  explanation: {
    overview: 'Implement an open-addressed lookup container with deletion tombstones.',
    algorithm:
      'Resolve collisions by linear probing. When a key is deleted, mark the slot with a tombstone (-1) rather than resetting to empty (0), so that collision chains extending past that slot remain searchable.',
    bug: 'In the search routine, probing stops when table[idx] == 0 or table[idx] == -1 instead of only stopping on a true empty slot (table[idx] == 0).',
    whyItFails:
      'Halting search at a tombstone prematurely aborts the probe chain, making keys that collided past the deleted slot unreachable.',
    failingTestCase: 'ops = [1, 1, 2, 3], keys = [1, 17, 1, 17]: search for 17 returns 0 instead of 1 because the tombstone at slot 1 stops the probe.',
    fix: 'Only stop search when encountering an unallocated empty slot: if (table[idx] == 0) break.',
    whyFixWorks: 'Continuing past tombstones allows the probe to reach subsequent collided keys while preserving O(1) average lookup.',
    dryRun:
      'Keys 1 and 17 hash to slot 1. Key 1 goes to slot 1, key 17 goes to slot 2. Deleting 1 marks slot 1 as -1. Search for 17: slot 1 is -1 (not 0, continue), slot 2 matches 17. Returns 1.',
    debuggingLesson:
      'In open addressing with deletion, search probe chains must never terminate on tombstones; only true empty cells terminate search.',
  },
  testCases: [
    { input: 'ops = [1, 1, 2, 3], keys = [1, 17, 1, 17]', expected: '1', buggyOutput: '0' },
    { input: 'ops = [1, 3], keys = [5, 5]', expected: '1' },
  ],
  harness: {
    expected: '1 1',
    driver: {
      java: `System.out.println(Solution.runHashTable(new int[]{1, 1, 2, 3}, new int[]{1, 17, 1, 17}, 4) + " " + Solution.runHashTable(new int[]{1, 3}, new int[]{5, 5}, 2));`,
      python: `print(run_hash_table([1, 1, 2, 3], [1, 17, 1, 17], 4), run_hash_table([1, 3], [5, 5], 2))`,
      c: `printf("%d %d", run_hash_table((int[]){1, 1, 2, 3}, (int[]){1, 17, 1, 17}, 4), run_hash_table((int[]){1, 3}, (int[]){5, 5}, 2));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int runHashTable(int[] ops, int[] keys, int n) {
        int cap = 16;
        int[] table = new int[cap];
        int total = 0;
        for (int i = 0; i < n; i++) {
            int op = ops[i];
            int k = keys[i];
            int slot = k % cap;
            if (op == 1) {
                for (int j = 0; j < cap; j++) {
                    int idx = (slot + j) % cap;
                    if (table[idx] == 0 || table[idx] == -1) {
                        table[idx] = k;
                        break;
                    }
                }
            } else if (op == 2) {
                for (int j = 0; j < cap; j++) {
                    int idx = (slot + j) % cap;
                    if (table[idx] == 0) break;
                    if (table[idx] == k) {
                        table[idx] = -1;
                        break;
                    }
                }
            } else if (op == 3) {
                int found = 0;
                for (int j = 0; j < cap; j++) {
                    int idx = (slot + j) % cap;
                    if (table[idx] == 0) break;
                    if (table[idx] == k) {
                        found = 1;
                        break;
                    }
                }
                total += found;
            }
        }
        return total;
    }
}`,
      bugs: { 31: { was: 'table[idx] == 0', buggy: '                    if (table[idx] == 0 || table[idx] == -1) break;' } },
    },
    python: {
      correct: `def run_hash_table(ops, keys, n):
    cap = 16
    table = [0] * cap
    total = 0
    for i in range(n):
        op = ops[i]
        k = keys[i]
        slot = k % cap
        if op == 1:
            for j in range(cap):
                idx = (slot + j) % cap
                if table[idx] == 0 or table[idx] == -1:
                    table[idx] = k
                    break
        elif op == 2:
            for j in range(cap):
                idx = (slot + j) % cap
                if table[idx] == 0:
                    break
                if table[idx] == k:
                    table[idx] = -1
                    break
        elif op == 3:
            found = 0
            for j in range(cap):
                idx = (slot + j) % cap
                if table[idx] == 0:
                    break
                if table[idx] == k:
                    found = 1
                    break
            total += found
    return total`,
      bugs: { 27: { was: 'table[idx] == 0:', buggy: '                if table[idx] == 0 or table[idx] == -1:' } },
    },
    c: {
      correct: `int run_hash_table(int ops[], int keys[], int n) {
    int cap = 16;
    int table[16] = {0};
    int total = 0;
    for (int i = 0; i < n; i++) {
        int op = ops[i];
        int k = keys[i];
        int slot = k % cap;
        if (op == 1) {
            for (int j = 0; j < cap; j++) {
                int idx = (slot + j) % cap;
                if (table[idx] == 0 || table[idx] == -1) {
                    table[idx] = k;
                    break;
                }
            }
        } else if (op == 2) {
            for (int j = 0; j < cap; j++) {
                int idx = (slot + j) % cap;
                if (table[idx] == 0) break;
                if (table[idx] == k) {
                    table[idx] = -1;
                    break;
                }
            }
        } else if (op == 3) {
            int found = 0;
            for (int j = 0; j < cap; j++) {
                int idx = (slot + j) % cap;
                if (table[idx] == 0) break;
                if (table[idx] == k) {
                    found = 1;
                    break;
                }
            }
            total += found;
        }
    }
    return total;
}`,
      bugs: { 30: { was: 'table[idx] == 0', buggy: '                if (table[idx] == 0 || table[idx] == -1) break;' } },
    },
  },
});
