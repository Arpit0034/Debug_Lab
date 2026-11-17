import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p157',
  title: 'The word search accepts a reused cell',
  difficulty: 'Hard',
  topic: 'Backtracking',
  subtopic: 'Grid Word Search',
  tags: ['Grid', 'Path', 'Visited State'],
  bugCategory: 'Missing Backtracking Operation',
  sourceInspiredBy: 'Checking whether a word can be formed by adjacent grid cells',
  description: 'Return true if the given word can be formed by horizontally or vertically adjacent cells without using a cell more than once in one path.',
  constraints: ['1 <= rows, cols <= 12', '1 <= word.length <= 15'],
  examples: [{ input: 'board=[[A,B],[C,D]], word="ABD"', output: 'true' }, { input: 'board=[[A,B],[C,D]], word="ABCA"', output: 'false' }],
  hints: ['A cell can be unavailable while one path is active.', 'That temporary state must not remain after a branch returns.'],
  complexity: { time: 'O(R*C*4^L)', space: 'O(L)' },
  explanation: {
    overview: 'Determine whether a path spells the requested word without revisiting a cell.',
    algorithm: 'Try each matching start cell and recursively extend to an unused orthogonal neighbour.',
    bug: 'The current cell is not restored after the recursive search.',
    whyItFails: 'A failed branch leaves a cell unavailable to later valid paths.',
    failingTestCase: 'A word whose valid path begins at a later matching cell can be rejected.',
    fix: 'Restore the original cell value before returning from the search.',
    whyFixWorks: 'Each independent starting position sees the original board.',
    dryRun: 'A failed path marks cells temporarily; after it returns, those cells become available again.',
    debuggingLesson: 'Grid mutation during search must be paired with restoration.'
  },
  testCases: [{ input: 'board=[["A","B","B"]],word="BBA"', expected: 'true' }],
  harness: { expected: 'true', driver: { java: 'System.out.print(Solution.exists(new char[][]{{\'A\',\'B\',\'B\'}}, "BBA"));', python: 'print(str(exists([["A","B","B"]],"BBA")).lower())', c: 'char b[1][3]={{\'A\',\'B\',\'B\'}}; printf(\"%s\",exists(b,1,3,\"BBA\")?\"true\":\"false\");' } },
  code: {
    java: { correct: `
class Solution {
    static boolean exists(char[][] b,String w) {
        for(int r=0;r<b.length;r++) for(int c=0;c<b[0].length;c++)
            if(dfs(b,w,r,c,0)) return true;
        return false;
    }
    static boolean dfs(char[][] b,String w,int r,int c,int k) {
        if(k==w.length()) return true;
        if(r<0||c<0||r==b.length||c==b[0].length||b[r][c]!=w.charAt(k)) return false;
        char old=b[r][c]; b[r][c]='#';
        boolean ok=dfs(b,w,r+1,c,k+1)||dfs(b,w,r-1,c,k+1)||dfs(b,w,r,c+1,k+1)||dfs(b,w,r,c-1,k+1);
        b[r][c]=old;
        return ok;
    }
}
`, bugs: { 12: { was: 'b[r][c]=old;', buggy: 'b[r][c]=\'#\';' } } },
    python: { correct: `
def exists(board, word):
    def dfs(r, c, k):
        if k == len(word):
            return True
        if r < 0 or c < 0 or r == len(board) or c == len(board[0]) or board[r][c] != word[k]:
            return False
        old = board[r][c]
        board[r][c] = '#'
        ok = dfs(r+1,c,k+1) or dfs(r-1,c,k+1) or dfs(r,c+1,k+1) or dfs(r,c-1,k+1)
        board[r][c] = old
        return ok
    return any(dfs(r,c,0) for r in range(len(board)) for c in range(len(board[0])))
`, bugs: { 10: { was: "board[r][c] = old", buggy: "board[r][c] = '#'" } } },
    c: { correct: `
#include <string.h>
static int dfs(char b[][3],int rows,int cols,const char *w,int r,int c,int k) {
    if(w[k]=='\\0') return 1;
    if(r<0||c<0||r==rows||c==cols||b[r][c]!=w[k]) return 0;
    char old=b[r][c]; b[r][c]='#';
    int ok=dfs(b,rows,cols,w,r+1,c,k+1)||dfs(b,rows,cols,w,r-1,c,k+1)||dfs(b,rows,cols,w,r,c+1,k+1)||dfs(b,rows,cols,w,r,c-1,k+1);
    b[r][c]=old;
    return ok;
}
int exists(char b[][3],int rows,int cols,const char *w) {
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++)
        if(dfs(b,rows,cols,w,r,c,0)) return 1;
    return 0;
}
`, bugs: { 7: { was: 'b[r][c]=old;', buggy: "b[r][c]='#';" } } }
  }
});
