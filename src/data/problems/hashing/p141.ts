import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p141',
  title: 'Two letters share a single partner',
  difficulty: 'Easy',
  topic: 'Hashing',
  subtopic: 'Bijection Validation',
  tags: ['Character Mapping', 'One-To-One Check'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Isomorphic strings bijection pattern',
  description:
    'Determine whether two strings have a valid one-to-one character substitution that transforms the first into the second. No two distinct characters may map to the same character. Return 1 if isomorphic, or 0 otherwise. The implementation only validates substitutions in one direction.',
  constraints: ['1 <= s.length == t.length <= 1000', 'ASCII characters'],
  examples: [
    { input: 's = "ab", t = "aa"', output: '0', note: 'Both "a" and "b" would map to "a", violating the one-to-one requirement.' },
    { input: 's = "egg", t = "add"', output: '1' },
  ],
  hints: [
    'Notice whether the mapping ensures uniqueness in both directions.',
    'Trace what happens when two different source characters attempt to map to the same target character.',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Check whether two strings are isomorphic under a bijective character mapping.',
    algorithm:
      'Maintain two lookup tables: one mapping s to t and another mapping t to s. For each position, confirm both character mappings are mutually consistent.',
    bug: 'The backward consistency check on the t-to-s table is bypassed, allowing many-to-one mappings.',
    whyItFails:
      'Validating only s -> t permits two distinct characters in s to map to the identical character in t, violating the bijection requirement.',
    failingTestCase: 's = "ab", t = "aa": returns 1 instead of 0 because "a" -> "a" and "b" -> "a" are accepted without checking reverse uniqueness.',
    fix: 'Enforce two-way consistency: reject when the t-to-s table already holds a different source character for the current target character.',
    whyFixWorks: 'Validating both directions guarantees an exact bijective (one-to-one and onto) correspondence.',
    dryRun:
      'For s = "ab", t = "aa": at i=0, "a" maps to "a" both ways. At i=1, "b" has no s->t mapping, but the t->s table says "a" already comes from "a", which is not "b". Fails and returns 0.',
    debuggingLesson:
      'A bijection requires verifying both directions of the mapping; never validate only one direction.',
  },
  testCases: [
    { input: 's = "ab", t = "aa"', expected: '0', buggyOutput: '1' },
    { input: 's = "egg", t = "add"', expected: '1' },
  ],
  harness: {
    expected: '0 1',
    driver: {
      java: `System.out.println(Solution.isIsomorphic("ab", "aa") + " " + Solution.isIsomorphic("egg", "add"));`,
      python: `print(is_isomorphic("ab", "aa"), is_isomorphic("egg", "add"))`,
      c: `printf("%d %d", is_isomorphic("ab", "aa"), is_isomorphic("egg", "add"));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int isIsomorphic(String s, String t) {
        if (s.length() != t.length()) return 0;
        int[] mapS = new int[256];
        int[] mapT = new int[256];
        for (int i = 0; i < s.length(); i++) {
            char c1 = s.charAt(i);
            char c2 = t.charAt(i);
            if (mapS[c1] != 0 && mapS[c1] != c2) return 0;
            if (mapT[c2] != 0 && mapT[c2] != c1) return 0;
            mapS[c1] = c2;
            mapT[c2] = c1;
        }
        return 1;
    }
}`,
      bugs: { 10: { was: 'if (mapT[c2] != 0 && mapT[c2] != c1) return 0;', buggy: '            if (false) return 0;' } },
    },
    python: {
      correct: `def is_isomorphic(s, t):
    if len(s) != len(t):
        return 0
    map_s = {}
    map_t = {}
    for c1, c2 in zip(s, t):
        if c1 in map_s and map_s[c1] != c2:
            return 0
        if c2 in map_t and map_t[c2] != c1:
            return 0
        map_s[c1] = c2
        map_t[c2] = c1
    return 1`,
      bugs: { 9: { was: 'if c2 in map_t and map_t[c2] != c1:', buggy: '        if False:' } },
    },
    c: {
      correct: `#include <string.h>

int is_isomorphic(char* s, char* t) {
    int n = strlen(s);
    if (n != (int)strlen(t)) return 0;
    int map_s[256] = {0};
    int map_t[256] = {0};
    for (int i = 0; i < n; i++) {
        unsigned char c1 = s[i];
        unsigned char c2 = t[i];
        if (map_s[c1] != 0 && map_s[c1] != c2) return 0;
        if (map_t[c2] != 0 && map_t[c2] != c1) return 0;
        map_s[c1] = c2;
        map_t[c2] = c1;
    }
    return 1;
}`,
      bugs: { 12: { was: 'if (map_t[c2] != 0 && map_t[c2] != c1) return 0;', buggy: '        if (0) return 0;' } },
    },
  },
});
