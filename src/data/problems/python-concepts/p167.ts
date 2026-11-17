import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p167',
  title: 'The default list is shared between calls',
  difficulty: 'Medium',
  topic: 'Python Concepts',
  subtopic: 'Mutable Default Arguments',
  tags: ['Python', 'Mutation', 'Function Defaults'],
  bugCategory: 'Reference and Mutation Error',
  sourceInspiredBy: 'Avoiding shared mutable default arguments',
  description: 'Return a fresh list containing the supplied values, without retaining values from earlier calls.',
  constraints: ['0 <= values.length <= 1000'],
  examples: [{ input: 'call([1]) then call([2])', output: '[1] then [2]' }],
  hints: ['A default object may be created only once.', 'Check whether separate calls share the same container.'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Ensure each function call uses independent list state.',
    algorithm: 'Use a missing-value default and allocate a new list for each call.',
    bug: 'A mutable list is used directly as the default argument.',
    whyItFails: 'Mutations persist between calls because the same object is reused.',
    failingTestCase: 'Calling the function twice can make the second result include the first call values.',
    fix: 'Use None as the default and create a list inside the function.',
    whyFixWorks: 'Each call receives a newly allocated container.',
    dryRun: 'First call returns [1]; second call independently returns [2].',
    debuggingLesson: 'Mutable defaults are shared function state, not per-call initialization.'
  },
  testCases: [{ input: 'two independent calls', expected: '[1]|[2]' }],
  harness: { expected: '[1]|[2]', driver: { java: 'int[] src={1}; int[] c=Solution.copy(src); src[0]=2; System.out.print("["+c[0]+"]|["+src[0]+"]");', python: 'print(str(add_item(1)) + "|" + str(add_item(2)))', c: 'int s[2]={1,2},o[2]; copy_values(s,2,o); printf("[%d]|[%d]",o[0],o[1]);' } },
  code: {
    java: { correct: `
class Solution {
    static int[] copy(int[] values) {
        int[] out=new int[values.length];
        for(int i=0;i<values.length;i++)out[i]=values[i];
        return out;
    }
}
`, bugs: { 3: { was: 'int[] out=new int[values.length];', buggy: 'int[] out=values;' } } },
    python: { correct: `
def add_item(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
`, bugs: { 1: { was: 'def add_item(item, bucket=None):', buggy: 'def add_item(item, bucket=[]):' } } },
    c: { correct: `
void copy_values(int *src,int n,int *out) {
    for(int i=0;i<n;i++)out[i]=src[i];
}
`, bugs: { 2: { was: 'for(int i=0;i<n;i++)out[i]=src[i];', buggy: 'for(int i=0;i<n;i++)out[i]=src[0];' } } }
  }
});
