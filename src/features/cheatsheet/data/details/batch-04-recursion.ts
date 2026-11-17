import type { ConceptDetail } from '../../types';

export const recursionDetail: ConceptDetail = {
  id: 'recursion',
  overview: {
    essence:
      'Base case returns the identity of the combine step — not a fallback. f(n) = combine(f(smaller_n)) + seed.',
    what: 'A function that calls itself on strictly smaller inputs until a base case fires, then combines the answers upward.',
    problemSolved:
      'Problems whose structure is self-similar — trees, nested structures, divide-and-conquer, backtracking — decompose naturally into a recursive call on each sub-part.',
    whyImportant:
      'Recursion IS the shape of trees, graphs, and combinatorics. Writing recursive code on recursive data is often clearer and shorter than the iterative equivalent.',
    usedIn: [
      'Tree and graph traversal',
      'Divide and conquer (merge sort, quick sort)',
      'Backtracking (permutations, N-queens)',
      'Dynamic programming (memoized recursion)',
      'Self-similar math — factorial, fibonacci, height',
    ],
  },
  intuition: {
    explanation:
      'You trust that the recursive call returns the right answer for a smaller input, and you use that answer to compute the answer for your input. This is mathematical induction made executable. The base case is the "base" of the induction; the recursive step is the inductive case. The base case value must be the identity element of whatever combine step you use: 0 for +, 1 for ×, 0 for height-of-empty (the identity of `1 +`), 0 for count.',
    analogy:
      'A chain of promises. "If you can tell me f(0), I can compute f(1). If you can compute f(1), I can compute f(2)." The base case is the seed; the recursive step is the promise.',
  },
  internals: [
    { title: 'Base case', body: 'The stopping condition. Must return the IDENTITY of the combine step, not an arbitrary value.' },
    { title: 'Recursive call', body: 'Must call with a strictly smaller input. Progress toward the base case is not optional.' },
    { title: 'Combine step', body: 'The operation that turns sub-answers into the answer for this level. `1 + max(...)` for height, `left + right` for count.' },
    { title: 'Call stack', body: 'Each recursive call pushes a frame. Depth-bounded by the longest chain of calls. Deep recursion → stack overflow.' },
    { title: 'Overlapping subproblems', body: 'If two branches reach the same state, you are recomputing. That is where memoization enters (→ DP).' },
  ],
  visual: {
    diagram:
      'height(node) = 1 + max(height(left), height(right))\n' +
      '\n' +
      '     4           height(4) = 1 + max(h(2), h(6))\n' +
      '    / \\                    = 1 + max(2, 2) = 3\n' +
      '   2   6         height(2) = 1 + max(h(1), h(3))\n' +
      '  / \\ / \\                  = 1 + max(1, 1) = 2\n' +
      ' 1  3 5  7       height(1) = 1 + max(0, 0) = 1\n' +
      '\n' +
      '                 height(None) = 0   ← the seed\n' +
      '\n' +
      'Each level trusts the recursive call. Induction up the tree.',
    caption: 'Height: identity of +1 is 0. The empty tree returns 0, not 1.',
  },
  approach: {
    summary:
      'Write the base case first (with the correct identity). Then trust that the recursive call works, and combine. Test on the smallest case + one level + one more level — if those pass, the recursion is right.',
    steps: [
      'Identify the base case: what does an empty input return? (identity of the combine step)',
      'Identify the recursive step: how do I decompose input[n] into input[smaller]?',
      'Identify the combine: how do I turn child answers into this answer?',
      'Trust the recursion — do NOT trace it in your head for n > 3.',
      'Test base case + one level up. If both pass, induction covers the rest.',
    ],
    template: {
      code:
        'def recurse(state):\n' +
        '    if is_base(state):\n' +
        '        return IDENTITY\n' +
        '    sub = recurse(smaller(state))\n' +
        '    return combine(sub, state)',
      notes: ['IDENTITY must be the value that leaves combine() unchanged. height → 0, product → 1, sum → 0.'],
    },
  },
  code: {
    python: {
      code:
        '# Structural recursion: height of a tree\n' +
        'def height(node):\n' +
        '    if node is None:\n' +
        '        return 0                        # identity of "+1"\n' +
        '    return 1 + max(height(node.left), height(node.right))\n' +
        '\n' +
        '# Recursive math: factorial\n' +
        'def factorial(n):\n' +
        '    if n <= 1:\n' +
        '        return 1                        # identity of "*"\n' +
        '    return n * factorial(n - 1)\n' +
        '\n' +
        '# Divide and conquer: binary search (recursive form)\n' +
        'def binary_search(a, target, lo, hi):\n' +
        '    if lo > hi:\n' +
        '        return -1\n' +
        '    mid = lo + (hi - lo) // 2\n' +
        '    if a[mid] == target: return mid\n' +
        '    if a[mid] < target:  return binary_search(a, target, mid + 1, hi)\n' +
        '    return binary_search(a, target, lo, mid - 1)',
      notes: ['Each recursive call must strictly shrink — new argument must be smaller.'],
    },
    java: {
      code:
        'int height(TreeNode node) {\n' +
        '    if (node == null) return 0;\n' +
        '    return 1 + Math.max(height(node.left), height(node.right));\n' +
        '}\n' +
        '\n' +
        'long factorial(int n) {\n' +
        '    if (n <= 1) return 1;\n' +
        '    return n * factorial(n - 1);\n' +
        '}\n' +
        '\n' +
        'int binarySearch(int[] a, int target, int lo, int hi) {\n' +
        '    if (lo > hi) return -1;\n' +
        '    int mid = lo + (hi - lo) / 2;\n' +
        '    if (a[mid] == target) return mid;\n' +
        '    if (a[mid] < target)  return binarySearch(a, target, mid + 1, hi);\n' +
        '    return binarySearch(a, target, lo, mid - 1);\n' +
        '}',
      notes: ['Watch for integer overflow in factorial — use long. StackOverflowError on deep recursion.'],
    },
    cpp: {
      code:
        '#include <algorithm>\n' +
        '\n' +
        'int height(TreeNode* node) {\n' +
        '    if (!node) return 0;\n' +
        '    return 1 + std::max(height(node->left), height(node->right));\n' +
        '}\n' +
        '\n' +
        'long long factorial(int n) {\n' +
        '    if (n <= 1) return 1;\n' +
        '    return n * factorial(n - 1);\n' +
        '}\n' +
        '\n' +
        'int binary_search(const int* a, int target, int lo, int hi) {\n' +
        '    if (lo > hi) return -1;\n' +
        '    int mid = lo + (hi - lo) / 2;\n' +
        '    if (a[mid] == target) return mid;\n' +
        '    if (a[mid] < target)  return binary_search(a, target, mid + 1, hi);\n' +
        '    return binary_search(a, target, lo, mid - 1);\n' +
        '}',
      notes: ['Use long long for factorial. Stack space is finite — a deep chain of calls can segfault.'],
    },
  },
  languageNotes: [
    'Python recursion limit ~1000 — sys.setrecursionlimit can raise it, at the risk of stack overflow.',
    'Java default stack ~512KB — StackOverflowError on deep recursion.',
    'C++ recursion is limited by stack — no runtime check, just segfault.',
  ],
  complexity: {
    best: 'O(depth)',
    average: 'Varies — O(n) for tree recursion, O(2ⁿ) for naive Fibonacci',
    worst: 'O(branches^depth)',
    auxiliary: 'O(depth) call stack',
    total: 'Time = number of distinct states visited × work per state. Space = depth (call stack).',
    why: [
      { label: 'Time = branching × depth', reason: 'Each level fans out branching times. Without memoization, total calls = branching^depth.' },
      { label: 'Space = depth', reason: 'The call stack holds one frame per active call. Deepest chain = depth.' },
      { label: 'Two recursive calls → 2^depth', reason: 'Naive Fibonacci branches twice per level. Memoization cuts it to O(n) distinct states.' },
      { label: 'Memoized = distinct states', reason: 'With memoization, each distinct state is computed once. Total cost = #states × cost-per-state.' },
    ],
  },
  dryRun: {
    input: 'height of tree rooted at 4 (balanced, 3 levels)',
    initialState: 'height(None) = 0 (base case)',
    steps: [
      { step: '1', state: 'height(None) = 0', note: 'Base case fires at every leaf child.' },
      { step: '2', state: 'height(1) = 1 + max(0, 0) = 1', note: 'Leaf node height 1.' },
      { step: '3', state: 'height(3) = 1 + max(0, 0) = 1', note: 'Leaf.' },
      { step: '4', state: 'height(2) = 1 + max(1, 1) = 2', note: 'Internal node height 2.' },
      { step: '5', state: 'height(4) = 1 + max(2, 2) = 3', note: 'Root height 3.' },
    ],
    output: '3',
  },
  whenToUse: [
    'The problem IS recursive — trees, graphs, nested structures.',
    'Divide and conquer — split, solve, merge.',
    'Backtracking — explore + prune.',
    'Self-similar math — factorial, fibonacci, height, count.',
    'The iterative version needs an explicit stack you would have to build anyway.',
  ],
  whenNotToUse: [
    'Deep input (height > 1000) — recursion will stack overflow.',
    'Simple linear iteration — a loop is clearer and faster.',
    'Two branches on the same state — memoize (turns recursion into DP) or rewrite iteratively.',
    'Performance-critical hot path — call overhead adds up.',
  ],
  mistakes: [
    { mistake: 'Wrong base case value.', fix: 'Base case returns the IDENTITY of combine. Height → 0. Product → 1. Sum → 0. Max → −∞ (or reject empty).' },
    { mistake: 'Recursive call does not shrink the input.', fix: 'Every call must reach strictly smaller. If f(n) calls f(n), infinite loop.' },
    { mistake: 'Tracing recursion in your head for large n.', fix: 'Trust the induction. Test base + one level. That is sufficient — this is the point of structural recursion.' },
    { mistake: 'Missing memoization when two branches reach the same state.', fix: 'Add a cache keyed on the state. This turns exponential recursion into polynomial DP.' },
    { mistake: 'Passing mutable state by reference without tracking it.', fix: 'Backtracking needs explicit undo. Or pass a copy (slower but safer).' },
  ],
  interview: {
    questions: [
      'Height / diameter of a binary tree.',
      'Reverse a linked list (iterative and recursive).',
      'Merge sort — the canonical divide-and-conquer recursion.',
      'N-queens, permutations — backtracking recursion.',
      'Tower of Hanoi — pure recursive math.',
    ],
    observations: [
      'Every tree/graph traversal is structurally a recursion (even when written iteratively).',
      'The base case is the seed — wrong seed, wrong answer.',
      'Two branches on the same state → memoize → DP.',
    ],
    optimizations: [
      'Tail recursion: some languages optimise when the recursive call is the last operation. Python does not.',
      'Explicit stack for deep recursion — O(1) heap space per frame.',
      'Memoization for repeated subtrees — turns tree DP into linear.',
    ],
    followUps: [
      'What if you cannot change the recursion limit? — rewrite with an explicit stack.',
      'What if subproblems overlap? — memoize (DP).',
      'What if the tree is a chain? — iteration is safer than recursion.',
    ],
  },
  related: [
    { id: 'trees', relation: 'Trees are the canonical recursive structure' },
    { id: 'binary-search', relation: 'Binary search can be written recursively' },
    { id: 'arrays', relation: 'Recursion often operates on array subproblems' },
  ],
  practice: [
    { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', why: 'Structural recursion — the base case identity is 0.' },
    { title: 'Reverse Linked List', difficulty: 'Easy', why: 'Recursive pointer surgery — trust the recursive call returns the reversed tail.' },
    { title: 'Merge Two Sorted Lists', difficulty: 'Easy', why: 'Recursive merge — compare heads, recurse on the rest.' },
    { title: 'Pow(x, n)', difficulty: 'Medium', why: 'Fast exponentiation — divide-and-conquer recursion.' },
    { title: 'Tower of Hanoi', difficulty: 'Medium', why: 'The classic pure-recursion problem.' },
  ],
  revision: {
    takeaways: [
      'Base case = identity of combine. Wrong identity, wrong everything.',
      'Recursive call must strictly shrink the input.',
      'Two branches on the same state → memoize.',
      'Trust the induction. Test base + one level, not n.',
    ],
    formulas: [
      'height(None) = 0',
      'factorial(0) = 1',
      'sum(None) = 0',
      'f(n) = combine(f(smaller(n)), n)',
    ],
    complexitySummary: 'Time = branching^depth without memo. O(#states) with memo. Space = O(depth).',
    patterns: ['Self-similar structure', 'Divide and conquer', 'Backtracking', 'Self-similar math'],
    memoryTrick: 'Base case = identity. Call = smaller. Trust the chain. Memoize if branches overlap.',
  },
};
