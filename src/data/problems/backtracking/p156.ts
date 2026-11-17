import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p156',
  title: 'A valid combination keeps its previous choice',
  difficulty: 'Medium',
  topic: 'Backtracking',
  subtopic: 'Combination Sum Without Reuse',
  tags: ['Backtracking', 'Combinations', 'State'],
  bugCategory: 'Missing Backtracking Operation',
  sourceInspiredBy: 'Enumerating unique combinations that reach a target',
  description: 'Return all unique combinations of distinct input values whose sum equals the target. Each value may be used at most once.',
  constraints: ['1 <= n <= 20', 'Input values are positive integers'],
  examples: [{ input: 'a=[1,2,3,4], target=5', output: '[[1,4],[2,3]]' }],
  hints: ['A choice affects the remaining sum.', 'After exploring a branch, restore the state before trying its sibling.'],
  complexity: { time: 'O(2^n * n)', space: 'O(n) excluding output' },
  explanation: {
    overview: 'Enumerate unique subsets whose values sum to the requested total.',
    algorithm: 'Explore include/exclude choices while carrying a current path and remaining target.',
    bug: 'The chosen value is not removed from the path after a recursive branch.',
    whyItFails: 'Values from one branch leak into later combinations.',
    failingTestCase: '[1,2,3,4], target 5 should produce [1,4] and [2,3].',
    fix: 'Remove the most recently appended value after returning from recursion.',
    whyFixWorks: 'Each sibling branch starts with the same parent path.',
    dryRun: 'After testing the branch containing 1, pop it before considering 2.',
    debuggingLesson: 'Mutable path state must be restored exactly when a recursive branch ends.'
  },
  testCases: [{ input: '[1,2,3,4],5', expected: '1,4|2,3' }],
  harness: { expected: '1,4|2,3', driver: { java: 'StringBuilder s=new StringBuilder(); for(List<Integer> c:Solution.combinations(new int[]{1,2,3,4},5)){ if(s.length()>0)s.append(\'|\'); for(int i=0;i<c.size();i++){ if(i>0)s.append(\',\'); s.append(c.get(i)); } } System.out.print(s);', python: 'print("|".join(",".join(map(str,c)) for c in combinations([1,2,3,4],5)))', c: 'char out[256]; combinations((int[]){1,2,3,4},4,5,out); printf(\"%s\",out);' } },
  code: {
    java: { correct: `
import java.util.*;
class Solution {
    static List<List<Integer>> combinations(int[] a,int target) {
        Arrays.sort(a); List<List<Integer>> out=new ArrayList<>();
        build(a,0,target,new ArrayList<>(),out); return out;
    }
    static void build(int[] a,int i,int rem,List<Integer> path,List<List<Integer>> out) {
        if(rem==0){out.add(new ArrayList<>(path));return;}
        for(int j=i;j<a.length;j++){
            if(j>i && a[j]==a[j-1])continue;
            if(a[j]>rem)break;
            path.add(a[j]); build(a,j+1,rem-a[j],path,out); path.remove(path.size()-1);
        }
    }
}
`, bugs: { 12: { was: 'path.remove(path.size()-1);', buggy: 'path.add(a[j]); build(a,j+1,rem-a[j],path,out); path.clear();' } } },
    python: { correct: `
def combinations(a, target):
    a = sorted(a)
    out = []
    def build(i, rem, path):
        if rem == 0:
            out.append(path[:])
            return
        for j in range(i, len(a)):
            if j > i and a[j] == a[j-1]:
                continue
            if a[j] > rem:
                break
            path.append(a[j])
            build(j+1, rem-a[j], path)
            path.pop()
    build(0, target, [])
    return out
`, bugs: { 15: { was: 'path.pop()', buggy: 'path.clear()' } } },
    c: { correct: `
#include <string.h>
static void build(int a[],int n,int i,int rem,int path[],int len,char *out) {
    if(rem==0){
        if(out[0])strcat(out,"|");
        for(int k=0;k<len;k++){char t[16];sprintf(t,k?",%d":"%d",path[k]);strcat(out,t);}
        return;
    }
    for(int j=i;j<n;j++){
        if(j>i && a[j]==a[j-1])continue;
        if(a[j]>rem)break;
        path[len++]=a[j];
        build(a,n,j+1,rem-a[j],path,len,out);
        len--;
    }
}
void combinations(int a[],int n,int target,char *out) {
    int path[32];
    out[0]='\\0';
    build(a,n,0,target,path,0,out);
}
`, bugs: { 13: { was: 'len--;', buggy: 'len += 0;' } } }
  }
});
