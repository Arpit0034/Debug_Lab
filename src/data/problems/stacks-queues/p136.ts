import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p136',
  title: 'Faster cars behind overtake prematurely',
  difficulty: 'Hard',
  topic: 'Stacks and Queues',
  subtopic: 'Travel Merging',
  tags: ['Monotonic Times', 'Ordered Processing'],
  bugCategory: 'Incorrect Comparator Logic',
  sourceInspiredBy: 'Car fleet arrival pattern',
  description:
    'A collection of vehicles travels along a single-lane road toward a target destination. Each vehicle has a starting position and constant speed. Vehicles cannot overtake; if a faster vehicle catches a slower group ahead, it joins that group and matches its speed. Return the number of distinct groups that reach the destination. The solution sorts vehicles in ascending rather than descending order of position.',
  constraints: ['1 <= n <= 100', '1 <= target <= 100000', '0 <= pos[i] < target'],
  examples: [
    { input: 'target = 10, pos = [0, 4, 2], speed = [2, 1, 3]', output: '1', note: 'All cars catch up to the vehicle starting at position 4 and form 1 fleet.' },
    { input: 'target = 10, pos = [3], speed = [3]', output: '1' },
  ],
  hints: [
    'Consider which vehicle on the road must be examined first to decide whether trailing vehicles catch up.',
    'Check the comparator order used when sorting initial positions.',
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Calculate the number of merged groups reaching a target point.',
    algorithm:
      'Sort vehicles in descending order of starting position. The vehicle closest to the target leads. If a trailing vehicle has arrival time <= lead vehicle time, it merges into the fleet; otherwise, it becomes a new fleet leader.',
    bug: 'Vehicles are sorted in ascending order of position instead of descending order.',
    whyItFails:
      'Sorting ascending processes vehicles farthest from the destination first, incorrectly treating trailing vehicles as fleet leaders instead of followers.',
    failingTestCase: 'target = 10, pos = [0, 4, 2], speed = [2, 1, 3]: returns 2 instead of 1 because processing position 0 first makes it a leader, so the slower car ahead starts a second fleet.',
    fix: 'Sort by position in descending order (b[0] - a[0] or reverse=True).',
    whyFixWorks: 'Examining the vehicle closest to the goal first establishes the arrival benchmark for all trailing vehicles.',
    dryRun:
      'target = 10. Positions [4, 2, 0] with speeds [1, 3, 2]. Car 4 time = 6 (fleet 1). Car 2 time = (10-2)/3 = 2.67 <= 6 -> catches up. Car 0 time = (10-0)/2 = 5 <= 6 -> catches up. Total fleets = 1.',
    debuggingLesson:
      'In single-lane physical simulations with no overtaking, always process objects from the destination backwards.',
  },
  testCases: [
    { input: 'target = 10, pos = [0, 4, 2], speed = [2, 1, 3]', expected: '1', buggyOutput: '2' },
    { input: 'target = 10, pos = [3], speed = [3]', expected: '1' },
  ],
  harness: {
    expected: '1 1',
    driver: {
      java: `System.out.println(Solution.carFleet(10, new int[]{0, 4, 2}, new int[]{2, 1, 3}, 3) + " " + Solution.carFleet(10, new int[]{3}, new int[]{3}, 1));`,
      python: `print(car_fleet(10, [0, 4, 2], [2, 1, 3], 3), car_fleet(10, [3], [3], 1))`,
      c: `printf("%d %d", car_fleet(10, (int[]){0, 4, 2}, (int[]){2, 1, 3}, 3), car_fleet(10, (int[]){3}, (int[]){3}, 1));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int carFleet(int target, int[] pos, int[] speed, int n) {
        int[][] cars = new int[n][2];
        for (int i = 0; i < n; i++) {
            cars[i][0] = pos[i];
            cars[i][1] = speed[i];
        }
        Arrays.sort(cars, (a, b) -> b[0] - a[0]);
        int fleets = 0;
        double leaderTime = 0.0;
        for (int i = 0; i < n; i++) {
            double time = (double)(target - cars[i][0]) / cars[i][1];
            if (time > leaderTime) {
                fleets++;
                leaderTime = time;
            }
        }
        return fleets;
    }
}`,
      bugs: { 10: { was: 'b[0] - a[0]', buggy: '        Arrays.sort(cars, (a, b) -> a[0] - b[0]);' } },
    },
    python: {
      correct: `def car_fleet(target, pos, speed, n):
    cars = sorted(zip(pos, speed), key=lambda x: x[0], reverse=True)
    fleets = 0
    leader_time = 0.0
    for p, s in cars:
        time = (target - p) / s
        if time > leader_time:
            fleets += 1
            leader_time = time
    return fleets`,
      bugs: { 2: { was: 'reverse=True', buggy: '    cars = sorted(zip(pos, speed), key=lambda x: x[0], reverse=False)' } },
    },
    c: {
      correct: `#include <stdlib.h>

typedef struct {
    int pos;
    int speed;
} Car;

int cmp_cars(const void* a, const void* b) {
    Car* c1 = (Car*)a;
    Car* c2 = (Car*)b;
    return c2->pos - c1->pos;
}

int car_fleet(int target, int pos[], int speed[], int n) {
    Car cars[100];
    for (int i = 0; i < n; i++) {
        cars[i].pos = pos[i];
        cars[i].speed = speed[i];
    }
    qsort(cars, n, sizeof(Car), cmp_cars);
    int fleets = 0;
    double leader_time = 0.0;
    for (int i = 0; i < n; i++) {
        double time = (double)(target - cars[i].pos) / cars[i].speed;
        if (time > leader_time) {
            fleets++;
            leader_time = time;
        }
    }
    return fleets;
}`,
      bugs: { 11: { was: 'c2->pos - c1->pos', buggy: '    return c1->pos - c2->pos;' } },
    },
  },
});
