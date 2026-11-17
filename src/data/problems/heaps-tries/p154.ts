import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p154',
  title: 'The kth largest value is taken from the wrong end',
  difficulty: 'Medium',
  topic: 'Heaps and Tries',
  subtopic: 'Kth Largest Element',
  tags: ['Heap', 'Selection', 'Array'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Selecting the kth largest value',
  description: 'Return the kth largest value in an integer array. Values may repeat.',
  constraints: ['1 <= k <= n <= 100000'],
  examples: [{ input: 'a=[3,2,1,5,6,4], k=2', output: '5' }],
  hints: ['The rank is counted from the largest value.', 'Check the order in which the retained candidates are removed.'],
  complexity: { time: 'O(n log k)', space: 'O(k)' },
  explanation: {
    overview: 'Select the value occupying rank k when values are ordered from largest to smallest.',
    algorithm: 'Maintain only k candidates and ensure the smallest retained candidate is the answer.',
    bug: 'The result is taken from the opposite end of the retained ordering.',
    whyItFails: 'The smallest overall retained item is not used as the rank boundary.',
    failingTestCase: 'For [3,2,1,5,6,4], k=2, the answer is 5.',
    fix: 'Return the smallest element among the k retained largest values.',
    whyFixWorks: 'Exactly the k largest values remain, and their minimum is the kth largest.',
    dryRun: 'The retained values are 5 and 6; their minimum is 5.',
    debuggingLesson: 'When maintaining a bounded set, verify which end represents the rank boundary.'
  },
  testCases: [{ input: '[3,2,1,5,6,4],2', expected: '5' }],
  harness: { expected: '5', driver: { java: 'System.out.print(Solution.kthLargest(new int[]{3,2,1,5,6,4},2));', python: 'print(kth_largest([3,2,1,5,6,4],2))', c: 'printf("%d",kth_largest((int[]){3,2,1,5,6,4},6,2));' } },
  code: {
    java: { correct: `
import java.util.*;
class Solution {
    static int kthLargest(int[] a, int k) {
        PriorityQueue<Integer> q = new PriorityQueue<>();
        for (int x : a) {
            q.add(x);
            if (q.size() > k) q.poll();
        }
        return q.peek();
    }
}
`, bugs: { 9: { was: 'return q.peek();', buggy: 'return Arrays.stream(a).min().getAsInt();' } } },
    python: { correct: `
import heapq
def kth_largest(a, k):
    h = []
    for x in a:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h[0]
`, bugs: { 8: { was: 'return h[0]', buggy: 'return min(a)' } } },
    c: { correct: `
void sift_down(int h[], int n, int i) {
    int s=i, l=2*i+1, r=2*i+2;
    if(l<n && h[l]<h[s]) s=l;
    if(r<n && h[r]<h[s]) s=r;
    if(s!=i){int t=h[i];h[i]=h[s];h[s]=t;sift_down(h,n,s);}
}
int kth_largest(int a[], int n, int k) {
    int h[100000], m=0;
    for(int i=0;i<n;i++){
        h[m++]=a[i];
        for(int j=m/2-1;j>=0;j--) sift_down(h,m,j);
        if(m>k){h[0]=h[--m];sift_down(h,m,0);}
    }
    return h[0];
}
`, bugs: { 14: { was: 'return h[0];', buggy: 'return h[m-1];' } } }
  }
});
