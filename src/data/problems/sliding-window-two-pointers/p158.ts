import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p158',
  title: 'The shortest qualifying range is not updated',
  difficulty: 'Medium',
  topic: 'Sliding Window and Two Pointers',
  subtopic: 'Minimum Length Subarray',
  tags: ['Two Pointers', 'Window', 'Positive Integers'],
  bugCategory: 'Incorrect Sliding Window Update',
  sourceInspiredBy: 'Minimum length contiguous subarray with sum at least a target',
  description: 'Return the minimum length of a contiguous subarray whose sum is at least target, or zero if none exists. All values are positive.',
  constraints: ['1 <= n <= 100000', '1 <= values[i] <= 10000'],
  examples: [{ input: 'target=7, a=[2,3,1,2,4,3]', output: '2' }],
  hints: ['Positive values make shrinking the left side predictable.', 'Record a qualifying window before removing its leftmost value.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the shortest contiguous interval meeting a minimum sum.',
    algorithm: 'Expand the right edge and shrink the left edge while the sum remains sufficient.',
    bug: 'The best length is recorded after shrinking instead of before.',
    whyItFails: 'The qualifying window may cease to qualify before its length is saved.',
    failingTestCase: 'For target 7, [4,3] has length 2.',
    fix: 'Update the answer while the current sum is still at least target.',
    whyFixWorks: 'Every qualifying window is measured before it is shortened.',
    dryRun: 'When the window [4,3] sums to 7, record 2 before removing 4.',
    debuggingLesson: 'Capture a valid state before mutating it into an invalid state.'
  },
  testCases: [{ input: '7,[2,3,1,2,4,3]', expected: '2' }],
  harness: { expected: '2', driver: { java: 'System.out.print(Solution.minLength(7,new int[]{2,3,1,2,4,3}));', python: 'print(min_length(7,[2,3,1,2,4,3]))', c: 'printf("%d",min_length(7,(int[]){2,3,1,2,4,3},6));' } },
  code: {
    java: { correct: `
class Solution {
    static int minLength(int target,int[] a) {
        int left=0,sum=0,best=a.length+1;
        for(int right=0;right<a.length;right++){
            sum+=a[right];
            while(sum>=target){
                best=Math.min(best,right-left+1);
                sum-=a[left++];
            }
        }
        return best==a.length+1?0:best;
    }
}
`, bugs: { 7: { was: 'best=Math.min(best,right-left+1);', buggy: 'sum-=a[left++];' } } },
    python: { correct: `
def min_length(target, a):
    left = total = 0
    best = len(a) + 1
    for right, value in enumerate(a):
        total += value
        while total >= target:
            best = min(best, right-left+1)
            total -= a[left]
            left += 1
    return 0 if best == len(a)+1 else best
`, bugs: { 7: { was: 'best = min(best, right-left+1)', buggy: 'left += 1' } } },
    c: { correct: `
int min_length(int target,int a[],int n) {
    int left=0,sum=0,best=n+1;
    for(int right=0;right<n;right++){
        sum+=a[right];
        while(sum>=target){
            int len=right-left+1;
            if(len<best)best=len;
            sum-=a[left++];
        }
    }
    return best==n+1?0:best;
}
`, bugs: { 7: { was: 'if(len<best)best=len;', buggy: 'sum-=a[left++];' } } }
  }
});
