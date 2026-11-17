import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p120',
  title: 'The starting station is one step behind',
  difficulty: 'Medium',
  topic: 'Greedy',
  subtopic: 'Circular Fuel Route',
  tags: ['Circular Array', 'Fuel Management', 'Reachability'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Gas station circular route pattern',
  description:
    'Given the fuel available at each station and the fuel needed to travel to the next station, return an index from which a vehicle can complete the entire circular route. Return -1 when no starting station works. The vehicle begins with an empty tank.',
  constraints: [
    '1 <= gas.length = cost.length <= 100000',
    'All values are nonnegative integers.',
    'The vehicle can carry unlimited fuel.',
  ],
  examples: [
    {
      input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]',
      output: '3',
      note: 'Starting at station 3 allows the vehicle to complete the circuit.',
    },
    {
      input: 'gas = [2,3,4], cost = [3,4,3]',
      output: '-1',
    },
  ],
  hints: [
    'When the fuel balance becomes negative, none of the stations in the current candidate segment can be the starting point.',
    'Check the first station after the failed segment.',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Find a station from which a vehicle can complete a circular route without running out of fuel.',
    algorithm: 'Calculate the overall difference between available fuel and required fuel. If the total is negative, no solution exists. Otherwise, scan the stations while maintaining the current fuel balance. Whenever the balance becomes negative, discard the current candidate segment and start from the following station.',
    bug: 'After a candidate starting segment fails, the next candidate is set to the failing station itself instead of the following station.',
    whyItFails: 'If the vehicle cannot reach the next station from a particular candidate, none of the stations already included in that failed segment can be a valid starting point. Reusing the failing station can therefore return a position that immediately fails.',
    failingTestCase: 'For gas [1,2,3,4,5] and cost [3,4,5,1,2], the correct starting station is 3. The buggy version updates the candidate one position too early and returns 2.',
    fix: 'Set start = i + 1 when the running fuel balance becomes negative.',
    whyFixWorks: 'Every station from the previous candidate through the failing station is excluded. The next station is the first remaining candidate that has not been ruled out.',
    dryRun: 'The net fuel changes are [-2,-2,-2,3,3]. At station 0, the balance becomes negative, so the next candidate is 1. Station 1 also produces a negative balance, so the candidate becomes 2. Station 2 fails, so the candidate becomes 3. Stations 3 and 4 accumulate a positive balance. The total net balance is zero, so station 3 completes the circuit.',
    debuggingLesson: 'When discarding a failed segment, identify exactly which elements are proven impossible and where the next candidate begins. Candidate resets frequently contain off-by-one errors.',
  },
  testCases: [
    {
      input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]',
      expected: '3',
      buggyOutput: '2',
    },
    {
      input: 'gas = [2,3,4], cost = [3,4,3]',
      expected: '-1',
    },
  ],
  harness: {
    expected: '3 -1',
    driver: {
      java: `System.out.print(Solution.startStation(new int[]{1,2,3,4,5}, new int[]{3,4,5,1,2}) + " ");
System.out.print(Solution.startStation(new int[]{2,3,4}, new int[]{3,4,3}));`,
      python: `print(start_station([1,2,3,4,5], [3,4,5,1,2]), start_station([2,3,4], [3,4,3]))`,
      c: `int a[] = {1,2,3,4,5}, b[] = {3,4,5,1,2};
int c[] = {2,3,4}, d[] = {3,4,3};
printf("%d %d",start_station(a,b,5),start_station(c,d,3));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int startStation(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int change = gas[i] - cost[i];
            total += change;
            tank += change;
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return total < 0 ? -1 : start;
    }
}
`,
      bugs: {
        9: {
          was: 'start = i + 1;',
          buggy: '                start = i;',
        },
      },
    },
    python: {
      correct: `
def start_station(gas, cost):
    total = tank = start = 0
    for i in range(len(gas)):
        change = gas[i] - cost[i]
        total += change
        tank += change
        if tank < 0:
            start = i + 1
            tank = 0
    return -1 if total < 0 else start
`,
      bugs: {
        8: {
          was: 'start = i + 1',
          buggy: '            start = i',
        },
      },
    },
    c: {
      correct: `
int start_station(int gas[], int cost[], int n) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < n; i++) {
        int change = gas[i] - cost[i];
        total += change;
        tank += change;
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return total < 0 ? -1 : start;
}
`,
      bugs: {
        8: {
          was: 'start = i + 1;',
          buggy: '            start = i;',
        },
      },
    },
  },
});
