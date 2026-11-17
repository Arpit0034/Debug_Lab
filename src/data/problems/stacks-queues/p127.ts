import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p127',
  title: 'Mutual annihilation leaves a survivor',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Collision Simulation',
  tags: ['Simulation', 'Collision Resolution'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Asteroid collision pattern',
  description:
    'A row of particles moves with velocities where positive values move right and negative values move left. Magnitude represents mass. When oppositely moving particles collide, the smaller one explodes; if their masses are identical, both explode. Return the sum of all remaining particle velocities. The implementation lets an incoming particle survive an equal collision.',
  constraints: ['1 <= n <= 1000', '-1000 <= a[i] <= 1000', 'a[i] != 0'],
  examples: [
    { input: 'a = [5, 10, -5]', output: '15', note: '10 and -5 collide; -5 explodes. 5 and 10 survive.' },
    { input: 'a = [8, -8]', output: '0', note: 'Both explode.' },
  ],
  hints: [
    'Notice how the status of the current incoming particle is updated when it meets a particle of equal size moving in the opposite direction.',
    'Check whether both colliding particles are destroyed when their sizes match.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Simulate particle collisions where opposing particles resolve by mass comparison.',
    algorithm:
      'Track rightward-moving particles. When a leftward particle arrives, resolve collisions against rightward particles until either particle explodes or all opposing particles are destroyed.',
    bug: 'In the branch handling identical masses (st[top] == -x), alive is left as true instead of being set to false, allowing the incoming particle to survive.',
    whyItFails:
      'When two particles of equal mass collide head-on, both must be destroyed. Keeping alive = true retains the leftward particle, incorrectly persisting it.',
    failingTestCase: 'a = [8, -8]: returns -8 instead of 0 because -8 survives the collision with 8.',
    fix: 'Set alive = false when st[top] == -x.',
    whyFixWorks: 'Popping the existing particle and marking the incoming particle as dead annihilates both particles simultaneously.',
    dryRun:
      'a = [8, -8]. 8 is pushed. -8 arrives: st top is 8, -x is 8. Equal mass pops 8 and sets alive=false. -8 is not pushed. Final sum = 0.',
    debuggingLesson:
      'When symmetric rules specify mutual destruction, ensure state changes apply to both the stored entity and the visiting entity.',
  },
  testCases: [
    { input: '[8, -8]', expected: '0', buggyOutput: '-8' },
    { input: '[5, 10, -5]', expected: '15' },
  ],
  harness: {
    expected: '0 15',
    driver: {
      java: `System.out.println(Solution.asteroidSum(new int[]{8, -8}) + " " + Solution.asteroidSum(new int[]{5, 10, -5}));`,
      python: `print(asteroid_sum([8, -8]), asteroid_sum([5, 10, -5]))`,
      c: `printf("%d %d", asteroid_sum((int[]){8, -8}, 2), asteroid_sum((int[]){5, 10, -5}, 3));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int asteroidSum(int[] a) {
        int n = a.length;
        int[] st = new int[n];
        int top = -1;
        for (int i = 0; i < n; i++) {
            int x = a[i];
            boolean alive = true;
            while (alive && x < 0 && top >= 0 && st[top] > 0) {
                if (st[top] < -x) {
                    top--;
                } else if (st[top] == -x) {
                    top--;
                    alive = false;
                } else {
                    alive = false;
                }
            }
            if (alive) {
                st[++top] = x;
            }
        }
        int total = 0;
        for (int i = 0; i <= top; i++) {
            total += st[i];
        }
        return total;
    }
}`,
      bugs: { 14: { was: 'alive = false;', buggy: '                    alive = true;' } },
    },
    python: {
      correct: `def asteroid_sum(a):
    st = []
    for x in a:
        alive = True
        while alive and x < 0 and st and st[-1] > 0:
            if st[-1] < -x:
                st.pop()
            elif st[-1] == -x:
                st.pop()
                alive = False
            else:
                alive = False
        if alive:
            st.append(x)
    return sum(st)`,
      bugs: { 10: { was: 'alive = False', buggy: '                alive = True' } },
    },
    c: {
      correct: `int asteroid_sum(int a[], int n) {
    int st[100];
    int top = -1;
    for (int i = 0; i < n; i++) {
        int x = a[i];
        int alive = 1;
        while (alive && x < 0 && top >= 0 && st[top] > 0) {
            if (st[top] < -x) {
                top--;
            } else if (st[top] == -x) {
                top--;
                alive = 0;
            } else {
                alive = 0;
            }
        }
        if (alive) {
            st[++top] = x;
        }
    }
    int total = 0;
    for (int i = 0; i <= top; i++) {
        total += st[i];
    }
    return total;
}`,
      bugs: { 12: { was: 'alive = 0;', buggy: '                alive = 1;' } },
    },
  },
});
