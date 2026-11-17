import type { ConceptDetail } from '../../types';

export const monotonicStackDetail: ConceptDetail = {
  id: 'monotonic-stack',
  overview: {
    essence:
      'Sorted stack (inc/dec). Each element pushed/popped once → O(n). Solves next greater/smaller.',
    what:
      'A stack that maintains monotonic order. When a new element arrives, pop everything that violates the order first. Each element is pushed exactly once and popped at most once.',
    problemSolved:
      'Next Greater Element, Next Smaller Element, Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water — all become O(n) instead of O(n²).',
    whyImportant:
      'Monotonic stack is the canonical O(n) solution for any "next greater/smaller" or "nearest smaller/larger" problem. Recognise the phrasing and you have the answer.',
    usedIn: [
      'Next greater element (any direction)',
      'Daily temperatures',
      'Largest rectangle in histogram',
      'Trapping rain water',
      'Stock span',
      'Remove k digits to form smallest number',
      'Sliding window maximum (with deque variant)',
    ],
  },
  intuition: {
    explanation:
      'While scanning, you can only "answer" an element when you find the next one that satisfies the comparison. A monotonic stack holds the elements whose answer you have not found yet. When a new element arrives, it is the answer for every element currently on the stack that it "beats" (for next greater, it beats smaller elements; for next smaller, it beats larger elements). Pop those, record the answer, push the new one. Every element is pushed exactly once and popped at most once, so O(n).',
    analogy:
      'A stack of people waiting for a taller person. When a taller person arrives, everyone shorter on the stack learns their "next taller person" answer and leaves. The new person joins the stack.',
  },
  internals: [
    { title: 'Increasing vs decreasing stack', body: 'Increasing stack (bottom→top) is for "next smaller". Decreasing stack is for "next greater". The invariant determines the pop condition.' },
    { title: 'Pop condition', body: 'For next greater: while stack not empty AND arr[stack.top] < arr[i]: pop, record answer. Then push i.' },
    { title: 'Answer storage', body: 'An answers array initialized to -1 (or 0). When you pop element at index j, answer[j] = arr[i].' },
    { title: 'Unresolved elements', body: 'After the loop, anything still on the stack has no next greater. Set its answer to -1 (or the sentinel you chose).' },
    { title: 'Circular variant', body: 'Traverse the array twice (2n). Use i % n when accessing. Handles circular next-greater problems.' },
    { title: 'Deque for sliding windows', body: 'For sliding window max, use a deque of indices with decreasing values. Remove from both ends: pop from back to maintain order, pop from front when index falls out of window.' },
  ],
  visual: {
    diagram:
      'arr = [2, 1, 5, 6, 2, 3], next greater element:\n' +
      '\n' +
      'i=0 (2): stack = [0]                       answers = [-, -, -, -, -, -]\n' +
      'i=1 (1): 1 < 2, no pop. stack = [0, 1]     answers = [-, -, -, -, -, -]\n' +
      'i=2 (5): 5 > 1 → pop 1, ans[1] = 5\n' +
      '         5 > 2 → pop 0, ans[0] = 5\n' +
      '         push 2. stack = [2]               answers = [5, 5, -, -, -, -]\n' +
      'i=3 (6): 6 > 5 → pop 2, ans[2] = 6\n' +
      '         push 3. stack = [3]               answers = [5, 5, 6, -, -, -]\n' +
      'i=4 (2): push 4. stack = [3, 4]            answers = [5, 5, 6, -, -, -]\n' +
      'i=5 (3): 3 > 2 → pop 4, ans[4] = 3\n' +
      '         push 5. stack = [3, 5]            answers = [5, 5, 6, -, 3, -]\n' +
      '\n' +
      'Leftover stack [3, 5]: ans[3] = -1, ans[5] = -1\n' +
      'Final: [5, 5, 6, -1, 3, -1]',
    caption: 'Decreasing stack: pop whenever new element beats the top. Each pop records an answer.',
  },
  approach: {
    summary:
      'Iterate left to right. While stack is non-empty and current element violates the stack invariant: pop, record the pop\'s answer as the current element. Push current. After the loop, everything still on the stack has no answer.',
    steps: [
      'Initialize empty stack (of indices) + answers array (default -1).',
      'For each element i: while stack is non-empty and arr[stack.top] < arr[i], pop top j and set answer[j] = arr[i].',
      'Push i.',
      'After the loop: leftover stack elements have no next-greater → keep the default.',
    ],
    template: {
      code:
        'def next_greater(arr):\n' +
        '    n = len(arr)\n' +
        '    ans = [-1] * n\n' +
        '    stack = []  # indices, values are decreasing\n' +
        '    for i, x in enumerate(arr):\n' +
        '        while stack and arr[stack[-1]] < x:\n' +
        '            j = stack.pop()\n' +
        '            ans[j] = x\n' +
        '        stack.append(i)\n' +
        '    return ans',
      notes: ['Decreasing stack for "next greater". Switch `<` to `>` for "next smaller".'],
    },
  },
  code: {
    python: {
      code:
        'def next_greater(arr):\n' +
        '    n = len(arr)\n' +
        '    ans = [-1] * n\n' +
        '    stack = []\n' +
        '    for i, x in enumerate(arr):\n' +
        '        while stack and arr[stack[-1]] < x:\n' +
        '            ans[stack.pop()] = x\n' +
        '        stack.append(i)\n' +
        '    return ans\n' +
        '\n' +
        'def daily_temperatures(temps):\n' +
        '    n = len(temps)\n' +
        '    ans = [0] * n\n' +
        '    stack = []\n' +
        '    for i, t in enumerate(temps):\n' +
        '        while stack and temps[stack[-1]] < t:\n' +
        '            j = stack.pop()\n' +
        '            ans[j] = i - j  # days until warmer\n' +
        '        stack.append(i)\n' +
        '    return ans',
      notes: ['Same pattern — daily_temperatures stores index difference instead of the value.'],
    },
    java: {
      code:
        'int[] nextGreater(int[] arr) {\n' +
        '    int n = arr.length;\n' +
        '    int[] ans = new int[n];\n' +
        '    java.util.Arrays.fill(ans, -1);\n' +
        '    java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();\n' +
        '    for (int i = 0; i < n; i++) {\n' +
        '        while (!stack.isEmpty() && arr[stack.peek()] < arr[i]) {\n' +
        '            ans[stack.pop()] = arr[i];\n' +
        '        }\n' +
        '        stack.push(i);\n' +
        '    }\n' +
        '    return ans;\n' +
        '}\n' +
        '\n' +
        'int[] dailyTemperatures(int[] temps) {\n' +
        '    int n = temps.length;\n' +
        '    int[] ans = new int[n];\n' +
        '    java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();\n' +
        '    for (int i = 0; i < n; i++) {\n' +
        '        while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {\n' +
        '            int j = stack.pop();\n' +
        '            ans[j] = i - j; // days until warmer\n' +
        '        }\n' +
        '        stack.push(i);\n' +
        '    }\n' +
        '    return ans;\n' +
        '}',
      notes: [
        'ArrayDeque is faster than java.util.Stack for monotonic stack.',
        'The stack holds indices (Integer), so compare through the array: arr[stack.peek()].',
      ],
    },
    cpp: {
      code:
        '#include <vector>\n' +
        '#include <stack>\n' +
        '\n' +
        'std::vector<int> next_greater(const std::vector<int>& arr) {\n' +
        '    int n = static_cast<int>(arr.size());\n' +
        '    std::vector<int> ans(n, -1);\n' +
        '    std::stack<int> st;\n' +
        '    for (int i = 0; i < n; i++) {\n' +
        '        while (!st.empty() && arr[st.top()] < arr[i]) {\n' +
        '            ans[st.top()] = arr[i];\n' +
        '            st.pop();\n' +
        '        }\n' +
        '        st.push(i);\n' +
        '    }\n' +
        '    return ans;\n' +
        '}\n' +
        '\n' +
        'std::vector<int> daily_temperatures(const std::vector<int>& temps) {\n' +
        '    int n = static_cast<int>(temps.size());\n' +
        '    std::vector<int> ans(n, 0);\n' +
        '    std::stack<int> st;\n' +
        '    for (int i = 0; i < n; i++) {\n' +
        '        while (!st.empty() && temps[st.top()] < temps[i]) {\n' +
        '            int j = st.top();\n' +
        '            st.pop();\n' +
        '            ans[j] = i - j; // days until warmer\n' +
        '        }\n' +
        '        st.push(i);\n' +
        '    }\n' +
        '    return ans;\n' +
        '}',
      notes: [
        'std::stack stores indices, not values — you need arr[j] to compare.',
        'Read st.top() before st.pop(); pop() returns void in C++.',
      ],
    },
  },
  complexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    auxiliary: 'O(n) — stack + answers',
    total: 'O(n) time, O(n) space',
    why: [
      { label: 'O(n) despite the while loop', reason: 'Every element is pushed once and popped at most once. Total operations across all iterations = 2n.' },
      { label: 'O(n) space', reason: 'The stack can hold all n elements (decreasing input). The answers array is also O(n).' },
    ],
  },
  dryRun: {
    input: 'temps = [73, 74, 75, 71, 69, 72, 76, 73]',
    initialState: 'stack = [], ans = [0, 0, 0, 0, 0, 0, 0, 0]',
    steps: [
      { step: '1', state: 'i=0 (73): stack=[0]', note: 'First element pushed.' },
      { step: '2', state: 'i=1 (74): 74>73 → pop 0, ans[0]=1-0=1. push 1. stack=[1]', note: 'Day 0 warmer tomorrow.' },
      { step: '3', state: 'i=2 (75): 75>74 → pop 1, ans[1]=1. push 2. stack=[2]', note: 'Day 1 warmer next day.' },
      { step: '4', state: 'i=3 (71): 71<75, push 3. stack=[2,3]', note: 'Cooler.' },
      { step: '5', state: 'i=4 (69): 69<71, push 4. stack=[2,3,4]', note: 'Cooler.' },
      { step: '6', state: 'i=5 (72): 72>69 → pop 4, ans[4]=1. 72>71 → pop 3, ans[3]=2. push 5. stack=[2,5]', note: 'Two elements resolved.' },
      { step: '7', state: 'i=6 (76): 76>72 → pop 5, ans[5]=1. 76>75 → pop 2, ans[2]=4. push 6. stack=[6]', note: 'Two more resolved; day 2 waited 4 days.' },
      { step: '8', state: 'i=7 (73): 73<76, push 7. stack=[6,7]', note: 'Cooler than the top, so nothing pops.' },
      { step: '9', state: 'Leftover [6,7]: ans[6]=0, ans[7]=0', note: 'No warmer day.' },
    ],
    output: 'ans = [1, 1, 4, 2, 1, 1, 0, 0]',
  },
  whenToUse: [
    'Next greater / next smaller element.',
    'Daily temperatures / warmer day.',
    'Largest rectangle in histogram.',
    'Trapping rain water.',
    'Stock span (consecutive smaller-or-equal before today).',
    'Remove k digits to form smallest number.',
    'Sliding window maximum (via monotonic deque).',
  ],
  whenNotToUse: [
    'You need sorting, not next-greater — use sort.',
    'You need all pairs — monotonic stack only finds one relation per element.',
    'You need arbitrary range queries (e.g. max of any [l, r]) — use a sparse table or segment tree.',
  ],
  mistakes: [
    { mistake: 'Pushing values instead of indices.', fix: 'Push indices — you need the original position to write the answer.' },
    { mistake: 'Wrong comparison direction.', fix: 'Next greater → while arr[top] < arr[i]. Next smaller → while arr[top] > arr[i]. Getting this backwards reverses the problem.' },
    { mistake: 'Forgetting leftovers have no answer.', fix: 'After the loop, remaining elements get the sentinel (usually -1 or 0).' },
    { mistake: 'Using strict < vs <= incorrectly.', fix: 'For "next strictly greater", use <. For "next greater or equal", use <=. With <=, later duplicates resolve earlier ones; with <, later duplicates stay unresolved.' },
  ],
  interview: {
    questions: [
      'Daily Temperatures.',
      'Next Greater Element I / II.',
      'Largest Rectangle in Histogram.',
      'Trapping Rain Water.',
      'Stock Span Problem.',
      'Remove K Digits.',
    ],
    observations: [
      'Monotonic stack is O(n) — the while loop total is bounded by n pushes + n pops.',
      'Circular next-greater uses 2n traversal with i % n.',
      'One stack run left-to-right and another right-to-left give "nearest smaller on each side" — useful for rectangles.',
    ],
    optimizations: [
      'Largest rectangle: two passes (left nearest smaller + right nearest smaller), or a single pass that computes the width when an element is popped.',
      'Sliding window maximum: monotonic deque instead of stack (remove from both ends).',
    ],
    followUps: [
      'What if duplicates matter? — use <= vs <. Choose based on the problem.',
      'What about circular arrays? — iterate 2n, use i % n.',
    ],
  },
  related: [
    { id: 'stacks-queues', relation: 'Monotonic stack is a stack with an order invariant' },
    { id: 'sliding-window', relation: 'Sliding window max uses monotonic deque' },
    { id: 'arrays', relation: 'Monotonic stack operates on arrays' },
  ],
  practice: [
    { title: 'Next Greater Element I', difficulty: 'Easy', why: 'The template.' },
    { title: 'Daily Temperatures', difficulty: 'Medium', why: 'Same pattern, store index difference instead of value.' },
    { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', why: 'Nearest smaller on both sides — two passes, or one pass computing width on pop.' },
    { title: 'Trapping Rain Water', difficulty: 'Hard', why: 'Two pointers OR monotonic stack — both O(n).' },
  ],
  revision: {
    takeaways: [
      'Monotonic stack = each element pushed once, popped once → O(n).',
      'Decreasing stack for next greater, increasing for next smaller.',
      'Store indices, not values.',
      'Leftovers have no answer.',
    ],
    formulas: [
      'while stack and arr[stack[-1]] < arr[i]: pop and record',
      'Circular: iterate 2n, use i % n',
    ],
    complexitySummary: 'O(n) time, O(n) space.',
    patterns: ['Next greater/smaller', 'Histogram', 'Daily temperatures', 'Stock span', 'Sliding window max (deque)'],
    memoryTrick: 'Stack holds unresolved elements. New element resolves them all at once.',
  },
};
