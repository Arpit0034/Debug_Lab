import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p116',
  title: 'A departing train reserves another platform',
  difficulty: 'Easy',
  topic: 'Greedy',
  subtopic: 'Minimum Railway Platforms',
  tags: ['Intervals', 'Arrival and Departure', 'Scheduling'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Minimum simultaneous resource allocation pattern',
  description:
    'Given arrival and departure times for trains at a station, return the minimum number of platforms required so that every train can use a platform. A departure at the exact time of another arrival frees the platform first.',
  constraints: [
    '1 <= n <= 100000',
    'Every arrival time is no later than its corresponding departure time.',
    'Times are given as integers.',
  ],
  examples: [
    {
      input: 'arrival = [900,1000], departure = [1000,1100]',
      output: '1',
      note: 'The first train leaves when the second arrives, so one platform can be reused.',
    },
    {
      input: 'arrival = [900,920], departure = [950,1000]',
      output: '2',
    },
  ],
  hints: [
    'The order of arrival and departure events matters when both occur at the same time.',
    'Check the equality case in the comparison between the next arrival and departure.',
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Find the smallest number of platforms needed to accommodate every train without conflicts.',
    algorithm: 'Sort arrival times and departure times independently. Track the next arrival and the earliest departure. When the next arrival occurs strictly before the earliest departure, another platform is needed. Otherwise, process the departure first and release a platform. Track the maximum number of platforms occupied.',
    bug: 'The comparison treats an arrival at the exact departure time as requiring another platform.',
    whyItFails: 'The problem explicitly allows the departing train to release its platform before the arriving train uses it. Treating equal timestamps as overlapping temporarily increases the platform count.',
    failingTestCase: 'For arrivals [900,1000] and departures [1000,1100], only one platform is needed because the first train departs at 1000. The buggy implementation returns 2.',
    fix: 'Use arrival[i] < departure[j] rather than arrival[i] <= departure[j].',
    whyFixWorks: 'When the times are equal, the algorithm processes the departure branch and decreases the occupied platform count before considering the new arrival.',
    dryRun: 'The first arrival at 900 needs one platform. The next arrival is 1000, and the earliest departure is also 1000. Process the departure first and reduce the count to zero. The second arrival then uses the same platform, so the maximum required count remains one.',
    debuggingLesson: 'In scheduling and resource-allocation problems, define what happens at equal timestamps. A single equality operator can change whether resources are considered reusable.',
  },
  testCases: [
    {
      input: 'arrival = [900,1000], departure = [1000,1100]',
      expected: '1',
      buggyOutput: '2',
    },
    {
      input: 'arrival = [900,920], departure = [950,1000]',
      expected: '2',
    },
  ],
  harness: {
    expected: '1 2',
    driver: {
      java: `System.out.print(Solution.minPlatforms(new int[]{900,1000}, new int[]{1000,1100}) + " ");
System.out.print(Solution.minPlatforms(new int[]{900,920}, new int[]{950,1000}));`,
      python: `print(min_platforms([900,1000], [1000,1100]), min_platforms([900,920], [950,1000]))`,
      c: `int a1[] = {900,1000}, d1[] = {1000,1100};
int a2[] = {900,920}, d2[] = {950,1000};
printf("%d %d",min_platforms(a1,d1,2),min_platforms(a2,d2,2));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int minPlatforms(int[] arrival, int[] departure) {
        int n = arrival.length;
        if (n == 0) return 0;
        int[] a = arrival.clone(), d = departure.clone();
        Arrays.sort(a);
        Arrays.sort(d);
        int i = 1, j = 0, current = 1, best = 1;
        while (i < n && j < n) {
            if (a[i] < d[j]) {
                current++;
                best = Math.max(best, current);
                i++;
            } else {
                current--;
                j++;
            }
        }
        return best;
    }
}
`,
      bugs: {
        12: {
          was: 'a[i] < d[j]',
          buggy: '            if (a[i] <= d[j]) {',
        },
      },
    },
    python: {
      correct: `
def min_platforms(arrival, departure):
    if not arrival:
        return 0
    a = sorted(arrival)
    d = sorted(departure)
    i, j = 1, 0
    current = best = 1
    while i < len(a) and j < len(d):
        if a[i] < d[j]:
            current += 1
            best = max(best, current)
            i += 1
        else:
            current -= 1
            j += 1
    return best
`,
      bugs: {
        9: {
          was: 'a[i] < d[j]',
          buggy: '        if a[i] <= d[j]:',
        },
      },
    },
    c: {
      correct: `
int compare_ints(const void* a, const void* b) {
    int x = *(const int*)a, y = *(const int*)b;
    return (x > y) - (x < y);
}
int min_platforms(int arrival[], int departure[], int n) {
    if (n == 0) return 0;
    int* a = malloc(n * sizeof(int));
    int* d = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        a[i] = arrival[i];
        d[i] = departure[i];
    }
    qsort(a,n,sizeof(int),compare_ints);
    qsort(d,n,sizeof(int),compare_ints);
    int i = 1, j = 0, current = 1, best = 1;
    while (i < n && j < n) {
        if (a[i] < d[j]) {
            current++;
            if (current > best) best = current;
            i++;
        } else {
            current--;
            j++;
        }
    }
    free(a); free(d);
    return best;
}
`,
      bugs: {
        17: {
          was: 'a[i] < d[j]',
          buggy: '        if (a[i] <= d[j]) {',
        },
      },
    },
  },
});
