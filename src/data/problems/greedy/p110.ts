import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p110',
  title: 'The longest booking blocks the calendar',
  difficulty: 'Medium',
  topic: 'Greedy',
  subtopic: 'Minimum Interval Removal',
  tags: ['Intervals', 'Scheduling', 'Overlap'],
  bugCategory: 'Incorrect Greedy Decision',
  sourceInspiredBy: 'Minimum overlapping interval removal pattern',
  description:
    'Given a collection of time intervals, return the minimum number of intervals that must be removed so that no two remaining intervals overlap. Intervals that touch at an endpoint are allowed.',
  constraints: [
    '0 <= intervals.length <= 100000',
    'start < end for every interval.',
    'Interval endpoints are integers.',
  ],
  examples: [
    {
      input: 'intervals = [[1,100],[2,3],[3,4],[4,5]]',
      output: '1',
      note: 'Removing the long interval allows all three shorter intervals to remain.',
    },
    {
      input: 'intervals = [[1,2],[2,3]]',
      output: '0',
    },
  ],
  hints: [
    'Think about which interval should be considered first when several intervals overlap.',
    'Compare sorting by the beginning with sorting by the finishing time.',
  ],
  complexity: { time: 'O(n log n)', space: 'O(n log n)' },
  explanation: {
    overview: 'Remove the fewest intervals necessary to obtain a collection with no overlapping pairs.',
    algorithm: 'Sort intervals by increasing finishing time. Keep the first interval, then inspect the remaining intervals. Keep an interval whenever its start is greater than or equal to the finishing time of the last kept interval. The answer is the original count minus the number kept.',
    bug: 'The intervals are sorted by starting time instead of finishing time.',
    whyItFails: 'A long interval that begins early may overlap several shorter intervals. Selecting it first can force the removal of many other intervals. Selecting the interval that finishes earliest preserves more room for subsequent choices.',
    failingTestCase: 'For [[1,100],[2,3],[3,4],[4,5]], sorting by start selects [1,100] first and leaves no compatible intervals. The buggy version removes three intervals, while removing only [1,100] leaves three compatible intervals.',
    fix: 'Sort using the interval finishing time as the comparison key.',
    whyFixWorks: 'Finishing earlier leaves the largest possible remaining portion of the timeline available for other intervals. Repeating this choice maximizes the number of kept intervals.',
    dryRun: 'Sort the intervals by finishing time: [2,3], [3,4], [4,5], [1,100]. Keep [2,3]. Keep [3,4] because it begins at 3. Keep [4,5] because it begins at 4. Reject [1,100] because it overlaps the selected intervals. Keep three and remove one.',
    debuggingLesson: 'For interval optimization problems, identify whether the objective rewards an early start or an early finish. The correct sorting key follows from which choice preserves the most future options.',
  },
  testCases: [
    {
      input: '[[1,100],[2,3],[3,4],[4,5]]',
      expected: '1',
      buggyOutput: '3',
    },
    {
      input: '[[1,2],[2,3]]',
      expected: '0',
    },
  ],
  harness: {
    expected: '1 0',
    driver: {
      java: `System.out.print(Solution.minRemovals(new int[][]{{1,100},{2,3},{3,4},{4,5}}) + " ");
System.out.print(Solution.minRemovals(new int[][]{{1,2},{2,3}}));`,
      python: `print(min_removals([[1,100],[2,3],[3,4],[4,5]]), min_removals([[1,2],[2,3]]))`,
      c: `int a[4][2] = {{1,100},{2,3},{3,4},{4,5}};
int b[2][2] = {{1,2},{2,3}};
printf("%d %d",min_removals(a,4),min_removals(b,2));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int minRemovals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int n = intervals.length;
        if (n == 0) return 0;
        int kept = 1;
        int lastEnd = intervals[0][1];
        for (int i = 1; i < n; i++) {
            if (intervals[i][0] >= lastEnd) {
                kept++;
                lastEnd = intervals[i][1];
            }
        }
        return n - kept;
    }
}
`,
      bugs: {
        5: {
          was: 'a[1], b[1]',
          buggy: '        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));',
        },
      },
    },
    python: {
      correct: `
def min_removals(intervals):
    intervals = sorted(intervals, key=lambda x: x[1])
    if not intervals:
        return 0
    kept = 1
    last_end = intervals[0][1]
    for start, end in intervals[1:]:
        if start >= last_end:
            kept += 1
            last_end = end
    return len(intervals) - kept
`,
      bugs: {
        2: {
          was: 'key=lambda x: x[1]',
          buggy: '    intervals = sorted(intervals, key=lambda x: x[0])',
        },
      },
    },
    c: {
      correct: `
int compare_finish(const void* a, const void* b) {
    const int* x = (const int*)a;
    const int* y = (const int*)b;
    return (x[1] > y[1]) - (x[1] < y[1]);
}
int min_removals(int intervals[][2], int n) {
    if (n == 0) return 0;
    qsort(intervals, n, sizeof(intervals[0]), compare_finish);
    int kept = 1;
    int last_end = intervals[0][1];
    for (int i = 1; i < n; i++) {
        if (intervals[i][0] >= last_end) {
            kept++;
            last_end = intervals[i][1];
        }
    }
    return n - kept;
}
`,
      bugs: {
        4: {
          was: '(x[1] > y[1])',
          buggy: '    return (x[0] > y[0]) - (x[0] < y[0]);',
        },
      },
    },
  },
});
