import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p100',
  title: 'Back-to-back sessions are rejected',
  difficulty: 'Easy',
  topic: 'Greedy',
  subtopic: 'Activity Selection',
  tags: ['Intervals', 'Scheduling', 'Boundary Conditions'],
  bugCategory: 'Incorrect Greedy Decision',
  sourceInspiredBy: 'Maximum compatible activity selection pattern',
  description:
    'Given activities already ordered by nondecreasing finishing time, return the maximum number that can be scheduled without overlap. An activity may begin exactly when the previous activity ends.',
  constraints: [
    '0 <= n <= 100000',
    'start.length = end.length = n',
    'Activities are ordered by nondecreasing finishing time.',
  ],
  examples: [
    {
      input: 'start = [1,2,3], end = [2,3,4]',
      output: '3',
      note: 'Each activity begins exactly when the previous one ends.',
    },
    {
      input: 'start = [1,2,4], end = [3,4,5]',
      output: '2',
    },
  ],
  hints: [
    'Check whether equal boundary times can both be accommodated.',
    'Trace the acceptance condition using two activities that meet at one endpoint.',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview:
      'Choose the largest possible number of non-overlapping activities from a list ordered by finishing time.',
    algorithm:
      'Select the first activity, then inspect the remaining activities in order. Accept an activity whenever its start time is greater than or equal to the finishing time of the last accepted activity. Update the last finishing time after every selection.',
    bug:
      'The comparison requires the next start time to be strictly greater than the previous finishing time.',
    whyItFails:
      'The problem allows one activity to begin exactly when another finishes. Requiring a strictly greater start time incorrectly rejects activities that meet at an endpoint, even though they do not overlap.',
    failingTestCase:
      'start = [1,2,3], end = [2,3,4]. All three activities can be scheduled, but the buggy version accepts only the first and third, returning 2 instead of 3.',
    fix:
      'Change the comparison from start[i] > lastEnd to start[i] >= lastEnd.',
    whyFixWorks:
      'The greater-than-or-equal comparison accepts both strictly separated activities and activities that begin exactly at the previous finishing time.',
    dryRun:
      'Select activity [1,2], setting lastEnd = 2 and count = 1. The next activity [2,3] begins at 2, so it is valid and increases the count to 2. Set lastEnd = 3. The final activity [3,4] is also valid, bringing the count to 3.',
    debuggingLesson:
      'Translate interval compatibility rules into exact comparison operators. Whether equality is allowed can change the result substantially.',
  },
  testCases: [
    {
      input: 'start = [1,2,3], end = [2,3,4]',
      expected: '3',
      buggyOutput: '2',
    },
    {
      input: 'start = [1,2,4], end = [3,4,5]',
      expected: '2',
    },
  ],
  harness: {
    expected: '3 2',
    driver: {
      java: `System.out.print(Solution.maxActivities(new int[]{1,2,3}, new int[]{2,3,4}) + " ");
System.out.print(Solution.maxActivities(new int[]{1,2,4}, new int[]{3,4,5}));`,
      python: `print(max_activities([1,2,3], [2,3,4]), max_activities([1,2,4], [3,4,5]))`,
      c: `int s1[] = {1,2,3}, e1[] = {2,3,4};
int s2[] = {1,2,4}, e2[] = {3,4,5};
printf("%d %d", max_activities(s1,e1,3), max_activities(s2,e2,3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int maxActivities(int[] start, int[] end) {
        if (start.length == 0) return 0;
        int count = 1;
        int lastEnd = end[0];
        for (int i = 1; i < start.length; i++) {
            if (start[i] >= lastEnd) {
                count++;
                lastEnd = end[i];
            }
        }
        return count;
    }
}
`,
      bugs: {
        7: {
          was: 'start[i] >= lastEnd',
          buggy: '            if (start[i] > lastEnd) {',
        },
      },
    },
    python: {
      correct: `
def max_activities(start, end):
    if not start:
        return 0
    count = 1
    last_end = end[0]
    for i in range(1, len(start)):
        if start[i] >= last_end:
            count += 1
            last_end = end[i]
    return count
`,
      bugs: {
        7: {
          was: 'start[i] >= last_end',
          buggy: '        if start[i] > last_end:',
        },
      },
    },
    c: {
      correct: `
int max_activities(int start[], int end[], int n) {
    if (n == 0) return 0;
    int count = 1;
    int last_end = end[0];
    for (int i = 1; i < n; i++) {
        if (start[i] >= last_end) {
            count++;
            last_end = end[i];
        }
    }
    return count;
}
`,
      bugs: {
        6: {
          was: 'start[i] >= last_end',
          buggy: '        if (start[i] > last_end) {',
        },
      },
    },
  },
});
