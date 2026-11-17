import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p160',
  title: 'The range sum includes one extra element',
  difficulty: 'Easy',
  topic: 'Prefix Sum and Kadane',
  subtopic: 'Range Sum Queries',
  tags: ['Prefix Sum', 'Array', 'Indexing'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Answering inclusive range-sum queries',
  description: 'Build a prefix-sum array and return the sum of values from index left through right, inclusive.',
  constraints: ['1 <= n <= 100000', '0 <= left <= right < n'],
  examples: [{ input: 'a=[2,4,1,7], left=1, right=2', output: '5' }],
  hints: ['A prefix ending before the range should be subtracted.', 'The requested right endpoint is included.'],
  complexity: { time: 'O(n) preprocessing, O(1) per query', space: 'O(n)' },
  explanation: {
    overview: 'Answer a sum query over an inclusive interval.',
    algorithm: 'Use cumulative totals so an interval is the difference of two prefixes.',
    bug: 'The prefix ending at right is indexed one position too far.',
    whyItFails: 'The value immediately after the requested range is included.',
    failingTestCase: '[2,4,1,7], indices 1..2 should sum to 5.',
    fix: 'Use the prefix at right plus one, with the exclusive-prefix convention.',
    whyFixWorks: 'Subtracting the prefix before left leaves exactly the requested interval.',
    dryRun: 'Prefix through index 2 is 7; prefix before index 1 is 2; difference is 5.',
    debuggingLesson: 'Choose either inclusive or exclusive prefix conventions and apply them consistently.'
  },
  testCases: [{ input: '[2,4,1,7],1,2', expected: '5' }],
  harness: { expected: '5', driver: { java: 'System.out.print(Solution.rangeSum(new int[]{2,4,1,7},1,2));', python: 'print(range_sum([2,4,1,7],1,2))', c: 'printf("%d",range_sum((int[]){2,4,1,7},4,1,2));' } },
  code: {
    java: { correct: `
class Solution {
    static int rangeSum(int[] a,int l,int r) {
        int[] p=new int[a.length+1];
        for(int i=0;i<a.length;i++)p[i+1]=p[i]+a[i];
        return p[r+1]-p[l];
    }
}
`, bugs: { 5: { was: 'return p[r+1]-p[l];', buggy: 'return p[r+2]-p[l];' } } },
    python: { correct: `
def range_sum(a, l, r):
    p = [0]
    for x in a:
        p.append(p[-1] + x)
    return p[r+1] - p[l]
`, bugs: { 5: { was: 'return p[r+1] - p[l]', buggy: 'return p[r+2] - p[l]' } } },
    c: { correct: `
int range_sum(int a[],int n,int l,int r) {
    int p[100001]={0};
    for(int i=0;i<n;i++)p[i+1]=p[i]+a[i];
    return p[r+1]-p[l];
}
`, bugs: { 4: { was: 'return p[r+1]-p[l];', buggy: 'return p[r+2]-p[l];' } } }
  }
});
