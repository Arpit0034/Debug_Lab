import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p168',
  title: 'Last digit never contributes letters',
  difficulty: 'Easy',
  topic: 'Backtracking',
  subtopic: 'Phone Letter Combinations',
  tags: ['Digits', 'Letters', 'Base Case'],
  bugCategory: 'Incorrect Recursion Base Case',
  sourceInspiredBy: 'Phone keypad letter combinations pattern',
  description:
    'Return how many letter strings can be formed from a sequence of digits using the standard small keypad mapping for 2, 3 and 4.',
  constraints: ['1 <= digits length <= 4', 'Digits are from 2 to 4'],
  examples: [
    { input: 'digits = 23', output: '9' },
  ],
  hints: ['The recursion should stop only after all digits have been processed.', 'Trace how many letters are appended for the final digit.'],
  complexity: { time: 'O(3^n)', space: 'O(n)' },
  explanation: {
    overview: 'Build every string by choosing one letter for each digit.',
    algorithm: 'At each digit, loop over its letters and recurse for the next digit; stop when the digit index reaches the length.',
    bug: 'The base case stops one digit early.',
    whyItFails: 'The final digit is never expanded, so each partial prefix is counted only once instead of once per final letter.',
    failingTestCase: 'digits = 23: the code prints 3 instead of 9.',
    fix: 'Stop only when the index equals the digit length.',
    whyFixWorks: 'Every digit then contributes its letters before a complete string is counted.',
    dryRun: 'For 23, prefixes a, b and c are counted at index 1, giving 3. The correct expansion multiplies each by 3 letters for digit 3, giving 9.',
    debuggingLesson: 'In recursive combination building, check the base case against the total input length, not one less.',
  },
  testCases: [{ input: '23', expected: '9' }],
  harness: {
    expected: '9',
    driver: {
      java: `System.out.println(Solution.combinations("23"));`,
      python: `print(combinations("23"))`,
      c: `printf("%d", combinations("23"));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static void dfs(String d, int i, String path, Map<Character, String> mp, List<String> res) {
        if (i == d.length()) {
            res.add(path);
            return;
        }
        String letters = mp.get(d.charAt(i));
        for (int j = 0; j < letters.length(); j++) {
            dfs(d, i + 1, path + letters.charAt(j), mp, res);
        }
    }
    static int combinations(String d) {
        if (d.length() == 0) return 0;
        Map<Character, String> mp = new HashMap<>();
        mp.put('2', "abc");
        mp.put('3', "def");
        List<String> res = new ArrayList<>();
        dfs(d, 0, "", mp, res);
        return res.size();
    }
}
`,
      bugs: { 4: { was: 'i == d.length()', buggy: 'if (i == d.length() - 1) {' } },
    },
    python: {
      correct: `
def combinations(digits):
    if not digits:
        return 0
    mp = {"2": "abc", "3": "def"}
    res = []
    def dfs(i, path):
        if i == len(digits):
            res.append(path)
            return
        for ch in mp[digits[i]]:
            dfs(i + 1, path + ch)
    dfs(0, "")
    return len(res)
`,
      bugs: { 9: { was: 'i == len(digits)', buggy: 'if i == len(digits) - 1:' } },
    },
    c: {
      correct: `
int dfs(char d[], int i, char mp[][4], int *count) {
    if (d[i] == 0) {
        (*count)++;
        return 0;
    }
    char *letters = mp[d[i] - '0'];
    for (int j = 0; letters[j] != 0; j++) {
        dfs(d, i + 1, mp, count);
    }
    return 0;
}
int combinations(char d[]) {
    if (d[0] == 0) return 0;
    char mp[10][4] = {{0}, {0}, "abc", "def"};
    int count = 0;
    dfs(d, 0, mp, &count);
    return count;
}
`,
      bugs: { 2: { was: 'd[i] == 0', buggy: 'if (d[i + 1] == 0) {' } },
    },
  },
});
