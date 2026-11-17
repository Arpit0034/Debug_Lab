import type { ConceptDetail } from '../../types';

export const stacksQueuesDetail: ConceptDetail = {
  id: 'stacks-queues',
  overview: {
    essence:
      'LIFO for nesting, FIFO for breadth. Pick by which order you need to un-process — not by what feels right.',
    what:
      'Two linear collections distinguished only by retrieval order. Stack: last in, first out. Queue: first in, first out.',
    problemSolved:
      'Sequential data where the access order matters — matching pairs, undo, BFS, scheduling. An array gives you O(1) index; these give you O(1) at the operation-relevant end.',
    whyImportant:
      'Stack powers undo, bracket matching, expression evaluation, iterative DFS. Queue powers BFS, level-order, scheduling, streaming. Together they are the two simplest abstract data types and the backbone of graph traversal.',
    usedIn: [
      'Bracket matching, JSON/XML parsing',
      'Undo/redo, browser back stack',
      'Expression evaluation (postfix, infix to postfix)',
      'Iterative DFS, backtracking',
      'BFS, level-order tree traversal',
      'Task scheduling, rate limiting',
      'Sliding window maximum (monotonic deque)',
    ],
  },
  intuition: {
    explanation:
      'A stack adds and removes from the same end — like plates in a sink. A queue adds at one end and removes at the other — like a ticket line. Both are O(1) per operation at the right end. The difference is not implementation, it is what the retrieval order allows: LIFO naturally produces depth-first exploration and bracket matching; FIFO naturally produces breadth-first exploration and fair scheduling.',
    analogy:
      'Stack = plates in a sink: grab the top one. Queue = ticket line: serve the front one.',
  },
  internals: [
    { title: 'Stack operations', body: 'push(x): add to top. pop(): remove and return top. peek(): return top without removing. All O(1).' },
    { title: 'Queue operations', body: 'enqueue(x): add to back. dequeue(): remove and return front. peek(): return front. All O(1) with the right container.' },
    { title: 'Array-backed stack', body: 'push and pop on the end of a dynamic array — amortized O(1) push, O(1) pop.' },
    { title: 'Array-backed queue', body: 'naive arrays are O(n) per dequeue (shift every element). Use a circular buffer or a deque.' },
    { title: 'Deque', body: 'Double-ended queue — push/pop at both ends in O(1). Python collections.deque, Java ArrayDeque, C++ std::deque.' },
    { title: 'Recursion uses a stack', body: 'The call stack is a stack. Every recursive function is an iterative function with an explicit (or implicit) stack.' },
  ],
  visual: {
    diagram:
      'STACK (LIFO)\n' +
      '  push 1 → [1]\n' +
      '  push 2 → [1, 2]\n' +
      '  push 3 → [1, 2, 3]\n' +
      '  pop    → 3,  [1, 2]\n' +
      '  pop    → 2,  [1]\n' +
      '\n' +
      'QUEUE (FIFO)\n' +
      '  enqueue 1 → [1]\n' +
      '  enqueue 2 → [1, 2]\n' +
      '  enqueue 3 → [1, 2, 3]\n' +
      '  dequeue   → 1,  [2, 3]\n' +
      '  dequeue   → 2,  [3]\n' +
      '\n' +
      'Both: O(1) per operation at the correct end.',
    caption: 'Same operations, different retrieval order. The order determines the algorithm.',
  },
  approach: {
    summary:
      'Identify the retrieval order the problem needs. Nested structure → stack. Breadth / fairness → queue. Two-ended access → deque.',
    steps: [
      'Ask: "when I access the next element, do I want the most recent or the oldest?" Most recent → stack. Oldest → queue.',
      'If the input is nested (brackets, tags, expressions), a stack matches the innermost pair first.',
      'If the problem processes items level by level or fan-out evenly, a queue gives breadth-first order.',
      'If you need both ends, use a deque (collections.deque / ArrayDeque / std::deque).',
      'For graph BFS use a queue; for DFS use either a stack or recursion.',
    ],
    template: {
      code:
        'from collections import deque\n' +
        '\n' +
        'stack = []\n' +
        'stack.append(1)   # push\n' +
        'stack.pop()       # pop\n' +
        '\n' +
        'queue = deque()\n' +
        'queue.append(1)   # enqueue\n' +
        'queue.popleft()   # dequeue',
      notes: ['Use deque for queues — list.pop(0) is O(n).'],
    },
  },
  code: {
    python: {
      code:
        'from collections import deque\n' +
        '\n' +
        '# Valid parentheses — classic stack\n' +
        'def is_valid(s):\n' +
        '    stack = []\n' +
        '    pairs = {")": "(", "]": "[", "}": "{"}\n' +
        '    for c in s:\n' +
        '        if c in "([{":\n' +
        '            stack.append(c)\n' +
        '        else:\n' +
        '            if not stack or stack.pop() != pairs[c]:\n' +
        '                return False\n' +
        '    return not stack\n' +
        '\n' +
        '# BFS level-order — classic queue\n' +
        'def level_order(root):\n' +
        '    if root is None: return []\n' +
        '    out, q = [], deque([root])\n' +
        '    while q:\n' +
        '        level = []\n' +
        '        for _ in range(len(q)):\n' +
        '            node = q.popleft()\n' +
        '            level.append(node.val)\n' +
        '            if node.left: q.append(node.left)\n' +
        '            if node.right: q.append(node.right)\n' +
        '        out.append(level)\n' +
        '    return out',
      notes: ['Stack: list. Queue: collections.deque. list.pop(0) is O(n) — do not use for queues.'],
    },
    java: {
      code:
        'import java.util.ArrayDeque;\n' +
        'import java.util.Deque;\n' +
        '\n' +
        'boolean isValid(String s) {\n' +
        '    Deque<Character> stack = new ArrayDeque<>();\n' +
        '    for (char c : s.toCharArray()) {\n' +
        '        if (c == \'(\' || c == \'[\' || c == \'{\') {\n' +
        '            stack.push(c);\n' +
        '        } else {\n' +
        '            if (stack.isEmpty()) return false;\n' +
        '            char top = stack.pop();\n' +
        '            if ((c == \')\' && top != \'(\') ||\n' +
        '                (c == \']\' && top != \'[\') ||\n' +
        '                (c == \'}\' && top != \'{\')) return false;\n' +
        '        }\n' +
        '    }\n' +
        '    return stack.isEmpty();\n' +
        '}\n' +
        '\n' +
        '// Queue via ArrayDeque (add/poll)\n' +
        'Deque<TreeNode> q = new ArrayDeque<>();\n' +
        'q.add(root);\n' +
        'while (!q.isEmpty()) {\n' +
        '    TreeNode n = q.poll();\n' +
        '    // process n\n' +
        '    if (n.left != null) q.add(n.left);\n' +
        '    if (n.right != null) q.add(n.right);\n' +
        '}',
      notes: ['ArrayDeque handles both stack and queue — faster than Stack and LinkedList.'],
    },
    cpp: {
      code:
        '#include <stack>\n' +
        '#include <queue>\n' +
        '#include <deque>\n' +
        '#include <string>\n' +
        '\n' +
        'bool is_valid(const std::string& s) {\n' +
        '    std::stack<char> st;\n' +
        '    for (char c : s) {\n' +
        '        if (c == \'(\' || c == \'[\' || c == \'{\') st.push(c);\n' +
        '        else {\n' +
        '            if (st.empty()) return false;\n' +
        '            char top = st.top(); st.pop();\n' +
        '            if ((c == \')\' && top != \'(\') ||\n' +
        '                (c == \']\' && top != \'[\') ||\n' +
        '                (c == \'}\' && top != \'{\')) return false;\n' +
        '        }\n' +
        '    }\n' +
        '    return st.empty();\n' +
        '}\n' +
        '\n' +
        '// Queue via std::queue (defaults to std::deque)\n' +
        'std::queue<TreeNode*> q;\n' +
        'q.push(root);\n' +
        'while (!q.empty()) {\n' +
        '    TreeNode* n = q.front(); q.pop();\n' +
        '    if (n->left) q.push(n->left);\n' +
        '    if (n->right) q.push(n->right);\n' +
        '}',
      notes: ['std::stack, std::queue, std::deque are all container adapters with O(1) core ops.'],
    },
  },
  languageNotes: [
    'Python: use collections.deque for queues. list.pop(0) shifts every element — O(n).',
    'Java: prefer ArrayDeque. Stack is legacy (synchronized, slower).',
    'C++: std::stack and std::queue default to std::deque underneath — O(1) push/pop.',
    'All three languages: the call stack behind recursion is a stack. Deep recursion = deep stack.',
  ],
  complexity: {
    best: 'O(1) per operation',
    average: 'O(1) per operation',
    worst: 'O(1) per operation (with the right container)',
    auxiliary: 'O(n) — one slot per element',
    total: 'O(n) to process n elements',
    why: [
      { label: 'O(1) push/pop', reason: 'With a dynamic array (stack) or circular buffer (queue), the operation only touches the ends. No shifting.' },
      { label: 'O(n) search', reason: 'Finding an arbitrary element requires scanning. Use a hash map alongside the stack if you need O(1) lookups.' },
      { label: 'O(1) amortized push', reason: 'Dynamic arrays double capacity on overflow. n pushes = O(n) total, amortized O(1) each.' },
    ],
  },
  dryRun: {
    input: 's = "{[()]}"',
    initialState: 'stack = []',
    steps: [
      { step: '1', state: 'c = "{" → push. stack = ["{"]', note: 'Opening bracket.' },
      { step: '2', state: 'c = "[" → push. stack = ["{", "["]', note: 'Opening.' },
      { step: '3', state: 'c = "(" → push. stack = ["{", "[", "("]', note: 'Opening.' },
      { step: '4', state: 'c = ")" → pop "(" matches. stack = ["{", "["]', note: 'Closing matches top.' },
      { step: '5', state: 'c = "]" → pop "[" matches. stack = ["{"]', note: 'Closing matches top.' },
      { step: '6', state: 'c = "}" → pop "{" matches. stack = []', note: 'Closing matches top.' },
      { step: '7', state: 'stack empty → return true', note: 'All matched.' },
    ],
    output: 'true',
  },
  whenToUse: [
    'Nested / paired structure — brackets, tags, function calls.',
    'Undo/redo — push actions, pop to undo.',
    'Expression evaluation — postfix evaluation, infix → postfix.',
    'Iterative DFS — stack replaces the recursion call stack.',
    'BFS / level-order — queue.',
    'Scheduling — queue for FIFO, priority queue for weighted scheduling.',
    'Sliding window max — monotonic deque.',
  ],
  whenNotToUse: [
    'You need random access by index — use an array.',
    'You need O(1) search by value — use a hash map.',
    'You need sorted order — use a balanced tree or heap.',
    'You need to insert/delete in the middle — a linked list or tree.',
  ],
  mistakes: [
    { mistake: 'Using list.pop(0) as a queue in Python.', fix: 'It shifts every element — O(n). Use collections.deque.popleft().' },
    { mistake: 'Forgetting to check emptiness before pop.', fix: 'pop() on empty stack raises IndexError / EmptyStackException. Guard with if stack: / !isEmpty().' },
    { mistake: 'Wrong end for the wrong operation.', fix: 'Stack: push/pop at top. Queue: enqueue at back, dequeue at front. Using the wrong end breaks the retrieval order.' },
    { mistake: 'Assuming a Stack class in Java is fast.', fix: 'java.util.Stack extends Vector and is synchronized. Use ArrayDeque for both stack and queue.' },
    { mistake: 'Using a stack for BFS.', fix: 'Stack gives DFS. BFS needs a queue — the order of visiting neighbors matters.' },
  ],
  interview: {
    questions: [
      'Valid parentheses — the classic stack problem.',
      'Min stack — support push/pop/top/getMin all in O(1).',
      'Sliding window maximum — monotonic deque.',
      'Evaluate reverse Polish notation — stack.',
      'Implement queue using two stacks.',
      'Daily temperatures — monotonic stack.',
    ],
    observations: [
      'Any problem with "matching pairs" or "nested" is a stack problem.',
      'Any problem with "level by level" or "shortest unweighted path" is a queue problem.',
      'A stack can simulate a queue (two stacks) and vice versa (two queues).',
      'Monotonic stack / deque is the "next greater / smaller" pattern — the stack maintains sorted order.',
    ],
    optimizations: [
      'Min stack: store pairs (value, current_min) or use a second parallel stack.',
      'Monotonic stack: each element is pushed once and popped once → O(n).',
      'Sliding window max: monotonic deque stores indices in decreasing value order.',
    ],
    followUps: [
      'What if the stack has to support O(1) min? — store running minimum alongside each element.',
      'What if you need both ends? — deque.',
      'What if you need priority ordering? — heap / priority queue.',
    ],
  },
  related: [
    { id: 'arrays', relation: 'Both are built on arrays (or linked nodes)' },
    { id: 'trees', relation: 'Level-order traversal is BFS with a queue' },
    { id: 'recursion', relation: 'The call stack is a stack — every recursion is iteration + stack' },
  ],
  practice: [
    { title: 'Valid Parentheses', difficulty: 'Easy', why: 'The canonical stack problem.' },
    { title: 'Min Stack', difficulty: 'Medium', why: 'O(1) min via parallel stack or (val, min) pairs.' },
    { title: 'Daily Temperatures', difficulty: 'Medium', why: 'Monotonic stack — next greater element.' },
    { title: 'Sliding Window Maximum', difficulty: 'Hard', why: 'Monotonic deque — the deque stores decreasing values.' },
    { title: 'Implement Queue using Stacks', difficulty: 'Easy', why: 'Two stacks simulate FIFO.' },
    { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', why: 'Queue-based BFS.' },
  ],
  revision: {
    takeaways: [
      'LIFO for nesting, undo, DFS, expression evaluation.',
      'FIFO for BFS, level-order, scheduling, sliding windows.',
      'O(1) per operation at the correct end.',
      'Deque: O(1) at both ends — for monotonic windows.',
    ],
    formulas: [
      'Stack: push(x) → add at end; pop() → remove from end',
      'Queue: enqueue(x) → add at end; dequeue() → remove from front',
      'Deque: push/pop at both ends, O(1)',
    ],
    complexitySummary:
      'O(1) per stack/queue operation. O(n) space for n elements. O(1) amortized push on dynamic-array stacks.',
    patterns: ['Nested matching', 'Undo/redo', 'BFS level-order', 'Monotonic stack/deque', 'Sliding window max'],
    memoryTrick:
      'Stack = plates in a sink. Queue = ticket line. Deque = both ends, O(1).',
  },
};
