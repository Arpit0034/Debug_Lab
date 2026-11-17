import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p219',
  title: 'Short words sort after long words',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'String Comparator',
  tags: ['Comparator', 'Strings'],
  bugCategory: 'Incorrect Pointer Manipulation',
  sourceInspiredBy: 'Sort strings by length then lexicographic pattern',
  description:
    'Sort words by increasing length, breaking ties lexicographically. The current comparator puts longer words first.',
  constraints: ['1 <= n <= 1000', 'Words contain lowercase letters'],
  examples: [
    { input: 'w = [bb,a,cc,b]', output: 'a b bb cc' },
  ],
  hints: ['The primary key is length ascending.', 'Check the return value when lengths differ.'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
  explanation: {
    overview: 'Sort strings with a two-level ordering.',
    algorithm: 'Compare lengths first; if lengths are equal, compare the strings lexicographically.',
    bug: 'The length comparison returns -1 when the first word is longer instead of shorter.',
    whyItFails: 'Longer words are placed before shorter words, reversing the primary order.',
    failingTestCase: 'w = [bb,a,cc,b] returns bb cc a b instead of a b bb cc.',
    fix: 'Return -1 when the first length is smaller, otherwise 1.',
    whyFixWorks: 'Shorter words must come first.',
    dryRun: 'Comparing bb and a, lengths 2 and 1. The buggy comparator returns -1 for bb because 2 > 1, putting bb first.',
    debuggingLesson: 'For multi-key comparisons, verify the sign of the primary comparison before checking ties.',
  },
  testCases: [
    { input: '[bb,a,cc,b]', expected: 'a b bb cc', buggyOutput: 'bb cc a b' },
  ],
  harness: {
    expected: 'a b bb cc',
    driver: {
      java: `String[] r = Solution.sortWords(new String[]{"bb","a","cc","b"}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*sort_words(["bb","a","cc","b"]))`,
      c: `char* w[] = {"bb","a","cc","b"}; sort_words(w, 4); for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%s", w[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static String[] sortWords(String[] w) {
        Arrays.sort(w, (a, b) -> {
            if (a.length() != b.length()) {
                return a.length() - b.length();
            }
            return a.compareTo(b);
        });
        return w;
    }
}
`,
      bugs: { 8: { was: 'a.compareTo(b)', buggy: 'return b.compareTo(a);' } },
    },
    python: {
      correct: `
def cmp(a, b):
    if len(a) != len(b):
        return -1 if len(a) < len(b) else 1
    if a < b:
        return -1
    if a > b:
        return 1
    return 0
def sort_words(w):
    from functools import cmp_to_key
    return sorted(w, key=cmp_to_key(cmp))
`,
      bugs: { 3: { was: 'len(a) < len(b)', buggy: 'return -1 if len(a) > len(b) else 1' } },
    },
    c: {
      correct: `
#include <string.h>
int cmp(const void* p, const void* q) {
    const char* a = *(const char**)p;
    const char* b = *(const char**)q;
    int la = strlen(a);
    int lb = strlen(b);
    if (la != lb) {
        return la - lb;
    }
    return strcmp(a, b);
}
void sort_words(char* w[], int n) {
    qsort(w, n, sizeof(char*), cmp);
}
`,
      bugs: { 10: { was: 'strcmp(a, b)', buggy: 'return strcmp(b, a);' } },
    },
  },
});
