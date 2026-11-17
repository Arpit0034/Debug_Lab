import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p193',
  title: 'The cached cost is one too small',
  difficulty: 'Hard',
  topic: 'Dynamic Programming',
  subtopic: 'Memoized Matrix Chain',
  tags: ['Intervals', 'Memoization', 'Cost'],
  bugCategory: 'Incorrect Memoization',
  sourceInspiredBy: 'Matrix chain multiplication interval pattern',
  description:
    'Return the minimum multiplication cost for chaining matrices with given dimensions. Cached interval costs are stored one unit too low.',
  constraints: ['2 <= matrices <= 10', '1 <= dimension <= 100'],
  examples: [
    { input: 'dims = [10,20,30]', output: '6000' },
    { input: 'dims = [2,3,4]', output: '24' },
  ],
  hints: ['When the same interval is requested again, the stored value is returned directly.', 'Check what value is written into the cache.'],
  complexity: { time: 'O(n^3)', space: 'O(n^2)' },
  explanation: {
    overview: 'Find the cheapest order for multiplying a chain of matrices.',
    algorithm: 'Try every split point, combine the costs of the two sides, add the cost of joining them, and cache the best interval cost.',
    bug: 'The best cost is stored in the cache after subtracting one.',
    whyItFails: 'Any later request for that interval receives a value that is too low, and this error propagates to larger intervals.',
    failingTestCase: 'For dimensions [10,20,30], the correct cost is 6000 but the code returns 5999.',
    fix: 'Store the best cost unchanged in the cache.',
    whyFixWorks: 'The cached value must exactly equal the minimum cost computed for that interval.',
    dryRun: 'The only split for two matrices costs 10 * 20 * 30 = 6000. The bug caches 5999 and returns that stored value.',
    debuggingLesson: 'In memoized functions, compare a returned result with the value written to the cache.',
  },
  testCases: [
    { input: '[10,20,30]', expected: '6000', buggyOutput: '5999' },
  ],
  harness: {
    expected: '6000',
    driver: {
      java: `int[][] m = new int[3][3]; for (int i=0;i<3;i++) for(int j=0;j<3;j++) m[i][j]=-1; System.out.println(Solution.chain(new int[]{10,20,30},0,1,m));`,
      python: `memo = [[-1]*3 for _ in range(3)]; print(chain([10,20,30],0,1,memo))`,
      c: `int m[3][3]; for(int i=0;i<3;i++) for(int j=0;j<3;j++) m[i][j]=-1; printf("%d", chain((int[]){10,20,30},0,1,m));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int chain(int[] d, int i, int j, int[][] memo) {
        if (i == j) return 0;
        if (memo[i][j] != -1) return memo[i][j];
        int best = 1000000000;
        for (int k = i; k < j; k++) {
            int v = chain(d, i, k, memo) + chain(d, k + 1, j, memo) + d[i] * d[k + 1] * d[j + 1];
            if (v < best) best = v;
        }
        memo[i][j] = best;
        return memo[i][j];
    }
}
`,
      bugs: { 10: { was: 'memo[i][j] = best;', buggy: 'memo[i][j] = best - 1;' } },
    },
    python: {
      correct: `
def chain(d, i, j, memo):
    if i == j:
        return 0
    if memo[i][j] != -1:
        return memo[i][j]
    best = 10 ** 9
    for k in range(i, j):
        v = chain(d, i, k, memo) + chain(d, k + 1, j, memo) + d[i] * d[k + 1] * d[j + 1]
        if v < best:
            best = v
    memo[i][j] = best
    return memo[i][j]
`,
      bugs: { 11: { was: 'memo[i][j] = best', buggy: 'memo[i][j] = best - 1' } },
    },
    c: {
      correct: `
int chain(int d[], int i, int j, int memo[][3]) {
    if (i == j) return 0;
    if (memo[i][j] != -1) return memo[i][j];
    int best = 1000000000;
    for (int k = i; k < j; k++) {
        int v = chain(d, i, k, memo) + chain(d, k + 1, j, memo) + d[i] * d[k + 1] * d[j + 1];
        if (v < best) best = v;
    }
    memo[i][j] = best;
    return memo[i][j];
}
`,
      bugs: { 9: { was: 'memo[i][j] = best;', buggy: 'memo[i][j] = best - 1;' } },
    },
  },
});
