import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p159',
  title: 'The longest unique segment loses its final character',
  difficulty: 'Medium',
  topic: 'Sliding Window and Two Pointers',
  subtopic: 'Longest Substring Without Repetition',
  tags: ['String', 'Window', 'Last Seen'],
  bugCategory: 'Off-by-one Error',
  sourceInspiredBy: 'Longest substring with no repeated characters',
  description: 'Return the length of the longest substring containing no repeated characters.',
  constraints: ['0 <= s.length <= 100000'],
  examples: [{ input: '"abcabcbb"', output: '3' }, { input: '"bbbbb"', output: '1' }],
  hints: ['The current character may have appeared before the active range.', 'Window length includes both endpoints.'],
  complexity: { time: 'O(n)', space: 'O(k)' },
  explanation: {
    overview: 'Measure the longest contiguous substring with all distinct characters.',
    algorithm: 'Track the most recent position of each character and move the left boundary when needed.',
    bug: 'The computed length subtracts one extra position.',
    whyItFails: 'Every candidate substring is measured one character too short.',
    failingTestCase: '"abc" should have length 3.',
    fix: 'Use right minus left plus one.',
    whyFixWorks: 'Both endpoints are included in the substring.',
    dryRun: 'For "abc", left=0 and right=2, so length is 3.',
    debuggingLesson: 'Inclusive interval lengths require the plus-one term.'
  },
  testCases: [{ input: '"abc"', expected: '3', buggyOutput: '2' }],
  harness: { expected: '3', driver: { java: 'System.out.print(Solution.longestUnique("abc"));', python: 'print(longest_unique("abc"))', c: 'printf("%d",longest_unique("abc"));' } },
  code: {
    java: { correct: `
class Solution {
    static int longestUnique(String s) {
        int[] last=new int[65536]; java.util.Arrays.fill(last,-1);
        int left=0,best=0;
        for(int right=0;right<s.length();right++){
            char ch=s.charAt(right);
            if(last[ch]>=left)left=last[ch]+1;
            last[ch]=right;
            best=Math.max(best,right-left+1);
        }
        return best;
    }
}
`, bugs: { 9: { was: 'best=Math.max(best,right-left+1);', buggy: 'best=Math.max(best,right-left);' } } },
    python: { correct: `
def longest_unique(s):
    last = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right-left+1)
    return best
`, bugs: { 8: { was: 'best = max(best, right-left+1)', buggy: 'best = max(best, right-left)' } } },
    c: { correct: `
int longest_unique(char *s) {
    int last[256],left=0,best=0;
    for(int i=0;i<256;i++)last[i]=-1;
    for(int r=0;s[r];r++){
        unsigned char ch=s[r];
        if(last[ch]>=left)left=last[ch]+1;
        last[ch]=r;
        int len=r-left+1;
        if(len>best)best=len;
    }
    return best;
}
`, bugs: { 8: { was: 'int len=r-left+1;', buggy: 'int len=r-left;' } } }
  }
});
