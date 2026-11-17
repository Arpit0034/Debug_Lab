import type { ConceptDetail } from '../../types';

export const backtrackingDetail: ConceptDetail = {
  id: 'backtracking',
  overview: {
    essence:
      'Recursion with a put-back. Try then recurse then undo then try next. Without the undo, state leaks into siblings.',
    what:
      'DFS over a decision tree. Commit a choice, recurse, uncommit. With pruning when partial solutions cannot lead to valid answers.',
    problemSolved:
      'Generate all combinations, permutations, or valid configurations. Exhaustive search with early termination.',
    whyImportant:
      'Every "generate all valid X" problem is backtracking. N-queens, sudoku, word search, phone combinations.',
    usedIn: [
      'Permutations, combinations, subsets',
      'N-queens, sudoku',
      'Word search, maze',
      'Generate parentheses',
      'Palindrome partitioning',
    ],
  },
  intuition: {
    explanation:
      'A maze walker with a marker. At each junction, mark the path, take a branch, walk until dead end or goal, erase the mark, back up, try next branch. The erasing is the whole trick — without it, the next branch inherits the previous one state.',
    analogy:
      'DFS plus undo. Every commit has a matching uncommit.',
  },
  internals: [
    { title: 'Decision tree', body: 'Each node is a partial solution. Each edge is a choice. Leaves are complete solutions.' },
    { title: 'Commit / undo', body: 'Every modification before the recursive call must be undone after. Use try/finally or explicit pop.' },
    { title: 'Pruning', body: 'If the current partial solution cannot lead to a valid answer, stop early. Huge speedup on constrained problems.' },
    { title: 'Duplicate handling', body: 'Sort input, then skip if a[i] == a[i-1] within the same recursion level.' },
  ],
  visual: {
    diagram:
      'backtrack(state):\n' +
      '  if goal(state): record(state); return\n' +
      '  if invalid(state): return    # prune\n' +
      '  for choice in choices:\n' +
      '      commit(choice)\n' +
      '      backtrack(state)\n' +
      '      undo(choice)             # the trick',
    caption: 'Try then recurse then undo. Prune early.',
  },
  approach: {
    summary:
      'Identify the decision tree. For each level, iterate over choices. Commit, recurse, undo. Prune when partial solution is invalid.',
    steps: [
      'Define state (partial solution).',
      'Define goal (complete and valid).',
      'For each choice: commit, recurse, undo.',
      'Add early return for invalid states.',
      'Sort input if duplicates need handling.',
    ],
    template: {
      code:
        'def backtrack(path, choices):\n' +
        '    if goal(path):\n' +
        '        result.append(path.copy()); return\n' +
        '    for i, c in enumerate(choices):\n' +
        '        path.append(c)\n' +
        '        backtrack(path, choices[i+1:])\n' +
        '        path.pop()  # undo',
    },
  },
  code: {
    python: {
      code:
        'def subsets(nums):\n' +
        '    result = []\n' +
        '    def go(start, path):\n' +
        '        result.append(path.copy())\n' +
        '        for i in range(start, len(nums)):\n' +
        '            path.append(nums[i])\n' +
        '            go(i + 1, path)\n' +
        '            path.pop()\n' +
        '    go(0, [])\n' +
        '    return result\n\n' +
        'def permute(nums):\n' +
        '    result = []\n' +
        '    def go(path, remaining):\n' +
        '        if not remaining:\n' +
        '            result.append(path.copy()); return\n' +
        '        for i, x in enumerate(remaining):\n' +
        '            go(path + [x], remaining[:i] + remaining[i+1:])\n' +
        '    go([], nums)\n' +
        '    return result',
      notes: ['Subsets: for-loop starts at start to avoid duplicates. Permutations: swap or build remaining.'],
    },
    java: {
      code:
        'List<List<Integer>> subsets(int[] nums) {\n' +
        '    List<List<Integer>> result = new ArrayList<>();\n' +
        '    go(nums, 0, new ArrayList<>(), result);\n' +
        '    return result;\n' +
        '}\n' +
        'void go(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {\n' +
        '    result.add(new ArrayList<>(path));\n' +
        '    for (int i = start; i < nums.length; i++) {\n' +
        '        path.add(nums[i]);\n' +
        '        go(nums, i + 1, path, result);\n' +
        '        path.remove(path.size() - 1);\n' +
        '    }\n' +
        '}',
      notes: ['Backtracking: always copy path on record, always undo after recursion.'],
    },
  },
  complexity: {
    best: 'O(2^n)',
    average: 'O(2^n) or O(n!)',
    worst: 'O(n!)',
    auxiliary: 'O(n) — depth of recursion',
    total: 'O(branching^depth × cost_per_leaf)',
    why: [
      { label: 'O(2^n) for subsets', reason: 'Each element is either in or out — 2^n possible subsets.' },
      { label: 'O(n!) for permutations', reason: 'First choice has n options, second n-1, etc.' },
      { label: 'O(n) auxiliary', reason: 'The recursion stack holds at most depth = n frames.' },
    ],
  },
  dryRun: {
    input: 'nums = [1, 2, 3]',
    initialState: 'result = [], path = []',
    steps: [
      { step: '1', state: 'record [] -> [[]]', note: 'Empty subset always valid.' },
      { step: '2', state: 'commit 1, record [1], commit 2, record [1,2], commit 3, record [1,2,3], undo 3', note: 'Deepest first.' },
      { step: '3', state: 'undo 2, commit 3, record [1,3], undo 3, undo 1', note: 'Backtrack up one level.' },
      { step: '4', state: 'commit 2, record [2], commit 3, record [2,3], undo, undo, commit 3, record [3]', note: 'All subsets recorded.' },
    ],
    output: '[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]',
  },
  whenToUse: [
    'Generate all subsets, permutations, combinations.',
    'Constraint satisfaction (N-queens, sudoku).',
    'Path finding with pruning.',
    'Any problem where decisions have consequences you can undo.',
  ],
  whenNotToUse: [
    'You need the optimal solution, not all — DP or greedy.',
    'The search space is too large — need a different paradigm.',
    'No undo semantics — state is immutable.',
  ],
  mistakes: [
    { mistake: 'Forgetting to undo — sibling branches inherit state.', fix: 'Every commit gets a matching undo. Use try/finally or add a clear pop after recursion.' },
    { mistake: 'Recording a reference to the mutable path.', fix: 'path.copy() / new ArrayList<>(path) on record.' },
    { mistake: 'No pruning — explores the full tree.', fix: 'Add an early return for impossible states.' },
    { mistake: 'Duplicates when input has repeated elements.', fix: 'Sort first, then skip a[i] == a[i-1] within the same loop iteration.' },
  ],
  interview: {
    questions: [
      'Subsets, permutations, combinations.',
      'N-queens / sudoku solver.',
      'Word search on a grid.',
      'Palindrome partitioning.',
      'Letter combinations of a phone number.',
    ],
    observations: [
      'The recursion tree is the problem. Draw it before coding.',
      'Pruning transforms exponential into tractable on constrained problems.',
      'Sort input first if duplicates matter.',
    ],
    optimizations: [
      'Bit-mask to track used elements instead of a set.',
      'Prune earlier — any constraint violation should return immediately.',
    ],
    followUps: [
      'What if you only need the count? — still backtracking, but no need to record.',
      'What if N is huge? — backtracking is not the answer; look for structure.',
    ],
  },
  related: [
    { id: 'recursion', relation: 'Backtracking is recursion with an explicit undo step' },
    { id: 'trees', relation: 'Backtracking is DFS over a decision tree' },
    { id: 'heaps', relation: 'Pruning often uses a heap for the next-best candidate' },
    { id: 'sorting', relation: 'Sorting enables duplicate handling in backtracking' },
  ],
  practice: [
    { title: 'Subsets', difficulty: 'Medium', why: 'The simplest backtracking tree.' },
    { title: 'Permutations', difficulty: 'Medium', why: 'Order matters; track used elements.' },
    { title: 'Combination Sum', difficulty: 'Medium', why: 'Reuse allowed — control by start index.' },
    { title: 'N-Queens', difficulty: 'Hard', why: 'Constraint pruning is everything.' },
    { title: 'Word Search', difficulty: 'Medium', why: 'Grid DFS plus visited set plus undo.' },
  ],
  revision: {
    takeaways: [
      'Try then recurse then undo.',
      'Copy state on record.',
      'Prune early.',
      'Sort input for duplicates.',
    ],
    formulas: [
      'backtrack(path): if goal then record; for choice then commit, recurse, undo',
    ],
    complexitySummary: 'O(branching^depth). Subsets O(2^n), permutations O(n!).',
    patterns: ['Generate all', 'Constraint satisfaction', 'Path finding with pruning'],
    memoryTrick: 'Commit, recurse, undo. Copy on record. Prune early.',
  },
};
