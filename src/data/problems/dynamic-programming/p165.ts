import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p165',
  title: 'The edit count forgets replacement',
  difficulty: 'Hard',
  topic: 'Dynamic Programming',
  subtopic: 'Edit Distance',
  tags: ['DP', 'Strings', 'Edit Operations'],
  bugCategory: 'Incorrect DP Transition',
  sourceInspiredBy: 'Minimum insertions, deletions, and replacements to transform one string into another',
  description: 'Return the minimum number of single-character insertions, deletions, and replacements required to transform one string into another.',
  constraints: ['0 <= source.length,target.length <= 500'],
  examples: [{ input: 'source="kitten", target="sitting"', output: '3' }],
  hints: ['Compare the final characters of the two prefixes.', 'When they differ, consider the three allowed edit operations.'],
  complexity: { time: 'O(m*n)', space: 'O(m*n)' },
  explanation: {
    overview: 'Measure the minimum edits needed to transform one string into another.',
    algorithm: 'Fill a matrix for all prefix pairs using insertion, deletion, and replacement choices.',
    bug: 'The replacement choice is omitted from the minimum.',
    whyItFails: 'A character mismatch may be handled by a more expensive path than necessary.',
    failingTestCase: '"cat" to "cut" requires one replacement.',
    fix: 'Include the diagonal predecessor plus one as a candidate.',
    whyFixWorks: 'The diagonal represents replacing the final character.',
    dryRun: 'For "cat" and "cut", the differing middle characters use one replacement.',
    debuggingLesson: 'A recurrence must include every operation permitted by the problem.'
  },
  testCases: [{ input: '"cat","cut"', expected: '1' }],
  harness: { expected: '1', driver: { java: 'System.out.print(Solution.editDistance("cat","cut"));', python: 'print(edit_distance("cat","cut"))', c: 'printf("%d",edit_distance("cat","cut"));' } },
  code: {
    java: { correct: `
class Solution {
    static int editDistance(String a,String b) {
        int[][] d=new int[a.length()+1][b.length()+1];
        for(int i=0;i<=a.length();i++)d[i][0]=i;
        for(int j=0;j<=b.length();j++)d[0][j]=j;
        for(int i=1;i<=a.length();i++)for(int j=1;j<=b.length();j++){
            if(a.charAt(i-1)==b.charAt(j-1))d[i][j]=d[i-1][j-1];
            else d[i][j]=1+Math.min(d[i-1][j-1],Math.min(d[i-1][j],d[i][j-1]));
        }
        return d[a.length()][b.length()];
    }
}
`, bugs: { 8: { was: 'else d[i][j]=1+Math.min(d[i-1][j-1],Math.min(d[i-1][j],d[i][j-1]));', buggy: 'else d[i][j]=1+Math.min(d[i-1][j],d[i][j-1]);' } } },
    python: { correct: `
def edit_distance(a, b):
    d = [[0]*(len(b)+1) for _ in range(len(a)+1)]
    for i in range(len(a)+1): d[i][0] = i
    for j in range(len(b)+1): d[0][j] = j
    for i in range(1, len(a)+1):
        for j in range(1, len(b)+1):
            if a[i-1] == b[j-1]:
                d[i][j] = d[i-1][j-1]
            else:
                d[i][j] = 1 + min(d[i-1][j-1], d[i-1][j], d[i][j-1])
    return d[-1][-1]
`, bugs: { 10: { was: 'd[i][j] = 1 + min(d[i-1][j-1], d[i-1][j], d[i][j-1])', buggy: 'd[i][j] = 1 + min(d[i-1][j], d[i][j-1])' } } },
    c: { correct: `
#include <string.h>
int edit_distance(char *a,char *b) {
    int m=strlen(a),n=strlen(b),d[501][501];
    for(int i=0;i<=m;i++)d[i][0]=i;
    for(int j=0;j<=n;j++)d[0][j]=j;
    for(int i=1;i<=m;i++)for(int j=1;j<=n;j++){
        if(a[i-1]==b[j-1])d[i][j]=d[i-1][j-1];
        else {
            int x=d[i-1][j-1],y=d[i-1][j],z=d[i][j-1];
            int best=x<y?x:y;if(z<best)best=z;d[i][j]=best+1;
        }
    }
    return d[m][n];
}
`, bugs: { 9: { was: 'int x=d[i-1][j-1],y=d[i-1][j],z=d[i][j-1];', buggy: 'int x=999,y=d[i-1][j],z=d[i][j-1];' } } }
  }
});
