import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p101',
  title: 'High-value work blocks an urgent task',
  difficulty: 'Hard',
  topic: 'Greedy',
  subtopic: 'Job Sequencing with Deadlines',
  tags: ['Task Scheduling', 'Deadlines', 'Profit Maximization'],
  bugCategory: 'Incorrect Greedy Decision',
  sourceInspiredBy: 'Unit-time job sequencing with deadlines pattern',
  description:
    'Each task takes exactly one time slot and earns a reward when completed no later than its deadline. Given all deadlines and rewards, return the maximum total reward obtainable by scheduling tasks.',
  constraints: [
    '0 <= n <= 10000',
    '1 <= deadlines[i] <= 10000',
    '1 <= profits[i] <= 1000000',
  ],
  examples: [
    {
      input: 'deadlines = [2,1], profits = [100,20]',
      output: '120',
      note: 'The task worth 100 can use slot 2, leaving slot 1 available for the other task.',
    },
    {
      input: 'deadlines = [1], profits = [5]',
      output: '5',
    },
  ],
  hints: [
    'Consider what happens when a valuable task has a later deadline than another task.',
    'After choosing a valuable task, examine which available time slot preserves the most options for remaining tasks.',
  ],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  explanation: {
    overview:
      'Schedule as many valuable unit-time tasks as possible while respecting their deadlines, maximizing the sum of their rewards.',
    algorithm:
      'Sort tasks by descending reward. For each task, find the latest unoccupied time slot that does not exceed its deadline. Schedule the task there if such a slot exists. Keeping selected tasks as late as possible preserves earlier slots for tasks with tighter deadlines.',
    bug:
      'The search for an available slot begins at slot 1 and moves forward instead of beginning at the task deadline and moving backward.',
    whyItFails:
      'A valuable task with a later deadline may occupy an early slot even though it can use a later one. This can prevent a lower-reward task with an earlier deadline from being scheduled. The total reward becomes smaller even though a better arrangement exists.',
    failingTestCase:
      'deadlines = [2,1], profits = [100,20]. The correct schedule places the task worth 100 in slot 2 and the task worth 20 in slot 1, earning 120. The buggy version places the valuable task in slot 1, leaving no valid slot for the other task, and returns 100.',
    fix:
      'Search backward from min(number of slots, task deadline) down to slot 1.',
    whyFixWorks:
      'Placing a task in its latest available valid slot protects earlier slots for tasks that have fewer scheduling options. Processing tasks in descending reward order then maximizes the total reward.',
    dryRun:
      'Sort the tasks into (100,2) and (20,1). For the first task, slots 1 and 2 are empty. Choose slot 2 and earn 100. For the second task, slot 1 is still empty and meets its deadline, so schedule it there and earn another 20. The total is 120. The buggy scan chooses slot 1 for the first task, preventing the second task from being scheduled.',
    debuggingLesson:
      'A greedy choice must preserve future feasibility, not merely satisfy the current item. When assigning scarce resources, inspect whether choosing an earlier or later available position leaves more options for the remaining items.',
  },
  testCases: [
    {
      input: 'deadlines = [2,1], profits = [100,20]',
      expected: '120',
      buggyOutput: '100',
    },
    {
      input: 'deadlines = [1], profits = [5]',
      expected: '5',
    },
  ],
  harness: {
    expected: '120 5',
    driver: {
      java: `System.out.print(Solution.maxJobProfit(new int[]{2,1}, new int[]{100,20}) + " ");
System.out.print(Solution.maxJobProfit(new int[]{1}, new int[]{5}));`,
      python: `print(max_job_profit([2,1], [100,20]), max_job_profit([1], [5]))`,
      c: `int d1[] = {2,1}, p1[] = {100,20};
int d2[] = {1}, p2[] = {5};
printf("%d %d", max_job_profit(d1,p1,2), max_job_profit(d2,p2,1));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int maxJobProfit(int[] deadline, int[] profit) {
        int n = profit.length;
        int[][] jobs = new int[n][2];
        int maxDeadline = 0;
        for (int i = 0; i < n; i++) {
            jobs[i][0] = profit[i];
            jobs[i][1] = deadline[i];
            maxDeadline = Math.max(maxDeadline, deadline[i]);
        }
        Arrays.sort(jobs, (a, b) -> Integer.compare(b[0], a[0]));
        int slots = Math.min(n, maxDeadline);
        boolean[] occupied = new boolean[slots + 1];
        int total = 0;
        for (int[] job : jobs) {
            for (int t = Math.min(slots, job[1]); t >= 1; t--) {
                if (!occupied[t]) {
                    occupied[t] = true;
                    total += job[0];
                    break;
                }
            }
        }
        return total;
    }
}
`,
      bugs: {
        18: {
          was: 't >= 1; t--',
          buggy: '            for (int t = 1; t <= Math.min(slots, job[1]); t++) {',
        },
      },
    },
    python: {
      correct: `
def max_job_profit(deadlines, profits):
    n = len(profits)
    jobs = sorted(zip(profits, deadlines), key=lambda job: job[0], reverse=True)
    max_deadline = max(deadlines, default=0)
    slots = min(n, max_deadline)
    occupied = [False] * (slots + 1)
    total = 0
    for profit, deadline in jobs:
        for slot in range(min(slots, deadline), 0, -1):
            if not occupied[slot]:
                occupied[slot] = True
                total += profit
                break
    return total
`,
      bugs: {
        9: {
          was: 'range(min(slots, deadline), 0, -1)',
          buggy: '        for slot in range(1, min(slots, deadline) + 1):',
        },
      },
    },
    c: {
      correct: `
#include <stdbool.h>

typedef struct { int deadline; int profit; } Job;
int compare_jobs(const void* a, const void* b) {
    const Job* x = (const Job*)a;
    const Job* y = (const Job*)b;
    if (x->profit < y->profit) return 1;
    if (x->profit > y->profit) return -1;
    return 0;
}
int max_job_profit(int deadline[], int profit[], int n) {
    if (n == 0) return 0;
    Job jobs[n];
    int maxDeadline = 0;
    for (int i = 0; i < n; i++) {
        jobs[i].deadline = deadline[i];
        jobs[i].profit = profit[i];
        if (deadline[i] > maxDeadline) maxDeadline = deadline[i];
    }
    qsort(jobs, n, sizeof(Job), compare_jobs);
    int slots = maxDeadline < n ? maxDeadline : n;
    bool occupied[n + 1];
    for (int i = 0; i <= slots; i++) occupied[i] = false;
    int total = 0;
    for (int i = 0; i < n; i++) {
        int limit = jobs[i].deadline < slots ? jobs[i].deadline : slots;
        for (int t = limit; t >= 1; t--) {
            if (!occupied[t]) {
                occupied[t] = true;
                total += jobs[i].profit;
                break;
            }
        }
    }
    return total;
}
`,
      bugs: {
        27: {
          was: 't >= 1; t--',
          buggy: '        for (int t = 1; t <= limit; t++) {',
        },
      },
    },
  },
});
