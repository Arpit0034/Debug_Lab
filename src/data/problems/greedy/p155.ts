import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p155',
  title: 'The minimum refuel count is overstated',
  difficulty: 'Hard',
  topic: 'Greedy',
  subtopic: 'Minimum Refueling Stops',
  tags: ['Greedy', 'Priority Queue', 'Reachability'],
  bugCategory: 'Incorrect Greedy Decision',
  sourceInspiredBy: 'Minimum number of refueling stops to reach a destination',
  description: 'Given a destination, initial fuel, and stations represented by position and fuel amount, return the minimum number of stops needed to reach the destination, or -1.',
  constraints: ['1 <= target <= 1000000', '0 <= startFuel <= target', 'Stations are sorted by position'],
  examples: [{ input: 'target=100, fuel=10, stations=[[10,60],[20,30],[30,30],[60,40]]', output: '2' }],
  hints: ['A station can only help after it has been reached.', 'Among previously passed options, a larger supply can be more useful.'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Minimize the number of stops while preserving enough fuel to reach the destination.',
    algorithm: 'When current fuel is insufficient, choose the largest fuel amount among stations already passed.',
    bug: 'The selection removes the smallest available fuel amount.',
    whyItFails: 'A weaker refill is chosen even when a stronger passed station is available.',
    failingTestCase: 'The sample requires choosing 60 and then 40, for two stops.',
    fix: 'Select the maximum previously available fuel amount.',
    whyFixWorks: 'Each required stop contributes the greatest possible extension to reach.',
    dryRun: 'At position 10 the 60 supply becomes available; it is used when fuel runs short, followed by 40.',
    debuggingLesson: 'A greedy choice must optimize the resource that directly extends feasibility.'
  },
  testCases: [{ input: '100,10,[[10,60],[20,30],[30,30],[60,40]]', expected: '2' }],
  harness: { expected: '2', driver: { java: 'System.out.print(Solution.minStops(100,10,new int[][]{{10,60},{20,30},{30,30},{60,40}}));', python: 'print(min_stops(100,10,[[10,60],[20,30],[30,30],[60,40]]))', c: 'int st[][2]={{10,60},{20,30},{30,30},{60,40}};printf("%d",min_stops(100,10,st,4));' } },
  code: {
    java: { correct: `
import java.util.*;
class Solution {
    static int minStops(int target,int fuel,int[][] st) {
        PriorityQueue<Integer> q=new PriorityQueue<>(Collections.reverseOrder());
        int pos=0, i=0, stops=0;
        while(fuel<target){
            while(i<st.length && st[i][0]<=fuel) q.add(st[i++][1]);
            if(q.isEmpty()) return -1;
            fuel+=q.poll(); stops++;
        }
        return stops;
    }
}
`, bugs: { 9: { was: 'fuel+=q.poll(); stops++;', buggy: 'fuel-=q.poll(); stops++;' } } },
    python: { correct: `
import heapq
def min_stops(target, fuel, stations):
    h = []
    i = stops = 0
    while fuel < target:
        while i < len(stations) and stations[i][0] <= fuel:
            heapq.heappush(h, -stations[i][1])
            i += 1
        if not h:
            return -1
        fuel -= heapq.heappop(h)
        stops += 1
    return stops
`, bugs: { 11: { was: 'fuel -= heapq.heappop(h)', buggy: 'fuel += heapq.heappop(h)' } } },
    c: { correct: `
int min_stops(int target,int fuel,int st[][2],int n) {
    int h[1000],m=0,i=0,stops=0;
    while(fuel<target){
        while(i<n && st[i][0]<=fuel){
            int x=st[i++][1],j=m++;
            while(j>0 && h[(j-1)/2]<x){h[j]=h[(j-1)/2];j=(j-1)/2;}
            h[j]=x;
        }
        if(!m)return -1;
        int best=h[0],x=h[--m],j=0;
        while(2*j+1<m){int c=2*j+1;if(c+1<m&&h[c+1]>h[c])c++;if(h[c]<=x)break;h[j]=h[c];j=c;}
        if(m)h[j]=x;
        fuel+=best;stops++;
    }
    return stops;
}
`, bugs: { 13: { was: 'fuel+=best;stops++;', buggy: 'fuel-=best;stops++;' } } }
  }
});
