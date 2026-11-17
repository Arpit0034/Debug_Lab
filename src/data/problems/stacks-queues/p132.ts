import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p132',
  title: 'Double slashes spawn ghost paths',
  difficulty: 'Easy',
  topic: 'Stacks and Queues',
  subtopic: 'Navigation Depth',
  tags: ['Path Traversal', 'Token Processing'],
  bugCategory: 'Incorrect Duplicate Handling',
  sourceInspiredBy: 'Directory navigation / simplify path pattern',
  description:
    'Given a sequence of directory transitions where string tokens represent folder names, "." denotes staying in the current directory, and ".." moves to the parent directory, determine the final directory depth starting from the root at depth 0. Empty tokens represent redundant separators and should be ignored. The solution treats empty tokens as valid folders.',
  constraints: ['1 <= tokens.length <= 100', 'Tokens consist of characters and symbols'],
  examples: [
    { input: 'tokens = ["a", "", "b", ".."]', output: '1', note: 'Enters "a", ignores "", enters "b", moves up to "a". Depth is 1.' },
    { input: 'tokens = ["x", "", "", "y"]', output: '2' },
  ],
  hints: [
    'Notice what happens when consecutive separators produce empty string tokens.',
    'Check whether empty tokens are filtered out alongside the current directory token ".".',
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Calculate directory depth resulting from a series of navigation tokens.',
    algorithm:
      'Iterate through tokens. Ignore empty strings and ".", decrement depth on ".." (flooring at 0), and increment depth for standard folder names.',
    bug: 'The filter condition checks only for "." and omits checking for the empty string.',
    whyItFails:
      'Omitting the empty string check treats "" as a folder name, erroneously incrementing directory depth.',
    failingTestCase: 'tokens = ["x", "", "", "y"]: returns 4 instead of 2 because both empty tokens are counted as folders.',
    fix: 'Filter out both: an empty token or ".".',
    whyFixWorks: 'Empty tokens from duplicate delimiters represent no folder change and must be bypassed.',
    dryRun:
      'For ["a", "", "b", ".."]: "a" increments to 1; "" is ignored; "b" increments to 2; ".." decrements to 1. Final depth is 1.',
    debuggingLesson:
      'When parsing delimiter-separated text, empty tokens arising from adjacent delimiters must be explicitly sanitized.',
  },
  testCases: [
    { input: '["a", "", "b", ".."]', expected: '1', buggyOutput: '2' },
    { input: '["x", "", "", "y"]', expected: '2', buggyOutput: '4' },
  ],
  harness: {
    expected: '1 2',
    driver: {
      java: `System.out.println(Solution.finalPathDepth(new String[]{"a", "", "b", ".."}) + " " + Solution.finalPathDepth(new String[]{"x", "", "", "y"}));`,
      python: `print(final_path_depth(["a", "", "b", ".."]), final_path_depth(["x", "", "", "y"]))`,
      c: `printf("%d %d", final_path_depth((char*[]){"a", "", "b", ".."}, 4), final_path_depth((char*[]){"x", "", "", "y"}, 4));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int finalPathDepth(String[] tokens) {
        int depth = 0;
        for (String t : tokens) {
            if (t.equals("") || t.equals(".")) {
                continue;
            }
            if (t.equals("..")) {
                if (depth > 0) {
                    depth--;
                }
            } else {
                depth++;
            }
        }
        return depth;
    }
}`,
      bugs: { 5: { was: 't.equals("") || t.equals(".")', buggy: '            if (t.equals(".")) {' } },
    },
    python: {
      correct: `def final_path_depth(tokens):
    depth = 0
    for t in tokens:
        if t == '' or t == '.':
            continue
        if t == '..':
            if depth > 0:
                depth -= 1
        else:
            depth += 1
    return depth`,
      bugs: { 4: { was: "t == '' or t == '.'", buggy: "        if t == '.':" } },
    },
    c: {
      correct: `#include <string.h>

int final_path_depth(char* tokens[], int n) {
    int depth = 0;
    for (int i = 0; i < n; i++) {
        if (strcmp(tokens[i], "") == 0 || strcmp(tokens[i], ".") == 0) {
            continue;
        }
        if (strcmp(tokens[i], "..") == 0) {
            if (depth > 0) {
                depth--;
            }
        } else {
            depth++;
        }
    }
    return depth;
}`,
      bugs: { 6: { was: 'strcmp(tokens[i], "") == 0 || strcmp(tokens[i], ".") == 0', buggy: '        if (strcmp(tokens[i], ".") == 0) {' } },
    },
  },
});
