import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p212',
  title: 'Equal scores reverse their arrival order',
  difficulty: 'Medium',
  topic: 'Sorting',
  subtopic: 'Stable Sorting',
  tags: ['Stable Sort', 'Comparator'],
  bugCategory: 'Incorrect Comparator Logic',
  sourceInspiredBy: 'Stable sort by score pattern',
  description:
    'Return ids ordered by ascending score while preserving the original order among equal scores. The current code reverses equal-score groups.',
  constraints: ['1 <= n <= 100000', 'Scores and ids have the same length'],
  examples: [
    { input: 'scores = [90,80,90,80], ids = [1,2,3,4]', output: '2 4 1 3' },
  ],
  hints: ['Equal scores must not move past each other.', 'Trace the insertion condition when scores are equal.'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  explanation: {
    overview: 'Sort paired ids by score without disturbing equal-score order.',
    algorithm: 'Use insertion sort and shift only when the previous score is strictly greater than the key score.',
    bug: 'The condition uses >= instead of >, so equal scores are shifted.',
    whyItFails: 'Shifting on equality moves later ids before earlier ids, breaking stability.',
    failingTestCase: 'scores = [90,80,90,80], ids = [1,2,3,4] returns 4 2 3 1 instead of 2 4 1 3.',
    fix: 'Use scores[j] > keyScore in the insertion loop.',
    whyFixWorks: 'Only strictly larger scores should move right; equal scores stay in their original relative order.',
    dryRun: 'At the last insertion, key id=4 score=80. The buggy >= shifts ids with score 90 and 80, pushing 4 to the front.',
    debuggingLesson: 'Stability depends on using a strict comparison in the shifting condition.',
  },
  testCases: [
    { input: '[90,80,90,80], [1,2,3,4]', expected: '2 4 1 3', buggyOutput: '4 2 3 1' },
  ],
  harness: {
    expected: '2 4 1 3',
    driver: {
      java: `int[] r = Solution.stableSort(new int[]{90,80,90,80}, new int[]{1,2,3,4}); for (int i = 0; i < r.length; i++) { if (i > 0) System.out.print(" "); System.out.print(r[i]); } System.out.println();`,
      python: `print(*stable_sort([90,80,90,80], [1,2,3,4]))`,
      c: `int scores[] = {90,80,90,80}; int ids[] = {1,2,3,4}; int out[4]; stable_sort(scores, ids, 4, out); for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", out[i]); }`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static int[] stableSort(int[] scores, int[] ids) {
        int[] order = new int[ids.length];
        for (int i = 0; i < ids.length; i++) {
            order[i] = ids[i];
        }
        int[] s = new int[scores.length];
        for (int i = 0; i < scores.length; i++) {
            s[i] = scores[i];
        }
        for (int i = 1; i < order.length; i++) {
            int keyId = order[i];
            int keyScore = s[i];
            int j = i - 1;
            while (j >= 0 && s[j] > keyScore) {
                order[j + 1] = order[j];
                s[j + 1] = s[j];
                j--;
            }
            order[j + 1] = keyId;
            s[j + 1] = keyScore;
        }
        return order;
    }
}
`,
      bugs: { 15: { was: 's[j] > keyScore', buggy: 'while (j >= 0 && s[j] >= keyScore) {' } },
    },
    python: {
      correct: `
def stable_sort(scores, ids):
    order = ids[:]
    s = scores[:]
    for i in range(1, len(order)):
        key_id = order[i]
        key_score = s[i]
        j = i - 1
        while j >= 0 and s[j] > key_score:
            order[j + 1] = order[j]
            s[j + 1] = s[j]
            j -= 1
        order[j + 1] = key_id
        s[j + 1] = key_score
    return order
`,
      bugs: { 8: { was: 's[j] > key_score', buggy: 'while j >= 0 and s[j] >= key_score:' } },
    },
    c: {
      correct: `
void stable_sort(int scores[], int ids[], int n, int out[]) {
    for (int i = 0; i < n; i++) {
        out[i] = ids[i];
    }
    int s[100];
    for (int i = 0; i < n; i++) {
        s[i] = scores[i];
    }
    for (int i = 1; i < n; i++) {
        int key_id = out[i];
        int key_score = s[i];
        int j = i - 1;
        while (j >= 0 && s[j] > key_score) {
            out[j + 1] = out[j];
            s[j + 1] = s[j];
            j--;
        }
        out[j + 1] = key_id;
        s[j + 1] = key_score;
    }
}
`,
      bugs: { 13: { was: 's[j] > key_score', buggy: 'while (j >= 0 && s[j] >= key_score) {' } },
    },
  },
});
