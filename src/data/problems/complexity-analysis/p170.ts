import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p170',
  title: 'The nested scan repeats unnecessary comparisons',
  difficulty: 'Hard',
  topic: 'Complexity Analysis',
  subtopic: 'Duplicate Detection',
  tags: ['Complexity', 'Hashing', 'Optimization'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Checking whether an array contains a duplicate value',
  description: 'Return true if any value appears at least twice in the array; otherwise return false.',
  constraints: ['1 <= n <= 200000', '-10^9 <= a[i] <= 10^9'],
  examples: [{ input: '[4,1,7,4]', output: 'true' }, { input: '[1,2,3]', output: 'false' }],
  hints: ['Consider how much work is repeated as the input grows.', 'A value already encountered should be recognized quickly.'],
  complexity: { time: 'O(n) average', space: 'O(n)' },
  explanation: {
    overview: 'Detect whether any value occurs more than once.',
    algorithm: 'Track previously encountered values and stop when a value is seen again.',
    bug: 'The implementation compares every pair even though the task only needs prior-seen membership.',
    whyItFails: 'The result is correct but the number of comparisons grows quadratically and exceeds large-input limits.',
    failingTestCase: 'A large array of unique values causes excessive pair comparisons.',
    fix: 'Use a set for expected constant-time membership checks.',
    whyFixWorks: 'Each value is inserted and checked once on average.',
    dryRun: 'Read 4, 1, 7 into the set; the next 4 is already present, so return true.',
    debuggingLesson: 'Correct output is not sufficient when the algorithm violates the input-size performance requirement.'
  },
  testCases: [{ input: '[4,1,7,4]', expected: 'true' }],
  harness: { expected: 'true', driver: { java: 'System.out.print(Solution.hasDuplicate(new int[]{4,1,7,4}));', python: 'print(str(has_duplicate([4,1,7,4])).lower())', c: 'printf("%s",has_duplicate((int[]){4,1,7,4},4)?"true":"false");' } },
  code: {
    java: { correct: `
import java.util.*;
class Solution {
    static boolean hasDuplicate(int[] a) {
        Set<Integer> seen=new HashSet<>();
        for(int x:a)if(!seen.add(x))return true;
        return false;
    }
}
`, bugs: { 5: { was: 'for(int x:a)if(!seen.add(x))return true;', buggy: 'for(int x:a)if(!seen.add(x))return false;' } } },
    python: { correct: `
def has_duplicate(a):
    seen = set()
    for x in a:
        if x in seen:
            return True
        seen.add(x)
    return False
`, bugs: { 2: { was: 'seen = set()', buggy: 'seen = []' } } },
    c: { correct: `
int has_duplicate(int a[],int n) {
    for(int i=0;i<n;i++)
        for(int j=0;j<i;j++)
            if(a[i]==a[j])return 1;
    return 0;
}
`, bugs: { 3: { was: 'for(int j=0;j<i;j++)', buggy: 'for(int j=1;j<i;j++)' } } }
  }
});
