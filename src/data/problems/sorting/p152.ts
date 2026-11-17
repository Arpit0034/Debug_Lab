import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p152',
  title: 'Equal values are split inconsistently',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Comparator Ordering',
  tags: ['Sorting', 'Comparator', 'Stable Ordering'],
  bugCategory: 'Incorrect Comparator Logic',
  sourceInspiredBy: 'Ordering records by score and then identifier',
  description: 'Sort pairs by ascending score, then ascending identifier. Return the pairs in that order.',
  constraints: ['1 <= n <= 10000', 'Each pair contains two integers'],
  examples: [{ input: '[[3,8],[1,5],[3,2]]', output: '[[1,5],[3,2],[3,8]]' }],
  hints: ['A tie in the first field still needs a deterministic rule.', 'The comparison should distinguish less, equal, and greater.'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  explanation: {
    overview: 'Order records using two ascending keys.',
    algorithm: 'Compare the primary field first and use the second field only when primary fields tie.',
    bug: 'The tie-break comparison is reversed.',
    whyItFails: 'Records sharing a score appear in descending identifier order.',
    failingTestCase: 'The two records with score 3 appear as [3,8] before [3,2].',
    fix: 'Compare the second field in ascending order.',
    whyFixWorks: 'The comparator implements the requested lexicographic ordering.',
    dryRun: 'For score 3, identifier 2 compares before identifier 8.',
    debuggingLesson: 'Test comparators with equal primary keys, not only distinct values.'
  },
  testCases: [{ input: '[[3,8],[1,5],[3,2]]', expected: '1:5 3:2 3:8' }],
  harness: { expected: '1:5 3:2 3:8', driver: { java: 'System.out.print(Solution.sortPairs(new int[][]{{3,8},{1,5},{3,2}}));', python: 'print(" ".join("%d:%d" % (p[0], p[1]) for p in sort_pairs([[3,8],[1,5],[3,2]])))', c: 'int a[][2]={{3,8},{1,5},{3,2}}; sort_pairs(a,3); for(int i=0;i<3;i++) printf("%d:%d ",a[i][0],a[i][1]);' } },
  code: {
    java: { correct: `
import java.util.*;
class Solution {
    static String sortPairs(int[][] a) {
        Arrays.sort(a, (p, q) -> {
            if (p[0] != q[0]) return Integer.compare(p[0], q[0]);
            return Integer.compare(p[1], q[1]);
        });
        StringBuilder s = new StringBuilder();
        for (int[] p : a) s.append(p[0]).append(':').append(p[1]).append(' ');
        return s.toString().trim();
    }
}
`, bugs: { 6: { was: 'return Integer.compare(p[1], q[1]);', buggy: 'return Integer.compare(q[1], p[1]);' } } },
    python: { correct: `
def sort_pairs(a):
    return sorted(a, key=lambda p: (p[0], p[1]))
`, bugs: { 2: { was: 'return sorted(a, key=lambda p: (p[0], p[1]))', buggy: 'return sorted(a, key=lambda p: (p[0], -p[1]))' } } },
    c: { correct: `
int pair_cmp(const void *x, const void *y) {
    const int *a = x, *b = y;
    if (a[0] != b[0]) return (a[0] > b[0]) - (a[0] < b[0]);
    return (a[1] > b[1]) - (a[1] < b[1]);
}
void sort_pairs(int a[][2], int n) {
    qsort(a, n, sizeof(a[0]), pair_cmp);
}
`, bugs: { 4: { was: 'return (a[1] > b[1]) - (a[1] < b[1]);', buggy: 'return (b[1] > a[1]) - (b[1] < a[1]);' } } }
  }
});
