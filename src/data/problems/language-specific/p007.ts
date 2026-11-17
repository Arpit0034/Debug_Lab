import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p007',
  title: 'Equal lists reported as different',
  difficulty: 'Medium',
  topic: 'Java Concepts',
  subtopic: 'Object Equality',
  tags: ['Integer Caching', 'Equality'],
  bugCategory: 'Collection-related Logical Error',
  sourceInspiredBy: 'Boxed Integer comparison pitfall',
  description:
    'Return true if two lists of integers contain the same values in the same order. The function works for small numbers but fails for large ones.',
  constraints: ['0 <= size <= 1000', 'Values fit in a 32-bit int'],
  examples: [
    { input: 'a = [1, 2], b = [1, 2]', output: 'true' },
    { input: 'a = [1000], b = [1000]', output: 'true', note: 'The buggy code returns false.' },
  ],
  hints: ['What does != compare when both sides are Integer objects?'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Compare two lists element by element.',
    algorithm: 'Reject lists of different size, then compare each pair of elements at the same index.',
    bug: 'Elements are compared with != on Integer objects, which compares references, not values.',
    whyItFails:
      'Java caches Integer objects only for roughly -128 to 127. Small values share one object, so == happens to work. Larger values are separate objects, so != reports them as different even when equal.',
    failingTestCase: 'a = [1000], b = [1000] returns false.',
    fix: 'Compare values with equals.',
    whyFixWorks: 'Integer.equals compares the wrapped int values, whatever objects hold them.',
    dryRun: 'a.get(0) and b.get(0) are two distinct Integer objects holding 1000. != sees different references and returns false; equals sees equal values and continues.',
    debuggingLesson: 'Never compare boxed values with == or !=. A test with small numbers can hide this bug completely.',
  },
  testCases: [{ input: '[1000], [1000]', expected: 'true', buggyOutput: 'false' }],
  harness: {
    expected: 'true true',
    driver: {
      java: `System.out.println(Solution.sameValues(List.of(1000), List.of(1000)) + " " + Solution.sameValues(List.of(1, 2), List.of(1, 2)));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static boolean sameValues(List<Integer> a, List<Integer> b) {
        if (a.size() != b.size()) {
            return false;
        }
        for (int i = 0; i < a.size(); i++) {
            if (!a.get(i).equals(b.get(i))) {
                return false;
            }
        }
        return true;
    }
}
`,
      bugs: { 9: { was: '.equals(', buggy: 'if (a.get(i) != b.get(i)) {', fixes: ['if (!Objects.equals(a.get(i), b.get(i))) {', 'if (a.get(i).intValue() != b.get(i).intValue()) {'] } },
    },
  },
});
