import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p071',
  title: 'A long activity blocks two shorter opportunities',
  difficulty: 'Medium',
  topic: 'Greedy',
  subtopic: 'Activity Selection',
  tags: ['Intervals', 'Scheduling', 'Greedy Choice'],
  bugCategory: 'Incorrect Greedy Decision',
  sourceInspiredBy: 'Maximum compatible activities selection pattern',
  description: 'Given activities with start and finish times, return the maximum number of activities that can be completed without overlapping.',
  constraints: ['1 <= n <= 100000', 'Start times are less than finish times.', 'Activities are represented by integer times.'],
  examples: [
    { input: 'activities = [[1,10],[2,3],[4,5],[6,7]]', output: '3' },
    { input: 'activities = [[1,2],[2,3],[3,4]]', output: '3' }
  ],
  hints: ['Consider which activity leaves the most room for future choices.', 'Compare the finish times of the first two candidates.'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Select the largest possible number of mutually compatible activities.',
    algorithm: 'Sort activities by finishing time. Select the first activity, then select each subsequent activity whose start time is at least the finish time of the previously selected activity.',
    bug: 'The activities are sorted by starting time rather than finishing time.',
    whyItFails: 'An early-starting activity may occupy a very long interval. Choosing it first can prevent multiple shorter compatible activities from being selected.',
    failingTestCase: 'For [[1,10],[2,3],[4,5],[6,7]], sorting by start time selects only [1,10]. The correct selection is [2,3],[4,5],[6,7], giving 3.',
    fix: 'Sort activities in ascending order of finishing time.',
    whyFixWorks: 'Selecting the earliest finishing compatible activity leaves the maximum remaining time for subsequent activities.',
    dryRun: 'The finishing times are 10, 3, 5, 7. After sorting by finish time, the order becomes [2,3],[4,5],[6,7],[1,10]. Select [2,3], then [4,5], then [6,7]. The final activity overlaps and is rejected. Count = 3.',
    debuggingLesson: 'Before applying a greedy selection, identify the quantity that must be optimized and verify that the sorting order supports the greedy-choice argument.'
  },
  testCases: [
    { input: '[[1,10],[2,3],[4,5],[6,7]]', expected: '3', buggyOutput: '1' },
    { input: '[[1,2],[2,3],[3,4]]', expected: '3' }
  ],
  harness: {
    expected: '3 3',
    driver: {
      java: `System.out.print(Solution.maxActivities(new int[][]{{1,10},{2,3},{4,5},{6,7}}) + " " + Solution.maxActivities(new int[][]{{1,2},{2,3},{3,4}}));`,
      python: `print(max_activities([[1,10],[2,3],[4,5],[6,7]]), max_activities([[1,2],[2,3],[3,4]]))`,
      c: `int a[][2]={{1,10},{2,3},{4,5},{6,7}}, b[][2]={{1,2},{2,3},{3,4}}; printf("%d %d",max_activities(a,4),max_activities(b,3));`
    }
  },
  code: {
    java: {
      correct: `
class Solution {
    static int maxActivities(int[][] a) {
        int[][] x = new int[a.length][2];
        for (int i=0;i<a.length;i++) x[i]=a[i].clone();
        java.util.Arrays.sort(x,(p,q)->Integer.compare(p[1],q[1]));
        int count=0, last=-1;
        for (int[] activity:x) {
            if (count==0 || activity[0]>=last) {
                count++;
                last=activity[1];
            }
        }
        return count;
    }
}
`,
      bugs: { 5: { was: 'Integer.compare(p[1],q[1])', buggy: '        java.util.Arrays.sort(x,(p,q)->Integer.compare(p[0],q[0]));' } }
    },
    python: {
      correct: `
def max_activities(activities):
    items = sorted(activities, key=lambda x: x[1])
    count = 0
    last = None
    for start, finish in items:
        if last is None or start >= last:
            count += 1
            last = finish
    return count
`,
      bugs: { 2: { was: 'key=lambda x: x[1]', buggy: '    items = sorted(activities, key=lambda x: x[0])' } }
    },
    c: {
      correct: `
#include <string.h>
int max_activities(int a[][2], int n) {
    int x[1000][2];
    memcpy(x,a,n*sizeof(x[0]));
    for (int i=0;i<n;i++)
        for (int j=i+1;j<n;j++)
            if (x[i][1]>x[j][1]) {
                int s=x[i][0],f=x[i][1];
                x[i][0]=x[j][0];x[i][1]=x[j][1];
                x[j][0]=s;x[j][1]=f;
            }
    int count=0,last=-1;
    for (int i=0;i<n;i++) {
        if (count==0 || x[i][0]>=last) {
            count++;
            last=x[i][1];
        }
    }
    return count;
}
`,
      bugs: { 7: { was: 'x[i][1]>x[j][1]', buggy: '            if (x[i][0]>x[j][0]) {' } }
    }
  }
});
