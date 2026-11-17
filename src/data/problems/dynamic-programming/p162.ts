import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p162',
  title: 'The staircase count misses the one-step route',
  difficulty: 'Easy',
  topic: 'Dynamic Programming',
  subtopic: 'Staircase Count',
  tags: ['DP', 'Counting', 'Base Case'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Counting ways to climb one or two steps at a time',
  description: 'Return the number of distinct ways to reach step n when each move advances either one or two steps.',
  constraints: ['0 <= n <= 45'],
  examples: [{ input: 'n=4', output: '5' }, { input: 'n=1', output: '1' }],
  hints: ['The final move comes from one of two earlier positions.', 'Small values determine the initial state.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Count all valid sequences of one-step and two-step moves.',
    algorithm: 'Build each count from the two preceding counts.',
    bug: 'The recurrence adds the value from two positions back twice.',
    whyItFails: 'Routes ending with a one-step move are not counted correctly.',
    failingTestCase: 'At n=4 the correct total is 5.',
    fix: 'Add the counts for the immediately preceding two positions.',
    whyFixWorks: 'The two possible final moves partition all valid routes.',
    dryRun: 'Counts begin 1,1,2,3,5.',
    debuggingLesson: 'Derive each recurrence from the distinct choices for the final move.'
  },
  testCases: [{ input: '4', expected: '5' }],
  harness: { expected: '5', driver: { java: 'System.out.print(Solution.ways(4));', python: 'print(ways(4))', c: 'printf("%d",ways(4));' } },
  code: {
    java: { correct: `
class Solution {
    static int ways(int n) {
        if(n<=1)return 1;
        int a=1,b=1;
        for(int i=2;i<=n;i++){int c=a+b;a=b;b=c;}
        return b;
    }
}
`, bugs: { 5: { was: 'for(int i=2;i<=n;i++){int c=a+b;a=b;b=c;}', buggy: 'for(int i=2;i<=n;i++){int c=a+a;a=b;b=c;}' } } },
    python: { correct: `
def ways(n):
    if n <= 1:
        return 1
    a = b = 1
    for _ in range(2, n+1):
        a, b = b, a+b
    return b
`, bugs: { 6: { was: 'a, b = b, a+b', buggy: 'a, b = b, a+a' } } },
    c: { correct: `
int ways(int n) {
    if(n<=1)return 1;
    int a=1,b=1;
    for(int i=2;i<=n;i++){int c=a+b;a=b;b=c;}
    return b;
}
`, bugs: { 4: { was: 'for(int i=2;i<=n;i++){int c=a+b;a=b;b=c;}', buggy: 'for(int i=2;i<=n;i++){int c=a+a;a=b;b=c;}' } } }
  }
});
