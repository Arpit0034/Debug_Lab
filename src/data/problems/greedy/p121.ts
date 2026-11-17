import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p121',
  title: 'A rating drop receives an excessive reward',
  difficulty: 'Medium',
  topic: 'Greedy',
  subtopic: 'Candy Distribution',
  tags: ['Array Traversal', 'Two Passes', 'Constraint Satisfaction'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Two-pass minimum candy distribution pattern',
  description:
    'Given the ratings of children standing in a line, return the minimum total number of rewards required. Every child must receive at least one reward, and a child with a higher rating than an adjacent child must receive more rewards than that neighbor.',
  constraints: [
    '1 <= ratings.length <= 100000',
    '0 <= ratings[i] <= 100000',
    'Rewards must be positive integers.',
  ],
  examples: [
    {
      input: 'ratings = [1,3,2]',
      output: '4',
      note: 'The required distribution is [1,2,1].',
    },
    {
      input: 'ratings = [1,2,3]',
      output: '6',
    },
  ],
  hints: [
    'The constraints apply in both directions along the line.',
    'When adjusting rewards from right to left, compare the current reward with the next child’s requirement.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Calculate the minimum total rewards while respecting relative ratings of neighboring children.',
    algorithm: 'Give every child one reward. Scan from left to right and increase a child’s reward when its rating is greater than the previous child’s rating. Then scan from right to left and increase a child’s reward when its rating is greater than the next child’s rating. Use the maximum of the two requirements so that both directions remain valid.',
    bug: 'The right-to-left pass adds one to the current child’s reward instead of the next child’s reward.',
    whyItFails: 'The next child is the neighbor whose reward establishes the minimum requirement for the current child. Adding one to the current reward itself unnecessarily increases the reward and can violate the minimum-total objective.',
    failingTestCase: 'For ratings [1,3,2], the first pass gives [1,2,1]. The middle child is higher-rated than the final child, so its reward needs to be at least 2. The buggy update increases it to 3, returning 5 instead of 4.',
    fix: 'Use candies[i + 1] + 1 as the right-side requirement.',
    whyFixWorks: 'The current child receives just enough rewards to exceed the next child when necessary, while the maximum operation preserves any larger requirement already established by the left-to-right pass.',
    dryRun: 'Initialize rewards to [1,1,1]. The forward pass processes the increasing pair at indices 0 and 1, giving [1,2,1]. In the reverse pass, rating 3 exceeds rating 2, so the middle reward becomes max(2,1+1) = 2. The first child already satisfies its neighbor. The total is 1+2+1 = 4.',
    debuggingLesson: 'When combining constraints from two directions, make sure each update references the neighboring state that establishes the constraint. Reusing the current value can cause unnecessary increases.',
  },
  testCases: [
    {
      input: 'ratings = [1,3,2]',
      expected: '4',
      buggyOutput: '5',
    },
    {
      input: 'ratings = [1,2,3]',
      expected: '6',
    },
  ],
  harness: {
    expected: '4 6',
    driver: {
      java: `System.out.print(Solution.minimumCandies(new int[]{1,3,2}) + " ");
System.out.print(Solution.minimumCandies(new int[]{1,2,3}));`,
      python: `print(minimum_candies([1,3,2]), minimum_candies([1,2,3]))`,
      c: `int a[] = {1,3,2}, b[] = {1,2,3};
printf("%d %d",minimum_candies(a,3),minimum_candies(b,3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int minimumCandies(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];
        java.util.Arrays.fill(candies, 1);
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i-1]) candies[i] = candies[i-1] + 1;
        }
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i+1]) {
                candies[i] = Math.max(candies[i], candies[i+1] + 1);
            }
        }
        int total = 0;
        for (int value : candies) total += value;
        return total;
    }
}
`,
      bugs: {
        11: {
          was: 'candies[i+1] + 1',
          buggy: '                candies[i] = Math.max(candies[i], candies[i] + 1);',
        },
      },
    },
    python: {
      correct: `
def minimum_candies(ratings):
    n = len(ratings)
    candies = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            candies[i] = candies[i - 1] + 1
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            candies[i] = max(candies[i], candies[i + 1] + 1)
    return sum(candies)
`,
      bugs: {
        9: {
          was: 'candies[i + 1] + 1',
          buggy: '            candies[i] = max(candies[i], candies[i] + 1)',
        },
      },
    },
    c: {
      correct: `
int minimum_candies(int ratings[], int n) {
    int* candies = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) candies[i] = 1;
    for (int i = 1; i < n; i++) {
        if (ratings[i] > ratings[i-1]) candies[i] = candies[i-1] + 1;
    }
    for (int i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i+1]) {
            int required = candies[i+1] + 1;
            if (candies[i] < required) candies[i] = required;
        }
    }
    int total = 0;
    for (int i = 0; i < n; i++) total += candies[i];
    free(candies);
    return total;
}
`,
      bugs: {
        9: {
          was: 'candies[i+1] + 1',
          buggy: '            int required = candies[i] + 1;',
        },
      },
    },
  },
});
