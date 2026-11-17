import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p163',
  title: 'The non-adjacent total includes neighbouring houses',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  subtopic: 'Maximum Non-adjacent Sum',
  tags: ['DP', 'Array', 'Optimization'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Maximum sum of non-adjacent elements',
  description: 'Return the maximum sum obtainable by selecting array elements such that no two selected positions are adjacent. The empty selection is allowed.',
  constraints: ['1 <= n <= 100000', '-10000 <= a[i] <= 10000'],
  examples: [{ input: '[2,7,9,3,1]', output: '12' }],
  hints: ['At each position, compare taking it with skipping it.', 'Taking the current value excludes the immediately previous position.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Maximize a sum while forbidding adjacent selected indices.',
    algorithm: 'Maintain the best total through the previous position and the position before it.',
    bug: 'The take option adds the current value to the best total through the previous position.',
    whyItFails: 'That prior total may already include the adjacent element.',
    failingTestCase: '[2,7,9,3,1] should select 2,9,1 for total 12.',
    fix: 'Add the current value to the best total from two positions earlier.',
    whyFixWorks: 'The selected positions cannot be adjacent.',
    dryRun: 'At value 9, combine it with 2 rather than 7.',
    debuggingLesson: 'State definitions must identify exactly which positions are allowed.'
  },
  testCases: [{ input: '[2,7,9,3,1]', expected: '12' }],
  harness: { expected: '12', driver: { java: 'System.out.print(Solution.maxNonAdjacent(new int[]{2,7,9,3,1}));', python: 'print(max_non_adjacent([2,7,9,3,1]))', c: 'printf("%d",max_non_adjacent((int[]){2,7,9,3,1},5));' } },
  code: {
    java: { correct: `
class Solution {
    static int maxNonAdjacent(int[] a) {
        int twoBack=0,oneBack=0;
        for(int x:a){
            int take=twoBack+x;
            int cur=Math.max(oneBack,take);
            twoBack=oneBack; oneBack=cur;
        }
        return oneBack;
    }
}
`, bugs: { 5: { was: 'int take=twoBack+x;', buggy: 'int take=oneBack+x;' } } },
    python: { correct: `
def max_non_adjacent(a):
    two_back = one_back = 0
    for x in a:
        take = two_back + x
        cur = max(one_back, take)
        two_back, one_back = one_back, cur
    return one_back
`, bugs: { 4: { was: 'take = two_back + x', buggy: 'take = one_back + x' } } },
    c: { correct: `
int max_non_adjacent(int a[],int n) {
    int two=0,one=0;
    for(int i=0;i<n;i++){
        int take=two+a[i];
        int cur=one>take?one:take;
        two=one;one=cur;
    }
    return one;
}
`, bugs: { 4: { was: 'int take=two+a[i];', buggy: 'int take=one+a[i];' } } }
  }
});
