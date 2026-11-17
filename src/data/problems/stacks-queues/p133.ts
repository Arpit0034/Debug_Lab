import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p133',
  title: 'Multi-digit counts reset to single digits',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Nested Repeats',
  tags: ['Repetition Decoding', 'Length Computation'],
  bugCategory: 'Collection-related Logical Error',
  sourceInspiredBy: 'Decode string length calculation pattern',
  description:
    'Calculate the total expanded length of an encoded sequence containing nested repetitions of the form k[segment], where k is a positive integer and segment contains letters or further nested repetitions. The solution misinterprets numbers that consist of multiple digits.',
  constraints: ['1 <= s.length <= 100', '1 <= k <= 100'],
  examples: [
    { input: 's = "12[a]"', output: '12', note: '"a" is repeated 12 times.' },
    { input: 's = "3[a2[b]]"', output: '9', note: '"a2[b]" has length 3; repeated 3 times yields 9.' },
  ],
  hints: [
    'Notice how repetition factors are constructed character by character from the input string.',
    'Trace what value of k is recorded when the number has two or more digits before an opening bracket.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Compute the length of a recursively repeated string sequence.',
    algorithm:
      'Maintain nested repetition counts and prefix lengths. Parse digits into an integer, push state on an opening bracket, and pop state on a closing bracket to scale and combine subsegment lengths.',
    bug: "Multi-digit parsing assigns curNum = c - '0' instead of accumulating curNum = curNum * 10 + (c - '0').",
    whyItFails:
      'Assigning rather than shifting by 10 replaces previous digits, reducing multi-digit multipliers to only their final single digit.',
    failingTestCase: 's = "12[a]": evaluates k as 2 instead of 12, returning length 2 instead of 12.',
    fix: "Accumulate digits: curNum = curNum * 10 + (c - '0').",
    whyFixWorks: 'Positional base-10 accumulation correctly reflects the full magnitude of multi-digit numbers.',
    dryRun:
      'For "12[a]": digit 1 sets curNum = 1; digit 2 computes 1 * 10 + 2 = 12. At "[", 12 is stored. Inside, "a" has length 1. At "]", 12 * 1 = 12.',
    debuggingLesson:
      'When parsing integers from a character stream, remember base-10 place value multiplication: num = num * 10 + digit.',
  },
  testCases: [
    { input: '"12[a]"', expected: '12', buggyOutput: '2' },
    { input: '"3[a2[b]]"', expected: '9' },
  ],
  harness: {
    expected: '12 9',
    driver: {
      java: `System.out.println(Solution.expandedLength("12[a]") + " " + Solution.expandedLength("3[a2[b]]"));`,
      python: `print(expanded_length("12[a]"), expanded_length("3[a2[b]]"))`,
      c: `printf("%d %d", expanded_length("12[a]"), expanded_length("3[a2[b]]"));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int expandedLength(String s) {
        int n = s.length();
        int[] numStk = new int[n];
        int[] lenStk = new int[n];
        int nTop = -1, lTop = -1;
        int curNum = 0;
        int curLen = 0;
        for (int i = 0; i < n; i++) {
            char c = s.charAt(i);
            if (c >= '0' && c <= '9') {
                curNum = curNum * 10 + (c - '0');
            } else if (c == '[') {
                numStk[++nTop] = curNum;
                lenStk[++lTop] = curLen;
                curNum = 0;
                curLen = 0;
            } else if (c == ']') {
                int k = numStk[nTop--];
                int prevLen = lenStk[lTop--];
                curLen = prevLen + k * curLen;
            } else {
                curLen++;
            }
        }
        return curLen;
    }
}`,
      bugs: { 12: { was: 'curNum * 10 + (c - \'0\')', buggy: "                curNum = (c - '0');" } },
    },
    python: {
      correct: `def expanded_length(s):
    num_stk = []
    len_stk = []
    cur_num = 0
    cur_len = 0
    for c in s:
        if c.isdigit():
            cur_num = cur_num * 10 + int(c)
        elif c == '[':
            num_stk.append(cur_num)
            len_stk.append(cur_len)
            cur_num = 0
            cur_len = 0
        elif c == ']':
            k = num_stk.pop()
            prev_len = len_stk.pop()
            cur_len = prev_len + k * cur_len
        else:
            cur_len += 1
    return cur_len`,
      bugs: { 8: { was: 'cur_num * 10 + int(c)', buggy: '            cur_num = int(c)' } },
    },
    c: {
      correct: `#include <string.h>

int expanded_length(char* s) {
    int n = strlen(s);
    int num_stk[100];
    int len_stk[100];
    int n_top = -1, l_top = -1;
    int cur_num = 0;
    int cur_len = 0;
    for (int i = 0; i < n; i++) {
        char c = s[i];
        if (c >= '0' && c <= '9') {
            cur_num = cur_num * 10 + (c - '0');
        } else if (c == '[') {
            num_stk[++n_top] = cur_num;
            len_stk[++l_top] = cur_len;
            cur_num = 0;
            cur_len = 0;
        } else if (c == ']') {
            int k = num_stk[n_top--];
            int prev_len = len_stk[l_top--];
            cur_len = prev_len + k * cur_len;
        } else {
            cur_len++;
        }
    }
    return cur_len;
}`,
      bugs: { 13: { was: 'cur_num * 10 + (c - \'0\')', buggy: "            cur_num = (c - '0');" } },
    },
  },
});
