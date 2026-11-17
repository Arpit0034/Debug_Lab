import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p135',
  title: 'Pop sequence reads past the boundary',
  difficulty: 'Medium',
  topic: 'Stacks and Queues',
  subtopic: 'Sequence Order Verification',
  tags: ['Lifo Simulation', 'Permutation Validity'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Validate stack sequences pattern',
  description:
    'Given two arrays pushed and popped with distinct integers, return 1 if this represents a valid series of push and pop actions on an initially empty container, or 0 otherwise. The implementation prematurely terminates the matching scan before processing the final item.',
  constraints: ['1 <= n <= 1000', 'Values are distinct'],
  examples: [
    { input: 'pushed = [1, 2, 3], popped = [3, 2, 1]', output: '1' },
    { input: 'pushed = [1, 2], popped = [2, 1]', output: '1' },
  ],
  hints: [
    'Examine the boundary check on the pointer tracking the target output sequence.',
    'Check whether the final element in the target sequence can ever be matched before the loop ends.',
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  explanation: {
    overview: 'Verify whether a specified output sequence can be obtained by lifo operations on an input sequence.',
    algorithm:
      'Push input elements sequentially. After each push, greedily pop elements as long as the top element matches the next expected item in the output sequence.',
    bug: 'The inner while loop checks j < n - 1 instead of j < n.',
    whyItFails:
      'Checking j < n - 1 prevents the final element (at index n - 1) from ever being matched and popped, leaving the container non-empty.',
    failingTestCase: 'pushed = [1, 2], popped = [2, 1]: 2 is popped, but 1 is left in the container because j reaches 1, returning 0 instead of 1.',
    fix: 'Change the loop condition from j < n - 1 to j < n.',
    whyFixWorks: 'Allowing j to reach n allows all n items to be matched and popped.',
    dryRun:
      'For pushed = [1, 2, 3], popped = [3, 2, 1]: pushes 1, 2, 3. Matches 3 (j=0->1), 2 (j=1->2), 1 (j=2->3). Container empty -> returns 1.',
    debuggingLesson:
      'When consuming a sequence of length n, the termination index is strictly n (j < n); using n - 1 truncates the last valid item.',
  },
  testCases: [
    { input: '[1, 2, 3], [3, 2, 1], 3', expected: '1', buggyOutput: '0' },
    { input: '[1, 2], [2, 1], 2', expected: '1', buggyOutput: '0' },
  ],
  harness: {
    expected: '1 1',
    driver: {
      java: `System.out.println(Solution.validateStackSequences(new int[]{1, 2, 3}, new int[]{3, 2, 1}, 3) + " " + Solution.validateStackSequences(new int[]{1, 2}, new int[]{2, 1}, 2));`,
      python: `print(validate_stack_sequences([1, 2, 3], [3, 2, 1], 3), validate_stack_sequences([1, 2], [2, 1], 2))`,
      c: `printf("%d %d", validate_stack_sequences((int[]){1, 2, 3}, (int[]){3, 2, 1}, 3), validate_stack_sequences((int[]){1, 2}, (int[]){2, 1}, 2));`,
    },
  },
  code: {
    java: {
      correct: `class Solution {
    static int validateStackSequences(int[] pushed, int[] popped, int n) {
        int[] st = new int[n];
        int top = -1;
        int j = 0;
        for (int i = 0; i < n; i++) {
            st[++top] = pushed[i];
            while (top >= 0 && j < n && st[top] == popped[j]) {
                top--;
                j++;
            }
        }
        return (top == -1) ? 1 : 0;
    }
}`,
      bugs: { 8: { was: 'j < n &&', buggy: '            while (top >= 0 && j < n - 1 && st[top] == popped[j]) {' } },
    },
    python: {
      correct: `def validate_stack_sequences(pushed, popped, n):
    st = []
    j = 0
    for x in pushed:
        st.append(x)
        while st and j < n and st[-1] == popped[j]:
            st.pop()
            j += 1
    return 1 if not st else 0`,
      bugs: { 6: { was: 'j < n and', buggy: '        while st and j < n - 1 and st[-1] == popped[j]:' } },
    },
    c: {
      correct: `int validate_stack_sequences(int pushed[], int popped[], int n) {
    int st[100];
    int top = -1;
    int j = 0;
    for (int i = 0; i < n; i++) {
        st[++top] = pushed[i];
        while (top >= 0 && j < n && st[top] == popped[j]) {
            top--;
            j++;
        }
    }
    return (top == -1) ? 1 : 0;
}`,
      bugs: { 7: { was: 'j < n &&', buggy: '        while (top >= 0 && j < n - 1 && st[top] == popped[j]) {' } },
    },
  },
});
