import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p115',
  title: 'The heaviest reward consumes the budget',
  difficulty: 'Medium',
  topic: 'Greedy',
  subtopic: 'Fractional Knapsack',
  tags: ['Knapsack', 'Value Density', 'Optimization'],
  bugCategory: 'Incorrect Comparator Logic',
  sourceInspiredBy: 'Fractional knapsack value-density pattern',
  description:
    'Given items with values and weights and a maximum carrying capacity, return the greatest value that can be collected. An item may be divided into fractions, and its value changes proportionally with the fraction taken.',
  constraints: [
    '1 <= n <= 10000',
    '1 <= weights[i] <= 1000000',
    '1 <= values[i] <= 1000000',
    '0 <= capacity <= 1000000',
  ],
  examples: [
    {
      input: 'values = [100,60,120], weights = [100,20,30], capacity = 50',
      output: '180.00',
      note: 'The two items with the highest value per unit weight fill the capacity.',
    },
    {
      input: 'values = [100,60], weights = [100,20], capacity = 20',
      output: '60.00',
    },
  ],
  hints: [
    'Consider how much value each unit of weight contributes.',
    'Compare two items using their value-to-weight ratios, not their total values.',
  ],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  explanation: {
    overview: 'Maximize the total value that fits in a limited capacity when items can be divided.',
    algorithm: 'Repeatedly choose the available item with the greatest value per unit weight. If the entire item fits, take it all. Otherwise, take only the remaining capacity as a fraction of that item and finish. Track which items have already been considered.',
    bug: 'The comparison chooses the item with the greatest total value rather than the greatest value per unit weight.',
    whyItFails: 'An expensive item can also be very heavy. When only part of the item can be carried, its total value is not the correct measure of how useful it is. The relevant measure is the value contributed by each unit of weight.',
    failingTestCase: 'For values [100,60,120], weights [100,20,30], and capacity 50, the correct choice takes the item worth 120 and the item worth 60, producing 180. Choosing by total value takes the 120 item first and then a fraction of the 100 item, producing 140.',
    fix: 'Compare value[i] / weight[i] against value[best] / weight[best], using cross multiplication to avoid floating-point comparison errors.',
    whyFixWorks: 'Cross multiplication compares the ratios without division. It selects the item with the highest value density, which maximizes the value collected for every unit of available capacity.',
    dryRun: 'The three ratios are 1, 3, and 4. Choose the third item completely, consuming 30 units and gaining 120. Choose the second item completely, consuming the remaining 20 units and gaining 60. The total value is 180.',
    debuggingLesson: 'When comparing options with different resource requirements, compare their efficiency rather than their absolute rewards. Use cross multiplication when a ratio comparison can be performed exactly.',
  },
  testCases: [
    {
      input: 'values = [100,60,120], weights = [100,20,30], capacity = 50',
      expected: '180.00',
      buggyOutput: '140.00',
    },
    {
      input: 'values = [100,60], weights = [100,20], capacity = 20',
      expected: '60.00',
      buggyOutput: '20.00',
    },
  ],
  harness: {
    expected: '180.00 60.00',
    driver: {
      java: `System.out.printf(java.util.Locale.US, "%.2f %.2f",
Solution.fractionalKnapsack(new int[]{100,60,120}, new int[]{100,20,30}, 50),
Solution.fractionalKnapsack(new int[]{100,60}, new int[]{100,20}, 20));`,
      python: `print(f"{fractional_knapsack([100,60,120],[100,20,30],50):.2f} {fractional_knapsack([100,60],[100,20],20):.2f}")`,
      c: `int v1[] = {100,60,120}, w1[] = {100,20,30};
int v2[] = {100,60}, w2[] = {100,20};
printf("%.2f %.2f",fractional_knapsack(v1,w1,3,50),fractional_knapsack(v2,w2,2,20));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static double fractionalKnapsack(int[] values, int[] weights, int capacity) {
        int n = values.length;
        boolean[] used = new boolean[n];
        double total = 0.0;
        for (int count = 0; count < n && capacity > 0; count++) {
            int best = -1;
            for (int i = 0; i < n; i++) {
                if (!used[i] && (best == -1 ||
                        (long) values[i] * weights[best] > (long) values[best] * weights[i])) {
                    best = i;
                }
            }
            if (best == -1) break;
            int take = Math.min(capacity, weights[best]);
            total += (double) values[best] * take / weights[best];
            capacity -= take;
            used[best] = true;
        }
        return total;
    }
}
`,
      bugs: {
        10: {
          was: '(long) values[i] * weights[best] > (long) values[best] * weights[i]',
          buggy: '                        values[i] > values[best])) {',
        },
      },
    },
    python: {
      correct: `
def fractional_knapsack(values, weights, capacity):
    n = len(values)
    used = [False] * n
    total = 0.0
    for _ in range(n):
        if capacity <= 0:
            break
        best = -1
        for i in range(n):
            if not used[i] and (best == -1 or values[i] * weights[best] > values[best] * weights[i]):
                best = i
        if best == -1:
            break
        take = min(capacity, weights[best])
        total += values[best] * take / weights[best]
        capacity -= take
        used[best] = True
    return total
`,
      bugs: {
        10: {
          was: 'values[i] * weights[best] > values[best] * weights[i]',
          buggy: '            if not used[i] and (best == -1 or values[i] > values[best]):',
        },
      },
    },
    c: {
      correct: `
double fractional_knapsack(int values[], int weights[], int n, int capacity) {
    int* used = calloc(n, sizeof(int));
    double total = 0.0;
    for (int count = 0; count < n && capacity > 0; count++) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (!used[i] && (best == -1 ||
                    (long long)values[i] * weights[best] > (long long)values[best] * weights[i])) {
                best = i;
            }
        }
        if (best == -1) break;
        int take = capacity < weights[best] ? capacity : weights[best];
        total += (double)values[best] * take / weights[best];
        capacity -= take;
        used[best] = 1;
    }
    free(used);
    return total;
}
`,
      bugs: {
        8: {
          was: '(long long)values[i] * weights[best] > (long long)values[best] * weights[i]',
          buggy: '                    values[i] > values[best])) {',
        },
      },
    },
  },
});
