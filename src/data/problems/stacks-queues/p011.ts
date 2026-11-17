import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p011',
  title: 'Unclosed brackets pass',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Bracket Matching',
  tags: ['Stack', 'Final State'],
  bugCategory: 'Incorrect Edge-case Handling',
  sourceInspiredBy: 'Valid parentheses pattern',
  description: 'Return true if every ( and [ in a string is closed by the matching bracket in the right order. The function rejects "(]" but wrongly accepts some inputs.',
  constraints: ['0 <= length <= 10000', 'Only ( ) [ ] appear'],
  examples: [
    { input: 's = "()[]"', output: 'true' },
    { input: 's = "((("', output: 'false', note: 'The buggy code returns true.' },
  ],
    hints: ['After the loop ends, what should be left unmatched for a valid string?'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Check that brackets are balanced and correctly nested.',
    algorithm: 'Push every opening bracket. For each closing bracket, pop and check it matches. A valid string leaves nothing on the stack.',
    bug: 'The function returns true after the loop without checking whether the stack is empty.',
    whyItFails: 'Every closing bracket was matched, but opening brackets that never got closed are still on the stack. Those inputs are invalid yet reach the final return.',
    failingTestCase: 's = "(((" returns true because there are no closing brackets to cause a mismatch.',
    fix: 'Return whether the stack is empty.',
    whyFixWorks: 'An empty stack means every opener was closed, which together with the mismatch checks proves the string is valid.',
    dryRun: 's = "((": push, push, loop ends. Stack has 2 items, so the result is false.',
    debuggingLesson: 'For stack algorithms, always think about what the leftover state means after the input ends.',
  },
  testCases: [{ input: '"((("', expected: 'false', buggyOutput: 'true' }],
  harness: {
    expected: '1 0 0',
    driver: {
      java: `System.out.println((Solution.isValid("()[]") ? 1 : 0) + " " + (Solution.isValid("(((") ? 1 : 0) + " " + (Solution.isValid("(]") ? 1 : 0));`,
      python: `print(int(is_valid("()[]")), int(is_valid("(((")), int(is_valid("(]")))`,
      c: `printf("%d %d %d", is_valid("()[]"), is_valid("((("), is_valid("(]"));`,
    },
  },
  code: {
    java: {
      correct: `
import java.util.*;

class Solution {
    static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) {
                    return false;
                }
                char open = stack.pop();
                if ((c == ')' && open != '(') || (c == ']' && open != '[')) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}
`,
      bugs: { 19: { was: 'stack.isEmpty()', buggy: 'return true;', fixes: ['return stack.size() == 0;'] } },
    },
    python: {
      correct: `
def is_valid(s):
    stack = []
    for c in s:
        if c in '([':
            stack.append(c)
        else:
            if not stack:
                return False
            open_ = stack.pop()
            if (c == ')' and open_ != '(') or (c == ']' and open_ != '['):
                return False
    return not stack
`,
      bugs: { 12: { was: 'not stack', buggy: 'return True', fixes: ['return len(stack) == 0'] } },
    },
    c: {
      correct: `
int is_valid(const char *s) {
    char stack[100];
    int top = 0;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[') {
            stack[top++] = c;
        } else {
            if (top == 0) {
                return 0;
            }
            char open = stack[--top];
            if ((c == ')' && open != '(') || (c == ']' && open != '[')) {
                return 0;
            }
        }
    }
    return top == 0;
}
`,
      bugs: { 18: { was: 'top == 0', buggy: 'return 1;', fixes: ['return !top;'] } },
    },
  },
});
