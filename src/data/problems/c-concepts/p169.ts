import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p169',
  title: 'The copied buffer omits its final byte',
  difficulty: 'Medium',
  topic: 'C Concepts',
  subtopic: 'Array Copy Boundaries',
  tags: ['C', 'Arrays', 'Memory'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Copying a fixed-length integer array',
  description: 'Copy all n integers from a source array into a destination array and return the sum of the copied values.',
  constraints: ['1 <= n <= 10000'],
  examples: [{ input: 'source=[4,1,7], n=3', output: '12' }],
  hints: ['Array indices begin at zero.', 'The number of elements and the final index are not the same.'],
  complexity: { time: 'O(n)', space: 'O(n) output' },
  explanation: {
    overview: 'Copy every element and calculate the copied total.',
    algorithm: 'Traverse all valid indices, copy each value, and add it to the sum.',
    bug: 'The loop condition excludes index n-1.',
    whyItFails: 'The final element is neither copied nor included in the sum.',
    failingTestCase: '[4,1,7] produces 5 instead of 12.',
    fix: 'Use i < n as the loop condition.',
    whyFixWorks: 'Indices zero through n-1 are processed exactly once.',
    dryRun: 'The loop copies 4, 1, and 7, producing 12.',
    debuggingLesson: 'For n elements, the valid half-open index range is [0,n).'
  },
  testCases: [{ input: '[4,1,7],3', expected: '12' }],
  harness: { expected: '12', driver: { java: 'System.out.print(Solution.copySum(new int[]{4,1,7}));', python: 'print(copy_sum([4,1,7]))', c: 'int dst[3];printf("%d",copy_sum((int[]){4,1,7},dst,3));' } },
  code: {
    java: { correct: `
class Solution {
    static int copySum(int[] src) {
        int[] dst=new int[src.length]; int sum=0;
        for(int i=0;i<src.length;i++){dst[i]=src[i];sum+=dst[i];}
        return sum;
    }
}
`, bugs: { 4: { was: 'for(int i=0;i<src.length;i++){dst[i]=src[i];sum+=dst[i];}', buggy: 'for(int i=0;i<src.length-1;i++){dst[i]=src[i];sum+=dst[i];}' } } },
    python: { correct: `
def copy_sum(src):
    dst = [0] * len(src)
    total = 0
    for i in range(len(src)):
        dst[i] = src[i]
        total += dst[i]
    return total
`, bugs: { 4: { was: 'for i in range(len(src)):', buggy: 'for i in range(len(src)-1):' } } },
    c: { correct: `
int copy_sum(int src[],int dst[],int n) {
    int sum=0;
    for(int i=0;i<n;i++){dst[i]=src[i];sum+=dst[i];}
    return sum;
}
`, bugs: { 3: { was: 'for(int i=0;i<n;i++){dst[i]=src[i];sum+=dst[i];}', buggy: 'for(int i=0;i<n-1;i++){dst[i]=src[i];sum+=dst[i];}' } } }
  }
});
