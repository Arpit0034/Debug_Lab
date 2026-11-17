import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p071',
  title: 'The middle finder overshoots its target',
  difficulty: 'Easy',
  topic: 'Arrays',
  subtopic: 'Middle Element',
  tags: ['Two Pointers', 'Middle', 'Indexing'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Find the middle element of a sequence with two pointers',
  description:
    'Return the element that sits at the middle position of a sequence of odd length, scanning from both ends at different speeds.',
  constraints: ['1 <= n <= 1000', 'n is odd'],
  examples: [
    { input: 'a = [1, 2, 3, 4, 5]', output: '3' },
  ],
  hints: ['How many iterations should finish once the fast pointer runs past the end?', 'Check the exact stop condition of the loop.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Find the middle element by advancing a fast pointer twice as quickly as a slow one.',
    algorithm: 'Advance the slow pointer by one and the fast pointer by two until the fast pointer cannot move two steps further. Then the slow pointer indexes the middle.',
    bug: 'The loop stop condition allows the fast pointer to take one more step when it is already on the last index.',
    whyItFails: 'With the relaxed stop condition, an extra round is executed, so the slow pointer ends one position past the true middle.',
    failingTestCase: 'For [1,2,3,4,5], the code returns 4 instead of 3.',
    fix: 'Stop the loop when fast + 1 is no longer strictly less than n.',
    whyFixWorks: 'The last valid round requires the fast pointer to still have two elements ahead of it, which keeps the slow pointer on the true middle.',
    dryRun: 'For n = 5, correct rounds advance slow to index 2 and fast to index 4, then stop. The buggy condition lets one more round run, moving slow to index 3 and fast to index 6, so it returns the fourth element.',
    debuggingLesson: 'When two pointers move at different speeds, test the stop condition against odd and even lengths; a single missing strictness can shift the answer by one.',
  },
  testCases: [
    { input: '[1,2,3,4,5]', expected: '3', buggyOutput: '4' },
  ],
  harness: {
    expected: '3',
    driver: {
      java: `System.out.print(Solution.middle(new int[]{1,2,3,4,5}));`,
      python: `print(middle([1,2,3,4,5]))`,
      c: `printf("%d", middle((int[]){1,2,3,4,5}, 5));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int middle(int[] a) {
        int n = a.length;
        int slow = 0, fast = 0;
        while (fast < n && fast + 1 < n) {
            slow++;
            fast += 2;
        }
        return a[slow];
    }
}
`,
      bugs: { 5: { was: 'fast + 1 < n', buggy: 'while (fast < n && fast + 1 <= n) {' } },
    },
    python: {
      correct: `
def middle(a):
    n = len(a)
    slow = 0
    fast = 0
    while fast < n and fast + 1 < n:
        slow += 1
        fast += 2
    return a[slow]
`,
      bugs: { 5: { was: 'fast + 1 < n', buggy: 'while fast < n and fast + 1 <= n:' } },
    },
    c: {
      correct: `
int middle(int a[], int n) {
    int slow = 0, fast = 0;
    while (fast < n && fast + 1 < n) {
        slow++;
        fast += 2;
    }
    return a[slow];
}
`,
      bugs: { 3: { was: 'fast + 1 < n', buggy: 'while (fast < n && fast + 1 <= n) {' } },
    },
  },
});
