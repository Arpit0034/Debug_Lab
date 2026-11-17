import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p163',
  title: 'Closing bracket outruns its opener',
  difficulty: 'Medium',
  topic: 'Backtracking',
  subtopic: 'Balanced Parentheses',
  tags: ['Parentheses', 'Balance', 'Pruning'],
  bugCategory: 'Incorrect Condition',
  sourceInspiredBy: 'Generate parentheses pruning pattern',
  description:
    'Return how many strings of n pairs of parentheses are balanced.',
  constraints: ['1 <= n <= 10'],
  examples: [
    { input: 'n = 2', output: '2' },
  ],
  hints: ['A closing bracket is allowed only while fewer closes than opens have been placed.', 'Trace the branch after placing one open bracket.'],
  complexity: { time: 'O(4^n / sqrt(n))', space: 'O(n)' },
  explanation: {
    overview: 'Count all balanced strings with n opening and n closing brackets.',
    algorithm: 'Add an opening bracket while available, and add a closing bracket only when it would not outnumber opens.',
    bug: 'The closing condition permits a close when closes equal opens.',
    whyItFails: 'That creates prefixes with more closing than opening brackets, which can never be balanced.',
    failingTestCase: 'n = 2: the code prints 4 instead of 2.',
    fix: 'Allow a closing bracket only when close is strictly less than open.',
    whyFixWorks: 'Every prefix then has at least as many opens as closes, which is necessary and sufficient for a valid completion.',
    dryRun: 'After one open, the wrong condition allows a close immediately and later creates invalid strings such as ())( . The correct condition allows only (() and ()().',
    debuggingLesson: 'For balance constraints, check the prefix invariant before every recursive call.',
  },
  testCases: [{ input: '2', expected: '2' }],
  harness: {
    expected: '2',
    driver: {
      java: `System.out.println(Solution.generate(2));`,
      python: `print(generate(2))`,
      c: `printf("%d", generate(2));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;
class Solution {
    static void dfs(int open, int close, int n, String path, List<String> res) {
        if (path.length() == 2 * n) {
            res.add(path);
            return;
        }
        if (open < n) {
            dfs(open + 1, close, n, path + "(", res);
        }
        if (close < open) {
            dfs(open, close + 1, n, path + ")", res);
        }
    }
    static int generate(int n) {
        List<String> res = new ArrayList<>();
        dfs(0, 0, n, "", res);
        return res.size();
    }
}
`,
      bugs: { 11: { was: 'close < open', buggy: 'if (close <= open) {' } },
    },
    python: {
      correct: `
def generate(n):
    count = [0]
    def dfs(open, close, path):
        if len(path) == 2 * n:
            count[0] += 1
            return
        if open < n:
            dfs(open + 1, close, path + "(")
        if close < open:
            dfs(open, close + 1, path + ")")
    dfs(0, 0, "")
    return count[0]
`,
      bugs: { 9: { was: 'close < open', buggy: 'if close <= open:' } },
    },
    c: {
      correct: `
void dfs(int open, int close, int n, int len, int *count) {
    if (len == 2 * n) {
        (*count)++;
        return;
    }
    if (open < n) {
        dfs(open + 1, close, n, len + 1, count);
    }
    if (close < open) {
        dfs(open, close + 1, n, len + 1, count);
    }
}
int generate(int n) {
    int count = 0;
    dfs(0, 0, n, 0, &count);
    return count;
}
`,
      bugs: { 9: { was: 'close < open', buggy: 'if (close <= open) {' } },
    },
  },
});
