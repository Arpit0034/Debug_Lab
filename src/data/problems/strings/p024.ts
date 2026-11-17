import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p024',
  title: 'Even-length palindromes lose their centre',
  difficulty: 'Medium',
  topic: 'Strings',
  subtopic: 'Longest Palindromic Substring',
  tags: ['Strings', 'Palindromes', 'Expansion'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Center expansion palindrome pattern',
  description:
    'Return the length of the longest contiguous substring that reads identically from left to right and right to left. A single character is always a valid answer.',
  constraints: ['1 <= s.length <= 10000', 'The string contains lowercase English letters'],
  examples: [
    { input: 's = "cbbd"', output: '2', note: '"bb" is the longest palindrome.' },
    { input: 's = "babad"', output: '3' },
  ],
  hints: [
    'A palindrome can have either one central character or two central characters.',
    'Trace what happens when the two starting indices are equal.',
  ],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
  explanation: {
    overview:
      'Find the maximum length of any contiguous palindromic substring.',
    algorithm:
      'Consider every character as the centre of an odd-length palindrome and every gap between adjacent characters as the centre of an even-length palindrome. Expand outward while both characters match and remain within the string.',
    bug:
      'The even-length expansion starts with the same left and right index instead of using two adjacent indices.',
    whyItFails:
      'An even-length palindrome has its centre between two characters. Starting both pointers at the same character only tests odd-length palindromes. As a result, valid even-length palindromes are never discovered.',
    failingTestCase:
      's = "cbbd": the buggy code returns 1 instead of 2.',
    fix: 'Initialize the even-length expansion with left = i and right = i + 1.',
    whyFixWorks:
      'The two pointers now begin on opposite sides of the gap between adjacent characters. Matching characters can expand outward to form even-length palindromes.',
    dryRun:
      'For "cbbd", consider i=1. The even-length centre should start at left=1 and right=2. Both characters are b, so the palindrome length is 2. The next expansion compares c and d, which differ. The buggy version starts both pointers at index 1, measures only "b" and misses "bb".',
    debuggingLesson:
      'When an algorithm handles two structurally different cases, verify that their initial states actually represent those cases. Testing only odd-length palindromes cannot establish correctness for even-length ones.',
  },
  testCases: [
    { input: '"cbbd"', expected: '2', buggyOutput: '1' },
    { input: '"babad"', expected: '3' },
    { input: '"a"', expected: '1' },
  ],
  harness: {
    expected: '2 3 1',
    driver: {
      java: `System.out.println(Solution.longestPalindrome("cbbd") + " " + Solution.longestPalindrome("babad") + " " + Solution.longestPalindrome("a"));`,
      python: `print(longest_palindrome("cbbd"), longest_palindrome("babad"), longest_palindrome("a"))`,
      c: `printf("%d %d %d", longest_palindrome("cbbd"), longest_palindrome("babad"), longest_palindrome("a"));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
    static int longestPalindrome(String s) {
        int best = 1;
        for (int i = 0; i < s.length(); i++) {
            int odd = expand(s, i, i);
            int even = expand(s, i, i + 1);
            best = Math.max(best, Math.max(odd, even));
        }
        return best;
    }
}
`,
      bugs: {
        13: {
          was: 'expand(s, i, i + 1)',
          buggy: 'int even = expand(s, i, i);',
        },
      },
    },
    python: {
      correct: `
def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return right - left - 1

def longest_palindrome(s):
    best = 1
    for i in range(len(s)):
        odd = expand(s, i, i)
        even = expand(s, i, i + 1)
        best = max(best, odd, even)
    return best
`,
      bugs: {
        11: {
          was: 'expand(s, i, i + 1)',
          buggy: 'even = expand(s, i, i)',
        },
      },
    },
    c: {
      correct: `
#include <string.h>
int expand(char s[], int left, int right) {
    int n = strlen(s);
    while (left >= 0 && right < n && s[left] == s[right]) {
        left--;
        right++;
    }
    return right - left - 1;
}
int longest_palindrome(char s[]) {
    int best = 1;
    int n = strlen(s);
    for (int i = 0; i < n; i++) {
        int odd = expand(s, i, i);
        int even = expand(s, i, i + 1);
        if (odd > best) best = odd;
        if (even > best) best = even;
    }
    return best;
}
`,
      bugs: {
        15: {
          was: 'expand(s, i, i + 1)',
          buggy: 'int even = expand(s, i, i);',
        },
      },
    },
  },
});
