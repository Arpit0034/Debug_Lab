import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p119',
  title: 'A perfectly sized resource gets rejected',
  difficulty: 'Easy',
  topic: 'Greedy',
  subtopic: 'Maximum Satisfied Assignments',
  tags: ['Sorting', 'Matching', 'Resource Allocation'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Greedy smallest-sufficient-resource matching pattern',
  description:
    'Given the minimum resource requirement of each person and the available resource sizes, return the maximum number of people who can receive a sufficient resource. Each resource can be assigned to at most one person.',
  constraints: [
    '0 <= requirements.length, resources.length <= 100000',
    'All values are positive integers.',
    'Each person receives at most one resource.',
  ],
  examples: [
    {
      input: 'requirements = [1,2], resources = [1,2]',
      output: '2',
      note: 'A resource exactly equal to the requirement is sufficient.',
    },
    {
      input: 'requirements = [2], resources = [2]',
      output: '1',
    },
  ],
  hints: [
    'Consider the smallest unfulfilled requirement and the smallest available resource.',
    'Check whether equality is enough to satisfy a person.',
  ],
  complexity: { time: 'O(n log n + m log m)', space: 'O(n + m)' },
  explanation: {
    overview: 'Maximize the number of people who can each receive one resource that meets their minimum requirement.',
    algorithm: 'Sort the requirements and resources independently in ascending order. Compare the smallest unfulfilled requirement with the smallest available resource. When the resource is sufficient, assign it and advance the requirement pointer. Always advance the resource pointer so that each resource is considered at most once.',
    bug: 'The implementation requires the resource size to be strictly greater than the requirement.',
    whyItFails: 'A resource whose size exactly matches a requirement is sufficient. Requiring a strictly larger resource unnecessarily discards valid assignments and can leave people unfulfilled.',
    failingTestCase: 'With requirements [1,2] and resources [1,2], both people can receive an exact match. The correct result is 2, but the buggy comparison accepts only the second person and returns 1.',
    fix: 'Change the comparison to resources[j] >= requirements[i].',
    whyFixWorks: 'The greater-than-or-equal comparison accepts both larger resources and exact matches, which are both valid assignments.',
    dryRun: 'Sort requirements into [1,2] and resources into [1,2]. Compare 1 with 1 and assign the first resource. Compare 2 with 2 and assign the second resource. Both people receive sufficient resources, giving a total of 2.',
    debuggingLesson: 'When a problem specifies a minimum threshold, check whether equality satisfies it. Boundary values frequently reveal incorrect strict comparisons.',
  },
  testCases: [
    {
      input: 'requirements = [1,2], resources = [1,2]',
      expected: '2',
      buggyOutput: '1',
    },
    {
      input: 'requirements = [2], resources = [2]',
      expected: '1',
      buggyOutput: '0',
    },
  ],
  harness: {
    expected: '2 1',
    driver: {
      java: `System.out.print(Solution.maxSatisfied(new int[]{1,2}, new int[]{1,2}) + " ");
System.out.print(Solution.maxSatisfied(new int[]{2}, new int[]{2}));`,
      python: `print(max_satisfied([1,2], [1,2]), max_satisfied([2], [2]))`,
      c: `int a[] = {1,2}, b[] = {1,2}, c[] = {2}, d[] = {2};
printf("%d %d",max_satisfied(a,2,b,2),max_satisfied(c,1,d,1));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static int maxSatisfied(int[] requirements, int[] resources) {
        int[] a = requirements.clone(), b = resources.clone();
        Arrays.sort(a);
        Arrays.sort(b);
        int i = 0, j = 0;
        while (i < a.length && j < b.length) {
            if (b[j] >= a[i]) {
                i++;
            }
            j++;
        }
        return i;
    }
}
`,
      bugs: {
        10: {
          was: 'b[j] >= a[i]',
          buggy: '            if (b[j] > a[i]) {',
        },
      },
    },
    python: {
      correct: `
def max_satisfied(requirements, resources):
    a = sorted(requirements)
    b = sorted(resources)
    i = j = 0
    while i < len(a) and j < len(b):
        if b[j] >= a[i]:
            i += 1
        j += 1
    return i
`,
      bugs: {
        6: {
          was: 'b[j] >= a[i]',
          buggy: '        if b[j] > a[i]:',
        },
      },
    },
    c: {
      correct: `
#include <string.h>
int compare_values(const void* a, const void* b) {
    int x = *(const int*)a, y = *(const int*)b;
    return (x > y) - (x < y);
}
int max_satisfied(int requirements[], int n, int resources[], int m) {
    int* a = malloc(n * sizeof(int));
    int* b = malloc(m * sizeof(int));
    memcpy(a, requirements, n * sizeof(int));
    memcpy(b, resources, m * sizeof(int));
    qsort(a,n,sizeof(int),compare_values);
    qsort(b,m,sizeof(int),compare_values);
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (b[j] >= a[i]) i++;
        j++;
    }
    free(a); free(b);
    return i;
}
`,
      bugs: {
        15: {
          was: 'b[j] >= a[i]',
          buggy: '        if (b[j] > a[i]) i++;',
        },
      },
    },
  },
});
