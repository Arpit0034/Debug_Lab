import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p161',
  title: 'The merged halves lose a repeated boundary value',
  difficulty: 'Medium',
  topic: 'Divide and Conquer',
  subtopic: 'Merge Two Sorted Halves',
  tags: ['Merge', 'Divide and Conquer', 'Duplicates'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Merging two sorted arrays while preserving all values',
  description: 'Merge two sorted integer arrays into one sorted array, preserving duplicates.',
  constraints: ['0 <= n,m <= 100000'],
  examples: [{ input: 'a=[1,2,2], b=[2,3]', output: '[1,2,2,2,3]' }],
  hints: ['When values are equal, both occurrences still belong in the result.', 'Advance only the side whose value was copied.'],
  complexity: { time: 'O(n+m)', space: 'O(n+m)' },
  explanation: {
    overview: 'Combine two sorted sequences into a sorted result.',
    algorithm: 'Compare current values, append the smaller, and append remaining tails.',
    bug: 'When values tie, both pointers are advanced after copying only one value.',
    whyItFails: 'One of the equal values is skipped.',
    failingTestCase: '[1,2,2] and [2,3] must contain three copies of 2.',
    fix: 'Advance only the pointer corresponding to the value appended.',
    whyFixWorks: 'Every input element is copied exactly once.',
    dryRun: 'On equality, copy from the first array; keep the second pointer for the next comparison.',
    debuggingLesson: 'Duplicate preservation depends on pointer movement matching the number of values emitted.'
  },
  testCases: [{ input: '[1,2,2],[2,3]', expected: '1 2 2 2 3' }],
  harness: { expected: '1 2 2 2 3', driver: { java: 'System.out.print(Solution.merge(new int[]{1,2,2},new int[]{2,3}));', python: 'print(" ".join(map(str, merge([1,2,2],[2,3]))))', c: 'int o[8]; int k=merge_arrays((int[]){1,2,2},3,(int[]){2,3},2,o); for(int i=0;i<k;i++) printf(i?\" %d\":\"%d\",o[i]);' } },
  code: {
    java: { correct: `
class Solution {
    static String merge(int[] a,int[] b) {
        int i=0,j=0; StringBuilder s=new StringBuilder();
        while(i<a.length && j<b.length){
            if(a[i]<=b[j])s.append(a[i++]).append(' ');
            else s.append(b[j++]).append(' ');
        }
        while(i<a.length)s.append(a[i++]).append(' ');
        while(j<b.length)s.append(b[j++]).append(' ');
        return s.toString().trim();
    }
}
`, bugs: { 5: { was: "if(a[i]<=b[j])s.append(a[i++]).append(' ');", buggy: "if(a[i]<=b[j]){s.append(a[i]).append(' ');i++;j++;}" } } },
    python: { correct: `
def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out
`, bugs: { 7: { was: 'i += 1', buggy: 'i += 1; j += 1' } } },
    c: { correct: `
int merge_arrays(int a[],int n,int b[],int m,int out[]) {
    int i=0,j=0,k=0;
    while(i<n && j<m){
        if(a[i]<=b[j])out[k++]=a[i++];
        else out[k++]=b[j++];
    }
    while(i<n)out[k++]=a[i++];
    while(j<m)out[k++]=b[j++];
    return k;
}
`, bugs: { 4: { was: 'if(a[i]<=b[j])out[k++]=a[i++];', buggy: 'if(a[i]<=b[j]){out[k++]=a[i++];j++;}' } } }
  }
});
